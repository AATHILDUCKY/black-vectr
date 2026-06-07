"use client";
import * as React from "react";
import { Github, Star, ArrowUpRight, Circle } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  wip: "In progress",
  archived: "Archived",
};

const STATUS_DOT: Record<Project["status"], string> = {
  active: "text-emerald-500",
  wip: "text-amber-500",
  archived: "text-muted-foreground",
};

export function ProjectsGrid({ items }: { items: Project[] }) {
  // Language filter — only shown when there's more than one to choose from.
  const languages = React.useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.language).filter(Boolean) as string[]))],
    [items],
  );
  const [active, setActive] = React.useState("All");
  const filtered = active === "All" ? items : items.filter((p) => p.language === active);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Projects are on the way. Check back soon.
      </p>
    );
  }

  return (
    <div>
      {languages.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActive(lang)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === lang
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((p, i) => (
          <Reveal
            as="article"
            key={p.id}
            delay={(i % 4) * 0.05}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Header: title + repo link */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-lg font-semibold tracking-tight">{p.title}</h3>
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`${p.title} source on GitHub`}
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>

            {/* Topics */}
            {p.topics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-foreground/[0.05] px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {p.language && (
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Circle className="h-2.5 w-2.5 fill-current" /> {p.language}
                </span>
              )}
              {p.stars > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" /> {p.stars.toLocaleString()}
                </span>
              )}
              {p.license && <span>{p.license}</span>}
              <span className={cn("inline-flex items-center gap-1.5", STATUS_DOT[p.status])}>
                <Circle className="h-2 w-2 fill-current" />
                <span className="text-muted-foreground">{STATUS_LABEL[p.status]}</span>
              </span>
            </div>

            {/* Attached resources */}
            {p.resources.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-2 border-t border-border/60 pt-4">
                {p.resources.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {r.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
