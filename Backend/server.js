require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FORCE DATABASE NAME HERE
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "EventSphere",   // <-- FORCE IT HERE
  })
  .then(() => {
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);