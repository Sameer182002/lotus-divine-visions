import { GALLERY_ALTS } from "@/data/siteContent";
import pool from "@/assets/pool.jpg";
import spa from "@/assets/spa.jpg";
import dining from "@/assets/dining.jpg";
import room2 from "@/assets/room-2.jpg";

export function GallerySection() {
  return (
    <section className="grid grid-cols-12 gap-1.5 lg:gap-2 px-1.5 lg:px-2">
      <img
        src={pool.src}
        alt={GALLERY_ALTS.pool}
        className="col-span-12 lg:col-span-8 h-[260px] sm:h-[360px] lg:h-[480px] w-full object-cover"
        loading="lazy"
      />
      <img
        src={spa.src}
        alt={GALLERY_ALTS.spa}
        className="col-span-6 lg:col-span-4 h-[200px] sm:h-[280px] lg:h-[480px] w-full object-cover"
        loading="lazy"
      />
      <img
        src={dining.src}
        alt={GALLERY_ALTS.dining}
        className="col-span-6 lg:col-span-4 h-[200px] sm:h-[280px] lg:h-[480px] w-full object-cover"
        loading="lazy"
      />
      <img
        src={room2.src}
        alt={GALLERY_ALTS.villa}
        className="col-span-12 lg:col-span-8 h-[260px] sm:h-[360px] lg:h-[480px] w-full object-cover"
        loading="lazy"
      />
    </section>
  );
}
