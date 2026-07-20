-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('PC', 'PlayStation', 'Xbox');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('North_America', 'Europe', 'South_America', 'Asia', 'Oceania');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('Ranked', 'Standard', 'Quick_Match');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('English', 'Spanish', 'French', 'German', 'Portuguese');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "region" "Region" NOT NULL,
    "rank" "Rank" NOT NULL,
    "mode" "GameMode" NOT NULL,
    "language" "Language" NOT NULL,
    "micRequired" BOOLEAN NOT NULL,
    "playersNeeded" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SquadPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SquadPost" ADD CONSTRAINT "SquadPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
