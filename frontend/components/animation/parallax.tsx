"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked vertical parallax. As the wrapper passes through the viewport,
 * its children translate on the Y axis, creating depth on scroll. It reads the
 * native scroll position (so it composes with Lenis smooth scroll), animates
 * transform only (GPU-cheap), and is completely inert under
 * prefers-reduced-motion.
 *
 * `speed` is the peak offset in px applied across one viewport pass — positive
 * means the layer drifts *up* as you scroll down (it recedes). Keep it small
 * (16–60) for a premium, non-distracting feel. Nest this around content that
 * already has its own entrance animation: the outer wrapper owns the scroll
 * transform, the inner element owns the entrance, so the two never fight over
 * `transform`.
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
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const y = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.3 });

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduce ? undefined : { y }}
        className={cn(!reduce && "will-change-transform")}
      >
        {children}
      </motion.div>
    </div>
  );
}
