const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/sendEmail");

const {
  passwordChangedTemplate,
} = require("../utils/template");

const syncAdminProfileComplete = async (student) => {
  if (!student || student.role !== "admin" || student.profileComplete) {
    return student;
  }

  student.profileComplete = true;
  await Student.findByIdAndUpdate(student._id, {
    $set: { profileComplete: true },
  });

  return student;
};


/* ============================= */
/* ADMIN - LIST USERS */
/* ============================= */

exports.getAdminUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "all",
      year = "all",
      department = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const query = {};

    if (role === "student") {
      query.$or = [
        { role: "student" },
        { role: { $exists: false } },
        { role: null },
      ];
    } else if (role === "admin") {
      query.role = "admin";
    }

    if (year !== "all") {
      query.year = year;
    }

    if (department !== "all") {
      query.department = department;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: regex },
          { email: regex },
          { studentId: regex },
          { course: regex },
          { division: regex },
        ],
      });
    }

    await Student.updateMany(
      {
        role: "admin",
        $or: [
          { profileComplete: false },
          { profileComplete: { $exists: false } },
          { profileComplete: null },
        ],
      },
      {
        $set: { profileComplete: true },
      }
    );

    const [users, total] = await Promise.all([
      Student.find(query)
        .select("-password -resetOTP -resetOTPExpire")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Student.countDocuments(query),
    ]);

    res.status(200).json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(Math.ceil(total / limitNum), 1),
      },
    });
  } catch (error) {
    console.log("Admin users fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================= */
/* ADMIN - GET USER BY ID */
/* ============================= */

exports.getAdminUserById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const user = await Student.findById(studentId)
      .select("-password -resetOTP -resetOTPExpire");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await syncAdminProfileComplete(user);

    res.status(200).json(user);
  } catch (error) {
    console.log("Admin user fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================= */
/* ADMIN - UPDATE USER */
/* ============================= */

exports.updateAdminUser = async (req, res) => {
  try {
    const { studentId } = req.params;

    const existingUser = await Student.findById(studentId).select("role profileComplete");

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedFields = [
      "name",
      "email",
      "role",
      "phone",
      "department",
      "year",
      "course",
      "division",
      "notificationsEnabled",
      "profileComplete",
      "emailPreferences",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const targetRole = updates.role || existingUser.role;

    if (targetRole === "admin") {
      updates.profileComplete = true;
    }

    const updatedUser = await Student.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).select("-password -resetOTP -resetOTPExpire");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Admin user update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================= */
/* ADMIN - DELETE USER */
/* ============================= */

exports.deleteAdminUser = async (req, res) => {
  try {
    const { studentId } = req.params;

    const user = await Student.findById(studentId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Admin user delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


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

    await syncAdminProfileComplete(student);

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
      { returnDocument: "after" }
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