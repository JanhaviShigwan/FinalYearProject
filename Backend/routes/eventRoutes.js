const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent
} = require("../controllers/eventController");

/* =========================
   GET ALL EVENTS
   GET /api/events
========================= */
router.get("/", getEvents);


/* =========================
   GET SINGLE EVENT
   GET /api/events/:id
========================= */
router.get("/:id", getEventById);


/* =========================
   CREATE NEW EVENT
   POST /api/events
========================= */
router.post("/", createEvent);


module.exports = router;