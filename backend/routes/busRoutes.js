const express = require("express");
const router = express.Router();

const {
  addBus,
  getBuses,
} = require("../controllers/busController");

const {
  ownerAuth,
} = require("../middleware/authMiddleware");

// ONLY OWNER CAN ADD BUS
router.post("/add", ownerAuth, addBus);

// EVERYONE CAN VIEW BUSES
router.get("/", getBuses);

module.exports = router;