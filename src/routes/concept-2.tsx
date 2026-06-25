import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo, LotusMark } from "@/components/BrandLogo";
import { BookingExperience } from "@/components/BookingWidget";
import hero from "@/assets/hero-serenity.jpg";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import spa from "@/assets/spa.jpg";
import lobby from "@/assets/lobby.jpg";
import dining from "@/assets/dining.jpg";
import pool from "@/assets/pool.jpg";

export const Route = createFileRoute("/concept-2")({
  head: () => ({
    meta: [
      { title: "Concept 2 — Divine Serenity · Lotus Divine" },
      { name: "description", content: "Soft luxury, sanctuary-led homepage concept for Lotus Divine Luxury Hotel." },
    ],
  }),
  component: Concept2,
});

const rituals = [
  { name: "The Lotus Suite", desc: "Misty valley views and a private meditation terrace.", price: "$1,200", img: room1 },
  { name: "Celestial Villa", desc: "Infinity lotus pond and dedicated butler service.", price: "$2,850", img: room2 },
  { name: "Divine Sanctuary", desc: "Sound-shielded walls and a candle-lit reading nook.", price: "$1,900", img: room3 },
];

const pillars = [
  { label: "Wellness", desc: "Holistic Spa" },
  { label: "Serenity", desc: "Zen Gardens" },
  { label: "Hospitality", desc: "Heart-led service" },
  { label: "Comfort", desc: "Mindful living" },
  { label: "Luxury", desc: "Quiet detail" },
];

