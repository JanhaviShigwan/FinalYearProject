const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  eventId: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate feedback per user per event
FeedbackSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);
