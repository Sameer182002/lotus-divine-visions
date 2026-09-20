import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { TERMS_DOC } from "@/data/legalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hotel Lotus Divine",
  description:
    "Read the Terms & Conditions for booking and staying at Hotel Lotus Divine, Amritsar — covering bookings, check-in, house rules, and cancellations.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPageLayout
      doc={TERMS_DOC}
      eyebrow="Legal"
      heading="Terms & Conditions"
      identifier="Hotel Lotus Divine"
    />
  );
}
