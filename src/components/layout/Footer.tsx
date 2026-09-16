import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  BRAND,
  CONTACT,
  CONTACT_MAPS_URL,
  FOOTER_LEGAL_LINKS,
  FOOTER_QUICK_LINKS,
} from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

export function Footer() {
  return (
    <footer className="bg-brown text-ivory/60 py-12 md:py-16 lg:py-20 px-5 sm:px-8 lg:px-20 border-t border-gold/10">
      <div className="grid grid-cols-1 md:grid-cols-[19fr_10fr_12fr] lg:grid-cols-[16fr_5fr_9fr_11fr] gap-y-10 gap-x-8 md:gap-x-10 lg:gap-x-6 max-w-7xl mx-auto">
        <div>
          <BrandLogo tone="ivory" align="left" size="footer" />
          <p className="text-xs mt-4 md:mt-5 lg:mt-6 leading-relaxed max-w-xs">
            {BRAND.description}
          </p>
        </div>

        {/* Desktop-only spacer track: widens the brand → info gap without touching tablet/mobile, which never render this (display:none below lg). */}
        <div className="hidden lg:block" aria-hidden />

        <div>
          <h4 className="eyebrow text-gold mb-3 md:mb-4 lg:mb-5">Quick Links</h4>
          <ul className="space-y-2.5 md:space-y-3 text-xs">
            {FOOTER_QUICK_LINKS.map((item) => (
              <li key={item.label}>
                {item.enabled ? (
                  <Link
                    href={item.to === "/booking" ? bookingHref() : item.to!}
                    className="hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-ivory/30 cursor-default">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-3 md:mb-4 lg:mb-5">Contact Us</h4>
          <ul className="space-y-2.5 md:space-y-3 text-xs">
            <li>
              <a
                href={CONTACT_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                {CONTACT.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone}`} className="hover:text-gold transition-colors">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-gold transition-colors">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-16 pt-6 md:pt-8 border-t border-ivory/10">
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-3 md:gap-4">
          <span className="text-[12px] md:text-[13px] text-ivory/40 tracking-wide text-center md:text-left">
            {BRAND.copyright}
          </span>
          <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center md:justify-end md:ml-auto gap-1.5 md:gap-x-6 md:gap-y-1.5 text-[12px] md:text-[13px] text-ivory/40 tracking-wide">
            {FOOTER_LEGAL_LINKS.map((item) =>
              item.enabled ? (
                <Link key={item.label} href={item.to} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="cursor-default">
                  {item.label}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[13px] md:text-[14px] text-ivory/40 font-normal">
            Website designed and developed by{" "}
            <a
              href="https://bgsitepilot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-[var(--gold-soft)] hover:underline underline-offset-2 transition-colors"
            >
              BG SitePilot
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
