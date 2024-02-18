import { type ActionMap } from './actions/types';
import { type ActionObject, type ChatMessage } from './types';

export function processContent(
  content: string,
  context: Record<string, any>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '');
}

export function getHasAction<TActionKey extends string, TContext>(
  actionKey?: string,
  actions?: ActionMap<TActionKey, TContext>,
): actionKey is TActionKey {
  return Boolean(actionKey && actions?.[actionKey as TActionKey]);
}

export async function executeAction<TActionKey extends string, TContext>(
  actionObject: ActionObject<TActionKey>,
  actions: ActionMap<TActionKey, TContext>,
  context: TContext,
  message: ChatMessage,
) {
  const action = actions[actionObject.actionKey];
  if (!action) {
    throw new Error(`Action "${actionObject.actionKey}" not found`);
  }
  return await action(context, message);
}
