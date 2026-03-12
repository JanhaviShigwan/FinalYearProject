const Student = require("../Models/Student");



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

    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Only image files allowed",
      });
    }

    student.profileImage =
      "/uploads/" + req.file.filename;

    await student.save();

    res.status(200).json(student);

  } catch (error) {

    console.log("Upload Image Error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }

};