const express = require("express");
const router = express.Router();

const {
  ownerAuth,
} = require("../middleware/authMiddleware");

const {
  addBus,
  getBuses,
  getOwnerBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require("../controllers/busController");

// everyone can view buses
router.get("/", getBuses);

// owner buses
router.get("/owner/my-buses", ownerAuth, getOwnerBuses);

// owner single bus
router.get("/owner/:id", ownerAuth, getBusById);

// owner add bus
router.post("/add", ownerAuth, addBus);

// owner update bus
router.put("/owner/:id", ownerAuth, updateBus);

// owner delete bus
router.delete("/owner/:id", ownerAuth, deleteBus);

module.exports = router;