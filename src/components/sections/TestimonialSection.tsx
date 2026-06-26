import { TESTIMONIAL } from "@/data/siteContent";

export function TestimonialSection() {
  return (
    <section className="py-20 lg:py-32 px-6 sm:px-10 lg:px-20 max-w-5xl mx-auto text-center">
      <div className="text-gold text-2xl tracking-widest mb-8 lg:mb-10">
        {"★".repeat(TESTIMONIAL.stars)}
      </div>
      <blockquote className="font-display text-2xl sm:text-3xl md:text-5xl italic leading-tight text-brown text-balance">
        "{TESTIMONIAL.quote}"
      </blockquote>
      <div className="hairline w-16 mx-auto my-8 lg:my-10" />
      <cite className="eyebrow text-taupe not-italic text-[10px] lg:text-[11px]">
        {TESTIMONIAL.attribution}
      </cite>
    </section>
  );
}
