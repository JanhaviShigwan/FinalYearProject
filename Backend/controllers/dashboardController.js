const Event = require("../Models/Event");
const Registration = require("../Models/Registration");
const Announcement = require("../Models/Announcement");
const Student = require("../Models/Student");
const EventReport = require("../Models/EventReport");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");
const { URL } = require("url");
const PDFDocument = require("pdfkit");

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

const parseEventEndDate = (event) => {
  if (!event?.date) {
    return null;
  }

  const startDate = new Date(`${event.date}T00:00:00`);

  if (Number.isNaN(startDate.getTime())) {
    const fallbackDate = new Date(event.date);

    if (Number.isNaN(fallbackDate.getTime())) {
      return null;
    }

    fallbackDate.setHours(23, 59, 59, 999);
    return fallbackDate;
  }

  const parsedTime = parseEventTime(event.time);

  if (parsedTime) {
    startDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  } else {
    startDate.setHours(23, 59, 59, 999);
  }

  // Keep the same event window logic used in registration checks.
  startDate.setHours(startDate.getHours() + 3);
  return startDate;
};

const getSortedBreakdown = (mapObj) => {
  return Object.entries(mapObj)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

const sanitizeFilename = (value, fallback) => {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || fallback;
};

const csvEscape = (value) => {
  const raw = value === undefined || value === null ? "" : String(value);
  const escaped = raw.replace(/"/g, '""');

  if (/[,\n"]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
};

const formatBreakdown = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "N/A";
  }

  return items
    .map((item) => `${item?.name || "Unknown"} (${item?.count || 0})`)
    .join(" | ");
};

const downloadImageBuffer = (imageUrl, redirectCount = 0) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof imageUrl !== "string") {
      reject(new Error("Invalid image URL"));
      return;
    }

    let parsed;
    try {
      parsed = new URL(imageUrl);
    } catch (error) {
      reject(new Error("Invalid image URL"));
      return;
    }

    const protocol = parsed.protocol;
    const client = protocol === "https:" ? https : protocol === "http:" ? http : null;

    if (!client) {
      reject(new Error("Unsupported image protocol"));
      return;
    }

    const request = client.get(parsed, (response) => {
      const statusCode = response.statusCode || 0;

      if ([301, 302, 307, 308].includes(statusCode)) {
        if (redirectCount >= 3 || !response.headers.location) {
          reject(new Error("Too many image redirects"));
          return;
        }

        const redirectUrl = new URL(response.headers.location, parsed).toString();
        response.resume();
        downloadImageBuffer(redirectUrl, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (statusCode < 200 || statusCode >= 300) {
        response.resume();
        reject(new Error("Unable to download report image"));
        return;
      }

      const chunks = [];
      let size = 0;
      const maxSizeInBytes = 5 * 1024 * 1024;

      response.on("data", (chunk) => {
        size += chunk.length;

        if (size > maxSizeInBytes) {
          request.destroy(new Error("Image too large"));
          return;
        }

        chunks.push(chunk);
      });

      response.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      response.on("error", reject);
    });

    request.on("error", reject);
  });
};

const streamCsvReport = (report, res) => {
  const csvHeaders = [
    "Report ID",
    "Event Name",
    "Category",
    "Venue",
    "Date",
    "Time",
    "Short Description",
    "Long Description",
    "Event Image",
    "Total Capacity",
    "Registrations",
    "Fill Rate (%)",
    "Top Department",
    "Total Participants",
    "Departments",
    "Years",
    "Genders",
    "Event Ended At",
    "Last Synced At",
  ];

  const row = [
    report._id,
    report.eventName,
    report.category,
    report.venue,
    report.date,
    report.time,
    report.shortDescription,
    report.longDescription,
    report.eventImage,
    report.totalCapacity,
    report.registrationCount,
    report.fillRatePercent,
    report.topDepartment,
    report.participantStats?.totalParticipants || 0,
    formatBreakdown(report.participantStats?.departments),
    formatBreakdown(report.participantStats?.years),
    formatBreakdown(report.participantStats?.genders),
    report.eventEndedAt ? new Date(report.eventEndedAt).toISOString() : "",
    report.lastSyncedAt ? new Date(report.lastSyncedAt).toISOString() : "",
  ];

  const csvBody = `${csvHeaders.map(csvEscape).join(",")}\n${row.map(csvEscape).join(",")}\n`;
  const filename = `${sanitizeFilename(report.eventName, "event-report")}-${report._id}`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
  res.status(200).send(csvBody);
};

