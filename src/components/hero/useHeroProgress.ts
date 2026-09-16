"use client";

import { useEffect, type RefObject } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Writes a 0 → 1 scroll progress into `--p` on the hero section.
 * The hero is a tall section with a pinned (sticky) canvas at every breakpoint;
 * progress is how far the section has scrolled beyond the canvas height.
 */
export function useHeroProgress(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(REDUCED_QUERY);
    let frame = 0;
    let settle = 0;
    let last = -1;
    let target = 0;
    let current = 0;

    const write = (p: number) => {
      const v = Math.round(p * 1000) / 1000;
      if (v === last) return;
      last = v;
      section.style.setProperty("--p", String(v));
    };

    // Ease the displayed progress toward the scroll-derived target so small
    // wheel/touch deltas don't produce visible steps. Runs only until settled.
    const EASE = 0.14;
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0008) {
        current = target;
        write(current);
        settle = 0;
        return;
      }
      current += diff * EASE;
      write(current);
      settle = requestAnimationFrame(tick);
    };

    const measure = () => {
      if (reduced.matches) {
        target = current = 1;
        write(1);
        return;
      }
      const rect = section.getBoundingClientRect();
      const canvas = section.firstElementChild as HTMLElement | null;
      const range = rect.height - (canvas?.offsetHeight ?? window.innerHeight);
      target = range > 0 ? clamp(-rect.top / range) : 1;
      if (!settle) settle = requestAnimationFrame(tick);
    };

    // Resize/media changes are coalesced to one measurement per frame.
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    // Initial state renders without easing so the load frame is stable.
    measure();
    current = target;
    write(current);

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (settle) cancelAnimationFrame(settle);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [sectionRef]);
}

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}
