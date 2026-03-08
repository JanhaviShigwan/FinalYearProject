const Event = require("../Models/Event");
const Student = require("../Models/Student");

exports.getDashboardData = async (req, res) => {
  try {

    const now = new Date();

    // Counts
    const totalEvents = await Event.countDocuments();
    const totalStudents = await Student.countDocuments();

    const upcomingEvents = await Event.countDocuments({
      date: { $gt: now }
    });

    const ongoingEvents = await Event.countDocuments({
      date: { $lte: now }
    });

    // Event lists
    const upcomingEventList = await Event.find({
      date: { $gt: now }
    }).limit(3);

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Student list (optional)
    const students = await Student.find().limit(5);

    res.json({
      totalEvents,
      totalStudents,
      upcomingEvents,
      ongoingEvents,
      upcomingEventList,
      recentEvents,
      students
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};