const express = require("express");
const router = express.Router();

const { ownerAuth } = require("../middleware/authMiddleware");

const {
  registerOwner,
  loginOwner,
  getOwnerProfile,
} = require("../controllers/ownerController");

// ================= OWNER AUTH =================

router.post("/register", registerOwner);

router.post("/login", loginOwner);

// ================= OWNER PROFILE =================

router.get("/profile", ownerAuth, getOwnerProfile);

module.exports = router;