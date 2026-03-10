const Event = require("../Models/Event");
const Registration = require("../Models/Registration");
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
    const event = await Event.findOne({ _id: req.params.id });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
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

const registerForEvent = async (req, res) => {
  try {

    const { studentId } = req.body;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    const student = await Student.findById(studentId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // PROFILE CHECK
    if (!student.profileComplete) {
      return res.status(400).json({
        type: "PROFILE_INCOMPLETE",
        message: "Please complete your profile first"
      });
    }

    // DUPLICATE CHECK
    const existing = await Registration.findOne({
      studentId,
      eventId
    });

    if (existing) {
      return res.status(400).json({
        type: "ALREADY_REGISTERED",
        message: "You already registered for this event"
      });
    }

    // DATE CHECK
    const eventDate = new Date(event.date);
    const today = new Date();

    // Registration opens 14 days before event
    const openDate = new Date(eventDate);
    openDate.setDate(eventDate.getDate() - 14);

    // Event end time
    const eventEnd = new Date(`${event.date} ${event.time}`);
    eventEnd.setHours(eventEnd.getHours() + 3); // assume event lasts 3 hours

    if (today < openDate) {
      return res.status(400).json({
        type: "REGISTRATION_NOT_OPEN",
        message: "Registration opens 14 days before the event"
      });
    }

    if (today > eventEnd) {
      return res.status(400).json({
        type: "EVENT_ENDED",
        message: "Event has already ended"
      });
    }

    // CAPACITY CHECK
    if (event.registeredUsers >= event.totalCapacity) {
      return res.status(400).json({
        type: "EVENT_FULL",
        message: "Event is full"
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

    res.json({
      type: "SUCCESS",
      message: "Successfully registered"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    res.status(500).json({ message: error.message });
  }

};
const getStudentRegistrations = async (req, res) => {

  try {

    const { studentId } = req.params;

    // Find all registrations for this student
    const registrations = await Registration.find({ studentId });

    // Extract eventIds
    const eventIds = registrations.map(r => r.eventId);

    // Find matching events
    const events = await Event.find({
      _id: { $in: eventIds }
    });

    res.json(events);

  } catch (error) {

    console.error("Get registrations error:", error);
    res.status(500).json({ message: error.message });

  }

};

const cancelRegistration = async (req, res) => {

  try {

    const { studentId, eventId } = req.params;

    const registration = await Registration.findOneAndDelete({
      studentId,
      eventId
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const event = await Event.findById(eventId);

    if (event && event.registeredUsers > 0) {
      event.registeredUsers -= 1;
      await event.save();
    }

    res.json({ message: "Registration cancelled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  checkRegistration,
  registerForEvent,
  getStudentRegistrations,
  cancelRegistration
};