import { useEffect, useMemo, useState } from 'react';

import {
  type ActionMap,
  type ChatMessage,
  type ChatScript,
  type ChatMessageWithVariable,
} from '../core/types';
import { getChat } from '../core';

export function useStateChat<
  TContext extends Record<string, any>,
  TActionKey extends string,
  TMeta,
>(
  script: ChatScript<TMeta, TActionKey>,
  actions?: ActionMap<TActionKey, TContext>,
): {
  messages: Array<ChatMessage<TMeta, TActionKey>>;
  send?: (value: any) => void;
  context: TContext;
  isFinished: boolean;
  current: ChatMessage<TMeta, TActionKey> | null;
} {
  const chat = useMemo(
    () => getChat<TContext, TActionKey, TMeta>(script, actions),
    [script, actions],
  );
  const [messages, setMessages] = useState<
    Array<ChatMessage<TMeta, TActionKey>>
  >([]);
  const [context, setContext] = useState<TContext>({} as TContext);
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
