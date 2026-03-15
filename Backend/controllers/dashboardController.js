const Event = require("../Models/Event");
const Registration = require("../Models/Registration");
const mongoose = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {

    const { studentId } = req.params;

    const now = new Date();

    // ================= MY EVENTS =================

    const myRegistrations = await Registration.find({
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    const myEvents = myRegistrations.length;


    // ================= GET ALL EVENTS =================

    const events = await Event.find();


    // convert string date -> real date

    const upcomingEventsList = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate > now;
    });

    const ongoingEventsList = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate <= now;
    });


    const upcomingEvents = upcomingEventsList.length;
    const ongoingEvents = ongoingEventsList.length;


    res.json({
      myEvents,
      upcomingEvents,
      ongoingEvents,
      upcomingEventList: upcomingEventsList,
      ongoingEventList: ongoingEventsList,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};