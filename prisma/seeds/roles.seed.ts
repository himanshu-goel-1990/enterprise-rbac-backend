import { PrismaClient, RoleScope } from "@prisma/client";

const prisma = new PrismaClient();

export const SYSTEM_ROLES = [
  { 
    name: "Super Admin", 
    slug: "super_admin", 
    description: "Platform super administrator",
    is_system: true, 
    is_default: false, 
    scope: RoleScope.global
  },
  {
    name: "Tenant Admin",
    slug: "tenant_admin",
    description: "Full tenant administration access",
    is_system: true,
    is_default: false,
    scope: RoleScope.organization,
  },
  {
    name: "Workspace Admin",
    slug: "workspace_admin",
    description: "Workspace administration access",
    is_system: true,
    is_default: false,
    scope: RoleScope.workspace,
  },
  {
    name: "Compliance Officer",
    slug: "compliance_officer",
    description: "Compliance and audit access",
    is_system: true,
    is_default: false,
    scope: RoleScope.organization,
  },
  {
    name: "Viewer",
    slug: "viewer",
    description: "Read only access",
    is_system: true,
    is_default: true,
    scope: RoleScope.organization,
  },
];

export async function seedRoles() {
  console.log("🌱 Seeding roles...");

  for (const role of SYSTEM_ROLES) {
    const existingRole = await prisma.role.findFirst({
      where: {
        org_id: null,
        slug: role.slug,
      },
    });

    if (existingRole) {
      await prisma.role.update({
        where: {
          id: existingRole.id,
        },
        data: {
          ...role,
        },
      });
    } else {
      await prisma.role.create({
        data: {
          ...role,
        },
      });
    }
  }

  console.log("✅ Roles seeded");
}
