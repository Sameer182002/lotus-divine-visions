// ─── Brand ───────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Lotus Divine",
  tagline: "Luxury Hotel",
  established: "Est. 1924",
  membership: "Member, The Leading Hotels of the World.",
  description: "A premium hotel in Amritsar, just minutes from the Golden Temple.",
  copyright: "© 2026 Lotus Divine · All rights reserved",
} as const;

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT = {
  address: "Amritsar, Punjab, India",
  addressShort: "Amritsar",
  phone: "+91 98765 00000",
  phoneDisplay: "Reservations · +91 98765 00000",
  email: "reservations@lotusdivine.com",
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home", to: "/" as const, enabled: true },
  { label: "Rooms", to: "/rooms" as const, enabled: true },
  { label: "About", to: "/about" as const, enabled: true },
  { label: "Contact", to: "/contact" as const, enabled: true },
] as const;

export const NAV = {
  bookCta: "Book Your Stay",
  bookMobile: "Book",
  drawerLabel: "Navigate",
} as const;

// ─── Page meta ───────────────────────────────────────────────────────────────

export const META = {
  title: "Lotus Divine — Luxury Hotel Near Golden Temple, Amritsar",
  description:
    "Premium hotel in Amritsar, minutes from the Golden Temple. Spacious rooms, warm hospitality, and easy direct booking.",
  ogTitle: "Lotus Divine — Luxury Hotel Near Golden Temple, Amritsar",
  ogDescription: "Spacious rooms and warm hospitality, just minutes from Sri Harmandir Sahib.",
} as const;

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO = {
  eyebrow: "Amritsar, Punjab, India",
  headingLine1: "Luxury Hotel",
  headingEmphasis: "Near The",
  headingLine2: "Golden Temple",
  body: "Experience spacious rooms, warm hospitality, and a peaceful stay just minutes from Sri Harmandir Sahib.",
  scrollLabel: "Scroll",
  imgAlt: "Lotus Divine hotel exterior",
} as const;

// ─── About ───────────────────────────────────────────────────────────────────

export const ABOUT = {
  eyebrow: "Our Story",
  heading: "Designed for a Comfortable Stay",
  body1:
    "Every room at Lotus Divine is thoughtfully designed with elegant interiors, modern comforts, and warm hospitality to make every stay relaxing.",
  body2:
    "Whether you are visiting the Golden Temple, exploring the city, or here on business — we are here to make your experience simple and memorable.",
  cta: "Our Story →",
  imgAlt: "Hotel lobby interior",
} as const;

// ─── Rooms ───────────────────────────────────────────────────────────────────

export const ROOMS_SECTION = {
  eyebrow: "Accommodation",
  headingLine1: "Our",
  headingEmphasis: "Rooms",
  viewAllCta: "View All Rooms →",
  bookBtn: "Book This Room",
  detailsLink: "View Details →",
} as const;

export const ROOMS = [
  {
    name: "The Lotus Sanctuary",
    desc: "Private plunge pool and meditation terrace overlooking the gardens.",
    price: "From ₹8,000",
  },
  {
    name: "Imperial Vista Suite",
    desc: "Panoramic views with floor-to-ceiling windows.",
    price: "From ₹15,000",
  },
] as const;

// ─── Amenities ───────────────────────────────────────────────────────────────

export const AMENITIES_SECTION = {
  eyebrow: "Hotel Amenities",
  heading: "Why Stay With Us",
} as const;

export const AMENITIES = [
  {
    label: "Golden Temple",
    desc: "Minutes from Sri Harmandir Sahib and the city's top attractions.",
  },
  {
    label: "Spacious Rooms",
    desc: "Well-designed rooms with modern amenities for a comfortable stay.",
  },
  { label: "Free Wi-Fi", desc: "Complimentary high-speed Wi-Fi throughout the hotel." },
  { label: "Secure Parking", desc: "On-site secured parking available for all guests." },
  { label: "Housekeeping", desc: "Daily housekeeping service included with every room." },
] as const;

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const GALLERY_SECTION = {
  heading: "Explore Lotus Divine",
} as const;

export const GALLERY_ALTS = {
  pool: "Hotel pool",
  spa: "Relaxation area",
  dining: "Restaurant",
  villa: "Guest room",
} as const;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const TESTIMONIAL = {
  stars: 5,
  quote: "Beautiful rooms, helpful staff, and a peaceful location near the Golden Temple.",
  attribution: "Guest Review",
} as const;

// ─── Location ────────────────────────────────────────────────────────────────

export const LOCATION_SECTION = {
  eyebrow: "Location",
  heading: "In the Heart",
  headingLine2: "of Amritsar",
  body: "Located just minutes from the Golden Temple, Lotus Divine provides easy access to the city's most popular attractions while offering a peaceful place to relax.",
  attractionsLabel: "Nearby Attractions",
  attractions: ["Golden Temple", "Jallianwala Bagh", "Partition Museum", "Hall Bazaar"],
  cta: "Get Directions →",
} as const;

// ─── CTA ─────────────────────────────────────────────────────────────────────

export const CTA = {
  eyebrow: "Book Direct",
  headingLine1: "Ready to",
  headingEmphasis: "Book",
  headingLine2: "Your Stay?",
  body: "Reserve directly with Lotus Divine for the best available rates and a smooth booking experience.",
  button: "Book Your Stay",
} as const;

// ─── Footer ──────────────────────────────────────────────────────────────────

