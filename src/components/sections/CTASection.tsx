import { Link } from "@tanstack/react-router";
import { CTA } from "@/data/siteContent";

export function CTASection() {
  return (
    <section className="bg-brown text-ivory py-20 lg:py-32 px-5 sm:px-8 lg:px-10 text-center">
      <span className="eyebrow text-gold text-[10px] lg:text-[11px]">{CTA.eyebrow}</span>
      <h2 className="font-display text-[2.25rem] sm:text-5xl md:text-7xl mt-4 lg:mt-6 leading-[1.05] lg:leading-tight text-balance">
        {CTA.headingLine1} <span className="italic">{CTA.headingEmphasis}</span> {CTA.headingLine2}
      </h2>
      <p className="text-ivory/60 max-w-xl mx-auto mt-6 lg:mt-8 text-sm lg:text-base">
        {CTA.body}
      </p>
      <Link
        to="/booking"
        search={{ room: "", checkIn: "", checkOut: "", guests: "" }}
        className="inline-block mt-10 lg:mt-12 bg-gold text-brown px-10 sm:px-14 py-4 lg:py-5 eyebrow hover:bg-ivory transition-colors w-full sm:w-auto max-w-sm text-center"
      >
        {CTA.button}
      </Link>
    </section>
  );
}
