import logoSrc from "@/assets/logo.png";

type Props = {
  tone?: "ivory" | "brown" | "gold";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "footer";
  align?: "center" | "left";
  showTagline?: boolean;
};

const heights: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-8",
  md: "h-11",
  lg: "h-14",
  xl: "h-16",
  "2xl": "h-20",
  "3xl": "h-24",
  // Matches the header logo at every breakpoint (h-8 on mobile nav, h-14 on desktop nav).
  footer: "h-8 min-[820px]:h-14",
};

export function BrandLogo({ size = "md", align = "center" }: Props) {
  return (
    <div className={`flex ${align === "center" ? "justify-center" : "justify-start"}`}>
      <img
        src={logoSrc.src}
        alt="Lotus Divine Luxury Hotel"
        className={`${heights[size]} w-auto object-contain`}
        draggable={false}
      />
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
