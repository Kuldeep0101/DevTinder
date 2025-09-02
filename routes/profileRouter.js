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
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      "internal server Error": error.message,
    });
  }
});

//Edit Profile (Can not Update Email and Password)
profileRouter.patch("/profile/edit", verifyRoute, async (req, res) => {
  try {
    checkUserInput(req);

    if (!validateProfileEditData(req)) {
      throw new Error(`Can not update the restricted fields`);
    }

    const updatedData = req.body;
    const userId = req.user._id;
    const data = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });
    // console.log(data);

    res.status(200).json({
      messgae: `Profile updated successfully`,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(`${error.message}`);
  }
});

//Forgot Password (Change Password)
profileRouter.patch("/profile/password", verifyRoute, async (req, res) => {
  try {
    isValidPasswordData(req);
    const { password } = req.body;
    const newHashedPassword = await bcrypt.hash(password, 10);
    const updatedUserPW = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: newHashedPassword,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: `${updatedUserPW.firstName}, Your Password has been Updated Successfully `,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error While Updating User Password",
      data: error.message,
    });
  }
});

module.exports = profileRouter;
