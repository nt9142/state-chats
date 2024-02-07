import { type ChatMessage } from '../types';

export type ActionFunction<TContext> = (
  context: TContext,
  message: ChatMessage,
) => Promise<any>;

export type ActionMap<TActionKey extends string, TContext> = {
  [key in TActionKey]: ActionFunction<TContext>;
};
