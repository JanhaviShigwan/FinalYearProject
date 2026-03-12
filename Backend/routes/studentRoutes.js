const express = require("express");
const router = express.Router();

const {
  getStudentProfile,
  completeProfile,
  uploadImage,
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



module.exports = router;