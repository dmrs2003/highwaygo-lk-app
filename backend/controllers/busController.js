const Bus = require("../models/Bus");

// ================= ADD BUS =================

exports.addBus = async (req, res) => {
  try {
    const bus = await Bus.create({
      ...req.body,
      ownerId: req.owner.id,
    });

    res.status(201).json({
      message: "Bus added successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET ALL BUSES =================

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    res.json(buses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET OWNER BUSES =================

exports.getOwnerBuses = async (req, res) => {
  try {
    const buses = await Bus.find({
      ownerId: req.owner.id,
    }).sort({ createdAt: -1 });

    res.json(buses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};