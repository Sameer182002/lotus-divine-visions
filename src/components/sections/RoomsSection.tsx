import { Link } from "@tanstack/react-router";
import { ROOMS_DETAIL, ROOMS_SECTION } from "@/data/siteContent";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";

const ROOM_IMAGES = [room1, room2];

export function RoomsSection() {
  return (
    <section className="bg-ivory text-brown py-12 lg:py-20 px-5 sm:px-8 lg:px-20">
      <div className="mb-6 lg:mb-10">
        <span className="eyebrow text-gold block mb-3 text-[10px] lg:text-[11px]">
          {ROOMS_SECTION.eyebrow}
        </span>
        <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl text-brown leading-[1.05]">
          {ROOMS_SECTION.headingLine1}<br /><span className="italic">{ROOMS_SECTION.headingEmphasis}</span>
        </h2>
      </div>

      {/* Mobile: horizontal snap carousel */}
      <div className="lg:hidden -mx-5 sm:-mx-8 px-5 sm:px-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ROOMS_DETAIL.map((r, i) => (
          <article key={r.id} className="snap-start shrink-0 w-[78%] sm:w-[55%]">
            <div className="overflow-hidden mb-4">
              <img src={ROOM_IMAGES[i]} alt={r.imageAlt} className="w-full aspect-[4/5] object-cover" loading="lazy" />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-brown truncate">{r.name}</h3>
              <span className="eyebrow text-gold text-[10px] shrink-0">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-2 leading-relaxed line-clamp-2">{r.description}</p>
            <div className="hairline w-full mt-4" />
            <Link
              to="/booking"
              search={{ room: r.id, checkIn: "", checkOut: "", guests: "" }}
              className="inline-block mt-4 eyebrow text-[10px] border border-gold/60 text-gold px-5 py-2.5 hover:bg-gold hover:text-brown transition-colors"
            >
              Book Now
            </Link>
          </article>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-2 gap-8">
        {ROOMS_DETAIL.map((r, i) => (
          <article key={r.id} className="group">
            <div className="overflow-hidden mb-4">
              <img
                src={ROOM_IMAGES[i]}
                alt={r.imageAlt}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl text-brown">{r.name}</h3>
              <span className="eyebrow text-gold">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-3 leading-relaxed line-clamp-2">{r.description}</p>
            <div className="hairline w-full mt-4" />
            <Link
              to="/booking"
              search={{ room: r.id, checkIn: "", checkOut: "", guests: "" }}
              className="inline-block mt-4 eyebrow text-[10px] border border-gold/60 text-gold px-6 py-3 hover:bg-gold hover:text-brown transition-colors"
            >
              Book Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
