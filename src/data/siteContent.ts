// ─── Brand ───────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Lotus Divine",
  tagline: "Luxury Hotel",
  established: "Est. 1924",
  membership: "Member, The Leading Hotels of the World.",
  description: "An estate of uncompromised luxury. Member, The Leading Hotels of the World.",
  copyright: "© 2026 Lotus Divine · All rights reserved",
} as const;

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  address: "128 Divine Way, Celestial Highlands",
  addressShort: "Celestial Highlands",
  phone: "+1 (800) LOTUS-DIVINE",
  phoneDisplay: "Reservations · +1 (800) LOTUS-DIVINE",
  email: "reservations@lotusdivine.com",
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = ["The Estate", "Suites", "Wellness", "Dining", "Journal"] as const;

export const NAV = {
  reservations: "Reservations",
  bookCta: "Book Your Stay",
  bookMobile: "Book",
  drawerLabel: "Navigate",
} as const;

// ─── Page meta ───────────────────────────────────────────────────────────────

export const META = {
  title: "Lotus Divine — Premium Luxury Hotel",
  description:
    "An estate of uncompromised luxury. Lotus Divine — member, The Leading Hotels of the World.",
  ogTitle: "Lotus Divine — Premium Luxury Hotel",
  ogDescription: "A century of uncompromised hospitality between the mountains and the sea.",
} as const;

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO = {
  eyebrow: "An Estate Reborn · Est. 1924",
  headingLine1: "The Art of",
  headingEmphasis: "Hushed",
  headingLine2: "Luxury.",
  body: "A century of uncompromised hospitality, distilled into thirty-six private sanctuaries between the mountains and the sea.",
  scrollLabel: "Scroll",
  imgAlt: "Lotus Divine at golden hour",
} as const;

// ─── About ───────────────────────────────────────────────────────────────────

export const ABOUT = {
  eyebrow: "01 — Timeless Elegance",
  heading: "A sanctuary carved from the light of the morning sun.",
  body1:
    "Every corner of Lotus Divine is a dialogue between heritage and modernity. Our story began in 1924, when a single colonnaded villa above the bay first opened its doors to travellers seeking silence and ceremony.",
  body2:
    "A century on, we remain quietly devoted to the same craft — the curation of moments that linger long after departure.",
  cta: "Our Story →",
  imgAlt: "Marble lobby",
} as const;

// ─── Rooms ───────────────────────────────────────────────────────────────────

export const ROOMS_SECTION = {
  eyebrow: "02 — The Private Collection",
  headingLine1: "Thirty-six",
  headingEmphasis: "sanctuaries.",
  viewAllCta: "View All →",
} as const;

export const ROOMS = [
  {
    name: "The Lotus Sanctuary",
    desc: "Private plunge pool and meditation terrace overlooking the gardens.",
    price: "From $1,200",
  },
  {
    name: "Imperial Vista Suite",
    desc: "Panoramic ocean views with floor-to-ceiling silk-draped windows.",
    price: "From $1,850",
  },
  {
    name: "Celestial Penthouse",
    desc: "The estate's crown — private butler, terrace and gold-leaf detailing.",
    price: "From $3,400",
  },
] as const;

// ─── Amenities ───────────────────────────────────────────────────────────────

export const AMENITIES_SECTION = {
  eyebrow: "03 — The Experience",
  heading: "Five quiet promises.",
} as const;

export const AMENITIES = [
  { label: "Wellness", desc: "Holistic spa rituals & private hammam." },
  { label: "Hospitality", desc: "24-hour personal butler service." },
  { label: "Luxury", desc: "Helipad arrival & chauffeur fleet." },
  { label: "Comfort", desc: "Climate-tuned bedchambers." },
  { label: "Serenity", desc: "Acoustically shielded suites." },
] as const;

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const GALLERY_ALTS = {
  pool: "Infinity pool",
  spa: "Spa",
  dining: "Fine dining",
  villa: "Garden villa",
} as const;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const TESTIMONIAL = {
  quote:
    "A masterclass in restraint. The staff anticipate your needs before you have even thought them.",
  attribution: "Condé Nast Traveler — Gold List, 2025",
} as const;

// ─── Location ────────────────────────────────────────────────────────────────

export const LOCATION_SECTION = {
  eyebrow: "04 — Location",
  heading: "Between the mountains",
  headingLine2: "and the sea.",
  cta: "Plan Your Arrival →",
} as const;

// ─── CTA ─────────────────────────────────────────────────────────────────────

export const CTA = {
  eyebrow: "Your Stay Awaits",
  headingLine1: "Begin a",
  headingEmphasis: "quieter",
  headingLine2: "chapter.",
  body: "Limited seasonal availability. Direct reservations receive a personal welcome from our concierge.",
  button: "Check Availability",
} as const;

// ─── Footer ──────────────────────────────────────────────────────────────────

export const FOOTER_COLS = [
  {
    title: "The Hotel",
    links: ["Suites", "The Spa", "Dining", "Experiences"],
  },
  {
    title: "Information",
    links: ["Our Story", "Sustainability", "Journal", "Careers"],
  },
] as const;

export const FOOTER_NEWSLETTER = {
  heading: "Stay in Touch",
  blurb: "Quarterly letters from the estate.",
  placeholder: "Your email",
} as const;

export const FOOTER_SOCIAL = [
  { label: "Instagram", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

// ─── Booking widget ──────────────────────────────────────────────────────────

export const BOOKING_DEFAULTS = {
  checkIn: "2026-10-12",
  checkOut: "2026-10-18",
  room: "Lotus Suite",
  guests: "2 Adults",
} as const;

export const BOOKING_ROOM_OPTIONS = [
  "Lotus Suite",
  "Garden Villa",
  "Celestial Penthouse",
  "Divine Sanctuary",
] as const;

export const BOOKING_GUEST_OPTIONS = [
  "1 Adult",
  "2 Adults",
  "2 Adults · 1 Child",
  "Family of 4",
] as const;

export const BOOKING_LABELS = {
  luxury: {
    eyebrow: "Reserve Your Suite",
    guarantee: "Best rate guaranteed",
    guaranteeMobile: "Best rate guaranteed · Concierge welcome",
    button: "Check Availability",
    buttonSticky: "Book Now",
  },
  serenity: {
    eyebrow: "Begin Your Journey",
    guarantee: "Free cancellation · Personal concierge welcome",
    button: "Reserve My Stillness",
    buttonSticky: "Book Now",
  },
  modern: {
    eyebrow: "Reserve Your Stay",
    rating: "★ 4.96 · 1,400+ reviews",
    perks: ["✓ Free cancellation", "✓ Best rate guarantee", "✓ Direct-only perks"],
    button: "Search Availability →",
    buttonSticky: "Book Now",
  },
  mobileBar: {
    label: "Your Stay",
    button: "Book",
  },
  fieldLabels: {
    arrival: "Arrival",
    departure: "Departure",
    checkIn: "Check In",
    checkOut: "Check Out",
    suite: "Suite",
    sanctuary: "Sanctuary",
    room: "Room",
    guests: "Guests",
  },
} as const;
