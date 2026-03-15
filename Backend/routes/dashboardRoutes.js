const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminDashboardData,
  getDashboardData,
} = require("../controllers/dashboardController");

router.get("/admin/overview", adminAuth, getAdminDashboardData);

router.get("/:studentId", getDashboardData);

module.exports = router;