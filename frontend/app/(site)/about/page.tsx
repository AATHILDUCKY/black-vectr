import type { Metadata } from "next";
import { Linkedin, Twitter, Github } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup } from "@/components/animation/reveal";
import { ValueProps, CtaBand } from "@/components/sections/home-sections";
import { getTeam } from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, mission, and the team behind the work.",
};

const VALUES = [
  "Outcomes over output",
  "Radical transparency",
  "Craft in every detail",
  "Performance as a feature",
  "Long-term partnerships",
  "Honest advice, always",
];

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <Container className="max-w-4xl">
          <SectionHeading
            align="left"
            eyebrow="About us"
            title="We’re a team obsessed with growth"
            description="Founded on a simple idea: businesses deserve a partner who treats their growth like their own — strategic, accountable, and genuinely good at the craft."
          />
          <Reveal delay={0.1} className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              We started as a small group of designers and engineers tired of agencies that
              over-promised and under-delivered. Today we’re a full-service team that ships
              real results — websites that load fast, campaigns that convert, and brands that
              last.
            </p>
            <p>
              Our mission is to make world-class digital work accessible to ambitious
              businesses, without the bloat, jargon, or surprises.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-muted/30">
        <Container>
          <SectionHeading eyebrow="Our values" title="What we stand for" />
          <Reveal className="mx-auto mt-10 max-w-2xl">
            <ValueProps items={VALUES} />
          </Reveal>
        </Container>
      </Section>

      {team.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Our team" title="The people behind the work" />
            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <Reveal key={m.id}>
                  <div className="rounded-2xl border border-border bg-card p-6 text-center">
                    <div className="mx-auto mb-4 grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-accent-gradient text-2xl font-semibold text-background">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        m.name.charAt(0)
                      )}
                    </div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                    {m.bio && <p className="mt-2 text-xs text-muted-foreground">{m.bio}</p>}
                    <div className="mt-3 flex justify-center gap-2 text-muted-foreground">
                      {m.socials.linkedin && (
                        <a href={m.socials.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 hover:text-foreground" />
                        </a>
                      )}
                      {m.socials.twitter && (
                        <a href={m.socials.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4 hover:text-foreground" />
                        </a>
                      )}
                      {m.socials.github && (
                        <a href={m.socials.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 hover:text-foreground" />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
