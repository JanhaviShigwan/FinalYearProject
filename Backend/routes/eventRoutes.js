const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent
} = require("../controllers/eventController");


router.get("/", getEvents);

router.post("/create", createEvent);

router.get("/:id", getEventById);

module.exports = router;