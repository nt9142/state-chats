import EventEmitter from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';

import type {
  ChatEvent,
  ChatEventHandlerMap,
  ChatMessage,
  ChatMessageWithDelay,
  ChatMessageWithVariable,
  ChatScript,
  GetChatOptions,
} from './types';
import { evaluateCondition } from './conditions/utils';
import { type ActionMap } from './actions/types';
import { executeAction, getHasAction } from './utils';

export function getChat<
  TContext extends Record<string, any> = Record<string, string>,
  TActionKey extends string = string,
  TMeta = any,
>(
  script: ChatScript<TMeta>,
  actions?: ActionMap<TActionKey, TContext>,
  options?: GetChatOptions<TContext>,
) {
  const chatEmitter = new EventEmitter<ChatEvent>();
  let isRunning = false;
  let chatIterator: AsyncGenerator;
  let context = options?.initialContext ?? ({} as TContext);

  async function* chatGenerator() {
    for (let i = 0; i < script.length; i += 1) {
      const messageCreate = script[i];
      const isFirstMessage = i === 0;

      if (
        messageCreate.condition &&
        !evaluateCondition(messageCreate.condition, context)
      ) {
        continue;
      }

      const message = {
        id: uuidv4(),
        role: 'bot',
        ...messageCreate,
      } as ChatMessage<TMeta, TActionKey>;

      // Execute prefetch if it exists
      if (actions && getHasAction(message.prefetch?.actionKey, actions)) {
        try {
          (context as Record<string, any>)[message.prefetch.contextKey] =
            await executeAction(message.prefetch, actions, context, message);
        } catch (error) {
          chatEmitter.emit('error', error);
          continue;
        }
      }

      if (!isFirstMessage || options?.skipEmitFirstMessage !== true) {
        chatEmitter.emit('message', message, { ...context });
      }

      if (typeof (message as ChatMessageWithDelay<TMeta>).delay === 'number') {
        await new Promise((resolve) =>
          setTimeout(resolve, (message as ChatMessageWithDelay<TMeta>).delay),
        );
      }

      if ((message as ChatMessageWithVariable<TMeta>).variable) {
        const messageWithVariable = message as ChatMessageWithVariable<TMeta>;
        const answer: string = yield message as ChatMessageWithVariable<TMeta>;

        (context as Record<string, any>)[messageWithVariable.variable] = answer;

        const answerMessage = {
          id: uuidv4(),
          role: 'user',
          content: answer,
        } as ChatMessage<TMeta, TActionKey>;

        chatEmitter.emit('message', answerMessage, { ...context });

        if (typeof messageWithVariable.delayAfterAnswer === 'number') {
          await new Promise((resolve) =>
            setTimeout(resolve, messageWithVariable.delayAfterAnswer),
          );
        }
      }

      if (actions && getHasAction(message.postfetch?.actionKey, actions)) {
        try {
          (context as Record<string, any>)[message.postfetch.contextKey] =
            await executeAction(message.postfetch, actions, context, message);
        } catch (error) {
          chatEmitter.emit('error', error);
          continue;
        }
      }
    }
    return context;
  }

  async function startChat() {
    if (!isRunning) {
      isRunning = true;
      context = options?.initialContext ?? ({} as TContext);
      chatIterator = chatGenerator();
      chatEmitter.emit('start');
      let result = await chatIterator.next();
      while (!result.done) {
        chatEmitter.emit('prompt', result.value);
        const answer = await listenToPrompt();
        result = await chatIterator.next(answer);
      }
      chatEmitter.emit('finish', context);
    }
  }

  function stopChat() {
    isRunning = false;
    chatEmitter.emit('stop');
  }

  function send(message: unknown) {
    if (isRunning) {
      chatEmitter.emit('send', message);
    }
  }

  async function listenToPrompt() {
    return await new Promise<unknown>((resolve) => {
      chatEmitter.once('send', resolve);
    });
  }

  function onEvent<K extends ChatEvent>(
    event: K,
    listener: ChatEventHandlerMap<TContext>[K],
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
