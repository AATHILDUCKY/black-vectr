"use client";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Thin gradient bar pinned to the top that tracks page scroll progress. Uses a
 * spring so it eases rather than jumps. Hidden when reduced motion is preferred.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent-gradient"
    />
  );
}
