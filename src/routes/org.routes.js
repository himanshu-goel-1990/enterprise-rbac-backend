const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const permissionMiddleware = require(
  "../middlewares/permission.middleware"
);

const {
  listOrganization,
  createNewOrganization,
  editOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/org.controller");

router.get(
  "/organizations/list",
  authMiddleware,
  permissionMiddleware("organizations.read"),
  listOrganization
);

router.post(
  "/organizations/add",
  authMiddleware,
  permissionMiddleware("organizations.create"),
  createNewOrganization
);

router.get(
  "/organizations/edit/:orgId",
  authMiddleware,
  permissionMiddleware("organizations.update"),
  editOrganization
);

router.patch(
  "/organizations/update/:orgId",
  authMiddleware,
  permissionMiddleware("organizations.update"),
  updateOrganization
);

router.delete(
  "/organizations/delete/:orgId",
  authMiddleware,
  permissionMiddleware("organizations.delete"),
  deleteOrganization
);


module.exports = router;