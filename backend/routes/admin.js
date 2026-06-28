import express from "express";
import { generateToken, requireAdmin } from "../utils/auth.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "lotusadmin123";

  if (password === adminPassword) {
    const token = generateToken();
    return res.json({ success: true, token });
  }

  res.status(401).json({ error: "Invalid admin password credentials" });
});

// GET /api/admin/bookings
router.get("/bookings", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings list" });
  }
});

// PUT /api/admin/bookings/:id/cancel
router.put("/bookings/:id/cancel", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findOne({ bookingId: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// POST /api/admin/rooms
router.post("/rooms", requireAdmin, async (req, res) => {
  const { name, category, description, amenities, size, capacity, price, imageUrl } = req.body;

  if (!name || !category || !description || !amenities || !capacity || !price) {
    return res.status(400).json({ error: "Missing required room fields" });
  }

  try {
    // Generate a unique slug ID from room name
    const id = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingRoom = await Room.findOne({ id });
    if (existingRoom) {
      return res
        .status(400)
        .json({ error: "Room name matches an existing slug ID. Please use a unique name." });
    }

    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : String(amenities)
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);

    const room = new Room({
      id,
      name,
      category,
      description,
      amenities: amenitiesArray,
      size,
      capacity,
      price,
      imageUrl,
    });

    await room.save();
    res.status(201).json({ success: true, message: "Room added dynamically", room });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// PUT /api/admin/rooms/:id
// Updates a room by its slug id
router.put("/rooms/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, category, description, amenities, size, capacity, price, imageUrl, gallery } =
    req.body;

  try {
    const room = await Room.findOne({ id });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (name) room.name = name;
    if (category) room.category = category;
    if (description) room.description = description;
    if (size !== undefined) room.size = size;
    if (capacity) room.capacity = capacity;
    if (price) room.price = price;
    if (imageUrl !== undefined) room.imageUrl = imageUrl;
    if (gallery !== undefined) room.gallery = gallery;

    if (amenities) {
      room.amenities = Array.isArray(amenities)
        ? amenities
        : String(amenities)
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
    }

    await room.save();
    res.json({ success: true, message: "Room updated successfully", room });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// DELETE /api/admin/rooms/:id
// Soft-deletes a room by setting isActive to false
router.delete("/rooms/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findOne({ id });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.isActive = false;
    await room.save();

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// POST /api/admin/upload
// Accepts a base64 encoded file and returns it directly to be stored in MongoDB
router.post("/upload", requireAdmin, async (req, res) => {
  const { fileName, fileData } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: "Missing file name or data payload" });
  }

  try {
    // Basic validation to confirm the payload is a valid image base64 data URL
    if (!fileData.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid payload. Only image data URLs are allowed." });
    }

    // We return the raw base64 data URL, saving it directly into MongoDB!
    res.json({ success: true, url: fileData });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to process uploaded image" });
  }
});

export default router;
