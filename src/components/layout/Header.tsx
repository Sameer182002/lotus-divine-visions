"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { NAV_LINKS, NAV, CONTACT } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

const EMPTY_BOOKING = bookingHref();

export function Header() {
  return (
    <>
      <nav className="hidden lg:flex absolute top-10 left-0 right-0 z-40 px-10 items-center justify-between text-ivory">
        <div className="flex gap-8">
          {NAV_LINKS.slice(0, 3).map((l) =>
            l === "Suites" ? (
              <Link key={l} href="/rooms" className="eyebrow hover:text-gold transition-colors">
                {l}
              </Link>
            ) : (
              <a key={l} href="#" className="eyebrow hover:text-gold transition-colors">
                {l}
              </a>
            ),
          )}
        </div>
        <BrandLogo tone="ivory" size="md" />
        <div className="flex items-center gap-8">
          <Link href={EMPTY_BOOKING} className="eyebrow hover:text-gold transition-colors">
            {NAV.reservations}
          </Link>
          <Link
            href={EMPTY_BOOKING}
            className="border border-gold/60 text-gold px-7 py-3 eyebrow hover:bg-gold hover:text-brown transition-all"
          >
            {NAV.bookCta}
          </Link>
        </div>
      </nav>
      <MobileNav />
    </>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`lg:hidden fixed left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-brown/92 backdrop-blur-xl border-b border-gold/20 py-3"
            : "bg-transparent py-5"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex items-center justify-between px-5 sm:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="w-10 h-10 -ml-2 flex flex-col items-center justify-center gap-1.5 text-ivory"
          >
            <span className="block w-5 h-px bg-gold" />
            <span className="block w-5 h-px bg-ivory" />
            <span className="block w-3 h-px bg-ivory ml-2" />
          </button>
          <BrandLogo tone="ivory" size="sm" showTagline={false} />
          <Link
            href={EMPTY_BOOKING}
            className="eyebrow text-[10px] border border-gold/60 text-gold px-4 py-2.5 hover:bg-gold hover:text-brown transition-all"
          >
            {NAV.bookMobile}
          </Link>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-brown/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-brown text-ivory shadow-gold flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15">
            <BrandLogo tone="ivory" size="sm" />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gold text-2xl -mr-2"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 px-6 py-8 flex flex-col">
            <span className="eyebrow text-gold text-[10px] mb-6">{NAV.drawerLabel}</span>
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => (
                <li
                  key={l}
                  className={`border-b border-ivory/8 transition-all duration-500 ${
                    open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  {l === "Suites" ? (
                    <Link
                      href="/rooms"
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-display text-3xl hover:text-gold transition-colors"
                    >
                      <span>{l}</span>
                      <span className="eyebrow text-gold/50 text-[10px]">0{i + 1}</span>
                    </Link>
                  ) : (
                    <a
                      href="#"
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-display text-3xl hover:text-gold transition-colors"
                    >
                      <span>{l}</span>
                      <span className="eyebrow text-gold/50 text-[10px]">0{i + 1}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <Link
                href={EMPTY_BOOKING}
                onClick={() => setOpen(false)}
                className="block w-full bg-gold text-brown eyebrow py-4 hover:bg-ivory transition-colors text-center"
              >
                {NAV.bookCta}
              </Link>
              <div className="mt-6 text-center space-y-1 text-ivory/60 text-xs">
                <p>{CONTACT.phone}</p>
                <p>{CONTACT.email}</p>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
