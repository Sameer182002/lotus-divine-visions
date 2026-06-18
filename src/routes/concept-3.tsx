import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo, LotusMark } from "@/components/BrandLogo";
import hero from "@/assets/hero-modern.jpg";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import spa from "@/assets/spa.jpg";
import lobby from "@/assets/lobby.jpg";
import dining from "@/assets/dining.jpg";
import pool from "@/assets/pool.jpg";

export const Route = createFileRoute("/concept-3")({
  head: () => ({
    meta: [
      { title: "Concept 3 — Modern Hospitality · Lotus Divine" },
      { name: "description", content: "Modern, conversion-focused homepage concept for Lotus Divine Luxury Hotel." },
    ],
  }),
  component: Concept3,
});

const rooms = [
  { name: "Ocean Deluxe", desc: "King bed · 52 m² · Ocean balcony", price: 480, rating: 4.9, reviews: 312, img: hero, badge: "Most Booked" },
  { name: "Garden Villa", desc: "King bed · 78 m² · Private plunge pool", price: 720, rating: 4.95, reviews: 198, img: room2, badge: "Top Rated" },
  { name: "Sky Penthouse", desc: "King bed · 140 m² · Panoramic terrace", price: 1480, rating: 5.0, reviews: 84, img: room3, badge: "Signature" },
];

const amenities = [
  { label: "Wellness", desc: "Holistic spa & hammam" },
  { label: "Hospitality", desc: "24/7 personal concierge" },
  { label: "Luxury", desc: "Helipad & chauffeur fleet" },
  { label: "Comfort", desc: "Smart climate rooms" },
  { label: "Serenity", desc: "Soundproofed suites" },
];

const stats = [
  { v: "4.96", l: "Guest rating" },
  { v: "1,400+", l: "Five-star reviews" },
  { v: "98%", l: "Would return" },
  { v: "12", l: "Awards 2025" },
];

