const Event = require("../Models/Event");
const Registration = require("../Models/Registration");
const Student = require("../Models/Student");
const { generateCertificate } = require("../utils/certificateGenerator");

const respondIfBlocked = (student, res) => {
  if (student?.isBlocked) {
    res.status(403).json({ message: "BLOCKED" });
    return true;
  }

  return false;
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
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return { hours: hour, minutes: minute };
  }

  return null;
};

const buildEventDateTime = (dateValue, timeValue, useEndOfDayWhenNoTime = false) => {
  if (!dateValue) {
    return null;
  }

  const dateOnly = typeof dateValue === "string"
    ? new Date(`${dateValue}T00:00:00`)
    : new Date(dateValue);

  const baseDate = Number.isNaN(dateOnly.getTime())
    ? new Date(dateValue)
    : dateOnly;

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

  const explicitEndDateTime = buildEventDateTime(
    event?.endDate || event?.date,
    event?.endTime || event?.time,
    true
  );

  if (explicitEndDateTime && startDateTime && explicitEndDateTime < startDateTime) {
    const fallbackEnd = new Date(startDateTime);
    fallbackEnd.setHours(fallbackEnd.getHours() + 3);
    return fallbackEnd;
  }

  if (explicitEndDateTime) {
    return explicitEndDateTime;
  }

  if (!startDateTime) {
    return null;
  }

  const fallbackEnd = new Date(startDateTime);
  fallbackEnd.setHours(fallbackEnd.getHours() + 3);
  return fallbackEnd;
};

const sanitizeFileName = (value) => {
  return String(value || "certificate")
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/gi, "")
    .trim()
    .replace(/\s+/g, "-") || "certificate";
};

const buildCertificateId = (eventId, studentId) => {
  const eventPart = String(eventId || "event").slice(-6).toUpperCase();
  const studentPart = String(studentId || "student").slice(-6).toUpperCase();
  return `ES-${eventPart}-${studentPart}`;
};

const formatIssueDate = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.header("x-student-id");

    if (!studentId) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const student = await Student.findById(studentId).select("_id name isBlocked");

    if (!student) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    if (respondIfBlocked(student, res)) {
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const registration = await Registration.findOne({
      studentId,
      eventId,
    });

    if (!registration) {
      return res.status(403).json({
        message: "Certificate available only for registered participants",
      });
    }

    const eventEndDateTime = getEventEndDateTime(event);
    const eventEnded = eventEndDateTime ? new Date() > eventEndDateTime : false;

    if (!eventEnded) {
      return res.status(400).json({
        message: "Certificate will be available after event completion",
      });
    }

    if (!event.isCompleted) {
      return res.status(400).json({
        message: "Certificate will be available after admin marks event as completed",
      });
    }

    const certificateBuffer = await generateCertificate({
      studentName: student.name,
      eventName: event.eventName,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      organizer: "EventSphere",
      certificateId: buildCertificateId(event._id, student._id),
      issueDate: formatIssueDate(new Date()),
      signatureName: req.adminUser?.name || "Event Coordinator",
      signatureRole: "Authorized Signature",
    });

    const safeEventName = sanitizeFileName(event.eventName || "event");
    const safeStudentName = sanitizeFileName(student.name || "student");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${safeEventName}-${safeStudentName}.pdf"`
    );

    res.send(certificateBuffer);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
