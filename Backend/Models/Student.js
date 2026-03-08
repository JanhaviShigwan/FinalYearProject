const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // 10 digit college student ID (entered in profile form)
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\d{10}$/, "Student ID must be exactly 10 digits"],
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    department: {
      type: String,
    },

    college: {
      type: String,
    },

    year: {
      type: String,
      enum: ["FY", "SY", "TY", "Final Year"],
    },

    course: {
      type: String,
    },

    division: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: {
      type: Date,
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);