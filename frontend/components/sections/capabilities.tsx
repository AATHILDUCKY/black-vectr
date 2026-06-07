"use client";

import * as React from "react";
import { Bug, Swords, Binary, ScanSearch, ShieldCheck, Radar, Check, ChevronRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

// ── Micro-visuals ────────────────────────────────────────────────────────────
// Each one illustrates the capability it sits on. Monochrome, GPU-cheap
// (opacity/transform only) CSS keyframe loops (see globals.css), and statically
// rendered under prefers-reduced-motion (neutralised globally).

/** Exploit chain: a pulse travels a chain of weaknesses into final "impact". */
function ExploitChainViz() {
  const nodes = [0, 1, 2, 3];
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="cyber-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex items-center gap-3">
        {nodes.map((i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="relative h-px w-7 overflow-hidden bg-border sm:w-9">
                <span
                  className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-transparent via-primary to-transparent motion-reduce:hidden"
                  style={{ animation: `exploit-pulse 2.4s ease-in-out ${i * 0.45}s infinite` }}
                />
              </div>
            )}
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg border text-[10px] font-semibold",
                i === nodes.length - 1
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground",
              )}
              style={{ animation: `exploit-node 2.4s ease-in-out ${i * 0.45}s infinite` }}
            >
              {i === nodes.length - 1 ? "!" : i + 1}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Lateral movement: a marker hops host-to-host across a small fleet. */
function LateralMoveViz() {
  const hosts = [0, 1, 2, 3, 4, 5];
  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-2 place-items-center gap-2 px-2">
      {hosts.map((i) => (
        <div
          key={i}
          className="relative grid h-7 w-full max-w-[44px] place-items-center rounded-md border border-border bg-card"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
          <span
            className="absolute inset-0 rounded-md border border-primary/70 bg-primary/10 opacity-0 motion-reduce:hidden"
            style={{ animation: `blink 0.9s ease-in-out ${i * 0.5}s infinite` }}
          />
        </div>
      ))}
    </div>
  );
}

