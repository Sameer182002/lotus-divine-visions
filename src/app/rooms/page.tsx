import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoomShowcase } from "@/components/sections/RoomShowcase";
import { EveryStayIncludes } from "@/components/sections/EveryStayIncludes";
import { RoomsCtaSection } from "@/components/sections/RoomsCtaSection";

export const metadata: Metadata = {
  title: "Suites & Rooms — Lotus Divine",
  description:
    "Explore our private collection of 36 sanctuaries at Lotus Divine. From the Lotus Sanctuary to the Imperial Vista Suite — uncompromised luxury awaits.",
};

export default function RoomsPage() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />
      <RoomShowcase />
      <EveryStayIncludes />
      <RoomsCtaSection />
      <Footer />
    </main>
  );
}
