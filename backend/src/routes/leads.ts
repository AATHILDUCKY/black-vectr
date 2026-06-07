import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { leadUpdateSchema } from "../schemas";

// All lead endpoints are admin-only (creation happens via /api/contact).
const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, status } = req.query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } },
        { company: { contains: String(search) } },
        { message: { contains: String(search) } },
      ];
    }
    const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(leads);
  }),
);

// CSV export — must be declared before "/:id".
router.get(
  "/export",
  asyncHandler(async (_req, res) => {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const header = ["id", "name", "email", "company", "service", "status", "createdAt", "message"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [l.id, l.name, l.email, l.company, l.service, l.status, l.createdAt.toISOString(), l.message]
        .map(escape)
        .join(","),
    );
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.send([header.join(","), ...rows].join("\n"));
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const lead = await prisma.lead.findUnique({ where: { id: Number(req.params.id) } });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  }),
);

router.patch(
  "/:id",
  validateBody(leadUpdateSchema),
  asyncHandler(async (req, res) => {
    const lead = await prisma.lead.update({
      where: { id: Number(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(lead);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.lead.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

export default router;
