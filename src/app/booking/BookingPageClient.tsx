"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import type { ReactNode } from "react";
import { Calendar, BedDouble, Phone, Users, Maximize2, Clock, Plus, Minus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BookingCalendarIcon } from "@/components/icons/BookingCalendarIcon";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ROOMS_DETAIL } from "@/data/siteContent";
import { encryptPayload } from "@/lib/encryption";
import {
  isCheckInValid,
  isCheckOutValid,
  minCheckInISO,
  minCheckOutISO,
  resolveCheckOutOnCheckInChange,
  validateBookingDates,
} from "@/lib/booking-dates";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";

export interface RoomItem {
  id: string;
  name: string;
  category: string;
  description: string;
  amenities: readonly string[];
  size?: string;
  capacity: string;
  price: string;
  imageUrl?: string;
  imageKey?: string;
  imageAlt?: string;
  gallery?: string[];
}

const ROOM_IMAGES: Record<string, string> = { room1: room1.src, room2: room2.src };

// Same photography used on the Rooms page and homepage, keyed by category.
const CATEGORY_IMAGES: Record<string, string> = {
  Deluxe: roomDeluxe.src,
  Premium: roomPremium.src,
};

function getRoomImageUrl(room: RoomItem | undefined) {
  if (!room) return "";
  // Always use static frontend images per user request
  return CATEGORY_IMAGES[room.category] || ROOM_IMAGES.room1;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nightCount(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
}

function parsePrice(str: string) {
  const m = str.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, ""), 10) : 0;
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

function fmtDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}, ${WEEKDAYS_SHORT[d.getDay()]}`;
}

function fmtMoney(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// Maps URL slugs (from rooms page CTAs) → room IDs in ROOMS_DETAIL
const SLUG_TO_ID: Record<string, string> = {
  "signature-suite": "lotus-sanctuary",
  "grand-suite": "imperial-vista",
};

function matchRoomId(param: string): string {
  if (!param) return "";
  const normalized = param.toLowerCase();
  if (SLUG_TO_ID[normalized]) return SLUG_TO_ID[normalized];
  const match = ROOMS_DETAIL.find(
    (r) =>
      r.id === normalized ||
      r.name.toLowerCase().includes(normalized) ||
      r.category.toLowerCase().replace(/\s+/g, "-") === normalized,
  );
  return match?.id ?? "";
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomDetail = RoomItem;

const MAX_GUESTS_PER_ROOM = 2;

const ROOM_TYPE_CAPS: Record<string, number> = { Deluxe: 14, Premium: 5 };
const OVERALL_ROOM_CAP = 5;
const LOW_STOCK_THRESHOLDS: Record<string, number> = { Deluxe: 5, Premium: 3 };

const PHONE_DIGITS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HOTEL_CHECKIN_TIME = "12:00 PM";
const HOTEL_CHECKOUT_TIME = "11:00 AM";

interface RoomRow {
  uid: string;
  roomId: string;
  guests: number;
}

function makeRowId() {
  return Math.random().toString(36).slice(2, 10);
}

function roomAnchor(category: string) {
  return `/rooms#${category.toLowerCase()}`;
}

// ─── Step labels ──────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Stay Details",
  "Choose Rooms",
  "Contact Details",
  "Review & Confirm",
  "Reservation Received",
];

// ─── Progress Tracker ─────────────────────────────────────────────────────────

