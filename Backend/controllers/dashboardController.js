const Event = require("../Models/Event");
const Registration = require("../Models/Registration");
const Announcement = require("../Models/Announcement");
const Student = require("../Models/Student");
const mongoose = require("mongoose");

const STUDENT_ROLE_FILTER = {
  $or: [
    { role: "student" },
    { role: { $exists: false } },
    { role: null },
  ],
};

const getDateWindow = (days) => {
  const end = new Date();
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);

  return { start, end };
};

const getPreviousDateWindow = (start, days) => {
  const previousEnd = new Date(start);
  previousEnd.setMilliseconds(-1);

  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - days);

  return { previousStart, previousEnd };
};

const calculateTrend = (current, previous) => {
  if (previous === 0 && current === 0) {
    return { percent: 0, direction: "neutral" };
  }

  if (previous === 0) {
    return { percent: 100, direction: "up" };
  }

  const raw = Math.round(((current - previous) / previous) * 100);

  if (raw > 0) return { percent: raw, direction: "up" };
  if (raw < 0) return { percent: raw, direction: "down" };

  return { percent: 0, direction: "neutral" };
};

const buildDailySeries = async (Model, baseMatch, days) => {
  const { start, end } = getDateWindow(days);

  const match = {
    ...baseMatch,
    createdAt: { $gte: start, $lte: end },
  };

  const aggregateRows = await Model.aggregate([
    { $match: match },
    {
      $project: {
        day: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
      },
    },
    {
      $group: {
        _id: "$day",
        value: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const valueMap = new Map(aggregateRows.map((item) => [item._id, item.value]));

  const points = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);

    points.push({
      key,
      label: cursor.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: valueMap.get(key) || 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
};

exports.getAdminDashboardData = async (req, res) => {
  try {
    const parsedRangeDays = Number(req.query.rangeDays);
    const hasRangeFilter = Number.isFinite(parsedRangeDays) && parsedRangeDays > 0;
    const rangeDays = hasRangeFilter ? parsedRangeDays : null;

    const rangeMatch = hasRangeFilter
      ? { createdAt: { $gte: getDateWindow(rangeDays).start, $lte: getDateWindow(rangeDays).end } }
      : {};

    const [
      totalEvents,
      totalRegistrations,
      totalAnnouncements,
      totalStudents,
    ] = await Promise.all([
      Event.countDocuments(rangeMatch),
      Registration.countDocuments(rangeMatch),
      Announcement.countDocuments(rangeMatch),
      Student.countDocuments({
        ...STUDENT_ROLE_FILTER,
        ...rangeMatch,
      }),
    ]);

    const trendDays = hasRangeFilter ? rangeDays : 30;
    const trendCurrentWindow = getDateWindow(trendDays);
    const trendPreviousWindow = getPreviousDateWindow(trendCurrentWindow.start, trendDays);

    const [
      eventsCurrent,
      eventsPrevious,
      registrationsCurrent,
      registrationsPrevious,
      announcementsCurrent,
      announcementsPrevious,
      studentsCurrent,
      studentsPrevious,
    ] = await Promise.all([
      Event.countDocuments({
        createdAt: {
          $gte: trendCurrentWindow.start,
          $lte: trendCurrentWindow.end,
        },
      }),
      Event.countDocuments({
        createdAt: {
          $gte: trendPreviousWindow.previousStart,
          $lte: trendPreviousWindow.previousEnd,
        },
      }),
      Registration.countDocuments({
        createdAt: {
          $gte: trendCurrentWindow.start,
          $lte: trendCurrentWindow.end,
        },
      }),
      Registration.countDocuments({
        createdAt: {
          $gte: trendPreviousWindow.previousStart,
          $lte: trendPreviousWindow.previousEnd,
        },
      }),
      Announcement.countDocuments({
        createdAt: {
          $gte: trendCurrentWindow.start,
          $lte: trendCurrentWindow.end,
        },
      }),
      Announcement.countDocuments({
        createdAt: {
          $gte: trendPreviousWindow.previousStart,
          $lte: trendPreviousWindow.previousEnd,
        },
      }),
      Student.countDocuments({
        ...STUDENT_ROLE_FILTER,
        createdAt: {
          $gte: trendCurrentWindow.start,
          $lte: trendCurrentWindow.end,
        },
      }),
      Student.countDocuments({
        ...STUDENT_ROLE_FILTER,
        createdAt: {
          $gte: trendPreviousWindow.previousStart,
          $lte: trendPreviousWindow.previousEnd,
        },
      }),
    ]);

    const chartDays = hasRangeFilter ? rangeDays : 30;

    const [
      eventSeries,
      registrationSeries,
      announcementSeries,
      studentSeries,
    ] = await Promise.all([
      buildDailySeries(Event, {}, chartDays),
      buildDailySeries(Registration, {}, chartDays),
      buildDailySeries(Announcement, {}, chartDays),
      buildDailySeries(Student, STUDENT_ROLE_FILTER, chartDays),
    ]);

    const recentRegistrations = await Registration.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventData",
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $project: {
          _id: 1,
          eventName: {
            $ifNull: [
              { $arrayElemAt: ["$eventData.eventName", 0] },
              "Event",
            ],
          },
          studentName: {
            $ifNull: [
              { $arrayElemAt: ["$studentData.name", 0] },
              "Student",
            ],
          },
          registeredAt: { $ifNull: ["$createdAt", "$registeredAt"] },
        },
      },
    ]);

    res.json({
      stats: {
        totalEvents,
        totalStudents,
        totalRegistrations,
        totalAnnouncements,
      },
      trends: {
        totalEvents: calculateTrend(eventsCurrent, eventsPrevious),
        totalStudents: calculateTrend(studentsCurrent, studentsPrevious),
        totalRegistrations: calculateTrend(registrationsCurrent, registrationsPrevious),
        totalAnnouncements: calculateTrend(announcementsCurrent, announcementsPrevious),
      },
      chartSeries: {
        events: eventSeries,
        students: studentSeries,
        registrations: registrationSeries,
        announcements: announcementSeries,
      },
      filterMeta: {
        rangeDays,
        trendDays,
        chartDays,
      },
      recentRegistrations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

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