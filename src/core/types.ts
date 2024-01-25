import type { Condition } from './conditions/types';

export type * from './conditions/types';

export type * from './actions/types';

/**
 * Represents a chat script.
 */
export type ChatScript<TMeta = any, TAction extends string = string> = Array<
  ChatMessageCreate<TMeta, TAction>
>;

/**
 * Represents the base structure of a chat message.
 */
type BaseChatMessage<TMeta, TAction extends string> = {
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
} & ChatMessageActions<TAction>;

/**
 * Represents the actions of a chat message.
 */
export type ChatMessageActions<TAction extends string> = {
  /**
   * The action to execute before the message is shown.
   */
  prefetch?: TAction;
};

export type ChatMessageActionResults<TAction extends string> = Partial<
  Record<keyof ChatMessageActions<TAction>, any>
>;

export type ChatMessageActionResultMap<TAction extends string> = Record<
  string,
  ChatMessageActionResults<TAction>
>;

/**
 * Represents a chat message with a delay.
 */
export type ChatMessageWithDelay<
  TMeta = any,
  TAction extends string = string,
> = BaseChatMessage<TMeta, TAction> & {
  delay: number;
};

/**
 * Represents a chat message with a variable.
 */
export type ChatMessageWithVariable<
  TMeta = any,
  TAction extends string = string,
> = BaseChatMessage<TMeta, TAction> & {
  variable: string;
};

/**
 * Represents a chat message.
 */
export type ChatMessage<TMeta = any, TAction extends string = string> =
  | ChatMessageWithDelay<TMeta, TAction>
  | ChatMessageWithVariable<TMeta, TAction>;

/**
 * Represents a chat message with a delay that can be created.
 */
export type ChatMessageWithDelayCreate<
  TMeta = any,
  TAction extends string = string,
> = Omit<ChatMessageWithDelay<TMeta, TAction>, 'id'>;

/**
 * Represents a chat message with a variable that can be created.
 */
export type ChatMessageWithVariableCreate<
  TMeta = any,
  TAction extends string = string,
> = Omit<ChatMessageWithVariable<TMeta, TAction>, 'id'>;

/**
 * Represents a chat message that can be created.
 */
export type ChatMessageCreate<TMeta = any, TAction extends string = string> =
  | ChatMessageWithDelayCreate<TMeta, TAction>
  | ChatMessageWithVariableCreate<TMeta, TAction>;

export type ChatEvent =
  | 'message'
  | 'prompt'
  | 'send'
  | 'start'
  | 'stop'
  | 'error'
  | 'finish';

export type MessageHandler<TAnswers, TAction extends string> = (
  messageObject: ChatMessage,
  answers: TAnswers,
  actionResults: Record<TAction, any>,
) => void;
export type PromptHandler = (messageObject: ChatMessage) => void;
export type FinishHandler = (answers: Record<string, any>) => void;
export type SimpleHandler = () => void;
export type ErrorHandler = (error: Error) => void;

export type ChatEventHandlerMap<TAnswers, TAction extends string = string> = {
  message: MessageHandler<TAnswers, TAction>;
  prompt: PromptHandler;
  finish: FinishHandler;
  error: ErrorHandler;
  start: SimpleHandler;
  stop: SimpleHandler;
  send: SimpleHandler;
};
