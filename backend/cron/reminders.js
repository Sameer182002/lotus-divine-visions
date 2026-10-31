import cron from "node-cron";
import Booking from "../models/Booking.js";
import {
  sendWhatsAppCheckinReminder,
  sendWhatsAppCheckoutReminder,
} from "../utils/aisensy.js";

/**
 * Returns today's date string in YYYY-MM-DD format according to IST (Asia/Kolkata)
 * @returns {string}
 */
export function getTodayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/**
 * Finds all confirmed bookings checking in today and dispatches check-in reminder
 */
export async function runCheckinReminders() {
  const today = getTodayIST();
  console.log(`[Reminders Cron] Running daily check-in reminder check for date: ${today}`);

  try {
    const arrivingBookings = await Booking.find({
      status: "Confirmed",
      checkIn: today,
      whatsappOptIn: { $ne: false },
      "whatsappReminders.checkinReminderSent": { $ne: true },
    });

    console.log(
      `[Reminders Cron] Found ${arrivingBookings.length} booking(s) arriving today requiring check-in reminder.`,
    );

    for (const booking of arrivingBookings) {
      try {
        await sendWhatsAppCheckinReminder(booking);
      } catch (err) {
        console.error(
          `[Reminders Cron] Error sending checkin reminder for ${booking.bookingId}:`,
          err.message,
        );
      }
    }
  } catch (err) {
    console.error("[Reminders Cron] Checkin reminder batch failed:", err.message);
  }
}

/**
 * Finds all confirmed bookings checking out today and dispatches checkout reminder
 */
export async function runCheckoutReminders() {
  const today = getTodayIST();
  console.log(`[Reminders Cron] Running daily check-out reminder check for date: ${today}`);

  try {
    const departingBookings = await Booking.find({
      status: "Confirmed",
      checkOut: today,
      whatsappOptIn: { $ne: false },
      "whatsappReminders.checkoutReminderSent": { $ne: true },
    });

    console.log(
      `[Reminders Cron] Found ${departingBookings.length} booking(s) departing today requiring checkout reminder.`,
    );

    for (const booking of departingBookings) {
      try {
        await sendWhatsAppCheckoutReminder(booking);
      } catch (err) {
        console.error(
          `[Reminders Cron] Error sending checkout reminder for ${booking.bookingId}:`,
          err.message,
        );
      }
    }
  } catch (err) {
    console.error("[Reminders Cron] Checkout reminder batch failed:", err.message);
  }
}

/**
 * Initializes automated daily reminder cron schedules
 */
export function initReminderCron() {
  // Check-out reminder runs every day at 08:30 AM IST
  cron.schedule("30 8 * * *", () => {
    console.log("[Reminders Cron] 08:30 AM IST - Triggering automated check-out reminders");
    runCheckoutReminders();
  }, {
    timezone: "Asia/Kolkata",
  });

  // Check-in reminder runs every day at 09:00 AM IST
  cron.schedule("0 9 * * *", () => {
    console.log("[Reminders Cron] 09:00 AM IST - Triggering automated check-in reminders");
    runCheckinReminders();
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log("[Reminders Cron] Automated WhatsApp Reminder Cron Jobs registered (8:30 AM & 9:00 AM IST)");
}
