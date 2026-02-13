const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileHash: String,
  digitalSignature: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  blockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block"
  }
}, { timestamps: true });

module.exports = mongoose.model("Evidence", evidenceSchema);
