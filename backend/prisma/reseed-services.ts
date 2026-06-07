// Replaces ONLY the Service rows with the current SERVICES set, leaving every
// other table (settings, logos, posts, portfolio, leads, …) untouched. Safe to
// run against a live database when the services offering changes.
//   npx tsx prisma/reseed-services.ts   (from the backend/ directory)
import { PrismaClient } from "@prisma/client";
import { SERVICES } from "./services-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Reseeding services…");
  await prisma.service.deleteMany();
  for (const s of SERVICES) {
    await prisma.service.create({
      data: { ...s, features: JSON.stringify(s.features) },
    });
  }
  console.log(`✅ ${SERVICES.length} services reseeded.`);
}

main()
  .catch((e) => {
    console.error("Reseed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
