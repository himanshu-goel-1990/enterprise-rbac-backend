const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class PermissionService {
  async getUserRoles({
    user_id,
    org_id,
    workspaceId,
  }) {
    return prisma.userRoleAssignment.findMany({
      where: {
        user_id,
        org_id,
        is_active: true,

        AND: [
          {
            OR: [
              {
                workspace_id: null,
              },
              {
                workspace_id:
                  workspaceId || undefined,
              },
            ],
          },

          {
            OR: [
              {
                expires_at: null,
              },
              {
                expires_at: {
                  gt: new Date(),
                },
              },
            ],
          },
        ],
      },

      include: {
        role: true,
      },
    });
  }

  async getRolePermissions(roleIds) {
    const rolePermissions =
      await prisma.rolePermission.findMany({
        where: {
          role_id: {
            in: roleIds,
          },
        },

        include: {
          permission: true,
        },
      });

    return rolePermissions.map(
      (rp) => rp.permission
    );
  }

  async resolveUserPermissions({
    user_id,
    org_id,
    workspace_id,
  }) {
    const roleAssignments =
      await this.getUserRoles({
        user_id,
        org_id,
        workspace_id,
      });

    if (!roleAssignments.length) {
      return [];
    }

    const roleIds =
      roleAssignments.map(
        (r) => r.role_id
      );

    const permissions =
      await this.getRolePermissions(
        roleIds
      );

    const uniquePermissions =
      new Set();

    for (const permission of permissions) {
      uniquePermissions.add(
        permission.key
      );
    }

    return Array.from(
      uniquePermissions
    );
  }

  hasPermission(permissions, requiredPermission) {
    //
    // super wildcard
    //
    if (permissions.includes("*")) {
      return true;
    }

    //
    // exact match
    //
    if (
      permissions.includes(
        requiredPermission
      )
    ) {
      return true;
    }

    //
    // namespace wildcard
    //
    const requiredParts =
      requiredPermission.split(".");

    for (const permission of permissions) {
      if (!permission.includes("*")) {
        continue;
      }

      const permissionParts =
        permission.split(".");

      let matched = true;

      for (
        let i = 0;
        i < permissionParts.length;
        i++
      ) {
        const current =
          permissionParts[i];

        if (current === "*") {
          break;
        }

        if (
          current !==
          requiredParts[i]
        ) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return true;
      }
    }

    return false;
  }
}

const permissionService =
  new PermissionService();

module.exports = {
  permissionService,
};
