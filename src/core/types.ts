import type { Condition } from './conditions/types';

export type * from './conditions/types';

export type * from './actions/types';

/**
 * Represents a chat script.
 */
export type ChatScript<TMeta = any, TAction extends string = string> = Array<
  ChatMessage<TMeta, TAction>
>;

/**
 * Represents the base structure of a chat message.
 */
interface BaseChatMessage<TMeta, TAction extends string> {
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

  /**
   * Optional action to execute before showing the message.
   */
  prefetch?: TAction;
}

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
  actionResults: Record<TAction, unknown>,
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
