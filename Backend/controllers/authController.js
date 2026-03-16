const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const {
  registrationTemplate,
  resetTemplate,
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

    // ✅ Beautiful email

    const html = registrationTemplate(name);

    const emailSubject = "Welcome to EventSphere";

    const emailSent = await sendEmail(
      lowerEmail,
      emailSubject,
      html,
      { topic: "REGISTRATION" }
    );

    res.status(201).json({
      message: emailSent
        ? "Registration successful"
        : "Registration successful, but confirmation email could not be sent",
      emailSent,
      student: newStudent,
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
      { topic: "PASSWORD_RESET" }
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
      { topic: "PASSWORD_CHANGED" }
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