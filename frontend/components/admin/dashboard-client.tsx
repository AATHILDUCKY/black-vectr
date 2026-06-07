"use client";
import * as React from "react";
import {
  Inbox,
  Mail,
  FileText,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import { apiFetch } from "@/lib/client";
import type { DashboardStats } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

// Monochrome chart palette pulled from the theme tokens so it adapts to
// light/dark and stays on-brand (no off-palette colors).
const C = {
  fg: "hsl(var(--foreground))",
  fg55: "hsl(var(--foreground) / 0.55)",
  fg28: "hsl(var(--foreground) / 0.28)",
  muted: "hsl(var(--muted-foreground))",
  grid: "hsl(var(--border))",
};
const STATUS_FILLS: Record<string, string> = { new: C.fg, read: C.fg55, handled: C.fg28 };

const RANGES = [7, 14, 30] as const;
type Range = (typeof RANGES)[number];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 8px 24px -10px hsl(0 0% 0% / 0.25)",
};

export function DashboardClient() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [range, setRange] = React.useState<Range>(30);

  React.useEffect(() => {
    apiFetch<DashboardStats>("/dashboard/stats")
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading dashboard…
      </div>
    );
  }
  if (!stats) return <p className="text-muted-foreground">Couldn’t load dashboard data.</p>;

  const activity = stats.activityOverTime.slice(-range);
  const totalStatus = stats.leadStatus.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {stats.totals.newLeads > 0 ? (
              <>
                <span className="font-medium text-foreground">{stats.totals.newLeads}</span> new lead
                {stats.totals.newLeads === 1 ? "" : "s"} need attention
              </>
            ) : (
              "You're all caught up — no new leads."
            )}
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all leads <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Inbox} label="Total leads" value={stats.totals.leads} delta={stats.deltas.leads} />
        <KpiCard
          icon={Mail}
          label="Subscribers"
          value={stats.totals.subscribers}
          delta={stats.deltas.subscribers}
        />
        <KpiCard icon={FileText} label="Published posts" value={stats.totals.publishedPosts} />
        <KpiCard icon={Briefcase} label="Case studies" value={stats.totals.portfolio} />
      </div>

      {/* Activity + status */}
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Panel
          title="Activity"
          subtitle="Leads vs. newsletter subscribers"
          action={
            <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    range === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}d
                </button>
              ))}
            </div>
          }
        >
          <div className="flex items-center gap-4 pb-3 text-xs text-muted-foreground">
            <Legend swatch={C.fg} label="Leads" />
            <Legend swatch={C.fg55} label="Subscribers" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.fg} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={C.fg} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.fg55} stopOpacity={0.16} />
                    <stop offset="100%" stopColor={C.fg55} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 11, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => `Date ${d}`} />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  name="Subscribers"
                  stroke={C.fg55}
                  strokeWidth={1.5}
                  fill="url(#fillSubs)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke={C.fg}
                  strokeWidth={2}
                  fill="url(#fillLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Lead status" subtitle="Pipeline breakdown">
          {totalStatus === 0 ? (
            <EmptyChart label="No leads yet." />
          ) : (
            <div className="relative">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.leadStatus}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {stats.leadStatus.map((s) => (
                        <Cell key={s.status} fill={STATUS_FILLS[s.status] ?? C.muted} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center total */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold">{totalStatus}</span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {stats.leadStatus.map((s) => (
                  <div key={s.status} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: STATUS_FILLS[s.status] ?? C.muted }}
                    />
                    <span className="capitalize text-muted-foreground">{s.status}</span>
                    <span className="ml-auto font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Top services + recent leads */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Top services" subtitle="By lead interest">
          {stats.topServices.length === 0 ? (
            <EmptyChart label="No service interest recorded yet." />
          ) : (
            <div style={{ height: Math.max(180, stats.topServices.length * 48) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topServices}
                  layout="vertical"
                  margin={{ top: 0, right: 28, bottom: 0, left: 8 }}
                  barSize={18}
                >
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="service"
                    tick={{ fontSize: 12, fill: C.muted }}
                    axisLine={false}
                    tickLine={false}
                    width={130}
                  />
                  <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.5)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill={C.fg} radius={[0, 6, 6, 0]}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fill: C.muted, fontSize: 12 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel title="Recent leads" subtitle="Latest inquiries">
          {stats.recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold uppercase">
                      {a.name.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill status={a.status} />
                    <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

// ── Building blocks ────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  delta?: number | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-foreground" />
        </span>
        {delta !== undefined && <DeltaBadge delta={delta} />}
      </div>
      <p className="mt-4 font-display text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return <span className="text-xs text-muted-foreground">new</span>;
  }
  const up = delta > 0;
  const flat = delta === 0;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        flat && "bg-muted text-muted-foreground",
        up && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        !up && !flat && "bg-red-500/10 text-red-600 dark:text-red-400",
      )}
      title="vs. previous 7 days"
    >
      <Icon className="h-3 w-3" />
      {up ? "+" : ""}
      {delta}%
    </span>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: swatch }} />
      {label}
    </span>
  );
}

function EmptyChart({ label }: { label: string }) {
  return <p className="grid h-48 place-items-center text-sm text-muted-foreground">{label}</p>;
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-primary/10 text-primary",
    read: "bg-muted text-muted-foreground",
    handled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs capitalize", styles[status] ?? "bg-muted")}>
      {status}
    </span>
  );
}