const streamPdfReport = async (report, res) => {
  const filename = `${sanitizeFilename(report.eventName, "event-report")}-${report._id}`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  doc.pipe(res);

  doc
    .fontSize(22)
    .fillColor("#1f2937")
    .text(report.eventName || "Event Report", { align: "left" });

  doc
    .moveDown(0.25)
    .fontSize(10)
    .fillColor("#6b7280")
    .text(`Report ID: ${report._id}`)
    .text(`Generated At: ${new Date().toLocaleString()}`)
    .text(`Last Synced At: ${report.lastSyncedAt ? new Date(report.lastSyncedAt).toLocaleString() : "N/A"}`);

  doc.moveDown(0.8);
  doc
    .fontSize(13)
    .fillColor("#111827")
    .text("Event Details", { underline: true });

  doc
    .moveDown(0.35)
    .fontSize(11)
    .fillColor("#1f2937")
    .text(`Category: ${report.category || "N/A"}`)
    .text(`Venue: ${report.venue || "N/A"}`)
    .text(`Date & Time: ${report.date || "N/A"} ${report.time || ""}`)
    .text(`Short Description: ${report.shortDescription || "N/A"}`)
    .text(`Long Description: ${report.longDescription || "N/A"}`);

  doc.moveDown(0.8);
  doc
    .fontSize(13)
    .fillColor("#111827")
    .text("Report Metrics", { underline: true });

  doc
    .moveDown(0.35)
    .fontSize(11)
    .fillColor("#1f2937")
    .text(`Total Capacity: ${report.totalCapacity || 0}`)
    .text(`Registrations: ${report.registrationCount || 0}`)
    .text(`Fill Rate: ${report.fillRatePercent || 0}%`)
    .text(`Top Department: ${report.topDepartment || "N/A"}`)
    .text(`Total Participants: ${report.participantStats?.totalParticipants || 0}`)
    .text(`Departments: ${formatBreakdown(report.participantStats?.departments)}`)
    .text(`Years: ${formatBreakdown(report.participantStats?.years)}`)
    .text(`Genders: ${formatBreakdown(report.participantStats?.genders)}`);

  doc.moveDown(0.8);
  doc
    .fontSize(13)
    .fillColor("#111827")
    .text("Event Image", { underline: true });

  if (report.eventImage) {
    try {
      const imageBuffer = await downloadImageBuffer(report.eventImage);

      doc.moveDown(0.4);
      doc.image(imageBuffer, {
        fit: [500, 250],
        align: "left",
      });
    } catch (error) {
      doc
        .moveDown(0.35)
        .fontSize(10)
        .fillColor("#b91c1c")
        .text("Unable to embed event image in this PDF.")
        .fillColor("#2563eb")
        .text(report.eventImage, {
          link: report.eventImage,
          underline: true,
        });
    }
  } else {
    doc
      .moveDown(0.35)
      .fontSize(10)
      .fillColor("#6b7280")
      .text("No event image available.");
  }

  doc.end();
};

const buildEventReportPayload = async (event) => {
  const registrations = await Registration.find({ eventId: event._id }).select("studentId");

  const participantIds = registrations
    .map((item) => item.studentId)
    .filter(Boolean);

  const uniqueParticipantIds = [...new Set(participantIds.map((id) => id.toString()))]
    .map((id) => new mongoose.Types.ObjectId(id));

  const participants = uniqueParticipantIds.length > 0
    ? await Student.find({ _id: { $in: uniqueParticipantIds } }).select("department year gender")
    : [];

  const departments = {};
  const years = {};
  const genders = {};

  participants.forEach((student) => {
    const department = student.department || "Unspecified";
    const year = student.year || "Unspecified";
    const gender = student.gender || "Unspecified";

    departments[department] = (departments[department] || 0) + 1;
    years[year] = (years[year] || 0) + 1;
    genders[gender] = (genders[gender] || 0) + 1;
  });

  const registrationCount = registrations.length;
  const totalCapacity = Number(event.totalCapacity) || 0;
  const fillRatePercent =
    totalCapacity > 0
      ? Math.round((registrationCount / totalCapacity) * 100)
      : 0;

  const departmentBreakdown = getSortedBreakdown(departments);
  const yearBreakdown = getSortedBreakdown(years);
  const genderBreakdown = getSortedBreakdown(genders);

  return {
    eventName: event.eventName || "Event",
    shortDescription: event.shortDescription || "",
    longDescription: event.longDescription || "",
    category: event.category || "",
    venue: event.venue || "",
    date: event.date || "",
    time: event.time || "",
    eventImage: event.eventImage || "",
    totalCapacity,
    registrationCount,
    fillRatePercent,
    topDepartment: departmentBreakdown[0]?.name || "N/A",
    participantStats: {
      totalParticipants: participants.length,
      departments: departmentBreakdown,
      years: yearBreakdown,
      genders: genderBreakdown,
    },
  };
};

const syncEndedEventReports = async () => {
  const events = await Event.find().select(
    "_id eventName shortDescription longDescription category venue date time eventImage totalCapacity"
  );

  const now = new Date();
  let syncedCount = 0;

  for (const event of events) {
    const eventEndedAt = parseEventEndDate(event);

    if (!eventEndedAt || eventEndedAt > now) {
      continue;
    }

    const payload = await buildEventReportPayload(event);

    await EventReport.findOneAndUpdate(
      { eventId: event._id },
      {
        $set: {
          ...payload,
          eventEndedAt,
          lastSyncedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    syncedCount += 1;
  }

  return syncedCount;
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
    const syncedReportsCount = await syncEndedEventReports();

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

    const recentEventReports = await EventReport.find()
      .sort({ eventEndedAt: -1 })
      .limit(6)
      .select(
        "eventId eventName shortDescription longDescription category venue date time eventImage totalCapacity registrationCount fillRatePercent topDepartment eventEndedAt lastSyncedAt participantStats"
      );

    const totalGeneratedReports = await EventReport.countDocuments();

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
      eventReports: recentEventReports,
      reportSyncMeta: {
        totalGeneratedReports,
        syncedReportsCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminReports = async (req, res) => {
  try {
    await syncEndedEventReports();

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const match = query
      ? {
          $or: [
            { eventName: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { venue: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const [reports, total] = await Promise.all([
      EventReport.find(match)
        .sort({ eventEndedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      EventReport.countDocuments(match),
    ]);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.exportAdminReport = async (req, res) => {
  try {
    const { reportId, format } = req.params;

    const report = await EventReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (format === "csv") {
      streamCsvReport(report, res);
      return;
    }

    if (format === "pdf") {
      await streamPdfReport(report, res);
      return;
    }

    res.status(400).json({ message: "Unsupported export format" });
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