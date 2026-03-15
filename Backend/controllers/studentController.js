const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/sendEmail");

const {
  passwordChangedTemplate,
} = require("../utils/template");


/* ============================= */
/* GET STUDENT PROFILE */
/* ============================= */

exports.getStudentProfile = async (req, res) => {
  try {

    const { studentId } = req.params;

    const student = await Student
      .findById(studentId)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);

  } catch (error) {

    console.log("Fetch Profile Error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



/* ============================= */
/* COMPLETE PROFILE */
/* ============================= */

exports.completeProfile = async (req, res) => {
  try {

    const { studentId } = req.params;

    const {
      studentIdNumber,
      phone,
      department,
      college,
      year,
      course,
      division,
      gender,
      dob,
    } = req.body;


    const existing = await Student.findOne({
      studentId: studentIdNumber,
      _id: { $ne: studentId },
    });

    if (existing) {
      return res.status(400).json({
        message: "Student ID already exists",
      });
    }


    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    student.studentId = studentIdNumber;
    student.phone = phone;
    student.department = department;
    student.college = college;
    student.year = year;
    student.course = course;
    student.division = division;
    student.gender = gender;
    student.dob = dob;

    student.profileComplete = true;

    await student.save();

    res.status(200).json({
      message: "Profile completed successfully",
      student,
    });

  } catch (error) {

    console.log("Complete Profile Error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



/* ============================= */
/* UPLOAD PROFILE IMAGE */
/* ============================= */

exports.uploadImage = async (req, res) => {

  try {

    const { image } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { profileImage: image },
      { new: true }
    );

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }

};



/* ============================= */
/* UPDATE NOTIFICATION SETTINGS */
/* ============================= */

exports.updateNotifications = async (req, res) => {

  try {

    const { studentId } = req.params;

    const { notificationsEnabled } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.notificationsEnabled = notificationsEnabled;

    await student.save();

    res.status(200).json({
      message: "Notification preference updated",
      notificationsEnabled: student.notificationsEnabled,
    });

  } catch (error) {

    console.log("Notification update error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }

};



/* ============================= */
/* CHANGE PASSWORD */
/* ============================= */

exports.changePassword = async (req, res) => {
  try {

    const { studentId } = req.params;

    const {
      currentPassword,
      oldPassword,
      password,
      newPassword,
    } = req.body;

    // ✅ support multiple field names
    const oldPass =
      currentPassword ||
      oldPassword ||
      password;

    if (!oldPass || !newPassword) {
      return res.status(400).json({
        message: "Password fields missing",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    // ✅ correct compare

    const isMatch = await bcrypt.compare(
      oldPass,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }


    // prevent same password

    const samePassword = await bcrypt.compare(
      newPassword,
      student.password
    );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password should not be same as current password",
      });
    }


    if (newPassword.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
    }


    const salt = await bcrypt.genSalt(10);

    student.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await student.save();


    // ✅ EMAIL

    await sendEmail(
      student.email,
      "Password Changed",
      passwordChangedTemplate()
    );


    res.json({
      message: "Password changed successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }
};



/* ============================= */
/* DELETE ACCOUNT */
/* ============================= */

exports.deleteAccount = async (req, res) => {
  try {

    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(studentId);

    res.status(200).json({
      message: "Account deleted successfully",
    });

  } catch (error) {

    console.log("Delete account error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



/* ============================= */
/* GET LOGIN ACTIVITY */
/* ============================= */

exports.getLoginActivity = async (req, res) => {

  try {

    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(
      student.loginActivity
    );

  } catch (error) {

    console.log("Login activity error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }

};