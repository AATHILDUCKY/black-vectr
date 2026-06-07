"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a soft spotlight that follows the cursor. Pointer position is written
 * to CSS variables (no React re-render per move), and the glow is layered on top
 * of the shared `.glow-card` gradient-hairline treatment for a premium feel.
 */
export function SpotlightCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "glow-card group relative h-full overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary) / 0.12), transparent 60%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
