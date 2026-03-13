const Event = require("../Models/Event");
const QRCode = require("qrcode");
const Registration = require("../Models/Registration");
const eventTicketTemplate = require("../utils/eventTicketTemplate");
const sendEmail = require("../utils/sendEmail");
const Student = require("../Models/Student");


// GET all events
const getEvents = async (req, res) => {
  try {

    const events = await Event.find();

    const eventsWithRegistrationDate = events.map(event => {

      const eventDate = new Date(event.date);

      const openDate = new Date(eventDate);
      openDate.setDate(eventDate.getDate() - 14);

      return {
        ...event._doc,
        registrationOpenDate: openDate
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

    const event = new Event(req.body);
    const savedEvent = await event.save();

    res.status(201).json(savedEvent);

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

    if (!student.profileComplete) {
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


    const eventDate = new Date(event.date);
    const today = new Date();

    const openDate = new Date(eventDate);
    openDate.setDate(eventDate.getDate() - 14);

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


    // QR

    const qrData = JSON.stringify({
      ticketId: registration._id,
      event: event.eventName,
      student: student.name
    });


    const qrCodeImage = await QRCode.toDataURL(qrData, {
      width: 250,
      margin: 2
    });


    const emailHTML = eventTicketTemplate(
      student,
      event,
      qrCodeImage
    );


    // ✅ SEND EMAIL ONLY IF NOTIFICATIONS ENABLED

    if (student.notificationsEnabled) {

      await sendEmail(
        student.email,
        `Event Registration Confirmed - ${event.eventName}`,
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



// CANCEL

const cancelRegistration = async (req, res) => {

  try {

    const { studentId, eventId } = req.params;

    const registration = await Registration.findOneAndDelete({
      studentId,
      eventId
    });

    if (!registration) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    const event = await Event.findById(eventId);

    if (event && event.registeredUsers > 0) {
      event.registeredUsers -= 1;
      await event.save();
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
  registerForEvent,
  checkRegistration,
  getStudentRegistrations,
  cancelRegistration,
};