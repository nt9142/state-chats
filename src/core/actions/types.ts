import { type ChatMessage } from '../types';

export type ActionFunction<TAnswers> = (
  answers: TAnswers,
  message: ChatMessage,
) => Promise<unknown>;

export type ActionMap<TAction extends string, TAnswers> = {
  [key in TAction]: ActionFunction<TAnswers>;
};
