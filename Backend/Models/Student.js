const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      match: [/^\d{10}$/, "Student ID must be exactly 10 digits"],
      index: {
        unique: true,
        partialFilterExpression: {
          studentId: { $exists: true, $ne: null },
        },
      },
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetOTP: {
      type: String,
    },

    resetOTPExpire: {
      type: Date,
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    department: String,
    college: String,

    year: {
      type: String,
      enum: ["FY", "SY", "TY", "Final Year"],
    },

    course: String,
    division: String,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: Date,

    profileComplete: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
      default: "",
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    /* ✅ NEW FIELD */

    loginActivity: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        ip: String,
        device: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);