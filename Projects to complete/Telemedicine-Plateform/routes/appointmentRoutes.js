const express = require("express");
const mongoose = require("mongoose");
const { verifyRouteByJWT } = require("../config/jwt");
const router = express();
const APPOINTMENT = require("../models/Appointments");
const { isAdmin, isDoctor, isPatient } = require("../config/roleMiddleware");

//Create new Appointment
router.post("/", isPatient, async (req, res) => {
  try {
    const { doctorId, date, status, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid Doctor Id" });
    }
    const appointment = await APPOINTMENT.create({
      patientId: req.user.userId,
      doctorId,
      date,
      status,
      notes: notes || "",
    });
    return res
      .status(202)
      .json({ "Appointment Booked Succeccfully": appointment });
  } catch (error) {
    console.log(`Error While Booking Appointment ${error.message}`);
    res.status(500).json({ "Error While Booking Appointment": error.message });
  }
});

//Find all appointment of logged in user
router.get("/", verifyRouteByJWT, async (req, res) => {
  try {
    const providedId = req.user.userId;
    const role = req.user.role;

    // Find appointments where user is either patient OR doctor
    const appointments = await APPOINTMENT.find({
      $or: [{ patientId: providedId }, { doctorId: providedId }],
    })
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization");

    if (!appointments.length) {
      return res.status(200).json({ message: "No appointment found" });
    }

    res.status(200).json({ message: "Your Appointments", data: appointments });
  } catch (error) {
    console.error("fetch error", error.message);
    return res.status(500).json({
      error: "Failed to fetch Appointments ",
      details: "internal Server error", // Generic message for clients
    });
  }
});

//Update Appointment Data

router.patch("/:id", isDoctor, async (req, res) => {
  try {
    const providedId = req.params.id;
    const data = req.body;
    const isValidUser = await APPOINTMENT.findByIdAndUpdate(providedId, data, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ message: "Status Updated", data: isValidUser });
  } catch (error) {
    console.error("fetch error", error.message);
    return res.status(500).json({
      error: "Failed to fetch Appointments ",
      details: "internal Server error", // Generic message for clients
    });
  }
});

//Cancel Appointment data
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const providedId = req.user.userId;
    const isValidIdUser = await APPOINTMENT.findByIdAndDelete(providedId);
    res.status(200).json({
      message: "Appointment Cancelled Successfully",
      data: isValidIdUser.userId,
    });
  } catch (error) {
    console.log(`error while cancelling the Appointment => ${error.message``}`);
    res
      .status(500)
      .json({ "Error while appointment Cancellation": error.message });
  }
});

module.exports = router;
