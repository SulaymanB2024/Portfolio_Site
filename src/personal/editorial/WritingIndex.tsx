import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import catalog from './data/catalog.json'
import AnimatedArtwork from './AnimatedArtwork'
import { ArtworkMotionControl, useArtworkMotion } from './ArtworkMotion'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { readWritingFilters, writingHref, type WritingFilters } from './library'
import { displayDate, type ArticleSummary } from './types'
import './article-design.css'
import './writing-gallery.css'
import { artworkTransitionName } from './artwork-continuity'
import { siteCopy, withWritingCopy } from '../site-copy'
import '../copy.css'

const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const categories = ['All', ...new Set(articles.map(article => article.category))]

export default function WritingIndex() {
  const { paused } = useArtworkMotion()
  const [{ category, query }, setFilters] = useState(() => readWritingFilters(location.hash, categories))
  const filters = { category, query }
  function updateFilters(next: WritingFilters) {
    setFilters(next)
    history.replaceState(history.state, '', `${location.pathname}${location.search}${writingHref(next)}`)
  }
  function rememberArticle(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    history.replaceState(history.state, '', `${location.pathname}${location.search}${writingHref(filters, slug)}`)
  }
  useEffect(() => {
    const change = () => setFilters(readWritingFilters(location.hash, categories))
    window.addEventListener('hashchange', change)
    const selected = new URLSearchParams(location.hash.split('?')[1] || '').get('at')
    const frame = requestAnimationFrame(() => {
      const link = [...document.querySelectorAll<HTMLAnchorElement>('.writing-story')].find(item => item.dataset.slug === selected)
      if (link) { link.scrollIntoView({ block: 'center', behavior: 'instant' }); link.focus({ preventScroll: true }) }
    })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', change) }
  }, [])
  const visible = useMemo(() => articles.filter(article =>
    (category === 'All' || article.category === category) &&
    `${article.title} ${article.displayTitle || ''} ${article.subtitle} ${article.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [category, query])

  return <section className="writing-page">
    <header className="writing-header">
      <div className="writing-heading-copy"><h1 className="writing-heading">Writing<span className="period">.</span></h1><p className="writing-introduction">AI, infrastructure, and the systems we build.</p></div>
      <div className="writing-toolbar">
        <label className="writing-search"><span className="sr-only">Search writing</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input type="search" value={query} onChange={event => updateFilters({ ...filters, query: event.target.value })} placeholder="Search writing" /></label>
        <div className="writing-search-options"><span className="writing-result-count" aria-hidden="true">{query.trim() || category !== 'All' ? `${visible.length} ${visible.length === 1 ? 'result' : 'results'}` : ''}</span><ArtworkMotionControl /></div>
        {category !== 'All' && <div className="writing-legacy-filter"><span>{category}</span><button type="button" onClick={() => updateFilters({ ...filters, category: 'All' })}>Clear topic filter</button></div>}
      </div>
    </header>
    <div className="writing-gallery">{visible.map((article, index) => {
      const artwork = getArticleGenerativeArtwork(article.path)
      const layout = index === 0 && category === 'All' && !query.trim() ? 'feature' : 'entry'
      return <a className="writing-story" data-slug={article.slug} data-layout={layout} key={article.slug} href={`#/writing/${article.slug}?from=${encodeURIComponent(writingHref(filters, article.slug))}`} onClick={event => rememberArticle(event, article.slug)}>
        <div className="writing-story-copy"><h2>{article.displayTitle || article.title}</h2><p className="writing-deck">{article.subtitle}</p><div className="writing-story-meta"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time><span>{article.readTime}</span><span className="writing-story-action" aria-hidden="true">Read essay <span className="writing-story-arrow">↗</span></span></div></div>
        <div className="writing-art" data-treatment={artwork.treatment}><AnimatedArtwork artwork={artwork} size={400} paused={paused} eager={index === 0} embedded decorative transitionName={artworkTransitionName(artwork)} /></div>
      </a>
    })}</div>
    {!visible.length && <div className="writing-empty"><h2>No matches.</h2><p>Try another word or return to all writing.</p><button type="button" onClick={() => updateFilters({ query: '', category: 'All' })}>{siteCopy.writing.reset}</button></div>}
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? 'article' : 'articles'}</p>
  </section>
}
