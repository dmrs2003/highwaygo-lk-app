const express = require("express");
const router = express.Router();

const { addBus, getBuses } = require("../controllers/busController");

router.post("/add", addBus);
router.get("/", getBuses);

module.exports = router;