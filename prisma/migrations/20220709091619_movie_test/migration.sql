/*
  Warnings:

  - You are about to drop the column `userId` on the `movie` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "poster" TEXT
);
INSERT INTO "new_movie" ("id", "poster", "title") SELECT "id", "poster", "title" FROM "movie";
DROP TABLE "movie";
ALTER TABLE "new_movie" RENAME TO "movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
