const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing student
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      profileComplete: false, // IMPORTANT
    });

    res.status(201).json({
      message: "Registration successful",
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        studentId: newStudent.studentId,
        profileComplete: newStudent.profileComplete,
      },
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      student: {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        profileComplete: student.profileComplete, // IMPORTANT
      },
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};