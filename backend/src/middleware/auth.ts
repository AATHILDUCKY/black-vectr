import { NextFunction, Request, Response } from "express";
import { env } from "../lib/env";
import { JwtPayload, verifyToken } from "../lib/auth";
import { ApiError } from "./error";

// Augment Express Request with the authenticated user.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function readToken(req: Request): string | null {
  const cookie = req.cookies?.[env.authCookieName];
  if (cookie) return cookie;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) return next(new ApiError(401, "Authentication required"));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}

// Optional role gate, e.g. requireRole("admin").
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Insufficient permissions"));
    }
    next();
  };
}
