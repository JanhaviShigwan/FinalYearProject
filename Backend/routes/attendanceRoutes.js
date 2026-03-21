const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { markAttendance, getEventRegistrations } = require("../controllers/attendanceController");

// Mark attendance (admin only — scanner page posts here)
router.post("/mark", adminAuth, markAttendance);

// Get all registrations with attendance status (admin only)
router.get("/registrations", adminAuth, getEventRegistrations);

module.exports = router;
