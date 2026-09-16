export function BookingCalendarIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      fill="none"
      aria-hidden
    >
      {/* lotus-petal accent */}
      <path
        d="M32 16 C26 15 22 11 22 7 C24 8 27 9 29 11 C28 8 29 5 32 3 C35 5 36 8 35 11 C37 9 40 8 42 7 C42 11 38 15 32 16 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* calendar body */}
      <rect x="9" y="16" width="46" height="40" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 26H55" stroke="currentColor" strokeWidth="2" />
      <path d="M19 12V20M45 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* draw-in checkmark */}
      <path
        className="booking-icon-check"
        d="M21 40L28 47L43 32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="34"
        strokeDashoffset="34"
      />
    </svg>
  );
}
