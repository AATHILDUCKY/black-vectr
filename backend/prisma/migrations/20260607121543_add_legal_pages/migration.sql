-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "brandName" TEXT NOT NULL DEFAULT 'BlackVectr',
    "tagline" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "logoMode" TEXT NOT NULL DEFAULT 'logo_name',
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@blackvectr.com',
    "contactPhone" TEXT,
    "address" TEXT,
    "socials" TEXT NOT NULL DEFAULT '{}',
    "heroHeadline" TEXT NOT NULL DEFAULT 'We help businesses grow online',
    "heroSubheadline" TEXT NOT NULL DEFAULT '',
    "heroCta" TEXT NOT NULL DEFAULT 'Start a project',
    "seoTitle" TEXT NOT NULL DEFAULT 'BlackVectr — Cybersecurity for modern infrastructure',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "privacyPolicy" TEXT NOT NULL DEFAULT '',
    "termsOfService" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSetting" ("address", "brandName", "contactEmail", "contactPhone", "heroCta", "heroHeadline", "heroSubheadline", "id", "logoMode", "logoUrl", "seoDescription", "seoTitle", "socials", "tagline", "updatedAt") SELECT "address", "brandName", "contactEmail", "contactPhone", "heroCta", "heroHeadline", "heroSubheadline", "id", "logoMode", "logoUrl", "seoDescription", "seoTitle", "socials", "tagline", "updatedAt" FROM "SiteSetting";
DROP TABLE "SiteSetting";
ALTER TABLE "new_SiteSetting" RENAME TO "SiteSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

