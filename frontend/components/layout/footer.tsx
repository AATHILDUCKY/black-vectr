import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { SOCIAL_PLATFORMS } from "@/components/ui/socials";
import type { SiteSettings } from "@/lib/types";

const FOOTER_LINKS = {
  Solutions: [
    { href: "/services/penetration-testing", label: "Penetration Testing" },
    { href: "/services/vulnerability-assessment", label: "Vulnerability Assessment" },
    { href: "/services/security-awareness-training", label: "Security Awareness" },
    { href: "/services", label: "All solutions" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Case Studies" },
    { href: "/blog", label: "Insights" },
    { href: "/projects", label: "Open Source" },
    { href: "/contact", label: "Contact Us" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const brand = settings.brandName;
  const logoMode = settings.logoMode ?? "logo_name";

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <Container className="relative z-10 pb-28 sm:pb-44 lg:pb-52">
        {/* ── Top disclaimer strip ───────────────────────────────────────── */}
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:py-10">
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            {brand} performs security testing only under signed authorization and an agreed
            scope of work. Nothing on this site is an offer to perform unauthorized testing;
            all engagements are governed by a mutual NDA and defined rules of engagement.
          </p>
          <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-foreground/70" />
            <span>
              Confidential by default ·{" "}
              <span className="font-medium text-foreground">NDA on every engagement</span>
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-border/60" />

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        {/* Phone: brand full-width, link groups 2-up to cut height. sm: 2-col.
            lg: brand + three link columns in a row. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand + registration + seals */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label={brand}
              className="mb-5 flex w-full items-center gap-2 font-display text-xl font-semibold sm:mb-6"
            >
              {/* Uses the same logo uploaded in Admin → Settings, honoring the
                  logo-display mode. Falls back to a lettermark when no logo.
                  When a logo is shown on its own it spans the column width. */}
              {logoMode !== "name" &&
                (settings.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.logoUrl}
                    alt={brand}
                    className={
                      logoMode === "logo"
                        ? "h-auto w-full max-w-[320px] object-contain"
                        : "h-12 w-auto max-w-[220px] object-contain"
                    }
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-sm text-background shadow-lg shadow-primary/30">
                    {brand.charAt(0)}
                  </span>
                ))}
              {logoMode !== "logo" && <span>{brand.toUpperCase()}</span>}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline ||
                "Offensive security and adversary emulation for modern infrastructure."}
              {settings.address ? ` Registered office: ${settings.address}.` : ""}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Copyright + socials ────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © {year} {brand}. All rights reserved. {brand} is a registered trademark.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_PLATFORMS.map(({ key, label, Icon }) => {
              const url = settings.socials?.[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </Container>

      {/* ── Giant background wordmark ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden"
      >
        <span className="block translate-y-[26%] select-none whitespace-nowrap font-display text-[20vw] font-bold leading-[0.7] tracking-tight text-foreground/[0.04]">
          {brand.toLowerCase()}
        </span>
      </div>
    </footer>
  );
}
