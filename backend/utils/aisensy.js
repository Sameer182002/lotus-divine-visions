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
 * Resolves room ID/slug into branded display title (e.g. "Deluxe Room", "Premium Room")
 * @param {string} roomId
 * @returns {string}
 */
export function getRoomDisplayName(roomId) {
  if (!roomId) return "Deluxe Room";
  const id = String(roomId).toLowerCase();
  if (id.includes("imperial") || id.includes("vista") || id.includes("premium")) {
    return "Premium Room";
  }
  if (id.includes("family")) {
    return "Family Suite";
  }
  if (id.includes("super")) {
    return "Super Deluxe Room";
  }
  if (id.includes("lotus") || id.includes("sanctuary") || id.includes("deluxe")) {
    return "Deluxe Room";
  }
  return (
    id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Room"
  );
}

/**
 * Summarizes booked rooms into a string for WhatsApp confirmation template
 * Format matches approved template:
 * - Single room: "Deluxe Room (2 Guests)" or "Premium Room (2 Guests)"
 * - Multiple of same room: "Deluxe Room (3 Rooms) (6 Guests)"
 * - Multiple different rooms: "1 Deluxe Room + 1 Premium Room (4 Guests)"
 * @param {Array} rooms
 * @returns {string}
 */
export function summarizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return "Deluxe Room (2 Guests)";
  }

  const map = {};
  let totalGuests = 0;
  rooms.forEach((r) => {
    const name = getRoomDisplayName(r.roomId);
    map[name] = (map[name] || 0) + 1;
    totalGuests += Number(r.guests) || 2;
  });

  const entries = Object.entries(map);
  let roomSummary = "";

  if (entries.length === 1) {
    const [name, count] = entries[0];
    roomSummary = count > 1 ? `${name} (${count} Rooms)` : name;
  } else {
    // When different room types are booked together (e.g. 1 Deluxe + 1 Premium)
    roomSummary = entries
      .map(([name, count]) => `${count} ${name}${count > 1 ? "s" : ""}`)
      .join(" + ");
  }

  return `${roomSummary} (${totalGuests} Guest${totalGuests !== 1 ? "s" : ""})`;
}

/**
 * Gets clean primary room title for check-in reminder template (e.g. "Deluxe Room & Premium Room")
 * @param {Array} rooms
 * @returns {string}
 */
export function getPrimaryRoomName(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) return "Deluxe Room";
  const uniqueNames = [...new Set(rooms.map((r) => getRoomDisplayName(r.roomId)))];
  return uniqueNames.join(" & ");
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

  let campaignName =
    process.env.AISENSY_CONFIRMATION_CAMPAIGN || "lotus_booking_confirmation_with_invoice";

  // If environment was set to the text-only template, upgrade to the invoice campaign to send the PDF
  if (campaignName === "lotus_booking_confirmation") {
    campaignName = "lotus_booking_confirmation_with_invoice";
  }

  const backendBase = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://lotus-divine-visions.onrender.com"
  ).replace(/\/$/, "");

  // Invoice direct PDF download URL for attachment
  let invoicePdfUrl = `${backendBase}/api/booking/${booking.bookingId}/invoice.pdf`;
  if (invoicePdfUrl.includes("localhost") || invoicePdfUrl.includes("127.0.0.1")) {
    // If running on localhost, fallback to public production host so Meta/AiSensy can download the PDF
    invoicePdfUrl = `https://lotus-divine-visions.onrender.com/api/booking/${booking.bookingId}/invoice.pdf`;
  }

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

  // Invoice direct PDF download URL for attachment
  const mediaPayload = {
    url: invoicePdfUrl,
    filename: `Lotus_Divine_Invoice_${booking.bookingId}.pdf`,
  };

  let result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
    media: mediaPayload,
  });

  // If campaign with invoice fails because campaign does not exist in AiSensy, fall back to lotus_booking_confirmation
  if (
    !result.success &&
    (result.error?.includes("Campaign does not exist") ||
      result.data?.message?.includes("Campaign does not exist")) &&
    campaignName !== "lotus_booking_confirmation"
  ) {
    console.warn(
      `[AiSensy] Campaign "${campaignName}" not found; falling back to "lotus_booking_confirmation"`,
    );
    result = await sendAiSensyCampaign({
      campaignName: "lotus_booking_confirmation",
      destination: booking.guestPhone,
      userName: guestName,
      templateParams,
    });
  }

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

/**
 * Sends Booking Cancellation Notification
 * @param {Object} booking
 * @param {string} refundStatus
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppCancellation(booking, refundStatus = "Processed as per hotel policy") {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_CANCELLATION_CAMPAIGN || "lotus_booking_cancellation";
  const guestName = (booking.guestName || "Guest").trim();
  const formattedCheckIn = formatDatePretty(booking.checkIn);

  // Template variables: {{1}}=Name, {{2}}=Booking ID, {{3}}=Check-in Date, {{4}}=Refund Status
  const templateParams = [
    guestName,
    booking.bookingId,
    formattedCheckIn,
    refundStatus,
  ];

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.cancellationSent = true;
      booking.whatsappReminders.cancellationSentAt = new Date();
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record cancellation WhatsApp in booking:", dbErr.message);
  }

  return result;
}

/**
 * Sends Welcome / In-House Guide upon Check-In with dynamic Wi-Fi credentials
 * @param {Object} booking
 * @param {Object} options
 * @param {string} options.wifiName
 * @param {string} options.wifiPassword
 * @param {string} options.roomNumber
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppWelcome(booking, options = {}) {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_WELCOME_CAMPAIGN || "lotus_welcome_inhouse";
  const guestName = (booking.guestName || "Guest").trim();
  const roomName = (options.roomNumber ? `${options.roomNumber} (${getPrimaryRoomName(booking.rooms)})` : getPrimaryRoomName(booking.rooms)).trim();
  const wifiName = (options.wifiName || "LotusDivine_Guest").trim();
  const wifiPassword = (options.wifiPassword || "lotus@divine").trim();

  // Template variables: {{1}}=Name, {{2}}=Room, {{3}}=Wi-Fi SSID, {{4}}=Wi-Fi Password
  const templateParams = [guestName, roomName, wifiName, wifiPassword];

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.welcomeSent = true;
      booking.whatsappReminders.welcomeSentAt = new Date();
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record welcome WhatsApp in booking:", dbErr.message);
  }

  return result;
}

/**
 * Sends Post-Checkout Thank You & Google Review Request (Evening of Departure)
 * @param {Object} booking
 * @returns {Promise<Object>}
 */
export async function sendWhatsAppPostCheckoutFeedback(booking) {
  if (!booking || !booking.guestPhone) {
    return { success: false, error: "Missing guest phone" };
  }

  if (booking.whatsappOptIn === false) {
    return { success: false, skipped: true, reason: "guest_opted_out" };
  }

  const campaignName =
    process.env.AISENSY_FEEDBACK_CAMPAIGN || "lotus_post_checkout_feedback";
  const guestName = (booking.guestName || "Guest").trim();

  // Template variables: {{1}}=Name
  const templateParams = [guestName];

  const result = await sendAiSensyCampaign({
    campaignName,
    destination: booking.guestPhone,
    userName: guestName,
    templateParams,
  });

  try {
    if (!booking.whatsappReminders) booking.whatsappReminders = {};
    if (result.success) {
      booking.whatsappReminders.feedbackSent = true;
      booking.whatsappReminders.feedbackSentAt = new Date();
    }
    await booking.save();
  } catch (dbErr) {
    console.warn("Could not record feedback WhatsApp in booking:", dbErr.message);
  }

  return result;
}
