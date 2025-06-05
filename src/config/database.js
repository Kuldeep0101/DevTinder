const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://kennyS007:NamasteNodeJS@namastenodejs.ivbnbur.mongodb.net/DevTinder";

const connectToDb = async () => {
  await mongoose.connect(mongoURI);
};

module.exports = { connectToDb };
