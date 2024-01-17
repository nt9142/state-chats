import type { Condition } from './conditions/types';

export type * from './conditions/types';

/**
 * Represents a chat script.
 */
export type ChatScript<TMeta = any> = Array<ChatMessage<TMeta>>;

/**
 * Represents the base structure of a chat message.
 */
interface BaseChatMessage<TMeta = any> {
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
}

/**
 * Represents a chat message with a delay.
 */
export type ChatMessageWithDelay<TMeta = any> = BaseChatMessage<TMeta> & {
  delay: number;
};

/**
 * Represents a chat message with a variable.
 */
export type ChatMessageWithVariable<TMeta = any> = BaseChatMessage<TMeta> & {
  variable: string;
};

/**
 * Represents a chat message.
 */
export type ChatMessage<TMeta = any> =
  | ChatMessageWithDelay<TMeta>
  | ChatMessageWithVariable<TMeta>;

export type ChatEvent =
  | 'message'
  | 'prompt'
  | 'send'
  | 'start'
  | 'stop'
  | 'error'
  | 'finish';

export type MessageHandler<TAnswers> = (
  messageObject: ChatMessage,
  answers: TAnswers,
) => void;
export type PromptHandler = (messageObject: ChatMessage) => void;
export type FinishHandler = (answers: Record<string, any>) => void;
export type SimpleHandler = () => void;
export type ErrorHandler = (error: Error) => void;

export type ChatEventHandlerMap<TAnswers> = {
  message: MessageHandler<TAnswers>;
  prompt: PromptHandler;
  finish: FinishHandler;
  error: ErrorHandler;
  start: SimpleHandler;
  stop: SimpleHandler;
  send: SimpleHandler;
};
