const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SecretKey = process.env.SecretKey;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validator: {
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Please Enter Valid email Address:" + value);
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Please Enter Strong Password");
          }
        },
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      message: `{VALUE} is not Valid Gender Type`,
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please Enter Valid Image URL");
        }
      },
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next(); // tells mongoose to continue with saving
});

userSchema.methods.getJWT = async function () {
  const user = this; //this refers to the user who has been find in login route (check login route)
  const token = await jwt.sign({ _id: user._id }, SecretKey, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.compareHashedPassword = async function (password) {
  const user = this;
  const savedPassword = user.password;
  const compareHashedPassword = await bcrypt.compare(password, savedPassword);
  return compareHashedPassword;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
