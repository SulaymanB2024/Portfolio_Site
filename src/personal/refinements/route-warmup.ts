import catalog from '../editorial/data/catalog.json'
import { resolveRoute } from '../editorial/routes'
import { prepareArticle } from '../editorial/article-cache'
import type { ArticleSummary } from '../editorial/types'
import { allowsWarmup, createWarmCache, type WarmIntent } from './warmup-policy'

const articles = catalog as ArticleSummary[]
const figures = new Set(['the-first-ai-managers', 'who-owns-texas-toll-roads', 'viralbench-codex-agent-harness'])
const studies = new Set(['work/atlas', 'work/payrollpro', 'work/viralbench'])
const loaders = {
  about: () => import('../about/AboutPage'),
  resume: () => import('../editorial/ResumePage'),
  study: () => import('../projects/CaseStudyPage'),
  figures: () => import('../editorial/ArticleFigures'),
}

/** A short hover dwell, immediate keyboard/touch intent, and no background crawl. */
export function installRouteWarmup(root: HTMLElement) {
  const warm = createWarmCache()
  let timer = 0
  let hovered: HTMLAnchorElement | null = null
  function linkFor(target: EventTarget | null) {
    const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null
    return link && root.contains(link) && link.origin === location.origin && link.pathname === location.pathname && link.hash.startsWith('#/') && !link.hasAttribute('download') ? link : null
  }
  function begin(link: HTMLAnchorElement, intent: WarmIntent) {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (!allowsWarmup(intent, connection?.saveData, connection?.effectiveType)) return
    const route = resolveRoute(link.hash, location.pathname, articles)
    const report = (key: string, load: () => Promise<unknown>) => {
      void warm(key, load).then(() => {
        if (import.meta.env.DEV) {
          const completed = new Set((document.documentElement.dataset.routeWarmups || '').split(',').filter(Boolean))
          completed.add(key)
          document.documentElement.dataset.routeWarmups = [...completed].join(',')
        }
      }).catch(() => { /* Normal routing retains its retry behavior. */ })
    }
    if (route === 'about' || route === 'resume') report(route, loaders[route])
    if (studies.has(route)) report('study', loaders.study)
    if (route.startsWith('writing/')) {
      const slug = route.slice('writing/'.length)
      if (!articles.some(article => article.slug === slug)) return
      report(`article:${slug}`, () => prepareArticle(slug))
      if (figures.has(slug)) report('figures', loaders.figures)
    }
  }
  function cancelHover() { window.clearTimeout(timer); timer = 0; hovered = null }
  function over(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.buttons) return
    const link = linkFor(event.target)
    if (!link || hovered === link) return
    cancelHover()
    hovered = link
    timer = window.setTimeout(() => { timer = 0; if (hovered === link && link.isConnected) begin(link, 'hover') }, 100)
  }
  function out(event: PointerEvent) {
    if (hovered && event.relatedTarget instanceof Node && hovered.contains(event.relatedTarget)) return
    cancelHover()
  }
  function focus(event: FocusEvent) { const link = linkFor(event.target); if (link) { cancelHover(); begin(link, 'focus') } }
  function activate(event: PointerEvent | MouseEvent) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = linkFor(event.target)
    // A touch may become a scroll. Data-saving connections wait for its click.
    if (link) { cancelHover(); begin(link, event.type === 'click' ? 'activate' : 'focus') }
  }
  root.addEventListener('pointerover', over, { passive: true })
  root.addEventListener('pointerout', out, { passive: true })
  root.addEventListener('focusin', focus)
  root.addEventListener('pointerdown', activate, { passive: true })
  root.addEventListener('click', activate, true)
  return () => {
    cancelHover()
    root.removeEventListener('pointerover', over); root.removeEventListener('pointerout', out)
    root.removeEventListener('focusin', focus); root.removeEventListener('pointerdown', activate)
    root.removeEventListener('click', activate, true)
  }
}
