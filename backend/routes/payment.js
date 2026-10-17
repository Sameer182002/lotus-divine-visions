import express from "express";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Settings from "../models/Settings.js";
import { decryptRequest } from "../utils/crypto.js";

const router = express.Router();

// Helper to dynamically read current configuration
function getPayUConfig() {
  return {
    key: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || "a2prwK",
    salt: process.env.NEXT_PUBLIC_PAYU_MERCHANT_SALT || "wwMKqPIqGARVm4D2Dl18UtvFbKTGYlQA",
    paymentUrl: process.env.NEXT_PUBLIC_PAYU_PAYMENT_URL || "https://test.payu.in/_payment",
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
  };
}

/**
 * POST /api/payment/initiate
 * Prepares the PayU order, validates inventory, generates SHA-512 hash, and returns payment form parameters
 */
router.post("/initiate", async (req, res) => {
  try {
    const config = getPayUConfig();
    let payload = req.body;

    // Check if request is encrypted with envelope
    if (req.body.encryptedKey && req.body.iv && req.body.ciphertext && req.body.nonceId) {
      payload = decryptRequest(
        req.body.encryptedKey,
        req.body.iv,
        req.body.ciphertext,
        req.body.nonceId,
      );
    }

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
      whatsappOptIn,
    } = payload;

    if (
      !bookingId ||
      !checkIn ||
      !checkOut ||
      !Array.isArray(rooms) ||
      rooms.length === 0 ||
      !guestName ||
      !guestEmail
    ) {
      return res.status(400).json({ error: "Missing required booking details for payment" });
    }

    // 1. Calculate duration and validate inventory
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(
      1,
      Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000),
    );

    const dbRooms = await Room.find({ isActive: { $ne: false } });
    const overlappingBookings = await Booking.find({
      status: "Confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    let calculatedSubtotal = 0;

    for (const r of rooms) {
      const dbRoom = dbRooms.find((dr) => dr.id === r.roomId);
      if (!dbRoom) {
        return res.status(400).json({ error: `Invalid room selected: ${r.roomId}` });
      }

      const basePrice = parseFloat(dbRoom.price.toString().replace(/[^0-9.]/g, "")) || 0;
      calculatedSubtotal += basePrice * nights;

      // Real-time inventory check
      let bookedCount = 0;
      overlappingBookings.forEach((b) => {
        bookedCount += b.rooms.filter((br) => br.roomId === r.roomId).length;
      });
      const currentRequestCount = rooms.filter((cr) => cr.roomId === r.roomId).length;
      const capacity = dbRoom.inventory || (dbRoom.category === "Deluxe" ? 14 : 5);

      if (bookedCount + currentRequestCount > capacity) {
        return res.status(400).json({
          error: `${dbRoom.name} rooms are sold out for these dates (${bookedCount}/${capacity} already booked).`,
        });
      }
    }

    // 2. Apply coupon if valid
    let discountAmount = 0;
    if (couponCode) {
      const settings = await Settings.findOne({ singletonKey: "GLOBAL_SETTINGS" });
      if (
        settings &&
        settings.isCouponLive &&
        settings.couponCode &&
        settings.couponCode.toUpperCase() === couponCode.toUpperCase()
      ) {
        discountAmount = Math.round(
          calculatedSubtotal * ((settings.discountPercentage || 0) / 100),
        );
        calculatedSubtotal -= discountAmount;
      }
    }

    // 3. Add 18% GST
    const gst = Math.round(calculatedSubtotal * 0.18);
    const secureTotal = calculatedSubtotal + gst;

    // 4. Upsert booking record in pending state
    let booking = await Booking.findOne({ bookingId });
    if (!booking) {
      booking = new Booking({
        bookingId,
        checkIn,
        checkOut,
        rooms,
        guestName: guestName.trim(),
        guestPhone: guestPhone ? guestPhone.trim() : "",
        guestEmail: guestEmail.trim().toLowerCase(),
        consent: {
          given: Boolean(consent?.given ?? true),
          timestamp: consent?.timestamp ? new Date(consent.timestamp) : new Date(),
        },
        total: secureTotal,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: "PayU",
        source: "online",
        whatsappOptIn: Boolean(whatsappOptIn ?? true),
      });
    } else {
      booking.checkIn = checkIn;
      booking.checkOut = checkOut;
      booking.rooms = rooms;
      booking.guestName = guestName.trim();
      booking.guestPhone = guestPhone ? guestPhone.trim() : "";
      booking.guestEmail = guestEmail.trim().toLowerCase();
      booking.total = secureTotal;
      booking.status = "Pending";
      booking.paymentStatus = "Pending";
      booking.paymentMethod = "PayU";
      booking.whatsappOptIn = Boolean(whatsappOptIn ?? true);
    }

    // Generate unique PayU transaction ID (alphanumeric up to 30 chars)
    const txnid =
      "LDV" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    booking.payuTxnId = txnid;
    await booking.save();

    // 5. Build PayU Form Parameters & SHA-512 Hash
    const amountStr = secureTotal.toFixed(2);
    const productinfo = "Hotel Lotus Divine Room Reservation";
    const firstname =
      guestName
        .trim()
        .split(" ")[0]
        .replace(/[^a-zA-Z0-9]/g, "") || "Guest";
    const email = guestEmail.trim().toLowerCase();
    const phone = guestPhone ? guestPhone.replace(/\D/g, "").slice(-10) : "9999999999";

    const udf1 = bookingId;
    const udf2 = "online";
    const udf3 = whatsappOptIn ? "1" : "0";
    const udf4 = "";
    const udf5 = "";

    const surl = `${config.backendUrl}/api/payment/response`;
    const furl = `${config.backendUrl}/api/payment/response`;

    // PayU standard forward hash sequence:
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    const hashString = `${config.key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${config.salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    console.log(`[PayU Initiate] TxnId: ${txnid}, Amount: ${amountStr}`);
    console.log(`[PayU Initiate] HashString: ${hashString}`);
    console.log(`[PayU Initiate] Hash: ${hash}`);

    res.json({
      success: true,
      actionUrl: config.paymentUrl,
      params: {
        key: config.key,
        txnid,
        amount: amountStr,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      },
    });
  } catch (error) {
    console.error("PayU initiate error:", error);
    res.status(500).json({ error: "Failed to initiate payment: " + error.message });
  }
});

/**
 * POST /api/payment/response
 * Callback endpoint where PayU posts the final payment outcome (surl & furl)
 */
router.post("/response", async (req, res) => {
  try {
    const config = getPayUConfig();
    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      mihpayid,
      mode,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      additionalCharges,
      error_Message,
    } = req.body;

    console.log(`[PayU Response] Status: ${status}, TxnId: ${txnid}, BookingId: ${udf1}`);

    const bookingId = udf1;
    const booking =
      (bookingId && (await Booking.findOne({ bookingId }))) ||
      (txnid && (await Booking.findOne({ payuTxnId: txnid })));

    if (!booking) {
      console.error(
        `[PayU Response Error] No booking found for TxnId: ${txnid}, BookingId: ${bookingId}`,
      );
      return res.redirect(
        302,
        `${config.frontendUrl}/booking?step=payment&status=failed&error=booking_not_found`,
      );
    }

    // 1. Verify Reverse Response Hash
    const u1 = udf1 || "";
    const u2 = udf2 || "";
    const u3 = udf3 || "";
    const u4 = udf4 || "";
    const u5 = udf5 || "";

    let hashSequence1 = "";
    let hashSequence2 = "";
    if (additionalCharges) {
      hashSequence1 = `${additionalCharges}|${config.salt}|${status}|||||${u5}|${u4}|${u3}|${u2}|${u1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
      hashSequence2 = `${additionalCharges}|${config.salt}|${status}||||||${u5}|${u4}|${u3}|${u2}|${u1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
    } else {
      hashSequence1 = `${config.salt}|${status}|||||${u5}|${u4}|${u3}|${u2}|${u1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
      hashSequence2 = `${config.salt}|${status}||||||${u5}|${u4}|${u3}|${u2}|${u1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
    }

    const calcHash1 = crypto.createHash("sha512").update(hashSequence1).digest("hex");
    const calcHash2 = crypto.createHash("sha512").update(hashSequence2).digest("hex");
    const receivedHash = (hash || "").toLowerCase();

    console.log(`[PayU Response Verification] Received Hash: ${receivedHash}`);
    console.log(`[PayU Response Verification] CalcHash 1 (5-pipe): ${calcHash1}`);
    console.log(`[PayU Response Verification] CalcHash 2 (6-pipe): ${calcHash2}`);

    const isHashValid =
      calcHash1.toLowerCase() === receivedHash || calcHash2.toLowerCase() === receivedHash;

    if (!isHashValid) {
      console.error("[PayU Security Alert] Response Hash Mismatch! Potential tampering detected.");
      booking.status = "Failed";
      booking.paymentStatus = "Failed";
      booking.payuStatus = "tampered_hash";
      await booking.save();

      return res.redirect(
        302,
        `${config.frontendUrl}/booking?step=payment&bookingId=${booking.bookingId}&status=failed&error=security_hash_mismatch`,
      );
    }

    // 2. Handle Payment Success
    if (status === "success") {
      booking.status = "Confirmed";
      booking.paymentStatus = "Paid";
      booking.paymentMethod = "PayU";
      booking.payuTxnId = txnid;
      booking.payuMihpayid = mihpayid || "";
      booking.payuMode = mode || "Online";
      booking.payuStatus = "success";
      await booking.save();

      // Send confirmation email via Resend if key exists
      if (process.env.RESEND_API_KEY && booking.guestEmail) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Lotus Divine <bookings@lotusdivinehotel.com>",
            to: booking.guestEmail,
            subject: `Payment Confirmed: ${booking.bookingId} - Hotel Lotus Divine`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #FAF8F5;">
                <div style="background: #1F160F; color: #fff; padding: 20px; text-align: center;">
                  <h2 style="color: #C19B6C; margin: 0;">HOTEL LOTUS DIVINE</h2>
                  <p style="margin: 5px 0 0; font-size: 13px;">Reservation &amp; Payment Confirmation</p>
                </div>
                <div style="padding: 20px; background: #fff; border: 1px solid #e0d8cf;">
                  <p>Dear <strong>${booking.guestName}</strong>,</p>
                  <p>Your payment of <strong>₹${booking.total.toLocaleString("en-IN")}</strong> via PayU has been received successfully!</p>
                  <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                  <p><strong>Transaction ID:</strong> ${txnid}</p>
                  <p><strong>PayU Ref ID:</strong> ${mihpayid || "N/A"}</p>
                  <p><strong>Check-In:</strong> ${booking.checkIn} (from 12:00 PM)</p>
                  <p><strong>Check-Out:</strong> ${booking.checkOut} (until 11:00 AM)</p>
                  <p style="margin-top: 20px;">We look forward to welcoming you to Amritsar near the Golden Temple.</p>
                </div>
              </div>
            `,
          });
        } catch (mailErr) {
          console.error("Failed to send post-payment email:", mailErr.message);
        }
      }

      return res.redirect(
        302,
        `${config.frontendUrl}/booking?step=confirmation&bookingId=${booking.bookingId}&status=success&txnid=${txnid}&mihpayid=${mihpayid || ""}`,
      );
    }

    // 3. Handle Payment Failure / Cancellation
    booking.status = "Cancelled";
    booking.paymentStatus = "Failed";
    booking.payuStatus = status;
    await booking.save();

    const failureReason = error_Message || "Payment was cancelled or unsuccessful";
    return res.redirect(
      302,
      `${config.frontendUrl}/booking?step=payment&bookingId=${booking.bookingId}&status=failed&error=${encodeURIComponent(failureReason)}`,
    );
  } catch (error) {
    console.error("PayU callback error:", error);
    const config = getPayUConfig();
    return res.redirect(
      302,
      `${config.frontendUrl}/booking?step=payment&status=failed&error=server_error`,
    );
  }
});

/**
 * GET /api/payment/response
 * Fallback in case user or browser hits the response URL directly via GET
 */
router.get("/response", (req, res) => {
  const config = getPayUConfig();
  res.redirect(302, `${config.frontendUrl}/booking?step=payment`);
});

/**
 * GET /api/payment/status/:bookingId
 * Poll or verify the payment status of a booking
 */
router.get("/status/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      bookingId: booking.bookingId,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      payuTxnId: booking.payuTxnId,
      payuMihpayid: booking.payuMihpayid,
      total: booking.total,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check payment status: " + error.message });
  }
});

export default router;
