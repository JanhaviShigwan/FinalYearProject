const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");

router.get("/dashboard/:studentId", getDashboardData);

module.exports = router;