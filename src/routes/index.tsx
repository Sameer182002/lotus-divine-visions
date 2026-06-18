import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo, LotusMark } from "@/components/BrandLogo";
import heroLuxury from "@/assets/hero-luxury.jpg";
import heroSerenity from "@/assets/hero-serenity.jpg";
import heroModern from "@/assets/hero-modern.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lotus Divine — Three Homepage Concepts" },
      { name: "description", content: "Three premium homepage design concepts for Lotus Divine Luxury Hotel: Premium Luxury, Divine Serenity, and Modern Hospitality." },
    ],
  }),
  component: Index,
});

const concepts = [
  {
    id: 1,
    slug: "/concept-1",
    name: "Premium Luxury",
    tagline: "Editorial. Cinematic. Aspirational.",
    blurb: "A high-end hospitality narrative in the spirit of Aman, Oberoi and Four Seasons. Full-bleed photography, oversized serif headlines, hushed restraint.",
    image: heroLuxury,
    tone: "Deep brown · gold leaf",
  },
  {
    id: 2,
    slug: "/concept-2",
    name: "Divine Serenity",
    tagline: "Calm. Soft. Sanctuary-led.",
    blurb: "Soft luxury rooted in the lotus motif — champagne and ivory dominant, breathing room everywhere, a quiet pull toward stillness and the spa ritual.",
    image: heroSerenity,
    tone: "Champagne · ivory",
  },
  {
    id: 3,
    slug: "/concept-3",
    name: "Modern Hospitality",
    tagline: "Confident. Modern. Booking-first.",
    blurb: "A contemporary, conversion-focused homepage with a persistent booking widget, clean room cards, and the modern hotel tech feel — still unmistakably Lotus Divine.",
    image: heroModern,
    tone: "Ivory · taupe · gold",
  },
];

function Index() {
  return (
    <main className="min-h-screen bg-ivory text-brown">
      {/* Top bar */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-brown/10">
        <BrandLogo align="left" size="md" />
        <div className="hidden md:flex items-center gap-3 text-gold">
          <LotusMark className="w-4 h-4" />
          <span className="eyebrow text-taupe">Brand Concept Review · 2026</span>
        </div>
      </header>

      {/* Intro */}
      <section className="px-6 lg:px-12 pt-24 pb-16 max-w-5xl mx-auto text-center">
        <span className="eyebrow text-gold">Client Presentation</span>
        <h1 className="font-display text-5xl md:text-7xl mt-6 leading-[1.05] text-balance">
          Three directions for the <span className="italic">Lotus Divine</span> homepage.
        </h1>
        <p className="mt-8 text-taupe max-w-2xl mx-auto text-pretty leading-relaxed">
          Each concept is a complete, production-ready homepage built strictly to the Lotus Divine brand guidelines.
          Open any concept to review the full experience — from hero to footer.
        </p>
        <div className="flex justify-center mt-10">
          <div className="hairline w-32" />
        </div>
      </section>

      {/* Concept cards */}
      <section className="px-6 lg:px-12 pb-32 max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {concepts.map((c) => (
          <Link
            key={c.id}
            to={c.slug}
            className="group flex flex-col bg-white ring-1 ring-brown/10 overflow-hidden hover:ring-gold/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-gold"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-champagne">
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur px-3 py-1.5 eyebrow text-brown">
                Concept 0{c.id}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="font-display text-3xl text-brown">{c.name}</h3>
              <p className="eyebrow text-gold mt-3">{c.tagline}</p>
              <p className="mt-5 text-sm text-taupe leading-relaxed flex-1">{c.blurb}</p>
              <div className="mt-8 flex items-center justify-between border-t border-brown/10 pt-5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-taupe">{c.tone}</span>
                <span className="eyebrow text-gold group-hover:translate-x-1 transition-transform">
                  View Concept →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="border-t border-brown/10 py-10 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <BrandLogo align="left" size="sm" showTagline={false} />
        <span className="eyebrow text-taupe">© 2026 Lotus Divine · Concept Presentation</span>
      </footer>
    </main>
  );
}
