const Feedback = require("../Models/Feedback");
const Registration = require("../Models/Registration");
const Event = require("../Models/Event");
const { generateFeedbackSummary } = require("../utils/aiSummary");

// ── helpers ──────────────────────────────────────────────────────────────────

const parseEventTime = (timeValue) => {
  if (!timeValue || typeof timeValue !== "string") return null;

  const twelveHourMatch = timeValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    let hour = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return { hours: hour, minutes: minute };
  }

  const twentyFourHourMatch = timeValue.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    return {
      hours: Number(twentyFourHourMatch[1]),
      minutes: Number(twentyFourHourMatch[2]),
    };
  }

  return null;
};

const buildEventDateTime = (dateValue, timeValue, useEndOfDayWhenNoTime = false) => {
  if (!dateValue) return null;

  const dateOnly =
    typeof dateValue === "string"
      ? new Date(`${dateValue}T00:00:00`)
      : new Date(dateValue);

  const baseDate = Number.isNaN(dateOnly.getTime()) ? new Date(dateValue) : dateOnly;

  if (Number.isNaN(baseDate.getTime())) return null;

  const parsedTime = parseEventTime(timeValue);

  if (parsedTime) {
    baseDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    return baseDate;
  }

  if (useEndOfDayWhenNoTime) {
    baseDate.setHours(23, 59, 59, 999);
  } else {
    baseDate.setHours(0, 0, 0, 0);
  }

  return baseDate;
};

const getEventEndDateTime = (event) => {
  const startDateTime = buildEventDateTime(event?.date, event?.time, false);

  const explicitEnd = buildEventDateTime(
    event?.endDate || event?.date,
    event?.endTime || event?.time,
    true
  );

  if (explicitEnd && startDateTime && explicitEnd < startDateTime) {
    const fallback = new Date(startDateTime);
    fallback.setHours(fallback.getHours() + 3);
    return fallback;
  }

  if (explicitEnd) return explicitEnd;

  if (!startDateTime) return null;

  const fallback = new Date(startDateTime);
  fallback.setHours(fallback.getHours() + 3);
  return fallback;
};

// ── controllers ───────────────────────────────────────────────────────────────

// POST /api/feedback
const saveFeedback = async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    if (!userId || !eventId || !rating) {
      return res.status(400).json({ message: "userId, eventId, and rating are required." });
    }

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    // Verify registration
    const registration = await Registration.findOne({ studentId: userId, eventId });
    if (!registration) {
      return res.status(403).json({ message: "You are not registered for this event." });
    }

    // Verify event exists and has ended
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const now = new Date();
    const endDateTime = getEventEndDateTime(event);

    if (!endDateTime || now <= endDateTime) {
      return res.status(400).json({ message: "Feedback is only available after the event ends." });
    }

    // Prevent duplicate submission
    const existing = await Feedback.findOne({ userId, eventId });
    if (existing) {
      return res.status(409).json({ message: "You have already submitted feedback for this event." });
    }

    const feedback = await Feedback.create({
      userId,
      eventId,
      rating: parsedRating,
      comment: (comment || "").trim(),
    });

    return res.status(201).json(feedback);
  } catch (err) {
    console.error("saveFeedback error:", err);
    return res.status(500).json({ message: "Failed to save feedback." });
  }
};

// PATCH /api/feedback/:eventId/:userId
const updateFeedback = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const { rating, comment } = req.body;

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { userId, eventId },
      { $set: { rating: parsedRating, comment: (comment || "").trim() } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    return res.json(feedback);
  } catch (err) {
    console.error("updateFeedback error:", err);
    return res.status(500).json({ message: "Failed to update feedback." });
  }
};

// GET /api/feedback/:eventId/:userId
const getFeedbackByUser = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const feedback = await Feedback.findOne({ userId, eventId });
    return res.json({ feedback: feedback || null });
  } catch (err) {
    console.error("getFeedbackByUser error:", err);
    return res.status(500).json({ message: "Failed to fetch feedback." });
  }
};

// GET /api/feedback/event/:eventId
const getFeedbackByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ eventId })
      .populate({ path: "userId", select: "name profileImage" })
      .sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (err) {
    console.error("getFeedbackByEvent error:", err);
    return res.status(500).json({ message: "Failed to fetch feedback." });
  }
};

// GET /api/feedback/summary/:eventId
const getEventFeedbackSummary = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    const feedbacks = await Feedback.find({ eventId });

    const avgRating =
      feedbacks.length
        ? parseFloat(
            (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
          )
        : null;

    const commentsText = feedbacks
      .map((f) => f.comment)
      .filter(Boolean)
      .join("\n");

    const summary = await generateFeedbackSummary(
      commentsText,
      event ? event.eventName : "this event"
    );

    return res.json({ summary, avgRating });
  } catch (err) {
    console.error("getEventFeedbackSummary error:", err);
    return res.status(500).json({ message: "Failed to generate summary." });
  }
};

module.exports = {
  saveFeedback,
  updateFeedback,
  getFeedbackByUser,
  getFeedbackByEvent,
  getEventFeedbackSummary,
};
