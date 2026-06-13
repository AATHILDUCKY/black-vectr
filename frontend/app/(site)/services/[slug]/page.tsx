import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/icon";
import { CtaBand } from "@/components/sections/home-sections";
import { Reveal } from "@/components/animation/reveal";
import { getService, getServices } from "@/lib/api";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <Container className="max-w-4xl">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <Reveal>
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient text-background">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </div>
            <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{service.shortDescription}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>{service.longDescription}</p>
          </Reveal>

          {service.features.length > 0 && (
            <Reveal delay={0.15} className="mt-10">
              <h2 className="mb-4 text-lg font-semibold">What’s included</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href="/contact" size="lg">
              Discuss your project
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
