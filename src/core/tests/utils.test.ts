import { processContent } from '../utils';

describe('processContent', () => {
  it('should return processed content', () => {
    const content = 'Hello, {{name}}!';
    const answers = { name: 'John' };
    const processedContent = processContent(content, answers);
    expect(processedContent).toBe('Hello, John!');
  });
});