function Concept2() {
  return (
    <main className="bg-ivory text-brown">
      <ConceptBar />

      {/* Soft centered header */}
      <header className="sticky top-9 z-40 bg-ivory/85 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 items-center">
          <nav className="hidden lg:flex gap-8">
            {["Rituals", "Suites", "Spa"].map((l) => (
              <a key={l} href="#" className="eyebrow text-brown hover:text-gold transition-colors">{l}</a>
            ))}
          </nav>
          <div className="col-start-2 flex justify-center">
            <BrandLogo size="md" />
          </div>
          <div className="flex items-center justify-end gap-6">
            <a href="#" className="eyebrow hidden lg:inline hover:text-gold transition-colors">Journal</a>
            <button className="bg-gold text-brown px-6 py-2.5 eyebrow hover:bg-brown hover:text-ivory transition-colors">
              Reserve
            </button>
          </div>
        </div>
      </header>

      {/* Hero - centered, breathing */}
      <section className="pt-28 pb-20 px-6 text-center relative">
        <span className="eyebrow text-gold">A Sanctuary for the Soul</span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mt-8 leading-[1.05] text-balance max-w-4xl mx-auto animate-fade-up">
          Where the <span className="italic">soul</span><br />exhales.
        </h1>
        <p className="text-taupe mt-10 max-w-xl mx-auto leading-relaxed">
          A retreat inspired by the eternal lotus — a place to slow your breath, soften your shoulders, and remember the rhythm beneath the noise.
        </p>
        <div className="mt-12 max-w-5xl mx-auto px-2">
          <BookingExperience variant="serenity" stickyTop="6rem" />
        </div>

        <div className="mt-20 max-w-6xl mx-auto px-6">
          <div className="relative">
            <img src={hero} alt="Lotus at dawn" className="w-full aspect-[21/9] object-cover rounded-t-[40%] rounded-b-3xl shadow-gold" loading="lazy" />
            <LotusMark className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 text-gold bg-ivory rounded-full p-2 ring-1 ring-gold/30" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-champagne/40 py-32 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src={spa} alt="Spa ritual" className="w-full aspect-[4/5] object-cover rounded-tr-[40%] rounded-bl-[40%]" loading="lazy" />
            <div className="absolute -bottom-10 -right-6 lg:-right-10 size-44 grid place-items-center bg-ivory ring-1 ring-gold/20 rounded-full">
              <div className="text-center">
                <div className="font-display italic text-5xl text-gold">100</div>
                <div className="eyebrow text-taupe mt-1">Years of calm</div>
              </div>
            </div>
          </div>
          <div>
            <span className="eyebrow text-gold">Our Philosophy</span>
            <h2 className="font-display text-4xl lg:text-5xl mt-6 leading-tight">
              Authentic hospitality,<br />deeply <span className="italic">rooted.</span>
            </h2>
            <div className="space-y-6 text-taupe leading-relaxed mt-8 max-w-md">
              <p>
                Founded on the principle of the lotus — rising from the depths to bloom in pure light — Lotus Divine is more than a hotel. It is a curated environment designed to restore your natural rhythm.
              </p>
              <p>
                Every textile, every scent, every silence has been considered. Stay long enough and you will hear it: the quiet hum of a place at peace with itself.
              </p>
            </div>
            <a href="#" className="inline-block mt-10 eyebrow text-brown border-b border-gold pb-2">Read More →</a>
          </div>
        </div>
      </section>

      {/* Rooms — soft cards */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="eyebrow text-gold">Sanctuaries of Rest</span>
          <h2 className="font-display text-4xl lg:text-5xl mt-6">Three places to land.</h2>
          <div className="hairline w-24 mx-auto mt-6" />
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {rituals.map((r) => (
            <article key={r.name} className="group">
              <div className="overflow-hidden rounded-t-[40%] rounded-b-3xl bg-champagne mb-8">
                <img src={r.img} alt={r.name} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-[1500ms]" loading="lazy" />
              </div>
              <div className="px-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{r.name}</h3>
                  <span className="eyebrow text-gold">{r.price}/night</span>
                </div>
                <p className="text-taupe text-sm mt-3 leading-relaxed">{r.desc}</p>
                <a href="#" className="inline-block mt-5 eyebrow text-brown border-b border-gold pb-1">Discover →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-brown text-ivory py-28 px-6 relative overflow-hidden">
        <LotusMark className="absolute -top-20 -right-20 w-96 h-96 text-gold/5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <span className="eyebrow text-gold">Five Promises</span>
            <h2 className="font-display text-4xl lg:text-5xl mt-6 text-ivory">Crafted with care.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-4">
            {pillars.map((p) => (
              <div key={p.label} className="flex flex-col items-center text-center">
                <div className="size-16 rounded-full border border-gold/40 grid place-items-center mb-5 text-gold">
                  <LotusMark className="w-6 h-6" />
                </div>
                <h4 className="eyebrow text-champagne">{p.label}</h4>
                <p className="text-xs text-ivory/50 mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-28 px-6 max-w-[1500px] mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow text-gold">Moments</span>
          <h2 className="font-display text-4xl mt-4">A quiet album.</h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <img src={pool} alt="Pool" className="col-span-12 lg:col-span-8 aspect-[2/1] w-full object-cover rounded-3xl" loading="lazy" />
          <img src={lobby} alt="Lobby" className="col-span-6 lg:col-span-4 aspect-square w-full object-cover rounded-3xl" loading="lazy" />
          <img src={dining} alt="Dining" className="col-span-6 lg:col-span-4 aspect-square w-full object-cover rounded-3xl" loading="lazy" />
          <img src={spa} alt="Spa" className="col-span-12 lg:col-span-8 aspect-[2/1] w-full object-cover rounded-3xl" loading="lazy" />
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-28 px-6 bg-champagne/40 text-center">
        <span className="eyebrow text-gold">The Guest Experience</span>
        <blockquote className="font-display text-3xl md:text-5xl italic max-w-3xl mx-auto mt-10 leading-tight text-balance">
          “A profound silence that speaks to the heart. I haven't felt this level of centered tranquility in years.”
        </blockquote>
        <cite className="not-italic eyebrow text-taupe mt-8 block">— Julianne Vance, Wellness Advocate</cite>
      </section>

      {/* Location */}
      <section className="py-28 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="eyebrow text-gold">Find Us</span>
          <h2 className="font-display text-4xl lg:text-5xl mt-6 leading-tight">
            A garden between<br /><span className="italic">earth and sky.</span>
          </h2>
          <div className="text-taupe mt-8 space-y-3 leading-relaxed">
            <p>128 Divine Way · Celestial Highlands</p>
            <p>+1 (800) LOTUS-DIVINE</p>
            <p>concierge@lotusdivine.com</p>
          </div>
          <a href="#" className="inline-block mt-8 eyebrow text-brown border-b border-gold pb-2">Get Directions →</a>
        </div>
        <div className="aspect-[5/4] bg-champagne/60 rounded-[40px] relative overflow-hidden ring-1 ring-gold/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,_color-mix(in_oklab,_var(--gold)_15%,_transparent),_transparent_60%)]" />
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
            <path d="M20 240 Q120 200 200 220 T 380 180" stroke="currentColor" className="text-gold" fill="none" strokeWidth="1.2" />
            <circle cx="220" cy="150" r="8" className="fill-gold" />
            <circle cx="220" cy="150" r="20" className="fill-gold/20" />
            <circle cx="220" cy="150" r="40" className="fill-gold/10" />
          </svg>
          <LotusMark className="absolute top-6 left-6 w-7 h-7 text-gold" />
          <span className="absolute bottom-6 left-6 eyebrow text-brown bg-ivory/80 px-3 py-1.5 rounded-full">Lotus Divine Estate</span>
        </div>
      </section>

      {/* Booking band */}
      <section className="bg-brown text-ivory py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="eyebrow text-gold">Begin Your Journey</span>
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-tight text-balance">
            Your <span className="italic">stillness</span> is reserved.
          </h2>
          <div className="mt-12 inline-flex flex-wrap items-end justify-center gap-6 bg-ivory/5 p-6 rounded-full ring-1 ring-gold/20">
            <Field label="Check In" value="12 Oct 2026" />
            <Field label="Check Out" value="18 Oct 2026" />
            <Field label="Guests" value="2 Adults" />
            <button className="bg-gold text-brown px-8 py-3 rounded-full eyebrow hover:bg-ivory transition-colors">Search</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left px-4 border-r border-ivory/10 last:border-0">
      <div className="eyebrow text-gold/70">{label}</div>
      <div className="font-display text-lg text-ivory mt-1">{value}</div>
    </div>
  );
}

function ConceptBar() {
  return (
    <div className="bg-brown text-ivory py-3 flex items-center justify-between px-6 sticky top-0 z-50">
      <Link to="/" className="eyebrow text-ivory/70 hover:text-gold">← All Concepts</Link>
      <span className="eyebrow text-gold">Concept 02 · Divine Serenity</span>
      <div className="hidden md:flex gap-4">
        <Link to="/concept-1" className="eyebrow text-ivory/50 hover:text-gold">01</Link>
        <Link to="/concept-3" className="eyebrow text-ivory/50 hover:text-gold">03</Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-ivory text-brown border-t border-gold/15 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <BrandLogo align="left" />
          <p className="text-xs text-taupe mt-6 leading-relaxed max-w-xs">
            A sanctuary of authentic hospitality and uncompromised luxury for the modern seeker.
          </p>
        </div>
        <FooterCol title="Experience" links={["The Rituals", "The Suites", "Gastronomy", "Garden Walks"]} />
        <FooterCol title="Connect" links={["Concierge", "Press", "Careers", "Newsletter"]} />
        <div>
          <h4 className="eyebrow text-gold mb-5">Whispers</h4>
          <p className="text-xs text-taupe mb-4">Seasonal letters from the estate.</p>
          <div className="flex items-center border-b border-gold/40 py-2">
            <input type="email" placeholder="Your email" className="bg-transparent flex-1 text-xs outline-none" />
            <button className="text-gold">→</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brown/10 flex flex-col md:flex-row justify-between gap-4 items-center">
        <span className="eyebrow text-taupe">© 2026 Lotus Divine Luxury Hotel</span>
        <div className="flex gap-6 eyebrow text-taupe">
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
      <h4 className="eyebrow text-gold mb-5">{title}</h4>
      <ul className="space-y-3 text-xs text-taupe">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
