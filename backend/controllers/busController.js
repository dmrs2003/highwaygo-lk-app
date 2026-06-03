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
    const buses = await Bus.find().sort({
      createdAt: -1,
    });

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
    }).sort({
      createdAt: -1,
    });

    res.json(buses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET SINGLE BUS =================

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      _id: req.params.id,
      ownerId: req.owner.id,
    });

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= UPDATE BUS =================

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.owner.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found or not authorized",
      });
    }

    res.json({
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= DELETE BUS =================

exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.owner.id,
    });

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found or not authorized",
      });
    }

    res.json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= UPDATE LIVE LOCATION =================

exports.updateBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const bus = await Bus.findOne({
      _id: busId,
      ownerId: req.owner.id,
    });

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found or not authorized",
      });
    }

    bus.currentLocation = {
      latitude,
      longitude,
      updatedAt: new Date(),
    };

    await bus.save();

    res.json({
      message: "Location updated successfully",
      busId: bus._id,
      currentLocation: bus.currentLocation,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET LIVE LOCATION =================

exports.getBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).select(
      "busName busNumber routeFrom routeTo currentLocation"
    );

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.json({
      busId: bus._id,
      busName: bus.busName,
      busNumber: bus.busNumber,
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      currentLocation: bus.currentLocation,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};