const prisma = require("../../config/prisma");
const PolicyEngine = require("./policyEngine");
const CacheService = require("../../shared/cache/cache.service");

class AuthorizationService {
  static async authorize({ action, resource, auth, context = {} }) {
    const {
      user_id,
      org_id,
      roles = [],
      roleIds = [],
      permisisons = {},
      attributes = {},
    } = auth;

    // ------------------------------------
    // Get Role IDs
    // ------------------------------------

    // ------------------------------------
    // Load User Assigned Policies
    // ------------------------------------

    const cacheKey = `auth:user-policies:${org_id}:${user_id}`;

    let userPolicies = await CacheService.get(cacheKey);

    if (!userPolicies) {
      const userAssignments = await prisma.policyAssignment.findMany({
        where: {
          org_id: org_id,
          user_id,

          policy: {
            is_active: true,
          },
        },

        include: {
          policy: true,
        },
      });

      userPolicies = userAssignments.map((x) => x.policy);

      await CacheService.set(cacheKey, userPolicies);
    }

    // ------------------------------------
    // Load Role Assigned Policies
    // ------------------------------------

    const rolePolicies = [];

    for (const roleId of roleIds) {
      const cacheKey = `auth:role-policies:${org_id}:${roleId}`;

      let policies = await CacheService.get(cacheKey);

      if (!policies) {
        const roleAssignments = await prisma.policyAssignment.findMany({
          where: {
            org_id: org_id,

            role_id: {
              in: roleIds.length ? roleIds : ["__none__"],
            },

            policy: {
              is_active: true,
            },
          },

          include: {
            policy: true,
          },
        });

        policies = roleAssignments.map((x) => x.policy);

        await CacheService.set(cacheKey, policies);
      }

      rolePolicies.push(...policies);
    }

    // ------------------------------------
    // Merge & Deduplicate Policies
    // ------------------------------------

    // const policyMap = new Map();

    // [...userAssignments, ...roleAssignments].forEach((assignment) => {
    //   if (assignment.policy) {
    //     policyMap.set(assignment.policy.id, assignment.policy);
    //   }
    // });

    // const policies = [...policyMap.values()];

    // console.log(policies);

    const policies = [...userPolicies, ...rolePolicies];

    // ------------------------------------
    // Build Evaluation Context
    // ------------------------------------

    const evaluationContext = {
      user_id,
      org_id,

      ...attributes,

      ...context,
    };

    // ------------------------------------
    // Evaluate
    // ------------------------------------

    const decision = PolicyEngine.evaluate({
      action,
      resource,
      context: evaluationContext,
      policies,
    });

    return decision;
  }
}

module.exports = AuthorizationService;
