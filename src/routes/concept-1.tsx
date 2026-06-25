import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo, LotusMark } from "@/components/BrandLogo";
import { BookingExperience } from "@/components/BookingWidget";
import hero from "@/assets/hero-luxury.jpg";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import lobby from "@/assets/lobby.jpg";
import spa from "@/assets/spa.jpg";
import dining from "@/assets/dining.jpg";
import pool from "@/assets/pool.jpg";

export const Route = createFileRoute("/concept-1")({
  head: () => ({
    meta: [
      { title: "Concept 1 — Premium Luxury · Lotus Divine" },
      { name: "description", content: "Editorial, cinematic homepage concept for Lotus Divine Luxury Hotel — in the spirit of Aman, Oberoi and Four Seasons." },
    ],
  }),
  component: Concept1,
});

const nav = ["The Estate", "Suites", "Wellness", "Dining", "Journal"];
const rooms = [
  { name: "The Lotus Sanctuary", desc: "Private plunge pool and meditation terrace overlooking the gardens.", price: "From $1,200", img: room1 },
  { name: "Imperial Vista Suite", desc: "Panoramic ocean views with floor-to-ceiling silk-draped windows.", price: "From $1,850", img: room2 },
  { name: "Celestial Penthouse", desc: "The estate's crown — private butler, terrace and gold-leaf detailing.", price: "From $3,400", img: room3 },
];
const amenities = [
  { label: "Wellness", desc: "Holistic spa rituals & private hammam." },
  { label: "Hospitality", desc: "24-hour personal butler service." },
  { label: "Luxury", desc: "Helipad arrival & chauffeur fleet." },
  { label: "Comfort", desc: "Climate-tuned bedchambers." },
  { label: "Serenity", desc: "Acoustically shielded suites." },
];

