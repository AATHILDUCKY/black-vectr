"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { Logo } from "@/lib/types";

export default function LogosAdminPage() {
  return (
    <ResourceManager<Logo>
      title="Logos"
      description="Platform / partner logos shown in the scrolling 'Trusted by' marquee on the home page."
      resource="/logos"
      columns={[
        {
          header: "Logo",
          render: (l) =>
            l.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.logo}
                alt={l.name}
                className="h-8 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <span className="text-xs text-muted-foreground">— (name shown)</span>
            ),
        },
        { header: "Name", render: (l) => <span className="font-medium">{l.name}</span> },
        { header: "Order", render: (l) => l.order },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        {
          name: "logo",
          label: "Logo image",
          type: "image",
          imageKind: "logo",
          help: "Optional. PNG/SVG with a transparent background works best. If empty, the name is shown as a wordmark.",
        },
        {
          name: "url",
          label: "Website URL",
          type: "text",
          placeholder: "https://example.com",
          help: "Optional — makes the logo clickable.",
        },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
