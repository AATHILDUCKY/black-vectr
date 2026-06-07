"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsAdminPage() {
  return (
    <ResourceManager<Testimonial>
      title="Testimonials"
      description="Client quotes shown across the site."
      resource="/testimonials"
      columns={[
        { header: "Name", render: (t) => <span className="font-medium">{t.name}</span> },
        { header: "Company", render: (t) => t.company || "—" },
        { header: "Rating", render: (t) => "★".repeat(t.rating) },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "company", label: "Company", type: "text" },
        { name: "quote", label: "Quote", type: "textarea", required: true },
        { name: "avatar", label: "Avatar", type: "image" },
        { name: "rating", label: "Rating (1–5)", type: "number", defaultValue: 5 },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
