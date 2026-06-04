const ConditionEvaluator = require("./conditionEvaluator");
const { matchArn } = require("../../utils/arnMatcher");

class PolicyEngine {
  static evaluate({
    action,
    resource,
    context = {},
    policies = [],
  }) {
    if (!policies.length) {
      return {
        allowed: false,
        policyId: null,
        reason: "No policies available",
      };
    }

    // lowest priority value wins
    const orderedPolicies = [...policies].sort(
      (a, b) => a.priority - b.priority
    );

    let matchedAllow = null;
    

    for (const policy of orderedPolicies) {
      // skip inactive
      if (!policy.is_active) {
        continue;
      }

      // -------------------------
      // ACTION MATCH
      // -------------------------

      const actions = Array.isArray(policy.actions)
        ? policy.actions
        : [];

      const actionMatched =
        actions.includes("*") ||
        actions.includes(action);

      if (!actionMatched) {
        continue;
      }

      // -------------------------
      // RESOURCE MATCH
      // -------------------------

      const resources = Array.isArray(policy.resources)
        ? policy.resources
        : [];

      const resourceMatched =
        resources.some((pattern) =>
          matchArn(pattern, resource)
        );

      if (!resourceMatched) {
        continue;
      }

      // -------------------------
      // CONDITIONS MATCH
      // -------------------------

      const conditionMatched =
        ConditionEvaluator.evaluate(
          policy.conditions,
          context
        );

      if (!conditionMatched) {
        continue;
      }

      // -------------------------
      // DENY ALWAYS WINS
      // -------------------------

      if (policy.effect_default === "deny") {
        return {
          allowed: false,
          policyId: policy.id,
          reason: `Denied by policy: ${policy.name}`,
        };
      }

      // -------------------------
      // ALLOW
      // -------------------------

      if (policy.effect_default === "allow") {
        matchedAllow = {
          allowed: true,
          policyId: policy.id,
          reason: `Allowed by policy: ${policy.name}`,
        };
      }
    }    

    if (matchedAllow) {
      return matchedAllow;
    }

    return {
      allowed: false,
      policyId: null,
      reason: "No matching policy found",
    };
  }
}

module.exports = PolicyEngine;