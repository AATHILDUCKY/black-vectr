import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { CtaBand } from "@/components/sections/home-sections";
import { getProjects } from "@/lib/api";

export const metadata: Metadata = {
  title: "Open Source",
  description:
    "Open-source security tooling built and maintained by BlackVectr — recon, tooling, and labs for offensive and purple teams.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <Container>
          <SectionHeading
            eyebrow="Open source"
            title="Tools we build in the open"
            description="In our early days we're investing in open-source security tooling for the community. Use them, fork them, and send us issues — every project below is free and built in the open."
          />
          <div className="mt-12">
            <ProjectsGrid items={projects} />
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
