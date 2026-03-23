/*
  Warnings:

  - Changed the type of `provider` on the `SocialAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LINKEDIN', 'TWITTER', 'FACEBOOK');

-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_userId_provider_key" ON "SocialAccount"("userId", "provider");