function Concept1() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <ConceptBar />

      {/* Desktop nav — unchanged */}
      <nav className="hidden lg:flex absolute top-10 left-0 right-0 z-40 px-10 items-center justify-between text-ivory">
        <div className="flex gap-8">
          {nav.slice(0, 3).map((l) => (
            <a key={l} href="#" className="eyebrow hover:text-gold transition-colors">{l}</a>
          ))}
        </div>
        <BrandLogo tone="ivory" size="md" />
        <div className="flex items-center gap-8">
          <a href="#" className="eyebrow hover:text-gold transition-colors">Reservations</a>
          <button className="border border-gold/60 text-gold px-7 py-3 eyebrow hover:bg-gold hover:text-brown transition-all">
            Book Your Stay
          </button>
        </div>
      </nav>

      {/* Mobile / tablet nav */}
      <MobileNav />

      {/* Hero */}
      <section className="relative min-h-[640px] md:min-h-[720px] h-[100svh] lg:h-screen lg:min-h-[720px] flex items-end overflow-hidden bg-brown">
        <img
          src={hero}
          alt="Lotus Divine at golden hour"
          className="absolute inset-0 w-full h-full object-cover opacity-80 animate-kenburns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/55 lg:via-brown/40 to-brown/40 lg:to-brown/30" />
        <div className="relative z-10 px-5 sm:px-8 lg:px-20 pb-10 lg:pb-24 pt-28 lg:pt-0 max-w-6xl w-full animate-fade-up">
          <span className="eyebrow text-gold block mb-5 lg:mb-8 text-[10px] lg:text-[11px]">An Estate Reborn · Est. 1924</span>
          <h1 className="font-display text-ivory text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[9rem] leading-[0.95] lg:leading-[0.92] text-balance">
            The Art of <br /><span className="italic">Hushed</span> Luxury.
          </h1>
          <p className="text-ivory/75 max-w-md mt-5 lg:mt-10 leading-relaxed text-sm lg:text-base">
            A century of uncompromised hospitality, distilled into thirty-six private sanctuaries between the mountains and the sea.
          </p>
          <BookingExperience variant="luxury" />
        </div>
        <div className="absolute bottom-10 right-10 z-10 text-ivory/60 eyebrow hidden lg:flex items-center gap-3">
          <span>Scroll</span>
          <div className="w-12 h-px bg-gold" />
        </div>
      </section>

      {/* About — editorial split */}
      <section className="py-16 lg:py-32 px-5 sm:px-8 lg:px-20 grid grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="col-span-12 lg:col-span-5">
          <img src={lobby} alt="Marble lobby" className="w-full aspect-[4/5] object-cover" loading="lazy" />
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px]">01 — Timeless Elegance</span>
          <h2 className="font-display text-[2rem] sm:text-4xl lg:text-6xl mt-4 lg:mt-6 leading-[1.1] lg:leading-[1.05] text-balance">
            A sanctuary carved from the light of the morning sun.
          </h2>
          <div className="hairline w-16 lg:w-24 my-6 lg:my-8" />
          <p className="text-taupe leading-relaxed max-w-lg mb-5 text-[15px] lg:text-base">
            Every corner of Lotus Divine is a dialogue between heritage and modernity. Our story began in 1924, when a single colonnaded villa above the bay first opened its doors to travellers seeking silence and ceremony.
          </p>
          <p className="text-taupe leading-relaxed max-w-lg text-[15px] lg:text-base">
            A century on, we remain quietly devoted to the same craft — the curation of moments that linger long after departure.
          </p>
          <a href="#" className="inline-block mt-8 lg:mt-10 eyebrow text-brown border-b border-gold pb-2 hover:text-gold transition-colors">
            Our Story →
          </a>
        </div>
      </section>

      {/* Rooms */}
      <section className="bg-brown text-ivory py-20 lg:py-32 px-5 sm:px-8 lg:px-20">
        <div className="flex flex-wrap items-end justify-between gap-4 lg:gap-6 mb-10 lg:mb-20">
          <div>
            <span className="eyebrow text-gold block mb-3 lg:mb-4 text-[10px] lg:text-[11px]">02 — The Private Collection</span>
            <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">
              Thirty-six<br /><span className="italic">sanctuaries.</span>
            </h2>
          </div>
          <a href="#" className="eyebrow text-gold border-b border-gold pb-2">View All →</a>
        </div>

        {/* Mobile: horizontal snap carousel for a premium native feel */}
        <div className="lg:hidden -mx-5 sm:-mx-8 px-5 sm:px-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {rooms.map((r) => (
            <article key={r.name} className="snap-start shrink-0 w-[78%] sm:w-[55%]">
              <div className="overflow-hidden mb-5">
                <img src={r.img} alt={r.name} className="w-full aspect-[4/5] object-cover" loading="lazy" />
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl text-ivory truncate">{r.name}</h3>
                <span className="eyebrow text-gold text-[10px] shrink-0">{r.price}</span>
              </div>
              <p className="text-taupe text-sm mt-3 leading-relaxed">{r.desc}</p>
              <div className="hairline w-full mt-5 opacity-30" />
            </article>
          ))}
        </div>

        {/* Desktop grid — unchanged */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {rooms.map((r, i) => (
            <article key={r.name} className={`group ${i === 1 ? "mt-16" : ""}`}>
              <div className="overflow-hidden mb-6">
                <img src={r.img} alt={r.name} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out" loading="lazy" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl text-ivory">{r.name}</h3>
                <span className="eyebrow text-gold">{r.price}</span>
              </div>
              <p className="text-taupe text-sm mt-3 leading-relaxed">{r.desc}</p>
              <div className="hairline w-full mt-6 opacity-30" />
            </article>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-20">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-20">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px]">03 — The Experience</span>
          <h2 className="font-display text-[2.25rem] sm:text-4xl lg:text-5xl mt-4 lg:mt-6 text-balance leading-tight">Five quiet promises.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-y border-gold/20 sm:divide-x lg:divide-x divide-gold/10 divide-y sm:divide-y-0 lg:divide-y-0">
          {amenities.map((a) => (
            <div key={a.label} className="p-8 lg:p-10 text-center">
              <LotusMark className="w-7 h-7 mx-auto text-gold" />
              <h4 className="eyebrow mt-5 lg:mt-6 text-brown">{a.label}</h4>
              <p className="text-taupe text-sm mt-3 lg:mt-4 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="grid grid-cols-12 gap-1.5 lg:gap-2 px-1.5 lg:px-2">
        <img src={pool} alt="Infinity pool" className="col-span-12 lg:col-span-8 h-[260px] sm:h-[360px] lg:h-[480px] w-full object-cover" loading="lazy" />
        <img src={spa} alt="Spa" className="col-span-6 lg:col-span-4 h-[200px] sm:h-[280px] lg:h-[480px] w-full object-cover" loading="lazy" />
        <img src={dining} alt="Fine dining" className="col-span-6 lg:col-span-4 h-[200px] sm:h-[280px] lg:h-[480px] w-full object-cover" loading="lazy" />
        <img src={room2} alt="Garden villa" className="col-span-12 lg:col-span-8 h-[260px] sm:h-[360px] lg:h-[480px] w-full object-cover" loading="lazy" />
      </section>

      {/* Testimonial */}
      <section className="py-20 lg:py-32 px-6 sm:px-10 lg:px-20 max-w-5xl mx-auto text-center">
        <LotusMark className="w-7 h-7 lg:w-8 lg:h-8 mx-auto text-gold mb-8 lg:mb-10" />
        <blockquote className="font-display text-2xl sm:text-3xl md:text-5xl italic leading-tight text-brown text-balance">
          “A masterclass in restraint. The staff anticipate your needs before you have even thought them.”
        </blockquote>
        <div className="hairline w-16 mx-auto my-8 lg:my-10" />
        <cite className="eyebrow text-taupe not-italic text-[10px] lg:text-[11px]">Condé Nast Traveler — Gold List, 2025</cite>
      </section>

      {/* Location */}
      <section className="bg-champagne/40 py-20 lg:py-32 px-5 sm:px-8 lg:px-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="eyebrow text-gold text-[10px] lg:text-[11px]">04 — Location</span>
          <h2 className="font-display text-[2rem] sm:text-4xl lg:text-5xl mt-4 lg:mt-6 leading-tight">
            Between the mountains <br />and the sea.
          </h2>
          <div className="hairline w-16 my-6 lg:my-8" />
          <div className="space-y-3 lg:space-y-4 text-taupe text-[15px] lg:text-base">
            <p>128 Divine Way, Celestial Highlands</p>
            <p>Reservations · +1 (800) LOTUS-DIVINE</p>
            <p>reservations@lotusdivine.com</p>
          </div>
          <a href="#" className="inline-block mt-7 lg:mt-8 eyebrow text-brown border-b border-gold pb-2">Plan Your Arrival →</a>
        </div>
        <div className="aspect-[4/3] bg-brown/5 ring-1 ring-brown/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_color-mix(in_oklab,_var(--gold)_20%,_transparent),_transparent_60%),_radial-gradient(circle_at_70%_70%,_color-mix(in_oklab,_var(--brown)_15%,_transparent),_transparent_50%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300">
            <path d="M0 200 Q 80 160 160 180 T 320 140 T 400 100" stroke="currentColor" fill="none" className="text-gold" strokeWidth="1" />
            <path d="M50 250 L 80 200 L 150 220 L 220 180 L 300 200 L 380 160" stroke="currentColor" fill="none" className="text-brown/40" strokeWidth="1" />
            <circle cx="200" cy="150" r="6" className="fill-gold" />
            <circle cx="200" cy="150" r="14" className="fill-gold/20" />
          </svg>
          <span className="absolute bottom-5 left-5 lg:bottom-6 lg:left-6 eyebrow text-brown bg-ivory/80 px-3 py-1.5">Celestial Highlands</span>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-brown text-ivory py-20 lg:py-32 px-5 sm:px-8 lg:px-10 text-center">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px]">Your Stay Awaits</span>
        <h2 className="font-display text-[2.25rem] sm:text-5xl md:text-7xl mt-4 lg:mt-6 leading-[1.05] lg:leading-tight text-balance">
          Begin a <span className="italic">quieter</span> chapter.
        </h2>
        <p className="text-ivory/60 max-w-xl mx-auto mt-6 lg:mt-8 text-sm lg:text-base">
          Limited seasonal availability. Direct reservations receive a personal welcome from our concierge.
        </p>
        <button className="mt-10 lg:mt-12 bg-gold text-brown px-10 sm:px-14 py-4 lg:py-5 eyebrow hover:bg-ivory transition-colors w-full sm:w-auto max-w-sm">
          Check Availability
        </button>
      </section>

      <Footer />

      {/* Bottom spacer so sticky mobile booking bar never overlaps footer end */}
      <div className="h-20 md:hidden" aria-hidden />
    </main>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`lg:hidden fixed left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-brown/92 backdrop-blur-xl border-b border-gold/20 py-3"
            : "bg-transparent py-5"
        }`}
        style={{ top: "2.25rem" /* below ConceptBar */ }}
      >
        <div className="flex items-center justify-between px-5 sm:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="w-10 h-10 -ml-2 flex flex-col items-center justify-center gap-1.5 text-ivory"
          >
            <span className="block w-5 h-px bg-gold" />
            <span className="block w-5 h-px bg-ivory" />
            <span className="block w-3 h-px bg-ivory ml-2" />
          </button>
          <BrandLogo tone="ivory" size="sm" showTagline={false} />
          <a
            href="#book"
            className="eyebrow text-[10px] border border-gold/60 text-gold px-4 py-2.5 hover:bg-gold hover:text-brown transition-all"
          >
            Book
          </a>
        </div>
      </nav>

      {/* Slide-out drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-brown/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-brown text-ivory shadow-gold flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15">
            <BrandLogo tone="ivory" size="sm" />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gold text-2xl -mr-2"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 px-6 py-8 flex flex-col">
            <span className="eyebrow text-gold text-[10px] mb-6">Navigate</span>
            <ul className="space-y-1">
              {nav.map((l, i) => (
                <li
                  key={l}
                  className={`border-b border-ivory/8 transition-all duration-500 ${
                    open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <a
                    href="#"
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-5 font-display text-3xl hover:text-gold transition-colors"
                  >
                    <span>{l}</span>
                    <span className="eyebrow text-gold/50 text-[10px]">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-gold text-brown eyebrow py-4 hover:bg-ivory transition-colors"
              >
                Book Your Stay
              </button>
              <div className="mt-6 text-center space-y-1 text-ivory/60 text-xs">
                <p>+1 (800) LOTUS-DIVINE</p>
                <p>reservations@lotusdivine.com</p>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}

function ConceptBar() {
  return (
    <div className="bg-brown text-ivory py-3 flex items-center justify-between px-5 lg:px-6 sticky top-0 z-50">
      <Link to="/" className="eyebrow text-ivory/70 hover:text-gold text-[10px] lg:text-[11px]">← Concepts</Link>
      <span className="eyebrow text-gold text-[10px] lg:text-[11px] truncate">Concept 01 · Premium Luxury</span>
      <div className="hidden md:flex gap-4">
        <Link to="/concept-2" className="eyebrow text-ivory/50 hover:text-gold">02</Link>
        <Link to="/concept-3" className="eyebrow text-ivory/50 hover:text-gold">03</Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-brown text-ivory/60 py-16 lg:py-20 px-5 sm:px-8 lg:px-20 border-t border-gold/10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 max-w-7xl mx-auto">
        <div className="sm:col-span-2 md:col-span-1">
          <BrandLogo tone="ivory" align="left" />
          <p className="text-xs mt-5 lg:mt-6 leading-relaxed max-w-xs">
            An estate of uncompromised luxury. Member, The Leading Hotels of the World.
          </p>
        </div>
        <FooterCol title="The Hotel" links={["Suites", "The Spa", "Dining", "Experiences"]} />
        <FooterCol title="Information" links={["Our Story", "Sustainability", "Journal", "Careers"]} />
        <div>
          <h4 className="eyebrow text-gold mb-4 lg:mb-5">Stay in Touch</h4>
          <p className="text-xs mb-4">Quarterly letters from the estate.</p>
          <div className="flex items-center border-b border-gold/30 py-2">
            <input type="email" placeholder="Your email" className="bg-transparent flex-1 text-xs text-ivory placeholder:text-ivory/40 outline-none" />
            <button className="text-gold text-lg">→</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 lg:mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="eyebrow text-ivory/40 text-[10px] lg:text-[11px] text-center">© 2026 Lotus Divine · All rights reserved</span>
        <div className="flex gap-6 eyebrow text-ivory/40">
          <a href="#" className="hover:text-gold">Instagram</a>
          <a href="#" className="hover:text-gold">Privacy</a>
          <a href="#" className="hover:text-gold">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="eyebrow text-gold mb-4 lg:mb-5">{title}</h4>
      <ul className="space-y-3 text-xs">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
