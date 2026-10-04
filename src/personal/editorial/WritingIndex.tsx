import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import catalog from './data/catalog.json'
import AnimatedArtwork from './AnimatedArtwork'
import { ArtworkMotionControl, useArtworkMotion } from './ArtworkMotion'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { filterWritingArticles, readWritingFilters, writingHref, type WritingFilters } from './library'
import { displayDate, type ArticleSummary } from './types'
import './article-design.css'
import './writing-gallery.css'
import './writing-craft.css'
import { artworkTransitionName } from './artwork-continuity'
import { siteCopy, withWritingCopy } from '../site-copy'
import '../copy.css'

const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const categories = ['All', ...new Set(articles.map(article => article.category))]
const topicLabels: Record<string, string> = { All: 'All topics', 'INFRASTRUCTURE INVESTING': 'Infrastructure', 'PRODUCT & SYSTEMS': 'Product & systems', 'AI SYSTEMS': 'AI systems', 'ViralBench / Codex / agent evaluation': 'Agent evaluation' }

export default function WritingIndex() {
  const { paused } = useArtworkMotion()
  const searchInput = useRef<HTMLInputElement>(null)
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
  function clearFilters() {
    updateFilters({ query: '', category: 'All' })
    searchInput.current?.focus({ preventScroll: true })
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
  const visible = useMemo(() => filterWritingArticles(articles, { category, query }), [category, query])

  return <section className="writing-page">
    <header className="writing-header">
      <div className="writing-heading-copy"><h1 className="writing-heading">Writing<span className="period">.</span></h1><p className="writing-introduction">{siteCopy.writing.introduction}</p></div>
      <div className="writing-toolbar">
        <label className="writing-search"><span className="sr-only">Search writing</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input ref={searchInput} type="search" value={query} onChange={event => updateFilters({ ...filters, query: event.target.value })} placeholder="Search writing" /></label>
        <div className="writing-search-options"><label className="writing-topic"><span className="sr-only">Filter writing by topic</span><select value={category} onChange={event => updateFilters({ ...filters, category: event.target.value })}>{categories.map(value => <option key={value} value={value}>{topicLabels[value] || value}</option>)}</select><span aria-hidden="true">⌄</span></label><ArtworkMotionControl /></div>
        {(query.trim() || category !== 'All') && <div className="writing-filter-status"><span>{visible.length} {visible.length === 1 ? 'essay' : 'essays'}</span><button type="button" onClick={clearFilters}>Clear filters</button></div>}
      </div>
    </header>
    <div className="writing-gallery">{visible.map((article, index) => {
      const artwork = getArticleGenerativeArtwork(article.path)
      const layout = index === 0 && category === 'All' && !query.trim() ? 'feature' : 'entry'
      return <a className="writing-story" aria-labelledby={`writing-title-${article.slug}`} aria-describedby={`writing-deck-${article.slug}`} data-slug={article.slug} data-layout={layout} key={article.slug} href={`#/writing/${article.slug}?from=${encodeURIComponent(writingHref(filters, article.slug))}`} onClick={event => rememberArticle(event, article.slug)}>
        <div className="writing-story-copy"><span className="writing-story-topic">{topicLabels[article.category] || article.category}</span><h2 id={`writing-title-${article.slug}`}>{article.displayTitle || article.title}</h2><p id={`writing-deck-${article.slug}`} className="writing-deck">{article.subtitle}</p><div className="writing-story-meta"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time><span>{article.readTime.toLowerCase()}</span><span className="writing-story-action" aria-hidden="true">Read essay <span className="writing-story-arrow">↗</span></span></div></div>
        <div className="writing-art" data-treatment={artwork.treatment}><AnimatedArtwork artwork={artwork} size={400} paused={paused} eager={index === 0} embedded decorative transitionName={artworkTransitionName(artwork)} /></div>
      </a>
    })}</div>
    {!visible.length && <div className="writing-empty"><h2>No matches.</h2><p>{query.trim() ? <>No essays match “{query.trim()}”{category !== 'All' ? ` in ${topicLabels[category] || category}` : ''}.</> : <>No essays in {topicLabels[category] || category}.</>} Try fewer words or choose another topic.</p><button type="button" onClick={clearFilters}>{siteCopy.writing.reset}</button></div>}
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? 'article' : 'articles'}</p>
  </section>
}
