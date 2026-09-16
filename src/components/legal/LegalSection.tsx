import type { LegalSection as LegalSectionType } from "@/lib/legal";

// Matches LEGAL_OFFSET in src/lib/legal.ts — the space reserved above each
// heading for the fixed header (desktop) or header + sticky section nav (mobile).
const HEADING_SCROLL_OFFSET = "scroll-mt-[140px] min-[821px]:scroll-mt-[112px]";

export function LegalSection({ section }: { section: LegalSectionType }) {
  return (
    <section className="py-8 min-[821px]:py-10 border-b border-brown/10 last:border-b-0">
      <h2
        id={section.id}
        className={`font-display text-xl sm:text-2xl leading-snug text-brown mb-4 min-[821px]:mb-5 ${HEADING_SCROLL_OFFSET}`}
      >
        {section.heading}
      </h2>
      <div className="space-y-4 max-w-[68ch]">
        {section.blocks.map((block, i) => {
          if (block.type === "paragraph") {
            return (
              <p key={i} className="text-brown/80 text-[15px] leading-[1.75]">
                {block.text}
              </p>
            );
          }
          if (block.type === "list") {
            return (
              <ul key={i} className="space-y-3 list-disc pl-5 marker:text-gold">
                {block.items.map((item, j) => (
                  <li key={j} className="text-brown/80 text-[15px] leading-[1.75]">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <div key={i} className="text-brown/80 text-[15px] leading-[1.75]">
              {block.items.map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
