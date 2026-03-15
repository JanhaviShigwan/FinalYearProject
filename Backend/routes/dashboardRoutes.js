const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminDashboardData,
  getAdminReports,
  exportAdminReport,
  getDashboardData,
} = require("../controllers/dashboardController");

router.get("/admin/overview", adminAuth, getAdminDashboardData);
router.get("/admin/reports", adminAuth, getAdminReports);
router.get("/admin/reports/:reportId/export/:format", adminAuth, exportAdminReport);

router.get("/:studentId", getDashboardData);

module.exports = router;