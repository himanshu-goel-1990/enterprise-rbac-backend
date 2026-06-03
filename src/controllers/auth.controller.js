const asyncHandler = require("../utils/asyncHandler");

const {
  register,
  login,
} = require("../services/auth.service");

const AuthorizationService =
  require("../modules/authorization/authorization.service");

const registerController = asyncHandler(
  async (req, res) => {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  }
);

const loginController = asyncHandler(
  async (req, res) => {
    const result = await login(req);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

const  authorizeCOntroller = asyncHandler (
  async (req, res, next) => {
    try {
      const { action, resource, context } = req.body;

      if (!action || !resource) {
        return res.status(400).json({
          success: false,
          message: "action and resource are required",
        });
      }

      const decision =
        await AuthorizationService.authorize({
          action,
          resource,
          auth: {
            ...req.auth,
            attributes: {
              ...(req.auth.attributes || {}),
              ...(context || {}),
            },
          },
        });

      return res.status(200).json({
        success: true,
        data: decision,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  registerController,
  loginController,
  authorizeCOntroller
};