import { CONTACT } from "@/data/siteContent";
import { buildSections, type LegalDoc } from "@/lib/legal";

// Legal copy is transcribed verbatim from the supplied source documents
// (Terms_and_Conditions_Hotel_Lotus_Divine.docx / Privacy_and_Cookie_Policy_Hotel_Lotus_Divine.docx).
// Only structure (headings/paragraphs/lists) was added — wording is untouched,
// except the "[Hotel Address]" / "[Contact Email]" / "[Contact Phone Number]"
// placeholders, which are filled with the site's real published contact details.

export const TERMS_DOC: LegalDoc = {
  title: "Terms & Conditions",
  subtitle: "Hotel Lotus Divine",
  effectiveDateLine: "Effective Date: 16 September 2026  |  www.lotusdivinehotel.com",
  sections: buildSections([
    {
      heading: "1. Acceptance of Terms",
      blocks: [
        {
          type: "paragraph",
          text: 'By making a booking with Hotel Lotus Divine ("the Hotel", "we", "us"), whether through our website, by phone, or in person, you agree to be bound by these Terms & Conditions. Please read them before completing your booking.',
        },
      ],
    },
    {
      heading: "2. The Booking Contract",
      blocks: [
        {
          type: "paragraph",
          text: "A binding contract is formed once we confirm your booking and issue a booking reference number. The Hotel reserves the right to decline or cancel any booking at its discretion.",
        },
        {
          type: "paragraph",
          text: "Bookings are non-transferable and cannot be resold. Attempting to do so may result in cancellation of the booking without refund.",
        },
      ],
    },
    {
      heading: "3. Eligibility",
      blocks: [
        {
          type: "paragraph",
          text: "The primary guest making the booking must be at least 18 years of age. Guests under 18 must be accompanied by a parent or legal guardian and cannot check in or stay unaccompanied.",
        },
        {
          type: "paragraph",
          text: "The person making the booking is responsible for ensuring that all guests included in it comply with these Terms & Conditions.",
        },
      ],
    },
    {
      heading: "4. Identification Requirements",
      blocks: [
        {
          type: "paragraph",
          text: "All guests must present a valid, original, government-issued photo ID at check-in, such as an Aadhaar Card, Driving Licence, Voter ID, or Passport. Foreign nationals must present a valid passport along with visa details, as required by law. Check-in may be declined without valid ID.",
        },
      ],
    },
    {
      heading: "5. Rates & Payment",
      blocks: [
        {
          type: "paragraph",
          text: "Room rates are as displayed on our website (www.lotusdivinehotel.com) or as communicated at the time of booking.",
        },
        {
          type: "paragraph",
          text: "Full payment is required at the time of booking to confirm your reservation.",
        },
      ],
    },
    {
      heading: "6. Check-in & Check-out",
      blocks: [
        { type: "list", items: ["Check-in: 12:00 PM (noon)", "Check-out: 11:00 AM"] },
        {
          type: "paragraph",
          text: "Early check-in or late check-out is subject to availability and may attract additional charges; please contact the Hotel in advance to request this.",
        },
      ],
    },
    {
      heading: "7. House Rules",
      blocks: [
        {
          type: "list",
          items: [
            "Smoking is not permitted anywhere on the property, including guest rooms. Violation will result in a cleaning charge and may lead to termination of the stay without refund.",
            "Pets are not allowed on the premises.",
            "Guests are responsible for any damage caused to hotel property during their stay; charges will apply.",
            "Valuables should be stored in the in-room safe where available; the Hotel is not liable for loss of cash, jewellery, or other valuables left unattended.",
            "Any unlawful activity on the premises is strictly prohibited and may result in immediate termination of stay and involvement of local authorities.",
            "Guests are expected to be respectful of other guests and hotel staff at all times.",
          ],
        },
      ],
    },
    {
      heading: "8. Right to Refuse or Terminate a Stay",
      blocks: [
        {
          type: "paragraph",
          text: "The Hotel reserves the right to refuse check-in or terminate a stay without refund in cases of guest misconduct, breach of these Terms, fraud, non-payment, or any activity that endangers the safety of other guests or staff.",
        },
      ],
    },
    {
      heading: "9. Cancellation, Modification & No-Show Policy",
      idOverride: "cancellation-policy",
      blocks: [
        {
          type: "list",
          items: [
            "Free cancellation: Cancellations made up to 24 hours before the scheduled check-in time will be fully refunded.",
            "Late cancellation: Cancellations made within 24 hours of check-in will be charged the equivalent of one night's stay.",
            "No-show: If you do not arrive and have not cancelled your booking, the full booking amount will be charged.",
            "Modifications (date/room changes): Requests made up to 24 hours before check-in are free, subject to availability, at the rate applicable at the time of modification. Requests made within 24 hours of check-in will be treated as a cancellation and charged accordingly.",
            "Refunds, where applicable, will be credited to the original mode of payment within 7–10 business days.",
          ],
        },
        {
          type: "paragraph",
          text: "Note: These timelines are the Hotel's general policy. Different terms may apply during peak periods, festive seasons, or for group bookings (5 or more rooms), which will be communicated at the time of booking.",
        },
      ],
    },
    {
      heading: "10. Governing Law",
      blocks: [
        {
          type: "paragraph",
          text: "These Terms & Conditions are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Punjab.",
        },
      ],
    },
    {
      heading: "11. Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: "For questions regarding these Terms & Conditions or your booking, please contact us at:",
        },
        {
          type: "lines",
          items: [
            "Hotel Lotus Divine",
            CONTACT.address,
            `Email: ${CONTACT.email}`,
            `Phone: ${CONTACT.phone}`,
            "Website: www.lotusdivinehotel.com",
          ],
        },
      ],
    },
  ]),
};

