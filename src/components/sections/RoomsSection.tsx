import { ROOMS, ROOMS_SECTION } from "@/data/siteContent";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";

const ROOM_IMAGES = [room1.src, room2.src, room3.src];

export function RoomsSection() {
  return (
    <section className="bg-brown text-ivory py-20 lg:py-32 px-5 sm:px-8 lg:px-20">
      <div className="flex flex-wrap items-end justify-between gap-4 lg:gap-6 mb-10 lg:mb-20">
        <div>
          <span className="eyebrow text-gold block mb-3 lg:mb-4 text-[10px] lg:text-[11px]">
            {ROOMS_SECTION.eyebrow}
          </span>
          <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl text-ivory leading-[1.05]">
            {ROOMS_SECTION.headingLine1}
            <br />
            <span className="italic">{ROOMS_SECTION.headingEmphasis}</span>
          </h2>
        </div>
        <a href="#" className="eyebrow text-gold border-b border-gold pb-2">
          {ROOMS_SECTION.viewAllCta}
        </a>
      </div>

      {/* Mobile: horizontal snap carousel */}
      <div className="lg:hidden -mx-5 sm:-mx-8 px-5 sm:px-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ROOMS.map((r, i) => (
          <article key={r.name} className="snap-start shrink-0 w-[78%] sm:w-[55%]">
            <div className="overflow-hidden mb-5">
              <img
                src={ROOM_IMAGES[i]}
                alt={r.name}
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ivory truncate">{r.name}</h3>
              <span className="eyebrow text-gold text-[10px] shrink-0">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-3 leading-relaxed">{r.desc}</p>
            <div className="hairline w-full mt-5 opacity-30" />
          </article>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-3 gap-8">
        {ROOMS.map((r, i) => (
          <article key={r.name} className={`group ${i === 1 ? "mt-16" : ""}`}>
            <div className="overflow-hidden mb-6">
              <img
                src={ROOM_IMAGES[i]}
                alt={r.name}
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                loading="lazy"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl text-ivory">{r.name}</h3>
              <span className="eyebrow text-gold">{r.price}</span>
            </div>
            <p className="text-taupe text-sm mt-3 leading-relaxed">{r.desc}</p>
            <div className="hairline w-full mt-6 opacity-30" />
          </article>
        ))}
      </div>
    </section>
  );
}
