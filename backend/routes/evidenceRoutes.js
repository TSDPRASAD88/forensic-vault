const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  uploadEvidence,
  verifyEvidence,
  simulateTamper,
  getAllEvidence,
  downloadReport
} = require("../controllers/evidenceController");


// =======================================
// Get All Evidence (Dashboard)
// Roles: all authenticated users
// =======================================
router.get(
  "/",
  authMiddleware,
  getAllEvidence
);


// =======================================
// Upload Evidence
// Roles: admin, analyst
// =======================================
router.post(
  "/upload",
  authMiddleware,
  allowRoles("admin", "analyst"),
  upload.single("file"),
  uploadEvidence
);


// =======================================
// Verify Evidence
// Roles: all authenticated users
// =======================================
router.get(
  "/verify/:id",
  authMiddleware,
  verifyEvidence
);


// =======================================
// Simulate Tampering (DEMO PURPOSE)
// Roles: admin only
// =======================================
router.post(
  "/tamper/:id",
  authMiddleware,
  allowRoles("admin"),
  simulateTamper
);


// =======================================
// Download Forensic Report (PDF)
// Roles: admin, analyst, user
// =======================================
router.get(
  "/report/:id",
  authMiddleware,
  allowRoles("admin", "analyst", "user"),
  downloadReport
);


module.exports = router;
