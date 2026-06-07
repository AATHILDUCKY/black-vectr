/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

const nextConfig = {
  reactStrictMode: true,
  // Enable SWR (stale-while-revalidate) for better caching
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  // Proxy API + uploaded files to the Express backend so the browser only ever
  // talks to the Next origin (no CORS in the browser, clean relative URLs).
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
    // Optimize images: use WebP when possible, default quality 75 (good balance)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compress CSS/JS more aggressively
  compress: true,
  // Enable experimental performance features
  experimental: {
    // Reduces build size by removing unused CSS
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
    ],
  },
};

export default nextConfig;