function ProgressTracker({ current }: { current: number }) {
  return (
    <div className="bg-ivory border-b border-brown/8">
      {/* Mobile: compact circular-step indicator, current step label below */}
      <div className="lg:hidden px-5 py-4">
        <div className="flex items-center mb-2.5">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < current;
            const active = n === current;
            const isLast = i === STEP_LABELS.length - 1;
            return (
              <div key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0 transition-all duration-300 ${
                    done
                      ? "bg-gold text-brown"
                      : active
                        ? "bg-brown text-ivory ring-2 ring-brown/15"
                        : "bg-ivory border border-brown/20 text-brown/30"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                {!isLast && (
                  <div
                    className={`h-px flex-1 mx-1 transition-colors duration-300 ${
                      done ? "bg-gold/50" : "bg-brown/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <span className="eyebrow text-brown text-[10px]">
          Step {current} of {STEP_LABELS.length} — {STEP_LABELS[current - 1]}
        </span>
      </div>

      {/* Desktop: full step bar (unchanged) */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-20 py-4 lg:py-5">
          <div className="flex items-center min-w-max lg:min-w-0 lg:justify-center gap-0">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < current;
              const active = n === current;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 px-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-300 shrink-0 ${
                        done
                          ? "bg-gold text-brown"
                          : active
                            ? "bg-brown text-ivory ring-4 ring-brown/10"
                            : "bg-ivory border border-brown/15 text-brown/30"
                      }`}
                    >
                      {done ? "✓" : n}
                    </div>
                    <span
                      className={`text-[10px] eyebrow tracking-wider whitespace-nowrap transition-colors ${
                        active ? "text-brown" : done ? "text-gold" : "text-brown/25"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`h-px w-8 lg:w-12 mx-0.5 mb-4 shrink-0 transition-colors duration-300 ${
                        done ? "bg-gold/50" : "bg-brown/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Completed Step Row ───────────────────────────────────────────────────────

function CompletedStepRow({
  n,
  title,
  icon: Icon,
  mobileValue,
  desktopLines,
  onEdit,
}: {
  n: number;
  title: string;
  icon: LucideIcon;
  mobileValue: string;
  desktopLines: string[];
  onEdit: () => void;
}) {
  return (
    <div className="bg-white border border-brown/10 px-5 sm:px-7 py-5 flex items-start justify-between gap-4 animate-fade-up">
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-brown text-[10px] shrink-0 font-medium mt-0.5">
          <Icon className="lg:hidden w-3.5 h-3.5" strokeWidth={2} />
          <span className="hidden lg:inline">✓</span>
        </div>
        <div className="min-w-0 flex-1">
          <span className="eyebrow text-brown/35 text-[9px] block mb-1.5">
            <span className="hidden lg:inline">{String(n).padStart(2, "0")} — </span>
            {title}
          </span>
          {/* Mobile: single line, truncated rather than wrapped */}
          <span className="lg:hidden font-display text-brown text-lg leading-snug block truncate">
            {mobileValue}
          </span>
          {/* Desktop: joined into a single line */}
          <span className="hidden lg:block font-display text-brown text-xl leading-snug">
            {desktopLines.join(" · ")}
          </span>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="eyebrow text-[10px] text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold hover:text-brown transition-all shrink-0 mt-0.5"
      >
        Edit
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ n, title, subtitle }: { n: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 lg:mb-8">
      <span className="eyebrow text-gold text-[10px] block mb-2">{n}</span>
      <h2 className="font-display text-3xl sm:text-[2rem] text-brown leading-tight">{title}</h2>
      {subtitle && <p className="text-taupe text-sm mt-2">{subtitle}</p>}
    </div>
  );
}

// ─── Premium Input ────────────────────────────────────────────────────────────

function PremiumInput({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="eyebrow text-brown/40 text-[10px] block mb-2">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      <div className="border-b-2 border-brown/12 pb-2.5 focus-within:border-gold transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}

// ─── Date Card ────────────────────────────────────────────────────────────────

function DateCard({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    const withPicker = el as HTMLInputElement & { showPicker?: () => void };
    try {
      if (withPicker.showPicker) {
        withPicker.showPicker();
      } else {
        el.focus();
      }
    } catch {
      el.focus();
    }
  }

  return (
    <div
      onClick={openPicker}
      className="bg-white border border-brown/12 px-5 py-4 focus-within:border-gold/60 transition-colors cursor-pointer"
    >
      <span className="eyebrow text-brown/35 text-[10px] block mb-2">{label}</span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-display text-brown text-lg outline-none cursor-pointer"
      />
      {value && <span className="text-taupe text-xs mt-1.5 block">{fmtDate(value)}</span>}
    </div>
  );
}

// ─── Check-in / Check-out Times ────────────────────────────────────────────────

function StayTimesCard() {
  return (
    <div className="mb-6">
      <div className="bg-white border border-brown/12 px-5 py-5 flex flex-col sm:flex-row gap-5 sm:gap-10">
        <div className="flex items-center gap-3">
          <Clock className="text-gold shrink-0" size={22} strokeWidth={1.5} />
          <div>
            <span className="eyebrow text-brown/35 text-[10px] block mb-0.5">Check-in</span>
            <span className="font-display text-brown text-base">{HOTEL_CHECKIN_TIME}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="text-gold shrink-0" size={22} strokeWidth={1.5} />
          <div>
            <span className="eyebrow text-brown/35 text-[10px] block mb-0.5">Check-out</span>
            <span className="font-display text-brown text-base">{HOTEL_CHECKOUT_TIME}</span>
          </div>
        </div>
      </div>
      <p className="text-taupe text-xs mt-3 leading-relaxed">
        Book directly to request early check-in / late check-out, subject to availability.
      </p>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({
  room,
  count,
  totalRooms,
  onAttemptAdd,
  onRemoveOne,
}: {
  room: RoomDetail;
  count: number;
  totalRooms: number;
  onAttemptAdd: () => string | null;
  onRemoveOne: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    function onOutsideClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setNotice(null);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [notice]);

  const cap = ROOM_TYPE_CAPS[room.category] ?? Infinity;
  const remaining = Math.max(0, cap - count);
  const lowStockThreshold = LOW_STOCK_THRESHOLDS[room.category] ?? 0;
  const atCap = count >= cap || totalRooms >= OVERALL_ROOM_CAP;
  const minusDisabled = count === 1 && totalRooms === 1;

  function handleAdd() {
    const err = onAttemptAdd();
    if (err) setNotice(err);
  }

  return (
    <div className="border-2 border-brown/10 bg-white hover:border-brown/25 hover:shadow-md transition-all duration-300 flex flex-row sm:flex-col">
      <div className="relative overflow-hidden w-[38%] sm:w-full shrink-0">
        <img
          src={getRoomImageUrl(room)}
          alt={room.imageAlt}
          className="absolute inset-0 w-full h-full sm:static sm:h-auto sm:aspect-[16/10] object-cover transition-transform duration-500 hover:scale-[1.02]"
          loading="lazy"
        />
        {remaining <= lowStockThreshold && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-brown/85 text-ivory eyebrow text-[8px] sm:text-[9px] px-2 py-1 sm:px-3 sm:py-1.5">
            {remaining} left
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6">
        <h3 className="mb-1">
          <Link
            href={roomAnchor(room.category)}
            className="font-display text-xl sm:text-2xl text-brown hover:text-gold transition-colors"
          >
            {room.name}
          </Link>
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 flex-wrap">
          {"size" in room && room.size && (
            <span className="flex items-center gap-1 text-taupe text-[11px] sm:text-xs">
              <Maximize2
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0"
                strokeWidth={1.75}
              />
              {room.size}
            </span>
          )}
          <span className="flex items-center gap-1 text-taupe text-[11px] sm:text-xs">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" strokeWidth={1.75} />
            Up to 2 Guests
          </span>
        </div>
        <div className="relative" ref={wrapRef}>
          <span className="text-gold font-bold text-lg sm:text-xl block mb-2 sm:mb-3">
            {room.price.replace("From ", "")}
          </span>
          <div className="flex items-center justify-between h-7 sm:h-8">
            {count === 0 ? (
              <button
                onClick={handleAdd}
                className="eyebrow text-[10px] h-full px-4 sm:px-5 flex items-center justify-center transition-all bg-brown text-ivory hover:bg-gold hover:text-brown"
              >
                Book
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 h-full">
                <button
                  type="button"
                  aria-label={`Remove one ${room.name}`}
                  disabled={minusDisabled}
                  onClick={onRemoveOne}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-colors ${
                    minusDisabled
                      ? "border-brown/10 text-brown/20 cursor-not-allowed"
                      : "border-brown/25 text-brown hover:border-gold hover:text-gold"
                  }`}
                >
                  <Minus size={14} />
                </button>
                <span className="font-display text-brown text-sm whitespace-nowrap">
                  {count} Room{count !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  aria-label={`Add another ${room.name}`}
                  onClick={handleAdd}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-colors ${
                    atCap
                      ? "border-brown/10 text-brown/25"
                      : "border-brown/25 text-brown hover:border-gold hover:text-gold"
                  }`}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>

          {notice && (
            <div className="absolute right-0 bottom-full mb-2 w-60 bg-brown text-ivory text-xs leading-relaxed px-3.5 py-3 shadow-lg z-20">
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setNotice(null)}
                className="absolute top-1.5 right-1.5 text-ivory/50 hover:text-ivory"
              >
                <X size={12} />
              </button>
              {notice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Guest Counter (with max-guests popup) ────────────────────────────────────

function GuestCounter({ guests, onChange }: { guests: number; onChange: (next: number) => void }) {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!noticeOpen) return;
    const timer = setTimeout(() => setNoticeOpen(false), 3000);
    function onOutsideClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setNoticeOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [noticeOpen]);

  const atMax = guests >= MAX_GUESTS_PER_ROOM;

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={wrapRef}>
      <span className="eyebrow text-brown/35 text-[10px]">Guests</span>
      <div className="flex items-center gap-1.5 sm:gap-3 relative">
        <button
          type="button"
          aria-label="Decrease guests"
          disabled={guests <= 1}
          onClick={() => onChange(Math.max(1, guests - 1))}
          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border transition-colors ${
            guests <= 1
              ? "border-brown/10 text-brown/20 cursor-not-allowed"
              : "border-brown/25 text-brown hover:border-gold hover:text-gold"
          }`}
        >
          <Minus size={13} />
        </button>
        <span className="font-display text-brown text-base w-4 text-center">{guests}</span>
        <button
          type="button"
          aria-label="Increase guests"
          onClick={() => (atMax ? setNoticeOpen(true) : onChange(guests + 1))}
          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border transition-colors ${
            atMax
              ? "border-brown/10 text-brown/25"
              : "border-brown/25 text-brown hover:border-gold hover:text-gold"
          }`}
        >
          <Plus size={13} />
        </button>

        {noticeOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-brown text-ivory text-xs leading-relaxed px-3.5 py-3 shadow-lg z-20">
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setNoticeOpen(false)}
              className="absolute top-1.5 right-1.5 text-ivory/50 hover:text-ivory"
            >
              <X size={12} />
            </button>
            Maximum 2 guests per room. To add more guests, add another room.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Room Row (in "Your Rooms") ────────────────────────────────────────────────

function RoomRowItem({
  index,
  row,
  room,
  removable,
  onGuestsChange,
  onRemove,
}: {
  index: number;
  row: RoomRow;
  room: RoomDetail | undefined;
  removable: boolean;
  onGuestsChange: (guests: number) => void;
  onRemove: () => void;
}) {
  if (!room) return null;
  return (
    <div className="bg-white border border-brown/10 px-4 sm:px-5 py-4 flex items-center gap-2 sm:gap-4 flex-nowrap">
      <img
        src={getRoomImageUrl(room)}
        alt={room.name}
        className="w-11 h-9 sm:w-16 sm:h-12 object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <span className="font-display text-brown text-base block truncate">
          Room {index + 1}: {room.name}
        </span>
      </div>
      <GuestCounter guests={row.guests} onChange={onGuestsChange} />
      {removable && (
        <button
          type="button"
          aria-label="Remove room"
          onClick={onRemove}
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-brown/40 hover:text-brown shrink-0"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-ivory/50 text-sm shrink-0">{label}</span>
      <span className="text-ivory text-sm text-right">{value}</span>
    </div>
  );
}

// ─── Booking Sidebar ──────────────────────────────────────────────────────────

interface SidebarRow {
  uid: string;
  room: RoomDetail | undefined;
  guests: number;
  subtotal: number;
}

function BookingSidebar({
  checkIn,
  checkOut,
  nights,
  rows,
  gst,
  total,
  currentStep,
}: {
  checkIn: string;
  checkOut: string;
  nights: number;
  rows: SidebarRow[];
  gst: number;
  total: number;
  currentStep: number;
}) {
  return (
    <div className="bg-brown text-ivory">
      <div className="p-6 lg:p-7">
        <span className="eyebrow text-gold text-[10px] block mb-5">Booking Summary</span>

        {/* Stay details */}
        <div className="space-y-2.5 pb-5 border-b border-ivory/10">
          <SummaryRow label="Check-in" value={fmtDate(checkIn)} />
          <SummaryRow label="Check-out" value={fmtDate(checkOut)} />
          <SummaryRow
            label="Duration"
            value={nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
          />
          {rows.length > 0 && <SummaryRow label="Total Rooms" value={String(rows.length)} />}
        </div>

        {/* Rooms */}
        {rows.length > 0 ? (
          <div className="py-5 border-b border-ivory/10 space-y-4">
            {rows.map((r) =>
              r.room ? (
                <div key={r.uid} className="flex gap-3">
                  <img
                    src={getRoomImageUrl(r.room)}
                    alt={r.room.name}
                    className="w-16 h-12 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-ivory text-sm leading-tight truncate">
                        {r.room.name} — {r.guests} Guest{r.guests !== 1 ? "s" : ""}
                      </span>
                      <span className="text-ivory/90 text-base shrink-0">
                        {nights > 0 ? fmtMoney(r.subtotal) : `${fmtMoney(r.subtotal)}/night`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <div className="py-5">
            <div className="h-14 bg-ivory/5 flex items-center justify-center">
              <span className="eyebrow text-ivory/20 text-[10px]">No rooms selected yet</span>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="py-5 space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-ivory/50 text-sm shrink-0">Taxes & Other Charges</span>
              <span className="text-ivory/90 text-base">{fmtMoney(gst)}</span>
            </div>
            <div className="mt-2 pt-4 border-t border-ivory/10">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-ivory/40 text-[10px]">Grand Total</span>
                <span className="font-semibold text-gold text-2xl lg:text-3xl block">
                  {fmtMoney(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mobile Bottom Bar ────────────────────────────────────────────────────────

function MobileBottomBar({
  rows,
  total,
  gst,
  nights,
  currentStep,
  step1Valid,
  step2Valid,
  step3Valid,
  summaryOpen,
  onToggle,
  onContinue,
  checkIn,
  checkOut,
  isSubmitting,
}: {
  rows: SidebarRow[];
  total: number;
  gst: number;
  nights: number;
  currentStep: number;
  step1Valid: boolean;
  step2Valid: boolean;
  step3Valid: boolean;
  summaryOpen: boolean;
  onToggle: () => void;
  onContinue: () => void;
  checkIn: string;
  checkOut: string;
  isSubmitting: boolean;
}) {
  let ctaLabel = "Continue";
  let ctaEnabled = false;

  if (currentStep === 1) {
    ctaLabel = "Continue";
    ctaEnabled = step1Valid;
  } else if (currentStep === 2) {
    ctaLabel = "Continue";
    ctaEnabled = step2Valid;
  } else if (currentStep === 3) {
    ctaLabel = "Review Booking";
    ctaEnabled = step3Valid;
  } else if (currentStep === 4) {
    ctaLabel = "Pay and Book";
    ctaEnabled = !isSubmitting;
  }

  // Step 4: simplified bar — Grand Total + Confirm Booking, no expandable breakdown
  // (the full breakdown is already rendered inline on the page for this step).
  if (currentStep === 4) {
    return (
      <div id="mobile-bottom-bar" className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-brown text-ivory shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="eyebrow text-gold/70 text-[9px] mb-0.5">Grand Total</div>
              <span className="font-semibold text-xl text-ivory leading-none">
                {fmtMoney(total)}
              </span>
            </div>
            <button
              onClick={ctaEnabled ? onContinue : undefined}
              disabled={!ctaEnabled}
              className={`shrink-0 eyebrow px-5 py-3.5 transition-all text-[10px] whitespace-nowrap ${
                ctaEnabled
                  ? "bg-gold text-brown hover:bg-ivory"
                  : "bg-ivory/15 text-ivory/35 cursor-not-allowed"
              }`}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const collapsedLabel =
    currentStep === 1
      ? "Select dates to continue"
      : rows.length > 0
        ? `${rows.length} Room${rows.length !== 1 ? "s" : ""} selected`
        : "Select a room to continue";

  return (
    <div id="mobile-bottom-bar" className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {summaryOpen && (
        <div
          className="fixed inset-0 bg-brown/60 backdrop-blur-sm"
          style={{ zIndex: -1 }}
          onClick={onToggle}
        />
      )}

      <div className="bg-brown text-ivory shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.5)]">
        {summaryOpen && (
          <div className="px-5 pt-5 pb-2 border-b border-ivory/10 max-h-[50vh] overflow-y-auto">
            <span className="eyebrow text-gold text-[10px] block mb-4">Price Summary</span>
            <div className="space-y-2.5 pb-4 mb-4 border-b border-ivory/10">
              <SummaryRow label="Check-in" value={fmtDate(checkIn)} />
              <SummaryRow label="Check-out" value={fmtDate(checkOut)} />
              <SummaryRow label="Nights" value={nights > 0 ? String(nights) : "—"} />
              {rows.length > 0 && <SummaryRow label="Total Rooms" value={String(rows.length)} />}
            </div>
            {rows.length > 0 ? (
              <div className="space-y-2.5 pb-3">
                {rows.map((r) =>
                  r.room ? (
                    <div key={r.uid} className="flex items-baseline justify-between gap-4">
                      <span className="text-ivory/50 text-sm shrink-0">
                        {r.room.name} — {r.guests} Guest{r.guests !== 1 ? "s" : ""}
                      </span>
                      <span className="text-ivory/90 text-base">
                        {nights > 0 ? fmtMoney(r.subtotal) : `${fmtMoney(r.subtotal)}/night`}
                      </span>
                    </div>
                  ) : null,
                )}
                {nights > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-ivory/50 text-sm shrink-0">Taxes & Other Charges</span>
                    <span className="text-ivory/90 text-base">{fmtMoney(gst)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-ivory/10">
                  <span className="eyebrow text-ivory/40 text-[10px]">Grand Total</span>
                  <span className="font-semibold text-gold text-xl">{fmtMoney(total)}</span>
                </div>
              </div>
            ) : (
              <p className="text-ivory/35 text-xs pb-3">Select a room to see pricing.</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={onToggle} className="flex-1 text-left min-w-0">
            <div className="eyebrow text-gold/70 text-[9px] mb-0.5">{collapsedLabel}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-ivory leading-none">
                {rows.length > 0 ? fmtMoney(total) : "—"}
              </span>
              {rows.length > 0 && (
                <span className="text-ivory/40 text-xs">{summaryOpen ? "▼" : "▲"}</span>
              )}
            </div>
          </button>
          <button
            onClick={ctaEnabled ? onContinue : undefined}
            disabled={!ctaEnabled}
            className={`shrink-0 eyebrow px-5 py-3.5 transition-all text-[10px] whitespace-nowrap ${
              ctaEnabled
                ? "bg-gold text-brown hover:bg-ivory"
                : "bg-ivory/15 text-ivory/35 cursor-not-allowed"
            }`}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Success Section ──────────────────────────────────────────────────────────

function SuccessSection({
  bookingId,
  guestName,
  guestEmail,
  rows,
  checkIn,
  checkOut,
  nights,
  total,
}: {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  rows: SidebarRow[];
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
}) {
  const totalGuests = rows.reduce((sum, r) => sum + r.guests, 0);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold text-2xl">✓</span>
        </div>
        <span className="eyebrow text-gold text-[10px] block mb-3">Reservation Received</span>
        <h2 className="font-display text-4xl lg:text-5xl text-brown mb-4">
          Thank you, <span className="italic">{guestName.split(" ")[0]}.</span>
        </h2>
        <p className="text-taupe text-sm lg:text-base leading-relaxed max-w-md mx-auto">
          We've received your reservation request. Our team will contact you at{" "}
          <span className="text-brown font-medium">{guestEmail}</span> within 24 hours to confirm
          your booking.
        </p>
      </div>

      <div className="bg-brown text-ivory mb-8">
        <div className="px-6 py-4 border-b border-ivory/10">
          <span className="eyebrow text-gold text-[10px]">Booking Details</span>
        </div>
        <div className="divide-y divide-ivory/8">
          <div className="px-6 py-3.5 flex items-center justify-between gap-4">
            <span className="eyebrow text-ivory/35 text-[10px] shrink-0">Booking ID</span>
            <span className="font-display text-gold tracking-widest text-sm">{bookingId}</span>
          </div>
          {rows.map((r) =>
            r.room ? (
              <div key={r.uid} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <span className="eyebrow text-ivory/35 text-[10px] shrink-0">Room</span>
                <span className="text-ivory text-sm text-right">
                  {r.room.name} — {r.guests} Guest{r.guests !== 1 ? "s" : ""}
                </span>
              </div>
            ) : null,
          )}
          {(
            [
              ["Check-in", fmtDate(checkIn)],
              ["Check-out", fmtDate(checkOut)],
              ["Duration", nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"],
              ["Guests", String(totalGuests)],
              ["Guest Name", guestName],
              ["Total", fmtMoney(total)],
              ["Payment Status", "Pending — Our team will confirm"],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div key={label} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <span className="eyebrow text-ivory/35 text-[10px] shrink-0">{label}</span>
              <span
                className={
                  label === "Total"
                    ? "text-gold text-xl"
                    : label === "Payment Status"
                      ? "eyebrow text-gold text-[10px] text-right"
                      : "text-ivory text-sm text-right"
                }
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="eyebrow text-[10px] border border-brown/20 px-8 py-4 text-brown/60 hover:text-brown hover:border-brown/40 transition-all text-center flex-1"
        >
          Return Home
        </Link>
        <Link
          href="/rooms"
          className="eyebrow text-[10px] bg-brown text-ivory px-8 py-4 hover:bg-gold hover:text-brown transition-all text-center flex-1"
        >
          Explore Rooms
        </Link>
      </div>
    </div>
  );
}

// ─── Booking Page ─────────────────────────────────────────────────────────────

function BookingPageInner() {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [checkIn, setCheckIn] = useState(() => {
    const v = searchParams.get("checkIn") ?? "";
    return isCheckInValid(v) ? v : "";
  });
  const [checkOut, setCheckOut] = useState(() => {
    const ciRaw = searchParams.get("checkIn") ?? "";
    const effectiveCheckIn = isCheckInValid(ciRaw) ? ciRaw : "";
    const v = searchParams.get("checkOut") ?? "";
    return isCheckOutValid(v, effectiveCheckIn) ? v : "";
  });

  function handleCheckInChange(v: string) {
    setCheckIn(v);
    setCheckOut((prev) => resolveCheckOutOnCheckInChange(v, prev));
  }
  const [roomRows, setRoomRows] = useState<RoomRow[]>(() => {
    const id = matchRoomId(searchParams.get("room") ?? "");
    return id ? [{ uid: makeRowId(), roomId: id, guests: 1 }] : [];
  });
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [hasAutoScrolledToRooms, setHasAutoScrolledToRooms] = useState(false);
  const [bookingId] = useState(() => "LDV-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [roomsList, setRoomsList] = useState<RoomItem[]>([]);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
        if (!res.ok) throw new Error("Failed to load rooms");
        const data = await res.json();
        setRoomsList(data);
      } catch (err) {
        console.warn("Falling back to static rooms:", err);
        setRoomsList(ROOMS_DETAIL as unknown as RoomItem[]);
      }
    }
    loadRooms();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/offer`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isCouponLive) {
          setCouponDiscount(data.discountPercentage || 0);
        }
      })
      .catch(console.error);
  }, []);

  const stepsTopRef = useRef<HTMLDivElement>(null);
  const roomCardsRef = useRef<HTMLDivElement>(null);
  const yourRoomsRef = useRef<HTMLDivElement>(null);

  const nights = nightCount(checkIn, checkOut);

  const rows: SidebarRow[] = roomRows.map((row) => {
    const room = roomsList.find((r) => r.id === row.roomId);
    if (!room) return { uid: row.uid, room, guests: row.guests, subtotal: 0 };

    const basePrice = parsePrice(room.price);
    const anyRoom = room as unknown as Record<string, string>;
    const specialPrice = anyRoom.specialPrice ? parsePrice(anyRoom.specialPrice) : basePrice;

    let subtotal = 0;
    if (checkIn && nights > 0) {
      for (let i = 0; i < nights; i++) {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + i);
        let nightPrice = basePrice;

        if (anyRoom.specialPriceStartDate && anyRoom.specialPriceEndDate) {
          const startDate = new Date(anyRoom.specialPriceStartDate).setHours(0, 0, 0, 0);
          const endDate = new Date(anyRoom.specialPriceEndDate).setHours(23, 59, 59, 999);
          const current = d.getTime();
          if (current >= startDate && current <= endDate) {
            nightPrice = specialPrice;
          }
        }
        subtotal += nightPrice;
      }
    } else {
      subtotal = basePrice;
    }
    return { uid: row.uid, room, guests: row.guests, subtotal };
  });

  let subtotal = rows.reduce((sum, r) => sum + r.subtotal, 0);
  let discountAmount = 0;
  if (couponCode.trim() && couponDiscount > 0) {
    discountAmount = Math.round(subtotal * (couponDiscount / 100));
    subtotal = subtotal - discountAmount;
  }

  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const step1Valid = validateBookingDates(checkIn, checkOut);
  const step2Valid = roomRows.length > 0;
  const phoneValid = guestPhone.length === PHONE_DIGITS;
  const emailValid = EMAIL_REGEX.test(guestEmail.trim());
  const step3Valid = guestName.trim() !== "" && emailValid && phoneValid && consentChecked;

  function scrollToStepsTop() {
    setTimeout(() => {
      stepsTopRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 0);
  }

  function goToStep(step: number) {
    setCurrentStep(step);
    scrollToStepsTop();
  }

  function addRoomRow(roomId: string) {
    setRoomRows((prev) => [...prev, { uid: makeRowId(), roomId, guests: 1 }]);
  }

  function updateRowGuests(uid: string, guests: number) {
    setRoomRows((prev) => prev.map((r) => (r.uid === uid ? { ...r, guests } : r)));
  }

  function removeRow(uid: string) {
    setRoomRows((prev) => (prev.length > 1 ? prev.filter((r) => r.uid !== uid) : prev));
  }

  function countOfType(roomId: string) {
    return roomRows.filter((r) => r.roomId === roomId).length;
  }

  function scrollToYourRoomsOnce() {
    if (hasAutoScrolledToRooms) return;
    setHasAutoScrolledToRooms(true);
    // Scroll only as far as needed to clear the "Your Rooms" section's bottom edge past
    // the sticky mobile footer, keeping the room cards and step heading visible above it.
    // scrollIntoView's block:"end" ignores the fixed footer overlaying the viewport, so we
    // compute the offset manually instead of relying on it.
    setTimeout(() => {
      const el = yourRoomsRef.current;
      if (!el) return;
      const footerEl = document.getElementById("mobile-bottom-bar");
      const footerHeight = footerEl?.getBoundingClientRect().height ?? 0;
      const visibleBottom = window.innerHeight - footerHeight;
      const overshoot = el.getBoundingClientRect().bottom - visibleBottom + 16;
      if (overshoot > 0) {
        window.scrollBy({ top: overshoot, behavior: "instant" });
      }
    }, 200);
  }

  function attemptAddRoom(room: RoomItem): string | null {
    const cap = ROOM_TYPE_CAPS[room.category] ?? Infinity;
    if (countOfType(room.id) >= cap) {
      return `No more ${room.category} rooms available for these dates.`;
    }
    if (roomRows.length >= OVERALL_ROOM_CAP) {
      return "Maximum 5 rooms per booking. Please contact us directly for larger group bookings.";
    }
    addRoomRow(room.id);
    scrollToYourRoomsOnce();
    return null;
  }

  function removeLastRowOfType(roomId: string) {
    setRoomRows((prev) => {
      if (prev.length <= 1) return prev;
      const idx = [...prev].reverse().findIndex((r) => r.roomId === roomId);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.filter((_, i) => i !== realIdx);
    });
  }

  function continueFromStep1() {
    if (!step1Valid) return;
    setCurrentStep(roomRows.length > 0 ? 3 : 2);
    scrollToStepsTop();
  }

  function continueFromStep2() {
    if (!step2Valid) return;
    setCurrentStep(3);
    scrollToStepsTop();
  }

  function continueFromStep3() {
    if (!step3Valid) return;
    setCurrentStep(4);
    scrollToStepsTop();
  }

  function handleConsentChange(checked: boolean) {
    setConsentChecked(checked);
    setConsentTimestamp(checked ? new Date().toISOString() : null);
  }

  async function submitReservation() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Fetch public key and session nonce from backend
      // In production, you would fetch from window.location.origin or a configured API base
      const keyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/security/key`);
      if (!keyRes.ok) {
        throw new Error("Failed to establish secure connection with server");
      }
      const keyData = await keyRes.json();

      // 2. Build payload
      const payload = {
        bookingId,
        checkIn,
        checkOut,
        rooms: roomRows.map((r) => ({ roomId: r.roomId, guests: r.guests })),
        guestName,
        guestEmail,
        guestPhone: guestPhone ? `+91${guestPhone}` : "",
        consent: { given: consentChecked, timestamp: consentTimestamp },
        total,
      };

      // 3. Encrypt payload on client side using imported keys
      const envelope = await encryptPayload(payload, keyData.publicKey, keyData.nonceId);

      // 4. Post encrypted envelope and the nonce ID to server
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...envelope,
          nonceId: keyData.nonceId,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to process reservation");
      }

      // 5. Success -> transition to confirmation screen
      setCurrentStep(5);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } catch (err: unknown) {
      console.error("Reservation submit error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to connect to reservation service. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRazorpayCheckout() {
    // Stub: will call the Razorpay order-creation endpoint and open checkout once it exists.
  }

  function handleMobileContinue() {
    if (currentStep === 1) continueFromStep1();
    else if (currentStep === 2) continueFromStep2();
    else if (currentStep === 3) continueFromStep3();
    else if (currentStep === 4) submitReservation();
  }

  const step2Summary = (() => {
    if (rows.length === 0) return "—";
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (!r.room) continue;
      counts.set(r.room.name, (counts.get(r.room.name) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, n]) => `${n} ${name}`).join(", ");
  })();

  return (
    <main className="bg-ivory text-brown min-h-screen">
      <Header />

      {/* Page header */}
      <div className="bg-brown text-ivory pt-24 lg:pt-32">
        <div className="px-5 sm:px-8 lg:px-10 xl:px-20 pb-7 lg:pb-9 flex items-center justify-between gap-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Booking Details
          </h1>
          <BookingCalendarIcon className="text-gold shrink-0 w-10 h-10 sm:w-14 sm:h-14" />
        </div>
      </div>

      {/* Progress tracker */}
      <ProgressTracker current={currentStep} />

      {currentStep < 5 ? (
        <div
          ref={stepsTopRef}
          style={{ scrollMarginTop: "96px" }}
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-20 py-10 lg:py-14 pb-36 lg:pb-20"
        >
          <div className="lg:grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:gap-10 xl:gap-14">
            {/* Left: Progressive steps */}
            <div className="flex flex-col gap-5 lg:gap-7">
              {/* ── Step 1: Stay Details ── */}
              {currentStep > 1 ? (
                <CompletedStepRow
                  n={1}
                  title="Stay Details"
                  icon={Calendar}
                  mobileValue={`${fmtDate(checkIn)} → ${fmtDate(checkOut)}`}
                  desktopLines={[
                    `${fmtDate(checkIn)} → ${fmtDate(checkOut)}`,
                    `${nights} night${nights !== 1 ? "s" : ""}`,
                  ]}
                  onEdit={() => goToStep(1)}
                />
              ) : (
                <section className="animate-fade-up">
                  <SectionHeader
                    n="01"
                    title="Stay Details"
                    subtitle="Best Rate Guaranteed when you book direct."
                  />
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <DateCard
                      label="CHECK-IN"
                      value={checkIn}
                      onChange={handleCheckInChange}
                      min={minCheckInISO()}
                    />
                    <DateCard
                      label="CHECK-OUT"
                      value={checkOut}
                      onChange={setCheckOut}
                      min={minCheckOutISO(checkIn)}
                    />
                  </div>
                  {nights > 0 && (
                    <div className="mt-4 mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-champagne/40 border border-brown/10 text-taupe text-xs px-3 py-1.5">
                        <span className="text-gold">—</span>
                        {nights} night{nights !== 1 ? "s" : ""} selected
                      </span>
                    </div>
                  )}
                  <StayTimesCard />
                  <button
                    onClick={continueFromStep1}
                    disabled={!step1Valid}
                    className={`hidden lg:inline-block eyebrow px-10 py-4 transition-all text-[11px] ${
                      step1Valid
                        ? "bg-brown text-ivory hover:bg-gold hover:text-brown"
                        : "bg-brown/15 text-brown/30 cursor-not-allowed"
                    }`}
                  >
                    {roomRows.length > 0 ? "Continue to Contact Details" : "Continue to Rooms →"}
                  </button>
                </section>
              )}

              {/* ── Step 2: Choose Rooms ── */}
              {currentStep >= 2 &&
                (currentStep > 2 ? (
                  <CompletedStepRow
                    n={2}
                    title="Choose Rooms"
                    icon={BedDouble}
                    mobileValue={step2Summary}
                    desktopLines={[step2Summary]}
                    onEdit={() => goToStep(2)}
                  />
                ) : (
                  <div style={{ scrollMarginTop: "96px" }} className="animate-fade-up">
                    <section>
                      <SectionHeader
                        n="02"
                        title="Choose Your Rooms"
                        subtitle="Select a room type for each room in your stay."
                      />
                      <div ref={roomCardsRef} style={{ scrollMarginTop: "96px" }} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        {roomsList.map((r) => (
                          <RoomCard
                            key={r.id}
                            room={r}
                            count={countOfType(r.id)}
                            totalRooms={roomRows.length}
                            onAttemptAdd={() => attemptAddRoom(r)}
                            onRemoveOne={() => removeLastRowOfType(r.id)}
                          />
                        ))}
                      </div>

                      {roomRows.length > 0 && (
                        <div
                          className="mb-6"
                          ref={yourRoomsRef}
                          style={{ scrollMarginTop: "96px" }}
                        >
                          <span className="eyebrow text-brown/35 text-[10px] block mb-3">
                            Your Rooms
                          </span>
                          <div className="flex flex-col gap-3">
                            {roomRows.map((row, i) => (
                              <RoomRowItem
                                key={row.uid}
                                row={row}
                                index={i}
                                room={roomsList.find((r) => r.id === row.roomId)}
                                removable={roomRows.length > 1}
                                onGuestsChange={(g) => updateRowGuests(row.uid, g)}
                                onRemove={() => removeRow(row.uid)}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              roomCardsRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              })
                            }
                            className="eyebrow text-gold text-[10px] mt-4 hover:text-brown transition-colors"
                          >
                            + Add Another Room
                          </button>
                        </div>
                      )}

                      <button
                        onClick={continueFromStep2}
                        disabled={!step2Valid}
                        className={`hidden lg:inline-block eyebrow px-10 py-4 transition-all text-[11px] ${
                          step2Valid
                            ? "bg-brown text-ivory hover:bg-gold hover:text-brown"
                            : "bg-brown/15 text-brown/30 cursor-not-allowed"
                        }`}
                      >
                        Continue to Contact Details →
                      </button>
                    </section>
                  </div>
                ))}

              {/* ── Step 3: Contact Details ── */}
              {currentStep >= 3 &&
                (currentStep > 3 ? (
                  <CompletedStepRow
                    n={3}
                    title="Contact Details"
                    icon={Phone}
                    mobileValue={guestName}
                    desktopLines={[
                      guestName,
                      `+91 ${guestPhone.slice(0, 5)} ${guestPhone.slice(5)}`,
                      guestEmail,
                    ]}
                    onEdit={() => goToStep(3)}
                  />
                ) : (
                  <div style={{ scrollMarginTop: "96px" }} className="animate-fade-up">
                    <section>
                      <SectionHeader
                        n="03"
                        title="Contact Details"
                        subtitle="Tell us how to reach you about this booking."
                      />
                      <div className="flex flex-col gap-6 mb-8">
                        <PremiumInput label="FULL NAME" required>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-transparent font-display text-brown text-lg outline-none placeholder:text-brown/20 pt-1"
                          />
                        </PremiumInput>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <PremiumInput label="PHONE NUMBER" required>
                              <div className="flex items-center gap-2">
                                <span className="font-display text-brown text-lg shrink-0">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  value={guestPhone}
                                  onChange={(e) =>
                                    setGuestPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                                  }
                                  placeholder="00000 00000"
                                  className="w-full bg-transparent font-display text-brown text-lg outline-none placeholder:text-brown/20 pt-1"
                                />
                              </div>
                            </PremiumInput>
                            {guestPhone.length > 0 && !phoneValid && (
                              <span className="text-red-600 text-xs mt-1.5 block">
                                Enter a valid 10-digit phone number
                              </span>
                            )}
                          </div>
                          <div>
                            <PremiumInput label="EMAIL ADDRESS" required>
                              <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-transparent font-display text-brown text-lg outline-none placeholder:text-brown/20 pt-1"
                              />
                            </PremiumInput>
                            {guestEmail.length > 0 && !emailValid && (
                              <span className="text-red-600 text-xs mt-1.5 block">
                                Enter a valid email address
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 mb-8 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentChecked}
                          onChange={(e) => handleConsentChange(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[var(--color-gold,#b9985a)] shrink-0 cursor-pointer"
                        />
                        <span className="text-taupe text-xs leading-relaxed">
                          I consent to the collection, processing, and storage of my personal data
                          as per the{" "}
                          <Link
                            href="/privacy-policy"
                            className="text-gold underline hover:text-brown"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>

                      <button
                        onClick={continueFromStep3}
                        disabled={!step3Valid}
                        className={`hidden lg:inline-block eyebrow px-10 py-4 transition-all text-[11px] ${
                          step3Valid
                            ? "bg-brown text-ivory hover:bg-gold hover:text-brown"
                            : "bg-brown/15 text-brown/30 cursor-not-allowed"
                        }`}
                      >
                        Review Booking →
                      </button>
                    </section>
                  </div>
                ))}

              {/* ── Step 4: Review & Confirm ── */}
              {currentStep >= 4 && (
                <div style={{ scrollMarginTop: "96px" }} className="animate-fade-up">
                  <section>
                    <SectionHeader n="04" title="Review & Confirm" />

                    {/* Mobile: full inline booking summary (no persistent sidebar on mobile) */}
                    <div className="lg:hidden mb-6">
                      <BookingSidebar
                        checkIn={checkIn}
                        checkOut={checkOut}
                        nights={nights}
                        rows={rows}
                        gst={gst}
                        total={total}
                        currentStep={currentStep}
                      />
                    </div>

                    {/* Desktop: concise confirmation (full detail already in the persistent sidebar) */}
                    <div className="hidden lg:block mb-8">
                      <p className="font-display text-brown text-xl leading-relaxed mb-4">
                        You&rsquo;re booking {rows.length} room{rows.length !== 1 ? "s" : ""} for{" "}
                        {nights} night{nights !== 1 ? "s" : ""} ({fmtDate(checkIn)} –{" "}
                        {fmtDate(checkOut)})
                      </p>
                      <span className="font-semibold text-gold text-2xl lg:text-3xl block">
                        {fmtMoney(total)}
                      </span>
                    </div>

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-4 text-xs font-sans">
                        {submitError}
                      </div>
                    )}

                    <button
                      onClick={submitReservation}
                      disabled={isSubmitting}
                      className={`hidden lg:inline-block eyebrow px-10 py-4 transition-all text-[11px] ${
                        isSubmitting
                          ? "bg-brown/15 text-brown/40 cursor-not-allowed"
                          : "bg-gold text-brown hover:bg-brown hover:text-ivory"
                      }`}
                    >
                      Pay and Book
                    </button>
                    <p className="text-taupe text-xs mt-3">
                      You&rsquo;ll receive a booking confirmation and invoice via email.
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Right: Sticky sidebar (desktop only) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <BookingSidebar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  rows={rows}
                  gst={gst}
                  total={total}
                  currentStep={currentStep}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SuccessSection
          bookingId={bookingId}
          guestName={guestName}
          guestEmail={guestEmail}
          rows={rows}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          total={total}
        />
      )}

      {/* Mobile bottom bar */}
      {currentStep < 5 && (
        <MobileBottomBar
          rows={rows}
          total={total}
          gst={gst}
          nights={nights}
          currentStep={currentStep}
          step1Valid={step1Valid}
          step2Valid={step2Valid}
          step3Valid={step3Valid}
          summaryOpen={summaryOpen}
          onToggle={() => setSummaryOpen((v) => !v)}
          onContinue={handleMobileContinue}
          checkIn={checkIn}
          checkOut={checkOut}
          isSubmitting={isSubmitting}
        />
      )}

      <Footer />
    </main>
  );
}

export function BookingPageClient() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ivory" />}>
      <BookingPageInner />
    </Suspense>
  );
}
