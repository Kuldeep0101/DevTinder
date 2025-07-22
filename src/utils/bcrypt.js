const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const app = express();
app.use(express.json());

const hashedPassword = async function (req) {
  const data = req.body;
  const plainPassword = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  const user = new User(data);
  user.password = hashedPassword;
  console.log(user);
};


module.exports = { hashedPassword,  };
