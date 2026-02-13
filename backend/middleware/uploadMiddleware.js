const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===================================
// Ensure uploads directory exists
// ===================================
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===================================
// Configure storage
// ===================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    const uniqueName = `${timestamp}-${sanitizedName}`;
    cb(null, uniqueName);
  }
});

// ===================================
// Extension-based validation ONLY
// (Reliable with Bruno/Postman)
// ===================================
const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".mp4"];

const fileFilter = (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed. Only JPG, PNG, PDF, MP4 allowed."), false);
    }
  } catch (err) {
    cb(new Error("File validation failed"), false);
  }
};

// ===================================
// Multer configuration
// ===================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = upload;
