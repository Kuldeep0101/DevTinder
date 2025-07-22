const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected To MongoDB");
  } catch (error) {
    console.log(`MongoDB Connection Failed , ${error}`);
    process.exit(1);
  }
};

module.exports = connectToDb;
