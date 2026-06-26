import { Link } from "@tanstack/react-router";

export function RoomsCtaSection() {
  return (
    <section className="bg-brown text-ivory py-20 lg:py-28 px-5 sm:px-8 lg:px-10 text-center">
      <span className="eyebrow text-gold text-[10px] lg:text-[11px]">
        Direct Reservations · Best Rate Guaranteed
      </span>
      <h2 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl mt-4 lg:mt-6 leading-[1.05] text-balance">
        Ready for Your <span className="italic">Stay?</span>
      </h2>
      <p className="text-ivory/60 max-w-md mx-auto mt-5 lg:mt-7 text-sm lg:text-base">
        Reserve directly with Lotus Divine for the best available experience.
      </p>
      <Link
        to="/booking"
        search={{ room: "", checkIn: "", checkOut: "", guests: "" }}
        className="inline-block mt-10 lg:mt-12 bg-gold text-brown px-10 sm:px-14 py-4 lg:py-5 eyebrow hover:bg-ivory transition-colors w-full sm:w-auto max-w-sm text-center"
      >
        Reserve Your Stay
      </Link>
    </section>
  );
}
