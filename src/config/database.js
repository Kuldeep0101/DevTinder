const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.mongoURI;

const connectToDb = async () => {
  await mongoose.connect(mongoURI);
};

module.exports =connectToDb ;
