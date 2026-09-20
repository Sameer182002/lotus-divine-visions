"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDesktopNav } from "@/components/legal/LegalDesktopNav";
import { LegalMobileNav } from "@/components/legal/LegalMobileNav";
import { LegalSection } from "@/components/legal/LegalSection";
import { useActiveLegalSection } from "@/hooks/useActiveLegalSection";
import { LEGAL_OFFSET, type LegalDoc } from "@/lib/legal";

// Scrolls to `id`, relying on lenis.scrollTo (or scrollIntoView when lenis
// isn't running — e.g. reduced-motion) to honour each heading's own
// scroll-margin-top rather than duplicating that offset in JS.
function goToSection(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { immediate });
  } else {
    el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}

export function LegalPageLayout({
  doc,
  eyebrow,
  heading,
  identifier,
}: {
  doc: LegalDoc;
  eyebrow: string;
  /** Hero H1 — may differ from doc.title (e.g. "Privacy Policy" vs. the
   * document's own "Privacy & Cookie Policy" title used in the footer link). */
  heading: string;
  identifier?: string;
}) {
  const ids = useMemo(() => doc.sections.map((s) => s.id), [doc.sections]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 821px)");
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const offset = isDesktop ? LEGAL_OFFSET.desktop : LEGAL_OFFSET.mobile;
  const activeId = useActiveLegalSection(ids, offset);

  // Direct URL / refresh with a hash: land on the right section, offset
  // correctly, without waiting for the user to click anything. Lenis only
  // knows the real scrollable height once it has measured the page, and
  // until then it clamps any scrollTo back to 0 — so wait for that
  // measurement (lenis.limit > 0) instead of guessing a fixed delay.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
      attempts += 1;
      const lenis = window.__lenis;
      const ready = !lenis || lenis.limit > 0;
      if (ready || attempts >= maxAttempts) {
        goToSection(hash, true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
    // Runs once per page mount — re-running on `ids`/`offset` change would
    // re-trigger the jump after the user has already scrolled elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNavigate(id: string) {
    window.history.pushState(null, "", `#${id}`);
    goToSection(id);
  }

  return (
    <main className="bg-ivory text-brown overflow-x-clip">
      <Header />
      <LegalHero eyebrow={eyebrow} heading={heading} identifier={identifier} />

      <LegalMobileNav sections={doc.sections} activeId={activeId} onNavigate={handleNavigate} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-20 py-10 min-[821px]:py-14 min-[821px]:grid min-[821px]:grid-cols-[26%_1fr] min-[821px]:gap-16">
        <LegalDesktopNav sections={doc.sections} activeId={activeId} onNavigate={handleNavigate} />

        <div className="min-w-0">
          {doc.effectiveDateLine && (
            <p className="eyebrow text-brown/40 text-[10px] mb-8 min-[821px]:mb-10">
              {doc.effectiveDateLine}
            </p>
          )}
          {doc.sections.map((section) => (
            <LegalSection key={section.id} section={section} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
