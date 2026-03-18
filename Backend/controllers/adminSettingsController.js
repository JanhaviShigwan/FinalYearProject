const bcrypt = require("bcryptjs");
const AdminSettings = require("../Models/AdminSettings");
const Student = require("../Models/Student");
const Feedback = require("../Models/Feedback");
const Event = require("../Models/Event");
const sendEmail = require("../utils/sendEmail");
const { passwordChangedTemplate } = require("../utils/template");

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
};

const getOrCreateSettings = async () => {
  let settings = await AdminSettings.findOne({ key: "global" });

  if (!settings) {
    settings = await AdminSettings.create({ key: "global" });
  }

  return settings;
};

const sanitizeSettingsPayload = (payload = {}) => {
  const eventDefaults = payload.eventDefaults || {};
  const announcementSettings = payload.announcementSettings || {};
  const notificationPreferences = payload.notificationPreferences || {};
  const securitySettings = payload.securitySettings || {};

  return {
    eventDefaults: {
      defaultCapacity: clampNumber(eventDefaults.defaultCapacity, 1, 5000, 200),
      registrationOpenDaysBefore: clampNumber(eventDefaults.registrationOpenDaysBefore, 0, 60, 14),
      defaultCategory: (eventDefaults.defaultCategory || "Workshop").trim() || "Workshop",
      defaultVenue: (eventDefaults.defaultVenue || "").trim(),
      autoCloseWhenFull: eventDefaults.autoCloseWhenFull !== false,
    },
    announcementSettings: {
      enableAnnouncementEmails: announcementSettings.enableAnnouncementEmails !== false,
      defaultEmailSubject:
        (announcementSettings.defaultEmailSubject || "EventSphere Announcement").trim() ||
        "EventSphere Announcement",
      defaultEmailSignature:
        (announcementSettings.defaultEmailSignature || "EventSphere Admin Team").trim() ||
        "EventSphere Admin Team",
    },
    notificationPreferences: {
      notifyOnNewRegistration: notificationPreferences.notifyOnNewRegistration !== false,
      eventFullThresholdPercent: clampNumber(
        notificationPreferences.eventFullThresholdPercent,
        1,
        100,
        90
      ),
      dailySummaryEmail: Boolean(notificationPreferences.dailySummaryEmail),
    },
    securitySettings: {
      sessionTimeoutMinutes: clampNumber(securitySettings.sessionTimeoutMinutes, 5, 1440, 60),
      failedLoginLockoutAttempts: clampNumber(
        securitySettings.failedLoginLockoutAttempts,
        3,
        20,
        5
      ),
    },
  };
};

exports.getAdminSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json({
      account: {
        name: req.adminUser.name,
        email: req.adminUser.email,
      },
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin settings" });
  }
};

exports.updateAdminSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const normalized = sanitizeSettingsPayload(req.body);

    settings.eventDefaults = normalized.eventDefaults;
    settings.announcementSettings = normalized.announcementSettings;
    settings.notificationPreferences = normalized.notificationPreferences;
    settings.securitySettings = normalized.securitySettings;

    await settings.save();

    res.status(200).json({
      message: "Settings saved successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save settings" });
  }
};

exports.updateAdminAccount = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const existingEmailUser = await Student.findOne({
      email,
      _id: { $ne: req.adminUser._id },
    }).select("_id");

    if (existingEmailUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const updatedAdmin = await Student.findByIdAndUpdate(
      req.adminUser._id,
      {
        $set: {
          name,
          email,
        },
      },
      { returnDocument: "after", runValidators: true }
    ).select("_id name email role");

    res.status(200).json({
      message: "Admin account updated successfully",
      account: {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admin account" });
  }
};

exports.updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const admin = await Student.findById(req.adminUser._id).select("password email");

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    await sendEmail(
      admin.email,
      "Admin Password Changed",
      passwordChangedTemplate(),
      { topic: "PASSWORD_CHANGED" }
    );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password" });
  }
};

exports.getEventsWithFeedback = async (req, res) => {
  try {
    const distinctEventIds = await Feedback.distinct("eventId");

    if (!distinctEventIds.length) {
      return res.json([]);
    }

    const events = await Event.find({ _id: { $in: distinctEventIds } })
      .select("eventName date time venue category eventImage")
      .sort({ date: -1 });

    return res.json(events);
  } catch (err) {
    console.error("getEventsWithFeedback error:", err);
    return res.status(500).json({ message: "Failed to fetch events with feedback." });
  }
};
