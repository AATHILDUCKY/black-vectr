// Server-side data fetching. Runs in Server Components / route handlers and
// talks directly to the backend (BACKEND_INTERNAL_URL) — never the browser.
import "server-only";
import type {
  Post,
  PortfolioItem,
  Service,
  Testimonial,
  TeamMember,
  Project,
  SiteSettings,
  Category,
  Logo,
} from "./types";

const BASE = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

// Cache content with named tags so the admin can purge them on-demand: after a
// mutation (which goes straight to the Express backend, bypassing Next), the
// admin POSTs to /revalidate, which calls revalidateTag(tag) — making edits show
// up on the public site immediately instead of waiting out the revalidate window.
async function get<T>(
  path: string,
  fallback: T,
  tag?: string,
  revalidate = 60,
): Promise<T> {
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      next: { revalidate, ...(tag ? { tags: [tag] } : {}) },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // Backend not up yet / network blip — render with fallback rather than 500.
    return fallback;
  }
}

export const getServices = () => get<Service[]>("/services", [], "services");
export const getService = (slug: string) =>
  get<Service | null>(`/services/${slug}`, null, "services");

export const getPortfolio = () => get<PortfolioItem[]>("/portfolio", [], "portfolio");
export const getPortfolioItem = (slug: string) =>
  get<PortfolioItem | null>(`/portfolio/${slug}`, null, "portfolio");

export const getPosts = () =>
  get<Post[]>("/posts?status=published", [], "posts");
export const getPost = (slug: string) => get<Post | null>(`/posts/${slug}`, null, "posts");
export const getCategories = () => get<Category[]>("/categories", [], "categories");

export const getLogos = () => get<Logo[]>("/logos", [], "logos");
export const getTestimonials = () => get<Testimonial[]>("/testimonials", [], "testimonials");
export const getTeam = () => get<TeamMember[]>("/team", [], "team");
export const getProjects = () => get<Project[]>("/projects", [], "projects");
export const getProject = (slug: string) =>
  get<Project | null>(`/projects/${slug}`, null, "projects");

export const getSettings = () =>
  get<SiteSettings>(
    "/settings",
    {
      id: 1,
      brandName: "BlackVectr",
      tagline: "",
      logoUrl: null,
      logoMode: "logo_name",
      contactEmail: "hello@blackvectr.com",
      contactPhone: null,
      address: null,
      socials: {},
      heroHeadline: "We break in. So no one else can.",
      heroSubheadline: "",
      heroCta: "Book an engagement",
      seoTitle: "BlackVectr",
      seoDescription: "",
      privacyPolicy: "",
      termsOfService: "",
    },
    "settings",
    30,
  );

// Tags used by the public content fetches above. The /revalidate route purges
// these on demand; passing no tag purges them all.
export const CONTENT_TAGS = [
  "services",
  "portfolio",
  "posts",
  "categories",
  "logos",
  "testimonials",
  "team",
  "projects",
  "settings",
] as const;
