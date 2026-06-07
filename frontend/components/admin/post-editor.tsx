"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, ExternalLink } from "lucide-react";
import { apiFetch, ApiError, revalidatePublic } from "@/lib/client";
import { Input, Textarea, Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { Post, Category } from "@/lib/types";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: "draft" | "published";
  tags: string[];
  categoryId: number | null;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: null,
  status: "draft",
  tags: [],
  categoryId: null,
  seoTitle: "",
  seoDescription: "",
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const editing = !!post;

  const [form, setForm] = React.useState<FormState>(
    post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage,
          status: post.status,
          tags: post.tags ?? [],
          categoryId: post.categoryId ?? null,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
        }
      : EMPTY,
  );
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [saving, setSaving] = React.useState<"draft" | "published" | null>(null);
  const [error, setError] = React.useState<string>();
  // Auto-slug only while the slug hasn't been hand-edited and we're creating.
  const [slugTouched, setSlugTouched] = React.useState(editing);

  React.useEffect(() => {
    apiFetch<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitle(v: string) {
    setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) }));
  }

  async function save(status: "draft" | "published") {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.excerpt.trim()) return setError("Excerpt is required.");
    if (!form.body.trim()) return setError("Body is required.");

    setSaving(status);
    setError(undefined);

    const payload = {
      ...form,
      status,
      slug: form.slug.trim() || slugify(form.title),
      categoryId: form.categoryId || null,
      coverImage: form.coverImage || null,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      // Stamp publish time the first time it goes live.
      ...(status === "published" && (!editing || post?.status !== "published")
        ? { publishedAt: new Date().toISOString() }
        : {}),
    };

    try {
      if (editing) {
        await apiFetch(`/posts/${post!.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/posts", { method: "POST", body: JSON.stringify(payload) });
      }
      await revalidatePublic("posts");
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to posts"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold">
              {editing ? "Edit post" : "New post"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {editing ? form.title || "Untitled" : "Draft a new article"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editing && form.status === "published" && (
            <Link
              href={`/blog/${form.slug}`}
              target="_blank"
              className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" /> View
            </Link>
          )}
          <Button variant="outline" onClick={() => save("draft")} disabled={saving !== null}>
            {saving === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save draft
          </Button>
          <Button onClick={() => save("published")} disabled={saving !== null}>
            {saving === "published" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {form.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              placeholder="Post title"
              onChange={(e) => onTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              placeholder="A one or two sentence summary shown in listings and previews."
              onChange={(e) => set("excerpt", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label>Body</Label>
            <MarkdownEditor value={form.body} onChange={(v) => set("body", v)} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <SideCard title="Publish">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(e) => set("status", e.target.value as FormState["status"])}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder="auto-generated-from-title"
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
              <p className="mt-1 text-xs text-muted-foreground">/blog/{form.slug || "…"}</p>
            </div>
          </SideCard>

          <SideCard title="Organize">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={form.categoryId ?? ""}
                onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tags.join(", ")}
                placeholder="comma, separated"
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
            </div>
          </SideCard>

          <SideCard title="Cover image">
            <ImageField value={form.coverImage} onChange={(v) => set("coverImage", v)} kind="blog" />
          </SideCard>

          <SideCard title="SEO">
            <div>
              <Label htmlFor="seoTitle">Meta title</Label>
              <Input
                id="seoTitle"
                value={form.seoTitle}
                placeholder={form.title || "Defaults to post title"}
                onChange={(e) => set("seoTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">Meta description</Label>
              <Textarea
                id="seoDescription"
                value={form.seoDescription}
                placeholder={form.excerpt || "Defaults to excerpt"}
                onChange={(e) => set("seoDescription", e.target.value)}
                className="min-h-[70px]"
              />
            </div>
          </SideCard>
        </aside>
      </div>
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
