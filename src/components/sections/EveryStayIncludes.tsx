import {
  Wifi,
  Sparkles,
  Wind,
  Tv,
  Droplet,
  ConciergeBell,
  Fan,
  KeySquare,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { label: string; desc: string; icon: LucideIcon }[] = [
  {
    label: "Free Wi-Fi",
    desc: "High-speed throughout",
    icon: Wifi,
  },
  {
    label: "Daily Housekeeping",
    desc: "Regular room cleaning",
    icon: Sparkles,
  },
  {
    label: "Air Conditioning",
    desc: "Individual climate control",
    icon: Wind,
  },
  {
    label: "Smart TV",
    desc: "Streaming services available",
    icon: Tv,
  },
  {
    label: "24-Hour Hot & Cold Water",
    desc: "Available anytime",
    icon: Droplet,
  },
  {
    label: "Front Desk Assistance",
    desc: "Available round the clock",
    icon: ConciergeBell,
  },
  {
    label: "Hair Dryer",
    desc: "Available in every room",
    icon: Fan,
  },
  {
    label: "Secure Key Card Access",
    desc: "Electronic room entry",
    icon: KeySquare,
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
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="bg-ivory px-5 lg:px-7 py-6 lg:py-8 border-t-2 border-gold/40 group hover:border-gold transition-colors duration-300"
              >
                <Icon className="w-7 h-7 text-gold mb-3" strokeWidth={1.2} />
                <span className="eyebrow text-brown text-[10px] lg:text-[11px] block mb-2 group-hover:text-gold transition-colors duration-300">
                  {f.label}
                </span>
                <p className="text-taupe text-xs lg:text-[0.8125rem] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
