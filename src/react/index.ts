import { useEffect, useMemo, useState } from 'react';

import {
  type ActionMap,
  type ChatMessage,
  type ChatScript,
  type ChatMessageWithVariable,
} from '../core/types';
import { getChat } from '../core';
import { type UseStateChatOptions } from '../types';

export function useStateChat<
  TContext extends Record<string, any>,
  TActionKey extends string,
  TMeta,
>(
  script: ChatScript<TMeta, TActionKey>,
  actions?: ActionMap<TActionKey, TContext>,
  options?: UseStateChatOptions<TContext, TMeta, TActionKey>,
): {
  messages: Array<ChatMessage<TMeta, TActionKey>>;
  send?: (value: any) => void;
  context: TContext;
  isFinished: boolean;
  current: ChatMessage<TMeta, TActionKey> | null;
} {
  const { initialMessages, ...chatOptions } = options ?? {};
  const { initialContext } = chatOptions;
  const { chatScript, skipEmitFirstMessage } = useMemo(() => {
    if (!initialMessages) {
      return {
        chatScript: script,
        skipEmitFirstMessage: false,
      };
    }

    const alreadySentBotMessages = initialMessages.filter(
      (m) => m.role === 'bot',
    );

    if (alreadySentBotMessages.length === 0) {
      return {
        chatScript: script,
        skipEmitFirstMessage: false,
      };
    }

    return {
      chatScript: script.slice(alreadySentBotMessages.length - 1),
      skipEmitFirstMessage: true,
    };
  }, [script]);

  const chat = useMemo(() => {
    return getChat<TContext, TActionKey, TMeta>(chatScript, actions, {
      ...chatOptions,
      skipEmitFirstMessage,
    });
  }, [chatScript, actions, initialContext]);

  const [messages, setMessages] = useState<
    Array<ChatMessage<TMeta, TActionKey>>
  >(initialMessages ?? []);
  const [context, setContext] = useState<TContext>(
    initialContext ?? ({} as TContext),
  );
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    chat.on('message', (message, newContext) => {
      setMessages((messages) => [
        ...messages,
        message as ChatMessage<TMeta, TActionKey>,
      ]);
      setContext((context) => ({ ...context, ...newContext }));
    });

    chat.on('finish', (newContext) => {
      setContext((context) => ({ ...context, ...newContext }));
      setIsFinished(true);
    });

    chat.start();

    return () => {
      chat.stop();
    };
  }, [chat]);

  const currentMessage = messages[messages.length - 1];
  const current = currentMessage || null;

  const send =
    (currentMessage as ChatMessageWithVariable)?.variable !== undefined
      ? chat.send
      : undefined;

  return {
    messages,
    send,
    context,
    isFinished,
    current,
  };
}
