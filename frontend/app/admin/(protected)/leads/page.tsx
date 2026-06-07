"use client";
import * as React from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/lib/types";

const STATUSES = ["new", "read", "handled"] as const;
const statusStyle: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  read: "bg-amber-500/10 text-amber-600",
  handled: "bg-green-500/10 text-green-600",
};

export default function LeadsAdminPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [selected, setSelected] = React.useState<Lead | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const data = await apiFetch<Lead[]>(`/leads?${params}`).catch(() => []);
    setLeads(data);
    setLoading(false);
  }, [search, status]);

  React.useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(lead: Lead, newStatus: string) {
    await apiFetch(`/leads/${lead.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    setSelected((s) => (s && s.id === lead.id ? { ...s, status: newStatus as Lead["status"] } : s));
    load();
  }

  async function remove(lead: Lead) {
    if (!confirm("Delete this lead?")) return;
    await apiFetch(`/leads/${lead.id}`, { method: "DELETE" }).catch(() => {});
    setSelected(null);
    load();
  }

  function openDetail(lead: Lead) {
    setSelected(lead);
    if (lead.status === "new") updateStatus(lead, "read");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Leads</h1>
        <a href="/api/leads/export" className="inline-flex">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </a>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search name, email, message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[160px]">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : leads.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => openDetail(lead)}
                  >
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.service || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(lead);
                        }}
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
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Lead details">
        {selected && (
          <div className="space-y-4 text-sm">
            <Detail label="Name" value={selected.name} />
            <Detail label="Email" value={<a href={`mailto:${selected.email}`} className="text-primary underline">{selected.email}</a>} />
            {selected.company && <Detail label="Company" value={selected.company} />}
            {selected.service && <Detail label="Service" value={selected.service} />}
            <Detail label="Received" value={formatDate(selected.createdAt)} />
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3">{selected.message}</p>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
              <Select
                value={selected.status}
                onChange={(e) => updateStatus(selected, e.target.value)}
                className="max-w-[160px]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    Mark as {s}
                  </option>
                ))}
              </Select>
              <Button variant="outline" onClick={() => remove(selected)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
