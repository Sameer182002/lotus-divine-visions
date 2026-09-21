"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LotusMark } from "@/components/BrandLogo";
import { BOOKING_DEFAULTS, BOOKING_GUEST_OPTIONS, BOOKING_LABELS } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import {
  formatBookingDate,
  minCheckInISO,
  minCheckOutISO,
  resolveCheckOutOnCheckInChange,
  validateBookingDates,
} from "@/lib/booking-dates";
import { BookingCalendarField } from "@/components/BookingCalendarField";

export type BookingVariant = "hero" | "luxury" | "serenity" | "modern";

type Values = {
  checkIn: string;
  checkOut: string;
  guests: string;
};

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

export function BookingExperience({
  variant,
  stickyTop = "2.25rem",
}: {
  variant: BookingVariant;
  stickyTop?: string;
}) {
  const [values, setValues] = useState<Values>({
    checkIn: BOOKING_DEFAULTS.checkIn,
    checkOut: BOOKING_DEFAULTS.checkOut,
    guests: BOOKING_DEFAULTS.guests,
  });
  const { sentinelRef, stuck } = useStickyTrigger();
  const router = useRouter();

  function handleCheckInChange(v: string) {
    setValues((prev) => ({
      ...prev,
      checkIn: v,
      checkOut: resolveCheckOutOnCheckInChange(v, prev.checkOut),
    }));
  }

  function handleCheckOutChange(v: string) {
    setValues((prev) => ({ ...prev, checkOut: v }));
  }

  const datesValid = validateBookingDates(values.checkIn, values.checkOut);

  function handleSearch() {
    if (!datesValid) return;
    router.push(bookingHref("", values.checkIn, values.checkOut, values.guests));
  }

  return (
    <>
      <HeroPanel
        variant={variant}
        values={values}
        setValues={setValues}
        onCheckInChange={handleCheckInChange}
        onCheckOutChange={handleCheckOutChange}
        onSearch={handleSearch}
        datesValid={datesValid}
      />
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <StickyBar
        variant={variant}
        values={values}
        visible={stuck}
        stickyTop={stickyTop}
        onSearch={handleSearch}
        datesValid={datesValid}
      />
    </>
  );
}

type DateChangeProps = {
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  datesValid: boolean;
};

function HeroPanel({
  variant,
  values,
  setValues,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  datesValid,
}: {
  variant: BookingVariant;
  values: Values;
  setValues: (v: Values) => void;
} & DateChangeProps & { onSearch: () => void }) {
  if (variant === "hero")
    return (
      <HeroBar
        values={values}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
        onSearch={onSearch}
        datesValid={datesValid}
      />
    );
  if (variant === "luxury")
    return (
      <LuxuryPanel
        values={values}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
        onSearch={onSearch}
        datesValid={datesValid}
      />
    );
  if (variant === "serenity")
    return (
      <SerenityPanel
        values={values}
        setValues={setValues}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
        onSearch={onSearch}
        datesValid={datesValid}
      />
    );
  return (
    <ModernPanel
      values={values}
      setValues={setValues}
      onCheckInChange={onCheckInChange}
      onCheckOutChange={onCheckOutChange}
      onSearch={onSearch}
      datesValid={datesValid}
    />
  );
}

// Light, horizontal bar used by the homepage hero: Check In · Check Out · Book.
function HeroBar({
  values,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  datesValid,
}: {
  values: Values;
} & DateChangeProps & { onSearch: () => void }) {
  const l = BOOKING_LABELS.hero;
  const f = BOOKING_LABELS.fieldLabels;

  return (
    <form
      className="relative w-full"
      aria-label={l.eyebrow}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="bg-ivory ring-1 ring-brown/10 shadow-gold grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-px bg-clip-padding">
        <FieldDate
          tone="light"
          label={f.checkIn}
          value={values.checkIn}
          onChange={onCheckInChange}
          min={minCheckInISO()}
          big
        />
        <FieldDate
          tone="light"
          label={f.checkOut}
          value={values.checkOut}
          onChange={onCheckOutChange}
          min={minCheckOutISO(values.checkIn)}
          big
        />
        <button
          type="submit"
          disabled={!datesValid}
          className="col-span-2 sm:col-span-1 bg-brown text-ivory eyebrow px-8 py-3.5 sm:py-0 min-h-12 text-center hover:bg-gold hover:text-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brown disabled:hover:text-ivory"
        >
          {l.button}
        </button>
      </div>
      <p className="mt-2.5 sm:mt-3 text-center text-[9px] sm:text-[10px] text-taupe tracking-[0.2em] uppercase">
        {l.guarantee}
      </p>
    </form>
  );
}

