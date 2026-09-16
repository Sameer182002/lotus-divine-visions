import type { LegalSection } from "@/lib/legal";

export function LegalDesktopNav({
  sections,
  activeId,
  onNavigate,
}: {
  sections: LegalSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Section navigation"
      className="hidden min-[821px]:block sticky top-[100px] self-start max-h-[calc(100vh-132px)] overflow-y-auto pr-6"
    >
      <ul>
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id} className="border-b border-brown/8 last:border-b-0">
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(section.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`relative block py-3 pl-4 text-[13px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${
                  isActive ? "text-brown font-medium" : "text-brown/45 hover:text-brown/70"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-gold"
                    aria-hidden
                  />
                )}
                {section.heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
