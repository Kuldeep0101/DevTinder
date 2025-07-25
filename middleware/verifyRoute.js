const jwt = require("jsonwebtoken");
require("dotenv").config();
const SecretKey = process.env.SecretKey;
const cookieParser = require("cookie-parser");
const { User } = require("../src/models/user");

const verifyRoute = async function (req, res, next) {
  //Read the token from req.cookie
  try {
    // const { Token } = req.cookies;
    const Token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODdiMjM2MDJiM2JkYzM1ZTQzODJhZjYiLCJpYXQiOjE3NTMwNzI2MjksImV4cCI6MTc1MzY3NzQyOX0.Ze7tzJ2Q7uoSlrBJ4UqW7jznDg9V2Ho-23To791YOrs";
    //validate the token
    if (!Token || Token.length === 0) {
      throw new Error("No Token Found, Please Login again");
    }

    const verifyToken = await jwt.verify(Token, SecretKey);
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
