import { type ActionMap } from './actions/types';

export function processContent(
  content: string,
  answers: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => answers[key] || '');
}

export function getHasAction<TAction extends string, TAnswers>(
  action?: string,
  actions?: ActionMap<TAction, TAnswers>,
): action is TAction {
  return Boolean(action && actions?.[action as TAction]);
}
