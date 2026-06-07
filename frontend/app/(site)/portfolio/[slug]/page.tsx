import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingUp } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { OptimizedImage } from "@/components/optimized-image";
import { Reveal } from "@/components/animation/reveal";
import { getPortfolio, getPortfolioItem } from "@/lib/api";

export async function generateStaticParams() {
  const items = await getPortfolio();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);
  if (!item) return { title: "Case study not found" };
  return { title: item.title, description: item.summary };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);
  if (!item) notFound();

  return (
    <Section className="pt-32 sm:pt-40">
      <Container className="max-w-3xl">
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All work
        </Link>
        <Reveal>
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            {item.category}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {item.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Client: {item.client}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-accent-gradient">
            {item.images[0] ? (
              <OptimizedImage
                src={item.images[0]}
                alt={item.title}
                className="h-full w-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 768px"
                priority
              />
            ) : (
              <span className="font-display text-5xl font-bold text-background/90">{item.client}</span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>{item.summary}</p>
        </Reveal>

        {item.results && (
          <Reveal delay={0.2}>
            <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-6">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <h2 className="font-semibold">Results</h2>
              </div>
              <p className="text-sm text-muted-foreground">{item.results}</p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/contact" size="lg">
            Start a similar project
          </ButtonLink>
          {item.link && (
            <ButtonLink href={item.link} target="_blank" variant="outline" size="lg">
              Visit site <ExternalLink className="h-4 w-4" />
            </ButtonLink>
          )}
        </Reveal>
      </Container>
    </Section>
  );
}
