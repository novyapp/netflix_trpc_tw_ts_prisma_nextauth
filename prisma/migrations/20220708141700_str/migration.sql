-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "userSubscription" TEXT NOT NULL DEFAULT 'notier',
    "subscriptionCreated" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "isActive", "name", "stripeCustomerId", "subscriptionCreated", "userSubscription") SELECT "email", "emailVerified", "id", "image", "isActive", "name", "stripeCustomerId", "subscriptionCreated", "userSubscription" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
