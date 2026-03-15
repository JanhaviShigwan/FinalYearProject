const express = require("express");
const router = express.Router();

const {
  getAdminDashboardData,
  getDashboardData,
} = require("../controllers/dashboardController");

router.get("/admin/overview", getAdminDashboardData);

router.get("/:studentId", getDashboardData);

module.exports = router;