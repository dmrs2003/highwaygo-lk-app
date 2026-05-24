const jwt = require("jsonwebtoken");

// ================= USER AUTH =================

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded.id;

      next();

    } catch (error) {

      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }
};

// ================= OWNER AUTH =================

const ownerAuth = (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "owner") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    req.owner = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = {
  protect,
  ownerAuth,
};