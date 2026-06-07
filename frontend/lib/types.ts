// Shapes returned by the backend API (JSON fields already parsed).

export interface Service {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  shortDescription: string;
  longDescription: string;
  features: string[];
  order: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  client: string;
  category: string;
  images: string[];
  summary: string;
  results: string | null;
  link: string | null;
  featured: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: "draft" | "published";
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  categoryId: number | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar: string | null;
  rating: number;
  order: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  socials: { twitter?: string; linkedin?: string; github?: string; dribbble?: string };
  order: number;
}

export interface ProjectResource {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  language: string | null;
  topics: string[];
  repoUrl: string | null;
  stars: number;
  license: string | null;
  status: "active" | "wip" | "archived";
  resources: ProjectResource[];
  coverImage: string | null;
  featured: boolean;
  order: number;
}

export interface Logo {
  id: number;
  name: string;
  logo: string | null;
  url: string | null;
  order: number;
}

export interface SiteSettings {
  id: number;
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  logoMode: "logo_name" | "logo" | "name";
  contactEmail: string;
  contactPhone: string | null;
  address: string | null;
  socials: Partial<Record<import("@/components/ui/socials").SocialKey, string>>;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  seoTitle: string;
  seoDescription: string;
  /** Markdown for the legal pages. Empty → the page shows a sensible default. */
  privacyPolicy: string;
  termsOfService: string;
  /** Google Analytics 4 measurement ID (e.g. "G-XXXXXXXXXX"). Empty → disabled. */
  gaMeasurementId: string;
  updatedAt?: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  status: "new" | "read" | "handled";
  createdAt: string;
}

export interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export interface DashboardStats {
  totals: {
    leads: number;
    newLeads: number;
    posts: number;
    publishedPosts: number;
    portfolio: number;
    subscribers: number;
    services: number;
    testimonials: number;
  };
  /** Week-over-week % change (null when there's no prior-week baseline). */
  deltas: {
    leads: number | null;
    subscribers: number | null;
  };
  leadsOverTime: { date: string; count: number }[];
  activityOverTime: { date: string; leads: number; subscribers: number }[];
  leadStatus: { status: string; count: number }[];
  topServices: { service: string; count: number }[];
  recentActivity: Pick<Lead, "id" | "name" | "email" | "status" | "createdAt">[];
}
