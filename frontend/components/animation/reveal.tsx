"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal — fades + lifts children in once as they enter the viewport.
 * Pure CSS transitions driven by a single IntersectionObserver per reveal (no
 * animation library): the element starts translated/transparent and gets
 * `data-shown="true"` when it scrolls into view; the `.reveal` CSS class (see
 * globals.css) animates the rest. GPU-composited (opacity/transform only) and
 * inert under prefers-reduced-motion.
 */

// Fire once, slightly before the element is fully in view.
const OBSERVER_OPTS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -8% 0px",
};

function useRevealOnce<T extends HTMLElement>(enabled = true) {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.shown = "true";
          obs.unobserve(entry.target);
        }
      }
    }, OBSERVER_OPTS);
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);
  return ref;
}

// Lets a <Reveal> know it lives inside a <RevealGroup>, so the group's single
// observer + stagger drive the entrance instead of each child observing itself.
const GroupContext = React.createContext(false);

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const inGroup = React.useContext(GroupContext);

  // Inside a group: render only the caller's wrapper (preserving className for
  // layout) — the group provides the animated `.reveal` wrapper around us.
  if (inGroup) {
    return <Tag className={className}>{children}</Tag>;
  }

  const ref = useRevealOnce<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={
        {
          "--reveal-y": `${y}px`,
          transitionDelay: delay ? `${delay * 1000}ms` : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered container — one observer reveals the whole group; each direct child
 * is wrapped in a `.reveal` element with an incremental transition-delay so they
 * cascade in. `stagger` / `delayChildren` are in seconds (unchanged API).
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.05,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const ref = useRevealOnce<HTMLDivElement>();
  const items = React.Children.toArray(children);
  return (
    <GroupContext.Provider value={true}>
      <div ref={ref} className={cn("reveal-group", className)}>
        {items.map((child, i) => (
          <div
            key={i}
            className="reveal"
            style={{ transitionDelay: `${delayChildren + i * stagger}s` }}
          >
            {child}
          </div>
        ))}
      </div>
    </GroupContext.Provider>
  );
}
