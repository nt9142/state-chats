import { processContent } from '../utils';

describe('processContent', () => {
  it('should return processed content', () => {
    const content = 'Hello, {{name}}!';
    const context = { name: 'John' };
    const processedContent = processContent(content, context);
    expect(processedContent).toBe('Hello, John!');
  });
});
