import Link from "next/link";
import { ROOMS_CARDS, ROOMS_SECTION } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";

const ROOM_IMAGES = [roomDeluxe.src, roomPremium.src];

interface RoomsSectionRoom {
  id: string;
  name: string;
  size: string;
  price: string;
  imageUrl?: string;
  imageAlt?: string;
}

function getRoomImageUrl(room: RoomsSectionRoom, index: number) {
  return ROOM_IMAGES[index % ROOM_IMAGES.length] || roomDeluxe.src;
}

async function fetchRooms(): Promise<RoomsSectionRoom[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch rooms");
    return (await res.json()) as RoomsSectionRoom[];
  } catch (err) {
    console.warn("Falling back to static rooms:", err);
    return ROOMS_CARDS as unknown as RoomsSectionRoom[];
  }
}

export async function RoomsSection() {
  const roomsList = await fetchRooms();

  return (
    <section className="bg-ivory text-brown py-12 lg:py-20 px-5 sm:px-8 lg:px-20">
      <div className="mb-6 lg:mb-10">
        <span className="eyebrow text-gold block mb-3 text-[10px] lg:text-[11px]">
          {ROOMS_SECTION.eyebrow}
        </span>
        <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl text-brown leading-[1.05]">
          {ROOMS_SECTION.headingLine1}{" "}
          <span className="italic">{ROOMS_SECTION.headingEmphasis}</span>
        </h2>
      </div>

      <div className="lg:hidden flex flex-col gap-8">
        {roomsList.map((r, i) => (
          <article
            key={r.id}
            className="bg-white rounded-none shadow-[0_24px_48px_rgba(40,30,20,0.15)] p-4 sm:p-5"
          >
            <div className="overflow-hidden rounded-none mb-4">
              <img
                src={getRoomImageUrl(r, i)}
                alt={r.imageAlt || r.name}
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-brown truncate">{r.name}</h3>
              <span className="eyebrow font-semibold! text-gold text-[10px] shrink-0">
                {r.price}
              </span>
            </div>
            <div className="mt-1.5 text-[10px] text-taupe eyebrow">
              <span className="text-gold">{ROOMS_SECTION.sizeLabel}</span>
              {"  "}
              {r.size}
            </div>
            <div className="hairline w-full mt-3" />
            <div className="flex flex-row flex-nowrap items-center justify-between mt-4">
              <Link
                href={bookingHref(r.id)}
                className="eyebrow text-[9px] tracking-[0.14em] whitespace-nowrap bg-gold text-brown px-2 py-2 hover:bg-ivory transition-colors"
              >
                {ROOMS_SECTION.bookBtn}
              </Link>
              <Link
                href={`/rooms#${r.name.toLowerCase()}`}
                className="eyebrow text-[10px] whitespace-nowrap text-taupe hover:text-brown transition-colors"
              >
                {ROOMS_SECTION.detailsLink}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-8">
        {roomsList.map((r, i) => (
          <article key={r.id} className="group">
            <div className="overflow-hidden mb-4">
              <img
                src={getRoomImageUrl(r, i)}
                alt={r.imageAlt || r.name}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl text-brown">{r.name}</h3>
              <span className="eyebrow font-semibold! text-gold">{r.price}</span>
            </div>
            <div className="mt-2 text-[10px] text-taupe eyebrow">
              <span className="text-gold">{ROOMS_SECTION.sizeLabel}</span>
              {"  "}
              {r.size}
            </div>
            <div className="hairline w-full mt-4" />
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={bookingHref(r.id)}
                className="eyebrow text-[10px] border border-gold/60 text-gold px-6 py-3 hover:bg-gold hover:text-brown transition-colors"
              >
                {ROOMS_SECTION.bookBtn}
              </Link>
              <Link
                href={`/rooms#${r.name.toLowerCase()}`}
                className="eyebrow text-[10px] text-taupe hover:text-brown transition-colors"
              >
                {ROOMS_SECTION.detailsLink}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
