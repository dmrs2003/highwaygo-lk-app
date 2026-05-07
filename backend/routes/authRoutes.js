const express = require("express");
const router = express.Router();

// Import controllers (ONLY ONCE)
const {
  register,
  verifyEmail,
  login
} = require("../controllers/authController");

// ================= ROUTES =================

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Email verification
router.get("/verify/:token", verifyEmail);

module.exports = router;