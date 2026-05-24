const express = require("express");
const router = express.Router();

const {
  registerOwner,
  loginOwner,
  approveOwner,
} = require("../controllers/ownerController");

router.post("/register", registerOwner);

router.post("/login", loginOwner);

router.put("/approve/:id", approveOwner);

module.exports = router;