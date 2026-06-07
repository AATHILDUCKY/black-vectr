import { Router } from "express";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";
import {
  cookieOptions,
  hashPassword,
  signToken,
  verifyPassword,
} from "../lib/auth";
import { asyncHandler, ApiError } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { changePasswordSchema, loginSchema } from "../schemas";
import rateLimit from "express-rate-limit";

const router = Router();

// Throttle login attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

router.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new ApiError(401, "Invalid email or password");
    }
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.cookie(env.authCookieName, token, cookieOptions());
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  }),
);

router.post("/logout", (_req, res) => {
  res.clearCookie(env.authCookieName, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user) throw new ApiError(404, "User not found");
    res.json({ user });
  }),
);

router.post(
  "/change-password",
  requireAuth,
  validateBody(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user || !(await verifyPassword(currentPassword, user.password))) {
      throw new ApiError(400, "Current password is incorrect");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(newPassword) },
    });
    res.json({ ok: true });
  }),
);

export default router;
