const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminSettings,
  updateAdminSettings,
  updateAdminAccount,
  updateAdminPassword,
} = require("../controllers/adminSettingsController");

router.use(adminAuth);

router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);
router.patch("/settings/account", updateAdminAccount);
router.patch("/settings/password", updateAdminPassword);

module.exports = router;