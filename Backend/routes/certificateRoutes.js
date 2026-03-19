const express = require("express");
const router = express.Router();

const { downloadCertificate } = require("../controllers/certificateController");

router.get("/:eventId", downloadCertificate);

module.exports = router;
