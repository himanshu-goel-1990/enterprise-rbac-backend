class ConditionEvaluator {
  static evaluate(conditions, context) {
    if (!conditions) return true;

    for (const key of Object.keys(conditions)) {
      if (context[key] !== conditions[key]) {
        return false;
      }
    }

    return true;
  }
}

module.exports = ConditionEvaluator;