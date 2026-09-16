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
  address: "1804, Katra Ahluwalia, Amritsar, Amritsar Cantt., Punjab 143001",
  addressLines: ["1804, Katra Ahluwalia", "Amritsar, Amritsar Cantt.", "Punjab 143001"],
  addressShort: "Amritsar",
  phone: "+91 84379 66966",
  phoneDisplay: "Reservations · +91 84379 66966",
  email: "lotusdivinehotel@gmail.com",
} as const;

// Same Maps destination used by the "Get Directions" CTA in LocationSection.
export const CONTACT_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `Lotus Divine Hotel, ${CONTACT.address}`,
)}`;

// Embeddable version of the same destination — powers the interactive map on
// the Contact page. Needs no API key.
export const CONTACT_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `Lotus Divine Hotel, ${CONTACT.address}`,
)}&z=16&output=embed`;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home", to: "/" as const, enabled: true },
  { label: "Rooms", to: "/rooms" as const, enabled: true },
  { label: "About Us", to: "/about-us" as const, enabled: true },
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
  headingLine1: "Stay Close to the",
  headingLine2: "Heart of Amritsar.",
  body: "A peaceful, comfortable stay in the heart of Amritsar, close to Sri Harmandir Sahib.",
  // Location-proximity story: hotel → short walk → Golden Temple.
  // The walking-time claim lives only here, so it is a one-line edit.
  journey: {
    walkMinutes: 5,
    walkLabel: "min walk",
    walkNote: "approx. on foot",
    originName: "Hotel Lotus Divine",
    originCaption: "Your stay",
    destinationLabel: "Golden Temple",
    destinationName: "Sri Harmandir Sahib",
    ariaLabel:
      "Hotel Lotus Divine is approximately a five-minute walk from the Golden Temple, Sri Harmandir Sahib.",
  },
  logoAlt: "Hotel Lotus Divine",
} as const;

// ─── About ───────────────────────────────────────────────────────────────────

export const ABOUT = {
  eyebrow: "Our Story",
  heading: "Designed for a Comfortable Stay",
  body1:
    "Every room at Lotus Divine is thoughtfully designed with elegant interiors, modern comforts, and warm hospitality to make every stay relaxing.",
  body2:
    "Whether you are visiting the Golden Temple, exploring the city, or here on business — we are here to make your experience simple and memorable.",
  cta: "Read More →",
  imgAlt: "Hotel Lotus Divine entrance, Amritsar",
} as const;

// ─── Rooms ───────────────────────────────────────────────────────────────────

export const ROOMS_SECTION = {
  eyebrow: "Accommodation",
  headingLine1: "Our",
  headingEmphasis: "Rooms",
  viewAllCta: "View All Rooms →",
  sizeLabel: "Size",
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
    label: "Heart of the City",
    desc: "Markets, eateries, and everyday essentials all within walking distance.",
  },
  {
    label: "Spacious Rooms",
    desc: "Well-designed rooms with modern amenities for a comfortable stay.",
  },
  {
    label: "Best-Located Hotel",
    desc: "Among the best-located hotels near Sri Harmandir Sahib.",
  },
  {
    label: "Iconic Sites Nearby",
    desc: "Walking distance to Jallianwala Bagh and the Partition Museum.",
  },
] as const;

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const GALLERY_SECTION = {
  heading: "Explore Lotus Divine",
} as const;

export const GALLERY_ALTS = {
  entrance: "Hotel entrance",
  reception: "Reception area",
  deluxe: "Deluxe room",
  insideRoom: "Inside a guest room",
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
  { label: "About Us", to: "/about-us" as const, enabled: true },
  { label: "Contact", to: "/contact" as const, enabled: true },
  { label: "Book Your Stay", to: "/booking" as const, enabled: true },
] as const;

export const FOOTER_NEWSLETTER = {
  heading: "Stay in Touch",
  blurb: "Sign up for offers and updates.",
  placeholder: "Your email",
} as const;

