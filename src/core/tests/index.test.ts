import { getChat } from '..';
import { type ChatMessageCreate, type ChatScript } from '../types';

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
    function getBotAnswer(messageCreate: ChatMessageCreate) {
      return {
        id: expect.any(String),
        role: 'bot',
        ...messageCreate,
      };
    }
    const script: ChatScript<any, 'getIsAdmin' | 'getPermissions'> = [
      {
        content: 'Greetings!',
        delay: 10,
      },
      {
        content: 'What is your name?',
        variable: 'name',
        delayAfterAnswer: 2,
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
      expect.objectContaining(getBotAnswer(script[0])),
      {},
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(getBotAnswer(script[1])),
      {},
    );

    expect(onPromptInput).toHaveBeenCalledTimes(1);

    chat.send('John');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onMessage).toHaveBeenCalledTimes(3);

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        content: 'John',
        role: 'user',
      }),
      {
        name: 'John',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 5));

    expect(onMessage).toHaveBeenCalledTimes(4);

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(getBotAnswer(script[2])),
      {
        name: 'John',
        isAdmin: 'Yes',
        adminPermissions: 'All',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onMessage).toHaveBeenCalledTimes(5);

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(getBotAnswer(script[3])),
      {
        name: 'John',
        isAdmin: 'Yes',
        adminPermissions: 'All',
      },
    );

    chat.stop();
  });

  it('should emit the first message when skipEmitFirstMessage is false', async () => {
    const script: ChatScript = [
      {
        content: 'This message should be emitted',
        delay: 10,
      },
      {
        content: 'What is your name?',
        variable: 'name',
      },
    ];

    const chat = getChat(script); // skipEmitFirstMessage is false by default

    const onMessage = jest.fn();

    chat.on('message', onMessage);

    chat.start();

    // Wait for the first message's delay
    await new Promise((resolve) => setTimeout(resolve, 15));

    // Both messages should be emitted
    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(script[0]),
      {},
    );
    expect(onMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(script[1]),
      {},
    );

    chat.stop();
  });

  it('should skip emitting the first message when skipEmitFirstMessage is true', async () => {
    const script: ChatScript = [
      {
        content: 'This message should be skipped',
        delay: 10,
      },
      {
        content: 'What is your name?',
        variable: 'name',
      },
      {
        content: 'Nice to meet you, {name}!',
        delay: 10,
      },
    ];

    const chat = getChat(script, undefined, { skipEmitFirstMessage: true });

    const onMessage = jest.fn();
    const onPrompt = jest.fn();
    const onStart = jest.fn();

    chat.on('message', onMessage);
    chat.on('prompt', onPrompt);
    chat.on('start', onStart);

    chat.start();

    // Check that the start event is emitted
    expect(onStart).toHaveBeenCalledTimes(1);

    // Wait for the first message's delay
    await new Promise((resolve) => setTimeout(resolve, 15));

    // The first message should be skipped, so onMessage should have been called only once
    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining(script[1]),
      expect.any(Object),
    );

    // Check that onPrompt has been called
    expect(onPrompt).toHaveBeenCalledTimes(1);
    expect(onPrompt).toHaveBeenCalledWith(expect.objectContaining(script[1]));

    // Simulate user input
    chat.send('Alice');

    // Wait for the next message's delay
    await new Promise((resolve) => setTimeout(resolve, 15));

    // Check that the user's message and the final bot message are emitted
    expect(onMessage).toHaveBeenCalledTimes(3);
    expect(onMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ content: 'Alice', role: 'user' }),
      expect.objectContaining({ name: 'Alice' }),
    );
    expect(onMessage).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(script[2]),
      expect.objectContaining({ name: 'Alice' }),
    );

    chat.stop();
  });
});
