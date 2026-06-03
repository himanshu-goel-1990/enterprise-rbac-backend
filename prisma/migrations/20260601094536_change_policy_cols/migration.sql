/*
  Warnings:

  - Added the required column `actions` to the `policies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resources` to the `policies` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE "policies" ADD COLUMN     "actions" JSONB NOT NULL,
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "resources" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "service_accounts" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "user_identities" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "user_role_assignments" ALTER COLUMN "org_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;
