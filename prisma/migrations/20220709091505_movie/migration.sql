-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "poster" TEXT,
    "userId" TEXT,
    CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
