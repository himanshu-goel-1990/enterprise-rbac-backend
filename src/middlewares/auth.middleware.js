const prisma = require("../config/prisma");

const ApiError = require("../utils/apiError");

const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);


    if (!decoded) {
      throw new ApiError(401, "Token is expired or invalid");
    }

    const session =
      await prisma.session.findUnique({
        where: {
          id: decoded.session_id,
        },
      });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session not found",
      });
    }

    if (
      session.expires_at <
      new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    if (!decoded?.user_id) {
      return next(new ApiError(401, "Invalid token"));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.user_id,
      },
      include: {
        userRoleAssignments: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // const hasActiveRole = user.userRoles.some(
    //   (userRole) => userRole.role?.status === "ACTIVE",
    // );

    // if (!hasActiveRole) {
    //   throw new ApiError(403, "All assigned roles are inactive");
    // }

    req.auth = req.user = {
      user_id: decoded.user_id,
      org_id: decoded.organization_id,
      session_id: decoded.session_id,
      permissions: decoded.permissions || [],
      roles: decoded.roles || [],
      roleIds: decoded.roleIds || [],
      scope: decoded.scope || null,
      policies: decoded.policies || null,
    };

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        last_used_at: new Date(),
      },
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;

