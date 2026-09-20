export function LegalHero({
  eyebrow,
  heading,
  identifier,
}: {
  eyebrow: string;
  heading: string;
  identifier?: string;
}) {
  return (
    <section className="bg-ivory pt-28 pb-8 min-[821px]:pt-32 min-[821px]:pb-10 px-5 sm:px-8 lg:px-20 text-center">
      <span className="eyebrow text-gold text-[10px] block mb-4">{eyebrow}</span>
      <h1 className="font-display text-3xl sm:text-4xl min-[821px]:text-5xl leading-[1.1] text-balance">
        {heading}
      </h1>
      {identifier && <p className="eyebrow text-brown/35 text-[10px] mt-4">{identifier}</p>}
    </section>
  );
}
