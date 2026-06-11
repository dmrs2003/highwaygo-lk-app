const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  register,
  verifyEmail,
  login,
  getMe,
} = require("../controllers/authController");

// ================= REGISTER USER =================

router.post("/register", register);

// ================= LOGIN USER =================

router.post("/login", login);

// ================= GET LOGGED IN USER =================

router.get("/me", protect, getMe);

// ================= EMAIL VERIFICATION =================

router.get("/verify/:token", verifyEmail);

module.exports = router;