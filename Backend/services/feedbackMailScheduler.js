const Registration = require("../Models/Registration");
const Event = require("../Models/Event");
const sendEmail = require("../utils/sendEmail");
const { feedbackRequestTemplate } = require("../utils/template");

const INTERVAL_MS = 2 * 60 * 1000; // run every 2 minutes

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

// ── main job ──────────────────────────────────────────────────────────────────

const runFeedbackMailCycle = async () => {
  const now = new Date();

  try {
    // Find registrations that have not had a feedback email sent yet
    const registrations = await Registration.find({ feedbackEmailSent: { $ne: true } })
      .select("_id studentId eventId feedbackEmailSent")
      .populate("studentId", "name email role notificationsEnabled notificationPreferences emailNotifications emailPreferences")
      .populate({
        path: "eventId",
        model: "Event",
        select: "eventName date time endDate endTime venue",
        // eventId is stored as a String ref, so populate via string match
      });

    let sentCount = 0;

    for (const reg of registrations) {
      const student = reg.studentId;
      const event = reg.eventId;

      if (!student || !event || !student.email) continue;

      // Only send once event has ended
      const endDateTime = getEventEndDateTime(event);
      if (!endDateTime || now <= endDateTime) continue;

      // Skip permanently when notifications are disabled at eligible send time.
      if (
        student.role === "admin" ||
        student.notificationPreferences?.enabled === false ||
        student.notificationsEnabled === false ||
        student.emailNotifications === false ||
        student.emailPreferences?.reminders === false
      ) {
        await Registration.updateOne(
          { _id: reg._id, feedbackEmailSent: { $ne: true } },
          { $set: { feedbackEmailSent: true } }
        );
        continue;
      }

      // Atomically claim this registration to avoid duplicate sends
      const claim = await Registration.updateOne(
        { _id: reg._id, feedbackEmailSent: { $ne: true } },
        { $set: { feedbackEmailSent: true } }
      );

      if (!claim.modifiedCount) continue; // another process already claimed it

      const html = feedbackRequestTemplate({
        name: event.eventName,
        date: event.date,
        venue: event.venue,
        studentName: student.name,
      });

      const sent = await sendEmail(
        student.email,
        `How was ${event.eventName}? Share your feedback!`,
        html,
        { topic: "GENERAL", type: "promo" }
      );

      if (!sent) {
        // Roll back so we retry next cycle
        await Registration.updateOne(
          { _id: reg._id },
          { $set: { feedbackEmailSent: false } }
        );
        continue;
      }

      sentCount += 1;
    }

    if (sentCount > 0) {
      console.log(`[FeedbackMailer] Sent ${sentCount} feedback request email(s).`);
    }
  } catch (err) {
    console.error("[FeedbackMailer] runFeedbackMailCycle error:", err.message);
  }
};

// ── export ────────────────────────────────────────────────────────────────────

const startFeedbackMailScheduler = () => {
  console.log("[FeedbackMailer] Scheduler started — checking every 2 minutes.");
  runFeedbackMailCycle(); // immediate first run
  setInterval(runFeedbackMailCycle, INTERVAL_MS);
};

module.exports = { startFeedbackMailScheduler };
