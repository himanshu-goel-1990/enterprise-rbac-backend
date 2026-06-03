const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const {
  createRoleService,
  createPermissionService,
  assignPermissionService,
  assignRoleService,
} = require("../services/rbac.service");

const {
  findRole,
  findRoleWithPermissions
} = require("../repositories/rbac.repository");

const listRoleController = asyncHandler(async (req, res) => {
  const roles = await prisma.role.findMany();

  res.status(201).json({
    success: true,
    data: roles,
  });
});

const createRoleController = asyncHandler(async (req, res) => {
  const { name, description, perms } = req.body;

  const checkRoleExist = await findRole('name', name);

  if (checkRoleExist) {
    throw new ApiError(201, "Role already exists");
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const role = await prisma.role.create({
    data: {
      name,
      slug,
      description,

      // rolePermissions: {
      //   create:
      //     perms?.map((permissionId: string) => ({
      //       permissionId,
      //     })) || [],
      // },
    },

    // include: {
    //   rolePermissions: {
    //     include: {
    //       permission: true,
    //     },
    //   },
    // },
  });

  res.status(201).json({
    success: true,
    message: "Role successfully created",
  });
});

const changeStatusRoleController = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const existingRole = await findRole('id', roleId);

  const role = await prisma.role.update({
    where: {
      id: roleId,
    },

    data: {
      status: existingRole.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });

  res.status(201).json({
    success: true,
  });
});

const editRoleController = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const role = await findRoleWithPermissions('id', roleId);

  res.status(201).json({
    data: role,
    success: true,
  });
});

const updateRoleController = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { name, description, perms } = req.body;

  const role = await findRole("id", roleId);

  if (!role) {
    return res.status(404).json({
      success: false,
      message: "Role not found",
    });
  }

  // Get enabled permission names
  const permissionNames = Object.keys(perms || {}).filter(
    (key) => perms[key] === true
  );

  console.log(permissionNames);

  const cleanedPermissionNames = permissionNames.map((p) => p.trim());

  // Fetch permission records
  const permissions = await prisma.permission.findMany({
    where: {
      id: {
        in: cleanedPermissionNames
      },
    },
  });

  console.log(permissions);


  // Transaction
  await prisma.$transaction(async (tx) => {
    // Update role details
    await tx.role.update({
      where: {
        id: roleId,
      },
      data: {
        name,
        description,
      },
    });

    // Remove old permissions
    await tx.rolePermission.deleteMany({
      where: {
        role_id: roleId,
      },
    });

    // Add new permissions
    if (permissions.length > 0) {
      await tx.rolePermission.createMany({
        data: permissions.map((permission) => ({
          role_id: roleId,
          permission_id: permission.id,
        })),
      });
    }
  });


  res.status(200).json({
    success: true,
    message: "Role successfully updated",
  });
});

const deleteRoleController = asyncHandler(async (req, res) => {
  const { roleId } = req.params;

  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  // Prevent deleting protected roles
  const protectedRoles = ["OWNER", "Super Admin"];

  if (protectedRoles.includes(role.name)) {
    throw new ApiError(403, "Protected roles cannot be deleted");
  }

  await prisma.role.delete({
    where: {
      id: roleId,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Role deleted successfully",
  });
});

const createPermissionController = asyncHandler(async (req, res) => {
  const { action, group, description } = req.body;

  const grp = await prisma.permissionGroup.findUnique({
    where: {
      id: group,
    },
  });

  if (!grp) {
    throw new ApiError(401, "Group not found");
  }

  const checkPerExist = await prisma.permission.findFirst({
    where: {
      action,
      groupId: grp["id"],
    },
  });

  if (checkPerExist) {
    throw new ApiError(201, "Permission already exists");
  }

  const role = await prisma.permission.create({
    data: {
      action,
      status: "ACTIVE",
      description,
      groupId: grp["id"],
      groupName: grp["key"],
      permissionKey: `${grp["key"]}:${action}`,
    },
  });

  res.status(201).json({
    success: true,
    message: "Permission successfully created",
  });
});

const listPermissionController = asyncHandler(async (req, res) => {
  const pers = await prisma.permission.findMany();

  res.status(201).json({
    success: true,
    data: pers,
  });
});

const listPermissionGroupWiseController = asyncHandler(async (req, res) => {
  const permissions = await prisma.permission.findMany({
    select: {
      id: true,
      action: true,
      name: true,
      category: true,
    },
    // orderBy: {
    //   category: 'asc',
    // },
  });

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }

    acc[permission.category].push({
      id: permission.id,
      name: permission.name,
      action: permission.action,
    });

    return acc;
  }, {});

  const result = Object.entries(groupedPermissions).map(
    ([category, permissions]) => ({
      category,
      permissions,
    })
  );

  console.log(result);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

const assignPermissionController = asyncHandler(async (req, res) => {
  const result = await assignPermissionService(
    req.body.roleId,
    req.body.permissionId,
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

const assignRoleController = asyncHandler(async (req, res) => {
  const result = await assignRoleService(req.body.userId, req.body.roleId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const listGroupController = asyncHandler(async (req, res) => {
  const groups = await prisma.permissionGroup.findMany();

  res.status(201).json({
    success: true,
    data: groups,
  });
});

const createGroupController = asyncHandler(async (req, res) => {
  const { groupName, groupDesc } = req.body;

  const key = groupName.toLowerCase().replace(/\s+/g, "-");

  const checkGroup = await prisma.permissionGroup.findFirst({
    where: {
      key,
    },
  });

  if (checkGroup) {
    throw new ApiError(403, "Group already exist");
  }

  await prisma.permissionGroup.create({
    data: {
      name: groupName,
      key,
      description: groupDesc,
    },
  });

  res.status(201).json({
    success: true,
    data: "Group crerated successfully",
  });
});

module.exports = {
  createRoleController,
  createPermissionController,
  assignPermissionController,
  assignRoleController,
  listRoleController,
  changeStatusRoleController,
  editRoleController,
  updateRoleController,
  deleteRoleController,
  listGroupController,
  createGroupController,
  listPermissionController,
  listPermissionGroupWiseController,
};
