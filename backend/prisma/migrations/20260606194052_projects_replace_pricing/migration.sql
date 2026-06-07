-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PricingPlan";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT,
    "topics" TEXT NOT NULL DEFAULT '[]',
    "repoUrl" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "license" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "resources" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "brandName" TEXT NOT NULL DEFAULT 'BlackVectr',
    "tagline" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@blackvectr.com',
    "contactPhone" TEXT,
    "address" TEXT,
    "socials" TEXT NOT NULL DEFAULT '{}',
    "heroHeadline" TEXT NOT NULL DEFAULT 'We help businesses grow online',
    "heroSubheadline" TEXT NOT NULL DEFAULT '',
    "heroCta" TEXT NOT NULL DEFAULT 'Start a project',
    "seoTitle" TEXT NOT NULL DEFAULT 'BlackVectr — Cybersecurity for modern infrastructure',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSetting" ("address", "brandName", "contactEmail", "contactPhone", "heroCta", "heroHeadline", "heroSubheadline", "id", "logoUrl", "seoDescription", "seoTitle", "socials", "tagline", "updatedAt") SELECT "address", "brandName", "contactEmail", "contactPhone", "heroCta", "heroHeadline", "heroSubheadline", "id", "logoUrl", "seoDescription", "seoTitle", "socials", "tagline", "updatedAt" FROM "SiteSetting";
DROP TABLE "SiteSetting";
ALTER TABLE "new_SiteSetting" RENAME TO "SiteSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Project_order_idx" ON "Project"("order");

