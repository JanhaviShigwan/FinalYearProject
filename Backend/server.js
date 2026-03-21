  const path = require("path");
  require("dotenv").config({
    path: path.join(__dirname, ".env"),
  });

  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const aiRoutes = require("./routes/aiRoutes");
  const { startEventReminderScheduler } = require("./services/eventReminderScheduler");
  const { startFeedbackMailScheduler } = require("./services/feedbackMailScheduler");

  const app = express();

  app.use(cors());

  /* ✅ FIX for base64 image upload */
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.use("/uploads", express.static("uploads"));


  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "EventSphere",
    })
    .then(() => {
      console.log("Connected to DB:", mongoose.connection.name);
      startEventReminderScheduler();
      startFeedbackMailScheduler();
    })
    .catch((err) => {
      console.log("DB Error:", err);
    });


  app.get("/", (req, res) => {
    res.json({ message: "Welcome to EventSphere🌐" });
  });


  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/events", require("./routes/eventRoutes"));
  app.use("/api/ai", aiRoutes);
  app.use("/api/dashboard", require("./routes/dashboardRoutes"));
  app.use("/api/student", require("./routes/studentRoutes"));
  app.use("/api/admin", require("./routes/adminSettingsRoutes"));
  app.use("/api/feedback", require("./routes/feedbackRoutes"));
  app.use("/api/certificate", require("./routes/certificateRoutes"));
  app.use("/api/attendance", require("./routes/attendanceRoutes"));


  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on port 5000")
  );