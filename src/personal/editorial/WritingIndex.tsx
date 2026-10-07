import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import catalog from './data/catalog.json'
import AnimatedArtwork from './AnimatedArtwork'
import { useArtworkMotion } from './ArtworkMotion'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { filterWritingArticles, readWritingFilters, writingHref, type WritingFilters } from './library'
import { displayDate, type ArticleSummary } from './types'
import './article-design.css'
import './writing-gallery.css'
import './writing-craft.css'
import { artworkTransitionName } from './artwork-continuity'
import { siteCopy, withWritingCopy } from '../site-copy'
import '../copy.css'
import { writingSelection } from './writing-selection'
import { DestinationCue } from '../DestinationLink'
import './writing-selection.css'
import { topicLabel } from './topic-label'
import { ReadingPaths } from './TopicPage'

const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const categories = ['All', ...new Set(articles.map(article => article.category))]

export default function WritingIndex() {
  const { paused } = useArtworkMotion()
  const searchInput = useRef<HTMLInputElement>(null)
  const discoveryToggle = useRef<HTMLElement>(null)
  const focusAfterReset = useRef(false)
  const [{ category, query }, setFilters] = useState(() => readWritingFilters(location.hash, categories))
  const [toolsOpen, setToolsOpen] = useState(() => Boolean(query.trim() || category !== 'All'))
  const filters = { category, query }
  function updateFilters(next: WritingFilters) {
    setToolsOpen(true)
    setFilters(next)
    history.replaceState(history.state, '', `${location.pathname}${location.search}${writingHref(next)}`)
  }
  function rememberArticle(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    history.replaceState(history.state, '', `${location.pathname}${location.search}${writingHref(filters, slug)}`)
  }
  function clearFilters() {
    focusAfterReset.current = true
    updateFilters({ query: '', category: 'All' })
  }
  useEffect(() => {
    if (!toolsOpen || !focusAfterReset.current) return
    focusAfterReset.current = false
    searchInput.current?.focus({ preventScroll: true })
  }, [toolsOpen, category, query])
  useEffect(() => {
    const change = () => {
      const next = readWritingFilters(location.hash, categories)
      setFilters(next)
      if (next.query.trim() || next.category !== 'All') setToolsOpen(true)
    }
    window.addEventListener('hashchange', change)
    const selected = new URLSearchParams(location.hash.split('?')[1] || '').get('at')
    const frame = requestAnimationFrame(() => {
      const link = [...document.querySelectorAll<HTMLAnchorElement>('.writing-story')].find(item => item.dataset.slug === selected)
      if (link) { link.scrollIntoView({ block: 'center', behavior: 'instant' }); link.focus({ preventScroll: true }) }
    })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', change) }
  }, [])
  const visible = useMemo(() => filterWritingArticles(articles, { category, query }), [category, query])
  const selection = writingSelection(visible)
  const searching = category !== 'All' || Boolean(query.trim())
  function story(article: ArticleSummary, layout: 'lead' | 'selected' | 'report' | 'compact' | 'note', index: number) {
    const artwork = getArticleGenerativeArtwork(article.path)
    return <a className="writing-story" aria-labelledby={`writing-title-${article.slug}`} aria-describedby={`writing-deck-${article.slug}`} data-slug={article.slug} data-layout={layout} key={article.slug} href={`#/writing/${article.slug}?from=${encodeURIComponent(writingHref(filters, article.slug))}`} onClick={event => rememberArticle(event, article.slug)}>
      <div className="writing-story-copy"><span className="writing-story-topic">{topicLabel(article.category)}</span><h2 id={`writing-title-${article.slug}`}>{article.displayTitle || article.title}</h2><p id={`writing-deck-${article.slug}`} className="writing-deck">{article.subtitle}</p><div className="writing-story-meta"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time><DestinationCue className="writing-story-action" decorative>Read essay</DestinationCue></div></div>
      {layout !== 'note' && <div className="writing-art" data-treatment={artwork.treatment}><AnimatedArtwork artwork={artwork} size={layout === 'compact' ? 120 : 480} paused={paused} eager={index === 0} embedded decorative transitionName={artworkTransitionName(artwork)} /></div>}
    </a>
  }

  return <section className="writing-page">
    <header className="writing-header">
      <div className="writing-heading-copy"><h1 className="writing-heading">Writing<span className="period">.</span></h1><p className="writing-introduction">{siteCopy.writing.introduction}</p></div>
      <div className="writing-tools"><details className="writing-discovery" open={toolsOpen} onToggle={event => setToolsOpen(event.currentTarget.open)} onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing && toolsOpen) { event.preventDefault(); setToolsOpen(false); discoveryToggle.current?.focus({ preventScroll: true }) } }}>
      <summary ref={discoveryToggle}>Find an essay<span aria-hidden="true">{toolsOpen ? '−' : '+'}</span></summary>
      <div className="writing-toolbar">
        <label className="writing-search"><span className="sr-only">Search writing</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input ref={searchInput} type="search" value={query} onChange={event => updateFilters({ ...filters, query: event.target.value })} placeholder="Search writing" /></label>
        <div className="writing-search-options"><label className="writing-topic"><span className="sr-only">Filter writing by topic</span><select value={category} onChange={event => updateFilters({ ...filters, category: event.target.value })}>{categories.map(value => <option key={value} value={value}>{topicLabel(value)}</option>)}</select><span aria-hidden="true">⌄</span></label></div>
        {(query.trim() || category !== 'All') && <div className="writing-filter-status"><span>{visible.length} {visible.length === 1 ? 'essay' : 'essays'}</span><button type="button" onClick={clearFilters}>Clear filters</button></div>}
      </div></details></div>
    </header>
    {!searching && <ReadingPaths interactive />}
    {searching ? <div className="writing-gallery writing-results">{visible.map((article, index) => story(article, 'compact', index))}</div> : <>
      <div className="writing-gallery writing-selected">{selection.selected.map((article, index) => story(article, index === 0 ? 'lead' : index === 3 || index === 4 ? 'report' : 'selected', index))}</div>
      {selection.more.length > 0 && <section className="writing-secondary" aria-labelledby="writing-more"><h2 id="writing-more">Further reading</h2><div className="writing-gallery">{selection.more.map((article, index) => story(article, 'compact', index + 7))}</div></section>}
      {selection.notes.length > 0 && <section className="writing-secondary writing-notes" aria-labelledby="writing-notes"><h2 id="writing-notes">Notes</h2><div className="writing-gallery">{selection.notes.map((article, index) => story(article, 'note', index + 16))}</div></section>}
    </>}
    {!visible.length && <div className="writing-empty"><h2>No matches.</h2><p>{query.trim() ? <>No essays match “{query.trim()}”{category !== 'All' ? ` in ${topicLabel(category)}` : ''}.</> : <>No essays in {topicLabel(category)}.</>} Try fewer words or choose another topic.</p><button type="button" onClick={clearFilters}>{siteCopy.writing.reset}</button></div>}
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? 'article' : 'articles'}</p>
  </section>
}
