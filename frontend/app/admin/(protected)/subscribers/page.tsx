"use client";
import * as React from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/lib/types";

export default function SubscribersAdminPage() {
  const [subs, setSubs] = React.useState<Subscriber[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const data = await apiFetch<Subscriber[]>("/newsletter").catch(() => []);
    setSubs(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function remove(sub: Subscriber) {
    if (!confirm("Remove this subscriber?")) return;
    await apiFetch(`/newsletter/${sub.id}`, { method: "DELETE" }).catch(() => {});
    load();
  }

  function exportCsv() {
    const header = "email,subscribed\n";
    const rows = subs.map((s) => `"${s.email}","${s.createdAt}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">{subs.length} total</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!subs.length}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : subs.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(s)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
