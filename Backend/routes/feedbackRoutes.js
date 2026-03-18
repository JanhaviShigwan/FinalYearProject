const express = require("express");
const router = express.Router();

const {
  saveFeedback,
  updateFeedback,
  getFeedbackByUser,
  getFeedbackByEvent,
  getEventFeedbackSummary,
} = require("../controllers/feedbackController");

// Specific paths must come before the generic /:eventId/:userId
router.post("/", saveFeedback);
router.patch("/:eventId/:userId", updateFeedback);
router.get("/summary/:eventId", getEventFeedbackSummary);
router.get("/event/:eventId", getFeedbackByEvent);
router.get("/:eventId/:userId", getFeedbackByUser);

module.exports = router;
