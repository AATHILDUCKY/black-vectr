"use client";
import * as React from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Youtube,
  Github,
  Eye,
  Pencil,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/client";
import { MarkdownContent } from "@/components/markdown-content";
import { cn } from "@/lib/utils";

type Wrap = { before: string; after: string; placeholder: string };
type LinePrefix = { prefix: string; placeholder: string };

interface ToolAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  wrap?: Wrap;
  line?: LinePrefix;
  shortcut?: string;
}

// Plain text-formatting actions (left group of the toolbar).
const FORMAT_ACTIONS: ToolAction[] = [
  { icon: Bold, label: "Bold", wrap: { before: "**", after: "**", placeholder: "bold text" }, shortcut: "b" },
  { icon: Italic, label: "Italic", wrap: { before: "_", after: "_", placeholder: "italic text" }, shortcut: "i" },
  { icon: Heading2, label: "Heading 2", line: { prefix: "## ", placeholder: "Heading" } },
  { icon: Heading3, label: "Heading 3", line: { prefix: "### ", placeholder: "Heading" } },
  { icon: List, label: "Bullet list", line: { prefix: "- ", placeholder: "List item" } },
  { icon: ListOrdered, label: "Numbered list", line: { prefix: "1. ", placeholder: "List item" } },
  { icon: Quote, label: "Quote", line: { prefix: "> ", placeholder: "Quote" } },
  { icon: Code, label: "Inline code", wrap: { before: "`", after: "`", placeholder: "code" } },
];

// Pull the 11-char video id out of any common YouTube URL shape.
function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const [uploading, setUploading] = React.useState(false);
  const text = value ?? "";

  // Insert raw text at the cursor, replacing any current selection.
  const insertAtCursor = React.useCallback(
    (snippet: string, selectInner?: { from: number; len: number }) => {
      const el = ref.current;
      const start = el ? el.selectionStart : text.length;
      const end = el ? el.selectionEnd : text.length;
      const next = text.slice(0, start) + snippet + text.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        if (selectInner) {
          el.setSelectionRange(start + selectInner.from, start + selectInner.from + selectInner.len);
        } else {
          const caret = start + snippet.length;
          el.setSelectionRange(caret, caret);
        }
      });
    },
    [text, onChange],
  );

  // Apply a wrap / line-prefix formatting action to the selection.
  const apply = React.useCallback(
    (action: ToolAction) => {
      const el = ref.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = text.slice(start, end);

      let next: string;
      let selStart: number;
      let selEnd: number;

      if (action.wrap) {
        const inner = selected || action.wrap.placeholder;
        const insert = action.wrap.before + inner + action.wrap.after;
        next = text.slice(0, start) + insert + text.slice(end);
        selStart = start + action.wrap.before.length;
        selEnd = selStart + inner.length;
      } else if (action.line) {
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        const block = text.slice(lineStart, end) || action.line.placeholder;
        const prefixed = block
          .split("\n")
          .map((l) => action.line!.prefix + l)
          .join("\n");
        next = text.slice(0, lineStart) + prefixed + text.slice(end);
        selStart = lineStart;
        selEnd = lineStart + prefixed.length;
      } else {
        return;
      }

      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(selStart, selEnd);
      });
    },
    [text, onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const action = FORMAT_ACTIONS.find((a) => a.shortcut === e.key.toLowerCase());
    if (action) {
      e.preventDefault();
      apply(action);
    }
  };

  // ── Media / link inserters ──────────────────────────────────────────────────
  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("kind", "blog"); // WebP, ~50–60KB budget
      fd.append("file", file);
      const res = await apiFetch<{ url: string }>("/uploads", { method: "POST", body: fd });
      const alt = file.name.replace(/\.[^.]+$/, "");
      insertAtCursor(`\n\n![${alt}](${res.url})\n\n`);
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function insertImageUrl() {
    const url = window.prompt("Image URL");
    if (!url) return;
    insertAtCursor(`\n\n![image](${url})\n\n`);
  }

  function insertYoutube() {
    const url = window.prompt("YouTube URL or video ID");
    if (!url) return;
    const vid = youtubeId(url);
    if (!vid) {
      alert("Couldn't recognise that as a YouTube link.");
      return;
    }
    const embed = `\n\n<div class="video-embed"><iframe src="https://www.youtube.com/embed/${vid}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
    insertAtCursor(embed);
  }

  function insertGithub() {
    const url = window.prompt("GitHub repo / file URL");
    if (!url) return;
    const label = url.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "") || "GitHub";
    insertAtCursor(`[${label}](${url})`, { from: 1, len: label.length });
  }

  function insertLink() {
    const el = ref.current;
    const selected = el ? text.slice(el.selectionStart, el.selectionEnd) : "";
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    const label = selected || "link text";
    insertAtCursor(`[${label}](${url})`, { from: 1, len: label.length });
  }

  const inWrite = tab === "write";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          {FORMAT_ACTIONS.map((a) => (
            <ToolBtn key={a.label} {...a} disabled={!inWrite} onClick={() => apply(a)} />
          ))}

          <span className="mx-1 h-5 w-px bg-border" />

          {/* Media + links */}
          <ToolBtn
            icon={uploading ? Loader2 : ImageIcon}
            label={uploading ? "Uploading…" : "Upload image"}
            disabled={!inWrite || uploading}
            spin={uploading}
            onClick={() => fileRef.current?.click()}
          />
          <ToolBtn icon={LinkIcon} label="Link" shortcut="k" disabled={!inWrite} onClick={insertLink} />
          <ToolBtn icon={Youtube} label="Embed YouTube video" disabled={!inWrite} onClick={insertYoutube} />
          <ToolBtn icon={Github} label="GitHub link" disabled={!inWrite} onClick={insertGithub} />

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUploadFile} />
        </div>

        <div className="flex shrink-0 items-center rounded-md border border-border bg-background p-0.5">
          <TabButton active={inWrite} onClick={() => setTab("write")} icon={Pencil}>
            Write
          </TabButton>
          <TabButton active={!inWrite} onClick={() => setTab("preview")} icon={Eye}>
            Preview
          </TabButton>
        </div>
      </div>

      {/* Body */}
      {inWrite ? (
        <textarea
          id={id}
          ref={ref}
          value={text}
          placeholder={placeholder ?? "Write your post in Markdown…"}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck
          className="block min-h-[420px] w-full resize-y bg-background px-4 py-3.5 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      ) : (
        <div className="prose-content min-h-[420px] space-y-4 px-4 py-3.5 text-sm leading-relaxed text-foreground/90">
          {text.trim() ? (
            <MarkdownContent>{text}</MarkdownContent>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}

      {/* Hint */}
      {inWrite && (
        <p className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          Markdown supported. Use the toolbar to upload images, embed YouTube, or add links.
          <span className="ml-1">⌘B bold · ⌘I italic · ⌘K link</span>
        </p>
      )}
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  shortcut,
  disabled,
  spin,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  spin?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={shortcut ? `${label} (⌘${shortcut.toUpperCase()})` : label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className={cn("h-4 w-4", spin && "animate-spin")} />
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
