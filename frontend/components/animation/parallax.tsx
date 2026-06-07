"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked vertical parallax (vanilla rAF, no animation library). As the
 * wrapper passes through the viewport its child translates on the Y axis,
 * creating depth on scroll. Transform-only (GPU-cheap), throttled to one update
 * per frame, and completely inert under prefers-reduced-motion.
 *
 * `speed` is the peak offset in px across one viewport pass — positive means the
 * layer drifts *up* as you scroll down. Keep it small (16–60) for a premium feel.
 */
export function Parallax({
  children,
  speed = 40,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = outer.current;
    const target = inner.current;
    if (!el || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress 0→1 as the element travels from entering bottom to leaving top.
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      const y = speed - clamped * speed * 2; // +speed → -speed
      target.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(update);
    };

    // Only listen while the element is on (or near) screen.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) onScroll();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={cn("will-change-transform")}>
        {children}
      </div>
    </div>
  );
}
