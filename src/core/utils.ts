export function processContent(
  content: string,
  answers: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => answers[key] || '');
}
