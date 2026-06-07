"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gradient">Oops</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          An unexpected error occurred. You can try again or head back home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" size="lg" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