export const FOOTER_LEGAL_LINKS = [
  { label: "Terms & Conditions", to: "/terms-conditions" as const, enabled: true },
  { label: "Cancellation Policy", to: "/terms-conditions#cancellation-policy" as const, enabled: true },
  { label: "Privacy & Cookie Policy", to: "/privacy-policy" as const, enabled: true },
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

const ROOM_AMENITIES = [
  "King-size bed",
  "Air conditioning",
  "Free Wi-Fi",
  "Smart TV",
  "Work desk & chair",
  "Wardrobe with hangers",
  "Blackout curtains",
  "24-hour hot & cold water",
] as const;

// Single source of truth for room content — feeds the booking flow and the
// room detail page. ROOMS_CARDS (below) is derived from this, so the
// homepage "Our Rooms" section can never drift out of sync with it.
export const ROOMS_DETAIL = [
  {
    id: "lotus-sanctuary",
    name: "Deluxe",
    category: "Deluxe",
    description:
      "A comfortable, well-appointed room with a king-size bed and everything you need for a relaxing stay near the Golden Temple.",
    amenities: ROOM_AMENITIES,
    size: "11 × 12 FT",
    capacity: "2 Guests",
    price: "From ₹1,500 / night",
    imageKey: "room1" as const,
    imageAlt: "Deluxe room at Lotus Divine",
  },
  {
    id: "imperial-vista",
    name: "Premium",
    category: "Premium",
    description:
      "A more spacious room with a king-size bed, ideal if you want extra room to relax.",
    amenities: ROOM_AMENITIES,
    size: "15 × 12 FT",
    capacity: "Up to 4 Guests",
    price: "From ₹2,000 / night",
    imageKey: "room2" as const,
    imageAlt: "Premium room at Lotus Divine",
  },
] as const;

// Cards for the homepage "Our Rooms" section — derived from ROOMS_DETAIL
// so renaming/re-pricing a room only ever needs to happen in one place.
export const ROOMS_CARDS = ROOMS_DETAIL.map(({ id, name, size, price, imageAlt }) => ({
  id,
  name,
  size,
  price,
  imageAlt,
}));

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

// ─── Contact page ────────────────────────────────────────────────────────────

export const CONTACT_PAGE = {
  hero: {
    eyebrow: "Contact",
    heading: "Contact Lotus Divine",
    body: "Planning your stay or need help with a reservation? We're happy to assist with bookings and enquiries.",
  },
  location: {
    eyebrow: "Find Us",
    heading: "Visit Us in",
    headingEmphasis: "Amritsar",
    body: "Located close to Sri Harmandir Sahib and central Amritsar.",
    cta: "Get Directions →",
  },
  nearby: {
    eyebrow: "Nearby",
    heading: "Nearby Attractions",
    places: [
      { label: "Golden Temple", time: "5 min", mode: "Walk" },
      { label: "Jallianwala Bagh", time: "8 min", mode: "Walk" },
      { label: "Partition Museum", time: "10 min", mode: "Walk" },
      { label: "Hall Bazaar", time: "10 min", mode: "Walk" },
      { label: "Amritsar Airport", time: "20 min", mode: "Drive" },
    ],
  },
  cta: {
    eyebrow: "Reservations",
    heading: "Need Help With Your Booking?",
    body: "Reserve directly with Lotus Divine for a simple booking experience.",
    primaryBtn: "Book Your Stay",
    secondaryBtn: "Call Hotel",
  },
} as const;

// ─── Booking widget ──────────────────────────────────────────────────────────

export const BOOKING_DEFAULTS = {
  checkIn: "",
  checkOut: "",
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
  hero: {
    eyebrow: "Reserve Your Room",
    guarantee: "Best price when you book directly",
    button: "Book Rooms",
    buttonSticky: "Book Now",
  },
  luxury: {
    eyebrow: "Reserve Your Room",
    guarantee: "Best Price When You Book Directly",
    guaranteeMobile: "Best Price When You Book Directly",
    button: "Book Rooms",
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
