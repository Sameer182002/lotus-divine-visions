"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scrollspy for the legal pages' section nav. Uses IntersectionObserver
 * (no per-frame scroll listener) — a section becomes "active" once it
 * crosses just below the fixed header/nav, and stays active until the next
 * one does. `offset` should match the heading's scroll-margin-top so the
 * highlighted item always agrees with where an anchor click would land.
 */
export function useActiveLegalSection(ids: string[], offset: number) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const visible = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (ids.length === 0) return;

    visible.current = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        });
        const found = ids.filter((id) => visible.current.has(id));
        if (found.length > 0) setActiveId(found[found.length - 1]);
      },
      { rootMargin: `-${offset}px 0px -65% 0px`, threshold: 0 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
