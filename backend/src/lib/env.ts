import dotenv from "dotenv";
import path from "path";

// Load backend/.env, then fall back to a root .env (monorepo convenience).
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

function required(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.BACKEND_PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",

  jwtSecret: required("JWT_SECRET", "dev-insecure-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME ?? "agency_token",
  cookieSecure: process.env.COOKIE_SECURE === "true",

  admin: {
    email: process.env.ADMIN_EMAIL ?? "admin@blackvectr.com",
    password: process.env.ADMIN_PASSWORD ?? "ChangeMe123!",
    name: process.env.ADMIN_NAME ?? "Site Admin",
  },

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    secure: process.env.SMTP_SECURE === "true",
    from: process.env.MAIL_FROM ?? "BlackVectr <no-reply@blackvectr.com>",
    notifyTo: process.env.CONTACT_NOTIFY_TO ?? "hello@blackvectr.com",
  },

  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 5),
};
