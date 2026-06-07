import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { settingsUpdateSchema } from "../schemas";
import { parseJsonFields, serializeJsonFields } from "../lib/json";

const router = Router();
const JSON_FIELDS = ["socials"];

// Ensure the singleton row exists, then return it (public — the site reads it).
async function getSettings() {
  return prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const settings = await getSettings();
    res.json(parseJsonFields(settings, JSON_FIELDS));
  }),
);

router.put(
  "/",
  requireAuth,
  validateBody(settingsUpdateSchema),
  asyncHandler(async (req, res) => {
    await getSettings(); // ensure row exists
    const data = serializeJsonFields(req.body, JSON_FIELDS);
    const updated = await prisma.siteSetting.update({ where: { id: 1 }, data });
    res.json(parseJsonFields(updated, JSON_FIELDS));
  }),
);

export default router;
