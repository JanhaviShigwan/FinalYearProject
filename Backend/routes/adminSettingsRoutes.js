const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminSettings,
  updateAdminSettings,
  updateAdminAccount,
  updateAdminPassword,
  getEventsWithFeedback,
} = require("../controllers/adminSettingsController");

router.use(adminAuth);

router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);
router.patch("/settings/account", updateAdminAccount);
router.patch("/settings/password", updateAdminPassword);
router.get("/events-with-feedback", getEventsWithFeedback);

module.exports = router;