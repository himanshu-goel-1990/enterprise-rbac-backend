import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedSuperAdmin() {
  console.log("🌱 Seeding super admin...");

  const organization =
    await prisma.organization.findFirst({
      where: {
        slug: "aeos",
      },
    });

  if (!organization) {
    throw new Error(
      "AEOS organization not found"
    );
  }

  const email =
    process.env.SUPER_ADMIN_EMAIL ||
    "admin@aeos.local";

  const password =
    process.env.SUPER_ADMIN_PASSWORD ||
    "Admin@123";

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    const passwordHash =
      await bcrypt.hash(password, 12);

    user = await prisma.user.create({
      data: {
        org_id: organization.id,

        email,

        password_hash: passwordHash,

        first_name: "Super",

        last_name: "Admin",

        is_active: true,

        is_email_verified: true,
      },
    });
  }

  const role =
    await prisma.role.findFirst({
      where: {
        slug: "super_admin",
      },
    });

  if (!role) {
    throw new Error(
      "super_admin role not found"
    );
  }

  const existingAssignment =
    await prisma.userRoleAssignment.findFirst({
      where: {
        user_id: user.id,

        role_id: role.id,

        org_id: organization.id,
      },
    });

  if (!existingAssignment) {
    await prisma.userRoleAssignment.create({
      data: {
        org_id: organization.id,

        user_id: user.id,

        role_id: role.id,
      },
    });
  }

  console.log(
    "✅ Super admin seeded"
  );

  console.log({
    email,
    password,
  });
}
