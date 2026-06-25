import { useEffect, useRef, useState } from "react";
import { LotusMark } from "@/components/BrandLogo";

export type BookingVariant = "luxury" | "serenity" | "modern";

type Values = {
  checkIn: string;
  checkOut: string;
  room: string;
  guests: string;
};

const DEFAULTS: Values = {
  checkIn: "2026-10-12",
  checkOut: "2026-10-18",
  room: "Lotus Suite",
  guests: "2 Adults",
};

const ROOMS = ["Lotus Suite", "Garden Villa", "Celestial Penthouse", "Divine Sanctuary"];
const GUESTS = ["1 Adult", "2 Adults", "2 Adults · 1 Child", "Family of 4"];

function useStickyTrigger() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { sentinelRef, stuck };
}

/**
 * Drop inside the hero. Renders the in-hero booking panel,
 * a sentinel for scroll detection, and a fixed sticky bar.
 */
export function BookingExperience({
  variant,
  stickyTop = "2.25rem", // sits below the ConceptBar (py-3 ~ 36px)
}: {
  variant: BookingVariant;
  stickyTop?: string;
}) {
  const [values, setValues] = useState<Values>(DEFAULTS);
  const { sentinelRef, stuck } = useStickyTrigger();

  return (
    <>
      <HeroPanel variant={variant} values={values} setValues={setValues} />
      {/* Sentinel placed just AFTER the panel — when it scrolls out, sticky appears */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <StickyBar variant={variant} values={values} setValues={setValues} visible={stuck} stickyTop={stickyTop} />
    </>
  );
}

/* ---------------- Hero panels (per variant) ---------------- */

function HeroPanel({
  variant,
  values,
  setValues,
}: {
  variant: BookingVariant;
  values: Values;
  setValues: (v: Values) => void;
}) {
  if (variant === "luxury") return <LuxuryPanel values={values} setValues={setValues} />;
  if (variant === "serenity") return <SerenityPanel values={values} setValues={setValues} />;
  return <ModernPanel values={values} setValues={setValues} />;
}

function LuxuryPanel({ values, setValues }: { values: Values; setValues: (v: Values) => void }) {
  return (
    <>
      {/* Desktop (unchanged) */}
      <div className="hidden lg:block animate-fade-up [animation-delay:300ms] relative w-full max-w-4xl mt-10">
        <div className="backdrop-blur-xl bg-brown/30 ring-1 ring-gold/40 shadow-gold p-6 lg:p-7 text-ivory">
          <div className="flex items-center justify-between mb-5">
            <span className="eyebrow text-gold">Reserve Your Suite</span>
            <span className="eyebrow text-ivory/60 hidden md:inline">Best rate guaranteed</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-gold/30">
            <FieldDate tone="dark" label="Arrival" value={values.checkIn} onChange={(v) => setValues({ ...values, checkIn: v })} />
            <FieldDate tone="dark" label="Departure" value={values.checkOut} onChange={(v) => setValues({ ...values, checkOut: v })} />
            <FieldSelect tone="dark" label="Suite" value={values.room} options={ROOMS} onChange={(v) => setValues({ ...values, room: v })} />
            <FieldSelect tone="dark" label="Guests" value={values.guests} options={GUESTS} onChange={(v) => setValues({ ...values, guests: v })} />
            <button className="bg-gold text-brown eyebrow px-6 py-5 hover:bg-ivory transition-colors">
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet — premium glass card, vertical, large touch targets */}
      <div className="lg:hidden animate-fade-up [animation-delay:200ms] w-full mt-8">
        <div className="backdrop-blur-2xl bg-brown/45 ring-1 ring-gold/40 shadow-gold px-5 pt-5 pb-5 sm:px-6 sm:pt-6 text-ivory relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <span className="eyebrow text-gold text-[10px]">Reserve Your Suite</span>
            <LotusMark className="w-4 h-4 text-gold" />
          </div>
          <div className="grid grid-cols-2 gap-px bg-gold/25 mb-px">
            <FieldDate tone="dark" label="Arrival" value={values.checkIn} onChange={(v) => setValues({ ...values, checkIn: v })} big />
            <FieldDate tone="dark" label="Departure" value={values.checkOut} onChange={(v) => setValues({ ...values, checkOut: v })} big />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gold/25">
            <FieldSelect tone="dark" label="Suite" value={values.room} options={ROOMS} onChange={(v) => setValues({ ...values, room: v })} big />
            <FieldSelect tone="dark" label="Guests" value={values.guests} options={GUESTS} onChange={(v) => setValues({ ...values, guests: v })} big />
          </div>
          <button className="w-full mt-5 bg-gold text-brown eyebrow py-5 hover:bg-ivory transition-colors active:scale-[0.99]">
            Check Availability
          </button>
          <div className="mt-4 text-center text-[10px] text-ivory/55 tracking-[0.25em] uppercase">
            Best rate guaranteed · Concierge welcome
          </div>
        </div>
      </div>
    </>
  );
}

