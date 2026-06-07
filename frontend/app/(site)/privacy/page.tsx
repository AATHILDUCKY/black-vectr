import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/primitives";
import { MarkdownContent } from "@/components/markdown-content";
import { getSettings } from "@/lib/api";
import { defaultPrivacyPolicy } from "@/lib/legal-defaults";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your information.",
};

export default async function PrivacyPage() {
  const s = await getSettings();
  const body = s.privacyPolicy?.trim() || defaultPrivacyPolicy(s.brandName, s.contactEmail);
  const updated = s.updatedAt ? formatDate(s.updatedAt) : new Date().getFullYear();

  return (
    <Section className="pt-32 sm:pt-40">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="prose-content mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <MarkdownContent>{body}</MarkdownContent>
        </div>
      </Container>
    </Section>
  );
}
