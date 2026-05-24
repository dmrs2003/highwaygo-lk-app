const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

// ================= GET SEAT STATUS =================

exports.getSeatStatus = async (req, res) => {
  try {
    const { busId, travelDate } = req.params;

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    const bookings = await Booking.find({
      busId,
      travelDate,
      status: "confirmed",
    });

    const bookedSeats = bookings.flatMap(
      (booking) => booking.seatNumbers
    );

    const lastRowSeats = bus.totalSeats > 40 ? 6 : 5;

    res.json({
      busId,
      totalSeats: bus.totalSeats,
      lastRowSeats,
      bookedSeats,

      price: bus.price,
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      busName: bus.busName,
      busNumber: bus.busNumber,
      imageUrl: bus.imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= BOOK SEATS =================

exports.bookSeat = async (req, res) => {
  try {
    const { busId, seatNumbers, travelDate } = req.body;
    const userId = req.user;

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        message: "Please select at least one seat",
      });
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    for (const seat of seatNumbers) {
      if (seat < 1 || seat > bus.totalSeats) {
        return res.status(400).json({
          message: `Invalid seat number: ${seat}`,
        });
      }
    }

    const alreadyBooked = await Booking.findOne({
      busId,
      travelDate,
      status: "confirmed",
      seatNumbers: { $in: seatNumbers },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: "One or more selected seats are already booked",
      });
    }

    const totalAmount = seatNumbers.length * bus.price;

    const booking = await Booking.create({
      busId,
      userId,
      seatNumbers,
      travelDate,
      totalAmount,
      status: "confirmed",
    });

    res.status(201).json({
      message: "Seats booked successfully",
      booking,
      bus: {
        busName: bus.busName,
        busNumber: bus.busNumber,
        routeFrom: bus.routeFrom,
        routeTo: bus.routeTo,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        price: bus.price,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= MY BOOKINGS =================

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user,
    })
      .populate("busId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};