function LuxuryPanel({
  values,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  datesValid,
}: {
  values: Values;
} & DateChangeProps & { onSearch: () => void }) {
  const l = BOOKING_LABELS.luxury;
  const f = BOOKING_LABELS.fieldLabels;
  return (
    <div className="animate-fade-up [animation-delay:200ms] relative w-full">
      <div className="bg-brown shadow-gold p-4 sm:p-6 text-ivory">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow text-gold text-[10px] sm:text-xs">{l.eyebrow}</span>
          <LotusMark className="w-4 h-4 text-gold sm:hidden" />
        </div>
        <div className="grid grid-cols-3 gap-px bg-gold/20 overflow-hidden">
          <FieldDate
            tone="dark"
            label={f.checkIn}
            value={values.checkIn}
            onChange={onCheckInChange}
            min={minCheckInISO()}
          />
          <FieldDate
            tone="dark"
            label={f.checkOut}
            value={values.checkOut}
            onChange={onCheckOutChange}
            min={minCheckOutISO(values.checkIn)}
          />
          <button
            onClick={datesValid ? onSearch : undefined}
            disabled={!datesValid}
            className="bg-gold text-brown eyebrow px-2 sm:px-6 text-center hover:bg-ivory transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold"
          >
            {l.button}
          </button>
        </div>
        <div className="mt-4 text-center text-[10px] text-ivory/55 tracking-[0.2em] uppercase">
          {l.guarantee}
        </div>
      </div>
    </div>
  );
}

function SerenityPanel({
  values,
  setValues,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  datesValid,
}: {
  values: Values;
  setValues: (v: Values) => void;
} & DateChangeProps & { onSearch: () => void }) {
  const l = BOOKING_LABELS.serenity;
  const f = BOOKING_LABELS.fieldLabels;
  return (
    <div className="animate-fade-up [animation-delay:300ms] relative max-w-3xl mx-auto -mt-2 mb-4">
      <div className="bg-ivory ring-1 ring-gold/30 rounded-[28px] shadow-gold p-6 lg:p-8 relative">
        <LotusMark className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-gold bg-ivory rounded-full p-2 ring-1 ring-gold/30" />
        <div className="text-center mb-6">
          <span className="eyebrow text-gold">{l.eyebrow}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <FieldDate
            tone="light"
            label={f.checkIn}
            value={values.checkIn}
            onChange={onCheckInChange}
            min={minCheckInISO()}
            rounded
          />
          <FieldDate
            tone="light"
            label={f.checkOut}
            value={values.checkOut}
            onChange={onCheckOutChange}
            min={minCheckOutISO(values.checkIn)}
            rounded
          />
          <FieldSelect
            tone="light"
            label={f.guests}
            value={values.guests}
            options={BOOKING_GUEST_OPTIONS as unknown as string[]}
            onChange={(v) => setValues({ ...values, guests: v })}
            rounded
          />
        </div>
        <button
          onClick={datesValid ? onSearch : undefined}
          disabled={!datesValid}
          className="w-full mt-6 bg-brown text-ivory eyebrow py-4 rounded-full hover:bg-gold hover:text-brown transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brown disabled:hover:text-ivory"
        >
          {l.button}
        </button>
        <div className="text-center mt-4 text-[10px] text-taupe tracking-widest uppercase">
          {l.guarantee}
        </div>
      </div>
    </div>
  );
}

