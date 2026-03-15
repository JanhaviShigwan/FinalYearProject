const mongoose = require("mongoose");

const BreakdownItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const EventReportSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    eventImage: {
      type: String,
      default: "",
    },
    totalCapacity: {
      type: Number,
      default: 0,
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
    fillRatePercent: {
      type: Number,
      default: 0,
    },
    topDepartment: {
      type: String,
      default: "N/A",
    },
    participantStats: {
      totalParticipants: {
        type: Number,
        default: 0,
      },
      departments: {
        type: [BreakdownItemSchema],
        default: [],
      },
      years: {
        type: [BreakdownItemSchema],
        default: [],
      },
      genders: {
        type: [BreakdownItemSchema],
        default: [],
      },
    },
    eventEndedAt: {
      type: Date,
      required: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventReport", EventReportSchema);