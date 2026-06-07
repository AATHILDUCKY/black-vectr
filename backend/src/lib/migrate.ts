import { execFileSync } from "node:child_process";
import { env } from "./env";

/**
 * Apply any pending Prisma migrations before the server accepts traffic.
 *
 * Runs `prisma migrate deploy` against the same DATABASE_URL the app uses —
 * already loaded into process.env by ./env, including the monorepo root .env
 * fallback that the Prisma CLI on its own does NOT read. Passing process.env to
 * the child is what lets the migration find DATABASE_URL.
 *
 * This keeps the production database in lock-step with the schema on every
 * deploy/restart, so adding a column (e.g. gaMeasurementId) can never leave the
 * live DB behind and throw Prisma P2022 "column does not exist" errors.
 *
 * Best-effort: a failure is logged but does not stop the server from booting,
 * so a migration hiccup never turns into a pm2 crash-loop.
 */
export function runMigrations(): void {
  // Invoke the CLI with the same Node binary running this app rather than the
  // `.bin/prisma` shim, whose `#!/usr/bin/env node` shebang breaks under pm2 /
  // nvm where `node` may not be on PATH.
  const prismaCli = require.resolve("prisma/build/index.js");

  try {
    console.log("⏳ Applying database migrations (prisma migrate deploy)…");
    execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });
    console.log("✅ Database schema is up to date.\n");
  } catch (err) {
    console.error(
      "⚠ prisma migrate deploy failed — starting the server anyway. " +
        "Apply migrations manually if the schema is out of date.",
      err instanceof Error ? err.message : err,
    );
  }
}

// Only auto-migrate in production (where deploys happen). In development you
// drive the schema yourself with `npm run migrate` (prisma migrate dev), and
// re-running deploy on every tsx-watch restart would just add noise/latency.
// Set MIGRATE_ON_BOOT=true to force it on locally.
export const shouldAutoMigrate =
  env.isProd || process.env.MIGRATE_ON_BOOT === "true";
