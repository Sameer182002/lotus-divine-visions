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

/**
 * Parses a "YYYY-MM-DD" string into a local `Date` at midnight, built from the numeric
 * parts directly (never through a UTC parse), for use with calendar UI libraries that
 * work in terms of `Date` objects (e.g. react-day-picker).
 */
export function isoToLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** The inverse of `isoToLocalDate`: reads a `Date`'s own local calendar fields back into "YYYY-MM-DD". */
export function localDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * The single formatter for displaying a booking date anywhere on the site — homepage,
 * /booking, summaries. "short" gives "Sep 21"; "long" gives "21 Sep, Mon". Returns "" for
 * an empty/unselected date; callers pick their own empty-state text ("Select date", "—").
 */
export function formatBookingDate(iso: string, style: "short" | "long" = "short"): string {
  if (!iso) return "";
  const date = isoToLocalDate(iso);
  if (Number.isNaN(date.getTime())) return iso;
  if (style === "long") {
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${WEEKDAYS_SHORT[date.getDay()]}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