export const FOOTER_QUICK_LINKS = [
  { label: "Home", to: "/" as const, enabled: true },
  { label: "Rooms", to: "/rooms" as const, enabled: true },
  { label: "About", to: "/about" as const, enabled: true },
  { label: "Contact", to: "/contact" as const, enabled: true },
  { label: "Book Your Stay", to: "/booking" as const, enabled: true },
] as const;

export const FOOTER_NEWSLETTER = {
  heading: "Stay in Touch",
  blurb: "Sign up for offers and updates.",
  placeholder: "Your email",
} as const;

export const FOOTER_SOCIAL = [
  { label: "Instagram", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

// ─── Rooms page ──────────────────────────────────────────────────────────────

export const ROOMS_PAGE = {
  hero: {
    eyebrow: "Our Rooms",
    headingLine1: "Comfortable Rooms",
    headingEmphasis: "for Every",
    headingLine2: "Guest.",
    body: "From couples and families to business travellers — every room at Lotus Divine is designed for a relaxing and memorable stay.",
  },
  cta: {
    eyebrow: "Book Direct",
    headingLine1: "Ready to",
    headingEmphasis: "Book",
    headingLine2: "Your Stay?",
    body: "Reserve directly with Lotus Divine for the best available rates and a smooth booking experience.",
    button: "Book Your Stay",
  },
} as const;

export const ROOMS_DETAIL = [
  {
    id: "lotus-sanctuary",
    name: "Deluxe Room",
    category: "Deluxe",
    description:
      "A well-appointed room with modern furnishings, a comfortable king-size bed, and garden views. Ideal for couples and solo travellers looking for a relaxing stay.",
    amenities: [
      "King-size bed",
      "Garden view",
      "Free Wi-Fi",
      "Smart TV",
      "Work desk",
      "En-suite bathroom",
    ],
    size: "32 sq m",
    capacity: "2 Guests",
    price: "From ₹8,000 / night",
    imageKey: "room1" as const,
    imageAlt: "Deluxe room with king-size bed and garden view",
  },
  {
    id: "imperial-vista",
    name: "Family Suite",
    category: "Suite",
    description:
      "A spacious suite with a separate living area, perfect for families and groups. Includes a comfortable lounge, two bedrooms, and modern amenities throughout.",
    amenities: [
      "Two bedrooms",
      "Separate living area",
      "Free Wi-Fi",
      "Smart TV",
      "Kitchenette",
      "En-suite bathrooms",
    ],
    size: "65 sq m",
    capacity: "Up to 4 Guests",
    price: "From ₹15,000 / night",
    imageKey: "room2" as const,
    imageAlt: "Family suite with separate living area",
  },
] as const;

// ─── About page ──────────────────────────────────────────────────────────────

export const ABOUT_PAGE = {
  hero: {
    eyebrow: "Lotus Divine · Amritsar",
    primaryHeading: "A Peaceful Stay in the Heart of Amritsar",
    secondaryHeading: "About Lotus Divine",
    body: "Minutes from the Golden Temple, Lotus Divine offers modern comfort, peaceful surroundings, and warm hospitality for every guest.",
  },
  story: {
    eyebrow: "Our Story",
    heading: "A Comfortable Stay in the Heart of Amritsar",
    body1:
      "Whether you're visiting the Golden Temple, travelling with family, or staying for business, Lotus Divine offers a peaceful place to relax after your day.",
    body2:
      "Our spacious rooms, modern comforts, and welcoming team are here to make every stay comfortable from the moment you arrive.",
    imgAlt: "Lotus Divine hotel interior",
  },
  stats: [
    { value: "5 min", label: "Golden Temple" },
    { value: "36", label: "Guest Rooms" },
    { value: "24×7", label: "Reception" },
    { value: "Free", label: "Wi-Fi" },
  ],
  features: [
    {
      label: "Minutes from the Golden Temple",
      desc: "Walk or take a short drive to Sri Harmandir Sahib.",
    },
    { label: "Spacious Rooms", desc: "Thoughtfully designed rooms with modern comforts." },
    { label: "Peaceful Location", desc: "A quiet place to relax away from busy streets." },
    { label: "Warm Hospitality", desc: "Friendly service to make every stay comfortable." },
  ],
  quote: "Comfort isn't only about the room.\nIt's about how you feel while you're here.",
  promise: {
    eyebrow: "Our Promise",
    heading: "Every Stay Matters",
    body: "From check-in to departure, we want every guest to enjoy a clean, comfortable, and relaxing stay in Amritsar.",
  },
  cta: {
    eyebrow: "Book Direct",
    body: "Book directly with Lotus Divine for the best experience and a comfortable stay in Amritsar.",
    primaryBtn: "Book Your Stay",
    secondaryBtn: "View Rooms",
  },
} as const;

// ─── Booking widget ──────────────────────────────────────────────────────────

export const BOOKING_DEFAULTS = {
  checkIn: "2026-10-12",
  checkOut: "2026-10-18",
  room: "Lotus Suite",
  guests: "2 Adults",
} as const;

export const BOOKING_ROOM_OPTIONS = ["Deluxe Room", "Family Suite"] as const;

export const BOOKING_GUEST_OPTIONS = [
  "1 Adult",
  "2 Adults",
  "2 Adults · 1 Child",
  "Family of 4",
] as const;

export const BOOKING_LABELS = {
  luxury: {
    eyebrow: "Reserve Your Room",
    guarantee: "Best Price When You Book Directly",
    guaranteeMobile: "Best Price When You Book Directly",
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
