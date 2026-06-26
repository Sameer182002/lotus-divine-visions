const FEATURES = [
  {
    label: "Complimentary Wi-Fi",
    desc: "High-speed throughout the estate",
  },
  {
    label: "Daily Housekeeping",
    desc: "Twice-daily turndown service",
  },
  {
    label: "Premium Toiletries",
    desc: "Curated luxury bath amenities",
  },
  {
    label: "Smart TV",
    desc: '55″ 4K with streaming services',
  },
  {
    label: "Air Conditioning",
    desc: "Individual climate control",
  },
  {
    label: "Tea & Coffee Maker",
    desc: "Premium loose-leaf selection",
  },
  {
    label: "24×7 Reception",
    desc: "Personal concierge on call",
  },
  {
    label: "Secure Parking",
    desc: "Complimentary valet service",
  },
];

export function EveryStayIncludes() {
  return (
    <section className="bg-champagne/50 py-14 lg:py-20 px-5 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <span className="eyebrow text-gold text-[10px] lg:text-[11px] block mb-3">
          Included With Every Room
        </span>
        <h2 className="font-display text-3xl lg:text-4xl text-brown mb-10 lg:mb-14">
          Every Stay Includes
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brown/8">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="bg-ivory px-5 lg:px-7 py-6 lg:py-8 border-t-2 border-gold/40 group hover:border-gold transition-colors duration-300"
            >
              <span className="eyebrow text-brown text-[10px] lg:text-[11px] block mb-2 group-hover:text-gold transition-colors duration-300">
                {f.label}
              </span>
              <p className="text-taupe text-xs lg:text-[0.8125rem] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
