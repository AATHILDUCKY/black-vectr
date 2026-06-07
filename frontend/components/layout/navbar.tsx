"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "/services", label: "Solutions" },
  { href: "/portfolio", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
  { href: "/projects", label: "Open Source" },
];

export function Navbar({
  brandName,
  logoUrl,
  logoMode = "logo_name",
}: {
  brandName: string;
  logoUrl?: string | null;
  logoMode?: "logo_name" | "logo" | "name";
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change.
  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="container-px flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label={brandName}
          className="flex items-center gap-2 font-display text-xl font-semibold"
        >
          {logoMode !== "name" &&
            (logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={brandName}
                // Match the "Book assessment" button height exactly (size="sm" =
                // h-9 / 36px) at all breakpoints. width is auto so the logo keeps
                // its aspect ratio, max-width stops ultra-wide logos from crowding
                // the nav, and object-contain prevents distortion or cropping.
                className="h-9 w-auto max-w-[180px] object-contain"
              />
            ) : (
              // Fallback lettermark when no logo image is uploaded.
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-sm text-background shadow-lg shadow-primary/30">
                {brandName.charAt(0)}
              </span>
            ))}
          {logoMode !== "logo" && <span>{brandName.toUpperCase()}</span>}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(item.href) && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Book assessment
          </ButtonLink>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer — CSS grid-rows height transition, no JS animation lib. */}
      <div
        className={cn(
          "grid overflow-hidden border-border bg-background transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr] border-b opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="container-px flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-base font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/contact" className="mt-2 w-full">
              Book assessment
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
