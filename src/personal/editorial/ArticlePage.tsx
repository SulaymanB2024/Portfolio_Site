import { topicLabel } from './topic-label'
import { isValidElement, lazy, Suspense, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import catalog from './data/catalog.json'
import { inlineText, markdownToReact } from './Markdown'
import { AuthorNote } from '../PersonalProfile'
import { DestinationLink } from '../DestinationLink'
import { articleHref } from './links'
import ArtCube from './ArtCube'
import AtlasFigure from './AtlasFigure'
import ProductEvidence from '../projects/ProductEvidence'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { articleReturnHref, articleSection, relatedArticles, sectionHref } from './library'
import { jumpToArticleSection as jumpTo } from './reader-jump'
import { hasArticleFigures, loadArticleFigures, preparedArticleFigures } from './article-arrival'
import ReaderNavigation from './ReaderNavigation'
import CitationPreview from './CitationPreview'
import ResearchFigure from './ResearchFigure'
import RestoredArticleBody from './RestoredArticleBody'
import { articleDownloads, sourceAnchor } from './article-content'
import ArticleOpening, { ArticleMetrics, OpeningNotes } from './ArticleOpening'
import { StoryLink } from './StoryLink'
import ReaderGuide from './ReaderGuide'
import SourceAccessNotes, { sourceAccessNotes } from './SourceAccessNotes'
import { displayDate, type ArticleCase, type ArticleSection, type ArticleSummary, type ArticleTable, type WritingArticle } from './types'
import './article-design.css'
import './reader-craft.css'
import './restored-articles.css'
import './article-refinement.css'
import './article-distinction.css'
import './article-evidence.css'
import ArticleTitle from './ArticleTitle'
import ArticleStudyFigure from './ArticleStudyFigure'
import { articlePresentation } from './article-presentation'
import { cachedArticle, prepareArticle } from './article-cache'
import { siteCopy, withWritingCopy } from '../site-copy'

const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const ArticleFigures = lazy(() => loadArticleFigures().then(module => ({ default: module.ArticleFigures })))
const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function Figures({ slug, id, position }: { slug: string; id: string; position: 'before' | 'after' }) {
  if (slug === 'atlas-building-an-evidence-console' && id === 'product' && position === 'after') return <ProductEvidence kind="atlas" />
  if (slug === 'atlas-building-an-evidence-console' && id === 'lede' && position === 'after') return <AtlasFigure />
  if (!hasArticleFigures(slug)) return null
  const PreparedFigures = preparedArticleFigures()
  if (PreparedFigures) return <PreparedFigures slug={slug} sectionId={id} position={position} />
  return <Suspense fallback={null}><ArticleFigures slug={slug} sectionId={id} position={position} /></Suspense>
}

type StoryImageData = NonNullable<NonNullable<WritingArticle['pageContent']>['hero']>['image']

function StoryImage({ image, slug }: { image: NonNullable<StoryImageData>; slug: string }) {
  return <figure className="reader-hero-image"><img src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`} alt={image.alt} width={slug === 'viralbench-codex-agent-harness' ? 1672 : 1200} height={slug === 'viralbench-codex-agent-harness' ? 941 : 630} decoding="async" loading="lazy" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>
}

function markdownBody(markdown: string, slug: string, image?: StoryImageData, article?: WritingArticle) {
  const blocks = markdownToReact(markdown.replace(/^# .+\n+/, ''))
  if (slug !== 'viralbench-codex-agent-harness') return blocks
  const result: ReactNode[] = []
  let current = ''
  let harnessDiagramPlaced = false
  const harnessSection = 'what-i-mean-by-codex-as-a-harness'
  blocks.forEach((block, index) => {
    if (isValidElement<{ id: string }>(block) && block.type === 'h2') {
      if (!current) {
        if (article) result.push(<OpeningNotes key="opening-notes" article={article} boundary />)
        if (image) result.push(<StoryImage key="story-image" image={image} slug={slug} />)
      }
      if (current && !(current === harnessSection && harnessDiagramPlaced)) result.push(<Figures key={`after-${index}`} slug={slug} id={current} position="after" />)
      current = block.props.id
      result.push(block, <Figures key={`before-${index}`} slug={slug} id={current} position="before" />)
    } else {
      const code = isValidElement<{ children: ReactNode }>(block) && block.type === 'pre' ? block.props.children : null
      const text = isValidElement<{ children: ReactNode }>(code) ? code.props.children : null
      if (!harnessDiagramPlaced && current === harnessSection && typeof text === 'string' && text.includes('LIVE ENVIRONMENT') && text.includes('ViralBench agent') && text.includes('Codex worktree')) {
        result.push(<Figures key="harness-diagram" slug={slug} id={current} position="after" />, <details key="harness-text-diagram" className="reader-disclosure reader-diagram-source"><summary><span>Text version of the proposed workflow</span><span aria-hidden="true">+</span></summary>{block}</details>)
        harnessDiagramPlaced = true
      } else result.push(block)
    }
  })
  if (current && !(current === harnessSection && harnessDiagramPlaced)) result.push(<Figures key="final-figure" slug={slug} id={current} position="after" />)
  return result
}

function citationClick(event: MouseEvent<HTMLElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = event.target instanceof Element ? event.target.closest('a') : null
  const href = anchor?.getAttribute('href')
  if (!href?.startsWith('#') || anchor?.target || anchor?.hasAttribute('download')) return
  // Article links remain native, including opening a citation in another tab.
  // Intercept only a section in this reader, so selecting it again still scrolls.
  if (href.startsWith('#/') && href.split('?')[0] !== location.hash.split('?')[0]) return
  const id = articleSection(href)
  if (!id) return
  event.preventDefault()
  history.replaceState(history.state, '', `${location.pathname}${location.search}${sectionHref(location.hash, id)}`)
  requestAnimationFrame(() => jumpTo(id))
}

function ArticleUtilities() {
  const [copy, setCopy] = useState('Copy link')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    let restore: [HTMLDetailsElement, boolean][] = []
    const after = () => { restore.forEach(([element, open]) => { element.open = open }); restore = [] }
    const before = () => {
      after()
      restore = [...document.querySelectorAll<HTMLDetailsElement>('.article-page .reader-disclosure')].map(element => [element, element.open])
      restore.forEach(([element]) => { element.open = true })
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => { after(); window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after) }
  }, [])
  async function copyLink() {
    try { await navigator.clipboard.writeText(location.href); setCopy('Copied') }
    catch { setCopy('Copy from address bar') }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopy('Copy link'), 2000)
  }
  return <div className="article-utilities" role="group" aria-label="Article utilities"><a className="reader-start-link" href={sectionHref(location.hash, 'reader-start')}>Start reading <span aria-hidden="true">↓</span></a><button onClick={copyLink}>{copy}</button><button onClick={() => window.print()}>Print / PDF</button><span className="sr-only" role="status">{copy === 'Copied' ? 'Article link copied.' : copy === 'Copy from address bar' ? 'Copy the article link from the address bar.' : ''}</span></div>
}

function Table({ table }: { table: ArticleTable }) {
  return <figure className="reader-table" id={table.id}>{(table.caption || table.title) && <figcaption>{table.caption || table.title}</figcaption>}<div className="article-table-wrap" role="region" aria-label={table.caption || table.title || 'Data table'} tabIndex={0}><table><thead><tr>{table.columns.map((column, index) => <th key={index} scope="col">{inlineText(column, `column-${index}`)}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineText(cell, `${index}-${cellIndex}`)}</td>)}</tr>)}</tbody></table></div>{table.note && <p className="reader-table-note">{inlineText(table.note)}</p>}</figure>
}

function Section({ section, tables = [], slug, article }: { section: ArticleSection; tables?: ArticleTable[]; slug: string; article?: WritingArticle }) {
  return <section id={section.id} className="reader-section"><h2>{section.title}</h2><Figures slug={slug} id={section.id} position="before" />{section.markdown && markdownToReact(section.markdown)}{section.blocks?.map((block, index) => block.kind === 'markdown' ? <div key={index}>{markdownToReact(block.markdown)}</div> : <Table key={index} table={tables.find(table => table.id === block.tableId)!} />)}{section.paragraphs?.map((paragraph, index) => <p key={index}>{inlineText(paragraph, `paragraph-${index}`)}</p>)}{section.bullets?.length ? <ul>{section.bullets.map((bullet, index) => <li key={index}>{inlineText(bullet, `bullet-${index}`)}</li>)}</ul> : null}{article?.metricSection === section.id && <ArticleMetrics article={article} />}{article && <ArticleStudyFigure article={article} section={section} />}{section.figuresPosition === 'before-table' && section.figures?.map(figure => <ResearchFigure key={figure.src} figure={figure} />)}{section.table && !(slug === 'atlas-building-an-evidence-console' && section.id === 'source-and-render') && <Table table={section.table} />}{section.figuresPosition !== 'before-table' && section.figures?.map(figure => <ResearchFigure key={figure.src} figure={figure} />)}{section.codeExamples?.map(example => <figure className="reader-code" key={example.title}><figcaption>{example.title}</figcaption><p>{inlineText(example.description)}</p><pre><code className={`language-${example.language}`}>{example.code}</code></pre></figure>)}<Figures slug={slug} id={section.id} position="after" /></section>
}

function Cases({ cases, filters }: { cases: ArticleCase[]; filters?: { value: string; label: string }[] }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [grade, setGrade] = useState('all')
  const categories = filters || [{ value: 'all', label: 'All' }, { value: 'live', label: 'Live operations' }, { value: 'bounded', label: 'Bounded pilots' }, { value: 'narrow', label: 'Production agents' }, { value: 'simulation', label: 'Simulations' }, { value: 'excluded', label: 'Comparators' }]
  const visible = cases.filter(item => (filter === 'all' || item.kind === filter) && (grade === 'all' || item.grade === grade) && Object.values(item).join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  const fields: [keyof ArticleCase, string][] = [['form', 'Business'], ['geography', 'Location'], ['authority', 'AI authority'], ['humanLayer', 'Human role'], ['economics', 'Economics'], ['caveat', 'Evidence limits']]
  return <section id="case-inventory" className="reader-section">
    <h2>Case inventory</h2>
    <div className="case-toolbar">
      <label className="case-query"><span className="sr-only">Search AI business cases</span><input className="case-search" type="search" placeholder="Search cases" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <label className="writing-category"><span className="sr-only">Evidence grade</span><select value={grade} onChange={event => setGrade(event.target.value)}><option value="all">All evidence grades</option>{[...new Set(cases.map(item => item.grade))].map(value => <option key={value} value={value}>{value === 'Excluded' ? 'Comparators' : `Grade ${value}`}</option>)}</select></label>
    </div>
    <div className="case-filters" role="group" aria-label="Filter AI business cases">{categories.map(({ value, label }) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    <p className="case-count mono" role="status">{visible.length} of {cases.length} {cases.length === 1 ? 'case' : 'cases'}</p>
    <p className="case-print-summary">Complete inventory: {cases.length} {cases.length === 1 ? 'case' : 'cases'}.</p>
    {!visible.length && <button className="text-button case-clear" onClick={() => { setFilter('all'); setGrade('all'); setQuery('') }}>Clear filters</button>}
    {/* Keep evidence mounted so beforeprint can expand the complete inventory.
        Screen filtering uses native hidden semantics and survives afterprint. */}
    <div className="case-list">{cases.map(item => <details key={item.name} className="reader-disclosure" hidden={!visible.includes(item)} open={item === visible[0] && filter !== 'all'}>
      <summary><span>{item.name}</span><span className="mono">{item.grade === 'Excluded' ? 'Comparator' : `Grade ${item.grade}`}</span><span aria-hidden="true">+</span></summary>
      <dl>{fields.map(([field, label]) => <div key={field}><dt>{label}</dt><dd>{inlineText(item[field] || '')}</dd></div>)}</dl>
      <a href={item.href} target="_blank" rel="noreferrer">Source ↗</a>
    </details>)}</div>
  </section>
}

export default function ArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<WritingArticle | null>(() => cachedArticle(slug))
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let cancelled = false
    const cached = cachedArticle(slug)
    setArticle(cached); setError(false)
    if (cached) return
    prepareArticle(slug).then(value => { if (!cancelled) setArticle(value) }).catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [slug, attempt])
  useEffect(() => {
    if (!article) return
    let frame = 0
    const navigate = () => {
      cancelAnimationFrame(frame)
      const target = articleSection(location.hash, location.pathname)
      // A section URL should open at its destination, without panning through
      // an entire long manuscript. Clicks within this reader keep their motion.
      if (target) frame = requestAnimationFrame(() => jumpTo(target, 'instant'))
    }
    navigate()
    window.addEventListener('hashchange', navigate)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', navigate) }
  }, [article])
  const body = useMemo(() => article?.htmlBody ? <><OpeningNotes article={article} boundary /><RestoredArticleBody html={article.htmlBody} baseUrl={import.meta.env.BASE_URL} /></> : article?.markdown && !article.markdownSections ? markdownBody(article.markdown, article.slug, article.pageContent?.hero?.image, article) : null, [article])
  const downloads = useMemo(() => article ? articleDownloads(article) : [], [article])
  const headings = useMemo(() => {
    if (!article) return []
    const items = article.outline ? [...article.outline] : article.markdown && !article.markdownSections
      ? [...article.markdown.matchAll(/^## (.+)$/gm)].map(match => ({ title: match[1], id: sectionId(match[1]) }))
      : [...(article.sections || []), ...(article.markdownSections || [])].map(section => ({ id: section.id, title: section.title }))
    if (article.conclusion) items.push({ id: 'conclusion', title: article.conclusion.title })
    if (article.cases?.length) items.push({ id: 'case-inventory', title: 'Case inventory' })
    if (article.factGaps?.length) items.push({ id: 'fact-gaps', title: 'What remains unknown' })
    if (article.openQuestions?.length) items.push({ id: 'open-questions', title: 'Open questions' })
    if (article.assumptions?.length) items.push({ id: 'reader-assumptions', title: 'Assumptions' })
    if (article.valuationFrame) items.push({ id: 'reader-valuation', title: 'Valuation' })
    if (article.risks) items.push({ id: 'reader-risks', title: 'Risks' })
    if (article.faqs?.length) items.push({ id: 'questions', title: 'Questions' })
    if (sourceAccessNotes(article.slug).length) items.push({ id: 'source-access-notes', title: 'Source access notes' })
    if (article.sources?.length && !article.htmlBody && (!article.markdown || article.markdownSections)) items.push({ id: 'sources', title: 'Sources' })
    if (downloads.length && !article.htmlBody) items.push({ id: 'reader-downloads', title: 'Supporting material' })
    return items
  }, [article, downloads])
  if (error) return <section className="reader-loading"><p>{siteCopy.reader.error}</p><button className="text-button" onClick={() => setAttempt(attempt + 1)}>{siteCopy.reader.retry}</button><a href="#/writing">{siteCopy.reader.back} →</a></section>
  if (!article) return <p className="reader-loading mono" role="status">{siteCopy.reader.loading}</p>
  const copy = withWritingCopy(article)
  const presentation = articlePresentation(article)
  const artwork = getArticleGenerativeArtwork(article.path)
  const heroImage = article.pageContent?.hero?.image
  const backHref = articleReturnHref(location.hash, articles)
  return <article className="article-page" data-story={article.slug} data-form={presentation.form} onClick={citationClick}>
    <DestinationLink className="project-back mono" href={backHref} direction="left">{siteCopy.reader.back}</DestinationLink>
    <header className="article-cover"><div className="reader-heading"><p className="eyebrow">{topicLabel(article.category)}</p><h1><ArticleTitle article={article} /></h1><p className="reader-subtitle">{copy.subtitle}</p><div className="reader-signature"><a className="reader-author" href="/about" rel="author">Sulayman Bowles</a><div className="reader-byline"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time>{article.dateModified && article.dateModified !== article.date && <span>Updated {displayDate(article.dateModified)}</span>}</div></div><ArticleUtilities /></div><ArtCube key={article.slug} artwork={artwork} /></header>
    <div className="reader-layout" id="reader-start"><ReaderNavigation key={article.slug} sections={headings} href={location.hash} /><div className="reader-prose">
      <ReaderGuide slug={article.slug} hash={location.hash} />
      {body || <><ArticleOpening article={article}><Figures slug={article.slug} id="lede" position="after" /></ArticleOpening>{heroImage && <StoryImage image={heroImage} slug={article.slug} />}{article.sections?.map(section => <Section key={section.id} section={section} slug={article.slug} article={article} />)}{article.markdownSections?.map(section => <Section key={section.id} section={section} tables={article.tables} slug={article.slug} article={article} />)}</>}
      {article.conclusion && <Section section={{ id: 'conclusion', title: article.conclusion.title, paragraphs: [article.conclusion.content] }} slug={article.slug} />}
      {article.cases?.length ? <Cases cases={article.cases} filters={article.pageContent?.caseFilters} /> : null}
      {article.factGaps?.length ? <section id="fact-gaps" className="reader-section"><h2>What remains unknown</h2>{article.factGaps.map(gap => <div key={gap.title}><h3>{gap.title}</h3><ul>{gap.items.map((item, index) => <li key={index}>{inlineText(item)}</li>)}</ul></div>)}</section> : null}
      {article.openQuestions?.length ? <section id="open-questions" className="reader-section"><h2>Open questions</h2><ul>{article.openQuestions.map((question, index) => <li key={index}>{inlineText(question)}</li>)}</ul></section> : null}
      {article.assumptions?.length ? <section id="reader-assumptions" className="reader-section"><h2>Assumptions</h2><ul>{article.assumptions.map((assumption, index) => <li key={index}>{inlineText(assumption)}</li>)}</ul></section> : null}
      {article.valuationFrame && <section id="reader-valuation" className="reader-section"><h2>Valuation</h2><p>{inlineText(article.valuationFrame)}</p></section>}
      {article.risks && <section id="reader-risks" className="reader-section"><h2>Risks</h2><p>{inlineText(article.risks)}</p></section>}
      {article.recommendationBoundary && <p className="reader-evidence">{inlineText(article.recommendationBoundary)}</p>}
      {article.faqs?.length ? <section id="questions" className="reader-section"><h2>Questions</h2>{article.faqs.map(faq => <details className="reader-disclosure reader-faq" key={faq.question}><summary><span>{faq.question}</span><span aria-hidden="true">+</span></summary>{markdownToReact(faq.answer)}</details>)}</section> : null}
      {article.sources?.length && !article.htmlBody && (!article.markdown || article.markdownSections) ? <section id="sources" className="reader-section reader-sources"><h2>Sources</h2><ol>{article.sources.map((source, index) => <li id={sourceAnchor(source, index)} key={`${source.id}-${index}`}>{!source.id && <span id={`source-${index + 1}`} />}{(source.href ? [source.href] : source.hrefs || []).map((href, hrefIndex) => <a className="source-link" key={href} href={articleHref(href, articles, import.meta.env.BASE_URL)} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{hrefIndex === 0 ? source.label : `Additional source ${hrefIndex + 1}`}<span aria-hidden="true"> ↗</span></a>)}{(source.publisher || source.date || source.type) && <span className="source-publisher">{[source.publisher, source.date, source.type].filter(Boolean).join(" · ")}</span>}{source.lastVerified && <span className="source-publisher">Verified {displayDate(source.lastVerified)}</span>}{source.note && <p>{source.note}</p>}{source.limitation && <p>{source.limitation}</p>}</li>)}</ol></section> : null}
      {downloads.length > 0 && !article.htmlBody && <section id="reader-downloads" className="reader-section reader-downloads"><h2>Supporting material</h2><ul>{downloads.map(asset => <li key={asset.href}><a href={articleHref(asset.href, articles, import.meta.env.BASE_URL)}>{asset.label} ↗</a>{'description' in asset && asset.description && <span className="reader-resource-description">{asset.description}</span>}</li>)}</ul></section>}
      {article.pageContent?.endnotes?.map((note, index) => <footer className="reader-endnote" key={index}>{markdownToReact(note.markdown)}<nav aria-label="Related reading">{note.links.map(link => <a key={link.href} href={articleHref(link.href, articles, import.meta.env.BASE_URL)}>{link.label} ↗</a>)}</nav></footer>)}
      <SourceAccessNotes slug={article.slug} />
      <AuthorNote />
    </div></div>
    <section className="reader-further"><div className="reader-further-heading"><h2>{siteCopy.reader.more}</h2><div className="reader-further-actions"><DestinationLink className="arrow-link" href={backHref} direction="left">{siteCopy.reader.back}</DestinationLink></div></div><nav aria-label="More articles">{relatedArticles(article, articles).map(item => <StoryLink key={item.slug} article={item} />)}</nav></section>
    <CitationPreview key={article.slug} />
  </article>
}
