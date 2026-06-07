"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { Project } from "@/lib/types";

export default function ProjectsAdminPage() {
  return (
    <ResourceManager<Project>
      title="Open Source Projects"
      description="Manage the open-source projects shown on the public Projects page."
      resource="/projects"
      columns={[
        { header: "Title", render: (p) => <span className="font-mono font-medium">{p.title}</span> },
        { header: "Language", render: (p) => p.language ?? "—" },
        { header: "Stars", render: (p) => (p.stars ? p.stars.toLocaleString() : "—") },
        { header: "Status", render: (p) => p.status },
        { header: "Featured", render: (p) => (p.featured ? "★" : "—") },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, placeholder: "vectr-recon" },
        { name: "slug", label: "Slug", type: "slug", slugFrom: "title" },
        { name: "tagline", label: "Tagline", type: "text", required: true, placeholder: "One-line description shown on the card" },
        { name: "description", label: "Description (markdown)", type: "markdown", required: true },
        { name: "language", label: "Primary language", type: "text", placeholder: "Go, Python, Rust…" },
        { name: "topics", label: "Topics", type: "tags", help: "Comma-separated, e.g. recon, osint, cli." },
        { name: "repoUrl", label: "Repository URL", type: "text", placeholder: "https://github.com/…" },
        { name: "stars", label: "GitHub stars", type: "number" },
        { name: "license", label: "License", type: "text", placeholder: "MIT, Apache-2.0…" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "wip", label: "In progress" },
            { value: "archived", label: "Archived" },
          ],
          defaultValue: "active",
        },
        {
          name: "resources",
          label: "Attached resources",
          type: "links",
          help: "Links shown on the card — Docs, Demo, Releases, package registries, etc.",
        },
        { name: "coverImage", label: "Cover image", type: "image" },
        { name: "featured", label: "Featured", type: "boolean" },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
