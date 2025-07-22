const express = require("express");
const { verifyRouteByJWT } = require("../config/jwt");
const { isAdmin } = require("../config/roleMiddleware");
const router = express();
const userModel = require("../models/userModel");

//List all users
