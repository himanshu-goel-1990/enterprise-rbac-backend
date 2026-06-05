const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const {
  findPermission,
  createPermission,
  assignPermissionToRole,
  assignRoleToUser,
} = require("../repositories/rbac.repository");

const createPolicyService = async (
  organization_id,
  payload
) => {
  return createPolicy({
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

const assignPolicyListService = async () => {
    return prisma.policyAssignment.findMany({
      include: {
        policy: true,
        user: true,
        role: true,
        organization: true
      },
    });
}

const assignToRoleService = async (
    org_id,
    role_id,
    policy_id
) => {
    return prisma.policyAssignment.create({
        data: {
            org_id,
            role_id,
            policy_id
        }
    });
};

const assignToUserService = async (
    org_id,
    role_id,
    policy_id
) => {
    return prisma.policyAssignment.create({
        data: {
            org_id,
            role_id,
            policy_id
        }
    });
};

const deleteToRoleService = async (id) => {
  const result = await prisma.policyAssignment.findFirst({
    where: {
      id
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Policy Assignment not found",
    });
  }

  return prisma.policyAssignment.delete({
      where: {
          id
      }
  });
};

const deleteToUserService = async (id) => {
  const result = await prisma.policyAssignment.findFirst({
    where: {
      id
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Policy Assignment not found",
    });
  }

  return prisma.policyAssignment.delete({
      where: {
          id
      }
  });
};

module.exports = {
  createPermissionService,
  assignPermissionService,
  assignRoleService,
  assignPolicyListService,
  assignToRoleService,
  assignToUserService,
  deleteToRoleService,
  deleteToUserService
};