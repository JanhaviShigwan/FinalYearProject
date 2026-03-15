const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");


// GET
router.get("/", getAnnouncements);


// POST
router.post("/", adminAuth, createAnnouncement);


// DELETE
router.delete("/:id", adminAuth, deleteAnnouncement);


module.exports = router;