import { useEffect, useMemo, useState } from 'react';

import {
  type ChatMessageActionResultMap,
  type ActionMap,
  type ChatMessage,
  type ChatScript,
  type ChatMessageActionResults,
  type ChatMessageWithVariable,
} from '../core/types';
import { getChat } from '../core';

export function useStateChat<
  TMeta,
  TAction extends string,
  TAnswers extends Record<string, any>,
>(
  script: ChatScript<TMeta, TAction>,
  actions?: ActionMap<TAction, TAnswers>,
): {
  messages: Array<ChatMessage<TMeta, TAction>>;
  send?: (value: any) => void;
  answers: TAnswers;
  actionResult: ChatMessageActionResultMap<TAction>;
  isFinished: boolean;
  current: {
    message: ChatMessage<TMeta, TAction>;
    actionResult: ChatMessageActionResults<TAction>;
  } | null;
} {
  const chat = useMemo(() => getChat(script, actions), [script, actions]);
  const [messages, setMessages] = useState<Array<ChatMessage<TMeta, TAction>>>(
    [],
  );
  const [answers, setAnswers] = useState<TAnswers>({} as TAnswers);
  const [actionResultMap, setActionResultMap] = useState<
    ChatMessageActionResultMap<TAction>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    chat.on('message', (message, newAnswers, actionResultMap) => {
      setActionResultMap(actionResultMap);
      setMessages((messages) => [
        ...messages,
        message as ChatMessage<TMeta, TAction>,
      ]);
      setAnswers((answers) => ({ ...answers, ...newAnswers }));
    });

    chat.on('finish', (newAnswers) => {
      setAnswers((answers) => ({ ...answers, ...newAnswers }));
      setIsFinished(true);
    });

    chat.start();

    return () => {
      chat.stop();
    };
  }, [chat]);

  const currentMessage = messages[messages.length - 1];
  const current = currentMessage
    ? {
        message: currentMessage,
        actionResult: actionResultMap[messages[messages.length - 1].id],
      }
    : null;

  const send =
    (currentMessage as ChatMessageWithVariable)?.variable !== undefined
      ? chat.send
      : undefined;

  return {
    messages,
    send,
    answers,
    isFinished,
    actionResult: actionResultMap,
    current,
  };
}
