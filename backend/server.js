const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { protect } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/bookings", bookingRoutes);

// ================= HOME =================

app.get("/", (req, res) => {
  res.send("HighwayGo LK API Running");
});

// ================= TEST =================

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user,
  });
});

// ================= DB =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});