export const PRIVACY_DOC: LegalDoc = {
  title: "Privacy & Cookie Policy",
  subtitle: "Hotel Lotus Divine",
  effectiveDateLine: "Effective Date: 16 September 2026  |  www.lotusdivinehotel.com",
  sections: buildSections([
    {
      heading: "1. Introduction",
      blocks: [
        {
          type: "paragraph",
          text: 'At Hotel Lotus Divine ("we", "us", "the Hotel"), we respect your privacy and are committed to protecting your personal information. This Policy explains what information we collect, how we use it, and your rights, when you interact with us through our website (www.lotusdivinehotel.com), by phone, or during your stay. By using our website or hotel services, you agree to the practices described in this Policy.',
        },
      ],
    },
    {
      heading: "2. Information We Collect",
      blocks: [
        {
          type: "list",
          items: [
            "At the time of booking: your name and contact details (phone number and email address).",
            "At check-in: government-issued ID proof (such as Aadhaar Card, Driving Licence, Voter ID, or Passport), address, and any other details required for guest registration under law.",
            "During your stay: requests made to our staff (such as room service or housekeeping) and any feedback you share with us.",
            "Automatically, through our website: basic technical information such as browser type, device details, and pages visited, collected through cookies (see Section 6).",
            "From third parties: where you book through a travel agent or online booking platform, we may receive your booking details from them; and payment confirmation from our payment processing partners (we do not receive or store your full card details).",
          ],
        },
      ],
    },
    {
      heading: "3. How We Use Your Information",
      blocks: [
        { type: "paragraph", text: "We use your information to:" },
        {
          type: "list",
          items: [
            "Process and manage your booking and stay",
            "Verify your identity at check-in, as required by law",
            "Respond to your queries, requests, or feedback",
            "Comply with legal and regulatory requirements, including guest registration laws",
            "Improve our website and services",
          ],
        },
      ],
    },
    {
      heading: "4. How We Protect Your Information",
      blocks: [
        {
          type: "paragraph",
          text: "We take reasonable measures to protect your personal information, including restricting access to authorised personnel only and using secure, trusted payment gateways for processing payments.",
        },
      ],
    },
    {
      heading: "5. Children's Data",
      blocks: [
        {
          type: "paragraph",
          text: "Where a guest is under 18 years of age, we assume a parent or legal guardian is aware of and has consented to the collection of the child's information as part of the booking or stay. We do not use children's data for marketing purposes.",
        },
      ],
    },
    {
      heading: "6. Cookies & Website Usage",
      blocks: [
        {
          type: "paragraph",
          text: "Our website may use cookies to help it function properly and to understand how visitors use the site. You can disable cookies through your browser settings; this may affect certain website features, such as the online booking process.",
        },
      ],
    },
    {
      heading: "7. Data Sharing & Disclosure",
      blocks: [
        {
          type: "paragraph",
          text: "We do not sell your personal information. We may share it only:",
        },
        {
          type: "list",
          items: [
            "With trusted service providers (such as payment processors or booking platforms), strictly to complete your booking and stay",
            "When required by law, regulation, or a government or judicial authority (for example, guest registration records requested by local police, as required under Indian law)",
          ],
        },
      ],
    },
    {
      heading: "8. Data Retention",
      blocks: [
        {
          type: "paragraph",
          text: "We retain your information for as long as necessary to fulfil the purposes described in this Policy and as required under applicable law (for example, guest ID records may need to be retained for a minimum period as mandated by local regulations).",
        },
      ],
    },
    {
      heading: "9. Your Rights",
      blocks: [
        { type: "paragraph", text: "You may contact us to:" },
        {
          type: "list",
          items: [
            "Request a copy of the personal information we hold about you",
            "Request correction of inaccurate information",
            "Request deletion of your information, where this does not conflict with our legal record-keeping obligations (for instance, ID proof linked to a past stay may need to be retained by law, even if your other profile details are removed)",
          ],
        },
      ],
    },
    {
      heading: "10. Governing Law",
      blocks: [
        {
          type: "paragraph",
          text: "This Policy is governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Punjab.",
        },
      ],
    },
    {
      heading: "11. Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: "For any questions about this Privacy & Cookie Policy, or to exercise your rights above, please contact us at:",
        },
        {
          type: "lines",
          items: [
            "Hotel Lotus Divine",
            CONTACT.address,
            `Email: ${CONTACT.email}`,
            "Website: www.lotusdivinehotel.com",
          ],
        },
      ],
    },
  ]),
};
