import Script from "next/script";

/**
 * Loads Google Analytics 4 (gtag.js) when a measurement ID is configured in
 * Admin → Settings → Analytics. Renders nothing when the ID is empty, so the
 * tracker is fully opt-in. `afterInteractive` keeps it out of the critical path.
 */
export function GoogleAnalytics({ id }: { id?: string }) {
  const gaId = id?.trim();
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
