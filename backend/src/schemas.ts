import { z } from "zod";

// Reusable pieces
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase slug (a-z, 0-9, dashes)");

// ── Auth ────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// ── Public: contact + newsletter ─────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(160).optional().or(z.literal("")),
  service: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
  // Honeypot — accept any value here so a stray autofill never blocks a real
  // user. The route silently drops the submission when this is non-empty.
  website: z.string().max(200).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

// ── Leads (admin) ─────────────────────────────────────────────────────────
export const leadUpdateSchema = z.object({
  status: z.enum(["new", "read", "handled"]),
});

// ── Posts ───────────────────────────────────────────────────────────────
export const postCreateSchema = z.object({
  title: z.string().min(1),
  slug,
  excerpt: z.string().min(1),
  body: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  categoryId: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const postUpdateSchema = postCreateSchema.partial();

export const categoryCreateSchema = z.object({ name: z.string().min(1), slug });
export const categoryUpdateSchema = categoryCreateSchema.partial();

// ── Portfolio ─────────────────────────────────────────────────────────────
export const portfolioCreateSchema = z.object({
  title: z.string().min(1),
  slug,
  client: z.string().min(1),
  category: z.string().min(1),
  images: z.array(z.string()).default([]),
  summary: z.string().min(1),
  results: z.string().optional().nullable(),
  link: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});
export const portfolioUpdateSchema = portfolioCreateSchema.partial();

// ── Services ──────────────────────────────────────────────────────────────
export const serviceCreateSchema = z.object({
  title: z.string().min(1),
  slug,
  icon: z.string().optional().nullable(),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  features: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});
export const serviceUpdateSchema = serviceCreateSchema.partial();

// ── Testimonials ──────────────────────────────────────────────────────────
export const testimonialCreateSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  quote: z.string().min(1),
  avatar: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
});
export const testimonialUpdateSchema = testimonialCreateSchema.partial();

// ── Team ──────────────────────────────────────────────────────────────────
export const teamCreateSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  socials: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      dribbble: z.string().optional(),
    })
    .default({}),
  order: z.number().int().default(0),
});
export const teamUpdateSchema = teamCreateSchema.partial();

// ── Projects (open source) ──────────────────────────────────────────────────
// A single attachable resource — a labelled outbound link (repo, docs, demo…).
const projectResource = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const projectCreateSchema = z.object({
  title: z.string().min(1),
  slug,
  tagline: z.string().min(1),
  description: z.string().min(1),
  language: z.string().optional().nullable(),
  topics: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().nullable().or(z.literal("")),
  stars: z.number().int().min(0).default(0),
  license: z.string().optional().nullable(),
  status: z.enum(["active", "wip", "archived"]).default("active"),
  resources: z.array(projectResource).default([]),
  coverImage: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});
export const projectUpdateSchema = projectCreateSchema.partial();

// ── Logos (trusted-by marquee) ───────────────────────────────────────────────
export const logoCreateSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal("")),
  order: z.number().int().default(0),
});
export const logoUpdateSchema = logoCreateSchema.partial();

// ── Site settings ─────────────────────────────────────────────────────────
export const settingsUpdateSchema = z.object({
  brandName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  logoMode: z.enum(["logo_name", "logo", "name"]).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socials: z
    .object({
      github: z.string().optional(),
      x: z.string().optional(),
      linkedin: z.string().optional(),
      mastodon: z.string().optional(),
      discord: z.string().optional(),
      youtube: z.string().optional(),
      reddit: z.string().optional(),
    })
    .optional(),
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
  heroCta: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  privacyPolicy: z.string().optional(),
  termsOfService: z.string().optional(),
});
