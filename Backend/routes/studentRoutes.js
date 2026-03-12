const express = require("express");
const router = express.Router();

const {
  getStudentProfile,
  completeProfile,
} = require("../controllers/studentController");


// GET student profile
router.get("/:studentId", getStudentProfile);

// COMPLETE profile
router.put("/complete-profile/:studentId", completeProfile);

module.exports = router;