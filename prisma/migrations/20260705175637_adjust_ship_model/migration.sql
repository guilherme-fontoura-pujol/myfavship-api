/*
  Warnings:

  - You are about to drop the column `firstCharacterId` on the `ships` table. All the data in the column will be lost.
  - You are about to drop the column `secondCharacterId` on the `ships` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ships" DROP CONSTRAINT "ships_firstCharacterId_fkey";

-- DropForeignKey
ALTER TABLE "ships" DROP CONSTRAINT "ships_secondCharacterId_fkey";

-- DropIndex
DROP INDEX "ships_workId_firstCharacterId_secondCharacterId_key";

-- AlterTable
ALTER TABLE "ships" DROP COLUMN "firstCharacterId",
DROP COLUMN "secondCharacterId";

-- CreateTable
CREATE TABLE "ship_characters" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ship_characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ship_characters_shipId_characterId_key" ON "ship_characters"("shipId", "characterId");

-- AddForeignKey
ALTER TABLE "ship_characters" ADD CONSTRAINT "ship_characters_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ship_characters" ADD CONSTRAINT "ship_characters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
