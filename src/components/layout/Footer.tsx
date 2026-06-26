import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND, CONTACT, FOOTER_QUICK_LINKS, FOOTER_SOCIAL } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

export function Footer() {
  return (
    <footer className="bg-brown text-ivory/60 py-16 lg:py-20 px-5 sm:px-8 lg:px-20 border-t border-gold/10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 max-w-7xl mx-auto">
        <div className="sm:col-span-2 md:col-span-1">
          <BrandLogo tone="ivory" align="left" size="3xl" />
          <p className="text-xs mt-5 lg:mt-6 leading-relaxed max-w-xs">{BRAND.description}</p>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-4 lg:mb-5">Quick Links</h4>
          <ul className="space-y-3 text-xs">
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
          <h4 className="eyebrow text-gold mb-4 lg:mb-5">Contact Us</h4>
          <ul className="space-y-3 text-xs">
            <li>{CONTACT.address}</li>
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

        <div>
          <h4 className="eyebrow text-gold mb-4 lg:mb-5">Follow Us</h4>
          <p className="text-xs mb-4 leading-relaxed">
            Stay connected for updates and offers from Lotus Divine.
          </p>
          <div className="flex flex-col gap-2">
            {FOOTER_SOCIAL.map((s) => (
              <a key={s.label} href={s.href} className="text-xs hover:text-gold transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 lg:mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="eyebrow text-ivory/40 text-[10px] lg:text-[11px] text-center">
          {BRAND.copyright}
        </span>
        <div className="flex gap-6 eyebrow text-ivory/40">
          {FOOTER_SOCIAL.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-gold">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
