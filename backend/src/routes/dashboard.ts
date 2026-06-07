import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/error";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

const DAY = 24 * 60 * 60 * 1000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

// Percentage change of `current` vs `previous`, rounded. Null when there's no
// previous baseline (avoids a misleading "+100%" from a zero base).
function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [
      totalLeads,
      newLeads,
      posts,
      publishedPosts,
      portfolio,
      subscribers,
      services,
      testimonials,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.portfolioItem.count(),
      prisma.newsletterSubscriber.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
    ]);

    // ── 30-day activity window (leads + subscribers per day) ──────────────────
    const WINDOW = 30;
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (WINDOW - 1));

    const [windowLeads, windowSubs] = await Promise.all([
      prisma.lead.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, status: true, service: true },
      }),
      prisma.newsletterSubscriber.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);

    const series = new Map<string, { leads: number; subscribers: number }>();
    for (let i = 0; i < WINDOW; i++) {
      series.set(dayKey(new Date(since.getTime() + i * DAY)), { leads: 0, subscribers: 0 });
    }
    for (const l of windowLeads) {
      const slot = series.get(dayKey(l.createdAt));
      if (slot) slot.leads += 1;
    }
    for (const s of windowSubs) {
      const slot = series.get(dayKey(s.createdAt));
      if (slot) slot.subscribers += 1;
    }
    const activityOverTime = [...series.entries()].map(([date, v]) => ({ date, ...v }));

    // ── Lead status breakdown (donut) ─────────────────────────────────────────
    const statusGroups = await prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const leadStatus = ["new", "read", "handled"].map((status) => ({
      status,
      count: statusGroups.find((g) => g.status === status)?._count._all ?? 0,
    }));

    // ── Top services by lead interest (bar) ───────────────────────────────────
    const serviceGroups = await prisma.lead.groupBy({
      by: ["service"],
      _count: { _all: true },
      where: { service: { not: null } },
      orderBy: { _count: { service: "desc" } },
      take: 5,
    });
    const topServices = serviceGroups
      .filter((g) => g.service)
      .map((g) => ({ service: g.service as string, count: g._count._all }));

    // ── Week-over-week deltas (last 7 days vs the 7 before) ───────────────────
    const now = Date.now();
    const last7 = new Date(now - 7 * DAY);
    const prev7 = new Date(now - 14 * DAY);
    const inLast7 = (d: Date) => d >= last7;
    const inPrev7 = (d: Date) => d >= prev7 && d < last7;

    const leadsLast7 = windowLeads.filter((l) => inLast7(l.createdAt)).length;
    const leadsPrev7 = windowLeads.filter((l) => inPrev7(l.createdAt)).length;
    const subsLast7 = windowSubs.filter((s) => inLast7(s.createdAt)).length;
    const subsPrev7 = windowSubs.filter((s) => inPrev7(s.createdAt)).length;

    const deltas = {
      leads: pctChange(leadsLast7, leadsPrev7),
      subscribers: pctChange(subsLast7, subsPrev7),
    };

    // Leads-only series for the prior 14-day chart (kept for backwards compat).
    const leadsOverTime = activityOverTime
      .slice(-14)
      .map(({ date, leads }) => ({ date, count: leads }));

    const recentActivity = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    });

    res.json({
      totals: {
        leads: totalLeads,
        newLeads,
        posts,
        publishedPosts,
        portfolio,
        subscribers,
        services,
        testimonials,
      },
      deltas,
      leadsOverTime,
      activityOverTime,
      leadStatus,
      topServices,
      recentActivity,
    });
  }),
);

export default router;
