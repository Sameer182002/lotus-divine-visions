import { createFileRoute } from "@tanstack/react-router";
import { META } from "@/data/siteContent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { CTASection } from "@/components/sections/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: META.title },
      { name: "description", content: META.description },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="bg-ivory text-brown overflow-x-hidden">
      <Header />
      <HeroSection />
      <RoomsSection />
      <AboutSection />
      <AmenitiesSection />
      <GallerySection />
      <TestimonialSection />
      <LocationSection />
      <CTASection />
      <Footer />
      {/* Bottom spacer so sticky mobile booking bar never overlaps footer */}
      <div className="h-20 md:hidden" aria-hidden />
    </main>
  );
}
