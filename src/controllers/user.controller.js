const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const {
  createOrganization,
  findOrganizationBySlug,
  findUserByEmail,
  createUser,
  createRefreshToken,
} = require("../repositories/auth.repository");

const { hashPassword, comparePassword } = require("../utils/password");
const { applyUserTenantScope } = require("../middlewares/tenantScope");

const listUsersController = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: applyUserTenantScope({}, req),
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: users,
  });
});

const createUsersController = asyncHandler(async (req, res) => {
  const payload = req.body;
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await createUser({
    organization: {
      connect: {
        id: payload.org_id,
      },
    },
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    title: payload.jobTitle,
    password_hash: hashedPassword,
    is_active: true,
    is_email_verified: true,
    metadata: payload.metadata || {},
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

const editUsersController = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const payload = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      org_id: true,
      first_name: true,
      last_name: true,
      email: true,
      userRoleAssignments: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

const updateUsersController = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const payload = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      title: payload.jobTitle,
      metadata: payload.metadata || {},
    },
  });

  if (payload.roleIds && Array.isArray(payload.roleIds)) {
    // Handle role updates
    await prisma.userRoleAssignment.deleteMany({
      where: {
        user_id: userId,
        org_id: updatedUser.org_id,
      },
    });
    const roleAssignments = payload.roleIds.map((roleId) => ({
      user_id: userId,
      role_id: roleId,
      org_id: updatedUser.org_id,
    }));
    await prisma.userRoleAssignment.createMany({
      data: roleAssignments,
    });
  }

  res.status(201).json({
    success: true,
    message: "User updated successfully",
  });
});

module.exports = {
  listUsersController,
  createUsersController,
  editUsersController,
  updateUsersController,
};
