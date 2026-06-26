import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoomShowcase } from "@/components/sections/RoomShowcase";
import { EveryStayIncludes } from "@/components/sections/EveryStayIncludes";
import { RoomsCtaSection } from "@/components/sections/RoomsCtaSection";

export const metadata: Metadata = {
  title: "Suites & Rooms — Lotus Divine",
  description:
    "Explore our collection of comfortable rooms at Lotus Divine. From deluxe rooms to family suites — a peaceful stay near the Golden Temple awaits.",
};

export default function RoomsPage() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />
      <div className="bg-brown text-ivory pt-24 pb-7 lg:pt-32 lg:pb-9 px-5 sm:px-8 lg:px-20">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">Our Rooms</span>
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
