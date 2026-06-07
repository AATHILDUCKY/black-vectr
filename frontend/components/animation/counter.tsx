"use client";
import * as React from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Animated number that counts up when scrolled into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1400, bounce: 0 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring, reduce, to]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
