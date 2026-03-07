const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent
} = require("../controllers/eventController");

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post("/create", createEvent);

module.exports = router;