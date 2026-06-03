const prisma = require("../../config/prisma");
const PolicyEngine = require("./policyEngine");

class AuthorizationService {
    static async authorize({
        action,
        resource,
        auth,
    }) {

        const policies =
            await prisma.policy.findMany({
                where: {
                    OR: [
                        {
                            org_id: auth.org_id,
                        },
                        {
                            org_id: null,
                        },
                    ],
                    is_active: true,
                },
            });


        return PolicyEngine.evaluate({
            action,
            resource,
            policies,
            context: auth.attributes,
        });
    }
}

module.exports = AuthorizationService;