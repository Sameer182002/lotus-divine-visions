"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  BedDouble,
  Wind,
  Wifi,
  Tv,
  Briefcase,
  Shirt,
  Blinds,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import { ROOMS_DETAIL } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";
import roomDeluxe2 from "@/assets/room-deluxe-2.png";
import roomDeluxe3 from "@/assets/room-deluxe-3.png";
import roomDeluxe4 from "@/assets/room-deluxe-4.png";
import roomDeluxe5 from "@/assets/room-deluxe-5.png";
import roomPremium2 from "@/assets/room-premium-2.png";
import roomPremium3 from "@/assets/room-premium-3.png";
import roomPremium4 from "@/assets/room-premium-4.png";
import roomPremium5 from "@/assets/room-premium-5.png";

type GalleryImage = { src: string; alt: string; objectPosition?: string };

const GALLERIES: Record<string, GalleryImage[]> = {
  "lotus-sanctuary": [
    { src: roomDeluxe.src, alt: "Deluxe room at Lotus Divine" },
    { src: roomDeluxe2.src, alt: "Deluxe room — bed and headboard detail" },
    { src: roomDeluxe3.src, alt: "Deluxe room — TV and seating area" },
    { src: roomDeluxe4.src, alt: "Deluxe room — seating corner" },
    { src: roomDeluxe5.src, alt: "Deluxe room — en-suite bathroom" },
  ],
  "imperial-vista": [
    { src: roomPremium.src, alt: "Premium room at Lotus Divine" },
    { src: roomPremium2.src, alt: "Premium room — bed and headboard detail" },
    { src: roomPremium3.src, alt: "Premium room — TV wall" },
    {
      src: roomPremium4.src,
      alt: "Premium room — seating corner",
      objectPosition: "center 85%",
    },
    { src: roomPremium5.src, alt: "Premium room — en-suite bathroom" },
  ],
};

const AMENITY_ICONS: Record<string, LucideIcon> = {
  "King-size bed": BedDouble,
  "Air conditioning": Wind,
  "Free Wi-Fi": Wifi,
  "Smart TV": Tv,
  "Work desk & chair": Briefcase,
  "Wardrobe with hangers": Shirt,
  "Blackout curtains": Blinds,
  "24-hour hot & cold water": Droplet,
};

const BOOKING_SLUGS: Record<string, string> = {
  "lotus-sanctuary": "signature-suite",
  "imperial-vista": "grand-suite",
};

type RoomDetail = (typeof ROOMS_DETAIL)[number];

