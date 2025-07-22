require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.mongoURI;

const connectToDb = async () => {
  await mongoose.connect(mongoURI);
};

module.exports = { connectToDb };
