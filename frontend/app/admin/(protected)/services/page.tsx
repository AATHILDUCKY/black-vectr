"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { Service } from "@/lib/types";

export default function ServicesAdminPage() {
  return (
    <ResourceManager<Service>
      title="Services"
      description="Manage the services you offer."
      resource="/services"
      columns={[
        { header: "Title", render: (s) => <span className="font-medium">{s.title}</span> },
        { header: "Slug", render: (s) => <span className="text-muted-foreground">{s.slug}</span> },
        { header: "Order", render: (s) => s.order },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", slugFrom: "title" },
        {
          name: "icon",
          label: "Icon",
          type: "select",
          options: [
            { value: "Code2", label: "Code (Web Dev)" },
            { value: "Megaphone", label: "Megaphone (Marketing)" },
            { value: "Search", label: "Search (SEO)" },
            { value: "Palette", label: "Palette (Design)" },
            { value: "LineChart", label: "Chart (Analytics)" },
          ],
        },
        { name: "shortDescription", label: "Short description", type: "textarea", required: true },
        { name: "longDescription", label: "Long description", type: "textarea", required: true },
        { name: "features", label: "Features", type: "tags" },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
