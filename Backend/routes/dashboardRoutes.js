const express = require("express");
const router = express.Router();

const {
  getDashboardData,
} = require("../controllers/dashboardController");

router.get("/:studentId", getDashboardData);

module.exports = router;