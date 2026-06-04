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
CREATE TABLE "policy_assignments" (
    "id" TEXT NOT NULL,
    "policy_id" UUID NOT NULL,
    "role_id" UUID,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "policy_assignments_policy_id_idx" ON "policy_assignments"("policy_id");

-- CreateIndex
CREATE INDEX "policy_assignments_role_id_idx" ON "policy_assignments"("role_id");

-- CreateIndex
CREATE INDEX "policy_assignments_user_id_idx" ON "policy_assignments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_assignments_policy_id_role_id_key" ON "policy_assignments"("policy_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_assignments_policy_id_user_id_key" ON "policy_assignments"("policy_id", "user_id");

-- AddForeignKey
ALTER TABLE "policy_assignments" ADD CONSTRAINT "policy_assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_assignments" ADD CONSTRAINT "policy_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_assignments" ADD CONSTRAINT "policy_assignments_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
