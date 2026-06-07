import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { Capabilities } from "@/components/sections/capabilities";
import {
  LogoStrip,
  Stats,
  Process,
  CtaBand,
} from "@/components/sections/home-sections";
import {
  getServices,
  getPortfolio,
  getTestimonials,
  getSettings,
  getLogos,
} from "@/lib/api";

export default async function HomePage() {
  const [settings, services, portfolio, testimonials, logos] = await Promise.all([
    getSettings(),
    getServices(),
    getPortfolio(),
    getTestimonials(),
    getLogos(),
  ]);

  const featured = portfolio.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Hero
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        cta={settings.heroCta}
      />

      <LogoStrip logos={logos} />

      <Section id="solutions">
        <Container>
          <SectionHeading
            eyebrow="Solutions"
            title="Offensive security that finds what attackers would"
            description="Penetration testing, red teaming, vulnerability assessment and management, reverse engineering, and security awareness — hands-on services for enterprises and individuals."
          />
          <div className="mt-12">
            <ServicesGrid services={services} />
          </div>
        </Container>
      </Section>

      <Stats />

      <Capabilities />

      {featured.length > 0 && (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Engagements"
                title="Selected security work"
              />
              <ButtonLink href="/portfolio" variant="outline" size="sm">
                View all work <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="mt-10">
              <PortfolioGrid items={featured} enableFilter={false} />
            </div>
          </Container>
        </Section>
      )}

      <Process />

      <Testimonials items={testimonials} />

      <CtaBand />
    </>
  );
}
