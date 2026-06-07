"use client";
import * as React from "react";
import { z } from "zod";
import { apiFetch } from "@/lib/client";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = React.useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(undefined);
    setStatus("loading");
    try {
      await apiFetch("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-primary">Thanks — you’re on the list. ✨</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        required
      />
      <Button type="submit" disabled={status === "loading"} className="shrink-0">
        {status === "loading" ? "…" : "Subscribe"}
      </Button>
      {error && <span className="text-xs text-red-500 sm:hidden">{error}</span>}
    </form>
  );
}
