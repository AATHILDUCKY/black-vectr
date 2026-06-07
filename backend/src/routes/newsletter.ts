import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/error";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { newsletterSchema } from "../schemas";

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// Public subscribe (idempotent — re-subscribing is a no-op success).
router.post(
  "/",
  limiter,
  validateBody(newsletterSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    res.status(201).json({ ok: true });
  }),
);

// Admin: list subscribers
router.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const subs = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(subs);
  }),
);

// Admin: delete subscriber
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.newsletterSubscriber.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

export default router;
