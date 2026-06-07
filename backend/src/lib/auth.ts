import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "./env";

export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: string;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as unknown as JwtPayload;
}

// Options shared by login/logout so the cookie is set & cleared identically.
export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
}
