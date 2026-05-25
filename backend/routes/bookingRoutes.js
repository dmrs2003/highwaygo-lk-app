const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getSeatStatus,
  bookSeat,
  getMyBookings,
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

// ================= DOWNLOAD PDF RECEIPT =================

router.get(
  "/receipt/:bookingId",
  protect,
  downloadReceipt
);

module.exports = router;