const express = require("express");
const app = express();
const connectToDb = require("./config/db");
connectToDb();
const USER = require("./models/userModel");
app.use(express.json());
const bcrypt = require("bcrypt");
const router = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const { verifyRouteByJWT } = require("./config/jwt");
require("dotenv").config();
const PORT = process.env.PORT;

const jwt = require("jsonwebtoken");
app.use("/api/auth", router); //Login-Signup Routes
app.use("/api/users", verifyRouteByJWT, userRouter); //User Routes
app.use("/api/appointments", verifyRouteByJWT, appointmentRoutes); //Appointment Routes
app.use("/api/doctor", verifyRouteByJWT, doctorRoutes); ///Doctor Routes

app.listen(PORT, () => console.log("Server running on Port", PORT));
