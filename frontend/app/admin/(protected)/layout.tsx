import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
