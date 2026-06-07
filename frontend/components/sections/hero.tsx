"use client";
import * as React from "react";
import { ArrowRight, ShieldCheck, Bug, Swords, Crosshair } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { HeroBackground } from "@/components/sections/hero-background";
import { Parallax } from "@/components/animation/parallax";
import { ShineBorder } from "@/components/ui/shine-border";

// CSS entrance helper — fades + lifts in with a per-element delay (no JS lib).
// Keyframe `enter-up` + reduced-motion handling live in globals.css.
const enter = (delay = 0): React.CSSProperties => ({
  animation: "enter-up 0.55s ease-out both",
  animationDelay: delay ? `${delay}s` : undefined,
});

export function Hero({
  headline,
  subheadline,
  cta,
}: {
  headline: string;
  subheadline: string;
  cta: string;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
      <HeroBackground />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground drop-shadow-[0_0_32px_hsl(var(--glow)/0.16)] sm:text-6xl">
            {headline.split(" ").map((word, i) => (
              <span key={i} className="inline-block" style={enter(0.1 + i * 0.04)}>
                {word}&nbsp;
              </span>
            ))}
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
            style={enter(0.5)}
          >
            {subheadline}
          </p>
          <div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={enter(0.65)}
          >
            <ButtonLink href="/contact" size="lg" className="group">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="outline">
              Explore solutions
            </ButtonLink>
          </div>
        </div>

        {/* Offensive-security engagement console — product preview.
            Parallax gives it subtle scroll-linked depth against the backdrop. */}
        <Parallax speed={36}>
          <SolutionsPreview />
        </Parallax>
      </Container>
    </section>
  );
}

// Each finding maps to one of our solutions, so the feed doubles as a snapshot
// of what we actually do.
type Finding = { id: string; tag: string; text: string; level: string; meta: string };

const FINDINGS: Finding[] = [
  // Penetration Testing
  { id: "rce", tag: "Penetration Testing", text: "RCE chained on payments API → admin takeover", level: "critical", meta: "PoC" },
  // Red Team
  { id: "kerb", tag: "Red Team Ops", text: "Domain admin via Kerberoasting · undetected", level: "critical", meta: "2h" },
  // Vulnerability Assessment
  { id: "triage", tag: "Vulnerability Assessment", text: "412 findings validated · false-positives removed", level: "medium", meta: "triaged" },
  // Reverse Engineering
  { id: "loader", tag: "Reverse Engineering", text: "Loader unpacked · 7 IOCs extracted", level: "info", meta: "report" },
  // Security Awareness
  { id: "phish", tag: "Security Awareness", text: "Phishing sim · click-through 18% → 3%", level: "medium", meta: "30d" },
  // Vulnerability Management
  { id: "s3", tag: "Vulnerability Mgmt", text: "Public S3 bucket · 1.2M records exposed", level: "high", meta: "fixed" },
  // Red Team
  { id: "acl", tag: "Red Team Ops", text: "AD ACL abuse · DCSync achieved", level: "critical", meta: "PoC" },
  // Penetration Testing
  { id: "idor", tag: "Penetration Testing", text: "IDOR exposed 240k customer records", level: "high", meta: "PoC" },
  // Reverse Engineering
  { id: "ransom", tag: "Reverse Engineering", text: "Ransomware reversed · decryption keys recovered", level: "high", meta: "keys" },
  // Vulnerability Management
  { id: "kev", tag: "Vulnerability Mgmt", text: "6 CISA KEV vulns prioritized · patched in 48h", level: "high", meta: "patched" },
  // Red Team
  { id: "c2", tag: "Red Team Ops", text: "Phishing → C2 beacon · EDR evaded", level: "critical", meta: "evaded" },
  // Penetration Testing
  { id: "jwt", tag: "Penetration Testing", text: "JWT alg-confusion → authentication bypass", level: "critical", meta: "bypass" },
  // Vulnerability Assessment
  { id: "asm", tag: "Vulnerability Assessment", text: "External attack surface mapped · 38 exposures", level: "medium", meta: "mapped" },
  // Security Awareness
  { id: "train", tag: "Security Awareness", text: "1,200 staff trained · report rate up 4×", level: "info", meta: "4×" },
  // Reverse Engineering
  { id: "fw", tag: "Reverse Engineering", text: "IoT firmware · hardcoded creds & backdoor found", level: "medium", meta: "creds" },
  // Penetration Testing
  { id: "ssrf", tag: "Penetration Testing", text: "SSRF → cloud metadata creds stolen", level: "critical", meta: "creds" },
  // Vulnerability Management
  { id: "backlog", tag: "Vulnerability Mgmt", text: "Critical exposure backlog cut 84% in 2 quarters", level: "info", meta: "−84%" },
];

