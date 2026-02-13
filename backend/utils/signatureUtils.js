require("dotenv").config();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Resolve key paths
const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH);
const publicKeyPath = path.resolve(process.env.PUBLIC_KEY_PATH);

/**
 * Generate RSA key pair if not exists
 */
const generateKeyPair = () => {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.log("Generating RSA key pair...");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    });

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);

    console.log("RSA key pair generated successfully.");
  }
};

// Ensure keys exist at startup
generateKeyPair();

// Load keys once into memory
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

/**
 * Sign a hash using RSA-PSS (stronger padding)
 */
exports.signHash = (hash) => {
  try {
    const signature = crypto.sign(
      "sha256",
      Buffer.from(hash),
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32
      }
    );

    return signature.toString("hex");
  } catch (error) {
    console.error("Signing Error:", error);
    throw new Error("Failed to sign hash");
  }
};

/**
 * Verify digital signature
 */
exports.verifySignature = (hash, signature) => {
  try {
    const isValid = crypto.verify(
      "sha256",
      Buffer.from(hash),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32
      },
      Buffer.from(signature, "hex")
    );

    return isValid;
  } catch (error) {
    console.error("Verification Error:", error);
    return false;
  }
};

/**
 * Export public key (for frontend or auditors)
 */
exports.getPublicKey = () => {
  return publicKey;
};
