"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { NAV_LINKS, NAV, CONTACT } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

const EMPTY_BOOKING = bookingHref();

/**
 * One dark header, stable from first paint through hero scroll. Desktop/tablet
 * nav is active at 820px+ (iPad Air portrait and up); below that, mobile nav.
 */
export function Header() {
  const pathname = usePathname();
  const isBookingPage = pathname?.startsWith("/booking") ?? false;

  return (
    <>
      <nav className="hidden min-[820px]:grid grid-cols-[auto_1fr_auto] gap-4 min-[1024px]:gap-8 fixed top-0 left-0 right-0 z-40 px-6 min-[1024px]:px-12 py-3 items-center text-ivory bg-brown/95 backdrop-blur-xl border-b border-gold/15">
        <Link href="/" aria-label="Lotus Divine home" className="flex items-center">
          <BrandLogo tone="ivory" size="lg" align="left" />
        </Link>

        <div className="flex justify-center gap-4 min-[1024px]:gap-7 items-center">
          {NAV_LINKS.map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.to!}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase hover:text-gold transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-ivory/40 cursor-default select-none whitespace-nowrap"
              >
                {item.label}
              </span>
            ),
          )}
        </div>

        <div className="flex items-center justify-end">
          {!isBookingPage && (
            <Link
              href={EMPTY_BOOKING}
              className="text-[10px] font-sans font-medium tracking-[0.14em] uppercase border border-gold/60 text-gold px-6 py-2.5 hover:bg-gold hover:text-brown transition-all whitespace-nowrap"
            >
              {NAV.bookCta}
            </Link>
          )}
        </div>
      </nav>
      <MobileNav isBookingPage={isBookingPage} />
    </>
  );
}

function MobileNav({ isBookingPage }: { isBookingPage: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    window.__lenis?.stop();

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      window.scrollTo(0, scrollY);
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
      <nav
        className="min-[820px]:hidden fixed top-0 left-0 right-0 z-40 py-3.5 bg-brown/95 backdrop-blur-xl border-b border-gold/15"
      >
        <div className="flex items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Lotus Divine home">
            <BrandLogo tone="ivory" size="sm" align="left" showTagline={false} />
          </Link>

          <div className="flex items-center gap-3">
            {!isBookingPage && (
              <Link
                href={EMPTY_BOOKING}
                className="eyebrow text-[10px] border border-gold/60 text-gold px-4 py-2.5 hover:bg-gold hover:text-brown transition-all whitespace-nowrap"
              >
                {NAV.bookMobile}
              </Link>
            )}
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-1.5 text-gold"
            >
              <span className="block w-5 h-px bg-gold" />
              <span className="block w-5 h-px bg-gold/80" />
              <span className="block w-5 h-px bg-gold/60" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`min-[820px]:hidden fixed inset-0 z-50 transition-opacity duration-500 ${
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
            <BrandLogo tone="ivory" size="sm" align="left" />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gold text-2xl -mr-2"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 px-6 pt-8 pb-10 flex flex-col">
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
                      className="flex items-center justify-between py-5 font-display text-3xl hover:text-gold transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-5 h-5 text-gold/60" strokeWidth={1.25} aria-hidden />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between py-5 font-display text-3xl text-ivory/30 cursor-default">
                      <span>{item.label}</span>
                      <ArrowRight className="w-5 h-5 text-ivory/20" strokeWidth={1.25} aria-hidden />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              {!isBookingPage && (
                <Link
                  href={EMPTY_BOOKING}
                  onClick={() => setOpen(false)}
                  className="block w-full bg-gold text-brown eyebrow py-4 hover:bg-ivory transition-colors text-center"
                >
                  {NAV.bookCta}
                </Link>
              )}
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
