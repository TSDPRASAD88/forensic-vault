const crypto = require("crypto");
const Block = require("../models/Block");

/**
 * Deterministic SHA-256 hashing
 * Ensures consistent ordering of fields
 */
const generateHash = (blockData) => {
  const orderedData = {
    index: blockData.index,
    timestamp: blockData.timestamp,
    fileHash: blockData.fileHash,
    digitalSignature: blockData.digitalSignature,
    previousHash: blockData.previousHash
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(orderedData))
    .digest("hex");
};

/**
 * Create Genesis Block if blockchain is empty
 */
const createGenesisBlock = async () => {
  const existingBlock = await Block.findOne();

  if (!existingBlock) {
    const genesisData = {
      index: 0,
      timestamp: new Date().toISOString(),
      fileHash: "GENESIS",
      digitalSignature: "GENESIS_SIGNATURE",
      previousHash: "0"
    };

    const blockHash = generateHash(genesisData);

    await Block.create({
      ...genesisData,
      blockHash
    });

    console.log("Genesis block created.");
  }
};

/**
 * Create a new block
 */
exports.createBlock = async (fileHash, digitalSignature) => {
  await createGenesisBlock();

  const lastBlock = await Block.findOne().sort({ index: -1 });

  const index = lastBlock.index + 1;
  const previousHash = lastBlock.blockHash;
  const timestamp = new Date().toISOString();

  const blockData = {
    index,
    timestamp,
    fileHash,
    digitalSignature,
    previousHash
  };

  const blockHash = generateHash(blockData);

  const newBlock = new Block({
    ...blockData,
    blockHash
  });

  return await newBlock.save();
};

/**
 * Validate entire blockchain integrity
 */
exports.validateChain = async () => {
  const blocks = await Block.find().sort({ index: 1 });

  if (!blocks.length) {
    return { valid: true, message: "Blockchain is empty" };
  }

  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];

    const recalculatedHash = generateHash(current);

    if (current.blockHash !== recalculatedHash) {
      return {
        valid: false,
        error: `Block ${current.index} hash mismatch`
      };
    }

    if (i > 0) {
      const previous = blocks[i - 1];

      if (current.previousHash !== previous.blockHash) {
        return {
          valid: false,
          error: `Block ${current.index} chain linkage broken`
        };
      }
    }
  }

  return {
    valid: true,
    message: "Blockchain integrity verified successfully"
  };
};

/**
 * Validate a single block
 */
exports.validateBlock = async (blockId) => {
  const block = await Block.findById(blockId);

  if (!block) {
    return { valid: false, error: "Block not found" };
  }

  const recalculatedHash = generateHash(block);

  if (block.blockHash !== recalculatedHash) {
    return { valid: false, error: "Block hash mismatch" };
  }

  return { valid: true, message: "Block integrity verified" };
};

/**
 * Get full blockchain
 */
exports.getBlockchain = async () => {
  return await Block.find().sort({ index: 1 });
};

/**
 * Get latest block
 */
exports.getLatestBlock = async () => {
  return await Block.findOne().sort({ index: -1 });
};

/**
 * Recalculate entire blockchain (for forensic analysis)
 * Does NOT modify DB, only returns comparison
 */
exports.recalculateChain = async () => {
  const blocks = await Block.find().sort({ index: 1 });

  return blocks.map(block => {
    const recalculatedHash = generateHash(block);

    return {
      index: block.index,
      storedHash: block.blockHash,
      recalculatedHash,
      match: block.blockHash === recalculatedHash
    };
  });
};
