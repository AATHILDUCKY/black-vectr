import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { CookieNotice } from "@/components/layout/cookie-notice";
import { ScrollProgress } from "@/components/animation/scroll-progress";
import { SmoothScroll } from "@/components/animation/smooth-scroll";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getSettings } from "@/lib/api";

// Shared chrome for the public marketing site.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: siteUrl,
    description: settings.seoDescription || settings.tagline,
    email: settings.contactEmail,
    ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
    sameAs: Object.values(settings.socials || {}).filter(Boolean),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <GoogleAnalytics id={settings.gaMeasurementId} />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar
        brandName={settings.brandName}
        logoUrl={settings.logoUrl}
        logoMode={settings.logoMode}
      />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <BackToTop />
      <CookieNotice />
    </>
  );
}
