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
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(script[0]),
      {},
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(script[1]),
      {},
    );

    expect(onPromptInput).toHaveBeenCalledTimes(1);

    expect(onSend).toHaveBeenCalledTimes(0);

    chat.send('John');

    expect(onSend).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onMessage).toHaveBeenCalledWith(expect.objectContaining(script[2]), {
      name: 'John',
    });

    chat.stop();
  });

  it('should execute a script with actions', async () => {
    const script: ChatScript<any, 'getIsAdmin' | 'getPermissions'> = [
      {
        content: 'Greetings!',
        delay: 10,
      },
      {
        content: 'What is your name?',
        variable: 'name',
        postfetch: {
          contextKey: 'isAdmin',
          actionKey: 'getIsAdmin',
        },
      },
      {
        content: 'Hello admin!',
        condition: {
          type: 'equals',
          variable: 'isAdmin',
          value: 'Yes',
        },
        delay: 10,
        prefetch: {
          contextKey: 'adminPermissions',
          actionKey: 'getPermissions',
        },
      },
      {
        content: 'What is your age?',
        variable: 'age',
      },
    ];

    type Context = {
      name?: string;
      isAdmin?: string;
      adminPermissions?: string;
      age?: string;
    };

    const actions = {
      async getIsAdmin({ name }: Context) {
        return name === 'John' ? 'Yes' : 'No';
      },
      async getPermissions({ isAdmin }: Context) {
        return isAdmin === 'Yes' ? 'All' : 'None';
      },
    };

    const chat = getChat(script, actions);

    const onMessage = jest.fn();
    const onPromptInput = jest.fn();
    const onSend = jest.fn();

    chat.on('message', onMessage);
    chat.on('prompt', onPromptInput);
    chat.on('send', onSend);

    chat.start();

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(script[0]),
      {},
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(script[1]),
      {},
    );

    expect(onPromptInput).toHaveBeenCalledTimes(1);

    chat.send('John');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onMessage).toHaveBeenCalledTimes(3);
    expect(onMessage).toHaveBeenCalledWith(expect.objectContaining(script[2]), {
      name: 'John',
      isAdmin: 'Yes',
      adminPermissions: 'All',
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(4);

    expect(onMessage).toHaveBeenCalledWith(expect.objectContaining(script[3]), {
      name: 'John',
      isAdmin: 'Yes',
      adminPermissions: 'All',
    });

    chat.stop();
  });
});
