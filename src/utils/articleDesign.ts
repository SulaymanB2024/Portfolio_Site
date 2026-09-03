export type ArticleTitleScale = 'short' | 'standard' | 'long' | 'extra-long';

export function getArticleTitleScale(title: unknown): ArticleTitleScale {
  if (typeof title !== 'string') return 'standard';

  const length = title.trim().length;
  if (length <= 32) return 'short';
  if (length <= 54) return 'standard';
  if (length <= 70) return 'long';
  return 'extra-long';
}
