const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminSettings,
  updateAdminSettings,
  updateAdminAccount,
  updateAdminPassword,
  sendTestAnnouncementEmail,
} = require("../controllers/adminSettingsController");

router.use(adminAuth);

router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);
router.patch("/settings/account", updateAdminAccount);
router.patch("/settings/password", updateAdminPassword);
router.post("/settings/test-email", sendTestAnnouncementEmail);

module.exports = router;