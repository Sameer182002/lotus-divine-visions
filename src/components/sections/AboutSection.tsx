import { ABOUT } from "@/data/siteContent";
import lobby from "@/assets/lobby.jpg";

export function AboutSection() {
  return (
    <section className="py-16 lg:py-32 px-5 sm:px-8 lg:px-20 grid grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="col-span-12 lg:col-span-5">
        <img src={lobby} alt={ABOUT.imgAlt} className="w-full aspect-[4/5] object-cover" loading="lazy" />
      </div>
      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px]">{ABOUT.eyebrow}</span>
        <h2 className="font-display text-[2rem] sm:text-4xl lg:text-6xl mt-4 lg:mt-6 leading-[1.1] lg:leading-[1.05] text-balance">
          {ABOUT.heading}
        </h2>
        <div className="hairline w-16 lg:w-24 my-6 lg:my-8" />
        <p className="text-taupe leading-relaxed max-w-lg mb-5 text-[15px] lg:text-base">
          {ABOUT.body1}
        </p>
        <p className="text-taupe leading-relaxed max-w-lg text-[15px] lg:text-base">
          {ABOUT.body2}
        </p>
        <a
          href="#"
          className="inline-block mt-8 lg:mt-10 eyebrow text-brown border-b border-gold pb-2 hover:text-gold transition-colors"
        >
          {ABOUT.cta}
        </a>
      </div>
    </section>
  );
}
