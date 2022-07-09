-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "poster" TEXT,
    "userId" TEXT,
    CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_movie" ("id", "poster", "title") SELECT "id", "poster", "title" FROM "movie";
DROP TABLE "movie";
ALTER TABLE "new_movie" RENAME TO "movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
