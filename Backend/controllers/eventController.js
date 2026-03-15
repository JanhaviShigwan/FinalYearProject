const Event = require("../Models/Event");
const QRCode = require("qrcode");
const Registration = require("../Models/Registration");
const sendEmail = require("../utils/sendEmail");
const Student = require("../Models/Student");
const AdminSettings = require("../Models/AdminSettings");

const {
  eventRegisterTemplate,
  eventCancelTemplate,
} = require("../utils/template");

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


// GET all events
const getEvents = async (req, res) => {
  try {
    const settings = await getEventDefaultSettings();

    const events = await Event.find();
    const today = new Date();

    const eventsWithRegistrationDate = events.map(event => {

      const eventDate = new Date(event.date);

      const openDate = new Date(eventDate);
      openDate.setDate(
        eventDate.getDate() - settings.registrationOpenDaysBefore
      );

      const eventEnd = new Date(`${event.date} ${event.time}`);
      eventEnd.setHours(eventEnd.getHours() + 3);

      const isWithinWindow = today >= openDate && today <= eventEnd;
      const hasSlots = event.registeredUsers < event.totalCapacity;
      const registrationOpen = settings.autoCloseWhenFull
        ? isWithinWindow && hasSlots
        : isWithinWindow;

      return {
        ...event._doc,
        registrationOpenDate: openDate,
        registrationOpen,
      };

    });

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
    };

    const event = new Event(payload);
    const savedEvent = await event.save();

    res.status(201).json(savedEvent);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE event
const updateEvent = async (req, res) => {
  try {

    const { id } = req.params;

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

    if (student.role !== "admin" && !student.profileComplete) {
      return res.status(400).json({
        type: "PROFILE_INCOMPLETE",
        message: "Please complete your profile first"
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

    const eventDate = new Date(event.date);
    const today = new Date();

    const openDate = new Date(eventDate);
    openDate.setDate(
      eventDate.getDate() - settings.registrationOpenDaysBefore
    );

    const eventEnd = new Date(`${event.date} ${event.time}`);
    eventEnd.setHours(eventEnd.getHours() + 3);

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

    const emailHTML =
      eventRegisterTemplate({
        name: event.eventName,
        date: event.date,
        time: event.time,
        location: event.venue,
        capacity: event.totalCapacity - event.registeredUsers
      });


    if (student.notificationsEnabled) {

      await sendEmail(
        student.email,
        "Event Registration Confirmed",
        emailHTML
      );

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

    if (
      student &&
      student.notificationsEnabled
    ) {

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
        html
      );

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