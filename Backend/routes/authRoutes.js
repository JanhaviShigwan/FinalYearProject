// routes/authRoutes.js

const express = require("express");

const router = express.Router();

const {
  registerStudent,
  loginStudent,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");


router.post("/register", registerStudent);

router.post("/login", loginStudent);

// ✅ new

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);


module.exports = router;