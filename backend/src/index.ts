import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { env } from "./lib/env";
import { runMigrations, shouldAutoMigrate } from "./lib/migrate";
import api from "./routes";
import { errorHandler, notFound } from "./middleware/error";

// Bring the database up to date with the schema before serving any requests,
// so a deploy that adds a column can't 500 with Prisma P2022 errors.
if (shouldAutoMigrate) runMigrations();

const app = express();

// Behind a proxy (Next rewrites / hosting) — needed for correct rate-limit IPs.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan("dev"));

// Serve uploaded files.
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), env.uploadDir), {
    maxAge: "7d",
  }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api", api);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`\n🚀 Backend API running at http://localhost:${env.port}`);
  console.log(`   Health: http://localhost:${env.port}/api/health`);
  console.log(`   CORS origin: ${env.frontendOrigin}\n`);
});
