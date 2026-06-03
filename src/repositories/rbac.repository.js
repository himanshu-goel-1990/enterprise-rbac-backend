const prisma = require("../config/prisma");

const createRole = async (data) => {
  return prisma.role.create({
    data,
  });
};

const findRole = async (
  type,
  value
) => {
  if(type == 'id') {
    return prisma.role.findUnique({
      where: {
        id: value,
      },
    });
  } else {
    return prisma.permission.findUnique({
      where: {
        name: value
      },
    });
  }
};

const findRoleWithPermissions = async (
  type,
  value
) => {
  if(type == 'id') {
    return prisma.role.findUnique({
      where: {
        id: value,
      },
      include: {
        rolePermissions: true,
      },
    });
  }

};

const findPermission = async (
  action,
  subject
) => {
  return prisma.permission.findUnique({
    where: {
      action_subject: {
        action,
        subject,
      },
    },
  });
};

const createPermission = async (data) => {
  return prisma.permission.create({
    data,
  });
};

const assignPermissionToRole = async (
  roleId,
  permissionId
) => {
  return prisma.rolePermission.create({
    data: {
      roleId,
      permissionId,
    },
  });
};

const assignRoleToUser = async (
  userId,
  roleId
) => {
  return prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
};

module.exports = {
  createRole,
  findRole,
  findRoleWithPermissions,
  findPermission,
  createPermission,
  assignPermissionToRole,
  assignRoleToUser,
};