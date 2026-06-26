"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ROOMS_DETAIL } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import spa from "@/assets/spa.jpg";
import pool from "@/assets/pool.jpg";
import lobby from "@/assets/lobby.jpg";
import dining from "@/assets/dining.jpg";
import heroLuxury from "@/assets/hero-luxury.jpg";

type GalleryImage = { src: string; alt: string };

const GALLERIES: Record<string, GalleryImage[]> = {
  "lotus-sanctuary": [
    { src: room1.src, alt: "The Lotus Sanctuary — king bedchamber" },
    { src: spa.src, alt: "Private spa terrace" },
    { src: pool.src, alt: "Plunge pool at dusk" },
    { src: lobby.src, alt: "Estate arrival lobby" },
  ],
  "imperial-vista": [
    { src: room2.src, alt: "Imperial Vista Suite — ocean panorama" },
    { src: dining.src, alt: "Private dining for four" },
    { src: room3.src, alt: "Suite interior details" },
    { src: heroLuxury.src, alt: "The estate at golden hour" },
  ],
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

function RoomSection({
  room,
  reverse,
  index,
}: {
  room: RoomDetail;
  reverse: boolean;
  index: number;
}) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const gallery = GALLERIES[room.id];
  const bookingSlug = BOOKING_SLUGS[room.id];

  return (
    <section
      className={`py-14 lg:py-20 px-5 sm:px-8 lg:px-20 ${reverse ? "bg-champagne/40" : "bg-ivory"}`}
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
              loading={index === 0 ? "eager" : "lazy"}
            />
          </button>

          <div className="flex gap-1.5 mt-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setFeaturedIdx(i)}
                aria-label={img.alt}
                className={`shrink-0 overflow-hidden focus:outline-none transition-all duration-300 ${
                  i === featuredIdx
                    ? "ring-2 ring-gold ring-offset-1 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                style={{ width: "calc(25% - 4.5px)" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[52px] lg:h-[64px] object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[48%] flex flex-col justify-center lg:py-2">
          <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
            {room.category}
          </span>
          <h2 className="font-display text-[1.875rem] sm:text-4xl lg:text-[2.6rem] text-brown leading-[1.05] mb-4">
            {room.name}
          </h2>
          <p className="text-taupe text-sm lg:text-[0.9375rem] leading-relaxed mb-6 max-w-prose">
            {room.description}
          </p>

          <div className="flex gap-8 pb-6 mb-6 border-b border-brown/10">
            {"size" in room && (
              <div>
                <span className="eyebrow text-brown/40 text-[10px] block mb-1">Room Size</span>
                <span className="text-sm text-brown">{room.size}</span>
              </div>
            )}
            <div>
              <span className="eyebrow text-brown/40 text-[10px] block mb-1">Guest Capacity</span>
              <span className="text-sm text-brown">{room.capacity}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 mb-8">
            {room.amenities.map((a) => (
              <div
                key={a}
                className="flex items-start gap-2 py-2 border-b border-brown/8 text-xs text-brown/65"
              >
                <span className="text-gold shrink-0 mt-px">—</span>
                {a}
              </div>
            ))}
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
  return (
    <div>
      {ROOMS_DETAIL.map((room, i) => (
        <RoomSection key={room.id} room={room} reverse={i % 2 === 1} index={i} />
      ))}
    </div>
  );
}
