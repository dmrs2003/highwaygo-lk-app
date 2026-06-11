const Owner = require("../models/Owner");
const bcrypt = require("bcrypt");

exports.registerOwner = async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      email,
      nic,
      businessName,
      businessRegNo,
      address,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingEmail = await Owner.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already used" });
    }

    const existingNIC = await Owner.findOne({ nic });
    if (existingNIC) {
      return res.status(400).json({ message: "NIC already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      ownerName,
      phone,
      email,
      nic,
      businessName,
      businessRegNo,
      address,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Owner registered successfully. Please wait for admin approval.",
      owner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const jwt = require("jsonwebtoken");

// ================= OWNER LOGIN =================
exports.loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(400).json({ message: "Owner not found" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!owner.isApproved) {
      return res.status(403).json({
        message: "Your owner account is waiting for admin approval",
      });
    }

    const token = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Owner login successful",
      token,
      owner: {
        id: owner._id,
        ownerName: owner.ownerName,
        email: owner.email,
        businessName: owner.businessName,
        role: owner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= APPROVE OWNER =================
exports.approveOwner = async (req, res) => {
  try {

    const owner = await Owner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    owner.isApproved = true;

    await owner.save();

    res.json({
      message: "Owner approved successfully",
      owner,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
};

const Owner = require("../models/Owner");

// ================= GET OWNER PROFILE =================

exports.getOwnerProfile = async (req, res) => {
  try {
    const owner = await Owner.findById(req.owner.id).select("-password");

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    res.json(owner);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};