const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true
  },
  digitalSignature: {
    type: String,
    required: true
  },
  previousHash: {
    type: String,
    required: true
  },
  blockHash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Block", blockSchema);
