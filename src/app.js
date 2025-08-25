const express = require("express");
const bcrypt = require("bcrypt");
const connectToDb  = require("./config/database");
const app = express();
require('dotenv').config()

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../routes/authRouter");
const connectionRequestRouter = require("../routes/connectionReqRouter");
const profileRouter = require("../routes/profileRouter");
const userRouter= require('../routes/userRouter')

const PORT = process.env.PORT

connectToDb()
  .then(() => {
    console.log(`Connected to DB`);
    app.listen(7000, () => console.log(`Server is running on Port: ${PORT}`));
  })
  .catch((err) => {
    console.log(`Error While connecting to db`, err.message);
  });

app.use("/", authRouter);
app.use("/", connectionRequestRouter);
app.use("/", profileRouter);
app.use("/", userRouter)
