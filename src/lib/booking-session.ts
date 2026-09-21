// Single source of truth for the booking flow's persisted draft: its shape, how it's
// validated/sanitized when read back, and how booking steps map to the `?step=` URL
// param and sessionStorage. `BookingPageClient.tsx` is the only consumer today.
import { isCheckInValid, isCheckOutValid, validateBookingDates } from "@/lib/booking-dates";

export type BookingStepKey = "stay" | "rooms" | "contact" | "payment";

// Ordered so array index + 1 lines up with BookingPageClient's numeric `currentStep`.
export const STEP_ORDER: readonly BookingStepKey[] = ["stay", "rooms", "contact", "payment"];

export const STEP_TO_KEY: Record<number, BookingStepKey> = {
  1: "stay",
  2: "rooms",
  3: "contact",
  4: "payment",
};

export const KEY_TO_STEP: Record<BookingStepKey, number> = {
  stay: 1,
  rooms: 2,
  contact: 3,
  payment: 4,
};

export const PHONE_DIGITS = 10;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface BookingRoomRow {
  uid: string;
  roomId: string;
  guests: number;
}

export interface BookingGuestDetails {
  name: string;
  phone: string;
  email: string;
}

export interface BookingDraft {
  checkIn: string;
  checkOut: string;
  roomRows: BookingRoomRow[];
  guestDetails: BookingGuestDetails;
  consentChecked: boolean;
  consentTimestamp: string | null;
  currentStep: BookingStepKey;
}

export const EMPTY_DRAFT: BookingDraft = {
  checkIn: "",
  checkOut: "",
  roomRows: [],
  guestDetails: { name: "", phone: "", email: "" },
  consentChecked: false,
  consentTimestamp: null,
  currentStep: "stay",
};

const STORAGE_KEY = "lotus-divine-booking-draft";

/**
 * What's needed to decide the furthest step the user is currently allowed to be on.
 * Mirrors BookingPageClient's own step1Valid/step2Valid/step3Valid gates so URL-driven
 * navigation (direct links, browser back/forward) can never reach further than the
 * in-flow Continue buttons would allow.
 */
export interface BookingValidationInput {
  checkIn: string;
  checkOut: string;
  roomRows: { roomId: string }[];
  guestDetails: BookingGuestDetails;
  consentChecked: boolean;
}

export function earliestValidStep(input: BookingValidationInput): BookingStepKey {
  if (!validateBookingDates(input.checkIn, input.checkOut)) return "stay";
  if (input.roomRows.length === 0) return "rooms";
  const phoneValid = input.guestDetails.phone.length === PHONE_DIGITS;
  const emailValid = EMAIL_REGEX.test(input.guestDetails.email.trim());
  const contactValid =
    input.guestDetails.name.trim() !== "" && emailValid && phoneValid && input.consentChecked;
  if (!contactValid) return "contact";
  return "payment";
}

/** Reads and validates the persisted draft. Never trusts stored data blindly. */
export function readBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeBookingDraft(draft: BookingDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Private browsing / storage quota exceeded — the in-memory booking state still
    // works for the current tab, it just won't survive a refresh. Not worth surfacing.
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function sanitizeDraft(raw: unknown): BookingDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  let checkIn = typeof obj.checkIn === "string" ? obj.checkIn : "";
  if (!isCheckInValid(checkIn)) checkIn = "";

  let checkOut = typeof obj.checkOut === "string" ? obj.checkOut : "";
  if (!checkIn || !isCheckOutValid(checkOut, checkIn)) checkOut = "";

  let roomRows: BookingRoomRow[] = Array.isArray(obj.roomRows)
    ? obj.roomRows.filter(
        (row): row is BookingRoomRow =>
          !!row &&
          typeof row === "object" &&
          typeof (row as Record<string, unknown>).uid === "string" &&
          typeof (row as Record<string, unknown>).roomId === "string" &&
          typeof (row as Record<string, unknown>).guests === "number",
      )
    : [];
  // Room selections are only meaningful for the dates they were made against — if the
  // stored dates didn't survive validation above, the rooms can't be trusted either.
  if (!checkIn || !checkOut) roomRows = [];

  const guestDetailsRaw = obj.guestDetails as Record<string, unknown> | undefined;
  const guestDetails: BookingGuestDetails = {
    name: typeof guestDetailsRaw?.name === "string" ? guestDetailsRaw.name : "",
    phone: typeof guestDetailsRaw?.phone === "string" ? guestDetailsRaw.phone : "",
    email: typeof guestDetailsRaw?.email === "string" ? guestDetailsRaw.email : "",
  };

  const consentChecked = typeof obj.consentChecked === "boolean" ? obj.consentChecked : false;
  const consentTimestamp =
    consentChecked && typeof obj.consentTimestamp === "string" ? obj.consentTimestamp : null;

  const currentStep: BookingStepKey = STEP_ORDER.includes(obj.currentStep as BookingStepKey)
    ? (obj.currentStep as BookingStepKey)
    : "stay";

  return {
    checkIn,
    checkOut,
    roomRows,
    guestDetails,
    consentChecked,
    consentTimestamp,
    currentStep,
  };
}
