import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import sharp from "sharp";
import { env } from "../lib/env";
import { requireAuth } from "../middleware/auth";
import { ApiError } from "../middleware/error";

const router = Router();

const uploadRoot = path.resolve(process.cwd(), env.uploadDir);
fs.mkdirSync(uploadRoot, { recursive: true });

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

// Per-context processing budgets. Every raster upload is converted to WebP and
// compressed down until it fits `targetBytes`, shrinking quality first and then
// dimensions if needed.
//   - logo:    the site / partner logos — tiny, must stay under 20KB
//   - blog:    article + cover imagery — kept in the 50–60KB range
//   - general: everything else (team photos, project covers, …)
type Kind = "logo" | "blog" | "general";
const BUDGETS: Record<Kind, { maxWidth: number; targetBytes: number }> = {
  logo: { maxWidth: 400, targetBytes: 20 * 1024 },
  blog: { maxWidth: 1600, targetBytes: 58 * 1024 },
  general: { maxWidth: 1600, targetBytes: 160 * 1024 },
};

// Keep the original bytes in memory; we re-encode rather than storing raw.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new ApiError(400, "Unsupported file type"));
    }
    cb(null, true);
  },
});

/**
 * Encode `input` to a WebP buffer that fits within `targetBytes`. Reduces
 * quality in steps first (down to a floor), then progressively shrinks the
 * width — so even large source images converge on the budget. Alpha is
 * preserved automatically (WebP supports transparency), so logos stay clean.
 */
async function encodeToBudget(
  input: Buffer,
  maxWidth: number,
  targetBytes: number,
): Promise<Buffer> {
  const minQuality = 40;
  let width = maxWidth;
  let quality = 82;

  const render = () =>
    sharp(input, { failOn: "none" })
      .rotate() // honour EXIF orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();

  let out = await render();

  // Step 1: drop quality toward the floor.
  while (out.byteLength > targetBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 8);
    out = await render();
  }

  // Step 2: still too big at floor quality — shrink dimensions.
  while (out.byteLength > targetBytes && width > 240) {
    width = Math.round(width * 0.85);
    out = await render();
  }

  return out;
}

// Returns the public path; files are served statically at /uploads/<file>.
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  const kindRaw = req.body?.kind;
  const kind: Kind =
    kindRaw === "logo" || kindRaw === "blog" || kindRaw === "general" ? kindRaw : "general";

  const base = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;

  // SVG (vector) and GIF (often animated) are passed through untouched —
  // rasterising them would lose crispness / animation. SVGs are already tiny.
  if (req.file.mimetype === "image/svg+xml" || req.file.mimetype === "image/gif") {
    const ext = req.file.mimetype === "image/gif" ? ".gif" : ".svg";
    const filename = `${base}${ext}`;
    await fs.promises.writeFile(path.join(uploadRoot, filename), req.file.buffer);
    return res.status(201).json({ url: `/uploads/${filename}`, bytes: req.file.size });
  }

  const { maxWidth, targetBytes } = BUDGETS[kind];
  let webp: Buffer;
  try {
    webp = await encodeToBudget(req.file.buffer, maxWidth, targetBytes);
  } catch {
    throw new ApiError(400, "Could not process image");
  }

  const filename = `${base}.webp`;
  await fs.promises.writeFile(path.join(uploadRoot, filename), webp);
  res.status(201).json({ url: `/uploads/${filename}`, bytes: webp.byteLength });
});

export default router;
