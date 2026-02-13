const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  evidenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evidence"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Audit", auditSchema);
