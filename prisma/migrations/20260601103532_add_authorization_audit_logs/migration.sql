-- AlterTable
ALTER TABLE "api_keys" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

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

-- CreateTable
CREATE TABLE "authorization_audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,
    "policyId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authorization_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "authorization_audit_logs_tenantId_idx" ON "authorization_audit_logs"("tenantId");

-- CreateIndex
CREATE INDEX "authorization_audit_logs_userId_idx" ON "authorization_audit_logs"("userId");

-- CreateIndex
CREATE INDEX "authorization_audit_logs_createdAt_idx" ON "authorization_audit_logs"("createdAt");
