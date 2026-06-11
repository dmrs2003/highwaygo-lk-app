const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, phone, email, nic, address, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // NIC check
    const existingNIC = await User.findOne({ nic });
    if (existingNIC) {
      return res.status(400).json({ message: "NIC already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      phone,
      email,
      nic,
      address,
      password: hashedPassword,
      verificationToken: token,
    });

    await user.save();

    // EMAIL LINK
    const verifyUrl = `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "HighwayGo LK Email Verification",
      html: `
        <h2>Welcome to HighwayGo LK</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyUrl}">Verify Account</a>
      `,
    });

    res.json({ message: "Registration successful. Check email to verify." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= EMAIL VERIFY =================
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.send("Email verified successfully 🎉 You can now login");

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // check password
    const isMatch = await require("bcrypt").compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};