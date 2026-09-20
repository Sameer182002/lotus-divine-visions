import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { PRIVACY_DOC } from "@/data/legalContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Hotel Lotus Divine",
  description:
    "Read the Privacy & Cookie Policy for Hotel Lotus Divine, Amritsar — what information we collect, how it's used and protected, and your rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      doc={PRIVACY_DOC}
      eyebrow="Legal"
      heading="Privacy Policy"
      identifier="Hotel Lotus Divine"
    />
  );
}
