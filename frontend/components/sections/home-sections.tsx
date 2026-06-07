import {
  Check,
  ShieldCheck,
  Radar,
  Bug,
  FileSearch,
} from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/animation/reveal";
import { Counter } from "@/components/animation/counter";
import type { Logo } from "@/lib/types";

// ── Trusted-by marquee — seamless 360° / infinite circular scroll ────────────
// Logos are managed in the admin dashboard (Admin → Logos). Falls back to a
// built-in list so the section is never empty before any are added.
const FALLBACK_LOGOS: Logo[] = [
  "Northbank",
  "Helix Health",
  "Orbital",
  "Vantage Cloud",
  "Meridian",
  "Ironclad",
  "Pendulum",
].map((name, i) => ({ id: -(i + 1), name, logo: null, url: null, order: i + 1 }));

function LogoItem({ logo }: { logo: Logo }) {
  // Show the uploaded logo image only. When no image exists yet, fall back to a
  // plain wordmark so the slot isn't empty (the name *is* the logo in that case).
  const inner = logo.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.logo}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      className="h-12 w-auto max-w-[180px] object-contain opacity-70 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 sm:h-14"
    />
  ) : (
    <span className="whitespace-nowrap font-display text-xl font-semibold text-muted-foreground/70 transition-colors duration-300 group-hover/logo:text-foreground sm:text-2xl">
      {logo.name}
    </span>
  );

  return logo.url ? (
    <a href={logo.url} target="_blank" rel="noopener noreferrer" className="logo-marquee-item group/logo">
      {inner}
    </a>
  ) : (
    <div className="logo-marquee-item group/logo">{inner}</div>
  );
}

function LogoRow({ logos, ariaHidden = false }: { logos: Logo[]; ariaHidden?: boolean }) {
  return (
    <div className="logo-marquee-segment" aria-hidden={ariaHidden}>
      {logos.map((logo) => (
        <LogoItem key={logo.id} logo={logo} />
      ))}
    </div>
  );
}

export function LogoStrip({ logos }: { logos?: Logo[] }) {
  const items = logos && logos.length > 0 ? logos : FALLBACK_LOGOS;
  return (
    <Section className="py-16">
      <Container>
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by security &amp; platform teams at
        </p>
        <div className="logo-marquee group mt-10">
          <div className="logo-marquee-track">
            <LogoRow logos={items} />
            <LogoRow logos={items} ariaHidden />
            <LogoRow logos={items} ariaHidden />
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ── Stats / value props with animated counters ───────────────────────────────
const STATS: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 1200, suffix: "+", label: "Exploitable findings proven" },
  { value: 3, prefix: "<", suffix: "h", label: "Median time to first foothold" },
  { value: 100, suffix: "%", label: "Manual, exploit-driven testing" },
  { value: 6, label: "Core offensive disciplines" },
];

export function Stats() {
  return (
    <Section className="relative bg-muted/20">
      <div className="cyber-grid pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeading
          eyebrow="By the numbers"
          title="Outcomes our customers measure"
          description="We report the outcomes that matter for an offensive engagement — exploitable risk proven, speed to impact, and fixes that hold."
        />
        <RevealGroup className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

// The "How we operate" capabilities bento moved to its own client component:
// components/sections/capabilities.tsx (animated, on-theme micro-visuals).

// ── Process / how-we-work timeline ────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: FileSearch, title: "Scope", body: "We agree objectives, rules of engagement, and scope — so testing maps to the risks you actually care about." },
  { n: "02", icon: Radar, title: "Recon", body: "We map your attack surface the way an adversary does — OSINT, asset discovery, and exposure mapping." },
  { n: "03", icon: Bug, title: "Exploit", body: "Manual, chained exploitation into demonstrable impact — with working proof-of-concept, not just scanner output." },
  { n: "04", icon: ShieldCheck, title: "Report & retest", body: "Risk-rated reporting with clear remediation — backed by a free retest to confirm every fix holds." },
];

export function Process() {
  return (
    <Section className="relative bg-muted/20">
      <Container className="relative">
        <SectionHeading
          eyebrow="How we engage"
          title="How an engagement runs"
          description="A clear, threat-informed path from scope to proof — no black boxes, measurable at every stage."
        />
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Reveal key={step.n}>
              <div className="glow-card relative h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-primary/30">{step.n}</span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

// ── Final CTA band ────────────────────────────────────────────────────────────
export function CtaBand() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="liquid-glass px-8 py-16 text-center sm:px-16 sm:py-20">
            {/* Floating depth orbs behind the glass */}
            <div className="lg-orb lg-orb-a" aria-hidden />
            <div className="lg-orb lg-orb-b" aria-hidden />
            {/* Subtle cyber grid texture */}
            <div className="cyber-grid pointer-events-none absolute inset-0 opacity-25" />
            <div className="relative mx-auto max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Free assessment
              </p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Find out where you&apos;re exposed.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Book a no-obligation security assessment. We&apos;ll map your attack surface and
                come back with a prioritized, threat-informed plan.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg">
                  Book a security assessment
                </ButtonLink>
                <ButtonLink href="/services" size="lg" variant="outline">
                  Explore our solutions
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

// ── Small value-prop checklist (used on Home + About) ────────────────────────
export function ValueProps({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
