const AuthorizationService =
    require("../modules/authorization/authorization.service");

const AuditService =
    require("../modules/authorization/audit.service");

module.exports =
    (action, resourceBuilder) =>
        async (req, res, next) => {
            const resource =
                resourceBuilder(req);

            const allowed =
                await AuthorizationService.authorize({
                    action,
                    resource,
                    auth: req.auth,
                });

            // await AuditService.log({
            //     org_id: req.auth.org_id,
            //     user_id: req.auth.user_id,

            //     action,
            //     resource,

            //     allowed: allowed.decision,

            //     policyId: allowed.policies[0]?.id,

            //     reason: allowed.policies[0]?.reason,
            // });

            if (!allowed.decision) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            next();
        };