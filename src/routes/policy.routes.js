const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const permissionMiddleware = require(
  "../middlewares/permission.middleware"
);

const {
  createPolicyController,
  listPolicyController,
  changeStatusPolicyController,
  editPolicyController,
  updatePolicyController,
  deletePolicyController,

} = require(
  "../controllers/policy.controller"
);

const validateUUID = (req, res, next) => {
  const { policyId } = req.params;

  if (!validator.isUUID(policyId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid policy id"
    });
  }

  next();
};

router.get(
  "/policies/list",
  authMiddleware,
  permissionMiddleware(
    "policies.read"
  ),
  listPolicyController
);

router.post(
  "/policies/add",
  authMiddleware,
  permissionMiddleware(
    "policies.create",
  ),
  createPolicyController
);

// router.patch(
//   "/policies/:policyId/status",
//   validateUUID,
//   authMiddleware,
//   permissionMiddleware(
//     "policies.edit",
//   ),
//   changeStatusPolicyController
// );

router.get(
  "/policies/edit/:policyId",
  validateUUID,
  authMiddleware,
  permissionMiddleware(
    "policies.edit",
  ),
  editPolicyController
);

router.patch(
  "/policies/update/:policyId",
  validateUUID,
  authMiddleware,
  permissionMiddleware(
    "policies.edit",
  ),
  updatePolicyController
);

router.delete(
  "/policies/delete/:policyId",
  validateUUID,
  authMiddleware,
  permissionMiddleware(
    "policies.delete",
  ),
  deletePolicyController
);


module.exports = router;