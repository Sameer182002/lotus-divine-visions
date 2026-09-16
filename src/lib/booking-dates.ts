// Shared Check-In / Check-Out date rules for Hotel Lotus Divine, used by both the
// homepage booking bar and the /booking page so the two never drift apart.
//
// Dates are always plain "YYYY-MM-DD" calendar strings (never Date objects/timestamps)
// so comparisons are lexicographic string comparisons — safe from timezone drift.
// The one place real timezone awareness matters is "what is today", which is resolved
// explicitly in the hotel's own timezone (Asia/Kolkata) rather than the visitor's.

const HOTEL_TIME_ZONE = "Asia/Kolkata";

/** Today's calendar date (YYYY-MM-DD) in the hotel's local timezone. */
export function getHotelTodayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HOTEL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Adds `days` calendar days to a "YYYY-MM-DD" string. Uses UTC-based arithmetic
 * throughout (Date.UTC / getUTCDate / toISOString) so the result never shifts by a day
 * depending on the browser's local timezone offset.
 */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Earliest selectable Check-In date: today, in the hotel's timezone. */
export function minCheckInISO(): string {
  return getHotelTodayISO();
}

/** Earliest selectable Check-Out date for a given Check-In (or none selected yet). */
export function minCheckOutISO(checkIn: string): string {
  return addDaysISO(checkIn || getHotelTodayISO(), 1);
}

export function isCheckInValid(checkIn: string): boolean {
  return !!checkIn && checkIn >= minCheckInISO();
}

export function isCheckOutValid(checkOut: string, checkIn: string): boolean {
  return !!checkOut && checkOut >= minCheckOutISO(checkIn);
}

/**
 * What Check-Out should become after Check-In changes to `nextCheckIn`: kept as-is if
 * still valid for the new Check-In, otherwise cleared back to its placeholder state.
 */
export function resolveCheckOutOnCheckInChange(
  nextCheckIn: string,
  currentCheckOut: string,
): string {
  if (currentCheckOut && !isCheckOutValid(currentCheckOut, nextCheckIn)) return "";
  return currentCheckOut;
}

/** Full validity check to run before a booking is allowed to proceed. */
export function validateBookingDates(checkIn: string, checkOut: string): boolean {
  return isCheckInValid(checkIn) && isCheckOutValid(checkOut, checkIn);
}
