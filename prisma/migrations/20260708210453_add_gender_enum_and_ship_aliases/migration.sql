/*
  Warnings:

  - The `gender` column on the `characters` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug,workId]` on the table `characters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- DropIndex
DROP INDEX "characters_slug_key";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN';

-- CreateTable
CREATE TABLE "ship_aliases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ship_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ship_aliases_name_shipId_key" ON "ship_aliases"("name", "shipId");

-- CreateIndex
CREATE UNIQUE INDEX "characters_slug_workId_key" ON "characters"("slug", "workId");

-- AddForeignKey
ALTER TABLE "ship_aliases" ADD CONSTRAINT "ship_aliases_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
