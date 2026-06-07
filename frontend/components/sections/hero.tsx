"use client";
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Bug, Swords, Crosshair } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { HeroBackground } from "@/components/sections/hero-background";
import { Parallax } from "@/components/animation/parallax";
import { ShineBorder } from "@/components/ui/shine-border";

export function Hero({
  headline,
  subheadline,
  cta,
}: {
  headline: string;
  subheadline: string;
  cta: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
      <HeroBackground />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground drop-shadow-[0_0_32px_hsl(var(--glow)/0.16)] sm:text-6xl">
            {headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04 }}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            {subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href="/contact" size="lg" className="group">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="outline">
              Explore solutions
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* Offensive-security engagement console — product preview.
            Parallax gives it subtle scroll-linked depth against the backdrop. */}
        <Parallax speed={36}>
          <SolutionsPreview reduce={!!reduce} />
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
 * whose content crossfades to the next finding — because slots never change size
 * or count, rows can't overlap each other (the previous popLayout approach let
 * exiting items pile up at the top). Each crossfade is clipped to its own slot.
 * Motion is disabled under prefers-reduced-motion.
 */
function EngagementFeed({ reduce }: { reduce: boolean }) {
  const n = FINDINGS.length;
  const [start, setStart] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStart((s) => (s + 1) % n), SCROLL_MS);
    return () => clearInterval(id);
  }, [reduce, n]);

  return (
    <ul className="space-y-2.5">
      {Array.from({ length: VISIBLE_COUNT }).map((_, slot) => {
        const f = FINDINGS[(start + slot) % n];
        return (
          <li key={slot} className="relative h-[56px] overflow-hidden rounded-lg">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={f.id}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center gap-3 rounded-lg bg-foreground/[0.03] px-3 transition-colors hover:bg-foreground/[0.06]"
              >
                <FeedRow f={f} />
              </motion.div>
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function SolutionsPreview({ reduce }: { reduce: boolean }) {
  const stats = [
    { icon: Bug, label: "Exploitable findings", value: "1,240+" },
    { icon: Swords, label: "Time to domain admin", value: "< 3h" },
    { icon: ShieldCheck, label: "Retest fix-rate", value: "100%" },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-20 max-w-6xl"
    >
      {/* Soft ambient glow — static, no animation */}
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--glow)/0.16),transparent_60%)] blur-2xl" />

      {/* Animated metallic shine frame around the console */}
      <ShineBorder
        borderRadius={18}
        borderWidth={2}
        duration={9}
        color="hsl(var(--shine))"
        className="w-full min-w-0 bg-transparent p-[2px] dark:bg-transparent"
      >
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/85 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 hidden text-xs text-muted-foreground sm:inline">Offensive Security Console</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full bg-foreground/80 ${reduce ? "" : "animate-pulse"}`} />
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
            <EngagementFeed reduce={reduce} />
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
    </motion.div>
  );
}
