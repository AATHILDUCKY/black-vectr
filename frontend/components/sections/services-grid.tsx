import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/animation/reveal";
import { ServiceIcon } from "@/components/icon";
import type { Service } from "@/lib/types";

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Reveal key={s.id}>
          <Link
            href={`/services/${s.slug}`}
            className="glow-card group flex h-full flex-col p-7 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-background shadow-lg shadow-primary/20">
              <ServiceIcon name={s.icon} className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.shortDescription}</p>

            {s.features?.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-border pt-5">
                {s.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Learn more
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </Reveal>
      ))}
    </RevealGroup>
  );
}
