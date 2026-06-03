const express = require("express");

const router = express.Router();

const {
  registerController,
  loginController,
} = require("../controllers/auth.controller");


const validate = require("../middlewares/validate.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

// router.post(
//   "/authorize",
//   authenticate,
//   authorizeController.authorize
// );

router.post(
  "/register",
  //validate(registerSchema),
  registerController
);

router.post(
  "/login",
  validate(loginSchema),
  loginController
);

module.exports = router;