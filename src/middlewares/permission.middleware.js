const ApiError = require("../utils/apiError");

const { permissionService } = require("../services/permission.service");

// const { auditService } = require("../services/audit.service");

const defineAbilitiesFor = require("../config/casl");

// const permissionMiddleware = (
//   action,
//   subject
// ) => {
//   return (req, res, next) => {
//     const ability = defineAbilitiesFor(
//       req.user
//     );

//     let checkSuper = req.user.userRoleAssignments[0].role.name
//     if(checkSuper === 'Super Admin') {
//       return next();
//     }

//     const allowed = ability.can(
//       action,

//     );
//     //const allowed = true;

//     if (!allowed) {
//       return next(
//         new ApiError(
//           403,
//           "Forbidden"
//         )
//       );
//     }

//     return next();
//   };
// };

const permissionMiddleware = (
  requiredPermission
) => {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    console.log(req.auth)

    const allowed =
      permissionService.hasPermission(
        req.user.permissions || [],
        requiredPermission
      );

    if (!allowed) {

      // await auditService.log({
      //   orgId: req.user.orgId,
      //   actorUserId: req.user.userId,
      //   action: "permission_denied",
      //   metadata: {
      //     requiredPermission,
      //   },
      // });
      return res.status(403).json({
        success: false,
        message: "Access denied",
        required_permission:
          requiredPermission,
      });
    }

    next();
  };
}

module.exports =
  permissionMiddleware;