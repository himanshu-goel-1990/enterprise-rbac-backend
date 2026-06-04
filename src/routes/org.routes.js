const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const permissionMiddleware = require(
  "../middlewares/permission.middleware"
);

const {
  buildArn,
} = require(
  "../utils/resourceArn"
);

const abacMiddleware = require(
  "../middlewares/abac.middleware"
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
  abacMiddleware(
    "organizations.read",
    (req) =>
      buildArn({
        org_id: req.auth.org_id,
        resourceType: "organizations",
        resourceId: "*",
      })
  ),
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