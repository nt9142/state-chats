import { getChat } from '..';
import { type ChatScript } from '../types';

// TODO: Add tests
describe('getChat', () => {
  it('should execute a script', async () => {
    const script: ChatScript = [
      {
        content: 'Greetings!',
        delay: 10,
      },
      {
        content: 'What is your name?',
        variable: 'name',
      },
      {
        content: 'What is your age?',
        variable: 'age',
      },
    ];

    const chat = getChat(script);

    const onMessage = jest.fn();
    const onPromptInput = jest.fn();
    const onSend = jest.fn();

    chat.on('message', onMessage);
    chat.on('prompt', onPromptInput);
    chat.on('send', onSend);

    chat.start();

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(script[0], {});

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith(script[1], {});

    expect(onPromptInput).toHaveBeenCalledTimes(1);

    expect(onSend).toHaveBeenCalledTimes(0);

    chat.send('John');

    expect(onSend).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onMessage).toHaveBeenCalledWith(script[2], {
      name: 'John',
    });

    chat.stop();
  });
});
