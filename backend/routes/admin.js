import express from "express";
import { generateToken, requireAdmin } from "../utils/auth.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Settings from "../models/Settings.js";

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

// POST /api/admin/bookings/offline
router.post("/bookings/offline", requireAdmin, async (req, res) => {
  const {
    guestName,
    guestPhone,
    guestEmail,
    roomId,
    roomCount = 1,
    guestsPerRoom = 2,
    checkIn,
    checkOut,
    total,
    notes,
  } = req.body;

  if (!guestName || !roomId || !checkIn || !checkOut) {
    return res.status(400).json({
      error: "Missing required booking details (guestName, roomId, checkIn, checkOut)",
    });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (
    isNaN(checkInDate.getTime()) ||
    isNaN(checkOutDate.getTime()) ||
    checkOutDate <= checkInDate
  ) {
    return res.status(400).json({ error: "Invalid check-in or check-out dates" });
  }

  try {
    const dbRoom = await Room.findOne({ id: roomId, isActive: { $ne: false } });
    if (!dbRoom) {
      return res.status(400).json({ error: `Room type ${roomId} not found or inactive` });
    }

    const countToBook = Math.max(1, parseInt(roomCount, 10) || 1);

    // Check inventory availability for these dates
    const overlappingBookings = await Booking.find({
      status: "Confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    let alreadyBookedCount = 0;
    overlappingBookings.forEach((b) => {
      alreadyBookedCount += b.rooms.filter((r) => r.roomId === roomId).length;
    });

    const roomCapacity = dbRoom.inventory || 1;
    const availableRooms = Math.max(0, roomCapacity - alreadyBookedCount);

    if (countToBook > availableRooms) {
      return res.status(400).json({
        error: `Cannot book ${countToBook} room(s). Only ${availableRooms} room(s) available for these dates (${alreadyBookedCount}/${roomCapacity} already occupied).`,
      });
    }

    const nights = Math.max(
      1,
      Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000),
    );
    const basePrice = parseFloat(dbRoom.price.toString().replace(/[^0-9.]/g, "")) || 0;
    const calculatedTotal =
      total !== undefined && total !== "" ? Number(total) : basePrice * countToBook * nights;

    const bookingId = "LDV-OFF-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const roomItems = [];
    for (let i = 0; i < countToBook; i++) {
      roomItems.push({
        roomId,
        guests: Math.max(1, parseInt(guestsPerRoom, 10) || 2),
      });
    }

    const booking = new Booking({
      bookingId,
      checkIn,
      checkOut,
      rooms: roomItems,
      guestName: guestName.trim(),
      guestPhone: guestPhone ? guestPhone.trim() : "",
      guestEmail: guestEmail ? guestEmail.trim() : "",
      consent: {
        given: true,
        timestamp: new Date(),
      },
      total: calculatedTotal,
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod: "Cash / Desk",
      source: "offline",
      whatsappOptIn: false,
      notes: notes ? notes.trim() : "",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: `Offline booking confirmed for ${countToBook} ${dbRoom.name} room(s)`,
      booking,
    });
  } catch (error) {
    console.error("Create offline booking error:", error);
    res.status(500).json({ error: "Failed to create offline booking: " + error.message });
  }
});

// GET /api/admin/occupancy?startDate=YYYY-MM-DD&days=30
router.get("/occupancy", requireAdmin, async (req, res) => {
  try {
    let { startDate, days = 30 } = req.query;
    days = Math.min(90, Math.max(1, parseInt(days, 10) || 30));

    const start = startDate ? new Date(startDate) : new Date();
    const startIso = !isNaN(start.getTime())
      ? start.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const dbRooms = await Room.find({ isActive: { $ne: false } });
    const deluxeRoom = dbRooms.find((r) => r.id === "lotus-sanctuary" || r.category === "Deluxe");
    const premiumRoom = dbRooms.find((r) => r.id === "imperial-vista" || r.category === "Premium");

    const deluxeTotal = deluxeRoom ? deluxeRoom.inventory || 14 : 14;
    const premiumTotal = premiumRoom ? premiumRoom.inventory || 5 : 5;
    const grandTotal = deluxeTotal + premiumTotal;

    const endDateObj = new Date(new Date(startIso).getTime() + days * 86400000);
    const endIso = endDateObj.toISOString().split("T")[0];

    const bookings = await Booking.find({
      status: "Confirmed",
      checkIn: { $lt: endIso },
      checkOut: { $gt: startIso },
    }).sort({ checkIn: 1 });

    const timeline = [];
    const baseDate = new Date(startIso);

    for (let i = 0; i < days; i++) {
      const curDateObj = new Date(baseDate.getTime() + i * 86400000);
      const curIso = curDateObj.toISOString().split("T")[0];

      const activeBookings = bookings.filter((b) => b.checkIn <= curIso && b.checkOut > curIso);

      let deluxeOccupied = 0;
      let premiumOccupied = 0;
      const occupyingBookings = [];

      for (const b of activeBookings) {
        let bDeluxe = 0;
        let bPremium = 0;
        b.rooms.forEach((r) => {
          if (r.roomId === "lotus-sanctuary" || (deluxeRoom && r.roomId === deluxeRoom.id)) {
            bDeluxe++;
            deluxeOccupied++;
          } else if (
            r.roomId === "imperial-vista" ||
            (premiumRoom && r.roomId === premiumRoom.id)
          ) {
            bPremium++;
            premiumOccupied++;
          }
        });

        occupyingBookings.push({
          bookingId: b.bookingId,
          guestName: b.guestName,
          guestPhone: b.guestPhone,
          source: b.source || "online",
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          deluxeRooms: bDeluxe,
          premiumRooms: bPremium,
          total: b.total,
          notes: b.notes,
        });
      }

      timeline.push({
        date: curIso,
        dayOfWeek: curDateObj.toLocaleDateString("en-US", { weekday: "short" }),
        deluxe: {
          total: deluxeTotal,
          occupied: deluxeOccupied,
          available: Math.max(0, deluxeTotal - deluxeOccupied),
          isFull: deluxeOccupied >= deluxeTotal,
        },
        premium: {
          total: premiumTotal,
          occupied: premiumOccupied,
          available: Math.max(0, premiumTotal - premiumOccupied),
          isFull: premiumOccupied >= premiumTotal,
        },
        overall: {
          total: grandTotal,
          occupied: deluxeOccupied + premiumOccupied,
          available: Math.max(0, grandTotal - (deluxeOccupied + premiumOccupied)),
          isFull: deluxeOccupied + premiumOccupied >= grandTotal,
        },
        total: {
          capacity: grandTotal,
          occupied: deluxeOccupied + premiumOccupied,
          available: Math.max(0, grandTotal - (deluxeOccupied + premiumOccupied)),
          isFull: deluxeOccupied + premiumOccupied >= grandTotal,
        },
        bookings: occupyingBookings,
      });
    }

    res.json({
      summary: {
        grandTotalRooms: grandTotal,
        deluxeTotal,
        premiumTotal,
        grandTotal,
        startDate: startIso,
        days,
        today: timeline[0] || null,
      },
      timeline,
    });
  } catch (error) {
    console.error("Fetch occupancy error:", error);
    res.status(500).json({ error: "Failed to calculate occupancy: " + error.message });
  }
});

// POST /api/admin/rooms
router.post("/rooms", requireAdmin, async (req, res) => {
  const { name, category, description, amenities, size, capacity, price, weekendPrice, imageUrl } =
    req.body;

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
      weekendPrice,
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
  const {
    name,
    category,
    description,
    amenities,
    size,
    capacity,
    price,
    specialPrice,
    specialPriceStartDate,
    specialPriceEndDate,
    imageUrl,
    gallery,
    inventory,
  } = req.body;

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
    if (specialPrice !== undefined) room.specialPrice = specialPrice;
    if (specialPriceStartDate !== undefined) room.specialPriceStartDate = specialPriceStartDate;
    if (specialPriceEndDate !== undefined) room.specialPriceEndDate = specialPriceEndDate;
    if (imageUrl !== undefined) room.imageUrl = imageUrl;
    if (gallery !== undefined) room.gallery = gallery;
    if (inventory !== undefined) room.inventory = inventory;

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

// GET /api/admin/settings
router.get("/settings", requireAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne({ singletonKey: "GLOBAL_SETTINGS" });
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST /api/admin/settings
router.post("/settings", requireAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne({ singletonKey: "GLOBAL_SETTINGS" });
    if (!settings) {
      settings = new Settings();
    }

    const { isCouponLive, couponCode, discountPercentage, marqueeText } = req.body;

    if (typeof isCouponLive !== "undefined") settings.isCouponLive = isCouponLive;
    if (typeof couponCode !== "undefined") settings.couponCode = couponCode;
    if (typeof discountPercentage !== "undefined") settings.discountPercentage = discountPercentage;
    if (typeof marqueeText !== "undefined") settings.marqueeText = marqueeText;

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
