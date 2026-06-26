import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CONTACT } from "@/data/siteContent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lotus Divine" },
      { name: "description", content: "Get in touch with Lotus Divine. We're here to help you plan your stay in Amritsar, near the Golden Temple." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="overflow-x-hidden">

      {/* Block 1 — Dark: Header → Hero → Contact Cards */}
      <div className="bg-brown text-ivory">
        <Header />
        <ContactHero />
        <ContactDetails />
      </div>

      {/* Block 2 — Light: Why Guests Choose → Visit Us */}
      <div className="bg-ivory text-brown">
        <WhyChooseUs />
        <VisitUs />
      </div>

      {/* Block 3 — Dark: Booking CTA → Footer */}
      <div className="bg-brown text-ivory">
        <BookingHelpCTA />
        <Footer />
      </div>

    </main>
  );
}

function ContactHero() {
  return (
    <section className="pt-28 pb-10 lg:pt-36 lg:pb-12 px-5 sm:px-8 lg:px-20 text-center">
      <span className="eyebrow text-gold text-[10px] tracking-[0.2em] uppercase block mb-3">
        Lotus Divine · Amritsar
      </span>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] mb-4">
        Contact <em className="text-gold not-italic">Lotus Divine</em>
      </h1>
      <p className="text-ivory/70 text-sm sm:text-[15px] max-w-sm mx-auto leading-relaxed">
        Have a question or planning your stay?{" "}
        <span className="block mt-1 text-ivory/55">
          We're happy to help with reservations, directions, or anything you need before your visit.
        </span>
      </p>
    </section>
  );
}

function ContactDetails() {
  return (
    <section className="pb-14 lg:pb-16 px-5 sm:px-8 lg:px-20 max-w-5xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

        <ContactCard eyebrow="Reservations">
          <a
            href={`tel:${CONTACT.phone}`}
            className="text-ivory font-display text-xl hover:text-gold transition-colors block"
          >
            {CONTACT.phone}
          </a>
          <p className="text-ivory/45 text-xs mt-1.5">Available daily · 8 am – 10 pm</p>
        </ContactCard>

        <ContactCard eyebrow="Email">
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-ivory font-display text-lg hover:text-gold transition-colors block break-all"
          >
            {CONTACT.email}
          </a>
          <p className="text-ivory/45 text-xs mt-1.5">We reply within 24 hours</p>
        </ContactCard>

        <ContactCard eyebrow="Address">
          <p className="text-ivory font-display text-xl leading-snug">
            {CONTACT.address}
          </p>
          <p className="text-ivory/45 text-xs mt-1.5">Minutes from the Golden Temple</p>
        </ContactCard>

      </div>
    </section>
  );
}

function ContactCard({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gold/30 pt-5">
      <span className="eyebrow text-gold text-[10px] tracking-[0.18em] uppercase block mb-3">
        {eyebrow}
      </span>
      {children}
    </div>
  );
}

function WhyChooseUs() {
  const features = [
    "Minutes from the Golden Temple",
    "Peaceful location away from busy streets",
    "Comfortable modern rooms",
    "Easy access to Amritsar's attractions",
  ];

  return (
    <section className="pt-14 pb-10 lg:pt-20 lg:pb-12 px-5 sm:px-8 lg:px-20 max-w-5xl mx-auto">
      <span className="eyebrow text-gold text-[10px] tracking-[0.2em] uppercase block mb-5 text-center">
        Why Guests Choose Us
      </span>
      <h2 className="font-display text-2xl sm:text-3xl leading-[1.1] mb-8 text-center">
        Why Guests Choose <em className="text-gold not-italic">Lotus Divine</em>
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
        {features.map((f) => (
          <div key={f} className="border border-gold/25 px-6 py-5 flex items-start gap-3">
            <span className="text-gold text-sm mt-0.5 shrink-0">✓</span>
            <p className="text-brown text-sm leading-snug">{f}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VisitUs() {
  const attractions = [
    { label: "Golden Temple", note: "5 min" },
    { label: "Jallianwala Bagh", note: "8 min" },
    { label: "Partition Museum", note: "10 min" },
    { label: "Hall Bazaar", note: "10 min" },
    { label: "Amritsar Airport", note: "20 min" },
  ];

  return (
    <section className="pt-10 pb-14 lg:pt-12 lg:pb-20 px-5 sm:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        <div>
          <span className="eyebrow text-gold text-[10px] tracking-[0.2em] uppercase block mb-4">
            Find Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] mb-4">
            Visit Us in <em className="text-gold not-italic">Amritsar</em>
          </h2>
          <p className="text-brown/65 text-sm leading-relaxed mb-6">
            Lotus Divine is located just minutes from Sri Harmandir Sahib (Golden Temple), offering a peaceful stay with convenient access to Amritsar's most popular attractions.
          </p>
          <a
            href="https://www.google.com/maps/search/Lotus+Divine+Hotel+Amritsar"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow text-[10px] tracking-[0.14em] uppercase border border-brown/40 text-brown px-6 py-2.5 hover:border-gold hover:text-gold transition-all inline-block"
          >
            Get Directions →
          </a>
        </div>

        <div>
          <span className="eyebrow text-brown/40 text-[10px] tracking-[0.18em] uppercase block mb-4">
            Nearby Attractions
          </span>
          <div className="divide-y divide-brown/10">
            {attractions.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between py-3">
                <p className="text-brown text-sm">{item.label}</p>
                <p className="text-brown/40 text-xs ml-4 shrink-0">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function BookingHelpCTA() {
  return (
    <section className="py-14 lg:py-20 px-5 sm:px-8 lg:px-20 text-center border-b border-gold/10">
      <div className="max-w-xl mx-auto">
        <span className="eyebrow text-gold text-[10px] tracking-[0.2em] uppercase block mb-3">
          Reservations
        </span>
        <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] mb-3">
          Need Help With Your Booking?
        </h2>
        <p className="text-ivory/60 text-sm leading-relaxed mb-8">
          Reserve directly with Lotus Divine for the best experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/booking"
            search={{ room: "", checkIn: "", checkOut: "", guests: "" }}
            className="eyebrow text-[10px] tracking-[0.14em] uppercase bg-gold text-brown px-8 py-4 hover:bg-ivory transition-all"
          >
            Book Your Stay
          </Link>
          <a
            href={`tel:${CONTACT.phone}`}
            className="eyebrow text-[10px] tracking-[0.14em] uppercase border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-brown transition-all"
          >
            Call Hotel
          </a>
        </div>
      </div>
    </section>
  );
}
