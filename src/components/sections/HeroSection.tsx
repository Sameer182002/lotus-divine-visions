"use client";

import { useRef } from "react";
import { Footprints, MapPin } from "lucide-react";
import { BookingExperience } from "@/components/BookingWidget";
import { GoldenTempleArt } from "@/components/hero/GoldenTempleArt";
import { useHeroProgress } from "@/components/hero/useHeroProgress";
import { HERO } from "@/data/siteContent";

const J = HERO.journey;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroProgress(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="hero-story hero-pin relative bg-ivory text-brown"
      aria-labelledby="hero-heading"
    >
      <div className="hero-canvas flex flex-col overflow-hidden px-5 sm:px-8 lg:px-12 pt-[max(4.25rem,11.5svh)] sm:pt-28 lg:pt-[max(6.25rem,11vh)] pb-5 sm:pb-10 lg:pb-[max(1.5rem,4vh)]">
        {/* ── Stage 1: identity ─────────────────────────────────────────── */}
        <div data-stage="intro" className="w-full max-w-3xl mx-auto text-center animate-fade-up">
          <h1
            id="hero-heading"
            className="font-display text-[clamp(2rem,9.2vw,2.6rem)] leading-[1.06] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[clamp(2.75rem,4.5vw,4.5rem)] lg:leading-[1.04] text-balance"
          >
            {HERO.headingLine1}
            <br />
            <span className="italic">{HERO.headingLine2}</span>
          </h1>
          <p className="mx-auto mt-2.5 sm:mt-5 lg:mt-6 max-w-[19.5rem] sm:max-w-md text-taupe text-[14px] sm:text-base leading-relaxed text-balance">
            {HERO.body}
          </p>
        </div>

        {/* ── Stages 2–5: journey + booking ─────────────────────────────── */}
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-end lg:justify-center min-h-0">
          {/* Mobile / tablet: top-to-bottom column — origin → 5 min walk → destination */}
          <figure
            className="lg:hidden relative m-0 my-auto w-[min(100%,340px)] sm:w-[min(100%,420px)] mx-auto flex flex-col items-center pt-0 sm:pt-6"
            role="img"
            aria-label={J.ariaLabel}
          >
            <Origin />

            {/* segment 1: origin → 5 min walk */}
            <svg
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              className="w-full h-[min(112px,calc(16svh-70px))] mt-1.5"
              fill="none"
              aria-hidden
            >
              <RoutePath d="M50,0 C50,9 52,12 51,20" thin stage="route-a" />
            </svg>

            <WalkLabel className="mt-1.5" />

            {/* segment 2: 5 min walk → destination; a gentle curve that returns to the shared centre axis
                and runs a touch longer than segment 1 so "5 min walk" lands at the true midpoint once
                the destination is pulled up to meet it (see Destination's margin below) */}
            <svg
              viewBox="0 0 100 23"
              preserveAspectRatio="none"
              className="w-full h-[min(120px,calc(16svh-62px))] mt-1.5"
              fill="none"
              aria-hidden
            >
              <RoutePath d="M51,0 C51,10 49,14 50,23" thin stage="route-b" />
            </svg>

            <Destination className="w-[min(72%,calc(34svh-80px))] sm:w-[min(66%,34svh)] mt-[calc(8px-0.17*min(72%,34svh-80px))] sm:mt-[calc(8px-0.17*min(66%,34svh))]" />
          </figure>

          {/* Desktop: horizontal journey, both endpoints sharing one centre line */}
          <figure
            className="hidden lg:grid m-0 grid-cols-[auto_1fr_auto] items-center mt-[max(0.5rem,2vh)]"
            role="img"
            aria-label={J.ariaLabel}
          >
            <Origin className="pr-8 animate-fade-up [animation-delay:150ms]" />
            <div className="relative w-full h-[clamp(64px,9vh,92px)]">
              <svg
                viewBox="0 0 400 56"
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 w-full h-full"
                fill="none"
                aria-hidden
              >
                <RoutePath d="M0,26 C150,23 250,30 400,26" />
              </svg>
              <WalkLabel className="absolute left-1/2 -translate-x-1/2 -top-9" />
            </div>
            <Destination className="w-[clamp(253px,40vh,385px)] pl-8" />
          </figure>

          {/* Booking */}
          <div
            data-stage="booking"
            className="w-full max-w-2xl lg:max-w-3xl mx-auto mt-[min(12px,1.25svh)] sm:mt-8 lg:mt-[max(1rem,3.5vh)]"
          >
            <BookingExperience variant="hero" stickyTop="0" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Origin: pin · hotel name · "Your stay" */
function Origin({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} flex flex-col items-center text-center`.trim()}>
      <MapPin
        className="w-[18px] h-[18px] lg:w-[18px] lg:h-[18px] text-[var(--hero-gold)]"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="mt-1.5 lg:mt-[11px] font-display text-[15px] sm:text-lg lg:text-[23px] leading-tight text-brown whitespace-nowrap">
        {J.originName}
      </span>
      <span className="mt-1 lg:mt-[7px] text-[9px] lg:text-[11px] tracking-[0.22em] lg:tracking-[0.28em] uppercase text-taupe">
        {J.originCaption}
      </span>
    </div>
  );
}

/* Destination: artwork · "Golden Temple" · "Sri Harmandir Sahib"
   Below lg the caption mirrors the origin's type system (display name + tracked caption). */
function Destination({ className }: { className: string }) {
  return (
    <div className={`${className} flex flex-col items-center`.trim()}>
      <GoldenTempleArt data-stage="temple" className="w-full h-auto" />
      <figcaption data-stage="temple-label" className="mt-1 lg:mt-[13px] text-center">
        <span className="block font-display text-[15px] sm:text-lg leading-tight text-brown whitespace-nowrap lg:font-sans lg:font-medium lg:tracking-[0.32em] lg:uppercase lg:text-[11px] lg:leading-normal">
          {J.destinationLabel}
        </span>
        <span className="block mt-1 text-[9px] tracking-[0.22em] uppercase text-taupe whitespace-nowrap lg:normal-case lg:tracking-normal lg:font-display lg:italic lg:text-[15px]">
          {J.destinationName}
        </span>
      </figcaption>
    </div>
  );
}

function RoutePath({
  d,
  thin = false,
  stage = "route",
}: {
  d: string;
  thin?: boolean;
  stage?: "route" | "route-a" | "route-b";
}) {
  // `thin` is for the mobile segments, whose viewBox units are ~3× screen pixels.
  return (
    <>
      <path
        d={d}
        pathLength={1}
        stroke="currentColor"
        className="text-brown/25"
        strokeWidth={thin ? 0.24 : 1}
        strokeDasharray="0.008 0.016"
      />
      <path
        d={d}
        data-stage={stage}
        pathLength={1}
        stroke="var(--hero-line)"
        strokeWidth={thin ? 0.3 : 1.25}
        strokeLinecap="round"
      />
    </>
  );
}

/* "5 min walk": lowercase and small below lg; the desktop eyebrow treatment above. */
function WalkLabel({ className }: { className: string }) {
  return (
    <div data-stage="walk" className={`${className} flex flex-col items-center text-center`.trim()}>
      <span className="inline-flex items-center gap-1.5 lg:gap-2 text-[10px] tracking-[0.1em] text-brown whitespace-nowrap lg:font-sans lg:font-medium lg:tracking-[0.32em] lg:uppercase lg:text-[11px]">
        <Footprints
          className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-[var(--hero-gold)]"
          strokeWidth={1.5}
          aria-hidden
        />
        {J.walkMinutes} {J.walkLabel}
      </span>
      <span className="hidden lg:block mt-1 text-[10px] tracking-[0.18em] uppercase text-taupe whitespace-nowrap">
        {J.walkNote}
      </span>
    </div>
  );
}