function SerenityPanel({ values, setValues }: { values: Values; setValues: (v: Values) => void }) {
  return (
    <div className="animate-fade-up [animation-delay:300ms] relative max-w-3xl mx-auto -mt-2 mb-4">
      <div className="bg-ivory ring-1 ring-gold/30 rounded-[28px] shadow-gold p-6 lg:p-8 relative">
        <LotusMark className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-gold bg-ivory rounded-full p-2 ring-1 ring-gold/30" />
        <div className="text-center mb-6">
          <span className="eyebrow text-gold">Begin Your Journey</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDate tone="light" label="Check In" value={values.checkIn} onChange={(v) => setValues({ ...values, checkIn: v })} rounded />
          <FieldDate tone="light" label="Check Out" value={values.checkOut} onChange={(v) => setValues({ ...values, checkOut: v })} rounded />
          <FieldSelect tone="light" label="Sanctuary" value={values.room} options={ROOMS} onChange={(v) => setValues({ ...values, room: v })} rounded />
          <FieldSelect tone="light" label="Guests" value={values.guests} options={GUESTS} onChange={(v) => setValues({ ...values, guests: v })} rounded />
        </div>
        <button className="w-full mt-6 bg-brown text-ivory eyebrow py-4 rounded-full hover:bg-gold hover:text-brown transition-colors">
          Reserve My Stillness
        </button>
        <div className="text-center mt-4 text-[10px] text-taupe tracking-widest uppercase">
          Free cancellation · Personal concierge welcome
        </div>
      </div>
    </div>
  );
}

