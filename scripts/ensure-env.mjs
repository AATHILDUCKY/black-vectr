// Copies .env.example into backend/.env and frontend/.env.local if they don't
// already exist, so `npm run setup` works with zero manual steps.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const example = resolve(root, ".env.example");

const targets = [
  resolve(root, "backend/.env"),
  resolve(root, "frontend/.env.local"),
];

for (const target of targets) {
  if (existsSync(target)) {
    console.log(`✓ ${target} already exists — leaving it untouched.`);
  } else {
    copyFileSync(example, target);
    console.log(`+ Created ${target} from .env.example`);
  }
}
console.log("\n⚠  Remember to set a strong JWT_SECRET and ADMIN_PASSWORD before production.\n");
