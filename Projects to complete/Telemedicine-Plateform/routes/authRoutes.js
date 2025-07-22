const express = require("express");
const bcrypt = require("bcrypt");
const router = express();
const USER = require("../models/userModel");
const { generateToken, verifyToken } = require("../config/jwt");

//Sign-up Route
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);
    data.password = hashedPassword;
    const newUser = new USER(data);
    const response = await newUser.save();
    res.status(202).json({ "User Signed-up": response });
  } catch (error) {
    console.log("Error during Signup", error);
    res.status(500).json({ "Error during Signup": error.message });
  }
});

//Log-in Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Enter email and password");
    }
    console.log(email, password);
    const isValidUser = await USER.findOne({ email: email });
    console.log("is valid User", isValidUser.id);
    const isValidPassword = bcrypt.compareSync(password, isValidUser.password);
    console.log(isValidPassword);
    if (!isValidUser || !isValidPassword) {
      return res.status(404).json("Email or Password Not Found");
    } else {
      const userId = isValidUser.id;
      const role = isValidUser.role;
      const token = await generateToken(userId, role);
      console.log(token);
      return res
        .status(200)
        .json({ "Token is =>": token, "User Logged In": isValidUser });
    }
  } catch (error) {
    console.log({ "error while logging in": error });
    return res.status(400).json({ "error while logging in": error.message });
  }
});

module.exports = router;
