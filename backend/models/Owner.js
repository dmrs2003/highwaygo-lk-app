const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nic: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  businessRegNo: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },

  role: { type: String, default: "owner" },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Owner", ownerSchema);