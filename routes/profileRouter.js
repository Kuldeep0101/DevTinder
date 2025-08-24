const express = require("express");
const bcrypt = require("bcrypt");
const { verifyRoute } = require("../middleware/verifyRoute");
const { User } = require("../src/models/user");
const {
  checkUserInput,
  validateProfileEditData,
  isValidPasswordData,
} = require("../src/utils/validation");
const profileRouter = express.Router();

//View User Profile
profileRouter.get("/profile/view", verifyRoute, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(`Hello ${user.firstName}  ${user.lastName}`);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "internal server Error": error.message,
    });
  }
});

//Edit Profile (Can not Update Email and Password)
profileRouter.patch("/profile/edit", verifyRoute, async (req, res) => {
  console.log(req.body);
  try {
    checkUserInput(req);

    if (!validateProfileEditData(req)) {
      throw new Error(`Can not update the restricted fields`);
    }

    const updatedData = req.body;
    const userId = req.user._id;
    const update = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    res.status(200).send({
      "User Data Updated": update,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      "Error while updating the user data": error.message,
    });
  }
});

//Forgot Password (Change Password)
profileRouter.patch("/profile/password", verifyRoute, async (req, res) => {
  try {
    isValidPasswordData(req);
    const password = req.body.password;
    const newHashedPassword = await bcrypt.hash(password, 10);
    const updatedUserPW = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: newHashedPassword,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: `${updatedUserPW.firstName}, Your Password has been Updated Successfully to- ${password}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error While Updating User Password",
      data: error.message,
    });
  }
});

module.exports = profileRouter;
