require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
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
app.use("/api", require("./routes/dashboardRoutes"));   // ✅ FIXED
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));   // ✅ FIXED


app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);