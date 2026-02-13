const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadEvidence,
  verifyEvidence,
  simulateTamper,
  getAllEvidence
} = require("../controllers/evidenceController");

// =======================================
// Get All Evidence
// =======================================
router.get(
  "/",
  authMiddleware,
  getAllEvidence
);

// =======================================
// Upload Evidence
// =======================================
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadEvidence
);

// =======================================
// Verify Evidence
// =======================================
router.get(
  "/verify/:id",
  authMiddleware,
  verifyEvidence
);

// =======================================
// Simulate Tampering (Demo Purpose)
// =======================================
router.post(
  "/tamper/:id",
  authMiddleware,
  simulateTamper
);

module.exports = router;
