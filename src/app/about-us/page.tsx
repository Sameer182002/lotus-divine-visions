import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ABOUT_PAGE } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import hero from "@/assets/hero-entrance.jpg";

export const metadata: Metadata = {
  title: "About Us — Lotus Divine",
  description:
    "Learn about Lotus Divine, a peaceful luxury hotel just minutes from the Golden Temple in Amritsar.",
};

export default function AboutPage() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />

      <section className="bg-brown text-ivory pt-36 pb-20 lg:pt-48 lg:pb-28 px-5 sm:px-8 lg:px-20 text-center">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-5">
          {ABOUT_PAGE.hero.eyebrow}
        </span>
        <h1 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
          {ABOUT_PAGE.hero.primaryHeading}
        </h1>
        <p className="eyebrow text-ivory/35 text-[10px] lg:text-[11px] mt-5 lg:mt-6 block">
          {ABOUT_PAGE.hero.secondaryHeading}
        </p>
        <p className="text-ivory/65 max-w-lg mx-auto mt-5 text-sm lg:text-base leading-relaxed">
          {ABOUT_PAGE.hero.body}
        </p>
      </section>

      <div className="bg-ivory">
        <section className="py-16 lg:py-24 px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 min-w-0">
            <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-5">
              {ABOUT_PAGE.story.eyebrow}
            </span>
            <h2 className="font-display text-[2rem] sm:text-4xl lg:text-5xl leading-[1.1] text-balance">
              {ABOUT_PAGE.story.heading}
            </h2>
            <div className="w-16 lg:w-24 border-t border-gold/40 my-6 lg:my-8" />
            <p className="text-brown/65 leading-relaxed text-[15px] lg:text-base mb-5">
              {ABOUT_PAGE.story.body1}
            </p>
            <p className="text-brown/65 leading-relaxed text-[15px] lg:text-base">
              {ABOUT_PAGE.story.body2}
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 min-w-0">
            <img
              src={hero.src}
              alt={ABOUT_PAGE.story.imgAlt}
              className="w-full max-w-full aspect-[4/5] object-cover object-bottom"
              loading="lazy"
            />
          </div>
        </section>

        <section className="border-t border-brown/8 py-14 lg:py-20 px-5 sm:px-8 lg:px-20">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-8 text-center">
            Why Guests Choose Lotus Divine
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {ABOUT_PAGE.features.map((f) => (
              <div key={f.label} className="border border-brown/10 p-7 lg:p-9">
                <div className="w-8 border-t border-gold mb-5" />
                <h3 className="font-display text-lg lg:text-xl leading-snug mb-3">{f.label}</h3>
                <p className="text-brown/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-brown/8 py-16 lg:py-24 px-5 sm:px-8 lg:px-20 text-center">
          <p className="font-display text-[1.6rem] sm:text-3xl lg:text-4xl leading-[1.25] text-brown/80 max-w-2xl mx-auto italic">
            {ABOUT_PAGE.quote.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </section>

        <section className="border-t border-brown/8 py-14 lg:py-20 px-5 sm:px-8 lg:px-20 text-center">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-5">
            {ABOUT_PAGE.promise.eyebrow}
          </span>
          <h2 className="font-display text-[2rem] sm:text-4xl lg:text-5xl leading-[1.1]">
            {ABOUT_PAGE.promise.heading}
          </h2>
          <p className="text-brown/65 max-w-xl mx-auto mt-5 text-sm lg:text-base leading-relaxed">
            {ABOUT_PAGE.promise.body}
          </p>
        </section>
      </div>

      <section className="bg-brown text-ivory py-24 lg:py-36 px-5 sm:px-8 lg:px-10 text-center">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-5">
          {ABOUT_PAGE.cta.eyebrow}
        </span>
        <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
          Ready for Your <span className="italic">Stay?</span>
        </h2>
        <p className="text-ivory/60 max-w-md mx-auto mt-5 lg:mt-7 text-sm lg:text-base">
          {ABOUT_PAGE.cta.body}
        </p>
        <div className="mt-10 lg:mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={bookingHref()}
            className="bg-gold text-brown px-10 py-4 eyebrow hover:bg-ivory transition-colors w-full sm:w-auto max-w-xs text-center"
          >
            {ABOUT_PAGE.cta.primaryBtn}
          </Link>
          <Link
            href="/rooms"
            className="border border-ivory/40 text-ivory px-10 py-4 eyebrow hover:border-gold hover:text-gold transition-colors w-full sm:w-auto max-w-xs text-center"
          >
            {ABOUT_PAGE.cta.secondaryBtn}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