function ModernPanel({ values, setValues }: { values: Values; setValues: (v: Values) => void }) {
  return (
    <div className="animate-fade-up [animation-delay:300ms]">
      <div className="bg-ivory rounded-2xl shadow-gold p-5 lg:p-6 ring-1 ring-brown/8">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow text-gold">Reserve Your Stay</span>
          <span className="eyebrow text-taupe hidden md:inline">★ 4.96 · 1,400+ reviews</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <FieldDate tone="light" label="Check In" value={values.checkIn} onChange={(v) => setValues({ ...values, checkIn: v })} rounded />
          <FieldDate tone="light" label="Check Out" value={values.checkOut} onChange={(v) => setValues({ ...values, checkOut: v })} rounded />
          <FieldSelect tone="light" label="Room" value={values.room} options={ROOMS} onChange={(v) => setValues({ ...values, room: v })} rounded />
          <FieldSelect tone="light" label="Guests" value={values.guests} options={GUESTS} onChange={(v) => setValues({ ...values, guests: v })} rounded />
        </div>
        <button className="w-full mt-4 bg-gold text-brown py-3.5 eyebrow rounded-xl hover:bg-brown hover:text-ivory transition-colors">
          Search Availability →
        </button>
        <div className="flex items-center justify-between mt-3 text-[10px] text-taupe">
          <span>✓ Free cancellation</span>
          <span>✓ Best rate guarantee</span>
          <span>✓ Direct-only perks</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sticky bar ---------------- */

function StickyBar({
  variant,
  values,
  setValues,
  visible,
  stickyTop,
}: {
  variant: BookingVariant;
  values: Values;
  setValues: (v: Values) => void;
  visible: boolean;
  stickyTop: string;
}) {
  const desktopBase =
    variant === "luxury"
      ? "bg-brown/95 text-ivory ring-1 ring-gold/30 backdrop-blur-md"
      : variant === "serenity"
        ? "bg-ivory/95 text-brown ring-1 ring-gold/30 backdrop-blur-md rounded-b-3xl shadow-gold"
        : "bg-ivory/98 text-brown ring-1 ring-brown/10 backdrop-blur-md shadow-gold";

  const tone: "dark" | "light" = variant === "luxury" ? "dark" : "light";

  return (
    <>
      {/* Desktop / tablet: top sticky */}
      <div
        aria-hidden={!visible}
        className={`hidden md:block fixed left-0 right-0 z-30 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: stickyTop }}
      >
        <div className={`mx-auto max-w-6xl ${desktopBase}`}>
          <div className="flex items-stretch gap-px px-3 py-2">
            <div className="flex items-center gap-3 pr-4 pl-2">
              <LotusMark className={`w-5 h-5 ${tone === "dark" ? "text-gold" : "text-gold"}`} />
              <span className={`font-display italic text-base ${tone === "dark" ? "text-ivory" : "text-brown"}`}>
                Lotus Divine
              </span>
            </div>
            <CompactField tone={tone} label="In" value={fmt(values.checkIn)} />
            <CompactField tone={tone} label="Out" value={fmt(values.checkOut)} />
            <CompactField tone={tone} label="Room" value={values.room} />
            <CompactField tone={tone} label="Guests" value={values.guests} />
            <button
              className={`ml-auto eyebrow px-6 ${
                variant === "modern"
                  ? "bg-gold text-brown rounded-xl my-1 hover:bg-brown hover:text-ivory"
                  : variant === "serenity"
                    ? "bg-brown text-ivory rounded-full my-1 hover:bg-gold hover:text-brown"
                    : "bg-gold text-brown hover:bg-ivory"
              } transition-colors`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: bottom action bar */}
      <div
        aria-hidden={!visible}
        className={`md:hidden fixed left-0 right-0 bottom-0 z-30 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="bg-ivory/98 backdrop-blur-md border-t border-gold/30 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="eyebrow text-gold text-[9px]">Your Stay</div>
            <div className="font-display text-sm text-brown truncate">
              {fmt(values.checkIn)} → {fmt(values.checkOut)} · {values.guests}
            </div>
          </div>
          <button
            className={`shrink-0 eyebrow px-5 py-3 ${
              variant === "luxury"
                ? "bg-brown text-ivory"
                : variant === "serenity"
                  ? "bg-brown text-ivory rounded-full"
                  : "bg-gold text-brown rounded-xl"
            }`}
          >
            Book
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- Fields ---------------- */

function baseField(tone: "dark" | "light", rounded?: boolean) {
  const bg = tone === "dark" ? "bg-brown/40 text-ivory" : "bg-ivory text-brown";
  const ring = tone === "dark" ? "ring-1 ring-gold/0 hover:ring-gold/40" : "ring-1 ring-brown/10 hover:ring-gold/60";
  const radius = rounded ? "rounded-xl" : "";
  return `${bg} ${ring} ${radius} px-4 py-3 transition-all cursor-pointer text-left`;
}

function FieldDate({
  tone,
  label,
  value,
  onChange,
  rounded,
}: {
  tone: "dark" | "light";
  label: string;
  value: string;
  onChange: (v: string) => void;
  rounded?: boolean;
}) {
  const labelColor = tone === "dark" ? "text-gold" : "text-taupe";
  const valueColor = tone === "dark" ? "text-ivory" : "text-brown";
  return (
    <label className={`group block ${baseField(tone, rounded)}`}>
      <div className={`eyebrow text-[9px] ${labelColor}`}>{label}</div>
      <div className="flex items-center justify-between mt-1">
        <span className={`font-display text-base ${valueColor}`}>{fmt(value)}</span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
          aria-label={label}
        />
        <span className={`text-xs ${tone === "dark" ? "text-gold/60" : "text-gold"}`}>▾</span>
      </div>
    </label>
  );
}

function FieldSelect({
  tone,
  label,
  value,
  options,
  onChange,
  rounded,
}: {
  tone: "dark" | "light";
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  rounded?: boolean;
}) {
  const labelColor = tone === "dark" ? "text-gold" : "text-taupe";
  const valueColor = tone === "dark" ? "text-ivory" : "text-brown";
  return (
    <label className={`group block relative ${baseField(tone, rounded)}`}>
      <div className={`eyebrow text-[9px] ${labelColor}`}>{label}</div>
      <div className="flex items-center justify-between mt-1">
        <span className={`font-display text-base truncate ${valueColor}`}>{value}</span>
        <span className={`text-xs ${tone === "dark" ? "text-gold/60" : "text-gold"}`}>▾</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompactField({ tone, label, value }: { tone: "dark" | "light"; label: string; value: string }) {
  const labelColor = tone === "dark" ? "text-gold/80" : "text-taupe";
  const valueColor = tone === "dark" ? "text-ivory" : "text-brown";
  const divide = tone === "dark" ? "border-gold/15" : "border-brown/10";
  return (
    <div className={`px-4 py-2 border-l ${divide} min-w-0 flex-1 max-w-[170px]`}>
      <div className={`eyebrow text-[9px] ${labelColor}`}>{label}</div>
      <div className={`font-display text-sm truncate ${valueColor}`}>{value}</div>
    </div>
  );
}

function fmt(d: string) {
  // Accept yyyy-mm-dd or pre-formatted
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
