"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PortfolioGrid({
  items,
  enableFilter = true,
}: {
  items: PortfolioItem[];
  enableFilter?: boolean;
}) {
  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [active, setActive] = React.useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {enableFilter && categories.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
          >
            <Link
              href={`/portfolio/${item.slug}`}
              className="card-elevated group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-accent-gradient">
                {item.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-display text-3xl font-bold text-background/90">
                    {item.client}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    {item.category}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
