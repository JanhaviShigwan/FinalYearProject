const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
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
  },
  { timestamps: true }
);

// Generate studentId automatically
studentSchema.pre("save", async function () {
  if (!this.studentId) {
    const base = this.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.studentId = base + randomNum;
  }
});

module.exports = mongoose.model("Student", studentSchema);