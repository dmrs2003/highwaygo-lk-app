const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getSeatStatus,
  bookSeat,
  getMyBookings,
} = require("../controllers/bookingController");

router.get("/seats/:busId/:travelDate", getSeatStatus);

router.post("/book", protect, bookSeat);

router.get("/my-bookings", protect, getMyBookings);

module.exports = router;