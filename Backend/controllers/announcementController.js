const Announcement = require("../Models/Announcement");


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

    const newAnnouncement = new Announcement({
      title,
      message,
    });

    const saved = await newAnnouncement.save();

    res.json(saved);

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