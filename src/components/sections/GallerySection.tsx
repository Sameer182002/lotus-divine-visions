"use client";

import { useEffect, useRef, useState } from "react";
import { GALLERY_ALTS, GALLERY_SECTION } from "@/data/siteContent";
import entrance from "@/assets/hero-entrance.jpg";
import reception from "@/assets/reception.png";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import insideRoom from "@/assets/inside-room.png";

const GALLERY_IMAGES = [
  { src: entrance.src, alt: GALLERY_ALTS.entrance },
  { src: reception.src, alt: GALLERY_ALTS.reception },
  { src: roomDeluxe.src, alt: GALLERY_ALTS.deluxe },
  { src: insideRoom.src, alt: GALLERY_ALTS.insideRoom },
];

export function GallerySection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const updateActive = () => {
      const containerCenter = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const rect = tile.getBoundingClientRect();
        const tileCenter = rect.left + rect.width / 2;
        const distance = Math.abs(tileCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActiveIndex(closestIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };

    updateActive();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section>
      <div className="px-5 sm:px-8 lg:px-20 py-12 lg:py-16 text-center">
        <h2 className="font-display text-[2rem] sm:text-4xl lg:text-5xl text-brown">
          {GALLERY_SECTION.heading}
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 px-5 sm:px-8 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY_IMAGES.map((img, i) => (
          <img
            key={img.src}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            src={img.src}
            alt={img.alt}
            className="snap-center shrink-0 w-[82%] sm:w-[64%] aspect-[15/16] object-cover"
            loading="lazy"
          />
        ))}
      </div>

      <div className="lg:hidden flex justify-center items-center gap-2 mt-4">
        {GALLERY_IMAGES.map((img, i) => (
          <span
            key={img.src}
            className={`rounded-full transition-all ${
              i === activeIndex ? "w-2 h-2 bg-gold" : "w-1.5 h-1.5 bg-taupe/30"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-5 lg:gap-6 px-5 sm:px-8 lg:px-20">
        {GALLERY_IMAGES.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
