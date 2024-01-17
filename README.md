# State-Chats

State-Chats is a JavaScript/TypeScript library designed to facilitate the creation and management of stateful chat interactions. It leverages asynchronous generators and event-driven patterns to offer a flexible and intuitive API for building complex chat flows.

## Features

- **Asynchronous Chat Flow**: Manage chat interactions with asynchronous support, allowing for delays and dynamic responses.
- **Event-Driven Architecture**: Utilize a robust event system for handling messages, prompts, and chat lifecycle events.
- **Customizable and Extensible**: Easily extend and customize chat flows to fit various use cases.
- **Isomorphic Library**: Compatible with both Node.js and browser environments.
- **React Hook Integration** (Coming Soon): Integrate easily with React applications using a custom hook.

## Installation

```bash
npm install state-chats
# or
yarn add state-chats
```

## Usage

Here is a basic example of how to use State-Chats:

```javascript
import { getChat } from 'state-chats';

// Define your chat script
const script = [
  // Your chat script goes here
];

const chat = getChat(script);

chat.on('message', (message) => {
  console.log(message);
});

chat.on('prompt', (send) => {
  send('Your response');
});

chat.start();

// To stop the chat
chat.stop();
```

## Script Structure

A script in State-Chats is defined as an array of chat messages, each with potential conditions, delays, or prompts for user input. Here's a short example:

```javascript
const exampleScript = [
  {
    content: 'Hello! Are you an admin?',
    variable: 'admin',
  },
  {
    condition: {
      type: 'equals',
      variable: 'admin',
      value: 'yes',
    },
    content: 'Great, nice to meet you, admin!',
    delay: 1000,
  },
  {
    condition: {
      type: 'not',
      condition: {
        type: 'equals',
        variable: 'admin',
        value: 'yes',
      },
    },
    content: 'Oh snap!',
    delay: 1000,
  },
  {
    content: 'Anyways, glad to see you',
    delay: 1000,
  },
];
```

## API Reference

- **getChat**: Function to initialize the chat with a given script.
- **on**: Subscribe to chat events (e.g., 'message', 'prompt').
- **start**: Start the chat interaction.
- **stop**: Stop the chat interaction.
- **send**: Send a message in response to a prompt.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for more information on how to get started.

## License

State-Chats is [MIT licensed](LICENSE).
