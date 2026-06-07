"use client";
import * as React from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/client";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

const SERVICES = [
  "Penetration Testing",
  "Vulnerability Assessment",
  "Security Awareness Training",
  "Not sure yet",
];

export function ContactForm() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      service: String(form.get("service") || ""),
      message: String(form.get("message") || ""),
      website: String(form.get("website") || ""), // honeypot
    };

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await apiFetch("/contact", { method: "POST", body: JSON.stringify(payload) });
      setStatus("done");
    } catch (err) {
      if (err instanceof ApiError) {
        // Surface the specific field(s) when the server returns a Zod error,
        // so the message is actionable instead of a vague "Validation failed".
        const fieldErrors = (err.details as any)?.fieldErrors as
          | Record<string, string[]>
          | undefined;
        const firstField = fieldErrors && Object.keys(fieldErrors)[0];
        setErrorMsg(
          firstField
            ? `${firstField}: ${fieldErrors![firstField][0]}`
            : err.message,
        );
      } else {
        setErrorMsg("Couldn’t reach the server. Check your connection and try again.");
      }
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 text-xl font-semibold">Thanks for reaching out!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We’ve received your message and will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot — hidden from humans, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" placeholder="Jane Doe" />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="jane@company.com" />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Acme Inc." />
        </div>
        <div>
          <Label htmlFor="service">Service of interest</Label>
          <Select id="service" name="service" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" placeholder="Tell us about your project and goals…" />
        <FieldError>{errors.message}</FieldError>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          {errorMsg ?? "Something went wrong sending your message."} Please try again or email us
          directly.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
