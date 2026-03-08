const express = require("express");
const router = express.Router();
const {
  getStudentProfile,
  completeProfile
} = require("../controllers/studentController");

// Get student profile
router.get("/:studentId", getStudentProfile);

// Complete profile
router.put("/complete-profile/:studentId", completeProfile);

module.exports = router;