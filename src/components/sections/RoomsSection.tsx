import Link from "next/link";
import { ROOMS_DETAIL, ROOMS_SECTION } from "@/data/siteContent";
import { bookingHref } from "@/lib/booking-url";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";

const ROOM_IMAGES = [room1.src, room2.src];

interface RoomsSectionRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  amenities: readonly string[];
  capacity: string;
  price: string;
  imageUrl?: string;
  imageAlt?: string;
  gallery?: string[];
}

function getRoomImageUrl(room: RoomsSectionRoom, index: number) {
  if (room.imageUrl) {
    if (
      room.imageUrl.startsWith("http") ||
      room.imageUrl.startsWith("/") ||
      room.imageUrl.startsWith("data:")
    ) {
      return room.imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${room.imageUrl}`;
  }
  return ROOM_IMAGES[index % ROOM_IMAGES.length] || room1.src;
}

async function fetchRooms(): Promise<RoomsSectionRoom[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch rooms");
    return (await res.json()) as RoomsSectionRoom[];
  } catch (err) {
    console.warn("Falling back to static rooms:", err);
    return ROOMS_DETAIL as unknown as RoomsSectionRoom[];
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

      <div className="lg:hidden -mx-5 sm:-mx-8 px-5 sm:px-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {roomsList.map((r, i) => (
          <article key={r.id} className="snap-start shrink-0 w-[78%] sm:w-[55%]">
            <div className="overflow-hidden mb-4">
              <img
                src={getRoomImageUrl(r, i)}
                alt={r.imageAlt || r.name}
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-brown truncate">{r.name}</h3>
              <span className="eyebrow text-gold text-[10px] shrink-0">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-2 leading-relaxed line-clamp-2">{r.description}</p>
            <div className="flex gap-3 mt-1 text-[10px] text-taupe eyebrow">
              <span>{r.capacity}</span>
              <span className="text-gold/40">·</span>
              <span>{r.amenities[0] || "AC Room"}</span>
            </div>
            <div className="hairline w-full mt-4" />
            <div className="flex items-center gap-3 mt-4">
              <Link
                href={bookingHref(r.id)}
                className="eyebrow text-[10px] border border-gold/60 text-gold px-5 py-2.5 hover:bg-gold hover:text-brown transition-colors"
              >
                {ROOMS_SECTION.bookBtn}
              </Link>
              <Link
                href="/rooms"
                className="eyebrow text-[10px] text-taupe hover:text-brown transition-colors"
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
              <span className="eyebrow text-gold">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-3 leading-relaxed line-clamp-2">{r.description}</p>
            <div className="flex gap-3 mt-2 text-[10px] text-taupe eyebrow">
              <span>{r.capacity}</span>
              <span className="text-gold/40">·</span>
              <span>{r.amenities[0] || "AC Room"}</span>
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
                href="/rooms"
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
