import crypto from "crypto";
import NodeCache from "node-cache";

// Generate RSA-OAEP Key Pair on server startup
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Cache for storing valid nonces with a 3-minute TTL
// Checkperiod of 30 seconds to clean up expired nonces
const nonceCache = new NodeCache({ stdTTL: 180, checkperiod: 30 });

/**
 * Returns the public RSA key in PEM format.
 */
export function getPublicKey() {
  return publicKey;
}

/**
 * Generates a short-lived nonce for session handshake.
 * Saves it to the cache and returns its ID.
 */
export function generateNonce() {
  const nonceId = crypto.randomBytes(16).toString("hex");
  // Set value to true, meaning it is active and unused
  nonceCache.set(nonceId, true);
  return nonceId;
}

/**
 * Decrypts data encrypted with RSA-OAEP (SHA-256) and AES-256-GCM.
 * Prevents replay attacks by checking the nonce and timestamp.
 *
 * @param {string} encryptedKey Base64 encoded encrypted AES key
 * @param {string} iv Base64 encoded Initialization Vector
 * @param {string} ciphertext Base64 encoded encrypted payload + auth tag
 * @param {string} nonceId The identifier of the nonce used
 */
export function decryptRequest(encryptedKey, iv, ciphertext, nonceId) {
  // 1. Verify and invalidate the nonce
  if (!nonceId) {
    throw new Error("Nonce ID is missing from request");
  }
  const isNonceValid = nonceCache.get(nonceId);
  if (!isNonceValid) {
    throw new Error("Invalid or expired session nonce. Replay attack suspected.");
  }
  // Delete the nonce so it can never be used again (Single-use)
  nonceCache.del(nonceId);

  // 2. Decrypt the AES key using Server's RSA Private Key
  let aesKey;
  try {
    aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedKey, "base64"),
    );
  } catch (error) {
    throw new Error("Failed to decrypt secure envelope key");
  }

  // 3. Decrypt the payload ciphertext using AES-256-GCM
  try {
    const encryptedBuffer = Buffer.from(ciphertext, "base64");

    // Web Crypto API appends the 16-byte authentication tag at the end of the ciphertext
    if (encryptedBuffer.length < 17) {
      throw new Error("Invalid ciphertext structure");
    }
    const ciphertextOnly = encryptedBuffer.subarray(0, encryptedBuffer.length - 16);
    const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, Buffer.from(iv, "base64"));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextOnly, null, "utf8");
    decrypted += decipher.final("utf8");

    const payload = JSON.parse(decrypted);

    // 4. Verify timestamp to prevent stale replay attacks
    const clientTimestamp = payload.timestamp;
    if (!clientTimestamp) {
      throw new Error("Timestamp missing from secure payload");
    }

    const timeDifference = Math.abs(Date.now() - clientTimestamp);
    // Request must be fresh within 60 seconds
    if (timeDifference > 60000) {
      throw new Error("Request timestamp is stale or out of sync. Freshness check failed.");
    }

    return payload;
  } catch (error) {
    console.error("Payload decryption error:", error.message);
    throw new Error("Tampered or invalid encrypted payload. Decryption failed.");
  }
}
