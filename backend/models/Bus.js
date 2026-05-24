const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  routeFrom: { type: String, required: true },
  routeTo: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Bus", busSchema);