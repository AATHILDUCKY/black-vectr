import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { ContactForm } from "@/components/sections/contact-form";
import { getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — tell us about your project and we’ll respond within a business day.",
};

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Contact
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Let’s build something great
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Tell us about your goals. We’ll reply within one business day with next steps —
              no obligation.
            </p>

            <div className="mt-10 space-y-4">
              <a href={`mailto:${s.contactEmail}`} className="flex items-center gap-3 text-sm hover:text-primary">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                  <Mail className="h-5 w-5 text-primary" />
                </span>
                {s.contactEmail}
              </a>
              {s.contactPhone && (
                <a href={`tel:${s.contactPhone}`} className="flex items-center gap-3 text-sm hover:text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                    <Phone className="h-5 w-5 text-primary" />
                  </span>
                  {s.contactPhone}
                </a>
              )}
              {s.address && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                    <MapPin className="h-5 w-5 text-primary" />
                  </span>
                  {s.address}
                </div>
              )}
            </div>

            {s.address && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                <iframe
                  title={`Map of ${s.address}`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  // Keyless Google Maps embed — geocodes the configured address
                  // string and centers a marker on it, so the map always matches
                  // whatever address is set in Admin → Settings.
                  src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&z=15&output=embed`}
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
