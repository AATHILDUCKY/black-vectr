"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioAdminPage() {
  return (
    <ResourceManager<PortfolioItem>
      title="Portfolio"
      description="Manage case studies."
      resource="/portfolio"
      columns={[
        { header: "Title", render: (p) => <span className="font-medium">{p.title}</span> },
        { header: "Client", render: (p) => p.client },
        { header: "Category", render: (p) => p.category },
        { header: "Featured", render: (p) => (p.featured ? "★" : "—") },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", slugFrom: "title" },
        { name: "client", label: "Client", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true, placeholder: "E-commerce, Web App, Marketing…" },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "results", label: "Results / outcomes", type: "textarea" },
        { name: "images", label: "Images", type: "tags", help: "Paste image URLs, comma-separated." },
        { name: "link", label: "External link", type: "text" },
        { name: "featured", label: "Featured on homepage", type: "boolean" },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
