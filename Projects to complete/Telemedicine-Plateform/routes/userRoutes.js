const express = require("express");
const router = express();
const USER = require("../models/userModel");
const { generateToken, verifyRouteByJWT } = require("../config/jwt");

//Get Current User
router.get("/me", async (req, res) => {
  try {
    const currentUser = await USER.findById(req.user.userId);
    res.status(200).json({ "Welcome User": currentUser });
  } catch (error) {
    console.log("Error during getting User Data", error);
    return res.status(500).json(error.message);
  }
});

//Update User Details
router.patch("/me", async (req, res) => {
  try {
    const data = req.body;
    const updatedData = await USER.findByIdAndUpdate(req.user.userId, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ "Data Updated Successfully": updatedData });
  } catch (error) {
    res.status(500).json({ "Error While Updating data": error.message });
  }
});

//Delete User Account
router.delete("/me", async (req, res) => {
  try {
    const deleteAccount = await USER.findByIdAndDelete(req.user.userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {}
});
module.exports = router;
