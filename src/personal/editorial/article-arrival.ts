import { prepareArticle } from './article-cache'
import { articleSection } from './library'

const illustratedArticles = new Set(['the-first-ai-managers', 'who-owns-texas-toll-roads', 'viralbench-codex-agent-harness'])
export const hasArticleFigures = (slug: string) => illustratedArticles.has(slug)
let figures: typeof import('./ArticleFigures')['ArticleFigures'] | undefined
let request: Promise<typeof import('./ArticleFigures')> | undefined
export const preparedArticleFigures = () => figures
export function loadArticleFigures() {
  return request ??= import('./ArticleFigures').then(module => {
    figures = module.ArticleFigures
    return module
  }, error => { request = undefined; throw error })
}

/** Prepare geometry above a section before the router measures its destination. */
export function prepareArticleArrival(slug: string, hash: string, pathname: string) {
  const article = prepareArticle(slug)
  if (!articleSection(hash, pathname) || !hasArticleFigures(slug)) return article
  return Promise.allSettled([article, loadArticleFigures()]).then(([manuscript]) => {
    // A failed figure must not release the route while its text is still loading.
    if (manuscript.status === 'rejected') throw manuscript.reason
    return manuscript.value
  })
}
