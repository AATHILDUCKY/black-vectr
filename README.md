# BlackVectr — Cybersecurity Company Website

A complete, production-ready cybersecurity company website: a fast, animated, dark-themed
public marketing site **plus** a secure admin dashboard, in a single monorepo. One command —
`npm run dev` — boots both the **Next.js** frontend and the **Express** backend together.

Solutions showcased: **Network Security**, **Cloud Security**, **Vulnerability Management**,
**Security Analytics & SIEMs**, **Cloud Platform Engineering**, and **Threat Intelligence &
Risk Management** — all editable from the admin dashboard.

- **Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · `next/image` · `next/font`
- **Backend:** Node.js · Express · TypeScript · REST API
- **Database:** SQLite via Prisma ORM (migrations + seed)
- **Auth:** JWT in HTTP-only cookies · bcrypt password hashing · protected admin + API routes
- **Validation:** Zod (client + server) · **Email:** Nodemailer (console transport in dev)

---

## Quick start

```bash
# 1. Install everything, create env files, migrate + seed the database
npm run setup

# 2. Start frontend + backend together
npm run dev
```

- Public site → **http://localhost:3000**
- Admin dashboard → **http://localhost:3000/admin**
- API (proxied via Next, also direct) → **http://localhost:4000/api**

### Default admin login

Seeded from your `.env` (printed to the console when seeding):

```
Email:    admin@blackvectr.com
Password: ChangeMe123!
```

> Change these in `backend/.env` and re-run `npm run db:reset`, or use **Admin → Settings →
> Change password** after logging in.

---

## Prerequisites

- **Node.js 18.18+** (tested on Node 24) and npm 9+

No external database needed — SQLite lives in a single file at `backend/prisma/dev.db`.

---

## Environment variables

`npm run setup` copies `.env.example` to `backend/.env` and `frontend/.env.local`
automatically. Key variables (see [.env.example](.env.example) for the full list):

| Variable | Purpose |
| --- | --- |
| `BACKEND_PORT` | Express port (default `4000`) |
| `FRONTEND_ORIGIN` | Allowed CORS origin (default `http://localhost:3000`) |
| `DATABASE_URL` | SQLite file path (default `file:./dev.db`) |
| `JWT_SECRET` | **Set a long random string in production** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeded admin account |
| `SMTP_*` / `MAIL_FROM` / `CONTACT_NOTIFY_TO` | Email. Leave `SMTP_HOST` empty → emails log to console |
| `BACKEND_INTERNAL_URL` | Where the frontend (SSR) reaches the API (default `http://localhost:4000`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for SEO/sitemap) |

In **dev**, the Next.js server rewrites `/api/*` and `/uploads/*` to the backend, so the
browser only ever talks to `localhost:3000` (no CORS, clean relative URLs).

---

## Project structure

```
.
├─ package.json            # root scripts (dev/build/start/setup) via concurrently
├─ .env.example            # all env vars, documented
├─ scripts/ensure-env.mjs  # auto-creates env files on setup
├─ frontend/               # Next.js app
│  ├─ app/
│  │  ├─ (site)/           # public marketing pages (shared nav/footer)
│  │  ├─ admin/            # admin: /login + (protected) dashboard
│  │  ├─ sitemap.ts, robots.ts, layout.tsx, not-found.tsx, error.tsx
│  ├─ components/          # ui/, layout/, sections/, admin/, animation/, theme/
│  └─ lib/                 # api (server fetch), client (browser fetch), types, utils
└─ backend/                # Express API
   ├─ src/
   │  ├─ routes/           # auth, contact, newsletter, leads, settings, dashboard, uploads, index
   │  ├─ middleware/       # auth (JWT), validate (Zod), error handling
   │  ├─ lib/              # prisma, env, auth, mailer, json helpers, crud factory
   │  └─ index.ts          # server bootstrap (CORS, rate limit, static uploads)
   ├─ prisma/
   │  ├─ schema.prisma     # all models
   │  ├─ migrations/       # committed initial migration
   │  └─ seed.ts           # admin user + realistic demo content
   └─ uploads/             # uploaded images (served at /uploads)
```

---

## Available scripts (root)

| Script | Description |
| --- | --- |
| `npm run setup` | Create env files, install all deps, migrate + seed the DB |
| `npm run dev` | Run **frontend + backend** together (one command) |
| `npm run build` | Build backend (tsc) then frontend (next build) |
| `npm run start` | Run both in production mode |
| `npm run db:reset` | Re-run migrations + seed (resets demo content) |

Backend-only (run with `npm --prefix backend run <script>`): `migrate`, `seed`,
`db:setup`, `prisma:generate`.

---

## Features

### Public site
Home (animated hero, logo strip, services, animated stats, featured case studies,
process timeline, testimonials slider, CTA), Services (+ dynamic detail pages),
Portfolio with category filtering (+ detail pages), About (team from DB), Blog
(Markdown posts + per-post SEO/JSON-LD), Pricing (+ FAQ), Contact (validated form →
saves lead + emails), Privacy/Terms, custom 404 & error pages. Sticky animated navbar,
mobile drawer, light/dark toggle, newsletter signup, back-to-top, cookie notice.

### Admin dashboard (`/admin`)
JWT login/logout + change password. Dashboard with stat cards, a 14-day leads chart,
and recent activity. Managers for **Leads** (search/filter, detail, status, delete, CSV
export), **Subscribers** (list, CSV, delete), **Blog Posts**, **Portfolio**,
**Services**, **Testimonials**, **Team**, **Pricing** (full CRUD with image upload), and
**Site Settings** (brand, hero copy, contact, socials, SEO — edits update the live site).

### Performance, accessibility & SEO
Server components + light caching, code-split client islands, lazy images, fonts via
`next/font`, reduced-motion support on every animation, semantic HTML + keyboard/focus
support, WCAG-AA contrast, per-page metadata + Open Graph, `sitemap.xml`, `robots.txt`,
and Organization/Article JSON-LD.

---

## Deployment notes

1. Set production env vars — especially a strong `JWT_SECRET`, real `ADMIN_PASSWORD`,
   `COOKIE_SECURE=true` (HTTPS), `FRONTEND_ORIGIN`, and `NEXT_PUBLIC_SITE_URL`.
2. Configure SMTP (`SMTP_HOST`, etc.) so contact emails actually send.
3. `npm run build`, then `npm run start`. Apply migrations in prod with
   `npm --prefix backend run migrate:deploy`.
4. SQLite is great for small/medium sites. For higher scale, switch the Prisma
   `datasource` to Postgres and update `DATABASE_URL` — the rest of the code is unchanged.
5. The backend serves uploaded files from `backend/uploads`; mount a persistent volume
   there (or swap to object storage) in production.
