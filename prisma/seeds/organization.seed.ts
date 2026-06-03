import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedDefaultOrganization() {
  console.log("🌱 Seeding default AEOS organization...");

  const existing =
    await prisma.organization.findFirst({
      where: {
        slug: "aeos",
      },
    });

  if (existing) {
    return existing;
  }

  const organization =
    await prisma.organization.create({
      data: {
        name: "AEOS",

        slug: "aeos",

        display_name:
          "AEOS Platform",

        domain: "aeos.local",

        domain_verified: true,

        settings: {},

        metadata: {},
      },
    });

  console.log(
    "✅ Default organization created"
  );

  return organization;
}

