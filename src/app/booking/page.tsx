import type { Metadata } from "next";
import { BookingPageClient } from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Reserve Your Suite — Lotus Divine",
  description:
    "Book your luxury suite at Lotus Divine. Direct reservations with personal concierge welcome.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
