/**
 * Helper to convert an ArrayBuffer to a Base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts a Base64 PEM public key string to an ArrayBuffer.
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Remove headers, footers, newlines, and spaces
  const cleanPem = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/[\r\n]/g, "")
    .trim();

  const binaryString = atob(cleanPem);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Imports a PEM public key into a Web Crypto CryptoKey object.
 */
async function importPublicKey(pem: string): Promise<CryptoKey> {
  const keyBuffer = pemToArrayBuffer(pem);
  return window.crypto.subtle.importKey(
    "spki",
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"],
  );
}

export interface EncryptedEnvelope {
  encryptedKey: string; // Base64 RSA-encrypted AES key
  iv: string; // Base64 AES IV
  ciphertext: string; // Base64 AES-GCM ciphertext + tag
}

/**
 * Encrypts a JSON payload using hybrid encryption:
 * 1. Generates a random 256-bit AES-GCM key and a 12-byte IV.
 * 2. Encrypts the payload with the AES key.
 * 3. Encrypts the AES key with the server's RSA public key.
 * 4. Returns the encrypted elements in Base64 encoding.
 *
 * @param payload Object to encrypt
 * @param publicKeyPem Server's RSA public key in PEM format
 * @param nonceId Session nonce to include inside the encrypted payload
 */
export async function encryptPayload(
  payload: Record<string, unknown>,
  publicKeyPem: string,
  nonceId: string,
): Promise<EncryptedEnvelope> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new Error("Web Cryptography API is not supported in this environment");
  }

  // 1. Prepare payload with security context
  const fullPayload = {
    ...payload,
    nonce: nonceId,
    timestamp: Date.now(), // Request freshness check (prevent stale replay)
  };

  // 2. Import the server's public RSA key
  const rsaKey = await importPublicKey(publicKeyPem);

  // 3. Generate a random 256-bit AES-GCM key
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"],
  );

  // 4. Generate a random 12-byte IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 5. Encrypt the payload with the AES-GCM key
  const encoder = new TextEncoder();
  const encodedPayload = encoder.encode(JSON.stringify(fullPayload));
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encodedPayload,
  );

  // 6. Export the AES key so we can encrypt it with RSA
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  // 7. Encrypt the raw AES key with the Server's RSA Public Key
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    rsaKey,
    rawAesKey,
  );

  // 8. Package the Base64 values
  return {
    encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
  };
}
