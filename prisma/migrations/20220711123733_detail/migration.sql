/*
  Warnings:

  - The primary key for the `movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `movie` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `movieId` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_movie" (
    "movieId" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER,
    "title" TEXT,
    "poster" TEXT,
    "userId" TEXT,
    "backdrop_path" TEXT,
    "release_date" TEXT,
    "name" TEXT,
    "original_language" TEXT,
    "original_name" TEXT,
    "overview" TEXT,
    "popularity" INTEGER,
    "poster_path" TEXT,
    "vote_average" INTEGER,
    "vote_count" INTEGER,
    CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_movie" ("id", "movieId", "poster", "title", "userId") SELECT "id", "movieId", "poster", "title", "userId" FROM "movie";
DROP TABLE "movie";
ALTER TABLE "new_movie" RENAME TO "movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
