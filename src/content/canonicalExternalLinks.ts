const CANONICAL_EXTERNAL_URLS = new Map([
  ['https://developers.openai.com/blog/eval-skills/', 'https://developers.openai.com/blog/eval-skills'],
  ['https://developers.openai.com/codex/app/worktrees', 'https://learn.chatgpt.com/docs/environments/git-worktrees'],
  ['https://developers.openai.com/codex/concepts/sandboxing', 'https://learn.chatgpt.com/docs/sandboxing'],
  ['https://developers.openai.com/codex/noninteractive', 'https://learn.chatgpt.com/docs/non-interactive-mode'],
  ['https://developers.openai.com/codex/sdk', 'https://learn.chatgpt.com/docs/codex-sdk'],
]);

export function canonicalizeKnownExternalLinks(value: string) {
  let canonicalized = value;

  for (const [source, destination] of CANONICAL_EXTERNAL_URLS) {
    canonicalized = canonicalized.replaceAll(source, destination);
  }

  return canonicalized;
}
