const express = require("express");
const bcrypt = require("bcrypt");
const { connectToDb } = require("./config/database");
const app = express();

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../routes/authRouter");
const connectionRequestRouter = require("../routes/connectionReqRouter");
const profileRouter = require("../routes/profileRouter");

connectToDb()
  .then(() => {
    console.log(`Connected to DB`);
    app.listen(7000, () => console.log("Server is running on Port 7000"));
  })
  .catch((err) => {
    console.log(`Error While connecting to db`, err);
  });

app.use("/", authRouter);
app.use("/", connectionRequestRouter);
app.use("/", profileRouter);