/** Binary / reverse-engineering: columns of bits drifting and flickering. */
function BinaryStreamViz() {
  // Fixed patterns (no Math.random) so SSR and client match.
  const cols = ["10110", "01001", "11010", "00111", "10100", "01101"];
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 overflow-hidden font-mono text-[11px] leading-tight text-muted-foreground/70">
      {cols.map((bits, c) => (
        <div
          key={c}
          className="flex flex-col"
          style={{ animation: `bin-col ${2.6 + (c % 3) * 0.6}s ease-in-out ${c * 0.2}s infinite alternate` }}
        >
          {bits.split("").map((b, r) => (
            <span
              key={r}
              className={r === 2 ? "text-primary" : undefined}
              style={{ animation: `bin-flicker ${1.8 + (r % 3) * 0.4}s ease-in-out ${(c + r) * 0.18}s infinite` }}
            >
              {b}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Risk ranking: severity bars that re-sort, top one highlighted. */
function SeverityRankViz() {
  const bars = [
    { a: "92%", b: "64%" },
    { a: "70%", b: "88%" },
    { a: "48%", b: "40%" },
    { a: "30%", b: "22%" },
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 px-3">
      {bars.map((bar, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-foreground/30")}
              style={
                {
                  width: bar.a,
                  "--a": bar.a,
                  "--b": bar.b,
                  animation: `sev-rank 4s ease-in-out ${i * 0.3}s infinite`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Retest: a shield with a sweeping scan line, confirming the fix holds. */
function RetestShieldViz() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <span
        className="relative grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-primary"
        style={{ animation: "retest-glow 2.6s ease-in-out infinite" }}
      >
        <ShieldCheck className="h-7 w-7" />
        <span
          aria-hidden
          className="absolute inset-x-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 motion-reduce:hidden"
          style={{ top: "12%", animation: "retest-scan 2.6s ease-in-out infinite" }}
        />
      </span>
    </div>
  );
}

/** Reconnaissance: a radar sweep painting the attack surface, blips lighting up. */
function ReconRadarViz() {
  const blips = [
    { left: "64%", top: "30%", delay: 0 },
    { left: "34%", top: "58%", delay: 1.0 },
    { left: "70%", top: "64%", delay: 2.0 },
  ];
  return (
    <div className="relative grid h-full place-items-center">
      <div className="relative h-28 w-28">
        {/* concentric range rings */}
        {[112, 76, 40].map((d) => (
          <span
            key={d}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70"
            style={{ height: d, width: d }}
          />
        ))}
        {/* crosshair lines */}
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/50" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border/50" />
        {/* rotating sweep */}
        <span
          className="absolute inset-0 rounded-full motion-reduce:hidden"
          style={{
            background:
              "conic-gradient(from 0deg, hsl(var(--primary) / 0.34) 0deg, transparent 55deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 70%, transparent 71%)",
            maskImage: "radial-gradient(circle, #000 70%, transparent 71%)",
            animation: "spin 3.2s linear infinite",
          }}
        />
        {/* discovered assets */}
        {blips.map((b, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary opacity-0 shadow-[0_0_8px_hsl(var(--primary)/0.7)]"
            style={{ left: b.left, top: b.top, animation: `blip 3.2s ease-in-out ${b.delay}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Capability data ──────────────────────────────────────────────────────────
const CAPS = [
  {
    icon: Bug,
    title: "Manual, exploit-driven testing",
    tag: "Penetration Testing",
    viz: ExploitChainViz,
    body: "Certified offensive engineers go well beyond automated scanners — chaining real weaknesses into proven, demonstrable impact with working proof-of-concept.",
    points: ["Chained, multi-step exploitation", "Working proof-of-concept", "Beyond automated scanners"],
  },
  {
    icon: Swords,
    title: "Adversary emulation",
    tag: "Red Team",
    viz: LateralMoveViz,
    body: "Full-scope red-team campaigns with TTPs mapped to MITRE ATT&CK — initial access, lateral movement, and privilege escalation.",
    points: ["Mapped to MITRE ATT&CK", "Initial access → privesc", "Detection & response tested"],
  },
  {
    icon: Binary,
    title: "Deep technical analysis",
    tag: "Reverse Engineering",
    viz: BinaryStreamViz,
    body: "Binary, firmware, and malware reverse engineering to understand behavior and extract indicators of compromise.",
    points: ["Binary & firmware analysis", "Malware behavior", "IOC extraction"],
  },
  {
    icon: ScanSearch,
    title: "Risk-based prioritization",
    tag: "Vulnerability Mgmt",
    viz: SeverityRankViz,
    body: "We rank findings by real-world exploitability — EPSS, CISA KEV, and asset context — so you fix what actually matters first.",
    points: ["EPSS & CISA KEV scored", "Asset & business context", "Fix what matters first"],
  },
  {
    icon: Radar,
    title: "Reconnaissance & attack surface",
    tag: "Red Team Recon",
    viz: ReconRadarViz,
    body: "We map your external footprint the way an attacker does — OSINT, asset discovery, and exposure mapping that frames every red-team engagement.",
    points: ["OSINT & asset discovery", "External exposure mapping", "Attacker's-eye view"],
  },
  {
    icon: ShieldCheck,
    title: "Clear reporting & free retest",
    tag: "Every engagement",
    viz: RetestShieldViz,
    body: "Risk-rated reports with proof-of-concept, business impact, and step-by-step remediation — backed by a free retest to confirm every fix holds.",
    points: ["Risk-rated findings", "Step-by-step remediation", "Free retest included"],
  },
] as const;

const CYCLE_MS = 4500;

type Cap = (typeof CAPS)[number];

/** Viz + copy block shared by the desktop stage and the mobile accordion. */
function CapabilityDetail({ cap, compact = false }: { cap: Cap; compact?: boolean }) {
  const Viz = cap.viz;
  return (
    <>
      <div
        className={cn(
          "relative flex items-center justify-center",
          compact ? "py-3" : "flex-1 py-6",
        )}
      >
        <div className={cn("w-full", compact ? "h-32 max-w-[17rem]" : "h-44 max-w-sm")}>
          <Viz />
        </div>
      </div>

      <div>
        <span className="inline-flex rounded-full border border-border/70 bg-background/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {cap.tag}
        </span>
        <h3
          className={cn(
            "mt-3 flex items-center gap-2.5 font-semibold",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          <cap.icon className={cn("shrink-0 text-primary", compact ? "h-5 w-5" : "h-6 w-6")} />
          {cap.title}
        </h3>
        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{cap.body}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {cap.points.map((p) => (
            <li key={p} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * Interactive capability showcase.
 *  · Desktop (lg+): a selectable list drives a large animated "stage", and the
 *    selection auto-cycles (pausing on hover/focus).
 *  · Mobile: the list becomes an accordion — tapping an item expands its detail
 *    inline. Auto-cycle is off on mobile so the page never shifts on its own.
 * Only the active visual is mounted. Inert under prefers-reduced-motion.
 */
export function Capabilities() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Track the lg breakpoint so auto-cycle only runs in the desktop stage layout.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!isDesktop || paused || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % CAPS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [isDesktop, paused, reduce]);

  const current = CAPS[active];

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="How we operate"
          title="We attack like the adversaries you actually face"
          description="Goal-driven, manual, and evidence-based — every engagement chains real weaknesses into demonstrable impact, then hands you a clear path to fix them."
        />

        <div
          className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Selectable list (also the accordion on mobile) */}
          <Reveal className="flex flex-col gap-2.5">
            {CAPS.map((c, i) => {
              const on = i === active;
              return (
                <div key={c.title}>
                  <button
                    type="button"
                    onClick={() => setActive(on && !isDesktop ? -1 : i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={on}
                    aria-expanded={!isDesktop ? on : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
                      on
                        ? "border-primary/40 bg-card shadow-lg shadow-primary/5"
                        : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70",
                    )}
                  >
                    {/* active accent bar */}
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-r-full bg-accent-gradient transition-all duration-300",
                        on ? "h-9 opacity-100" : "h-0 opacity-0",
                      )}
                    />
                    <span className="font-display text-xs font-bold tabular-nums text-primary/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                        on
                          ? "bg-accent-gradient text-background shadow-md shadow-primary/20"
                          : "bg-muted text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold sm:text-base">
                        {c.title}
                      </span>
                      <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                        {c.tag}
                      </span>
                    </span>
                    {/* Chevron: points to the stage on desktop, rotates to a
                        caret on mobile to read as an accordion toggle. */}
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-primary transition-all duration-300",
                        on
                          ? "translate-x-0 rotate-90 opacity-100 lg:rotate-0"
                          : "-translate-x-1.5 opacity-0 lg:opacity-0",
                      )}
                    />
                  </button>

                  {/* Mobile accordion panel — CSS grid-rows height transition.
                      Desktop uses the stage instead. */}
                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden",
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="relative mt-2 overflow-hidden rounded-xl border border-border/60 bg-card/50 p-5">
                        <div
                          aria-hidden
                          className="cyber-grid pointer-events-none absolute inset-0 opacity-20"
                        />
                        <div className="relative">
                          <CapabilityDetail cap={c} compact />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>

          {/* Animated stage — desktop only */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="relative h-full min-h-[26rem] overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
              {/* backdrop */}
              <div aria-hidden className="cyber-grid pointer-events-none absolute inset-0 opacity-25" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--glow)/0.14),transparent_65%)]"
              />

              {/* auto-advance progress bar — restarts on each active change via key */}
              {!reduce && !paused && isDesktop && active >= 0 && (
                <span
                  key={`progress-${active}`}
                  aria-hidden
                  className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-accent-gradient"
                  style={{ animation: `stage-progress ${CYCLE_MS}ms linear` }}
                />
              )}

              {current && (
                <div
                  key={`stage-${active}`}
                  className="relative flex h-full flex-col p-7 sm:p-9 motion-safe:animate-[enter-up_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                >
                  <CapabilityDetail cap={current} />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