const LEVEL_COLOR: Record<string, string> = {
  critical: "bg-foreground",
  high: "bg-foreground/70",
  medium: "bg-foreground/45",
  info: "bg-foreground/25",
};

const VISIBLE_COUNT = 4;
const SCROLL_MS = 3500; // how often the feed advances by one item

function FeedRow({ f }: { f: Finding }) {
  return (
    <>
      <span className={`h-2 w-2 shrink-0 rounded-full ${LEVEL_COLOR[f.level]}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{f.text}</p>
        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{f.tag}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{f.meta}</span>
    </>
  );
}

/**
 * Engagement feed: a slow auto-advancing ticker. Each row is a FIXED-HEIGHT slot
 * whose content fades to the next finding. Keying the inner element by finding id
 * remounts it on change, replaying the CSS `feed-in` entrance. Auto-advance is
 * paused under prefers-reduced-motion.
 */
function EngagementFeed() {
  const n = FINDINGS.length;
  const [start, setStart] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStart((s) => (s + 1) % n), SCROLL_MS);
    return () => clearInterval(id);
  }, [n]);

  return (
    <ul className="space-y-2.5">
      {Array.from({ length: VISIBLE_COUNT }).map((_, slot) => {
        const f = FINDINGS[(start + slot) % n];
        return (
          <li key={slot} className="relative h-[56px] overflow-hidden rounded-lg">
            <div
              key={f.id}
              className="absolute inset-0 flex items-center gap-3 rounded-lg bg-foreground/[0.03] px-3 transition-colors hover:bg-foreground/[0.06] motion-safe:animate-[feed-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
            >
              <FeedRow f={f} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SolutionsPreview() {
  const stats = [
    { icon: Bug, label: "Exploitable findings", value: "1,240+" },
    { icon: Swords, label: "Time to domain admin", value: "< 3h" },
    { icon: ShieldCheck, label: "Retest fix-rate", value: "100%" },
  ];

  return (
    <div
      className="relative mx-auto mt-20 max-w-6xl"
      style={{ animation: "enter-up 0.7s ease-out both", animationDelay: "0.5s" }}
    >
      {/* Soft ambient glow — static, no animation */}
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--glow)/0.16),transparent_60%)] blur-2xl" />

      {/* Animated metallic shine frame around the console */}
      <ShineBorder
        borderRadius={18}
        borderWidth={2}
        duration={9}
        color="hsl(var(--shine))"
        className="w-full min-w-0 bg-transparent p-[2px]"
      >
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/85 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 hidden text-xs text-muted-foreground sm:inline">Offensive Security Console</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/80 motion-safe:animate-pulse" />
            Engagement active
          </span>
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr]">
          {/* engagement feed */}
          <div className="p-5 sm:p-7 md:border-r md:border-border/50">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Engagement feed</p>
              <Crosshair className="h-4 w-4 text-muted-foreground" />
            </div>
            <EngagementFeed />
          </div>

          {/* outcome stats */}
          <div className="flex flex-col divide-y divide-border/50">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-1 items-center gap-3 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-gradient text-background">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom progressive blur + fade — the console gently recedes into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_bottom,transparent_25%,#000)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_25%,#000)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent,#000)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-background/30 to-background/85"
        />
      </div>
      </ShineBorder>
    </div>
  );
}
