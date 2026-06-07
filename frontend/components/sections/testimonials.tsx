import { Star, Quote } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/animation/reveal";
import type { Testimonial } from "@/lib/types";

// Show a curated set on the landing page; the full list lives elsewhere.
const MAX_SHOWN = 6;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ t }: { t: Testimonial }) {
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-gradient text-background ring-1 ring-border/70">
      {t.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.avatar}
          alt={t.name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="font-display text-sm font-bold">{initials(t.name)}</span>
      )}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const n = Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < n ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
}

/**
 * Client testimonials as a masonry grid — multiple proof points visible at once
 * (stronger social proof than a one-at-a-time carousel) and tolerant of quotes
 * of any length. Static markup (server component); entrance is handled by the
 * scroll-reveal islands, which respect prefers-reduced-motion.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const shown = items.slice(0, MAX_SHOWN);

  return (
    <Section className="relative bg-muted/20">
      <Container className="relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          description="Security and platform leaders on what actually changed after working with us."
        />

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {shown.map((t) => (
            <Reveal key={t.id} className="mb-5 break-inside-avoid">
              <figure className="glow-card flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <Stars rating={t.rating} />
                  <Quote
                    aria-hidden
                    className="h-7 w-7 shrink-0 rotate-180 fill-foreground/[0.06] text-transparent"
                  />
                </div>

                <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <Avatar t={t} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    {(t.role || t.company) && (
                      <div className="truncate text-xs text-muted-foreground">
                        {[t.role, t.company].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
