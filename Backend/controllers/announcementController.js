const Announcement = require("../Models/Announcement");
const Student = require("../Models/Student");
const AdminSettings = require("../Models/AdminSettings");
const sendEmail = require("../utils/sendEmail");
const { announcementTemplate } = require("../utils/template");


// GET all announcements

exports.getAnnouncements = async (req, res) => {
  try {

    const announcements = await Announcement.find().sort({
      createdAt: -1,
    });

    res.json(announcements);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE announcement

exports.createAnnouncement = async (req, res) => {
  try {

    const { title, message } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const newAnnouncement = new Announcement({
      title: title.trim(),
      message: message.trim(),
    });

    const saved = await newAnnouncement.save();

    let emailedCount = 0;
    let emailFailedCount = 0;
    let emailRecipientCount = 0;

    try {
      const settings = await AdminSettings
        .findOne({ key: "global" })
        .select("announcementSettings");

      const announcementSettings = settings?.announcementSettings || {};

      if (announcementSettings.enableAnnouncementEmails === false) {
        return res.json({
          ...saved.toObject(),
          emailedCount,
          emailFailedCount,
          emailRecipientCount,
          emailBroadcastDisabled: true,
        });
      }

      const students = await Student.find({
        $or: [{ role: "student" }, { role: { $exists: false } }, { role: null }],
        email: { $exists: true, $ne: null },
      }).select("email");

      emailRecipientCount = students.length;

      if (students.length > 0) {
        const subjectPrefix =
          announcementSettings.defaultEmailSubject || "EventSphere Announcement";

        const signature =
          announcementSettings.defaultEmailSignature || "EventSphere Admin Team";

        const messageWithSignature = `${saved.message}<br/><br/>${signature}`;

        const emailHtml = announcementTemplate({
          title: saved.title,
          message: messageWithSignature,
          createdAt: new Date(saved.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        const results = await Promise.allSettled(
          students.map((student) =>
            sendEmail(
              student.email,
              `${subjectPrefix}: ${saved.title}`,
              emailHtml
            )
          )
        );

        emailedCount = results.filter(
          (r) => r.status === "fulfilled" && r.value === true
        ).length;
        emailFailedCount = students.length - emailedCount;
      }
    } catch (emailErr) {
      console.error("Announcement email broadcast error:", emailErr);
    }

    res.json({
      ...saved.toObject(),
      emailedCount,
      emailFailedCount,
      emailRecipientCount,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE announcement

exports.deleteAnnouncement = async (req, res) => {
  try {

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};