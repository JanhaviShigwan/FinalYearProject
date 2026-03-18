const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,

  getStudentProfile,
  completeProfile,
  updatePhoneNumber,
  uploadImage,
  updateNotifications,
  changePassword,

  deleteAccount,
  getLoginActivity,

} = require("../controllers/studentController");

const upload = require("../config/multer");


/* ========================= */
/* ADMIN - USERS MANAGEMENT */
/* ========================= */

router.get(
  "/admin/users",
  adminAuth,
  getAdminUsers
);

router.get(
  "/admin/users/:studentId",
  adminAuth,
  getAdminUserById
);

router.patch(
  "/admin/users/:studentId",
  adminAuth,
  updateAdminUser
);

router.delete(
  "/admin/users/:studentId",
  adminAuth,
  deleteAdminUser
);


/* ========================= */
/* GET STUDENT PROFILE */
/* ========================= */

router.get(
  "/:studentId",
  getStudentProfile
);


/* ========================= */
/* COMPLETE PROFILE */
/* ========================= */

router.put(
  "/complete-profile/:studentId",
  completeProfile
);


/* ========================= */
/* UPDATE PHONE NUMBER ONLY */
/* ========================= */

router.put(
  "/update-phone",
  updatePhoneNumber
);


/* ========================= */
/* UPLOAD PROFILE IMAGE */
/* ========================= */

router.post(
  "/upload-image/:studentId",
  upload.single("image"),
  uploadImage
);


/* ========================= */
/* UPDATE NOTIFICATION SETTINGS */
/* ========================= */

router.put(
  "/notifications/:studentId",
  updateNotifications
);


/* ========================= */
/* CHANGE PASSWORD */
/* ========================= */

router.put(
  "/change-password/:studentId",
  changePassword
);


/* ========================= */
/* DELETE ACCOUNT */
/* ========================= */

router.delete(
  "/delete/:studentId",
  deleteAccount
);


/* ========================= */
/* LOGIN ACTIVITY */
/* ========================= */

router.get(
  "/login-activity/:studentId",
  getLoginActivity
);


module.exports = router;