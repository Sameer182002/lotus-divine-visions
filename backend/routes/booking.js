import express from "express";
import { decryptRequest } from "../utils/crypto.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Settings from "../models/Settings.js";
import { Resend } from "resend";

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
      rooms,
      guestName,
      guestPhone,
      guestEmail,
      consent,
      couponCode,
    } = payload;

    if (
      !bookingId ||
      !checkIn ||
      !checkOut ||
      !Array.isArray(rooms) ||
      rooms.length === 0 ||
      !rooms.every((r) => r && r.roomId && Number(r.guests) >= 1) ||
      !guestName ||
      !guestEmail
    ) {
      return res
        .status(400)
        .json({ error: "Missing required booking details in decrypted payload" });
    }

    if (!consent || consent.given !== true || !consent.timestamp) {
      return res.status(400).json({ error: "Consent to the Privacy Policy is required" });
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

    // --- SECURITY & INVENTORY ENFORCEMENT ---
    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(
      1,
      Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000),
    );

    // Fetch all active rooms to get their prices and inventory
    const dbRooms = await Room.find({ isActive: { $ne: false } });

    // Find overlapping bookings to check inventory
    const overlappingBookings = await Booking.find({
      status: "Confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    let calculatedTotal = 0;

    // Validate each requested room
    for (const r of rooms) {
      const dbRoom = dbRooms.find((dr) => dr.id === r.roomId);
      if (!dbRoom) {
        return res.status(400).json({ error: `Invalid room ID: ${r.roomId}` });
      }

      // Compute securely on server
      const basePrice = parseFloat(dbRoom.price.toString().replace(/[^0-9.]/g, ""));
      let specialPrice = basePrice;
      if (dbRoom.specialPrice) {
        specialPrice = parseFloat(dbRoom.specialPrice.toString().replace(/[^0-9.]/g, ""));
      }

      let roomTotal = 0;
      for (let i = 0; i < nights; i++) {
        const d = new Date(checkInDate.getTime() + i * 86400000);
        let nightPrice = basePrice;
        if (dbRoom.specialPrice && dbRoom.specialPriceStartDate && dbRoom.specialPriceEndDate) {
          const startDate = new Date(dbRoom.specialPriceStartDate).setHours(0, 0, 0, 0);
          const endDate = new Date(dbRoom.specialPriceEndDate).setHours(23, 59, 59, 999);
          const current = d.getTime();
          if (current >= startDate && current <= endDate) {
            nightPrice = specialPrice;
          }
        }
        roomTotal += nightPrice;
      }

      calculatedTotal += roomTotal;

      // Inventory Check
      let bookedCount = 0;
      overlappingBookings.forEach((b) => {
        bookedCount += b.rooms.filter((br) => br.roomId === r.roomId).length;
      });
      const currentRequestCount = rooms.filter((cr) => cr.roomId === r.roomId).length;

      if (bookedCount + currentRequestCount > (dbRoom.inventory || 1)) {
        return res
          .status(400)
          .json({ error: `Room ${dbRoom.name} is fully booked for these dates.` });
      }
    }

    // Apply coupon if valid
    if (couponCode) {
      const settings = await Settings.findOne({ singletonKey: "GLOBAL_SETTINGS" });
      if (
        settings &&
        settings.isCouponLive &&
        settings.couponCode &&
        settings.couponCode.toUpperCase() === couponCode.toUpperCase()
      ) {
        const discountAmount = calculatedTotal * ((settings.discountPercentage || 0) / 100);
        calculatedTotal -= discountAmount;
      }
    }

    // Add 18% taxes/charges
    const secureTotal = calculatedTotal + calculatedTotal * 0.18;
    // ----------------------------------------

    // Create the booking entry in MongoDB using secureTotal
    const booking = new Booking({
      bookingId,
      checkIn,
      checkOut,
      rooms,
      guestName,
      guestPhone,
      guestEmail,
      consent,
      total: secureTotal,
    });

    await booking.save();

    // Send Booking Confirmation Email using Resend
    if (!process.env.RESEND_API_KEY) {
      import("fs").then((m) => m.appendFileSync("booking_email.log", "NO API KEY FOUND\n"));
    }
    if (process.env.RESEND_API_KEY) {
      try {
        console.log("LOG: Attempting to send email via Resend to", guestEmail);
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const emailHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; color: #1F160F; padding: 0;">
  <div style="background-color: #1F160F; text-align: center; padding: 40px 20px;">
    <h1 style="color: #C19B6C; font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 2px;">LOTUS DIVINE</h1>
    <p style="color: #FDFBF7; opacity: 0.8; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 10px;">Luxury Hotel</p>
  </div>
  <div style="padding: 40px 30px; background-color: #FDFBF7;">
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${guestName},</p>
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Thank you for choosing Lotus Divine. We are delighted to confirm your reservation and look forward to welcoming you to Amritsar.</p>
    <div style="background-color: #FFFFFF; border: 1px solid #E5E0D8; padding: 30px; margin-bottom: 30px;">
      <h3 style="color: #C19B6C; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; border-bottom: 1px solid #E5E0D8; padding-bottom: 15px; margin-bottom: 20px;">Your Stay Details</h3>
      <table style="width: 100%; font-size: 15px; line-height: 2; border-collapse: collapse;">
        <tr>
          <td style="color: #7A726A; width: 40%;">Booking Reference:</td>
          <td style="font-weight: bold;">${bookingId}</td>
        </tr>
        <tr>
          <td style="color: #7A726A;">Check-in:</td>
          <td style="font-weight: bold;">${new Date(checkIn).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</td>
        </tr>
        <tr>
          <td style="color: #7A726A;">Check-out:</td>
          <td style="font-weight: bold;">${new Date(checkOut).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</td>
        </tr>
        <tr>
          <td style="color: #7A726A;">Total Amount:</td>
          <td style="font-weight: bold;">₹${secureTotal.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #7A726A;">Payment Status:</td>
          <td style="color: #C19B6C; font-weight: bold;">Pay on Arrival</td>
        </tr>
      </table>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #7A726A; margin-bottom: 40px;">If you have any questions or require assistance prior to your arrival, please reply directly to this email.</p>
    <p style="font-size: 16px; margin: 0;">Warm regards,</p>
    <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">The Lotus Divine Team</p>
  </div>
  <div style="background-color: #1F160F; color: #FDFBF7; text-align: center; padding: 30px 20px; font-size: 12px; opacity: 0.8;">
    <p style="margin: 0 0 10px 0;">Lotus Divine Luxury Hotel</p>
    <p style="margin: 0;">1804, Katra Ahluwalia, Amritsar, Punjab 143001</p>
  </div>
</div>
`;

        const resendResponse = await resend.emails.send({
          from: "Lotus Divine <bookings@lotusdivinehotel.com>",
          to: guestEmail,
          subject: `Booking Confirmed: ${bookingId} - Lotus Divine`,
          html: emailHtml,
        });
        console.log("LOG: Resend response:", JSON.stringify(resendResponse));
        import("fs").then((m) =>
          m.appendFileSync("booking_email.log", JSON.stringify(resendResponse) + "\n"),
        );
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
        import("fs").then((m) =>
          m.appendFileSync("booking_email.log", "ERROR: " + emailErr + "\n"),
        );
        // We do not fail the booking if the email fails to send
      }
    }

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
