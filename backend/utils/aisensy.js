import Booking from "../models/Booking.js";

/**
 * Normalizes any phone number into international E.164 format (+91 for India)
 * @param {string|number} rawPhone
 * @returns {string}
 */
export function normalizePhone(rawPhone) {
  if (!rawPhone) return "";
  const digits = String(rawPhone).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  return `+${digits}`;
}

/**
 * Formats a Date or Date-string into "DD MMM YYYY" (e.g. 28 Oct 2026)
 * @param {string|Date} dateStr
 * @returns {string}
 */
function formatDatePretty(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Summarizes booked rooms into a string for WhatsApp confirmation template
 * Format matches approved template: "Deluxe Room (2 Guests)"
 * @param {Array} rooms
 * @returns {string}
 */
function summarizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return "Deluxe Room (2 Guests)";
  }

  const map = {};
  let totalGuests = 0;
  rooms.forEach((r) => {
    const id = r.roomId || "deluxe-room";
    let name = "Deluxe Room";
    if (id.includes("family")) name = "Family Suite";
    else if (id.includes("super")) name = "Super Deluxe Room";
    map[name] = (map[name] || 0) + 1;
    totalGuests += Number(r.guests) || 2;
  });

  const roomNames = Object.entries(map)
    .map(([name, count]) => (count > 1 ? `${name} (${count} Rooms)` : name))
    .join(", ");

  return `${roomNames} (${totalGuests} Guest${totalGuests !== 1 ? "s" : ""})`;
}

/**
 * Gets clean primary room title for check-in reminder template (e.g. "Deluxe Room")
 * @param {Array} rooms
 * @returns {string}
 */
function getPrimaryRoomName(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) return "Deluxe Room";
  const id = rooms[0].roomId || "";
  if (id.includes("family")) return "Family Suite";
  if (id.includes("super")) return "Super Deluxe Room";
  return "Deluxe Room";
}

/**
 * Dispatches an automated campaign via AiSensy WhatsApp Business API
 * @param {Object} options
 * @param {string} options.campaignName
 * @param {string} options.destination
 * @param {string} options.userName
 * @param {Array<string>} options.templateParams
 * @param {Object|null} options.media
 * @returns {Promise<Object>}
 */
export async function sendAiSensyCampaign({
  campaignName,
  destination,
  userName,
  templateParams = [],
  media = null,
}) {
  const apiKey = process.env.AISENSY_API_KEY;
  const isEnabled = process.env.AISENSY_ENABLED === "true" || process.env.AISENSY_ENABLED === true;

  if (!apiKey || !isEnabled) {
    console.log(
      `[AiSensy] Message not dispatched for campaign "${campaignName}" (AISENSY_ENABLED=${process.env.AISENSY_ENABLED})`,
    );
    return { success: false, skipped: true, reason: "disabled_or_missing_api_key" };
  }

  const phone = normalizePhone(destination);
  if (!phone || phone.length < 10) {
    console.warn(`[AiSensy] Invalid phone number provided: ${destination}`);
    return { success: false, error: "invalid_phone_number" };
  }

  const payload = {
    apiKey,
    campaignName,
    destination: phone,
    userName: userName || "Valued Guest",
    source: "Hotel Lotus Divine Website",
    templateParams,
  };

  if (media && media.url) {
    payload.media = {
      url: media.url,
      filename: media.filename || "Lotus_Divine_Invoice.pdf",
    };
  }

  console.log(
    `[AiSensy Request] Sending campaign "${campaignName}" to ${phone} with ${templateParams.length} parameters`,
  );

  try {
    const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`[AiSensy API Error] HTTP ${res.status}:`, data);
      return { success: false, status: res.status, data };
    }

    console.log(`[AiSensy API Success] Message delivered to ${phone}:`, data);
    return { success: true, data };
  } catch (err) {
    console.error(`[AiSensy Network Error] Failed to reach AiSensy:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends Booking Confirmation + PDF Invoice via WhatsApp
 * @param {Object} booking
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppConfirmation(booking) {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    console.log(`[AiSensy] Guest ${booking.bookingId} opted out of WhatsApp updates.`);
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_CONFIRMATION_CAMPAIGN || "lotus_booking_confirmation";
  const backendBase = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5001"
  ).replace(/\/$/, "");

  // Invoice direct PDF download URL for attachment
  const invoicePdfUrl = `${backendBase}/api/booking/${booking.bookingId}/invoice.pdf`;

  const guestName = (booking.guestName || "Guest").trim();
  const roomSummary = summarizeRooms(booking.rooms);
  const formattedCheckIn = formatDatePretty(booking.checkIn);
  const formattedCheckOut = formatDatePretty(booking.checkOut);
  const formattedTotal = `₹${booking.total ? booking.total.toLocaleString("en-IN") : "0"}`;

  // Template variables: {{1}}=Name, {{2}}=Booking ID, {{3}}=Check-in, {{4}}=Check-out, {{5}}=Rooms, {{6}}=Total
  const templateParams = [
    guestName,
    booking.bookingId,
    formattedCheckIn,
    formattedCheckOut,
    roomSummary,
    formattedTotal,
  ];

  // Invoice direct PDF download URL for attachment (attached when backend is hosted with HTTPS)
  const isPublicUrl =
    invoicePdfUrl.startsWith("https://") &&
    !invoicePdfUrl.includes("localhost") &&
    !invoicePdfUrl.includes("127.0.0.1");

  const mediaPayload = isPublicUrl
    ? {
        url: invoicePdfUrl,
        filename: `Lotus_Divine_Invoice_${booking.bookingId}.pdf`,
      }
    : null;

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
    media: mediaPayload,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.confirmationSent = true;
      booking.whatsappReminders.confirmationSentAt = new Date();
      booking.whatsappReminders.lastError = "";
    } else if (!result.skipped) {
      booking.whatsappReminders.lastError =
        result.error || (result.data && result.data.message) || "Send failed";
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record WhatsApp status in booking:", dbErr.message);
  }

  return result;
}

/**
 * Sends Check-in Reminder (Morning of Arrival)
 * @param {Object} booking
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppCheckinReminder(booking) {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_CHECKIN_CAMPAIGN || "lotus_checkin_reminder_latest";
  const guestName = (booking.guestName || "Guest").trim();
  const roomName = getPrimaryRoomName(booking.rooms);

  // Template variables: {{1}}=Name, {{2}}=Booking ID, {{3}}=Room
  const templateParams = [guestName, booking.bookingId, roomName];

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.checkinReminderSent = true;
      booking.whatsappReminders.checkinReminderSentAt = new Date();
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record checkin reminder in booking:", dbErr.message);
  }

  return result;
}

/**
 * Sends Check-out Reminder (Morning of Departure)
 * @param {Object} booking
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppCheckoutReminder(booking) {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_CHECKOUT_CAMPAIGN || "lotus_checkout_reminder_latest";
  const guestName = (booking.guestName || "Guest").trim();

  // Template variables: {{1}}=Name, {{2}}=Booking ID
  const templateParams = [guestName, booking.bookingId];

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.checkoutReminderSent = true;
      booking.whatsappReminders.checkoutReminderSentAt = new Date();
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record checkout reminder in booking:", dbErr.message);
  }

  return result;
}
