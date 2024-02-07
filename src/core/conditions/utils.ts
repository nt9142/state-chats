import type { Condition } from './types';

/**
 * Evaluates a condition against the given context.
 * @param condition The condition to evaluate.
 * @param context The context to evaluate the condition against.
 * @returns `true` if the condition is met, `false` otherwise.
 */
export function evaluateCondition(condition: Condition, context: any): boolean {
  switch (condition.type) {
    case 'equals':
      return context[condition.variable] === condition.value;
    case 'contains':
      return Boolean(context[condition.variable]?.includes(condition.value));
    case 'and':
      return condition.conditions.every((cond) =>
        evaluateCondition(cond, context),
      );
    case 'or':
      return condition.conditions.some((cond) =>
        evaluateCondition(cond, context),
      );
    case 'not':
      return !evaluateCondition(condition.condition, context);
    case 'lengthAtLeast':
      return (
        Array.isArray(context[condition.variable]) &&
        context[condition.variable].length >= condition.value
      );
    case 'lengthAtMost':
      return (
        Array.isArray(context[condition.variable]) &&
        context[condition.variable].length <= condition.value
      );
    case 'lengthEquals':
      return (
        Array.isArray(context[condition.variable]) &&
        context[condition.variable].length === condition.value
      );
    default:
      throw new Error(`Unsupported condition type: ${(condition as any).type}`);
  }
}
