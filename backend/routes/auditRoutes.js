const express = require("express");
const router = express.Router();
const Audit = require("../models/Audit");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const logs = await Audit.find()
    .populate("performedBy", "name email role")
    .populate("evidenceId", "fileName")
    .sort({ timestamp: -1 });

  res.json(logs);
});

module.exports = router;
