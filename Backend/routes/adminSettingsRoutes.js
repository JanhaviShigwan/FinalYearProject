const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminSettings,
  updateAdminSettings,
  updateAdminAccount,
  updateAdminPassword,
  updateNotificationPreferences,
  blockUser,
  unblockUser,
  getEventsWithFeedback,
  getEventReport,
} = require("../controllers/adminSettingsController");

router.use(adminAuth);

router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);
router.put("/notification-preferences", updateNotificationPreferences);
router.put("/block-user", blockUser);
router.put("/unblock-user", unblockUser);
router.patch("/settings/account", updateAdminAccount);
router.patch("/settings/password", updateAdminPassword);
router.get("/events-with-feedback", getEventsWithFeedback);
router.get("/event-report/:eventId", getEventReport);

module.exports = router;