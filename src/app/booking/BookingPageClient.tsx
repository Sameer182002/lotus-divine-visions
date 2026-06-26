"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ROOMS_DETAIL, BOOKING_GUEST_OPTIONS } from "@/data/siteContent";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";

const ROOM_IMAGES: Record<string, string> = { room1: room1.src, room2: room2.src };

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
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function matchRoomId(param: string): string {
  if (!param) return "";
  const normalized = param.toLowerCase();
  const match = ROOMS_DETAIL.find(
    (r) =>
      r.id === normalized ||
      r.name.toLowerCase().includes(normalized) ||
      r.category.toLowerCase().replace(/\s+/g, "-") === normalized,
  );
  return match?.id ?? "";
}

// ─── Booking Page ─────────────────────────────────────────────────────────────

function BookingPageInner() {
  const searchParams = useSearchParams();

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "2 Adults");
  const [roomId, setRoomId] = useState(() => matchRoomId(searchParams.get("room") ?? ""));

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [paymentDone, setPaymentDone] = useState(false);
  const [bookingId] = useState(() => "LDV-" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const [summaryOpen, setSummaryOpen] = useState(false);

  const guestSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const confirmSectionRef = useRef<HTMLDivElement>(null);

  const nights = nightCount(checkIn, checkOut);
  const room = ROOMS_DETAIL.find((r) => r.id === roomId);
  const basePerNight = room ? parsePrice(room.price) : 0;
  const subtotal = basePerNight * Math.max(nights, 1);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const showGuest = !!roomId;
  const canPay = showGuest && guestName.trim() !== "" && guestEmail.trim() !== "";

  useEffect(() => {
    if (roomId && guestSectionRef.current) {
      const t = setTimeout(
        () =>
          guestSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [roomId]);

  useEffect(() => {
    if (canPay && paymentSectionRef.current) {
      const t = setTimeout(
        () =>
          paymentSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [canPay]);

  useEffect(() => {
    if (paymentDone && confirmSectionRef.current) {
      const t = setTimeout(
        () =>
          confirmSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [paymentDone]);

  function handlePay() {
    setPaymentDone(true);
    setSummaryOpen(false);
  }

  return (
    <main className="bg-ivory text-brown overflow-x-hidden min-h-screen">
      <Header />

      {/* Page hero strip */}
      <div className="bg-brown text-ivory pt-24 pb-8 lg:pt-32 lg:pb-10 px-5 sm:px-8 lg:px-20">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
          Best Rate Guaranteed · Direct Reservations
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Reserve Your <span className="italic">Sanctuary</span>
        </h1>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-20 py-10 lg:py-16 pb-44 lg:pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_356px] xl:grid-cols-[1fr_400px] lg:gap-10 xl:gap-16 lg:items-start">
          {/* Left: Progressive sections */}
          <div className="flex flex-col gap-14 lg:gap-16">
            {/* 01 Stay Summary */}
            <section>
              <SectionHeader n="01" title="Stay Summary" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <EditField label="Check-in">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none cursor-pointer min-h-[28px]"
                  />
                </EditField>
                <EditField label="Check-out">
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none cursor-pointer min-h-[28px]"
                  />
                </EditField>
                <EditField label="Duration">
                  <span className="font-display text-brown text-base lg:text-lg block min-h-[28px]">
                    {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
                  </span>
                </EditField>
                <EditField label="Guests">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none cursor-pointer appearance-none min-h-[28px]"
                  >
                    {(BOOKING_GUEST_OPTIONS as unknown as readonly string[]).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </EditField>
              </div>
            </section>

            {/* 02 Available Rooms */}
            <section>
              <SectionHeader n="02" title="Available Rooms" />
              <p className="text-taupe text-sm mt-2 mb-6">Choose your sanctuary for the stay.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {ROOMS_DETAIL.map((r) => (
                  <RoomCard
                    key={r.id}
                    room={r}
                    selected={r.id === roomId}
                    onSelect={() => setRoomId(r.id)}
                  />
                ))}
              </div>
            </section>

            {/* 03 Guest Details — reveals after room selected */}
            {showGuest && (
              <div
                ref={guestSectionRef}
                style={{ scrollMarginTop: "96px" }}
                className="animate-fade-up"
              >
                <section>
                  <SectionHeader n="03" title="Guest Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="sm:col-span-2">
                      <EditField label="Full Name">
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none placeholder:text-brown/25 min-h-[28px]"
                        />
                      </EditField>
                    </div>
                    <EditField label="Mobile Number">
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 (000) 000-0000"
                        className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none placeholder:text-brown/25 min-h-[28px]"
                      />
                    </EditField>
                    <EditField label="Email Address">
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent font-display text-brown text-base lg:text-lg outline-none placeholder:text-brown/25 min-h-[28px]"
                      />
                    </EditField>
                    <div className="sm:col-span-2">
                      <EditField label="Special Requests (optional)">
                        <textarea
                          value={specialRequest}
                          onChange={(e) => setSpecialRequest(e.target.value)}
                          placeholder="Any special arrangements, dietary needs, or occasion notes…"
                          rows={3}
                          className="w-full bg-transparent font-display text-brown text-sm outline-none placeholder:text-brown/25 resize-none"
                        />
                      </EditField>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* 04 Payment — reveals after guest details filled */}
            {canPay && !paymentDone && (
              <div
                ref={paymentSectionRef}
                style={{ scrollMarginTop: "96px" }}
                className="animate-fade-up"
              >
                <section>
                  <SectionHeader n="04" title="Payment" />
                  <div className="mt-6 bg-white border border-brown/10 p-6 lg:p-8">
                    <p className="text-taupe text-sm leading-relaxed mb-6">
                      Secure payment gateway integration is currently being finalised. Your
                      reservation details have been noted and a personal concierge will contact you
                      within 24 hours with a secure payment link.
                    </p>
                    <div className="bg-champagne/50 border border-gold/20 px-5 py-4 mb-8">
                      <span className="eyebrow text-gold text-[10px] block mb-1.5">
                        Payment Note
                      </span>
                      <p className="text-brown/65 text-xs leading-relaxed">
                        Full payment is due 7 days before check-in. We accept all major credit
                        cards, bank transfers, and select digital wallets.
                      </p>
                    </div>
                    <button
                      onClick={handlePay}
                      className="w-full sm:w-auto bg-gold text-brown eyebrow px-12 py-5 hover:bg-brown hover:text-ivory transition-all"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* 05 Confirmation — shows after payment */}
            {paymentDone && (
              <div
                ref={confirmSectionRef}
                style={{ scrollMarginTop: "96px" }}
                className="animate-fade-up"
              >
                <section>
                  <div className="bg-brown text-ivory p-8 lg:p-10">
                    <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center mb-6">
                      <span className="text-gold text-lg">✓</span>
                    </div>
                    <span className="eyebrow text-gold text-[10px] block mb-3">
                      Reservation Received
                    </span>
                    <h2 className="font-display text-3xl lg:text-4xl text-ivory mb-3">
                      Thank you, <span className="italic">{guestName.split(" ")[0]}.</span>
                    </h2>
                    <p className="text-ivory/55 text-sm max-w-md leading-relaxed mb-8">
                      Your booking request has been received. Our concierge team will contact you at{" "}
                      <span className="text-ivory/80">{guestEmail}</span> within 24 hours to confirm
                      payment and finalise your stay.
                    </p>

                    <div className="border border-ivory/10 divide-y divide-ivory/10 mb-8">
                      {(
                        [
                          ["Booking ID", bookingId],
                          ["Room", room?.name ?? "—"],
                          ["Check-in", fmtDate(checkIn)],
                          ["Check-out", fmtDate(checkOut)],
                          [
                            "Duration",
                            nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—",
                          ],
                          ["Guest", guestName],
                          ["Total", fmtMoney(total)],
                          ["Payment Status", "Pending — Concierge will contact you"],
                        ] as [string, string][]
                      ).map(([label, value]) => (
                        <div
                          key={label}
                          className="px-5 py-3 flex items-center justify-between gap-4 text-sm"
                        >
                          <span className="eyebrow text-ivory/40 text-[10px] shrink-0">
                            {label}
                          </span>
                          <span
                            className={`text-right ${
                              label === "Booking ID"
                                ? "font-display text-gold tracking-widest"
                                : label === "Payment Status"
                                  ? "text-gold eyebrow text-[10px]"
                                  : label === "Total"
                                    ? "font-display text-xl text-gold"
                                    : "text-ivory"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <div className="flex-1 border border-ivory/15 px-5 py-3.5 flex items-center gap-3 opacity-45">
                        <span>📱</span>
                        <div>
                          <div className="eyebrow text-[9px] text-ivory/50">
                            WhatsApp Confirmation
                          </div>
                          <div className="text-xs text-ivory/55">Coming soon</div>
                        </div>
                      </div>
                      <div className="flex-1 border border-ivory/15 px-5 py-3.5 flex items-center gap-3 opacity-45">
                        <span>✉️</span>
                        <div>
                          <div className="eyebrow text-[9px] text-ivory/50">Email Confirmation</div>
                          <div className="text-xs text-ivory/55">Coming soon</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/"
                        className="eyebrow text-[10px] border border-ivory/20 px-7 py-4 text-ivory/65 hover:text-ivory hover:border-ivory/40 transition-all text-center"
                      >
                        Return Home
                      </Link>
                      <Link
                        href="/rooms"
                        className="eyebrow text-[10px] bg-gold text-brown px-7 py-4 hover:bg-ivory transition-all text-center"
                      >
                        Explore More Rooms
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Right: Sticky sidebar (desktop only) */}
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
                guestName={guestName}
                guestEmail={guestEmail}
                canPay={canPay && !paymentDone}
                onPay={handlePay}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {!paymentDone && (
        <MobileBottomBar
          room={room}
          total={total}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          guests={guests}
          subtotal={subtotal}
          gst={gst}
          canPay={canPay}
          onPay={handlePay}
          expanded={summaryOpen}
          onToggle={() => setSummaryOpen((v) => !v)}
        />
      )}

      <Footer />
    </main>
  );
}

// ─── Booking Sidebar (desktop) ────────────────────────────────────────────────

function BookingSidebar({
  checkIn,
  checkOut,
  nights,
  guests,
  room,
  subtotal,
  gst,
  total,
  guestName,
  guestEmail,
  canPay,
  onPay,
}: {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  room: (typeof ROOMS_DETAIL)[number] | undefined;
  subtotal: number;
  gst: number;
  total: number;
  guestName: string;
  guestEmail: string;
  canPay: boolean;
  onPay: () => void;
}) {
  return (
    <div className="bg-brown text-ivory p-6">
      <span className="eyebrow text-gold text-[10px] block mb-5">Booking Summary</span>

      {/* Stay details */}
      <div className="space-y-2.5 pb-5 border-b border-ivory/10">
        <SummaryRow label="Check-in" value={fmtDate(checkIn)} />
        <SummaryRow label="Check-out" value={fmtDate(checkOut)} />
        <SummaryRow
          label="Duration"
          value={nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
        />
        <SummaryRow label="Guests" value={guests} />
      </div>

      {/* Room details */}
      {room && (
        <div className="py-5 border-b border-ivory/10">
          <div className="flex gap-3 mb-4">
            <img
              src={ROOM_IMAGES[room.imageKey]}
              alt={room.name}
              className="w-16 h-12 object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="eyebrow text-gold/70 text-[9px] block mb-0.5">{room.category}</span>
              <span className="font-display text-ivory text-sm leading-tight block">
                {room.name}
              </span>
            </div>
          </div>
          <div className="space-y-2.5">
            <SummaryRow
              label="Rate / night"
              value={`$${parsePrice(room.price).toLocaleString()}`}
            />
            <SummaryRow label="Subtotal" value={fmtMoney(subtotal)} />
            <SummaryRow label="GST (18%)" value={fmtMoney(gst)} />
          </div>
          <div className="mt-4 pt-4 border-t border-ivory/10 flex items-baseline justify-between">
            <span className="eyebrow text-ivory/45 text-[10px]">Total Payable</span>
            <span className="font-display text-gold text-2xl">{fmtMoney(total)}</span>
          </div>
        </div>
      )}

      {/* Guest info */}
      {guestName && (
        <div className="py-5 border-b border-ivory/10 space-y-2.5">
          <SummaryRow label="Guest" value={guestName} />
          {guestEmail && <SummaryRow label="Contact" value={guestEmail} />}
        </div>
      )}

      {/* CTA */}
      <div className="mt-5">
        <button
          onClick={onPay}
          disabled={!canPay}
          className={`w-full eyebrow py-4 transition-all ${
            canPay
              ? "bg-gold text-brown hover:bg-ivory"
              : "bg-ivory/10 text-ivory/30 cursor-not-allowed"
          }`}
        >
          Proceed to Payment
        </button>
        {!room && (
          <p className="text-ivory/35 text-[11px] text-center mt-3 leading-relaxed">
            Select a room to continue
          </p>
        )}
        {room && !canPay && (
          <p className="text-ivory/35 text-[11px] text-center mt-3 leading-relaxed">
            Enter guest details to continue
          </p>
        )}
        {canPay && (
          <p className="eyebrow text-ivory/35 text-[9px] text-center mt-3">
            Best rate guaranteed · Free cancellation
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Mobile sticky bottom bar ─────────────────────────────────────────────────

function MobileBottomBar({
  room,
  total,
  checkIn,
  checkOut,
  nights,
  guests,
  subtotal,
  gst,
  canPay,
  onPay,
  expanded,
  onToggle,
}: {
  room: (typeof ROOMS_DETAIL)[number] | undefined;
  total: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  subtotal: number;
  gst: number;
  canPay: boolean;
  onPay: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {expanded && (
        <div
          className="fixed inset-0 bg-brown/60 backdrop-blur-sm"
          style={{ zIndex: -1 }}
          onClick={onToggle}
        />
      )}

      <div className="bg-brown text-ivory shadow-[0_-16px_48px_-12px_rgba(0,0,0,0.5)]">
        {expanded && (
          <div className="px-5 pt-5 pb-2 border-b border-ivory/10 max-h-[55vh] overflow-y-auto">
            <span className="eyebrow text-gold text-[10px] block mb-4">Price Breakdown</span>
            <div className="space-y-2.5 pb-4 mb-4 border-b border-ivory/10">
              <SummaryRow label="Check-in" value={fmtDate(checkIn)} />
              <SummaryRow label="Check-out" value={fmtDate(checkOut)} />
              <SummaryRow label="Nights" value={nights > 0 ? String(nights) : "—"} />
              <SummaryRow label="Guests" value={guests} />
            </div>
            {room ? (
              <div className="space-y-2.5 pb-4">
                <SummaryRow label="Room" value={room.name} />
                <SummaryRow
                  label="Rate / night"
                  value={`$${parsePrice(room.price).toLocaleString()}`}
                />
                <SummaryRow label="Subtotal" value={fmtMoney(subtotal)} />
                <SummaryRow label="GST (18%)" value={fmtMoney(gst)} />
                <div className="flex justify-between pt-3.5 border-t border-ivory/10">
                  <span className="eyebrow text-ivory/45 text-[10px]">Total Payable</span>
                  <span className="font-display text-gold text-xl">{fmtMoney(total)}</span>
                </div>
              </div>
            ) : (
              <p className="text-ivory/40 text-xs pb-2">
                Select a room to see the price breakdown.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={onToggle} className="flex-1 text-left">
            <div className="eyebrow text-gold/70 text-[9px] mb-0.5">
              {room ? room.name : "Select a room to continue"}
            </div>
            <div className="font-display text-xl text-ivory leading-none">
              {total > 0 ? fmtMoney(total) : "—"}
              <span className="text-ivory/40 text-sm ml-2 font-sans">{expanded ? "▼" : "▲"}</span>
            </div>
          </button>
          <button
            onClick={canPay ? onPay : undefined}
            disabled={!canPay}
            className={`shrink-0 eyebrow px-5 py-3.5 transition-all ${
              canPay
                ? "bg-gold text-brown hover:bg-ivory"
                : "bg-ivory/15 text-ivory/35 cursor-not-allowed"
            }`}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Room Card ─────────────────────────────────────────────────────────────────

type RoomDetail = (typeof ROOMS_DETAIL)[number];

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
      className={`border-2 transition-all duration-300 ${
        selected ? "border-gold bg-champagne/20" : "border-brown/10 bg-white hover:border-brown/25"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={ROOM_IMAGES[room.imageKey]}
          alt={room.imageAlt}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
        {selected && (
          <div className="absolute top-3 right-3 bg-gold text-brown eyebrow text-[9px] px-2.5 py-1">
            SELECTED
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="eyebrow text-gold text-[10px] block mb-1">{room.category}</span>
        <h3 className="font-display text-2xl text-brown mb-1">{room.name}</h3>
        <p className="text-taupe text-xs mb-4">
          {"size" in room ? `${room.size} · ` : ""}
          {room.capacity}
        </p>
        <p className="text-taupe text-sm leading-relaxed mb-4">{room.description}</p>
        <div className="grid grid-cols-2 gap-x-3 mb-5">
          {room.amenities.slice(0, 6).map((a) => (
            <span
              key={a}
              className="text-[11px] text-brown/55 py-1.5 border-b border-brown/8 flex items-center gap-1.5"
            >
              <span className="text-gold/60">—</span>
              {a}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <span className="eyebrow text-brown/40 text-[10px] block mb-0.5">Starting from</span>
            <span className="font-display text-brown text-2xl">{room.price}</span>
          </div>
          <button
            onClick={onSelect}
            className={`eyebrow px-6 py-3 transition-all ${
              selected ? "bg-gold text-brown" : "bg-brown text-ivory hover:bg-gold hover:text-brown"
            }`}
          >
            {selected ? "Selected ✓" : "Select Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="eyebrow text-gold/50 text-[10px] shrink-0">{n}</span>
      <h2 className="font-display text-2xl sm:text-3xl text-brown shrink-0">{title}</h2>
      <div className="flex-1 h-px bg-brown/8 hidden sm:block" />
    </div>
  );
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border border-brown/12 bg-white px-4 pt-3 pb-3 focus-within:border-gold/60 transition-colors">
      <span className="eyebrow text-brown/35 text-[10px] block mb-1.5">{label}</span>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-ivory/50 shrink-0">{label}</span>
      <span className="text-ivory text-right">{value}</span>
    </div>
  );
}

export function BookingPageClient() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ivory" />}>
      <BookingPageInner />
    </Suspense>
  );
}
