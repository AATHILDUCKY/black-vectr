import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[400px]" />
      <div className="relative text-center">
        <p className="font-display text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back home
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline">
            Contact us
          </ButtonLink>
        </div>
        <Link href="/portfolio" className="mt-6 inline-block text-sm text-muted-foreground underline">
          Or explore our work
        </Link>
      </div>
    </main>
  );
}
