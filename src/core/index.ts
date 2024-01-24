import EventEmitter from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';

import type {
  ChatEvent,
  ChatEventHandlerMap,
  ChatMessage,
  ChatMessageActionResultMap,
  ChatMessageWithDelay,
  ChatMessageWithVariable,
  ChatScript,
} from './types';
import { evaluateCondition } from './conditions/utils';
import { type ActionMap } from './actions/types';
import { getHasAction } from './utils';

export function getChat<
  TMeta = any,
  TAnswers extends Record<string, any> = Record<string, string>,
  TAction extends string = string,
>(script: ChatScript<TMeta>, actions?: ActionMap<TAction, TAnswers>) {
  const chatEmitter = new EventEmitter<ChatEvent>();
  let isRunning = false;
  let chatIterator: AsyncGenerator;
  let answers = {} as TAnswers;
  let actionResultMap: ChatMessageActionResultMap<TAction> = {};

  async function* chatGenerator() {
    for (const messageCreate of script) {
      if (
        messageCreate.condition &&
        !evaluateCondition(messageCreate.condition, answers)
      ) {
        continue;
      }

      const message = {
        id: uuidv4(),
        ...messageCreate,
      } as ChatMessage<TMeta, TAction>;

      actionResultMap[message.id] = {};

      // Execute prefetch if it exists
      if (actions && getHasAction(message.prefetch, actions)) {
        try {
          actionResultMap[message.id].prefetch = await actions[
            message.prefetch
          ](answers, message);
        } catch (error) {
          chatEmitter.emit('error', error);
          continue;
        }
      }

      chatEmitter.emit('message', message, answers, actionResultMap);

      if ((message as ChatMessageWithDelay<TMeta>).delay) {
        await new Promise((resolve) =>
          setTimeout(resolve, (message as ChatMessageWithDelay<TMeta>).delay),
        );
      }
      if ((message as ChatMessageWithVariable<TMeta>).variable) {
        const answer: string = yield message as ChatMessageWithVariable<TMeta>;
        (answers as Record<string, any>)[
          (message as ChatMessageWithVariable<TMeta>).variable
        ] = answer;
      }
    }
    return answers;
  }

  async function startChat() {
    if (!isRunning) {
      isRunning = true;
      answers = {} as TAnswers;
      actionResultMap = {} as ChatMessageActionResultMap<TAction>;
      chatIterator = chatGenerator();
      chatEmitter.emit('start');
      let result = await chatIterator.next();
      while (!result.done) {
        chatEmitter.emit('prompt', result.value);
        const answer = await listenToPrompt();
        result = await chatIterator.next(answer);
      }
      chatEmitter.emit('finish', answers);
    }
  }

  function stopChat() {
    isRunning = false;
    chatEmitter.emit('stop');
  }

  function send(message: string) {
    if (isRunning) {
      chatEmitter.emit('send', message);
    }
  }

  async function listenToPrompt() {
    return await new Promise((resolve) => {
      chatEmitter.once('send', resolve);
    });
  }

  function onEvent<K extends ChatEvent>(
    event: K,
    listener: ChatEventHandlerMap<TAnswers, TAction>[K],
  ): void {
    chatEmitter.on(event, listener);
  }

  return {
    on: onEvent,
    start: startChat,
    stop: stopChat,
    send,
  };
}
