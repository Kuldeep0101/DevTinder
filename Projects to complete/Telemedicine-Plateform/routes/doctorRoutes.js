const express = require("express");
const { isDoctor } = require("../config/roleMiddleware");
const { verifyRouteByJWT } = require("../config/jwt");
const APPOINTMENT = require("../models/Appointments");
const router = express();

//Doctor's appointments
router.get("/appointments", verifyRouteByJWT, isDoctor, async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const appointments = await APPOINTMENT.find({
      doctorId,
    })
      .populate("patientId", "name email phone") // Include patient details
      .sort({
        date: 1,
      });
    if (!appointments.length) {
      return res.status(200).json({
        message: "No Appointment Found",
      });
    }
    res.status(200).json({
      success: true,
      length: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.log(`Error while finding appointments  ${error.message}`);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
});

//Doctors Patient
router.get("/patients", verifyRouteByJWT, isDoctor, async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const appointments = await APPOINTMENT.find({ doctorId })
      .populate("patientId", "name email")
      .sort({ date: -1 });

    if (!appointments.length) {
      return res.status(200).json({
        success: true,
        message: "No patients found for this doctor.",
      });
    }

    const patients = [];
    const patientIds = new Set();

    appointments.forEach((appointment) => {
      if (
        appointment.patientId && // <-- Fix: Use `patientId` (not `patient`)
        !patientIds.has(appointment.patientId._id.toString())
      ) {
        patientIds.add(appointment.patientId._id.toString());
        patients.push(appointment.patientId);
      }
    });

    res.status(200).json({
      success: true,
      length: patients.length, // Consistency: Add `length` like in `/appointments`
      data: patients, // Consistency: Use `data` instead of `patients`
    });
  } catch (error) {
    console.error(`Error fetching doctor's patients: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
