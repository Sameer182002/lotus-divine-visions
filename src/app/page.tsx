import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { LocationSection } from "@/components/sections/LocationSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="bg-ivory text-brown overflow-x-clip">
      <Header />
      <HeroSection />
      <RoomsSection />
      <AboutSection />
      <AmenitiesSection />
      <GallerySection />
      <LocationSection />
      <CTASection />
      <Footer />
      {/* Bottom spacer so sticky mobile booking bar never overlaps footer; must carry the
          footer's own background or it shows as a light strip below the dark footer. */}
      <div className="h-20 md:hidden bg-brown" aria-hidden />
    </main>
  );
}
