import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoomShowcase } from "@/components/sections/RoomShowcase";
import { EveryStayIncludes } from "@/components/sections/EveryStayIncludes";
import { RoomsCtaSection } from "@/components/sections/RoomsCtaSection";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Suites & Rooms — Lotus Divine" },
      {
        name: "description",
        content:
          "Explore our private collection of 36 sanctuaries at Lotus Divine. From the Lotus Sanctuary to the Imperial Vista Suite — uncompromised luxury awaits.",
      },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />
      {/* Dark strip so the transparent fixed header has contrast on load */}
      <div className="bg-brown text-ivory pt-24 pb-7 lg:pt-32 lg:pb-9 px-5 sm:px-8 lg:px-20">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
          Our Rooms
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          Suites &amp; Rooms
        </h1>
      </div>
      <RoomShowcase />
      <EveryStayIncludes />
      <RoomsCtaSection />
      <Footer />
    </main>
  );
}
