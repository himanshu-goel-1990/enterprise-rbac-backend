import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLE_PERMISSION_MAP = {
  super_admin: ["*"],

  workspace_admin: [
    "users.read",
    "users.create",
    "users.update",
    "roles.read",
    "workspaces.read",
    "workspaces.update",
  ],

  compliance_officer: [
    "audit.read",
    "policies.read",
    "users.read",
  ],

  viewer: [
    "users.read",
    "roles.read",
    "workspaces.read",
  ],
};

export async function seedRolePermissions() {
  console.log("🌱 Seeding role permissions...");

  for (const [roleSlug, permissionKeys] of Object.entries(
    ROLE_PERMISSION_MAP
  )) {
    const role = await prisma.role.findFirst({
      where: {
        slug: roleSlug,
      },
    });

    if (!role) continue;

    let permissions = [];

    if (permissionKeys.includes("*")) {
      permissions = await prisma.permission.findMany();
    } else {
      permissions = await prisma.permission.findMany({
        where: {
          key: {
            in: permissionKeys,
          },
        },
      });
    }

    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: role.id,
          permission_id: permission.id,
        },
      });
    }
  }

  console.log("✅ Role permissions seeded");
}
