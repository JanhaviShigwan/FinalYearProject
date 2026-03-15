const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      index: true,
    },

    eventDefaults: {
      defaultCapacity: {
        type: Number,
        default: 200,
        min: 1,
      },
      registrationOpenDaysBefore: {
        type: Number,
        default: 14,
        min: 0,
        max: 60,
      },
      defaultCategory: {
        type: String,
        default: "Workshop",
      },
      defaultVenue: {
        type: String,
        default: "",
      },
      autoCloseWhenFull: {
        type: Boolean,
        default: true,
      },
    },

    announcementSettings: {
      enableAnnouncementEmails: {
        type: Boolean,
        default: true,
      },
      defaultEmailSubject: {
        type: String,
        default: "EventSphere Announcement",
      },
      defaultEmailSignature: {
        type: String,
        default: "EventSphere Admin Team",
      },
    },

    notificationPreferences: {
      notifyOnNewRegistration: {
        type: Boolean,
        default: true,
      },
      eventFullThresholdPercent: {
        type: Number,
        default: 90,
        min: 1,
        max: 100,
      },
      dailySummaryEmail: {
        type: Boolean,
        default: false,
      },
    },

    securitySettings: {
      sessionTimeoutMinutes: {
        type: Number,
        default: 60,
        min: 5,
        max: 1440,
      },
      failedLoginLockoutAttempts: {
        type: Number,
        default: 5,
        min: 3,
        max: 20,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);