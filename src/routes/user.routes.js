const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const permissionMiddleware = require(
  "../middlewares/permission.middleware"
);

const {
  listUsersController,
  createUsersController,
  editUsersController,
  updateUsersController
} = require(
  "../controllers/user.controller"
);


const {
  buildArn,
} = require(
  "../utils/resourceArn"
);

const abacMiddleware = require(
  "../middlewares/abac.middleware"
);

router.get(
  "/users/list",
  authMiddleware,
  permissionMiddleware("users.read"),

  abacMiddleware(
    "users.read",
    (req) =>
      buildArn({
        org_id: req.auth.org_id,
        resourceType: "users",
        resourceId: "*",
      })
  ),
  listUsersController
);

router.post(
  "/users/add",
  authMiddleware,
  permissionMiddleware("users.create"),

  abacMiddleware(
    "users.create",
    (req) =>
      buildArn({
        org_id: req.auth.org_id,
        resourceType: "user",
        resourceId: "*",
      })
  ),
  createUsersController
);

router.get(
  "/users/edit/:userId",
  authMiddleware,
  permissionMiddleware("users.update"),

  abacMiddleware(
    "users.update",
    (req) =>
      buildArn({
        org_id: req.auth.org_id,
        resourceType: "user",
        resourceId: "*",
      })
  ),
  editUsersController
);

router.patch(
  "/users/update/:userId",
  authMiddleware,
  permissionMiddleware("users.update"),

  abacMiddleware(
    "users.update",
    (req) =>
      buildArn({
        org_id: req.auth.org_id,
        resourceType: "user",
        resourceId: "*",
      })
  ),
  updateUsersController
);



module.exports = router;