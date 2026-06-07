"use client";

import * as React from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Momentum/inertia smooth scrolling for the public site (Lenis).
 *
 * Lenis drives the native window scroll, so anything that reads `window.scrollY`
 * — the scroll progress bar, the back-to-top button, Framer's `useScroll` — keeps
 * working unchanged. We just layer a smoothed, eased wheel feel on top.
 *
 * Honors `prefers-reduced-motion`: when the user asks for less motion we don't
 * initialize Lenis at all and fall back to the browser's native scroll.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      // easeOutExpo — quick to start, long buttery tail.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Leave touch devices on native scroll — it already feels right there.
      touchMultiplier: 1.5,
    });

    // Expose the instance so chrome like the back-to-top button can scroll
    // through Lenis instead of fighting it with a native (now-instant) scroll.
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
      delete window.__lenis;
    };
  }, []);

  return null;
}
