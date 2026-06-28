import express from "express";
import { decryptRequest } from "../utils/crypto.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// POST /api/booking
router.post("/", async (req, res) => {
  const { encryptedKey, iv, ciphertext, nonceId } = req.body;

  if (!encryptedKey || !iv || !ciphertext || !nonceId) {
    return res.status(400).json({ error: "Missing required cryptographic parameters" });
  }

  try {
    // Decrypt the request envelope and validate nonce and timestamp
    const payload = decryptRequest(encryptedKey, iv, ciphertext, nonceId);

    // Validate the decrypted booking data
    const {
      bookingId,
      checkIn,
      checkOut,
      guests,
      roomId,
      guestName,
      guestPhone,
      guestEmail,
      arrivalTime,
      specialRequest,
      total,
    } = payload;

    if (
      !bookingId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !roomId ||
      !guestName ||
      !guestEmail ||
      !total
    ) {
      return res
        .status(400)
        .json({ error: "Missing required booking details in decrypted payload" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return res.status(400).json({ error: "Invalid guest email address" });
    }

    // Check if a booking with the same bookingId already exists
    const existingBooking = await Booking.findOne({ bookingId });
    if (existingBooking) {
      return res.status(400).json({ error: "Booking ID already exists" });
    }

    // Create the booking entry in MongoDB
    const booking = new Booking({
      bookingId,
      checkIn,
      checkOut,
      guests,
      roomId,
      guestName,
      guestPhone,
      guestEmail,
      arrivalTime,
      specialRequest,
      total,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Reservation recorded successfully",
      bookingId: booking.bookingId,
    });
  } catch (error) {
    console.error("Booking handler error:", error.message);
    res.status(401).json({ error: error.message || "Failed to process booking request" });
  }
});

export default router;
