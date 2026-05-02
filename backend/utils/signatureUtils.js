require("dotenv").config();
const crypto = require("crypto");

/*
====================================================
Load RSA keys directly from environment variables
(Render Environment Variables)
====================================================
PRIVATE_KEY = -----BEGIN PRIVATE KEY-----...
PUBLIC_KEY  = -----BEGIN PUBLIC KEY-----...
*/

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

// Validate keys at startup
if (!privateKey || !publicKey) {
  throw new Error(
    "RSA keys are missing. Please set PRIVATE_KEY and PUBLIC_KEY in environment variables."
  );
}

/**
 * Sign a hash using RSA-PSS
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
 * Export public key
 */
exports.getPublicKey = () => {
  return publicKey;
};