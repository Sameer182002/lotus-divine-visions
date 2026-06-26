import { ROOMS_PAGE } from "@/data/siteContent";
import hero from "@/assets/hero-serenity.jpg";

export function RoomsHero() {
  return (
    <section className="relative min-h-[560px] md:min-h-[680px] h-[80svh] flex items-end overflow-hidden bg-brown">
      <img
        src={hero.src}
        alt="Lotus Divine suites"
        className="absolute inset-0 w-full h-full object-cover opacity-75 animate-kenburns"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/55 to-brown/20" />
      <div className="relative z-10 px-5 sm:px-8 lg:px-20 pb-12 lg:pb-28 pt-28 max-w-5xl w-full animate-fade-up">
        <span className="eyebrow text-gold block mb-5 lg:mb-8 text-[10px] lg:text-[11px]">
          {ROOMS_PAGE.hero.eyebrow}
        </span>
        <h1 className="font-display text-ivory text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[8rem] leading-[0.95] lg:leading-[0.92] text-balance">
          {ROOMS_PAGE.hero.headingLine1}
          <br />
          <span className="italic">{ROOMS_PAGE.hero.headingEmphasis}</span>{" "}
          {ROOMS_PAGE.hero.headingLine2}
        </h1>
        <p className="text-ivory/75 max-w-md mt-5 lg:mt-10 leading-relaxed text-sm lg:text-base">
          {ROOMS_PAGE.hero.body}
        </p>
      </div>
    </section>
  );
}
