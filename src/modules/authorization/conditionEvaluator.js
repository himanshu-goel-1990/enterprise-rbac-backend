class ConditionEvaluator {
  static evaluate(
    conditions,
    context
  ) {
    if (
      !conditions ||
      Object.keys(conditions).length === 0
    ) {
      return true;
    }

    for (const [key, value] of Object.entries(
      conditions
    )) {
      if (context[key] !== value) {
        return false;
      }
    }

    return true;
  }
}

module.exports = ConditionEvaluator;