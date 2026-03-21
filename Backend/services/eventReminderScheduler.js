const Registration = require("../Models/Registration");
const sendEmail = require("../utils/sendEmail");
const { reminderTemplate } = require("../utils/template");

const DAY_MS = 24 * 60 * 60 * 1000;

let schedulerHandle = null;

const parseReminderDays = () => {
  const raw = process.env.EVENT_REMINDER_DAYS;

  // Default behavior: daily countdown reminders until the event starts.
  if (!raw || !raw.trim()) {
    return null;
  }

  const parsedDays = raw
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  return parsedDays.length ? Array.from(new Set(parsedDays)).sort((a, b) => b - a) : null;
};

const shouldSendReminderForDay = (daysUntilEvent, configuredDays) => {
  if (daysUntilEvent < 1) {
    return false;
  }

  if (!configuredDays) {
    return true;
  }

  return configuredDays.includes(daysUntilEvent);
};

const getSchedulerInterval = () => {
  const parsed = Number.parseInt(process.env.EVENT_REMINDER_INTERVAL_MS || "", 10);

  if (!Number.isFinite(parsed) || parsed < 60 * 1000) {
    return 60 * 60 * 1000;
  }

  return parsed;
};

const parseEventStartDate = (eventDate, eventTime) => {
  const combined = new Date(`${eventDate} ${eventTime || ""}`.trim());

  if (!Number.isNaN(combined.getTime())) {
    return combined;
  }

  const fallback = new Date(eventDate);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const getReminderSubject = (eventName, daysUntilEvent) => {
  if (daysUntilEvent === 1) {
    return `Event Reminder: ${eventName} is tomorrow`;
  }

  return `Event Reminder: ${eventName} starts in ${daysUntilEvent} days`;
};

const runReminderCycle = async () => {
  const reminderDays = parseReminderDays();
  const reminderModeLabel = reminderDays ? reminderDays.join(",") : "daily";
  const now = new Date();

  const registrations = await Registration.find({})
    .select("studentId eventId reminderDaysSent")
    .populate("studentId", "name email role notificationsEnabled notificationPreferences emailNotifications emailPreferences")
    .populate("eventId", "eventName date time venue");

  let sentCount = 0;
  let skippedCount = 0;

  for (const registration of registrations) {
    const student = registration.studentId;
    const event = registration.eventId;

    if (!student || !event || !student.email) {
      skippedCount += 1;
      continue;
    }

    const eventStart = parseEventStartDate(event.date, event.time);

    if (!eventStart || eventStart <= now) {
      skippedCount += 1;
      continue;
    }

    const daysUntilEvent = Math.ceil((eventStart.getTime() - now.getTime()) / DAY_MS);

    if (!shouldSendReminderForDay(daysUntilEvent, reminderDays)) {
      skippedCount += 1;
      continue;
    }

    if (
      student.role === "admin" ||
      student.notificationPreferences?.enabled === false ||
      student.notificationsEnabled === false ||
      student.emailNotifications === false ||
      student.emailPreferences?.reminders === false ||
      student.emailPreferences?.promotions === false
    ) {
      await Registration.updateOne(
        {
          _id: registration._id,
          reminderDaysSent: { $ne: daysUntilEvent },
        },
        {
          $addToSet: { reminderDaysSent: daysUntilEvent },
        }
      );

      skippedCount += 1;
      continue;
    }

    const reminderAlreadySent = Array.isArray(registration.reminderDaysSent)
      ? registration.reminderDaysSent.includes(daysUntilEvent)
      : false;

    if (reminderAlreadySent) {
      skippedCount += 1;
      continue;
    }

    const claim = await Registration.updateOne(
      {
        _id: registration._id,
        reminderDaysSent: { $ne: daysUntilEvent },
      },
      {
        $addToSet: { reminderDaysSent: daysUntilEvent },
      }
    );

    if (!claim.modifiedCount) {
      skippedCount += 1;
      continue;
    }

    const html = reminderTemplate({
      name: event.eventName,
      date: event.date,
      time: event.time,
      location: event.venue,
      description:
        daysUntilEvent === 1
          ? "This event is tomorrow. Please arrive 15 minutes early."
          : `This event starts in ${daysUntilEvent} days. Keep your schedule clear and be on time.`,
    });

    const sent = await sendEmail(
      student.email,
      getReminderSubject(event.eventName, daysUntilEvent),
      html,
      { topic: "EVENT_REMINDER", type: "promo" }
    );

    if (!sent) {
      await Registration.updateOne(
        { _id: registration._id },
        { $pull: { reminderDaysSent: daysUntilEvent } }
      );
      skippedCount += 1;
      continue;
    }

    sentCount += 1;
  }

  console.log(
    `[REMINDER] Cycle complete | sent: ${sentCount} | skipped: ${skippedCount} | intervals: ${reminderModeLabel}`
  );
};

const startEventReminderScheduler = () => {
  if (schedulerHandle) {
    return schedulerHandle;
  }

  const intervalMs = getSchedulerInterval();

  runReminderCycle().catch((error) => {
    console.error("[REMINDER] Initial cycle failed:", error.message);
  });

  schedulerHandle = setInterval(() => {
    runReminderCycle().catch((error) => {
      console.error("[REMINDER] Cycle failed:", error.message);
    });
  }, intervalMs);

  console.log(`[REMINDER] Scheduler started | intervalMs: ${intervalMs}`);

  return schedulerHandle;
};

module.exports = {
  startEventReminderScheduler,
  runReminderCycle,
};
