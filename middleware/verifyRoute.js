const express = require("express");
const cookieParser = require("cookie-parser");
const app = express(); // This is the 'app'
app.use(cookieParser()); // Using middleware on the app instance
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SecretKey = process.env.SecretKey;
const { User } = require("../src/models/user");



const verifyRoute = async function (req, res, next) {
  //Read the token from req.cookie
  try {
    const { token } = req.cookies;
    console.log(token)
    if (!token || token.length === 0) {
      return res.status(401).send("Please Login")
    }

    const verifyToken = await jwt.verify(token, SecretKey);
    if (!verifyToken) {
      throw new Error("No User ID Found, Please Login again");
    }
    //find the user
    const userId = verifyToken._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("No user Found,  Please Login again");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);

    res.status(400).send({ "Internal Server Error": error.message });
  }
};

module.exports = { verifyRoute };
