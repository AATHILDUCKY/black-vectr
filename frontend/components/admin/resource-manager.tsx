"use client";
import * as React from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { apiFetch, ApiError, revalidatePublic } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { ImageField, type ImageKind } from "./image-field";
import { MarkdownEditor } from "./markdown-editor";

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "links"
  | "image";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Generate slug from this sibling field when slug is empty. */
  slugFrom?: string;
  defaultValue?: unknown;
  help?: string;
  /** For `image` fields: server-side compression budget. */
  imageKind?: ImageKind;
}

export interface ColumnConfig<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface Props<T extends { id: number }> {
  title: string;
  description?: string;
  resource: string; // api path, e.g. "/posts"
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyForm(fields: FieldConfig[]) {
  const f: Record<string, any> = {};
  for (const field of fields) {
    f[field.name] =
      field.defaultValue ??
      (field.type === "boolean"
        ? false
        : field.type === "tags" || field.type === "links"
          ? []
          : field.type === "number"
            ? 0
            : "");
  }
  return f;
}

export function ResourceManager<T extends { id: number }>({
  title,
  description,
  resource,
  columns,
  fields,
}: Props<T>) {
  const [rows, setRows] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [form, setForm] = React.useState<Record<string, any>>(emptyForm(fields));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<T[]>(resource);
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  React.useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm(fields));
    setError(undefined);
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    const f: Record<string, any> = {};
    for (const field of fields) f[field.name] = (row as any)[field.name] ?? emptyForm([field])[field.name];
    setForm(f);
    setError(undefined);
    setModalOpen(true);
  }

  function setField(name: string, value: any) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(undefined);

    // Auto-fill empty slugs.
    const payload = { ...form };
    for (const field of fields) {
      if (field.type === "slug" && !payload[field.name] && field.slugFrom) {
        payload[field.name] = slugify(String(payload[field.slugFrom] || ""));
      }
      if (field.type === "number") payload[field.name] = Number(payload[field.name]);
    }

    try {
      if (editing) {
        await apiFetch(`${resource}/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(resource, { method: "POST", body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await load();
      await revalidatePublic(resource.replace(/^\//, ""));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: T) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await apiFetch(`${resource}/${row.id}`, { method: "DELETE" }).catch(() => {});
    await load();
    await revalidatePublic(resource.replace(/^\//, ""));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            Nothing here yet. Click “New” to create one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left">
                <tr>
                  {columns.map((c) => (
                    <th key={c.header} className="px-4 py-3 font-medium text-muted-foreground">
                      {c.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    {columns.map((c, i) => (
                      <td key={i} className="px-4 py-3 align-top">
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title}` : `New ${title}`}>
        <form onSubmit={onSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {fields.map((field) => (
            <Field key={field.name} field={field} value={form[field.name]} onChange={(v) => setField(field.name, v)} />
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  const id = `field-${field.name}`;
  return (
    <div>
      {field.type !== "boolean" && <Label htmlFor={id}>{field.label}</Label>}
      {(() => {
        switch (field.type) {
          case "markdown":
            return (
              <MarkdownEditor
                id={id}
                value={value ?? ""}
                placeholder={field.placeholder}
                onChange={onChange}
              />
            );
          case "textarea":
            return (
              <Textarea
                id={id}
                value={value ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
              />
            );
          case "number":
            return (
              <Input
                id={id}
                type="number"
                value={value ?? 0}
                onChange={(e) => onChange(Number(e.target.value))}
              />
            );
          case "boolean":
            return (
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                />
                {field.label}
              </label>
            );
          case "select":
            return (
              <Select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
                <option value="" disabled>
                  Select…
                </option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            );
          case "tags":
            return (
              <Input
                id={id}
                value={Array.isArray(value) ? value.join(", ") : value ?? ""}
                placeholder="comma, separated, values"
                onChange={(e) =>
                  onChange(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            );
          case "links":
            return <LinksField value={value} onChange={onChange} />;
          case "image":
            return <ImageField value={value} onChange={onChange} kind={field.imageKind} />;
          default:
            return (
              <Input
                id={id}
                value={value ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
              />
            );
        }
      })()}
      {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}

/**
 * Editor for a list of labelled outbound links — e.g. a project's attached
 * resources (GitHub, Docs, Demo, Releases…). Stores an array of { label, url }.
 */
type LinkItem = { label: string; url: string };

function LinksField({
  value,
  onChange,
}: {
  value: LinkItem[] | undefined;
  onChange: (v: LinkItem[]) => void;
}) {
  const items: LinkItem[] = Array.isArray(value) ? value : [];

  const update = (i: number, patch: Partial<LinkItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const add = () => onChange([...items, { label: "", url: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={it.label}
            placeholder="Label (e.g. GitHub)"
            onChange={(e) => update(i, { label: e.target.value })}
            className="w-2/5"
          />
          <Input
            value={it.url}
            placeholder="https://…"
            onChange={(e) => update(i, { url: e.target.value })}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            aria-label="Remove link"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" /> Add resource
      </Button>
    </div>
  );
}
