import { permissionService } from "./services/permission.service.js";

async function main() {
  const permissions =
    await permissionService.resolveUserPermissions({
      userId: "USER_ID",
      orgId: "ORG_ID",
    });

  console.log("Permissions:");
  console.log(permissions);

  const canReadUsers =
    permissionService.hasPermission(
      permissions,
      "users.read"
    );

  console.log("Can Read Users:", canReadUsers);
}

main();
