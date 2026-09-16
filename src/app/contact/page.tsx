import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CONTACT, CONTACT_MAPS_URL, CONTACT_MAP_EMBED_URL, CONTACT_PAGE } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";

export const metadata: Metadata = {
  title: "Contact — Lotus Divine",
  description:
    "Get in touch with Lotus Divine. We're here to help you plan your stay in Amritsar, near the Golden Temple.",
};

export default function ContactPage() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />

      <ContactHero />

      <div className="bg-champagne/30">
        <LocationAndMap />
      </div>

      <NearbyAttractions />

      <div className="bg-brown text-ivory">
        <BookingHelpCTA />
        <Footer />
      </div>
    </main>
  );
}

function ContactHero() {
  return (
    <section className="pt-32 pb-16 lg:pt-44 lg:pb-20 px-5 sm:px-8 lg:px-20 text-center">
      <span className="eyebrow text-gold text-[10px] block mb-4">{CONTACT_PAGE.hero.eyebrow}</span>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] mb-5 text-balance">
        Contact <em className="text-gold not-italic">Lotus Divine</em>
      </h1>
      <p className="text-brown/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-12 lg:mb-16">
        {CONTACT_PAGE.hero.body}
      </p>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 sm:gap-6 lg:gap-10">
        <ContactValue
          eyebrow="Reservations"
          href={`tel:${CONTACT.phone}`}
          value={CONTACT.phone}
          icon={<Phone className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={1.25} aria-hidden />}
        />

        <ContactValue
          eyebrow="Email"
          href={`mailto:${CONTACT.email}`}
          value={CONTACT.email}
          icon={<Mail className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={1.25} aria-hidden />}
        />
      </div>
    </section>
  );
}

function ContactValue({
  eyebrow,
  href,
  value,
  icon,
}: {
  eyebrow: string;
  href: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border-t border-gold/30 pt-6 min-w-0">
      <span className="eyebrow text-gold text-[10px] block mb-4">{eyebrow}</span>
      <a
        href={href}
        className="group inline-flex items-center gap-2.5 sm:gap-3 max-w-full font-sans font-medium text-brown text-xl sm:text-[1.3rem] lg:text-2xl tracking-tight hover:text-gold transition-colors"
      >
        <span className="text-gold/70 group-hover:text-gold transition-colors shrink-0">
          {icon}
        </span>
        <span className="min-w-0 sm:whitespace-nowrap">{value}</span>
      </a>
    </div>
  );
}

function LocationAndMap() {
  return (
    <section className="py-16 lg:py-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 items-stretch">
        <div className="lg:col-span-2 bg-brown text-ivory px-8 py-10 sm:px-10 sm:py-12 lg:p-12 flex flex-col justify-center">
          <span className="eyebrow text-gold text-[10px] block mb-4">
            {CONTACT_PAGE.location.eyebrow}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] mb-5 text-balance">
            {CONTACT_PAGE.location.heading}{" "}
            <em className="text-gold not-italic">{CONTACT_PAGE.location.headingEmphasis}</em>
          </h2>
          <p className="text-ivory/65 text-sm leading-relaxed mb-8">{CONTACT_PAGE.location.body}</p>

          <div className="border-t border-ivory/10">
            <div className="py-4">
              <span className="eyebrow text-ivory/40 text-[9px] block mb-1.5">Address</span>
              <p className="text-sm leading-snug">{CONTACT.address}</p>
            </div>
          </div>

          <a
            href={CONTACT_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow text-[10px] bg-gold text-brown px-7 py-3.5 hover:bg-ivory transition-colors inline-block mt-8 self-start"
          >
            {CONTACT_PAGE.location.cta}
          </a>
        </div>

        <div className="lg:col-span-3 h-[300px] sm:h-[340px] lg:h-auto lg:min-h-[440px]">
          <iframe
            src={CONTACT_MAP_EMBED_URL}
            title="Map showing Hotel Lotus Divine location in Amritsar"
            className="w-full h-full border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function NearbyAttractions() {
  return (
    <section className="py-14 lg:py-20 px-5 sm:px-8 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <span className="eyebrow text-gold text-[10px] block mb-3 text-center">
          {CONTACT_PAGE.nearby.eyebrow}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl leading-[1.1] mb-8 text-center">
          {CONTACT_PAGE.nearby.heading}
        </h2>
        <div className="divide-y divide-brown/10 border-t border-b border-brown/10">
          {CONTACT_PAGE.nearby.places.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3.5 sm:py-4">
              <p className="text-brown text-sm sm:text-[15px]">{item.label}</p>
              <p className="text-brown/40 text-xs ml-4 shrink-0">
                {item.mode} · {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingHelpCTA() {
  return (
    <section className="py-14 lg:py-20 px-5 sm:px-8 lg:px-20 text-center">
      <div className="max-w-xl mx-auto">
        <span className="eyebrow text-gold text-[10px] block mb-3">{CONTACT_PAGE.cta.eyebrow}</span>
        <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] mb-3">
          {CONTACT_PAGE.cta.heading}
        </h2>
        <p className="text-ivory/60 text-sm leading-relaxed mb-8">{CONTACT_PAGE.cta.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={bookingHref()}
            className="eyebrow text-[10px] bg-gold text-brown px-8 py-4 hover:bg-ivory transition-all"
          >
            {CONTACT_PAGE.cta.primaryBtn}
          </Link>
          <a
            href={`tel:${CONTACT.phone}`}
            className="eyebrow text-[10px] border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-brown transition-all"
          >
            {CONTACT_PAGE.cta.secondaryBtn}
          </a>
        </div>
      </div>
    </section>
  );
}
