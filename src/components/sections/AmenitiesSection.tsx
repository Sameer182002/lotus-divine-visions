import { LotusMark } from "@/components/BrandLogo";
import { AMENITIES, AMENITIES_SECTION } from "@/data/siteContent";

export function AmenitiesSection() {
  return (
    <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-20">
      <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-20">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px]">{AMENITIES_SECTION.eyebrow}</span>
        <h2 className="font-display text-[2.25rem] sm:text-4xl lg:text-5xl mt-4 lg:mt-6 text-balance leading-tight">
          {AMENITIES_SECTION.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-y border-gold/20 sm:divide-x lg:divide-x divide-gold/10 divide-y sm:divide-y-0 lg:divide-y-0">
        {AMENITIES.map((a) => (
          <div key={a.label} className="p-8 lg:p-10 text-center">
            <LotusMark className="w-7 h-7 mx-auto text-gold" />
            <h4 className="eyebrow mt-5 lg:mt-6 text-brown">{a.label}</h4>
            <p className="text-taupe text-sm mt-3 lg:mt-4 leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
