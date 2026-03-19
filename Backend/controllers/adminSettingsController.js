const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const AdminSettings = require("../Models/AdminSettings");
const Student = require("../Models/Student");
const Feedback = require("../Models/Feedback");
const Event = require("../Models/Event");
const sendEmail = require("../utils/sendEmail");
const { passwordChangedTemplate, blockedTemplate } = require("../utils/template");
const { generateEventReport } = require("../utils/generateReport");
const { generateExecutionText } = require("../utils/aiSummary");

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

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

const parseEventTime = (rawTime) => {
  if (!rawTime || typeof rawTime !== "string") {
    return null;
  }

  const value = rawTime.trim();
  const twelveHourMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (twelveHourMatch) {
    const hour12 = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();

    if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
      return null;
    }

    let hour24 = hour12 % 12;
    if (period === "PM") {
      hour24 += 12;
    }

    return { hours: hour24, minutes: minute };
  }

  const twentyFourHourMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!twentyFourHourMatch) {
    return null;
  }

  const hour = Number(twentyFourHourMatch[1]);
  const minute = Number(twentyFourHourMatch[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hours: hour, minutes: minute };
};

const buildEventDateTime = (dateValue, timeValue, useEndOfDayWhenNoTime = false) => {
  if (!dateValue) {
    return null;
  }

  const baseDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }

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

  if (explicitEnd) {
    return explicitEnd;
  }

  if (!startDateTime) {
    return null;
  }

  const fallback = new Date(startDateTime);
  fallback.setHours(fallback.getHours() + 3);
  return fallback;
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

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const updates = Array.isArray(req.body?.users) ? req.body.users : null;

    if (!updates) {
      return res.status(400).json({
        message: "users must be an array",
      });
    }

    const validUpdates = updates.filter(
      (item) =>
        item
        && typeof item.userId === "string"
        && mongoose.Types.ObjectId.isValid(item.userId)
        && typeof item.enabled === "boolean"
    );

    if (!validUpdates.length) {
      return res.status(400).json({
        message: "No valid notification preference updates found",
      });
    }

    const targetIds = validUpdates.map((item) => item.userId);

    const targetUsers = await Student.find({ _id: { $in: targetIds } })
      .select("_id role");

    const userRoleMap = new Map(
      targetUsers.map((user) => [String(user._id), user.role])
    );

    const bulkOperations = validUpdates
      .filter((item) => userRoleMap.has(item.userId))
      .map((item) => {
        const role = userRoleMap.get(item.userId);
        const enabled = role === "admin" ? false : item.enabled;

        return {
          updateOne: {
            filter: { _id: item.userId },
            update: {
              $set: {
                "notificationPreferences.enabled": enabled,
                notificationsEnabled: enabled,
              },
            },
          },
        };
      });

    if (!bulkOperations.length) {
      return res.status(404).json({
        message: "No matching users found",
      });
    }

    await Student.bulkWrite(bulkOperations, { ordered: false });

    return res.status(200).json({
      message: "Notification preferences updated successfully",
      updatedCount: bulkOperations.length,
    });
  } catch (error) {
    console.error("updateNotificationPreferences error:", error);
    return res.status(500).json({
      message: "Failed to update notification preferences",
    });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const normalizedReason = String(reason || "").trim();

    if (!normalizedReason) {
      return res.status(400).json({ message: "Blocking reason is required" });
    }

    const user = await Student.findById(userId).select("_id name email isBlocked blockReason");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;
    user.blockReason = normalizedReason;
    await user.save();

    if (user.email) {
      await sendEmail(
        user.email,
        "Account Blocked",
        blockedTemplate(user.name, normalizedReason),
        {
          topic: "GENERAL",
          bypassPreferenceCheck: true,
        }
      );
    }

    return res.status(200).json({
      message: "User blocked successfully",
      user: {
        _id: user._id,
        isBlocked: user.isBlocked,
        blockReason: user.blockReason,
      },
    });
  } catch (error) {
    console.error("blockUser error:", error);
    return res.status(500).json({ message: "Failed to block user" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const user = await Student.findById(userId).select("_id isBlocked blockReason");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;
    user.blockReason = "";
    await user.save();

    return res.status(200).json({
      message: "User unblocked successfully",
      user: {
        _id: user._id,
        isBlocked: user.isBlocked,
        blockReason: user.blockReason,
      },
    });
  } catch (error) {
    console.error("unblockUser error:", error);
    return res.status(500).json({ message: "Failed to unblock user" });
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

exports.getEventReport = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const eventEndDateTime = getEventEndDateTime(event);
    const eventEnded = eventEndDateTime ? new Date() > eventEndDateTime : false;

    if (!eventEnded) {
      return res.status(400).json({ message: "Reports are only available after the event has ended." });
    }

    const feedbacks = await Feedback.find({ eventId: String(event._id) }).sort({ createdAt: -1 });
    const executionText = await generateExecutionText(event);
    const doc = await generateEventReport(event, feedbacks, executionText);

    const safeName = (event.eventName || "event-report")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const fileName = `${safeName || "event-report"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("getEventReport error:", error);
    res.status(500).json({ message: "Failed to generate event report." });
  }
};