function Lightbox({
  images,
  current,
  onClose,
  onChange,
}: {
  images: GalleryImage[];
  current: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const prev = useCallback(
    () => onChange((current - 1 + images.length) % images.length),
    [current, images.length, onChange],
  );
  const next = useCallback(
    () => onChange((current + 1) % images.length),
    [current, images.length, onChange],
  );

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handle);
    const prev_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handle);
      document.body.style.overflow = prev_overflow;
    };
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-brown/96 flex flex-col" onClick={onClose}>
      <div
        className="flex items-center justify-between px-5 lg:px-8 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="eyebrow text-gold text-[10px]">
          {current + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="text-ivory/55 hover:text-gold transition-colors text-3xl leading-none w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center relative px-14 lg:px-20 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 lg:left-6 text-ivory/45 hover:text-gold transition-colors text-5xl leading-none"
        >
          ‹
        </button>
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="max-h-full max-w-full object-contain"
        />
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 lg:right-6 text-ivory/45 hover:text-gold transition-colors text-5xl leading-none"
        >
          ›
        </button>
      </div>

      <div
        className="shrink-0 pb-5 px-5 flex gap-2 justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`overflow-hidden transition-all duration-300 w-16 lg:w-20 h-11 lg:h-[52px] shrink-0 focus:outline-none ${
              i === current ? "ring-2 ring-gold opacity-100" : "opacity-30 hover:opacity-65"
            }`}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

interface RoomShowcaseItem {
  id: string;
  name: string;
  category: string;
  description: string;
  amenities: readonly string[];
  size?: string;
  capacity: string;
  price: string;
  imageUrl?: string;
  imageKey?: string;
  imageAlt?: string;
  gallery?: string[];
}

function getRoomImageUrl(room: RoomShowcaseItem | undefined) {
  if (!room) return "";
  const key = room.imageKey || "room1";
  const roomImages: Record<string, string> = {
    room1: roomDeluxe.src,
    room2: roomPremium.src,
  };
  return roomImages[key] || roomDeluxe.src;
}

function RoomSection({
  room,
  reverse,
  index,
}: {
  room: RoomShowcaseItem;
  reverse: boolean;
  index: number;
}) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const thumbScrollerRef = useRef<HTMLDivElement>(null);
  const [showThumbFade, setShowThumbFade] = useState(false);

  const defaultImage = getRoomImageUrl(room);
  const gallery: GalleryImage[] = GALLERIES[room.id] || [
    { src: defaultImage, alt: room.imageAlt || room.name },
  ];
  const bookingSlug = BOOKING_SLUGS[room.id] || room.id;

  useEffect(() => {
    const scroller = thumbScrollerRef.current;
    if (!scroller) return;

    const updateFade = () => {
      const hasOverflow = scroller.scrollWidth > scroller.clientWidth + 1;
      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
      setShowThumbFade(hasOverflow && !atEnd);
    };

    updateFade();
    scroller.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("resize", updateFade);
    return () => {
      scroller.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, [gallery.length]);

  return (
    <section
      id={room.category.toLowerCase()}
      className={`scroll-mt-[90px] min-[820px]:scroll-mt-[100px] py-14 lg:py-20 px-5 sm:px-8 lg:px-20 ${reverse ? "bg-champagne/40" : "bg-ivory"}`}
    >
      <div
        className={`max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-14 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="w-full lg:w-[52%]">
          <button
            onClick={() => setLightboxIdx(featuredIdx)}
            className="block w-full overflow-hidden group focus:outline-none"
            aria-label="Open gallery"
          >
            <img
              src={gallery[featuredIdx].src}
              alt={gallery[featuredIdx].alt}
              className="w-full h-[300px] sm:h-[420px] lg:h-[480px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
              style={{ objectPosition: gallery[featuredIdx].objectPosition || "center" }}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </button>

          {gallery.length > 1 && (
            <div className="relative mt-1.5">
              <div
                ref={thumbScrollerRef}
                className="flex gap-1.5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setFeaturedIdx(i)}
                    aria-label={img.alt}
                    className={`snap-start shrink-0 overflow-hidden focus:outline-none transition-all duration-300 ${
                      i === featuredIdx
                        ? "ring-2 ring-gold ring-offset-1 opacity-100"
                        : "opacity-50 hover:opacity-80"
                    }`}
                    style={{ width: "calc(23.5% - 4.5px)" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-[52px] lg:h-[64px] object-cover"
                      style={{ objectPosition: img.objectPosition || "center" }}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 right-0 w-6 lg:w-8 bg-gradient-to-l from-transparent transition-opacity duration-300 ${
                  reverse ? "to-champagne/40" : "to-ivory"
                } ${showThumbFade ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          )}
        </div>

        <div className="w-full lg:w-[48%] flex flex-col justify-center lg:py-2">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
            {room.category}
          </span>
          <h2 className="font-display text-[1.875rem] sm:text-4xl lg:text-[2.6rem] text-brown leading-[1.05] mb-2">
            {room.name}
          </h2>
          <span className="block font-bold text-gold uppercase tracking-[0.06em] text-lg sm:text-xl lg:text-2xl mb-5 lg:mb-6">
            {room.price}
          </span>
          <p className="text-taupe text-sm lg:text-[0.9375rem] leading-relaxed mb-6 max-w-prose">
            {room.description}
          </p>

          {"size" in room && (
            <div className="pb-6 mb-6 border-b border-brown/10">
              <span className="eyebrow text-brown/40 text-[10px] mr-2">Size</span>
              <span className="text-sm text-brown">{room.size}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 mb-8">
            {room.amenities.map((a) => {
              const Icon = AMENITY_ICONS[a];
              return (
                <div
                  key={a}
                  className="flex items-start gap-2 py-2 border-b border-brown/8 text-xs text-brown/65"
                >
                  {Icon && (
                    <Icon className="w-7 h-7 text-gold shrink-0 -mt-1 -ml-1" strokeWidth={1.2} />
                  )}
                  {a}
                </div>
              );
            })}
          </div>

          <div>
            <Link
              href={bookingHref(bookingSlug)}
              className="inline-block bg-brown text-ivory px-10 py-4 eyebrow hover:bg-gold hover:text-brown transition-all w-full sm:w-auto text-center"
            >
              Book This Room
            </Link>
          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={gallery}
          current={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onChange={setLightboxIdx}
        />
      )}
    </section>
  );
}

export function RoomShowcase() {
  const [roomsList, setRoomsList] = useState<RoomShowcaseItem[]>([]);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
        if (!res.ok) throw new Error("Failed to load rooms");
        const data = await res.json();
        setRoomsList(data);
      } catch (err) {
        console.warn("Fallback to static rooms:", err);
        setRoomsList(ROOMS_DETAIL as unknown as RoomShowcaseItem[]);
      }
    }
    loadRooms();
  }, []);

  // Deep-link support (/rooms#deluxe etc.): once the room sections exist, scroll to
  // the hash target through Lenis so its virtual scroll state stays in sync, falling
  // back to native scrollIntoView if Lenis is off (e.g. prefers-reduced-motion). Runs
  // on initial load/refresh (once rooms populate) and again on hashchange, since a
  // same-page hash swap between room anchors doesn't remount this component.
  useEffect(() => {
    if (roomsList.length === 0) return;

    let cancelled = false;
    let frame: number;

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      let findAttempts = 0;
      let settleAttempts = 0;

      // Lenis measures page height via a debounced ResizeObserver, so for a few
      // frames right after these sections mount its cached scroll limit can still
      // be stale/too small and would clamp the target back near 0. Re-applying the
      // scroll for a handful of frames lets it self-correct once Lenis catches up.
      const settle = () => {
        if (cancelled) return;
        const target = document.getElementById(hash);
        if (!target) return;
        if (window.__lenis) {
          window.__lenis.resize();
          window.__lenis.scrollTo(target, { immediate: true });
        } else {
          target.scrollIntoView({ block: "start" });
        }
        if (settleAttempts++ < 5) frame = requestAnimationFrame(settle);
      };

      const findTarget = () => {
        if (cancelled) return;
        if (document.getElementById(hash)) {
          settle();
          return;
        }
        if (findAttempts++ < 60) frame = requestAnimationFrame(findTarget);
      };
      frame = requestAnimationFrame(findTarget);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [roomsList]);

  return (
    <div>
      {roomsList.map((room, i) => (
        <RoomSection key={room.id} room={room} reverse={i % 2 === 1} index={i} />
      ))}
    </div>
  );
}
