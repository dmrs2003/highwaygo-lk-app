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

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("HighwayGo LK API Running");
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user,
  });
});

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});