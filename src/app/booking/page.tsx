import type { Metadata } from "next";
import { BookingPageClient } from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Reserve Your Stay — Lotus Divine",
  description: "Reserve your room at Lotus Divine. Best rate guaranteed when you book direct.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
