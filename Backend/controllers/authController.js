const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const {
  registrationTemplate,
  resetTemplate,
  passwordChangedTemplate,
} = require("../utils/template");


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

    await sendEmail(
      lowerEmail,
      "Welcome to EventSphere",
      html
    );

    res.status(201).json({
      message: "Registration successful",
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

    res.status(200).json({
      message: "Login successful",
      student,
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
      html
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
      passwordChangedTemplate()
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