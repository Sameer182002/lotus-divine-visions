import { CONTACT, LOCATION_SECTION } from "@/data/siteContent";

export function LocationSection() {
  return (
    <section className="bg-champagne/30 py-20 lg:py-32 overflow-x-hidden">
      <div className="px-5 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="mb-12 lg:mb-16">
          <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold block mb-3">
            {LOCATION_SECTION.eyebrow}
          </span>
          <h2 className="font-display text-[2.25rem] sm:text-4xl lg:text-[3.5rem] leading-tight text-brown">
            {LOCATION_SECTION.heading}{" "}
            <span className="italic">{LOCATION_SECTION.headingLine2}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-taupe text-[15px] leading-relaxed max-w-lg">
              {LOCATION_SECTION.body}
            </p>

            <div className="mt-10 border-t border-brown/10">
              <div className="grid grid-cols-[72px_1fr] gap-4 py-4 border-b border-brown/10 items-start">
                <span className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-gold mt-0.5">
                  Address
                </span>
                <span className="text-sm text-brown leading-snug">{CONTACT.address}</span>
              </div>
              <div className="grid grid-cols-[72px_1fr] gap-4 py-4 border-b border-brown/10 items-center">
                <span className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-gold">
                  Phone
                </span>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="text-sm text-brown hover:text-gold transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <div className="grid grid-cols-[72px_1fr] gap-4 py-4 border-b border-brown/10 items-center">
                <span className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-gold">
                  Email
                </span>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-brown hover:text-gold transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://www.google.com/maps/search/Lotus+Divine+Hotel+Amritsar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brown text-ivory text-[10px] font-sans font-medium tracking-[0.14em] uppercase px-8 py-4 hover:bg-gold hover:text-brown transition-colors"
              >
                <span>{LOCATION_SECTION.cta}</span>
                <span className="text-sm leading-none">→</span>
              </a>
            </div>
          </div>

          <div className="bg-brown text-ivory px-8 py-8 lg:px-10 lg:py-10">
            <span className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold block mb-8">
              {LOCATION_SECTION.attractionsLabel}
            </span>
            <ul>
              {LOCATION_SECTION.attractions.map((place, i) => (
                <li
                  key={place}
                  className="flex items-center gap-6 py-5 border-b border-ivory/10 last:border-0 last:pb-0 first:pt-0"
                >
                  <span className="font-display text-3xl lg:text-4xl text-gold/20 leading-none w-10 shrink-0 text-right select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl lg:text-2xl text-ivory leading-snug">
                    {place}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
