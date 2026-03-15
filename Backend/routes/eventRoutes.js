const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  checkRegistration,
  getStudentRegistrations,
  cancelRegistration
} = require("../controllers/eventController");


router.get("/", getEvents);

router.post("/create", adminAuth, createEvent);

router.get("/:id", getEventById);

router.post("/register/:eventId", registerForEvent);

router.get("/check-registration/:eventId/:studentId", checkRegistration);

router.get("/student-registrations/:studentId", getStudentRegistrations);

router.delete("/cancel-registration/:studentId/:eventId", cancelRegistration);

module.exports = router;