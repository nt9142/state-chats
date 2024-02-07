import type { Condition } from './types';

/**
 * Evaluates a condition against the given answers.
 * @param condition The condition to evaluate.
 * @param answers The answers to evaluate against.
 * @returns `true` if the condition is met, `false` otherwise.
 */
export function evaluateCondition(condition: Condition, answers: any): boolean {
  switch (condition.type) {
    case 'equals':
      return answers[condition.variable] === condition.value;
    case 'contains':
      return Boolean(answers[condition.variable]?.includes(condition.value));
    case 'and':
      return condition.conditions.every((cond) =>
        evaluateCondition(cond, answers),
      );
    case 'or':
      return condition.conditions.some((cond) =>
        evaluateCondition(cond, answers),
      );
    case 'not':
      return !evaluateCondition(condition.condition, answers);
    case 'lengthAtLeast':
      return (
        Array.isArray(answers[condition.variable]) &&
        answers[condition.variable].length >= condition.value
      );
    case 'lengthAtMost':
      return (
        Array.isArray(answers[condition.variable]) &&
        answers[condition.variable].length <= condition.value
      );
    case 'lengthEquals':
      return (
        Array.isArray(answers[condition.variable]) &&
        answers[condition.variable].length === condition.value
      );
    default:
      throw new Error(`Unsupported condition type: ${(condition as any).type}`);
  }
}
