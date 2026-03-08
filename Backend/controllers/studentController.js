const Student = require("../Models/Student");

// Get current student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);

  } catch (error) {
    console.log("Fetch Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Complete / Update profile
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
      dob
    } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fields
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
      student
    });

  } catch (error) {
    console.log("Complete Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};