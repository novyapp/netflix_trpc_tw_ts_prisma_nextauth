/*
  Warnings:

  - You are about to alter the column `vote_average` on the `movie` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

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
    "vote_average" REAL,
    "vote_count" INTEGER,
    CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_movie" ("backdrop_path", "id", "movieId", "name", "original_language", "original_name", "overview", "popularity", "poster", "poster_path", "release_date", "title", "userId", "vote_average", "vote_count") SELECT "backdrop_path", "id", "movieId", "name", "original_language", "original_name", "overview", "popularity", "poster", "poster_path", "release_date", "title", "userId", "vote_average", "vote_count" FROM "movie";
DROP TABLE "movie";
ALTER TABLE "new_movie" RENAME TO "movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
