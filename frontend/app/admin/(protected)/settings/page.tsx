"use client";
import * as React from "react";
import {
  Loader2,
  Check,
  Building2,
  Megaphone,
  Mail,
  Share2,
  Search,
  Scale,
  KeyRound,
} from "lucide-react";
import { apiFetch, ApiError, revalidatePublic } from "@/lib/client";
import { Input, Textarea, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { SOCIAL_PLATFORMS } from "@/components/ui/socials";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const LOGO_MODES: { value: SiteSettings["logoMode"]; label: string; hint: string }[] = [
  { value: "logo_name", label: "Logo + name", hint: "Show the logo mark and the brand name" },
  { value: "logo", label: "Logo only", hint: "Show just the logo mark" },
  { value: "name", label: "Text only", hint: "Show just the brand name" },
];

const TABS = [
  { id: "brand", label: "Brand", icon: Building2, blurb: "Name, logo, and how it's displayed" },
  { id: "hero", label: "Hero", icon: Megaphone, blurb: "Your home-page headline & CTA" },
  { id: "contact", label: "Contact", icon: Mail, blurb: "Email, phone, and address" },
  { id: "social", label: "Social", icon: Share2, blurb: "Links shown in the footer" },
  { id: "seo", label: "SEO", icon: Search, blurb: "Default page title & description" },
  { id: "legal", label: "Legal", icon: Scale, blurb: "Privacy Policy & Terms content" },
  { id: "security", label: "Security", icon: KeyRound, blurb: "Change your password" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function SettingsAdminPage() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [tab, setTab] = React.useState<TabId>("brand");

  React.useEffect(() => {
    apiFetch<SiteSettings>("/settings")
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  }
  function setSocial(key: string, value: string) {
    setSettings((s) => (s ? { ...s, socials: { ...s.socials, [key]: value } } : s));
    setSaved(false);
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { id, ...payload } = settings;
    await apiFetch("/settings", { method: "PUT", body: JSON.stringify(payload) }).catch(() => {});
    await revalidatePublic("settings");
    setSaving(false);
    setSaved(true);
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading settings…
      </div>
    );
  }

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your brand, content, and legal pages — changes go live on save.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* Tab navigation */}
        <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={on}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:w-full",
                  on
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Active panel */}
        <div className="min-w-0">
          <div className="mb-4 hidden lg:block">
            <h2 className="font-semibold">{activeTab.label}</h2>
            <p className="text-xs text-muted-foreground">{activeTab.blurb}</p>
          </div>

          {tab === "brand" && (
            <Panel>
              <Row label="Brand name">
                <Input value={settings.brandName} onChange={(e) => set("brandName", e.target.value)} />
              </Row>
              <Row label="Tagline">
                <Input value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </Row>
              <Row label="Logo">
                <ImageField value={settings.logoUrl} onChange={(v) => set("logoUrl", v)} kind="logo" />
              </Row>
              <Row label="Logo display">
                <div className="grid grid-cols-3 gap-2">
                  {LOGO_MODES.map((m) => {
                    const on = settings.logoMode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => set("logoMode", m.value)}
                        aria-pressed={on}
                        title={m.hint}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {LOGO_MODES.find((m) => m.value === settings.logoMode)?.hint}
                  {settings.logoMode !== "name" && !settings.logoUrl && (
                    <span className="ml-1 text-foreground">
                      No logo uploaded yet — a lettermark of the brand name is shown until you add one.
                    </span>
                  )}
                </p>
              </Row>
            </Panel>
          )}

          {tab === "hero" && (
            <Panel>
              <p className="text-xs text-muted-foreground">
                The first thing visitors see on the home page. Keep the headline punchy and the
                sub-headline to one or two sentences.
              </p>
              <HeroPreview
                headline={settings.heroHeadline}
                subheadline={settings.heroSubheadline}
                cta={settings.heroCta}
              />
              <Row label="Headline">
                <Input
                  value={settings.heroHeadline}
                  maxLength={70}
                  placeholder="We break in. So no one else can."
                  onChange={(e) => set("heroHeadline", e.target.value)}
                />
                <CharCount value={settings.heroHeadline} max={70} hint="Animated word-by-word on the site." />
              </Row>
              <Row label="Sub-headline">
                <Textarea
                  value={settings.heroSubheadline}
                  maxLength={240}
                  placeholder="One or two sentences on what you do and who it's for."
                  onChange={(e) => set("heroSubheadline", e.target.value)}
                />
                <CharCount value={settings.heroSubheadline} max={240} />
              </Row>
              <Row label="Primary button label">
                <Input
                  value={settings.heroCta}
                  maxLength={32}
                  placeholder="Book an engagement"
                  onChange={(e) => set("heroCta", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Links to the contact page. A secondary “Explore solutions” button is shown
                  automatically.
                </p>
              </Row>
            </Panel>
          )}

          {tab === "contact" && (
            <Panel>
              <Row label="Email">
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                />
              </Row>
              <Row label="Phone">
                <Input value={settings.contactPhone ?? ""} onChange={(e) => set("contactPhone", e.target.value)} />
              </Row>
              <Row label="Address">
                <Input value={settings.address ?? ""} onChange={(e) => set("address", e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Shown in the footer and mapped on the contact page.
                </p>
              </Row>
            </Panel>
          )}

          {tab === "social" && (
            <Panel>
              <p className="text-xs text-muted-foreground">
                Leave a field blank to hide that icon. Links open in a new tab from the footer.
              </p>
              {SOCIAL_PLATFORMS.map(({ key, label, placeholder, Icon }) => (
                <Row key={key} label={label}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Input
                      value={settings.socials?.[key] ?? ""}
                      placeholder={placeholder}
                      onChange={(e) => setSocial(key, e.target.value)}
                    />
                  </div>
                </Row>
              ))}
            </Panel>
          )}

          {tab === "seo" && (
            <Panel>
              <Row label="Default title">
                <Input value={settings.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              </Row>
              <Row label="Default description">
                <Textarea
                  value={settings.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                />
              </Row>
            </Panel>
          )}

          {tab === "legal" && (
            <Panel>
              <p className="text-xs text-muted-foreground">
                Written in Markdown and shown on the{" "}
                <a href="/privacy" target="_blank" className="text-primary underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" target="_blank" className="text-primary underline">
                  Terms of Service
                </a>{" "}
                pages. Leave a field blank to show the built-in default text.
              </p>
              <Row label="Privacy Policy">
                <MarkdownEditor
                  value={settings.privacyPolicy ?? ""}
                  onChange={(v) => set("privacyPolicy", v)}
                  placeholder="Write your privacy policy in Markdown… (blank = default)"
                />
              </Row>
              <Row label="Terms of Service">
                <MarkdownEditor
                  value={settings.termsOfService ?? ""}
                  onChange={(v) => set("termsOfService", v)}
                  placeholder="Write your terms of service in Markdown… (blank = default)"
                />
              </Row>
            </Panel>
          )}

          {tab === "security" && <ChangePassword />}

          {/* Sticky save bar — available on every settings tab (Security has its own button) */}
          {tab !== "security" && (
            <div className="sticky bottom-4 mt-5 flex items-center justify-end gap-3 rounded-xl border border-border bg-card/90 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur">
              {saved && (
                <span className="mr-auto flex items-center gap-1 text-sm text-green-600">
                  <Check className="h-4 w-4" /> Saved
                </span>
              )}
              <Button type="button" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving…" : "Save settings"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// Character counter that turns amber as you approach the limit.
function CharCount({ value, max, hint }: { value: string; max: number; hint?: string }) {
  const len = value?.length ?? 0;
  const near = len > max * 0.9;
  return (
    <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>{hint}</span>
      <span className={cn("tabular-nums", near && "text-amber-500")}>
        {len}/{max}
      </span>
    </div>
  );
}

// Live preview that mirrors how the hero renders on the public home page, so the
// content can be tuned without leaving the dashboard.
function HeroPreview({
  headline,
  subheadline,
  cta,
}: {
  headline: string;
  subheadline: string;
  cta: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-background p-6 text-center">
      <span className="absolute left-3 top-3 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Preview
      </span>
      <h3 className="mx-auto mt-3 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
        {headline || "Your headline goes here"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {subheadline || "Your supporting sub-headline appears here."}
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
          {cta || "Call to action"}
        </span>
        <span className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          Explore solutions
        </span>
      </div>
    </div>
  );
}

function ChangePassword() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [msg, setMsg] = React.useState<{ type: "ok" | "err"; text: string }>();
  const [saving, setSaving] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(undefined);
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setMsg({ type: "ok", text: "Password updated." });
      setCurrent("");
      setNext("");
    } catch (err) {
      setMsg({ type: "err", text: err instanceof ApiError ? err.message : "Failed to update password" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <Label>Current password</Label>
            <Input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
            />
            <FieldError>{msg?.type === "err" ? msg.text : undefined}</FieldError>
            <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="outline" disabled={saving || !current || next.length < 8}>
              {saving ? "Updating…" : "Update password"}
            </Button>
            {msg?.type === "ok" && <span className="text-sm text-green-600">{msg.text}</span>}
          </div>
        </div>
      </div>
    </form>
  );
}
