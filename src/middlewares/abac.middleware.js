const AuthorizationService = require("../modules/authorization/authorization.service");

const AuditService = require("../modules/authorization/audit.service");

module.exports = (action, resourceBuilder) => async (req, res, next) => {
  // SUPER ADMIN BYPASS
  if (req.auth.roles.includes('super_admin')) {
    return next();
  }

  const resource = resourceBuilder(req);

  const decision = await AuthorizationService.authorize({
    action,
    resource,
    auth: req.auth,
  });

  console.log("decision", decision);

  if (!decision.allowed) {
    return res.status(403).json({
      success: false,
      message: decision.reason,
    });
  }

  // await AuditService.log({
  //     org_id: req.auth.org_id,
  //     user_id: req.auth.user_id,

  //     action,
  //     resource,

  //     allowed: allowed.decision,

  //     policyId: allowed.policies[0]?.id,

  //     reason: allowed.policies[0]?.reason,
  // });

  next();
};
