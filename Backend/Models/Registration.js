const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  eventId: {
  type: String,
  ref: "Event"
},

  registeredAt: {
    type: Date,
    default: Date.now
  },

  reminderDaysSent: {
    type: [Number],
    default: []
  },

  feedbackEmailSent: {
    type: Boolean,
    default: false
  },

  attendanceMarked: {
    type: Boolean,
    default: false
  },

  attendanceTime: {
    type: Date,
    default: null
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);