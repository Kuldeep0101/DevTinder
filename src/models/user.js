const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,

      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      // validate: {
      //   validator: function(value) {
      //     if (!["male", "female", "others"].includes(value)) {
      //       throw new Error("Gender Data is not Valid");
      //     }
      //   },
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/v2/D4D03AQEdHAzKVRCM8g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1697706616770?e=1754524800&v=beta&t=K2abUcmanPsitagqzDV5cIRcLqoHt1xGQ0fcBvAAGcE",
    },
    about: {
      type: String,
      default: "This is the defaut About of the User",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
