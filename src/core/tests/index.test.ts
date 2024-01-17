import { getChat } from '../index';
import type { ChatScript } from '../types';

describe('getChat', () => {
  it('should return answers from the chat script', async () => {
    const script: ChatScript = [
      {
        content: 'What is your name?',
        variable: 'name',
      },
      {
        content: 'Nice to meet you, {name}!',
        delay: 5,
      },
    ];

    const answers = await getChat({
      script,
      showMessage: jest.fn(),
      promptInput: jest.fn(async () => await Promise.resolve('John')),
    });

    expect(answers).toEqual({ name: 'John' });
  });

  it('should skip messages if the condition is not met', async () => {
    const script: ChatScript = [
      {
        content: 'What is your name?',
        variable: 'name',
      },
      {
        content: 'Nice to meet you, {name}!',
        delay: 10,
      },
      {
        content: 'What is your age?',
        variable: 'age',
        condition: {
          type: 'equals',
          variable: 'name',
          value: 'Jack',
        },
      },
    ];

    const answers = await getChat({
      script,
      showMessage: jest.fn(),
      promptInput: jest.fn(async () => await Promise.resolve('John')),
    });

    expect(answers).toEqual({ name: 'John' });
  });

  it('should wait for the delay before prompting for input', async () => {
    const script: ChatScript = [
      {
        content: 'What is your name?',
        variable: 'name',
      },
      {
        content: 'Nice to meet you, {name}!',
        delay: 10,
      },
      {
        content: 'What is your age?',
        variable: 'age',
      },
    ];

    const promptInput = jest.fn(async () => await Promise.resolve('John'));
    const chatPromise = getChat({
      script,
      showMessage: jest.fn(),
      promptInput,
    });

    expect(promptInput).toHaveBeenCalledTimes(1);

    await chatPromise;

    expect(promptInput).toHaveBeenCalledTimes(2);
  });
});
