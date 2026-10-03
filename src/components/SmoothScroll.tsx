"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Site-wide smooth scrolling. Wheel and trackpad input is interpolated; touch
 * stays native so mobile scrolling remains directly connected to the gesture.
 * Skipped entirely for users who prefer reduced motion.
 *
 * The instance is exposed on `window.__lenis` so overlays (e.g. the mobile
 * menu) can pause/resume it while they're open.
 *
 * This lives in the root layout, so it survives App Router navigations
 * instead of remounting per page. That means its internal scroll target
 * persists across route changes too, unless we reconcile it ourselves below.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  // Reset Lenis's scroll target on real route changes so it doesn't drag a
  // new page back toward the previous page's scroll depth. Skipped on the
  // very first render (previousPathname starts equal to pathname) so direct
  // loads/refreshes - including `/rooms#deluxe` style deep links - aren't
  // forced to 0 before their own anchor logic runs. Also skipped whenever the
  // destination URL carries a hash, leaving RoomShowcase/LegalPageLayout's
  // existing anchor-scroll effects in charge of positioning the page.
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    if (window.location.hash) return;

    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
