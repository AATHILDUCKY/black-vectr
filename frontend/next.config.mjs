/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

const nextConfig = {
  reactStrictMode: true,
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
  },
};

export default nextConfig;
