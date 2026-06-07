"use client";
import * as React from "react";
import { Upload, X } from "lucide-react";
import { apiFetch } from "@/lib/client";

// What the image is for — controls the server-side compression budget:
//   logo → <20KB, blog → ~50–60KB, general → ~160KB. All converted to WebP.
export type ImageKind = "logo" | "blog" | "general";

const KIND_HINT: Record<ImageKind, string> = {
  logo: "Auto-converted to WebP and kept under 20KB.",
  blog: "Auto-converted to WebP and compressed to ~50–60KB.",
  general: "Auto-converted to WebP and optimized.",
};

// Uploads to /api/uploads (multipart) and stores the returned URL. The server
// converts to WebP and compresses to the budget for `kind`.
export function ImageField({
  value,
  onChange,
  kind = "general",
}: {
  value?: string | null;
  onChange: (v: string | null) => void;
  kind?: ImageKind;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [savedKb, setSavedKb] = React.useState<number>();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(undefined);
    setSavedKb(undefined);
    try {
      const fd = new FormData();
      // `kind` must precede the file so it's parsed into req.body server-side.
      fd.append("kind", kind);
      fd.append("file", file);
      const res = await apiFetch<{ url: string; bytes?: number }>("/uploads", {
        method: "POST",
        body: fd,
      });
      onChange(res.url);
      if (typeof res.bytes === "number") setSavedKb(Math.round(res.bytes / 1024));
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-24 w-24 rounded-lg border border-border object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-foreground text-background"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-muted">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
      )}
      {/* Allow pasting a URL directly too */}
      <input
        type="text"
        value={value ?? ""}
        placeholder="…or paste an image URL"
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
      />
      <p className="text-xs text-muted-foreground">
        {KIND_HINT[kind]}
        {typeof savedKb === "number" && (
          <span className="ml-1 font-medium text-foreground">Saved {savedKb}KB.</span>
        )}
      </p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
