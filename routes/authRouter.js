const express = require("express");
const { User } = require("../src/models/user");
const bcrypt = require("bcrypt");
const {
  validateSignupData,
  validateLoginData,
} = require("../src/utils/validation.js");
const { updateSearchIndex } = require("../src/models/connectionReqSchema.js");
const authRouter = express.Router();

//Signup Route
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of Data
    const errors = validateSignupData(req);
    if (errors.length > 0) {
      // Return early with all validation errors
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { firstName, lastName, emailId, password } = req.body;
    const checkForDupMail = await User.findOne({
      emailId: emailId,
    });
    if (!checkForDupMail || !checkForDupMail === null) {
      // Creating New Instance of the USER
      const user = new User({
        firstName,
        lastName,
        emailId,
        password, // pre save hook hashes it and saved to DB
      });

      const newInstance = await user.save();
      res.status(200).json({
        message: "User saved to DB",
        response: newInstance,
      });
    } else {
      throw new Error("Duplicate email is not Allowed");
    }
  } catch (error) {
    res.status(500).json({
      message: "error while saving User to DB",
      response: error.message,
    });
  }
});

//login route
authRouter.post("/login", async (req, res) => {
  try {
    const errors = validateLoginData(req);
    if (errors.length > 0) {
      return res
        .status(500)
        .json({ message: "Login Validation Failed", errors });
    }

    const { emailId, password } = req.body;

    const userFoundInDB = await User.findOne({
      emailId,
    });
    if (!userFoundInDB) {
      throw new Error(`User with Emailid ${emailId} not found`);
    }
    const isMatchedPassword = await userFoundInDB.compareHashedPassword; //Using method which was defined in Schema to check hashed password, we call it on the userFoundInDB we found in DB
    if (isMatchedPassword) {
      const jwtToken = await userFoundInDB.getJWT();
      res.cookie("token", jwtToken, {
        httpOnly: true, // prevents XSS
        // secure: true, // HTTPS only
        sameSite: "strict", // CSRF protection
        maxAge: 604800000, // 7 days in ms
      }); //Token expires in 30 min
      res.status(200).send(`Hey There ${userFoundInDB.firstName}`);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "Error while logging in": error.message,
    });
  }
});

//Logout Route
authRouter.post("/logout", (req, res) => {
  try {
  
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No logged-in user found" });
    }
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = authRouter;
