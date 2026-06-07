import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getSettings } from "@/lib/api";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seoTitle || s.brandName, template: `%s — ${s.brandName}` },
    description: s.seoDescription || s.tagline,
    openGraph: {
      title: s.seoTitle || s.brandName,
      description: s.seoDescription || s.tagline,
      type: "website",
      siteName: s.brandName,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
