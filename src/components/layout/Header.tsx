"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { NAV_LINKS, NAV, CONTACT } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

const EMPTY_BOOKING = bookingHref();

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`hidden lg:grid grid-cols-3 fixed top-0 left-0 right-0 z-40 px-12 items-center text-ivory transition-all duration-500 ${
          scrolled
            ? "bg-brown/92 backdrop-blur-xl border-b border-gold/15 py-3"
            : "bg-transparent py-7"
        }`}
      >
        <div className="flex gap-7 items-center">
          {NAV_LINKS.slice(0, 2).map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.to!}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-ivory/40 cursor-default select-none"
              >
                {item.label}
              </span>
            ),
          )}
        </div>

        <div className="flex justify-center">
          <Link href="/" aria-label="Lotus Divine home">
            <BrandLogo tone="ivory" size="xl" />
          </Link>
        </div>

        <div className="flex items-center gap-6 justify-end">
          {NAV_LINKS.slice(2).map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.to!}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-ivory/40 cursor-default select-none"
              >
                {item.label}
              </span>
            ),
          )}
          <Link
            href={EMPTY_BOOKING}
            className="text-[10px] font-sans font-medium tracking-[0.14em] uppercase border border-gold/60 text-gold px-6 py-2.5 hover:bg-gold hover:text-brown transition-all whitespace-nowrap"
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
          <Link href="/" aria-label="Lotus Divine home">
            <BrandLogo tone="ivory" size="sm" showTagline={false} />
          </Link>
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
              {NAV_LINKS.map((item, i) => (
                <li
                  key={item.label}
                  className={`border-b border-ivory/8 transition-all duration-500 ${
                    open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  {item.enabled ? (
                    <Link
                      href={item.to!}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-display text-3xl hover:text-gold transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="eyebrow text-gold/50 text-[10px]">0{i + 1}</span>
                    </Link>
                  ) : (
                    <div className="flex items-baseline justify-between py-5 font-display text-3xl text-ivory/30 cursor-default">
                      <span>{item.label}</span>
                      <span className="eyebrow text-ivory/20 text-[10px]">0{i + 1}</span>
                    </div>
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
