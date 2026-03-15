  require("dotenv").config();

  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");

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
    })
    .catch((err) => {
      console.log("DB Error:", err);
    });


  app.get("/", (req, res) => {
    res.json({ message: "Welcome to EventSphere🌐" });
  });


  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/events", require("./routes/eventRoutes"));
  app.use("/api/dashboard", require("./routes/dashboardRoutes"));
  app.use("/api/student", require("./routes/studentRoutes"));
  app.use("/api/announcements", require("./routes/announcementRoutes"));
  app.use("/api/admin", require("./routes/adminSettingsRoutes"));


  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on port 5000")
  );