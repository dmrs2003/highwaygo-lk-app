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

    totalAmount: {
      type: Number,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// prevent duplicate seat booking for same bus + same date
bookingSchema.index(
  { busId: 1, travelDate: 1, seatNumbers: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);