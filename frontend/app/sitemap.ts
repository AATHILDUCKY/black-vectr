import type { MetadataRoute } from "next";
import { getServices, getPortfolio, getPosts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/services",
    "/portfolio",
    "/about",
    "/blog",
    "/projects",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [services, portfolio, posts] = await Promise.all([
    getServices(),
    getPortfolio(),
    getPosts(),
  ]);

  return [
    ...staticRoutes,
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date() })),
    ...portfolio.map((p) => ({ url: `${base}/portfolio/${p.slug}`, lastModified: new Date() })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    })),
  ];
}
