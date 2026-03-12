const express = require("express");

const router = express.Router();

const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");


// GET
router.get("/", getAnnouncements);


// POST
router.post("/", createAnnouncement);


// DELETE
router.delete("/:id", deleteAnnouncement);


module.exports = router;