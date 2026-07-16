export function splitMarkdownLead(markdown: string) {
  const paragraphs = markdown.trim().split(/\n\s*\n/);
  const lead = paragraphs.shift() ?? '';

  return {
    lead,
    remainder: paragraphs.join('\n\n'),
  };
}
