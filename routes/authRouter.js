const express = require("express");
const validator = require("validator");
const { User } = require("../src/models/user");
const { verifyRoute } = require("../middleware/verifyRoute");
const bcrypt = require("bcrypt");
const {
  validateSignupData,
  validateLoginData,
} = require("../src/utils/validation.js");

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
        password // pre save hook hashes it and saved to DB
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

    const user = await User.findOne({
      emailId,
    });
    if (!user || user === null) {
      throw new Error("No User Found");
    }

    const storedPassword = user.password;
    const isMatchedPassword = await bcrypt.compare(password, storedPassword); // Changed: compare plain with hash
    if (isMatchedPassword) {
      const jwtToken = await user.getJWT();
      res.cookie("token", jwtToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); //Token expires in 30 min
      res.status(200).send(`Hey There ${user.firstName}`);
    } else {
      throw new Error("Invalid Credentials"); // Fixed typo "Credetials" to "Credentials"
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "Error while logging in": error.message,
    });
  }
});


//Logout Route
authRouter.post("/logout", async (req, res) => {
  try {
    const token = req.cookies;
    res.clearCookie("token");
    res.status(200).json({
      suceess: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "Error While logging out": error.message,
    });
  }
});

module.exports = authRouter;
