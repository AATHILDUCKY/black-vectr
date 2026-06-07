import * as React from "react";
import { cn } from "@/lib/utils";

// ── Container ───────────────────────────────────────────────────────────────
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-px", className)} {...props} />;
}

// ── Section ─────────────────────────────────────────────────────────────────
export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-16 sm:py-24", className)} {...props} />;
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

// ── Eyebrow + heading helper for section intros ──────────────────────────────
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
