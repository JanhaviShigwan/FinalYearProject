const Registration = require("../Models/Registration");
const Event = require("../Models/Event");
const Student = require("../Models/Student");


// ── POST /api/attendance/mark ─────────────────────────────────────────────
// Body: { qrData: "<JSON string encoded in QR>" }
// Called by admin scanner page after a successful scan.

const markAttendance = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ message: "QR data is required" });
    }

    let parsed;
    try {
      parsed = typeof qrData === "string" ? JSON.parse(qrData) : qrData;
    } catch {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    const { studentId, eventId } = parsed;

    if (!studentId || !eventId) {
      return res.status(400).json({ message: "QR code is missing required fields" });
    }

    // Verify event exists
    const event = await Event.findById(eventId).select("eventName date venue");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Verify student exists
    const student = await Student.findById(studentId).select("name email");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find registration
    const registration = await Registration.findOne({ studentId, eventId });
    if (!registration) {
      return res.status(404).json({ message: "Student is not registered for this event" });
    }

    // Prevent double-marking
    if (registration.attendanceMarked) {
      return res.status(409).json({
        message: "Attendance already marked",
        attendanceTime: registration.attendanceTime,
        studentName: student.name,
        eventName: event.eventName,
      });
    }

    registration.attendanceMarked = true;
    registration.attendanceTime = new Date();
    await registration.save();

    return res.status(200).json({
      message: "Attendance marked successfully",
      studentName: student.name,
      eventName: event.eventName,
      attendanceTime: registration.attendanceTime,
    });

  } catch (error) {
    console.error("[Attendance] markAttendance error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};


// ── GET /api/attendance/registrations ────────────────────────────────────
// Query: ?eventId=xxx (optional filter)
// Returns all registrations visible to admin, with student + event info.

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.query;

    const query = {};
    if (eventId) {
      query.eventId = eventId;
    }

    const registrations = await Registration.find(query)
      .populate("studentId", "name email studentId")
      .sort({ registeredAt: -1 });

    // Gather unique event IDs and fetch event data
    const eventIds = [...new Set(registrations.map((r) => String(r.eventId)).filter(Boolean))];
    const events = await Event.find({ _id: { $in: eventIds } }).select("eventName date venue");
    const eventMap = events.reduce((acc, e) => {
      acc[String(e._id)] = e;
      return acc;
    }, {});

    const result = registrations.map((r) => ({
      _id: r._id,
      student: r.studentId,
      event: eventMap[String(r.eventId)] || null,
      registeredAt: r.registeredAt,
      attendanceMarked: r.attendanceMarked,
      attendanceTime: r.attendanceTime,
    }));

    return res.status(200).json(result);

  } catch (error) {
    console.error("[Attendance] getEventRegistrations error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = { markAttendance, getEventRegistrations };
