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
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);