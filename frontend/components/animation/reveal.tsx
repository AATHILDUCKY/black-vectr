"use client";
import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Shared easing — a soft, premium ease-out.
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// Lets a <Reveal> know it lives inside a <RevealGroup>, so the parent can
// orchestrate the entrance + stagger instead of each child triggering on its
// own viewport intersection (cheaper, and actually staggers).
const GroupContext = React.createContext(false);

/**
 * Scroll-reveal wrapper. Fades + lifts children in once as they enter the
 * viewport. Uses only opacity/transform (GPU-composited, no layout thrash) and
 * honors prefers-reduced-motion (renders statically).
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  const inGroup = React.useContext(GroupContext);
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: EASE },
    },
  };

  // Inside a group: declare variants only and inherit hidden/show from the
  // parent, which drives the staggered entrance.
  if (inGroup) {
    return (
      <MotionTag className={className} variants={variants}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container — wrap <Reveal> children for a cascading entrance. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <GroupContext.Provider value={true}>
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren } },
        }}
      >
        {children}
      </motion.div>
    </GroupContext.Provider>
  );
}
