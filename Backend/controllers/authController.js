const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const {
  registrationTemplate,
  resetTemplate,
  passwordChangedTemplate,
} = require("../utils/template");

const syncAdminProfileComplete = async (student) => {
  if (!student) {
    return student;
  }

  if (student.role === "admin") {
    const needsAdminSync =
      !student.profileComplete || student.profileStatus !== "approved" || !student.profileApproved;

    if (needsAdminSync) {
      student.profileComplete = true;
      student.profileStatus = "approved";
      student.profileApproved = true;

      await Student.findByIdAndUpdate(student._id, {
        $set: { profileComplete: true, profileStatus: "approved", profileApproved: true },
      });
    }
  } else if (!student.profileStatus) {
    student.profileStatus = student.profileComplete ? "approved" : "pending";
    student.profileApproved = student.profileStatus === "approved";
  } else {
    student.profileApproved = student.profileStatus === "approved";
  }

  return student;
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "Unknown";
};

const getClientDevice = (req) => {
  return req.headers["user-agent"] || "Unknown device";
};


// ================= REGISTER =================

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const lowerEmail = email.toLowerCase();

    const existing = await Student.findOne({
      email: lowerEmail,
    });

    if (existing) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const newStudent = await Student.create({
      name,
      email: lowerEmail,
      password: hashedPassword,
      profileComplete: false,
    });

    await syncAdminProfileComplete(newStudent);

    const resolvedProfileStatus =
      newStudent.role === "admin"
        ? "approved"
        : (newStudent.profileStatus || (newStudent.profileComplete ? "approved" : "pending"));

    // ✅ Beautiful email

    const html = registrationTemplate(name);

    const emailSubject = "Welcome to EventSphere";

    const emailSent = await sendEmail(
      lowerEmail,
      emailSubject,
      html,
      { topic: "REGISTRATION", type: "important" }
    );

    res.status(201).json({
      message: emailSent
        ? "Registration successful"
        : "Registration successful, but confirmation email could not be sent",
      emailSent,
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
        profileComplete: newStudent.profileComplete,
        profileStatus: resolvedProfileStatus,
        profileApproved: newStudent.profileApproved,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



// ================= LOGIN =================

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const lowerEmail = email.toLowerCase();

    const student = await Student.findOne({
      email: lowerEmail,
    });

    if (!student) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (student.isBlocked) {
      return res.status(403).json({ message: "BLOCKED" });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    await syncAdminProfileComplete(student);

    const resolvedProfileStatus =
      student.role === "admin"
        ? "approved"
        : (student.profileStatus || (student.profileComplete ? "approved" : "pending"));

    await Student.findByIdAndUpdate(student._id, {
      $push: {
        loginActivity: {
          $each: [
            {
              date: new Date(),
              ip: getClientIp(req),
              device: getClientDevice(req),
            },
          ],
          $position: 0,
          $slice: 10,
        },
      },
    });

    res.status(200).json({
      message: "Login successful",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        profileComplete: student.profileComplete,
        profileStatus: resolvedProfileStatus,
        profileApproved: student.profileApproved,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};



// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const lowerEmail = email.toLowerCase();

    const user = await Student.findOne({
      email: lowerEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "BLOCKED" });
    }

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    user.resetOTP = otp;

    user.resetOTPExpire =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ beautiful reset email

    const html = resetTemplate(otp);

    await sendEmail(
      lowerEmail,
      "Reset Password",
      html,
      { topic: "PASSWORD_RESET", type: "important" }
    );

    res.json({
      message: "OTP sent",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};



// ================= VERIFY OTP =================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const lowerEmail = email.toLowerCase();

    const user = await Student.findOne({
      email: lowerEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "BLOCKED" });
    }

    if (
      user.resetOTP !== otp ||
      user.resetOTPExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP invalid or expired",
      });
    }

    res.json({
      message: "OTP verified",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};



// ================= RESET PASSWORD =================

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const lowerEmail = email.toLowerCase();

    const user = await Student.findOne({
      email: lowerEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "BLOCKED" });
    }

    if (
      user.resetOTP !== otp ||
      user.resetOTPExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP invalid or expired",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(
      newPassword,
      salt
    );

    user.password = hashed;

    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    // ✅ password changed email

    await sendEmail(
      lowerEmail,
      "Password Changed",
      passwordChangedTemplate(),
      { topic: "PASSWORD_CHANGED", type: "important" }
    );

    res.json({
      message: "Password updated",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};