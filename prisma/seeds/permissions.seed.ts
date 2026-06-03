import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SYSTEM_PERMISSIONS = [
  //
  // USERS
  //
  {
    key: "users.read",
    name: "Read Users",
    resource: "users",
    action: "read",
    category: "users",
    description: "View users",
  },
  {
    key: "users.create",
    name: "Create Users",
    resource: "users",
    action: "create",
    category: "users",
    description: "Create users",
  },
  {
    key: "users.update",
    name: "Update Users",
    resource: "users",
    action: "update",
    category: "users",
    description: "Update users",
  },
  {
    key: "users.delete",
    name: "Delete Users",
    resource: "users",
    action: "delete",
    category: "users",
    description: "Delete users",
  },

   //
  // ORGANIZATIONS
  //
  {
    key: "organizations.read",
    name: "Read Organizations",
    resource: "organizations",
    action: "read",
    category: "organizations",
    description: "View organizations",
  },
  {
    key: "organizations.create",
    name: "Create Organizations",
    resource: "organizations",
    action: "create",
    category: "organizations",
    description: "Create organizations",
  },
  {
    key: "organizations.update",
    name: "Update Organizations",
    resource: "organizations",
    action: "update",
    category: "organizations",
    description: "Update organizations",
  },
  {
    key: "organizations.delete",
    name: "Delete Organizations",
    resource: "organizations",
    action: "delete",
    category: "organizations",
    description: "Delete organizations",
  },

  //
  // ROLES
  //
  {
    key: "roles.read",
    name: "Read Roles",
    resource: "roles",
    action: "read",
    category: "roles",
    description: "View roles",
  },
  {
    key: "roles.create",
    name: "Create Roles",
    resource: "roles",
    action: "create",
    category: "roles",
    description: "Create roles",
  },
  {
    key: "roles.update",
    name: "Update Roles",
    resource: "roles",
    action: "update",
    category: "roles",
    description: "Update roles",
  },
  {
    key: "roles.delete",
    name: "Delete Roles",
    resource: "roles",
    action: "delete",
    category: "roles",
    description: "Delete roles",
  },

  //
  // PERMISSIONS
  //
  {
    key: "permissions.read",
    name: "Read Permissions",
    resource: "permissions",
    action: "read",
    category: "permissions",
    description: "View permissions",
  },
  {
    key: "permissions.create",
    name: "Create Permissions",
    resource: "permissions",
    action: "create",
    category: "permissions",
    description: "Create permissions",
  },
  {
    key: "permissions.update",
    name: "Update Permissions",
    resource: "permissions",
    action: "update",
    category: "permissions",
    description: "Update permissions",
  },
  {
    key: "permissions.delete",
    name: "Delete Permissions",
    resource: "permissions",
    action: "delete",
    category: "permissions",
    description: "Delete permissions",
  },

  //
  // POLICIES
  //
  {
    key: "policies.read",
    name: "Read Policies",
    resource: "policies",
    action: "read",
    category: "policies",
    description: "View policies",
  },
  {
    key: "policies.create",
    name: "Create Policies",
    resource: "policies",
    action: "create",
    category: "policies",
    description: "Create policies",
  },
  {
    key: "policies.update",
    name: "Update Policies",
    resource: "policies",
    action: "update",
    category: "policies",
    description: "Update policies",
  },
  {
    key: "policies.delete",
    name: "Delete Policies",
    resource: "policies",
    action: "delete",
    category: "policies",
    description: "Delete policies",
  },

  //
  // WORKSPACES
  //
  {
    key: "workspaces.read",
    name: "Read Workspaces",
    resource: "workspaces",
    action: "read",
    category: "workspaces",
    description: "View workspaces",
  },
  {
    key: "workspaces.create",
    name: "Create Workspaces",
    resource: "workspaces",
    action: "create",
    category: "workspaces",
    description: "Create workspaces",
  },
  {
    key: "workspaces.update",
    name: "Update Workspaces",
    resource: "workspaces",
    action: "update",
    category: "workspaces",
    description: "Update workspaces",
  },
  {
    key: "workspaces.delete",
    name: "Delete Workspaces",
    resource: "workspaces",
    action: "delete",
    category: "workspaces",
    description: "Delete workspaces",
  },

  //
  // AUDIT
  //
  {
    key: "audit.read",
    name: "Read Audit Logs",
    resource: "audit",
    action: "read",
    category: "audit",
    description: "View audit logs",
  },

  //
  // SERVICE ACCOUNTS
  //
  {
    key: "service_accounts.read",
    name: "Read Service Accounts",
    resource: "service_accounts",
    action: "read",
    category: "service_accounts",
    description: "View service accounts",
  },
  {
    key: "service_accounts.create",
    name: "Create Service Accounts",
    resource: "service_accounts",
    action: "create",
    category: "service_accounts",
    description: "Create service accounts",
  },
  {
    key: "service_accounts.update",
    name: "Update Service Accounts",
    resource: "service_accounts",
    action: "update",
    category: "service_accounts",
    description: "Update service accounts",
  },
  {
    key: "service_accounts.delete",
    name: "Delete Service Accounts",
    resource: "service_accounts",
    action: "delete",
    category: "service_accounts",
    description: "Delete service accounts",
  },
];

export async function seedPermissions() {
  console.log("🌱 Seeding permissions...");

  for (const permission of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: {
        key: permission.key,
      },
      update: {
        ...permission,
      },
      create: {
        ...permission,
      },
    });
  }

  console.log("✅ Permissions seeded");
}
