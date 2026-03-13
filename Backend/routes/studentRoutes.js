const express = require("express");
const router = express.Router();

const {
  getStudentProfile,
  completeProfile,
  uploadImage,
  updateNotifications,
  changePassword,

  deleteAccount,
  getLoginActivity,

} = require("../controllers/studentController");

const upload = require("../config/multer");


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