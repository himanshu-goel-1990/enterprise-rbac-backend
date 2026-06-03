const { matchArn } = require("../../utils/arnMatcher");
const ConditionEvaluator = require("./conditionEvaluator");

class PolicyEngine {
  static evaluate({
    action,
    resource,
    context,
    policies,
  }) {
    let decision = false;

    const sortedPolicies = policies.sort(
      (a, b) => a.priority - b.priority
    );

    for (const policy of sortedPolicies) {
      const actionMatch =
        policy.actions.includes(action) ||
        policy.actions.includes("*");

      if (!actionMatch) continue;

      const resourceMatch =
        policy.resources.some((r) =>
          matchArn(r, resource)
        );

      if (!resourceMatch) continue;

      const conditionMatch =
        ConditionEvaluator.evaluate(
          policy.conditions,
          context
        );

      if (!conditionMatch) continue;

      if (policy.effect_default === "deny") {
        return false;
      }

      decision = true;
    }

    return {decision};
  }
}

module.exports = PolicyEngine;