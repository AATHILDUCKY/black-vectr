"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { apiFetch } from "@/lib/client";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { email: String(form.get("email")), password: String(form.get("password")) };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setFormError(undefined);
    setLoading(true);
    try {
      await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setFormError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[400px]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your site content</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="admin@blackvectr.com" />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
            <FieldError>{errors.password}</FieldError>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
