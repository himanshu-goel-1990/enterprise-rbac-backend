/*
  Warnings:

  - You are about to drop the column `tenantId` on the `authorization_audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `authorization_audit_logs` table. All the data in the column will be lost.
  - Added the required column `org_id` to the `authorization_audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "authorization_audit_logs_tenantId_idx";

-- DropIndex
DROP INDEX "authorization_audit_logs_userId_idx";

-- AlterTable
ALTER TABLE "api_keys" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "authorization_audit_logs" DROP COLUMN "tenantId",
DROP COLUMN "userId",
ADD COLUMN     "org_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "identity_providers" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "org_units" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "service_accounts" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "user_identities" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- CreateIndex
CREATE INDEX "authorization_audit_logs_org_id_idx" ON "authorization_audit_logs"("org_id");

-- CreateIndex
CREATE INDEX "authorization_audit_logs_user_id_idx" ON "authorization_audit_logs"("user_id");
