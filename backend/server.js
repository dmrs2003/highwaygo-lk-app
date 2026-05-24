const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
const busRoutes = require("./routes/busRoutes");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("HighwayGo LK API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user
  });
});