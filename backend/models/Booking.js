const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatNumbers: {
    type: [Number],
    required: true,
    },

    travelDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// same bus + same date + same seat duplicate block
bookingSchema.index(
  { busId: 1, travelDate: 1, seatNumbers: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);