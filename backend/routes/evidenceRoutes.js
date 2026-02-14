const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { downloadReport } = require("../controllers/evidenceController");

const {
  uploadEvidence,
  verifyEvidence,
  simulateTamper,
  getAllEvidence
} = require("../controllers/evidenceController");

// =======================================
// Get All Evidence (Dashboard)
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
// Simulate Tampering (Demo)
// =======================================
router.post(
  "/tamper/:id",
  authMiddleware,
  simulateTamper
);
router.get(
  "/report/:id",
  authMiddleware,
  downloadReport
);


module.exports = router;
