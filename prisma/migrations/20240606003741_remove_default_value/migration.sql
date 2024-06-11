-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weatherId" INTEGER NOT NULL,
    "temperature" REAL NOT NULL,
    "circuitId" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    CONSTRAINT "Race_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Pilot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Race" ("circuitId", "date", "id", "name", "temperature", "weatherId", "winnerId") SELECT "circuitId", "date", "id", "name", "temperature", "weatherId", "winnerId" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
CREATE UNIQUE INDEX "Race_date_circuitId_key" ON "Race"("date", "circuitId");
PRAGMA foreign_key_check("Race");
PRAGMA foreign_keys=ON;
