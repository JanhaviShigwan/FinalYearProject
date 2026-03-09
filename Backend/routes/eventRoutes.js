const express = require("express");
const router = express.Router();

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

router.post("/create", createEvent);

router.get("/:id", getEventById);

router.post("/register/:eventId", registerForEvent);

router.get("/check-registration/:eventId/:studentId", checkRegistration);

router.get("/student-registrations/:studentId", getStudentRegistrations);

router.delete("/cancel-registration/:studentId/:eventId", cancelRegistration);

module.exports = router;