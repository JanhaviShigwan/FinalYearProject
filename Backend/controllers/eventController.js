const Event = require("../Models/Event");

// GET all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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

module.exports = {
  getEvents,
  getEventById,
  createEvent
};