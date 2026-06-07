import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CtaBand } from "@/components/sections/home-sections";
import { getServices } from "@/lib/api";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, digital marketing, SEO, branding & design, and analytics — full-service digital help for businesses.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Capabilities that move the needle"
            description="From first line of code to ongoing growth, we cover the full stack of digital work — and we’re accountable for the outcomes."
          />
          <div className="mt-12">
            <ServicesGrid services={services} />
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
