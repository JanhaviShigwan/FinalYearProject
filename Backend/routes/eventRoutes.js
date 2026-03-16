const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  checkRegistration,
  getStudentRegistrations,
  cancelRegistration
} = require("../controllers/eventController");


// ── specific paths first, generic /:id last ──────────────────────────────
router.get("/", getEvents);

router.post("/create", adminAuth, createEvent);

router.post("/register/:eventId", registerForEvent);

router.get("/check-registration/:eventId/:studentId", checkRegistration);

router.get("/student-registrations/:studentId", getStudentRegistrations);

router.delete("/cancel-registration/:studentId/:eventId", cancelRegistration);

// generic /:id routes come last so they don't shadow the routes above
router.patch("/:id", adminAuth, updateEvent);

router.delete("/:id", adminAuth, deleteEvent);

router.get("/:id", getEventById);

module.exports = router;