function ModernPanel({
  values,
  setValues,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  datesValid,
}: {
  values: Values;
  setValues: (v: Values) => void;
} & DateChangeProps & { onSearch: () => void }) {
  const l = BOOKING_LABELS.modern;
  const f = BOOKING_LABELS.fieldLabels;
  return (
    <div className="animate-fade-up [animation-delay:300ms]">
      <div className="bg-ivory rounded-2xl shadow-gold p-5 lg:p-6 ring-1 ring-brown/8">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow text-gold">{l.eyebrow}</span>
          <span className="eyebrow text-taupe hidden md:inline">{l.rating}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <FieldDate
            tone="light"
            label={f.checkIn}
            value={values.checkIn}
            onChange={onCheckInChange}
            min={minCheckInISO()}
            rounded
          />
          <FieldDate
            tone="light"
            label={f.checkOut}
            value={values.checkOut}
            onChange={onCheckOutChange}
            min={minCheckOutISO(values.checkIn)}
            rounded
          />
          <FieldSelect
            tone="light"
            label={f.guests}
            value={values.guests}
            options={BOOKING_GUEST_OPTIONS as unknown as string[]}
            onChange={(v) => setValues({ ...values, guests: v })}
            rounded
          />
        </div>
        <button
          onClick={datesValid ? onSearch : undefined}
          disabled={!datesValid}
          className="w-full mt-4 bg-gold text-brown py-3.5 eyebrow rounded-xl hover:bg-brown hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold disabled:hover:text-brown"
        >
          {l.button}
        </button>
        <div className="flex items-center justify-between mt-3 text-[10px] text-taupe">
          {l.perks.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickyBar({
  variant,
  values,
  visible,
  stickyTop,
  onSearch,
  datesValid,
}: {
  variant: BookingVariant;
  values: Values;
  visible: boolean;
  stickyTop: string;
  onSearch: () => void;
  datesValid: boolean;
}) {
  const desktopBase =
    variant === "hero"
      ? "bg-ivory/95 text-brown ring-1 ring-brown/10 backdrop-blur-md shadow-gold"
      : variant === "luxury"
        ? "bg-brown/95 text-ivory ring-1 ring-gold/30 backdrop-blur-md"
        : variant === "serenity"
          ? "bg-ivory/95 text-brown ring-1 ring-gold/30 backdrop-blur-md rounded-b-3xl shadow-gold"
          : "bg-ivory/98 text-brown ring-1 ring-brown/10 backdrop-blur-md shadow-gold";

  const tone: "dark" | "light" = variant === "luxury" ? "dark" : "light";

  return (
    <>
      <div
        aria-hidden={!visible}
        className={`hidden md:block fixed left-0 right-0 z-30 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: stickyTop }}
      >
        <div className={`mx-auto max-w-6xl ${desktopBase}`}>
          <div className="flex items-stretch gap-px px-3 py-2">
            <div className="flex items-center gap-3 pr-4 pl-2">
              <LotusMark className={`w-5 h-5 ${tone === "dark" ? "text-gold" : "text-gold"}`} />
              <span
                className={`font-display italic text-base ${tone === "dark" ? "text-ivory" : "text-brown"}`}
              >
                Lotus Divine
              </span>
            </div>
            <CompactField tone={tone} label="In" value={fmtOrPlaceholder(values.checkIn)} />
            <CompactField tone={tone} label="Out" value={fmtOrPlaceholder(values.checkOut)} />
            {variant !== "luxury" && variant !== "hero" && (
              <CompactField tone={tone} label="Guests" value={values.guests} />
            )}
            <button
              onClick={datesValid ? onSearch : undefined}
              disabled={!datesValid}
              className={`ml-auto eyebrow px-6 ${
                variant === "hero"
                  ? "bg-brown text-ivory my-1 hover:bg-gold hover:text-brown"
                  : variant === "modern"
                    ? "bg-gold text-brown rounded-xl my-1 hover:bg-brown hover:text-ivory"
                    : variant === "serenity"
                      ? "bg-brown text-ivory rounded-full my-1 hover:bg-gold hover:text-brown"
                      : "bg-gold text-brown hover:bg-ivory"
              } transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {BOOKING_LABELS[variant].buttonSticky}
            </button>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!visible}
        className={`md:hidden fixed left-0 right-0 bottom-0 z-30 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="bg-ivory/98 backdrop-blur-md border-t border-gold/30 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="eyebrow text-gold text-[9px]">{BOOKING_LABELS.mobileBar.label}</div>
            <div className="font-display text-sm text-brown truncate">
              {fmtOrPlaceholder(values.checkIn)} → {fmtOrPlaceholder(values.checkOut)}
              {variant !== "luxury" && variant !== "hero" ? ` · ${values.guests}` : ""}
            </div>
          </div>
          <button
            onClick={datesValid ? onSearch : undefined}
            disabled={!datesValid}
            className={`shrink-0 eyebrow px-5 py-3 ${
              variant === "luxury" || variant === "hero"
                ? "bg-brown text-ivory"
                : variant === "serenity"
                  ? "bg-brown text-ivory rounded-full"
                  : "bg-gold text-brown rounded-xl"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {BOOKING_LABELS.mobileBar.button}
          </button>
        </div>
      </div>
    </>
  );
}

function baseField(tone: "dark" | "light", rounded?: boolean, big?: boolean) {
  const bg = tone === "dark" ? "bg-brown/40 text-ivory" : "bg-ivory text-brown";
  const ring =
    tone === "dark"
      ? "ring-1 ring-gold/0 hover:ring-gold/40 focus-within:ring-gold/50"
      : "ring-1 ring-brown/10 hover:ring-gold/60 focus-within:ring-gold/70";
  const radius = rounded ? "rounded-xl" : "";
  const pad = big ? "px-4 py-3 sm:px-5 sm:py-4" : "px-4 py-3";
  return `${bg} ${ring} ${radius} ${pad} transition-all cursor-pointer text-left`;
}

function FieldDate({
  tone,
  label,
  value,
  onChange,
  rounded,
  big,
  min,
}: {
  tone: "dark" | "light";
  label: string;
  value: string;
  onChange: (v: string) => void;
  rounded?: boolean;
  big?: boolean;
  min: string;
}) {
  const labelColor = tone === "dark" ? "text-gold" : "text-taupe";
  const valueColor = tone === "dark" ? "text-ivory" : "text-brown";
  const placeholderColor = tone === "dark" ? "text-ivory/50" : "text-brown/40";
  const iconColor =
    tone === "dark"
      ? "text-gold/70 group-hover:text-gold group-focus-within:text-gold"
      : "text-gold/80 group-hover:text-gold group-focus-within:text-gold";

  return (
    <BookingCalendarField
      value={value}
      onChange={onChange}
      min={min}
      trigger={
        <button
          type="button"
          aria-label={label}
          className={`group block w-full relative ${baseField(tone, rounded, big)}`}
        >
          <div className={`eyebrow text-[9px] ${labelColor}`}>{label}</div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span
              className={`font-display ${big ? "text-lg" : "text-base"} ${value ? valueColor : placeholderColor}`}
            >
              {value ? formatBookingDate(value) : "Select date"}
            </span>
            <ChevronDown
              className={`shrink-0 transition-colors ${iconColor}`}
              size={big ? 18 : 16}
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </div>
        </button>
      }
    />
  );
}

function FieldSelect({
  tone,
  label,
  value,
  options,
  onChange,
  rounded,
  big,
}: {
  tone: "dark" | "light";
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  rounded?: boolean;
  big?: boolean;
}) {
  const labelColor = tone === "dark" ? "text-gold" : "text-taupe";
  const valueColor = tone === "dark" ? "text-ivory" : "text-brown";
  return (
    <label className={`group block relative ${baseField(tone, rounded, big)}`}>
      <div className={`eyebrow text-[9px] ${labelColor}`}>{label}</div>
      <div className="flex items-center justify-between mt-1">
        <span className={`font-display ${big ? "text-lg" : "text-base"} truncate ${valueColor}`}>
          {value}
        </span>
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

function CompactField({
  tone,
  label,
  value,
}: {
  tone: "dark" | "light";
  label: string;
  value: string;
}) {
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

function fmtOrPlaceholder(d: string) {
  return d ? formatBookingDate(d) : "Select date";
}
