import express from "express";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Settings from "../models/Settings.js";

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

// GET /api/rooms/offer
router.get("/offer", async (req, res) => {
  try {
    const settings = await Settings.findOne({ singletonKey: "GLOBAL_SETTINGS" });
    if (!settings || !settings.isCouponLive) {
      return res.json({ isCouponLive: false });
    }
    res.json({
      isCouponLive: true,
      marqueeText: settings.marqueeText,
      discountPercentage: settings.discountPercentage,
      couponCode: settings.couponCode,
    });
  } catch (error) {
    console.error("Offer error:", error.message);
    res.status(500).json({ error: "Failed to fetch offer" });
  }
});

// GET /api/rooms/availability?checkIn=...&checkOut=...
router.get("/availability", async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: "Missing checkIn or checkOut dates" });
  }

  try {
    const rooms = await Room.find({ isActive: { $ne: false } });

    // Find confirmed bookings that overlap with the requested dates
    const overlappingBookings = await Booking.find({
      status: "Confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    const availability = rooms.map((room) => {
      let bookedCount = 0;
      overlappingBookings.forEach((booking) => {
        // Count how many times this room type was booked across all overlapping bookings
        bookedCount += booking.rooms.filter((r) => r.roomId === room.id).length;
      });

      const available = Math.max(0, (room.inventory || 1) - bookedCount);
      return { roomId: room.id, available };
    });

    res.json(availability);
  } catch (error) {
    console.error("Availability error:", error.message);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

export default router;
