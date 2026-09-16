"use client";

import { useEffect, useRef, useState } from "react";
import type { LegalSection } from "@/lib/legal";

export function LegalMobileNav({
  sections,
  activeId,
  onNavigate,
}: {
  sections: LegalSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [fade, setFade] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateFade = () => {
      setFade({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    };

    updateFade();
    el.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("resize", updateFade);
    return () => {
      el.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, [sections]);

  useEffect(() => {
    itemRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId]);

  return (
    <div className="min-[821px]:hidden sticky top-[73px] z-30 bg-ivory/95 backdrop-blur-sm border-b border-brown/10">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex overflow-x-auto whitespace-nowrap px-5 sm:px-8"
        >
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <a
                key={section.id}
                ref={(node) => {
                  itemRefs.current[section.id] = node;
                }}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(section.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 eyebrow text-[10px] tracking-[0.14em] px-4 py-4 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-gold focus-visible:-outline-offset-2 ${
                  isActive
                    ? "text-brown border-gold"
                    : "text-brown/45 border-transparent hover:text-brown/70"
                }`}
              >
                {section.heading}
              </a>
            );
          })}
        </div>
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ivory to-transparent transition-opacity duration-200 ${
            fade.left ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ivory to-transparent transition-opacity duration-200 ${
            fade.right ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      </div>
    </div>
  );
}