function Concept3() {
  return (
    <main className="bg-ivory text-brown">
      <ConceptBar />

      {/* Sticky header + booking widget */}
      <header className="sticky top-9 z-40 bg-ivory/95 backdrop-blur border-b border-brown/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-6">
          <BrandLogo align="left" size="sm" />
          <nav className="hidden lg:flex gap-7">
            {["Rooms", "Amenities", "Gallery", "Location"].map((l) => (
              <a key={l} href="#" className="eyebrow text-brown hover:text-gold transition-colors">{l}</a>
            ))}
          </nav>
          <button className="bg-gold text-brown px-6 py-2.5 eyebrow rounded-full hover:bg-brown hover:text-ivory transition-colors">
            Book Now
          </button>
        </div>
      </header>

      {/* Split hero */}
      <section className="grid lg:grid-cols-12 min-h-[88vh]">
        <div className="lg:col-span-7 flex items-center px-8 lg:px-20 py-20 relative">
          <div className="max-w-xl animate-fade-up">
            <span className="eyebrow text-gold">★ 4.96 · Rated Best in 2025</span>
            <h1 className="font-display text-5xl md:text-7xl mt-6 leading-[1.05] text-balance">
              Modern luxury,<br /><span className="italic">effortlessly</span> booked.
            </h1>
            <p className="text-taupe mt-8 leading-relaxed max-w-md">
              The full Lotus Divine experience — refined service, signature suites, the quiet of a private estate — reserved in under sixty seconds.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <button className="bg-brown text-ivory px-9 py-4 eyebrow rounded-full hover:bg-gold hover:text-brown transition-colors">
                Check Availability
              </button>
              <button className="border border-brown/20 px-9 py-4 eyebrow rounded-full hover:border-gold hover:text-gold transition-colors">
                Watch Tour ▸
              </button>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-6 mt-14 pt-10 border-t border-brown/10">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl text-brown">{s.v}</div>
                  <div className="eyebrow text-taupe mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 relative bg-champagne min-h-[400px]">
          <img src={hero} alt="Lotus Divine suite" className="absolute inset-0 w-full h-full object-cover" />
          {/* Floating booking widget */}
          <div className="absolute bottom-8 left-8 right-8 lg:-left-24 lg:right-8 bg-ivory rounded-2xl shadow-gold p-6 ring-1 ring-brown/5">
            <div className="eyebrow text-gold mb-4">Reserve Your Stay</div>
            <div className="grid grid-cols-3 gap-3">
              <BookField label="Check In" value="Jun 22" />
              <BookField label="Check Out" value="Jun 26" />
              <BookField label="Guests" value="2 · 1 Rm" />
            </div>
            <button className="w-full mt-4 bg-gold text-brown py-3.5 eyebrow rounded-xl hover:bg-brown hover:text-ivory transition-colors">
              Search Availability
            </button>
            <div className="flex items-center justify-between mt-4 text-[10px] text-taupe">
              <span>✓ Free cancellation</span>
              <span>✓ Best rate guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-28 px-6 lg:px-20 grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <img src={lobby} alt="Lobby" className="aspect-[3/4] w-full object-cover rounded-2xl" loading="lazy" />
          <img src={spa} alt="Spa" className="aspect-[3/4] w-full object-cover rounded-2xl mt-12" loading="lazy" />
        </div>
        <div>
          <span className="eyebrow text-gold">About Lotus Divine</span>
          <h2 className="font-display text-4xl lg:text-5xl mt-6 leading-tight">
            A century-old estate.<br />A modern way to stay.
          </h2>
          <p className="text-taupe mt-8 leading-relaxed">
            36 suites, two infinity pools, a Michelin-starred kitchen and a spa that's been ranked among the world's ten best four years running — all bookable in real time, with the personal touch you'd expect from a place a hundred years in the making.
          </p>
          <ul className="mt-8 space-y-3">
            {["Member, Leading Hotels of the World", "Best Hotel 2025 — Condé Nast", "Carbon-neutral since 2022"].map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="text-gold">◆</span><span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rooms — cards */}
      <section className="py-24 px-6 lg:px-20 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow text-gold">Suites & Villas</span>
              <h2 className="font-display text-4xl lg:text-5xl mt-4">Choose your sanctuary.</h2>
            </div>
            <a href="#" className="eyebrow text-brown border-b border-gold pb-1 hover:text-gold transition-colors">All Rooms →</a>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {rooms.map((r) => (
              <article key={r.name} className="bg-ivory rounded-2xl ring-1 ring-brown/8 overflow-hidden group hover:-translate-y-1 hover:shadow-gold transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden bg-champagne">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-ivory eyebrow px-3 py-1.5 rounded-full text-brown">{r.badge}</span>
                  <span className="absolute top-4 right-4 bg-brown text-ivory eyebrow px-3 py-1.5 rounded-full">★ {r.rating}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{r.name}</h3>
                  <p className="text-xs text-taupe mt-2">{r.desc}</p>
                  <div className="flex items-end justify-between mt-6 pt-5 border-t border-brown/8">
                    <div>
                      <div className="font-display text-3xl text-brown">${r.price}<span className="text-sm text-taupe font-sans"> /night</span></div>
                      <div className="text-[10px] text-taupe mt-1">{r.reviews} reviews</div>
                    </div>
                    <button className="bg-brown text-ivory px-5 py-2.5 eyebrow rounded-full hover:bg-gold hover:text-brown transition-colors">
                      Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-28 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <span className="eyebrow text-gold">Amenities</span>
            <h2 className="font-display text-4xl mt-4 leading-tight">
              Every detail,<br /><span className="italic">considered.</span>
            </h2>
            <p className="text-taupe mt-6 text-sm leading-relaxed">
              From the moment of arrival to the last whispered goodbye, our five guiding pillars shape the Lotus Divine experience.
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((a) => (
              <div key={a.label} className="bg-ivory ring-1 ring-brown/8 rounded-2xl p-6 hover:ring-gold/50 transition-all">
                <LotusMark className="w-6 h-6 text-gold" />
                <h4 className="eyebrow mt-5">{a.label}</h4>
                <p className="text-xs text-taupe mt-2">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 lg:px-20 pb-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-display text-4xl">Gallery</h2>
          <a href="#" className="eyebrow text-gold">View All →</a>
        </div>
        <div className="grid grid-cols-4 gap-3 h-[500px]">
          <img src={pool} alt="" className="col-span-2 row-span-2 h-full w-full object-cover rounded-2xl" loading="lazy" />
          <img src={room1} alt="" className="h-full w-full object-cover rounded-2xl" loading="lazy" />
          <img src={dining} alt="" className="h-full w-full object-cover rounded-2xl" loading="lazy" />
          <img src={spa} alt="" className="h-full w-full object-cover rounded-2xl" loading="lazy" />
          <img src={lobby} alt="" className="h-full w-full object-cover rounded-2xl" loading="lazy" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brown text-ivory py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="eyebrow text-gold">Guest Reviews</span>
              <h2 className="font-display text-4xl text-ivory mt-4">Loved by 1,400+ guests.</h2>
            </div>
            <div className="eyebrow text-gold">★★★★★ 4.96 / 5</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "Booking took two minutes. The stay felt like two weeks of vacation in three days.", n: "Maya R.", c: "London" },
              { q: "A masterclass in restraint. The staff anticipates everything before you ask.", n: "Daniel K.", c: "Tokyo" },
              { q: "Modern, beautifully designed, and unmistakably luxurious. We will be back.", n: "Sofia A.", c: "Madrid" },
            ].map((t) => (
              <div key={t.n} className="bg-ivory/5 backdrop-blur rounded-2xl p-7 ring-1 ring-ivory/10">
                <div className="text-gold mb-4">★★★★★</div>
                <p className="font-display italic text-lg leading-snug text-ivory">"{t.q}"</p>
                <div className="mt-6 eyebrow text-ivory/60">{t.n} · {t.c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-2">
          <span className="eyebrow text-gold">Location</span>
          <h2 className="font-display text-4xl mt-4 leading-tight">Easy to reach, hard to leave.</h2>
          <div className="text-taupe mt-6 space-y-3 text-sm">
            <p>📍 128 Divine Way, Celestial Highlands</p>
            <p>✈ 35 min from CHX International</p>
            <p>🚗 Complimentary chauffeur on arrival</p>
            <p>📞 +1 (800) LOTUS-DIVINE</p>
          </div>
          <button className="mt-8 bg-brown text-ivory px-7 py-3 eyebrow rounded-full hover:bg-gold hover:text-brown transition-colors">
            Open in Maps
          </button>
        </div>
        <div className="lg:col-span-3 aspect-[16/10] bg-champagne/60 rounded-2xl relative overflow-hidden ring-1 ring-brown/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_color-mix(in_oklab,_var(--gold)_15%,_transparent),_transparent_60%)]" />
          <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full">
            <g className="text-brown/30" stroke="currentColor" fill="none" strokeWidth="0.8">
              {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} />)}
              {[80, 160, 240, 320].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="250" />)}
            </g>
            <path d="M40 200 Q160 120 240 140 T 380 80" stroke="currentColor" className="text-gold" fill="none" strokeWidth="2" />
            <circle cx="200" cy="130" r="10" className="fill-gold" />
            <circle cx="200" cy="130" r="24" className="fill-gold/20" />
          </svg>
          <span className="absolute bottom-4 left-4 bg-ivory eyebrow px-3 py-1.5 rounded-full">Lotus Divine</span>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-6 lg:px-20 pb-24">
        <div className="max-w-7xl mx-auto bg-brown text-ivory rounded-3xl p-12 lg:p-20 grid lg:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <LotusMark className="absolute -bottom-10 -right-10 w-80 h-80 text-gold/10" />
          <div className="relative">
            <span className="eyebrow text-gold">Ready when you are.</span>
            <h2 className="font-display text-4xl md:text-5xl mt-5 leading-tight">Book directly. Save 12% & arrive to champagne.</h2>
            <p className="text-ivory/60 mt-5 max-w-md">Best-rate guarantee, free cancellation up to 48 hours, and a personal welcome from our concierge.</p>
          </div>
          <div className="relative bg-ivory text-brown rounded-2xl p-6 ring-1 ring-gold/20">
            <div className="grid grid-cols-2 gap-3">
              <BookField label="Check In" value="Jun 22, 2026" />
              <BookField label="Check Out" value="Jun 26, 2026" />
              <BookField label="Adults" value="2" />
              <BookField label="Rooms" value="1" />
            </div>
            <button className="w-full mt-5 bg-gold text-brown py-4 eyebrow rounded-xl hover:bg-brown hover:text-ivory transition-colors">
              Search Availability
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BookField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-brown/10 rounded-xl px-4 py-3 hover:border-gold transition-colors cursor-pointer">
      <div className="eyebrow text-taupe text-[9px]">{label}</div>
      <div className="font-display text-base mt-1">{value}</div>
    </div>
  );
}

function ConceptBar() {
  return (
    <div className="bg-brown text-ivory py-3 flex items-center justify-between px-6 sticky top-0 z-50">
      <Link to="/" className="eyebrow text-ivory/70 hover:text-gold">← All Concepts</Link>
      <span className="eyebrow text-gold">Concept 03 · Modern Hospitality</span>
      <div className="hidden md:flex gap-4">
        <Link to="/concept-1" className="eyebrow text-ivory/50 hover:text-gold">01</Link>
        <Link to="/concept-2" className="eyebrow text-ivory/50 hover:text-gold">02</Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-ivory border-t border-brown/10 pt-16 pb-8 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <BrandLogo align="left" />
          <p className="text-xs text-taupe mt-6 leading-relaxed max-w-sm">
            Modern luxury hospitality, rooted in a century of craft. Book direct for the best rate, every time.
          </p>
          <div className="flex gap-3 mt-6">
            {["IG", "FB", "IN", "PI"].map((s) => (
              <a key={s} href="#" className="size-9 grid place-items-center rounded-full border border-brown/15 eyebrow hover:border-gold hover:text-gold transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <FooterCol title="Stay" links={["Rooms", "Suites", "Villas", "Offers"]} />
        <FooterCol title="Experience" links={["Spa", "Dining", "Pools", "Activities"]} />
        <FooterCol title="Help" links={["Contact", "FAQ", "Cancellation", "Press"]} />
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-brown/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="eyebrow text-taupe">© 2026 Lotus Divine Luxury Hotel</span>
        <span className="eyebrow text-taupe">Best Rate Guarantee · Free Cancellation</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="eyebrow text-brown mb-5">{title}</h4>
      <ul className="space-y-3 text-xs text-taupe">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
