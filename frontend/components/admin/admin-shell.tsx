"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Mail,
  FileText,
  Briefcase,
  Wrench,
  Quote,
  Users,
  Boxes,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/client";
import type { AdminUser } from "@/lib/auth-server";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/logos", label: "Logos", icon: ImageIcon },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Boxes },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-border bg-card transition-transform lg:translate-x-0",
          open && "translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="font-display text-lg font-semibold">
            Admin
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex w-full flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.email}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-gradient text-sm font-semibold text-background">
              {user.name.charAt(0)}
            </span>
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
