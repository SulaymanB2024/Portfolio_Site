import type { WritingArticle } from './types'
import catalog from './data/catalog.json'

const loaders = import.meta.glob<{ default: WritingArticle }>('./data/articles/*.json')
const published = new Set(catalog.map(article => article.slug))
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
  if (!load || !published.has(slug)) return Promise.reject(new Error('Article not found'))
  const request = load().then(module => {
    const article = module.default
    // Project status and research qualifications live in the reviewed source,
    // shared by the interactive reader and the generated document.
    articles.set(slug, article)
    requests.delete(slug)
    return article
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
