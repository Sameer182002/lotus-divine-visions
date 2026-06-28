import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: { $ne: false } }).sort({ createdAt: 1 });
    res.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error.message);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
});

export default router;
