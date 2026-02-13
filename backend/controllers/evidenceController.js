const fs = require("fs");
const Evidence = require("../models/Evidence");
const Audit = require("../models/Audit");
const { generateFileHash } = require("../utils/hashUtils");
const { signHash, verifySignature } = require("../utils/signatureUtils");
const { createBlock, validateChain } = require("../utils/blockchainUtils");

/**
 * Upload and store forensic evidence
 */
exports.uploadEvidence = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filePath = req.file.path;

    // Generate SHA-256 hash
    const fileHash = generateFileHash(filePath);

    // Digitally sign hash
    const digitalSignature = signHash(fileHash);

    // Create blockchain block
    const block = await createBlock(fileHash, digitalSignature);

    // Store evidence metadata
    const evidence = await Evidence.create({
      fileName: req.file.originalname,
      filePath,
      fileHash,
      digitalSignature,
      uploadedBy: req.user.id,
      blockId: block._id
    });

    // Audit logging
    await Audit.create({
      action: "UPLOAD_EVIDENCE",
      performedBy: req.user.id,
      evidenceId: evidence._id
    });

    res.status(201).json({
      success: true,
      message: "Evidence stored securely in immutable ledger",
      data: {
        evidenceId: evidence._id,
        fileName: evidence.fileName,
        blockIndex: block.index,
        blockHash: block.blockHash
      }
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Evidence upload failed",
      error: err.message
    });
  }
};


/**
 * Verify forensic evidence integrity
 */
exports.verifyEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate("blockId")
      .populate("uploadedBy", "name email role");

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    // Check file existence
    if (!fs.existsSync(evidence.filePath)) {
      return res.status(400).json({
        success: false,
        message: "Evidence file missing from storage",
        tampered: true
      });
    }

    // Recalculate hash
    const currentHash = generateFileHash(evidence.filePath);
    const hashMatch = currentHash === evidence.fileHash;

    // Verify digital signature (use stored original hash)
    const signatureValid = verifySignature(
      evidence.fileHash,
      evidence.digitalSignature
    );

    // Validate blockchain integrity
    const chainValidation = await validateChain();

    // Verify block linkage integrity
    const blockIntegrity =
      evidence.blockId &&
      evidence.blockId.fileHash === evidence.fileHash;

    const overallValid =
      hashMatch &&
      signatureValid &&
      chainValidation.valid &&
      blockIntegrity;

    // Audit logging
    await Audit.create({
      action: "VERIFY_EVIDENCE",
      performedBy: req.user.id,
      evidenceId: evidence._id
    });

    res.json({
      success: true,
      forensicReport: {
        evidenceId: evidence._id,
        fileName: evidence.fileName,
        uploadedBy: evidence.uploadedBy,
        uploadTimestamp: evidence.createdAt,

        fileIntegrity: hashMatch,
        signatureIntegrity: signatureValid,
        blockchainIntegrity: chainValidation.valid,
        blockLinkIntegrity: blockIntegrity,

        blockchainMessage:
          chainValidation.message || chainValidation.error,

        overallValid,
        tampered: !overallValid
      }
    });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({
      success: false,
      message: "Verification process failed",
      error: err.message
    });
  }
};


/**
 * Simulate tampering (for demo/testing)
 */
exports.simulateTamper = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found"
      });
    }

    // Modify file artificially
    fs.appendFileSync(evidence.filePath, "TAMPERED_DATA");

    await Audit.create({
      action: "SIMULATE_TAMPER",
      performedBy: req.user.id,
      evidenceId: evidence._id
    });

    res.json({
      success: true,
      message: "Tampering simulated successfully"
    });

  } catch (err) {
    console.error("Tamper Simulation Error:", err);
    res.status(500).json({
      success: false,
      message: "Tamper simulation failed",
      error: err.message
    });
  }
};

/**
 * Get all uploaded evidence (for dashboard listing)
 */
exports.getAllEvidence = async (req, res) => {
  try {
    const evidenceList = await Evidence.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: evidenceList.length,
      data: evidenceList
    });

  } catch (err) {
    console.error("Fetch Evidence Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch evidence",
      error: err.message
    });
  }
};

