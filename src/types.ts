import { type ChatMessage, type GetChatOptions } from './core/types';

export type * from './core/types';

export type UseStateChatOptions<
  TContext,
  TMeta,
  TActionKey extends string,
> = Omit<GetChatOptions<TContext>, 'skipEmitFirstMessage'> & {
  initialMessages?: Array<ChatMessage<TMeta, TActionKey>>;
};
