/*
  Warnings:

  - You are about to drop the column `image` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `ships` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `works` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `characters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `works` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `works` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "characters" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPlayable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ships" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "works" DROP COLUMN "coverImage",
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "characters_slug_key" ON "characters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");
