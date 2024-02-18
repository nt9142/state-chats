import type { Condition } from './conditions/types';

export type * from './conditions/types';

export type * from './actions/types';

/**
 * Represents a chat script.
 */
export type ChatScript<TMeta = any, TActionKey extends string = string> = Array<
  ChatMessageCreate<TMeta, TActionKey>
>;

/**
 * Represents the base structure of a chat message.
 */
type BaseChatMessage<TMeta, TActionKey extends string> = {
  /**
   * The unique identifier of the message.
   */
  id: string;

  /**
   * The text content of the message.
   */
  content: string;

  /**
   * Optional condition to determine if this message should be shown.
   */
  condition?: Condition;

  /**
   * Optional meta data.
   * This is useful for storing additional information about the message.
   * For example, you can store options for a multiple choice question.
   */
  meta?: TMeta;
} & ChatMessageActions<TActionKey>;

export type ActionObject<TActionKey extends string> = {
  actionKey: TActionKey;
  contextKey: string;
};

/**
 * Represents the actions of a chat message.
 */
export type ChatMessageActions<TActionKey extends string> = {
  /**
   * The action to execute before the message is shown.
   */
  prefetch?: ActionObject<TActionKey>;

  /**
   * The action to execute after the message is shown.
   */
  postfetch?: ActionObject<TActionKey>;
};

/**
 * Represents the supported chat message actions.
 */
export type SupportedChatMessageActions = 'prefetch' | 'postfetch';

/**
 * Represents a chat message with a delay.
 */
export type ChatMessageWithDelay<
  TMeta = any,
  TActionKey extends string = string,
> = BaseChatMessage<TMeta, TActionKey> & {
  delay: number;
};

/**
 * Represents a chat message with a variable.
 */
export type ChatMessageWithVariable<
  TMeta = any,
  TActionKey extends string = string,
> = BaseChatMessage<TMeta, TActionKey> & {
  variable: string;
};

/**
 * Represents a chat message.
 */
export type ChatMessage<TMeta = any, TActionKey extends string = string> =
  | ChatMessageWithDelay<TMeta, TActionKey>
  | ChatMessageWithVariable<TMeta, TActionKey>;

/**
 * Represents a chat message with a delay that can be created.
 */
export type ChatMessageWithDelayCreate<
  TMeta = any,
  TActionKey extends string = string,
> = Omit<ChatMessageWithDelay<TMeta, TActionKey>, 'id'>;

/**
 * Represents a chat message with a variable that can be created.
 */
export type ChatMessageWithVariableCreate<
  TMeta = any,
  TActionKey extends string = string,
> = Omit<ChatMessageWithVariable<TMeta, TActionKey>, 'id'>;

/**
 * Represents a chat message that can be created.
 */
export type ChatMessageCreate<
  TMeta = any,
  TActionKey extends string = string,
> =
  | ChatMessageWithDelayCreate<TMeta, TActionKey>
  | ChatMessageWithVariableCreate<TMeta, TActionKey>;

export type ChatEvent =
  | 'message'
  | 'prompt'
  | 'send'
  | 'start'
  | 'stop'
  | 'error'
  | 'finish';

export type MessageHandler<TContext> = (
  messageObject: ChatMessage,
  context: TContext,
) => void;
export type PromptHandler = (messageObject: ChatMessage) => void;
export type FinishHandler = (context: Record<string, any>) => void;
export type SimpleHandler = () => void;
export type ErrorHandler = (error: Error) => void;

export type ChatEventHandlerMap<TContext> = {
  message: MessageHandler<TContext>;
  prompt: PromptHandler;
  finish: FinishHandler;
  error: ErrorHandler;
  start: SimpleHandler;
  stop: SimpleHandler;
  send: SimpleHandler;
};

/**
 * Represents getChat options.
 */
export type GetChatOptions<TContext> = {
  initialContext?: TContext;
};
