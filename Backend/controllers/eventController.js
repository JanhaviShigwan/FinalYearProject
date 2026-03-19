const Event = require("../Models/Event");
const QRCode = require("qrcode");
const Registration = require("../Models/Registration");
const sendEmail = require("../utils/sendEmail");
const Student = require("../Models/Student");
const AdminSettings = require("../Models/AdminSettings");

const {
  eventRegisterTemplate,
  eventCancelTemplate,
  newEventTemplate,
} = require("../utils/template");

const respondIfBlocked = (student, res) => {
  if (student?.isBlocked) {
    res.status(403).json({ message: "BLOCKED" });
    return true;
  }

  return false;
};

const sendEventMailAsync = (event) => {
  setTimeout(async () => {
    try {
      const users = await Student.find({
        email: { $exists: true, $ne: null },
      }).select("email");

      const subject = "New Event Organised: " + event.eventName;
      const html = newEventTemplate({
        name: event.eventName,
        date: event.date,
        time: event.time,
        location: event.venue,
        description: event.shortDescription,
      });

      await Promise.allSettled(
        users
          .map((user) => user.email)
          .filter(Boolean)
          .map((email) =>
            sendEmail(email, subject, html, {
              topic: "GENERAL",
            })
          )
      );
    } catch (mailError) {
      console.error("Event created email broadcast error:", mailError.message);
    }
  }, 0);
};

const getEventSpecificRules = (eventName = "", category = "") => {
  const normalizedText = `${eventName} ${category}`.toLowerCase();
  const eventLabel = eventName || "this event";

  const baseRules = [
    "Carry your valid college ID card for verification at entry.",
    `Report at least 15 minutes before the scheduled start time of ${eventLabel}.`,
    "Follow instructions from event coordinators and volunteers at all times.",
    "Misconduct, cheating, or harassment can lead to immediate disqualification.",
  ];

  const keywordRuleSets = [
    {
      keywords: ["hackathon", "coding", "code", "programming", "tech"],
      rules: [
        "Carry your own charged laptop, charger, and required software setup.",
        "Plagiarism or using unauthorized code repositories is strictly prohibited.",
      ],
    },
    {
      keywords: ["workshop", "seminar", "webinar", "talk", "session"],
      rules: [
        "Keep your phone on silent mode during the session.",
        "Bring a notebook or laptop if hands-on activities are included.",
      ],
    },
    {
      keywords: ["dance", "music", "cultural", "fashion", "performance"],
      rules: [
        "Participants must follow the assigned reporting and performance slots.",
        "Props and costumes should comply with campus safety guidelines.",
      ],
    },
    {
      keywords: ["sports", "football", "cricket", "badminton", "tournament", "match"],
      rules: [
        "Wear appropriate sports attire and safety gear wherever applicable.",
        "Fair-play rules and referee decisions are final and binding.",
      ],
    },
    {
      keywords: ["placement", "career", "interview", "resume", "recruit"],
      rules: [
        "Carry a printed copy of your resume and student ID.",
        "Formal or smart-professional attire is recommended.",
      ],
    },
  ];

  const matched = keywordRuleSets.find((ruleSet) =>
    ruleSet.keywords.some((keyword) => normalizedText.includes(keyword))
  );

  if (matched) {
    return [...baseRules, ...matched.rules];
  }

  return [
    ...baseRules,
    `Please review all instructions provided on the ${eventLabel} event page before attending.`,
  ];
};

