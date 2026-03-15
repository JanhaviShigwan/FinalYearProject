const mongoose = require("mongoose");

async function forceAdminProfileCompleteOnUpdate() {
  const update = this.getUpdate() || {};
  const nextRole = update.role || update.$set?.role;

  let effectiveRole = nextRole;

  if (!effectiveRole) {
    const existingStudent = await this.model.findOne(this.getQuery()).select("role");
    effectiveRole = existingStudent?.role;
  }

  if (effectiveRole === "admin") {
    if (update.$set) {
      update.$set.profileComplete = true;
    } else {
      update.profileComplete = true;
    }

    this.setUpdate(update);
  }
}

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

    resetOTP: String,

    resetOTPExpire: Date,

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
      default: function () {
        return this.role === "admin";
      },
    },

    profileImage: {
      type: String,
      default: "",
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // ✅ NEW EMAIL SETTINGS

    emailPreferences: {

      promotions: {
        type: Boolean,
        default: true,
      },

      reminders: {
        type: Boolean,
        default: true,
      },

      announcements: {
        type: Boolean,
        default: true,
      },

    },

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

studentSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.profileComplete = true;
  }

  next();
});

studentSchema.pre("findOneAndUpdate", forceAdminProfileCompleteOnUpdate);

module.exports =
  mongoose.model("Student", studentSchema);