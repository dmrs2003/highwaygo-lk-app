const Bus = require("../models/Bus");

exports.addBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};