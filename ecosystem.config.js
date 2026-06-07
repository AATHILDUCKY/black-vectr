// PM2 process config for the BlackVectr monorepo.
//   Backend  → Express/Prisma API on BACKEND_PORT (default 4000)
//   Frontend → Next.js (next start) on port 3000, proxies /api + /uploads to the API
//
// Build first (npm run build in each app), then: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "blackvectr-api",
      cwd: "./backend",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "400M",
      env: { NODE_ENV: "production" },
    },
    {
      name: "blackvectr-web",
      cwd: "./frontend",
      // Run the Next.js production server via the local binary.
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "600M",
      env: { NODE_ENV: "production" },
    },
  ],
};
