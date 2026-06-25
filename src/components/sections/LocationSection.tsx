import { CONTACT, LOCATION_SECTION } from "@/data/siteContent";

export function LocationSection() {
  return (
    <section className="bg-champagne/40 py-20 lg:py-32 px-5 sm:px-8 lg:px-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div>
        <span className="eyebrow text-gold text-[10px] lg:text-[11px]">
          {LOCATION_SECTION.eyebrow}
        </span>
        <h2 className="font-display text-[2rem] sm:text-4xl lg:text-5xl mt-4 lg:mt-6 leading-tight">
          {LOCATION_SECTION.heading} <br />
          {LOCATION_SECTION.headingLine2}
        </h2>
        <div className="hairline w-16 my-6 lg:my-8" />
        <div className="space-y-3 lg:space-y-4 text-taupe text-[15px] lg:text-base">
          <p>{CONTACT.address}</p>
          <p>{CONTACT.phoneDisplay}</p>
          <p>{CONTACT.email}</p>
        </div>
        <a
          href="#"
          className="inline-block mt-7 lg:mt-8 eyebrow text-brown border-b border-gold pb-2"
        >
          {LOCATION_SECTION.cta}
        </a>
      </div>
      <div className="aspect-[4/3] bg-brown/5 ring-1 ring-brown/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_color-mix(in_oklab,_var(--gold)_20%,_transparent),_transparent_60%),_radial-gradient(circle_at_70%_70%,_color-mix(in_oklab,_var(--brown)_15%,_transparent),_transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300">
          <path
            d="M0 200 Q 80 160 160 180 T 320 140 T 400 100"
            stroke="currentColor"
            fill="none"
            className="text-gold"
            strokeWidth="1"
          />
          <path
            d="M50 250 L 80 200 L 150 220 L 220 180 L 300 200 L 380 160"
            stroke="currentColor"
            fill="none"
            className="text-brown/40"
            strokeWidth="1"
          />
          <circle cx="200" cy="150" r="6" className="fill-gold" />
          <circle cx="200" cy="150" r="14" className="fill-gold/20" />
        </svg>
        <span className="absolute bottom-5 left-5 lg:bottom-6 lg:left-6 eyebrow text-brown bg-ivory/80 px-3 py-1.5">
          {CONTACT.addressShort}
        </span>
      </div>
    </section>
  );
}
