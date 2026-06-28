"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useRef, Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ROOMS_DETAIL, BOOKING_GUEST_OPTIONS } from "@/data/siteContent";
import { encryptPayload } from "@/lib/encryption";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";

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

function getRoomImageUrl(room: RoomItem | undefined) {
  if (!room) return "";
  if (room.imageUrl) {
    if (
      room.imageUrl.startsWith("http") ||
      room.imageUrl.startsWith("/") ||
      room.imageUrl.startsWith("data:")
    ) {
      return room.imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${room.imageUrl}`;
  }
  return ROOM_IMAGES[room.imageKey || ""] || ROOM_IMAGES.room1;
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

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

// ─── Step labels ──────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Stay Details",
  "Choose Room",
  "Guest Details",
  "Review & Confirm",
  "Reservation Received",
];

// ─── Progress Tracker ─────────────────────────────────────────────────────────

function ProgressTracker({ current }: { current: number }) {
  return (
    <div className="bg-ivory border-b border-brown/8 overflow-x-auto">
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
                    className={`text-[9px] lg:text-[10px] eyebrow tracking-wider whitespace-nowrap transition-colors ${
                      active ? "text-brown" : done ? "text-gold" : "text-brown/25"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`h-px w-5 sm:w-8 lg:w-12 mx-0.5 mb-4 shrink-0 transition-colors duration-300 ${
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
  );
}

// ─── Completed Step Row ───────────────────────────────────────────────────────

function CompletedStepRow({
  n,
  title,
  summary,
  onEdit,
}: {
  n: number;
  title: string;
  summary: string;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white border border-brown/10 px-5 sm:px-7 py-4 flex items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-brown text-[10px] shrink-0 font-medium">
          ✓
        </div>
        <div className="min-w-0">
          <span className="eyebrow text-brown/35 text-[9px] block mb-0.5">
            {String(n).padStart(2, "0")} — {title}
          </span>
          <span className="text-sm text-brown truncate block">{summary}</span>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="eyebrow text-[10px] text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold hover:text-brown transition-all shrink-0"
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
  return (
    <div className="bg-white border border-brown/12 px-5 py-4 focus-within:border-gold/60 transition-colors">
      <span className="eyebrow text-brown/35 text-[10px] block mb-2">{label}</span>
      <input
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

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({
  room,
  selected,
  onSelect,
}: {
  room: RoomDetail;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer border-2 transition-all duration-300 ${
        selected
          ? "border-gold shadow-[0_8px_32px_-8px_rgba(180,150,80,0.4)] bg-champagne/20 scale-[1.01]"
          : "border-brown/10 bg-white hover:border-brown/25 hover:shadow-md"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={getRoomImageUrl(room)}
          alt={room.imageAlt}
          className={`w-full aspect-[16/10] object-cover transition-transform duration-500 ${
            selected ? "scale-[1.03]" : "group-hover:scale-[1.02]"
          }`}
          loading="lazy"
        />
        {selected && (
          <div className="absolute top-3 right-3 bg-gold text-brown eyebrow text-[9px] px-3 py-1">
            SELECTED ✓
          </div>
        )}
      </div>
      <div className="p-5 lg:p-6">
        <span className="eyebrow text-gold text-[10px] block mb-1">{room.category}</span>
        <h3 className="font-display text-2xl text-brown mb-1">{room.name}</h3>
        <p className="text-taupe text-xs mb-4">
          {"size" in room ? `${room.size} · ` : ""}
          {room.capacity}
        </p>
        <div className="grid grid-cols-2 gap-x-3 mb-5">
          {room.amenities.slice(0, 6).map((a) => (
            <span
              key={a}
              className="text-[11px] text-brown/55 py-1.5 border-b border-brown/8 flex items-center gap-1.5"
            >
              <span className="text-gold/60 shrink-0">—</span>
              {a}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="eyebrow text-brown/35 text-[10px] block mb-0.5">Starting from</span>
            <span className="font-display text-brown text-xl">
              {room.price.replace("From ", "")}
            </span>
          </div>
          <div
            className={`eyebrow text-[10px] px-5 py-2.5 transition-all ${
              selected ? "bg-gold text-brown" : "bg-brown text-ivory hover:bg-gold hover:text-brown"
            }`}
          >
            {selected ? "Selected ✓" : "Select Room"}
          </div>
        </div>
      </div>
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

function BookingSidebar({
  checkIn,
  checkOut,
  nights,
  guests,
  room,
  subtotal,
  gst,
  total,
  currentStep,
}: {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  room: RoomDetail | undefined;
  subtotal: number;
  gst: number;
  total: number;
  currentStep: number;
}) {
  const perNight = room ? parsePrice(room.price) : 0;

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
          <SummaryRow label="Guests" value={guests || "—"} />
        </div>

        {/* Room */}
        {room ? (
          <div className="py-5 border-b border-ivory/10">
            <div className="flex gap-3 mb-4">
              <img
                src={getRoomImageUrl(room)}
                alt={room.name}
                className="w-16 h-12 object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="eyebrow text-gold/70 text-[9px] block mb-0.5">
                  {room.category}
                </span>
                <span className="font-display text-ivory text-sm leading-tight block">
                  {room.name}
                </span>
                {"size" in room && <span className="text-ivory/40 text-xs">{room.size}</span>}
              </div>
            </div>

            {nights > 0 ? (
              <div className="space-y-2.5">
                <SummaryRow label="Rate / night" value={`₹${perNight.toLocaleString("en-IN")}`} />
                <SummaryRow
                  label={`${nights} night${nights > 1 ? "s" : ""}`}
                  value={fmtMoney(subtotal)}
                />
                <SummaryRow label="GST (18%)" value={fmtMoney(gst)} />
              </div>
            ) : (
              <SummaryRow label="Rate / night" value={`₹${perNight.toLocaleString("en-IN")}`} />
            )}

            <div className="mt-4 pt-4 border-t border-ivory/10">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-ivory/40 text-[10px]">Grand Total</span>
                <div className="text-right">
                  <span className="font-display text-gold text-2xl lg:text-3xl block">
                    {nights > 0 ? fmtMoney(total) : `₹${perNight.toLocaleString("en-IN")}`}
                  </span>
                  {nights === 0 && (
                    <span className="text-ivory/30 text-[10px]">per night + GST</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 border-b border-ivory/10">
            <div className="h-14 bg-ivory/5 flex items-center justify-center">
              <span className="eyebrow text-ivory/20 text-[10px]">No room selected yet</span>
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="pt-5 space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="text-gold text-xs shrink-0 mt-px">✓</span>
            <span className="text-ivory/50 text-xs leading-relaxed">
              Free cancellation up to 48 hours before arrival
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-gold text-xs shrink-0 mt-px">✓</span>
            <span className="text-ivory/50 text-xs leading-relaxed">
              Best Rate Guarantee when booking direct
            </span>
          </div>
          {currentStep <= 2 && (
            <div className="flex items-start gap-2.5">
              <span className="text-gold text-xs shrink-0 mt-px">✓</span>
              <span className="text-ivory/50 text-xs leading-relaxed">
                No payment required today
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Bar ────────────────────────────────────────────────────────

function MobileBottomBar({
  room,
  total,
  nights,
  currentStep,
  step1Valid,
  step3Valid,
  roomId,
  summaryOpen,
  onToggle,
  onContinue,
  checkIn,
  checkOut,
  guests,
  subtotal,
  gst,
  isSubmitting,
}: {
  room: RoomDetail | undefined;
  total: number;
  nights: number;
  currentStep: number;
  step1Valid: boolean;
  step3Valid: boolean;
  roomId: string;
  summaryOpen: boolean;
  onToggle: () => void;
  onContinue: () => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  subtotal: number;
  gst: number;
  isSubmitting: boolean;
}) {
  let ctaLabel = "Continue";
  let ctaEnabled = false;

  if (currentStep === 1) {
    ctaLabel = "Continue";
    ctaEnabled = step1Valid;
  } else if (currentStep === 2) {
    ctaLabel = "Continue";
    ctaEnabled = !!roomId;
  } else if (currentStep === 3) {
    ctaLabel = "Review Booking";
    ctaEnabled = step3Valid;
  } else if (currentStep === 4) {
    ctaLabel = isSubmitting ? "Securing..." : "Reserve Your Stay";
    ctaEnabled = !isSubmitting;
  }

  const perNight = room ? parsePrice(room.price) : 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
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
              <SummaryRow label="Guests" value={guests} />
            </div>
            {room ? (
              <div className="space-y-2.5 pb-3">
                <SummaryRow label="Room" value={room.name} />
                <SummaryRow label="Rate / night" value={`₹${perNight.toLocaleString("en-IN")}`} />
                {nights > 0 && (
                  <>
                    <SummaryRow label="Subtotal" value={fmtMoney(subtotal)} />
                    <SummaryRow label="GST (18%)" value={fmtMoney(gst)} />
                  </>
                )}
                <div className="flex justify-between pt-3 border-t border-ivory/10">
                  <span className="eyebrow text-ivory/40 text-[10px]">Grand Total</span>
                  <span className="font-display text-gold text-xl">
                    {nights > 0 ? fmtMoney(total) : `₹${perNight.toLocaleString("en-IN")}/night`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-ivory/35 text-xs pb-3">Select a room to see pricing.</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={onToggle} className="flex-1 text-left min-w-0">
            <div className="eyebrow text-gold/70 text-[9px] mb-0.5 truncate">
              {room ? room.name : "Select a room to continue"}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl text-ivory leading-none">
                {room
                  ? nights > 0
                    ? fmtMoney(total)
                    : `₹${perNight.toLocaleString("en-IN")}/night`
                  : "—"}
              </span>
              {room && <span className="text-ivory/40 text-xs">{summaryOpen ? "▼" : "▲"}</span>}
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
  room,
  checkIn,
  checkOut,
  nights,
  guests,
  total,
}: {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  room: RoomDetail | undefined;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  total: number;
}) {
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
          {(
            [
              ["Booking ID", bookingId, "id"],
              ["Room", room?.name ?? "—", ""],
              ["Check-in", fmtDate(checkIn), ""],
              ["Check-out", fmtDate(checkOut), ""],
              ["Duration", nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—", ""],
              ["Guests", guests, ""],
              ["Guest Name", guestName, ""],
              ["Total", fmtMoney(total), "total"],
              ["Payment Status", "Pending — Our team will confirm", "status"],
            ] as [string, string, string][]
          ).map(([label, value, type]) => (
            <div key={label} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <span className="eyebrow text-ivory/35 text-[10px] shrink-0">{label}</span>
              <span
                className={
                  type === "id"
                    ? "font-display text-gold tracking-widest text-sm"
                    : type === "total"
                      ? "font-display text-gold text-xl"
                      : type === "status"
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
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "2 Adults");
  const [roomId, setRoomId] = useState(() => matchRoomId(searchParams.get("room") ?? ""));
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
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
  }, []);

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const nights = nightCount(checkIn, checkOut);
  const room = roomsList.find((r) => r.id === roomId);
  const basePerNight = room ? parsePrice(room.price) : 0;
  const subtotal = nights > 0 ? basePerNight * nights : basePerNight;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const step1Valid = !!checkIn && !!checkOut && nights > 0;
  const step3Valid = guestName.trim() !== "" && guestEmail.trim() !== "";

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  }

  function continueFromStep1() {
    if (!step1Valid) return;
    if (roomId) {
      setCurrentStep(3);
      scrollTo(step3Ref);
    } else {
      setCurrentStep(2);
      scrollTo(step2Ref);
    }
  }

  function continueFromStep2() {
    if (!roomId) return;
    setCurrentStep(3);
    scrollTo(step3Ref);
  }

  function continueFromStep3() {
    if (!step3Valid) return;
    setCurrentStep(4);
    scrollTo(step4Ref);
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
        guests,
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        arrivalTime,
        specialRequest,
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

  function handleMobileContinue() {
    if (currentStep === 1) continueFromStep1();
    else if (currentStep === 2) continueFromStep2();
    else if (currentStep === 3) continueFromStep3();
    else if (currentStep === 4) submitReservation();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="bg-ivory text-brown overflow-x-hidden min-h-screen">
      <Header />

      {/* Hero strip */}
      <div className="bg-brown text-ivory pt-24 lg:pt-32">
        <div className="px-5 sm:px-8 lg:px-10 xl:px-20 pb-7 lg:pb-9">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
            Best Rate Guaranteed · Direct Reservations
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Reserve Your <span className="italic">Stay</span>
          </h1>
          <p className="text-ivory/55 text-sm lg:text-base max-w-md leading-relaxed">
            Choose your dates, select your room, and we'll take care of the rest.
          </p>
        </div>
        {/* Trust strip */}
        <div className="border-t border-ivory/10 px-5 sm:px-8 lg:px-10 xl:px-20 py-3">
          <div className="flex flex-wrap gap-x-6 lg:gap-x-10 gap-y-1.5">
            {[
              "Best Rate Guarantee",
              "Secure Reservation",
              "No Hidden Charges",
              "Concierge Support",
            ].map((t) => (
              <span key={t} className="eyebrow text-gold/65 text-[10px] flex items-center gap-1.5">
                <span className="text-gold">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <ProgressTracker current={currentStep} />

      {currentStep < 5 ? (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-20 py-10 lg:py-14 pb-36 lg:pb-20">
          <div className="lg:grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:gap-10 xl:gap-14 lg:items-start">
            {/* Left: Progressive steps */}
            <div className="flex flex-col gap-5 lg:gap-7">
              {/* ── Step 1: Stay Details ── */}
              {currentStep > 1 ? (
                <CompletedStepRow
                  n={1}
                  title="Stay Details"
                  summary={`${fmtDate(checkIn)} → ${fmtDate(checkOut)}  ·  ${nights} night${nights !== 1 ? "s" : ""}  ·  ${guests}`}
                  onEdit={() => setCurrentStep(1)}
                />
              ) : (
                <section className="animate-fade-up">
                  <SectionHeader
                    n="01"
                    title="Stay Details"
                    subtitle="Best Rate Guaranteed when you book direct."
                  />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <DateCard label="CHECK-IN" value={checkIn} onChange={setCheckIn} min={today} />
                    <DateCard
                      label="CHECK-OUT"
                      value={checkOut}
                      onChange={setCheckOut}
                      min={checkIn || today}
                    />
                  </div>
                  <div className="bg-white border border-brown/12 px-5 py-4 mb-6 focus-within:border-gold/60 transition-colors">
                    <span className="eyebrow text-brown/35 text-[10px] block mb-2">GUESTS</span>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent font-display text-brown text-lg outline-none cursor-pointer appearance-none"
                    >
                      {(BOOKING_GUEST_OPTIONS as unknown as readonly string[]).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  {nights > 0 && (
                    <p className="text-taupe text-sm mb-5 flex items-center gap-2">
                      <span className="text-gold">—</span>
                      {nights} night{nights !== 1 ? "s" : ""} selected
                    </p>
                  )}
                  <button
                    onClick={continueFromStep1}
                    disabled={!step1Valid}
                    className={`eyebrow px-10 py-4 transition-all text-[11px] ${
                      step1Valid
                        ? "bg-brown text-ivory hover:bg-gold hover:text-brown"
                        : "bg-brown/15 text-brown/30 cursor-not-allowed"
                    }`}
                  >
                    {roomId ? "Continue to Guest Details" : "Continue to Rooms →"}
                  </button>
                </section>
              )}

              {/* ── Step 2: Choose Room ── */}
              {currentStep >= 2 &&
                (currentStep > 2 ? (
                  <CompletedStepRow
                    n={2}
                    title="Choose Room"
                    summary={room?.name ?? "—"}
                    onEdit={() => setCurrentStep(2)}
                  />
                ) : (
                  <div
                    ref={step2Ref}
                    style={{ scrollMarginTop: "96px" }}
                    className="animate-fade-up"
                  >
                    <section>
                      <SectionHeader
                        n="02"
                        title="Choose Your Room"
                        subtitle="Select your room for this stay."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        {roomsList.map((r) => (
                          <RoomCard
                            key={r.id}
                            room={r}
                            selected={r.id === roomId}
                            onSelect={() => setRoomId(r.id)}
                          />
                        ))}
                      </div>
                      <button
                        onClick={continueFromStep2}
                        disabled={!roomId}
                        className={`eyebrow px-10 py-4 transition-all text-[11px] ${
                          roomId
                            ? "bg-brown text-ivory hover:bg-gold hover:text-brown"
                            : "bg-brown/15 text-brown/30 cursor-not-allowed"
                        }`}
                      >
                        Continue to Guest Details →
                      </button>
                    </section>
                  </div>
                ))}

              {/* ── Step 3: Guest Details ── */}
              {currentStep >= 3 &&
                (currentStep > 3 ? (
                  <CompletedStepRow
                    n={3}
                    title="Guest Details"
                    summary={`${guestName}  ·  ${guestEmail}`}
                    onEdit={() => setCurrentStep(3)}
                  />
                ) : (
                  <div
                    ref={step3Ref}
                    style={{ scrollMarginTop: "96px" }}
                    className="animate-fade-up"
                  >
                    <section>
                      <SectionHeader
                        n="03"
                        title="Guest Details"
                        subtitle="Tell us a little about who's staying."
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
                          <PremiumInput label="PHONE NUMBER">
                            <input
                              type="tel"
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="+91 00000 00000"
                              className="w-full bg-transparent font-display text-brown text-lg outline-none placeholder:text-brown/20 pt-1"
                            />
                          </PremiumInput>
                          <PremiumInput label="EMAIL ADDRESS" required>
                            <input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full bg-transparent font-display text-brown text-lg outline-none placeholder:text-brown/20 pt-1"
                            />
                          </PremiumInput>
                        </div>
                        <PremiumInput label="EXPECTED ARRIVAL TIME (OPTIONAL)">
                          <input
                            type="time"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            className="w-full bg-transparent font-display text-brown text-lg outline-none cursor-pointer pt-1"
                          />
                        </PremiumInput>
                        <PremiumInput label="SPECIAL REQUESTS (OPTIONAL)">
                          <textarea
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                            placeholder="Dietary requirements, accessibility needs, special occasions…"
                            rows={3}
                            className="w-full bg-transparent font-display text-brown text-base outline-none placeholder:text-brown/20 resize-none pt-1"
                          />
                        </PremiumInput>
                      </div>
                      <button
                        onClick={continueFromStep3}
                        disabled={!step3Valid}
                        className={`eyebrow px-10 py-4 transition-all text-[11px] ${
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
                <div ref={step4Ref} style={{ scrollMarginTop: "96px" }} className="animate-fade-up">
                  <section>
                    <SectionHeader n="04" title="Review & Confirm" />

                    <div className="bg-white border border-brown/10 divide-y divide-brown/8 mb-6">
                      {/* Stay */}
                      <div className="px-5 sm:px-7 py-5">
                        <span className="eyebrow text-brown/35 text-[10px] block mb-4">
                          STAY DETAILS
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {(
                            [
                              ["CHECK-IN", fmtDate(checkIn)],
                              ["CHECK-OUT", fmtDate(checkOut)],
                              ["DURATION", `${nights} night${nights !== 1 ? "s" : ""}`],
                              ["GUESTS", guests],
                            ] as [string, string][]
                          ).map(([l, v]) => (
                            <div key={l}>
                              <span className="eyebrow text-brown/30 text-[9px] block mb-1">
                                {l}
                              </span>
                              <span className="text-brown text-sm">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Room */}
                      {room && (
                        <div className="px-5 sm:px-7 py-5">
                          <span className="eyebrow text-brown/35 text-[10px] block mb-4">
                            SELECTED ROOM
                          </span>
                          <div className="flex items-center gap-4">
                            <img
                              src={getRoomImageUrl(room)}
                              alt={room.name}
                              className="w-20 h-14 object-cover shrink-0"
                            />
                            <div>
                              <span className="eyebrow text-gold text-[10px] block mb-0.5">
                                {room.category}
                              </span>
                              <span className="font-display text-brown text-xl">{room.name}</span>
                              <span className="text-taupe text-xs block mt-0.5">
                                {"size" in room ? `${room.size} · ` : ""}
                                {room.capacity}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Guest info */}
                      <div className="px-5 sm:px-7 py-5">
                        <span className="eyebrow text-brown/35 text-[10px] block mb-4">
                          GUEST INFORMATION
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(
                            [
                              ["NAME", guestName],
                              ["EMAIL", guestEmail],
                              guestPhone ? ["PHONE", guestPhone] : null,
                              arrivalTime ? ["ARRIVAL TIME", arrivalTime] : null,
                            ].filter(Boolean) as [string, string][]
                          ).map(([l, v]) => (
                            <div key={l}>
                              <span className="eyebrow text-brown/30 text-[9px] block mb-1">
                                {l}
                              </span>
                              <span className="text-brown text-sm">{v}</span>
                            </div>
                          ))}
                          {specialRequest && (
                            <div className="sm:col-span-2">
                              <span className="eyebrow text-brown/30 text-[9px] block mb-1">
                                SPECIAL REQUESTS
                              </span>
                              <span className="text-brown text-sm">{specialRequest}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="px-5 sm:px-7 py-5">
                        <span className="eyebrow text-brown/35 text-[10px] block mb-4">
                          PRICE SUMMARY
                        </span>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-taupe">
                              {room?.name} × {nights} night{nights !== 1 ? "s" : ""}
                            </span>
                            <span className="text-brown">{fmtMoney(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-taupe">GST (18%)</span>
                            <span className="text-brown">{fmtMoney(gst)}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-brown/8">
                            <span className="font-display text-brown text-base">Grand Total</span>
                            <span className="font-display text-brown text-2xl">
                              {fmtMoney(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-taupe text-sm mb-7 leading-relaxed max-w-md">
                      Our reservations team will contact you within 24 hours to confirm your booking
                      and arrange payment.
                    </p>

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-4 text-xs font-sans">
                        {submitError}
                      </div>
                    )}

                    <button
                      onClick={submitReservation}
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto eyebrow px-12 py-5 transition-all text-[11px] ${
                        isSubmitting
                          ? "bg-brown/15 text-brown/40 cursor-not-allowed"
                          : "bg-gold text-brown hover:bg-brown hover:text-ivory"
                      }`}
                    >
                      {isSubmitting ? "Securing Reservation..." : "Reserve Your Stay"}
                    </button>
                  </section>
                </div>
              )}
            </div>

            {/* Right: Sticky sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <BookingSidebar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  guests={guests}
                  room={room}
                  subtotal={subtotal}
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
          room={room}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          guests={guests}
          total={total}
        />
      )}

      {/* Mobile bottom bar */}
      {currentStep < 5 && (
        <MobileBottomBar
          room={room}
          total={total}
          nights={nights}
          currentStep={currentStep}
          step1Valid={step1Valid}
          step3Valid={step3Valid}
          roomId={roomId}
          summaryOpen={summaryOpen}
          onToggle={() => setSummaryOpen((v) => !v)}
          onContinue={handleMobileContinue}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          subtotal={subtotal}
          gst={gst}
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
