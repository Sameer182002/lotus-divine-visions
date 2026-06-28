import crypto from "crypto";

const TOKEN_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours session duration

/**
 * Sign an admin payload and return a secure token string.
 */
export function generateToken() {
  const adminPassword = process.env.ADMIN_PASSWORD || "lotusadmin123";
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

  const payload = JSON.stringify({ username: "admin", expiresAt });
  const base64Payload = Buffer.from(payload).toString("base64");

  const signature = crypto.createHmac("sha256", adminPassword).update(base64Payload).digest("hex");

  return `${base64Payload}.${signature}`;
}

/**
 * Verify a token string. Returns true if valid, false otherwise.
 */
export function verifyToken(token) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [base64Payload, signature] = parts;
  const adminPassword = process.env.ADMIN_PASSWORD || "lotusadmin123";

  // Re-compute signature to verify integrity
  const expectedSignature = crypto
    .createHmac("sha256", adminPassword)
    .update(base64Payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    return false; // Signature mismatch (tampered token)
  }

  try {
    const payloadJson = Buffer.from(base64Payload, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);

    // Check if token has expired
    if (Date.now() > payload.expiresAt) {
      return false; // Token expired
    }

    return true;
  } catch (error) {
    return false; // JSON parse failed
  }
}

/**
 * Express middleware to restrict routes to authorized admin session.
 */
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Admin authorization token required." });
  }

  const token = authHeader.split(" ")[1];
  const isValid = verifyToken(token);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid, expired, or tampered authorization session." });
  }

  next();
}
