const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const permissionMiddleware = require(
  "../middlewares/permission.middleware"
);

const {
  createRoleController,
  createPermissionController,
  assignPermissionController,
  listRoleController,
  changeStatusRoleController,
  editRoleController,
  updateRoleController,
  deleteRoleController,
  listGroupController,
  createGroupController,
  listPermissionController,
  listPermissionGroupWiseController
} = require(
  "../controllers/rbac.controller"
);

router.get(
  "/roles/list",
  authMiddleware,
  permissionMiddleware(
    "roles.read"
  ),
  listRoleController
);

router.post(
  "/roles/add",
  authMiddleware,
  permissionMiddleware(
    "roles.create",
  ),
  createRoleController
);

router.patch(
  "/roles/:id/status",
  authMiddleware,
  permissionMiddleware(
    "roles.update",
  ),
  changeStatusRoleController
);

router.get(
  "/roles/edit/:roleId",
  authMiddleware,
  permissionMiddleware(
    "roles.update",
  ),
  editRoleController
);

router.patch(
  "/roles/update/:roleId",
  authMiddleware,
  permissionMiddleware(
    "roles.update",
  ),
  updateRoleController
);

router.delete(
  "/roles/delete/:roleId",
  authMiddleware,
  permissionMiddleware(
    "roles.delete",
  ),
  deleteRoleController
);


router.get(
  "/permissions/list",
  authMiddleware,
  permissionMiddleware(
    "permissions.read"
  ),
  listPermissionController
);

router.get(
  "/permissionsGroupWise/list",
  authMiddleware,
  permissionMiddleware(
    "permissions.read",
  ),
  listPermissionGroupWiseController
);


router.post(
  "/permissions/add",
  authMiddleware,
  permissionMiddleware(
    "permissions.create"
  ),
  createPermissionController
);

router.post(
  "/assign-permission",
  authMiddleware,
  permissionMiddleware(
    "manage",
    "Role"
  ),
  assignPermissionController
);


router.get(
  "/groups/list",
  authMiddleware,
  permissionMiddleware(
    "manage",
    "User"
  ),
  listGroupController
);

router.post(
  "/groups/add",
  authMiddleware,
  permissionMiddleware(
    "manage",
    "User"
  ),
  createGroupController
);

module.exports = router;