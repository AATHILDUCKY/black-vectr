"use client";
import { ResourceManager } from "@/components/admin/resource-manager";
import type { TeamMember } from "@/lib/types";

export default function TeamAdminPage() {
  return (
    <ResourceManager<TeamMember>
      title="Team"
      description="Manage team members shown on the About page."
      resource="/team"
      columns={[
        { header: "Name", render: (m) => <span className="font-medium">{m.name}</span> },
        { header: "Role", render: (m) => m.role },
        { header: "Order", render: (m) => m.order },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true },
        { name: "photo", label: "Photo", type: "image" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "order", label: "Sort order", type: "number" },
      ]}
    />
  );
}
