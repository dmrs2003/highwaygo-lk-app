const express = require("express");
const router = express.Router();

const {
  protect,
  ownerAuth,
} = require("../middleware/authMiddleware");

const {
  getSeatStatus,
  bookSeat,
  getMyBookings,
  getOwnerBookings,
  trackBookedBus,
  downloadReceipt,
} = require("../controllers/bookingController");

// ================= SEAT STATUS =================

router.get(
  "/seats/:busId/:travelDate",
  getSeatStatus
);

// ================= BOOK SEATS =================

router.post(
  "/book",
  protect,
  bookSeat
);

// ================= MY BOOKINGS =================

router.get(
  "/my-bookings",
  protect,
  getMyBookings
);

// ================= OWNER BOOKINGS =================

router.get(
  "/owner-bookings",
  ownerAuth,
  getOwnerBookings
);

// ================= TRACK BOOKED BUS =================

router.get(
  "/track/:bookingId",
  protect,
  trackBookedBus
);

// ================= DOWNLOAD RECEIPT =================
// Public route because browser/Linking cannot send auth header

router.get(
  "/receipt/:bookingId",
  downloadReceipt
);

module.exports = router;