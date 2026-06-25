import { BookingExperience } from "@/components/BookingWidget";
import { HERO } from "@/data/siteContent";
import hero from "@/assets/hero-luxury.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[640px] md:min-h-[720px] h-[100svh] lg:h-screen lg:min-h-[720px] flex items-end overflow-hidden bg-brown">
      <img
        src={hero.src}
        alt={HERO.imgAlt}
        className="absolute inset-0 w-full h-full object-cover opacity-80 animate-kenburns"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/55 lg:via-brown/40 to-brown/40 lg:to-brown/30" />
      <div className="relative z-10 px-5 sm:px-8 lg:px-20 pb-10 lg:pb-24 pt-28 lg:pt-0 max-w-6xl w-full animate-fade-up">
        <span className="eyebrow text-gold block mb-5 lg:mb-8 text-[10px] lg:text-[11px]">
          {HERO.eyebrow}
        </span>
        <h1 className="font-display text-ivory text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[9rem] leading-[0.95] lg:leading-[0.92] text-balance">
          {HERO.headingLine1} <br />
          <span className="italic">{HERO.headingEmphasis}</span> {HERO.headingLine2}
        </h1>
        <p className="text-ivory/75 max-w-md mt-5 lg:mt-10 leading-relaxed text-sm lg:text-base">
          {HERO.body}
        </p>
        <BookingExperience variant="luxury" stickyTop="0" />
      </div>
      <div className="absolute bottom-10 right-10 z-10 text-ivory/60 eyebrow hidden lg:flex items-center gap-3">
        <span>{HERO.scrollLabel}</span>
        <div className="w-12 h-px bg-gold" />
      </div>
    </section>
  );
}
