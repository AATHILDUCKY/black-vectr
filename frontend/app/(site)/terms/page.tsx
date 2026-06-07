import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/primitives";
import { MarkdownContent } from "@/components/markdown-content";
import { getSettings } from "@/lib/api";
import { defaultTermsOfService } from "@/lib/legal-defaults";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing the use of our website and services.",
};

export default async function TermsPage() {
  const s = await getSettings();
  const body = s.termsOfService?.trim() || defaultTermsOfService(s.brandName);
  const updated = s.updatedAt ? formatDate(s.updatedAt) : new Date().getFullYear();

  return (
    <Section className="pt-32 sm:pt-40">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="prose-content mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <MarkdownContent>{body}</MarkdownContent>
        </div>
      </Container>
    </Section>
  );
}
