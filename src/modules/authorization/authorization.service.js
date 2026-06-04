const prisma = require("../../config/prisma");
const PolicyEngine = require("./policyEngine");

class AuthorizationService {
  static async authorize({
    action,
    resource,
    auth,
    context = {},
  }) {
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

    const userAssignments =
      await prisma.policyAssignment.findMany({
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

    // ------------------------------------
    // Load Role Assigned Policies
    // ------------------------------------

    const roleAssignments =
      await prisma.policyAssignment.findMany({
        where: {
          org_id: org_id,

          role_id: {
            in: roleIds.length
              ? roleIds
              : ["__none__"],
          },

          policy: {
            is_active: true,
          },
        },

        include: {
          policy: true,
        },
      });

    // ------------------------------------
    // Merge & Deduplicate Policies
    // ------------------------------------

    const policyMap = new Map();

    [...userAssignments, ...roleAssignments]
      .forEach((assignment) => {
        if (assignment.policy) {
          policyMap.set(
            assignment.policy.id,
            assignment.policy
          );
        }
      });

    const policies =
      [...policyMap.values()];

      console.log(policies);
      
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

    const decision =
      PolicyEngine.evaluate({
        action,
        resource,
        context: evaluationContext,
        policies,
      });

    return decision;
  }
}

module.exports =
  AuthorizationService;