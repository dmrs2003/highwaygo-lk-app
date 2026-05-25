const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const path = require("path");
const generateReceipt = require("../utils/generateReceipt");

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
      ownerId: bus.ownerId,
      seatNumbers,
      travelDate,
      totalAmount,
      status: "confirmed",
    });

    const user = await User.findById(userId);

    try {
      const receiptPath = generateReceipt(booking, bus, user);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "HighwayGo LK Booking Receipt",
        text: "Your HighwayGo LK booking receipt is attached.",
        attachments: [
          {
            filename: `receipt-${booking._id}.pdf`,
            path: receiptPath,
          },
        ],
      });
    } catch (emailError) {
      console.log("Receipt email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Seats booked successfully",
      booking,
      receiptDownloadUrl: `/api/bookings/receipt/${booking._id}`,
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

// ================= OWNER BOOKINGS =================

exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      ownerId: req.owner.id,
    })
      .populate("busId")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= DOWNLOAD RECEIPT =================

exports.downloadReceipt = async (req, res) => {
  try {
    const receiptPath = path.join(
      __dirname,
      "../receipts",
      `receipt-${req.params.bookingId}.pdf`
    );

    res.download(receiptPath);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};