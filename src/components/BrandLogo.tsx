type Props = {
  tone?: "ivory" | "brown" | "gold";
  size?: "sm" | "md" | "lg";
  align?: "center" | "left";
  showTagline?: boolean;
};

export function BrandLogo({
  tone = "brown",
  size = "md",
  align = "center",
  showTagline = true,
}: Props) {
  const color = tone === "ivory" ? "text-ivory" : tone === "gold" ? "text-gold" : "text-brown";
  const eyebrowColor =
    tone === "ivory" ? "text-gold" : tone === "gold" ? "text-gold/80" : "text-taupe";
  const ms = { sm: "text-base", md: "text-xl", lg: "text-3xl" }[size];
  const es = { sm: "text-[8px]", md: "text-[9px]", lg: "text-[11px]" }[size];
  return (
    <div
      className={`flex flex-col ${align === "center" ? "items-center" : "items-start"} leading-none`}
    >
      <span className={`font-display ${ms} ${color} tracking-tight`}>
        <span className="italic">L</span>otus <span className="italic">D</span>ivine
      </span>
      {showTagline && <span className={`eyebrow ${es} mt-1.5 ${eyebrowColor}`}>Luxury Hotel</span>}
    </div>
  );
}

export function LotusMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" className={className} aria-hidden>
      <path
        d="M20 28 C8 26 2 18 2 10 C6 12 10 14 14 18 C12 12 14 6 20 2 C26 6 28 12 26 18 C30 14 34 12 38 10 C38 18 32 26 20 28 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M20 28 L20 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
