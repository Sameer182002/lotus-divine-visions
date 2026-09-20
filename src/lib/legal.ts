export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "lines"; items: string[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  subtitle: string;
  effectiveDateLine: string;
  sections: LegalSection[];
};

// Shared with the IntersectionObserver rootMargin and the heading scroll-margin
// classes, so the "current section" highlight and the anchor-scroll landing
// spot are always derived from the same numbers.
export const LEGAL_OFFSET = { mobile: 140, desktop: 112 } as const;

export function slugify(heading: string): string {
  return heading
    .replace(/^\d+\.\s*/, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildSections(
  raw: { heading: string; blocks: LegalBlock[]; idOverride?: string }[],
): LegalSection[] {
  return raw.map(({ heading, blocks, idOverride }) => ({
    id: idOverride ?? slugify(heading),
    heading,
    blocks,
  }));
}
