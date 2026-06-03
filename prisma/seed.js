const prisma = require("../src/config/prisma");

async function main() {
  const permissions = [
    {
      action: "MANAGE",
      subject: "Role",
    },
    {
      action: "MANAGE",
      subject: "Permission",
    },
    {
      action: "MANAGE",
      subject: "User",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        action_subject: {
          action: permission.action,
          subject: permission.subject,
        },
      },
      update: {},
      create: permission,
    });
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });