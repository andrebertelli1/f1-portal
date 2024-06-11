-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pilot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "nationality" TEXT NOT NULL,
    "scuderiaId" INTEGER NOT NULL,
    CONSTRAINT "Pilot_scuderiaId_fkey" FOREIGN KEY ("scuderiaId") REFERENCES "Scuderia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scuderia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "length" REAL,
    "laps" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Weather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "condition" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weatherId" INTEGER NOT NULL,
    "temperature" REAL NOT NULL,
    "circuitId" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL DEFAULT 8,
    CONSTRAINT "Race_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Pilot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaceParticipation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "pilotId" INTEGER NOT NULL,
    "position" INTEGER,
    CONSTRAINT "RaceParticipation_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceParticipation_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "Pilot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Race_date_circuitId_key" ON "Race"("date", "circuitId");

-- CreateIndex
CREATE UNIQUE INDEX "RaceParticipation_raceId_pilotId_key" ON "RaceParticipation"("raceId", "pilotId");
