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
  updateBusLocation,
  getBusLocation,
} = require("../controllers/busController");

// ================= PUBLIC BUSES =================

router.get("/", getBuses);

// ================= OWNER BUSES =================

router.get(
  "/owner/my-buses",
  ownerAuth,
  getOwnerBuses
);

// ================= OWNER SINGLE BUS =================

router.get(
  "/owner/:id",
  ownerAuth,
  getBusById
);

// ================= ADD BUS =================

router.post(
  "/add",
  ownerAuth,
  addBus
);

// ================= UPDATE BUS =================

router.put(
  "/owner/:id",
  ownerAuth,
  updateBus
);

// ================= DELETE BUS =================

router.delete(
  "/owner/:id",
  ownerAuth,
  deleteBus
);

// ================= UPDATE LIVE LOCATION =================
// owner/driver updates bus location

router.put(
  "/location/:busId",
  ownerAuth,
  updateBusLocation
);

// ================= GET LIVE LOCATION =================
// public location get endpoint

router.get(
  "/location/:busId",
  getBusLocation
);

module.exports = router;