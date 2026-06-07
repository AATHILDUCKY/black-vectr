/**
 * Premium hero backdrop for the monochrome security theme — pure CSS, no WebGL,
 * no JS: a faint technical grid, a soft light column breathing behind the
 * headline, two drifting orbs for depth, and an occasional comet streak, all
 * seated into the page with a vignette. Motion is disabled globally under
 * prefers-reduced-motion (see globals.css), so this needs no client JS.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="hero-atmosphere pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash + technical grid */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 cyber-grid" />

      {/* Light column pouring from the top, breathing softly behind the headline */}
      <div className="absolute left-1/2 top-[-8%] h-[62%] w-[40rem] max-w-[92vw] -translate-x-1/2 blur-2xl bg-[radial-gradient(50%_100%_at_50%_0%,hsl(var(--glow)/0.22),hsl(var(--accent)/0.10)_38%,transparent_72%)] motion-safe:animate-pulse-glow" />

      {/* Two faint drifting orbs for depth */}
      <div className="absolute left-[16%] top-[22%] h-56 w-56 rounded-full blur-3xl bg-[radial-gradient(circle,hsl(var(--glow)/0.10),transparent_70%)] motion-safe:animate-float" />
      <div className="absolute right-[14%] top-[34%] h-64 w-64 rounded-full blur-3xl bg-[radial-gradient(circle,hsl(var(--accent)/0.10),transparent_70%)] motion-safe:animate-float [animation-delay:1.8s]" />

      {/* Occasional comet streak */}
      <div className="galaxy-comet motion-safe:animate-comet" />

      {/* Thin accent hairline + bottom vignette to seat everything into the page */}
      <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      <div className="hero-grid-vignette absolute inset-0" />
    </div>
  );
}
