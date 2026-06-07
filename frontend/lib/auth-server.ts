import "server-only";
import { cookies } from "next/headers";

const BASE = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
const COOKIE = process.env.AUTH_COOKIE_NAME || "agency_token";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

/** Validates the JWT cookie against the backend. Returns null if unauthenticated. */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Cookie: `${COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as AdminUser;
  } catch {
    return null;
  }
}
