import type { WritingArticle } from './types'

const loaders = import.meta.glob<{ default: WritingArticle }>([
  './data/articles/atlas-building-an-evidence-console.json',
  './data/articles/who-owns-texas-toll-roads.json',
  './data/articles/the-first-ai-managers.json',
  './data/articles/viralbench-codex-agent-harness.json',
])
const articles = new Map<string, WritingArticle>()
const requests = new Map<string, Promise<WritingArticle>>()

export function cachedArticle(slug: string) {
  return articles.get(slug) ?? null
}

/** Keep navigation from photographing an empty, still-loading article cover. */
export function prepareArticle(slug: string) {
  const cached = articles.get(slug)
  if (cached) return Promise.resolve(cached)
  const pending = requests.get(slug)
  if (pending) return pending
  const load = loaders[`./data/articles/${slug}.json`]
  if (!load) return Promise.reject(new Error('Article not found'))
  const request = load().then(module => {
    const article = module.default
    const reviewed: WritingArticle = slug === 'viralbench-codex-agent-harness' ? {
      ...article,
      pageContent: {
        ...article.pageContent,
        callouts: [{
          label: 'Project status / July 2026',
          title: 'Code audit and proposed improvement harness',
          markdown: 'This study audits a pinned upstream agent and proposes an outer loop for traces, replay, bounded changes, and independent release decisions. Its forward-looking build language describes that design. The public record does not establish a deployed harness or measured improvement in agent performance.',
        }, ...(article.pageContent?.callouts || [])],
      },
    } : article
    articles.set(slug, reviewed)
    requests.delete(slug)
    return reviewed
  }, error => {
    requests.delete(slug)
    throw error
  })
  requests.set(slug, request)
  return request
}

export function warmArticle(slug: string) {
  void prepareArticle(slug).catch(() => { /* The article retains its retry UI. */ })
}
