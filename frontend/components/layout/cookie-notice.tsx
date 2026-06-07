"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEY = "agency_cookie_consent";

export function CookieNotice() {
  const [visible, setVisible] = React.useState(false);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        setVisible(true);
        // Next frame → trigger the CSS slide-in transition.
        requestAnimationFrame(() => setEntered(true));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function dismiss(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setEntered(false);
    window.setTimeout(() => setVisible(false), 250);
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl rounded-lg border border-border bg-card p-4 shadow-xl transition-all duration-300 ease-out sm:flex sm:items-center sm:justify-between sm:gap-4",
        entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience and analyze traffic. See our{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <Button size="sm" variant="outline" onClick={() => dismiss("declined")}>
          Decline
        </Button>
        <Button size="sm" onClick={() => dismiss("accepted")}>
          Accept
        </Button>
      </div>
    </div>
  );
}
