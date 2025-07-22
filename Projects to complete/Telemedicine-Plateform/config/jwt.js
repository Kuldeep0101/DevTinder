const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SecretKey;

const generateToken = async function (userId, role) {
  return jwt.sign({ userId, role }, secretKey, {
    expiresIn: "12 hour",
  });
};

const verifyRouteByJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ "Error in Verifying JWT Token": error.message });
  }
};

module.exports = { generateToken, verifyRouteByJWT };
