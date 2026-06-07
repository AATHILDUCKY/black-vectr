import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CtaBand } from "@/components/sections/home-sections";
import { getPortfolio } from "@/lib/api";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies across web development, marketing, SEO, and branding.",
};

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();
  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <Container>
          <SectionHeading
            eyebrow="Our work"
            title="Case studies, not just screenshots"
            description="A look at the outcomes we’ve driven for clients across industries."
          />
          <div className="mt-12">
            <PortfolioGrid items={portfolio} />
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