const getEventDefaultSettings = async () => {
  const settings = await AdminSettings
    .findOne({ key: "global" })
    .select("eventDefaults");

  const eventDefaults = settings?.eventDefaults || {};

  return {
    defaultCapacity: Number(eventDefaults.defaultCapacity) || 200,
    registrationOpenDaysBefore:
      Number.isFinite(Number(eventDefaults.registrationOpenDaysBefore))
        ? Number(eventDefaults.registrationOpenDaysBefore)
        : 14,
    defaultCategory: eventDefaults.defaultCategory || "Workshop",
    defaultVenue: eventDefaults.defaultVenue || "",
    autoCloseWhenFull: eventDefaults.autoCloseWhenFull !== false,
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

const getEventStartDateTime = (event) => {
  return buildEventDateTime(event?.date, event?.time, false);
};

const getEventEndDateTime = (event) => {
  const startDateTime = getEventStartDateTime(event);

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

const getRegistrationWindowState = (event, settings) => {
  const eventStart = getEventStartDateTime(event);
  const eventEnd = getEventEndDateTime(event);
  const now = new Date();

  if (!eventStart || !eventEnd) {
    return {
      registrationOpen: false,
      registrationOpenDate: null,
      eventEnd: null,
    };
  }

  const openDate = new Date(eventStart);
  openDate.setDate(eventStart.getDate() - settings.registrationOpenDaysBefore);

  const hasSlots = Number(event.registeredUsers || 0) < Number(event.totalCapacity || 0);
  const isWithinWindow = now >= openDate && now <= eventEnd;

  return {
    registrationOpenDate: openDate,
    eventEnd,
    registrationOpen: settings.autoCloseWhenFull
      ? isWithinWindow && hasSlots
      : isWithinWindow,
  };
};


// GET all events
const getEvents = async (req, res) => {
  try {
    const settings = await getEventDefaultSettings();
    const pageParam = Number.parseInt(req.query.page, 10);
    const limitParam = Number.parseInt(req.query.limit, 10);
    const hasPaginationParams = req.query.page !== undefined || req.query.limit !== undefined;

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 100)
      : 10;
    const skip = (page - 1) * limit;

    const [events, total] = hasPaginationParams
      ? await Promise.all([
        Event.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Event.countDocuments(),
      ])
      : await Promise.all([
        Event.find().sort({ createdAt: -1 }),
        Event.countDocuments(),
      ]);

    const eventsWithRegistrationDate = events.map(event => {
      const {
        registrationOpen,
        registrationOpenDate: openDate,
      } = getRegistrationWindowState(event, settings);

      return {
        ...event._doc,
        registrationOpenDate: openDate,
        registrationOpen,
      };

    });

    if (hasPaginationParams) {
      return res.json({
        events: eventsWithRegistrationDate,
        total,
        page,
        limit,
      });
    }

    res.json(eventsWithRegistrationDate);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET event by ID
const getEventById = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// CREATE event
const createEvent = async (req, res) => {
  try {

    const settings = await getEventDefaultSettings();

    const payload = {
      ...req.body,
      totalCapacity:
        Number.isFinite(Number(req.body.totalCapacity)) && Number(req.body.totalCapacity) > 0
          ? Number(req.body.totalCapacity)
          : settings.defaultCapacity,
      category: req.body.category || settings.defaultCategory,
      venue: req.body.venue || settings.defaultVenue,
      endDate: req.body.endDate || req.body.date || "",
      endTime: req.body.endTime || req.body.time || "",
    };

    const event = new Event(payload);
    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
    sendEventMailAsync(savedEvent);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE event
const updateEvent = async (req, res) => {
  try {

    const { id } = req.params;
    const settings = await getEventDefaultSettings();

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const allowedFields = [
      "eventName",
      "shortDescription",
      "longDescription",
      "category",
      "venue",
      "date",
      "time",
      "endDate",
      "endTime",
      "eventImage",
      "totalCapacity",
      "isFeatured",
      "isTrending",
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        event[field] = req.body[field];
      }
    });

    const shouldBeFeatured = event.isFeatured === true;
    const shouldBeTrending = event.isTrending === true;

    if (shouldBeFeatured || shouldBeTrending) {
      const { registrationOpen } = getRegistrationWindowState(event, settings);

      if (!registrationOpen) {
        return res.status(400).json({
          message: "Only events in the active registration window can be marked as featured or trending",
          type: "PLACEMENT_NOT_ALLOWED",
        });
      }
    }

    if (event.totalCapacity < event.registeredUsers) {
      return res.status(400).json({
        message: "Total capacity cannot be less than registered users"
      });
    }

    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE event
const deleteEvent = async (req, res) => {
  try {

    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    await Registration.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= REGISTER EVENT =================

const registerForEvent = async (req, res) => {

  try {

    const { studentId } = req.body;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    const student = await Student.findById(studentId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    if (respondIfBlocked(student, res)) {
      return;
    }

    if (student.role !== "admin" && !student.profileComplete) {
      return res.status(400).json({
        type: "PROFILE_INCOMPLETE",
        message: "Please complete your profile first"
      });
    }

    const resolvedProfileStatus =
      student.role === "admin"
        ? "approved"
        : (student.profileStatus || (student.profileComplete ? "approved" : "pending"));

    if (student.role !== "admin" && resolvedProfileStatus !== "approved") {
      if (resolvedProfileStatus === "rejected") {
        return res.status(400).json({
          type: "PROFILE_REJECTED",
          message: "Your profile was rejected. Please update your details and resubmit."
        });
      }

      return res.status(400).json({
        type: "PROFILE_UNDER_REVIEW",
        message: "Your profile is under review by admin"
      });
    }

    const existing = await Registration.findOne({
      studentId,
      eventId
    });

    if (existing) {
      return res.status(400).json({
        type: "ALREADY_REGISTERED",
        message: "You already registered"
      });
    }


    const settings = await getEventDefaultSettings();

    const today = new Date();

    const eventStart = getEventStartDateTime(event);
    const eventEnd = getEventEndDateTime(event);

    if (!eventStart || !eventEnd) {
      return res.status(400).json({
        type: "EVENT_DATE_INVALID",
        message: "Event date or time is invalid",
      });
    }

    const openDate = new Date(eventStart);
    openDate.setDate(
      eventStart.getDate() - settings.registrationOpenDaysBefore
    );

    if (today < openDate) {
      return res.status(400).json({
        type: "REGISTRATION_NOT_OPEN",
        message: "Registration not open yet"
      });
    }

    if (today > eventEnd) {
      return res.status(400).json({
        type: "EVENT_ENDED",
        message: "Event ended"
      });
    }

    if (event.registeredUsers >= event.totalCapacity) {
      return res.status(400).json({
        type: "EVENT_FULL",
        message: "Event full"
      });
    }


    // SAVE REGISTRATION

    const registration = new Registration({
      studentId,
      eventId
    });

    await registration.save();

    event.registeredUsers += 1;
    await event.save();


    // EMAIL

    // Keep payload identical to frontend MyRegistrations QR value.
    const qrPayload = {
      studentId: String(student._id),
      studentName: student.name,
      eventId: String(event._id),
      eventName: event.eventName,
      date: event.date,
      venue: event.venue,
    };

    const qrCodeValue = JSON.stringify(qrPayload);
    const qrCodeCid = `event-registration-qr-${registration._id}@eventsphere`;

    const qrCodeBuffer = await QRCode.toBuffer(
      qrCodeValue,
      {
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#3F3D56",
          light: "#FFFFFF",
        },
      }
    );

    const qrCodeDataUrl = await QRCode.toDataURL(
      qrCodeValue,
      {
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#3F3D56",
          light: "#FFFFFF",
        },
      }
    );

    const emailHTML =
      eventRegisterTemplate({
        name: event.eventName,
        date: event.date,
        time: event.time,
        location: event.venue,
        capacity: event.totalCapacity - event.registeredUsers,
        qrCodeCid,
        qrCodeDataUrl,
        rules: getEventSpecificRules(event.eventName, event.category),
      });


    if (student?.email) {

      await sendEmail(
        student.email,
        "Event Registration Confirmed",
        emailHTML,
        {
          topic: "EVENT_REGISTRATION",
          attachments: [
            {
              filename: `${String(event.eventName || "event").replace(/[^a-z0-9-_ ]/gi, "").trim() || "event"}-entry-qr.png`,
              content: qrCodeBuffer,
              contentType: "image/png",
              cid: qrCodeCid,
            },
          ],
        }
      );

    } else {
      console.log("[MAIL][EVENT_REGISTRATION] Skipped — student email missing");
    }


    res.json({
      type: "SUCCESS",
      message: "Registered successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};



// CHECK REGISTRATION

const checkRegistration = async (req, res) => {

  try {

    const { eventId, studentId } = req.params;

    const student = await Student.findById(studentId).select("isBlocked");

    if (student && respondIfBlocked(student, res)) {
      return;
    }

    const registration = await Registration.findOne({
      eventId,
      studentId
    });

    if (registration) {
      return res.json({ registered: true });
    }

    res.json({ registered: false });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// GET STUDENT EVENTS

const getStudentRegistrations = async (req, res) => {

  try {

    const { studentId } = req.params;

    const student = await Student.findById(studentId).select("isBlocked");

    if (student && respondIfBlocked(student, res)) {
      return;
    }

    const registrations = await Registration.find({
      studentId
    });

    const eventIds = registrations.map(r => r.eventId);

    const events = await Event.find({
      _id: { $in: eventIds }
    });

    res.json(events);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= CANCEL =================

const cancelRegistration = async (req, res) => {

  try {

    const { studentId, eventId } = req.params;

    const blockedStudent = await Student.findById(studentId).select("isBlocked");

    if (blockedStudent && respondIfBlocked(blockedStudent, res)) {
      return;
    }

    const registration =
      await Registration.findOneAndDelete({
        studentId,
        eventId
      });

    if (!registration) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    const event = await Event.findById(eventId);
    const student = await Student.findById(studentId);

    if (event && event.registeredUsers > 0) {
      event.registeredUsers -= 1;
      await event.save();
    }


    // ✅ CANCEL EMAIL

    if (student?.email) {

      const html =
        eventCancelTemplate({
          name: event.eventName,
          date: event.date,
          time: event.time,
          location: event.venue
        });

      await sendEmail(
        student.email,
        "Event Cancelled",
        html,
        { topic: "EVENT_CANCELLATION" }
      );

    } else {
      console.log("[MAIL][EVENT_CANCELLATION] Skipped — student email missing");
    }


    res.json({
      message: "Cancelled"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  checkRegistration,
  getStudentRegistrations,
  cancelRegistration,
};