import { PrismaClient } from "@prisma/client";

import { seedPermissions } from "./permissions.seed";
import { seedRoles } from "./roles.seed";
import { seedRolePermissions } from "./role-permissions.seed";
import { seedDefaultOrganization } from "./organization.seed";
import { seedSuperAdmin } from "./super-admin.seed";
import { seedPolicy } from "./policy.seed";

const prisma = new PrismaClient();

async function main() {
  await seedPermissions();

  await seedRoles();

  await seedRolePermissions();

  await seedDefaultOrganization();

  await seedSuperAdmin();
  
  await seedPolicy();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

   // process.exit(1);
  });
