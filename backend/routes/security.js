import express from "express";
import { getPublicKey, generateNonce } from "../utils/crypto.js";

const router = express.Router();

// GET /api/security/key
router.get("/key", (req, res) => {
  try {
    const publicKey = getPublicKey();
    const nonceId = generateNonce();
    res.json({
      publicKey,
      nonceId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate security context" });
  }
});

export default router;
