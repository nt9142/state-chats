import type {
  ChatMessage,
  ChatMessageWithDelay,
  ChatMessageWithVariable,
  ChatScript,
} from './types';
import { evaluateCondition } from './conditions/utils';
import { processContent } from './utils';

export interface GetChatOptions<TMeta> {
  script: ChatScript<TMeta>;
  showMessage: (messageText: string, message: ChatMessage<TMeta>) => void;
  promptInput: (meta: TMeta) => Promise<string>;
}
export async function getChat<TMeta = any>({
  script,
  showMessage,
  promptInput,
}: GetChatOptions<TMeta>): Promise<Record<string, string>> {
  return await new Promise(async (resolve) => {
    const answers: Record<string, string> = {};
    for (const message of script) {
      // Check if the message should be shown based on the condition
      if (message.condition && !evaluateCondition(message.condition, answers)) {
        continue;
      }
      // Show the message
      showMessage(processContent(message.content, answers), message);
      // Wait for the delay (if any)
      if ((message as ChatMessageWithDelay<TMeta>).delay) {
        await new Promise((resolve) =>
          setTimeout(resolve, (message as ChatMessageWithDelay<TMeta>).delay),
        );
      }
      // Prompt for user input (if any)
      if ((message as ChatMessageWithVariable<TMeta>).variable) {
        const input = await promptInput(message.meta as TMeta);
        answers[(message as ChatMessageWithVariable<TMeta>).variable] = input;
      }
    }
    resolve(answers);
  });
}
