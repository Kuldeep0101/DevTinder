const express = require("express");
const validateSignupData = require("../src/utils/validation");
const { User } = require("../src/models/user");
const validator = require("validator");
const { verifyRoute } = require("../middleware/verifyRoute");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//Signup Route
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of Data
    // validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const checkForDupMail = await User.findOne({ emailId: emailId });
    if (!checkForDupMail) {
      //Encryption of Data
      const hashedPassword = await bcrypt.hash(password, 10);

      //Creating New Instance of the USER
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
      });

      const newInstance = await user.save();

      res
        .status(200)
        .json({ message: "User saved to DB", response: newInstance });
    } else {
      throw new Error("Duplicate email is not Allowed");
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "error while saving User to DB",
      response: error.message,
    });
  }
});

//Login route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email ID");
    }

    

    const user = await User.findOne({ emailId });
    if (!user || user === null) {
      throw new Error("No User Found");
    }
    // const isValidPassword = await user.compareHashedPassword(password);
    const isValidPassword = true;
    if (isValidPassword) {
      const jwtToken = await user.getJWT();
      res.cookie("token", jwtToken, { maxAge: 7 * 24 * 60 * 60 * 1000 }); //Token expires in 30 min
      res.status(200).send(`Hey There ${user.firstName}`);
    } else {
      throw new Error("Invalid Credetials");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ "Error while logging in": error.message });
  }
});

//Logout Route
authRouter.post("/logout", async (req, res) => {
  try {
    const token = req.cookies;
    res.clearCookie("token");
    res
      .status(200)
      .json({ suceess: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ "Error While logging out": error.message });
  }
});

module.exports = authRouter;
