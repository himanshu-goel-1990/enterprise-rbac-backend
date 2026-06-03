const {
  createRole,
  findPermission,
  createPermission,
  assignPermissionToRole,
  assignRoleToUser,
} = require("../repositories/rbac.repository");

const createRoleService = async (
  organization_id,
  payload
) => {
  return createRole({
    organization_id,
    name: payload.name,
    description: payload.description,
  });
};

const createPermissionService = async (
  payload
) => {
  const existing =
    await findPermission(
      payload.action,
      payload.subject
    );

  if (existing) {
    return existing;
  }

  return createPermission(payload);
};

const assignPermissionService =
  async (
    roleId,
    permissionId
  ) => {
    return assignPermissionToRole(
      roleId,
      permissionId
    );
  };

const assignRoleService = async (
  userId,
  roleId
) => {
  return assignRoleToUser(
    userId,
    roleId
  );
};

module.exports = {
  createRoleService,
  createPermissionService,
  assignPermissionService,
  assignRoleService,
};