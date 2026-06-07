"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, FileText } from "lucide-react";
import { apiFetch, revalidatePublic } from "@/lib/client";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export default function PostsAdminPage() {
  const [rows, setRows] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setRows(await apiFetch<Post[]>("/posts"));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function onDelete(post: Post) {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    await apiFetch(`/posts/${post.id}`, { method: "DELETE" }).catch(() => {});
    await revalidatePublic("posts");
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Create and manage articles.</p>
        </div>
        <ButtonLink href="/admin/posts/new">
          <Plus className="h-4 w-4" /> New post
        </ButtonLink>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No posts yet.</p>
            <ButtonLink href="/admin/posts/new" size="sm">
              <Plus className="h-4 w-4" /> Write your first post
            </ButtonLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/posts/${post.id}/edit`} className="font-medium hover:text-primary">
                        {post.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          post.status === "published"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(post)}
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
    </div>
  );
}
