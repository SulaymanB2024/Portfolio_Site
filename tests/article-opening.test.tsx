import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import ArticleOpening from '../src/personal/editorial/ArticleOpening'
import { PublicArticle } from '../tools/public-article'
import { relatedArticles } from '../src/personal/editorial/library'
import catalog from '../src/personal/editorial/data/catalog.json'
import type { WritingArticle } from '../src/personal/editorial/types'
import ArticleTitle from '../src/personal/editorial/ArticleTitle'
import ArticleStudyFigure, { articleStudyKind } from '../src/personal/editorial/ArticleStudyFigure'
import { articlePresentation, articlePresentations } from '../src/personal/editorial/article-presentation'
import ReaderNavigation from '../src/personal/editorial/ReaderNavigation'
import { sectionHref } from '../src/personal/editorial/library'
import { inlineText, markdownToReact } from '../src/personal/editorial/Markdown'
import ResearchFigure from '../src/personal/editorial/ResearchFigure'

const load = (slug: string): WritingArticle => JSON.parse(readFileSync(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))

test('all published research figures retain their qualification and original source link', () => {
  let count = 0
  for (const entry of catalog) {
    for (const section of load(entry.slug).sections || []) {
      for (const figure of section.figures || []) {
        const html = renderToStaticMarkup(<ResearchFigure figure={figure} />)
        assert(html.includes(`href="${figure.src}"`), figure.src)
        assert(html.includes(renderToStaticMarkup(<span>{inlineText(figure.caption)}</span>).slice(6, -7)), figure.src)
        count++
      }
    }
  }
  assert.equal(count, 39)
})

test('an integrated opening omits its duplicate short answer and retains distinct qualifications', () => {
  const article = load('the-first-ai-managers')
  article.pageContent!.callouts!.push({ label: 'Evidence note', title: 'Separate qualification', markdown: 'Retain this qualification.' })
  const html = renderToStaticMarkup(<ArticleOpening article={article} />)
  assert(!html.includes('Short answer'))
  assert(!html.includes('reader-thesis'))
  assert(html.includes('Separate qualification'))
  assert(html.includes('Operator dashboards are unaudited. Simulations are not businesses.'))
  assert(html.includes('cases reviewed'))
})

test('published openings keep the lede and evidence without adding a second thesis', () => {
  for (const entry of catalog) {
    const article = load(entry.slug)
    if (!(article.ledeMarkdown || article.lede || article.content?.length)) continue
    const html = renderToStaticMarkup(<ArticleOpening article={article} />)
    assert(!html.includes('reader-thesis'), entry.slug)
    const scope = article.pageContent?.boundary?.text || article.evidenceBoundary
    if (scope) assert(html.includes(renderToStaticMarkup(<span>{inlineText(scope)}</span>).slice(6, -7)), entry.slug)
  }
  const fallback = { ...load('jane-street-exact-search-solver-verification'), content: undefined, lede: undefined, ledeMarkdown: undefined }
  assert(renderToStaticMarkup(<ArticleOpening article={fallback} />).includes('reader-thesis'))
})

test('contents starts collapsed and keeps native deep links without a scrolling tracker', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const sections = article.sections!.map(({ id, title }) => ({ id, title }))
  const route = `#/writing/${article.slug}?from=%23%2Fwriting%3Fat%3D${article.slug}`
  const html = renderToStaticMarkup(<ReaderNavigation sections={sections} href={route} />)
  assert(html.includes('<details class="reader-index">'))
  assert(!html.includes(' open'))
  assert(!html.includes('reader-progress'))
  assert(!html.includes('chapter-position'))
  for (const section of sections) assert(html.includes(renderToStaticMarkup(<a href={sectionHref(route, section.id)} />).match(/href="([^"]+)"/)![1]))
  assert.equal(renderToStaticMarkup(<ReaderNavigation sections={[]} href={route} />), '')
})

test('text equations and workflows retain their terms in readable native exhibits', () => {
  const tolls = load('who-owns-texas-toll-roads')
  const tollHtml = renderToStaticMarkup(<>{markdownToReact(tolls.markdown!)}</>)
  assert(tollHtml.includes('Gross toll revenue = traffic volume × average toll paid'))
  assert(!tollHtml.includes('\\text{Gross toll revenue}'))
  const viral = load('viralbench-codex-agent-harness')
  const html = renderToStaticMarkup(<>{markdownToReact(viral.markdown!)}</>)
  assert(html.includes('class="reader-workflow"'))
  assert(html.includes('class="reader-lineage"'))
  for (const label of ['Delayed TikTok metrics', 'generated image hash', 'image model and version', 'reference source image hash', 'originality / duplication checks']) assert(html.includes(label))
  const unknown = renderToStaticMarkup(<>{markdownToReact('```text\n\\text{X} \\times \\unknown{Y}\n```')}</>)
  assert(unknown.includes('\\unknown{Y}'))
  assert(unknown.includes('<pre>'))
})

test('the generated ViralBench manuscript states its proposed status without a runtime-only summary', () => {
  const article = load('viralbench-codex-agent-harness')
  const html = renderToStaticMarkup(<PublicArticle article={article} />)
  assert(html.includes('has not established a deployed harness or measured performance gains'))
  assert(html.includes('Codex can diagnose and patch the harness. It cannot grade or deploy its own work.'))
  assert(!html.includes('Short answer'))
  assert(!html.includes('Project status / July 2026'))
  assert(html.includes('2026-10-05'))
  assert(html.includes('2026-07-09'))
})

test('initial documents expose the same curated next-reading links as the interactive reader', () => {
  for (const slug of ['the-ai-megawatt', 'who-owns-texas-toll-roads', 'atlas-building-an-evidence-console']) {
    const article = load(slug), html = renderToStaticMarkup(<PublicArticle article={article} />)
    assert(html.includes('aria-label="More articles"'))
    for (const next of relatedArticles(article, catalog)) assert(html.includes(`href="${next.path}"`))
  }
})

test('every published cover preserves its authored heading and changed titles fall back safely', () => {
  assert.deepEqual(Object.keys(articlePresentations).sort(), catalog.map(article => article.slug).sort())
  for (const article of catalog) {
    const html = renderToStaticMarkup(<h1><ArticleTitle article={article} /></h1>)
    const plain = renderToStaticMarkup(<h1>{article.displayTitle || article.title}</h1>)
    assert.equal(html.replace(/<span class="article-title-line">|<\/span>/g, ''), plain)
    const changed = { ...article, title: 'A revised heading', displayTitle: undefined }
    assert.equal(renderToStaticMarkup(<h1><ArticleTitle article={changed} /></h1>), '<h1>A revised heading</h1>')
    assert.equal(articlePresentation(changed).form, articlePresentation(article).form)
  }
})

test('technical opening facts remain available inside the existing scope disclosure', () => {
  const article = load('raw-html-rendered-dom-evidence')
  const html = renderToStaticMarkup(<ArticleOpening article={article} />)
  assert.equal((html.match(/class="reader-metrics"/g) || []).length, 1)
  assert(html.indexOf('class="reader-metrics"') > html.indexOf('<details'))
  for (const metric of article.metrics || []) assert(html.includes(metric.value))
  assert(html.includes(article.evidenceBoundary!))
})

test('cohort marks and classification totals use the actual published rows', () => {
  const article = load('software-buyout-boom-2020-2022-exit-audit')
  const section = article.sections!.find(section => section.id === 'deal-by-deal-control-inventory')!
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  assert.equal((html.match(/class="study-cohort-member /g) || []).length, section.table!.rows.length)
  assert(html.includes('<strong>23</strong>continuing sponsor ownership'))
  assert(html.includes('August 17, 2026'))
  assert(html.includes('r="8.5" fill="currentColor"'))
  assert(html.includes('r="8.5" fill="none"'))
  assert(html.includes('width="17" height="17" fill="none"'))
  section.table!.rows = [['Changed firm', '2021', '0', 'Changed investor', 'New classification', 'Unknown', 'Test record']]
  const changed = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  assert(changed.includes('<strong>1</strong>New classification'))
  assert(changed.includes('Changed firm'))
  assert(!changed.includes('RealPage'))
})

test('the ownership diagram uses published relationships and does not invent stake sizes', () => {
  const article = load('who-owns-austin-home-service-companies')
  const section = article.sections!.find(section => section.id === 'ownership-map')!
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  for (const row of section.table!.rows.filter(row => row[1] === 'Southern Home Services')) {
    assert(html.includes(renderToStaticMarkup(<strong>{row[0]}</strong>).replace(/<\/?strong>/g, '')))
    assert(html.includes(row[2]))
  }
  assert(!html.includes('%'))
  assert(html.includes('Brand counts do not measure market share'))
  section.table!.rows = section.table!.rows.filter(row => row[1] !== 'Southern Home Services')
  assert.equal(renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />), '')
})

test('the search schedule plots retained move coordinates and keeps the last tower separate', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const section = article.sections!.find(section => section.id === 'result')!
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  const wide = html.match(/class="study-schedule-wide">(.*?)<\/div>/)![1]
  for (const row of section.table!.rows) {
    assert(html.includes(`Move ${row[0]}: recorded score ${row[1]}`))
    assert(wide.includes(`cx="${20 + Number(row[0]) / 54 * 692}"`))
  }
  assert(html.includes('Every 3 moves'))
  assert(html.includes('Every 7 moves'))
  assert(html.includes('54 · Last tower'))
  assert.equal((wide.match(/data-move=/g) || []).length, section.table!.rows.length)
  assert.equal((wide.match(/data-finish="54"/g) || []).length, 1)
  assert(!html.includes('Move 54: recorded score'))
  assert(html.includes('neighbor-sum answer is a separate calculation'))
})

test('phone rulers retain each interval and identify their shared boundary', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const section = article.sections!.find(section => section.id === 'result')!
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  const narrow = html.match(/class="study-schedule-narrow">(.*?)<\/div>/)![1]
  const rulers = narrow.match(/<svg.*?<\/svg>/g)!
  assert.equal(rulers.length, 2)
  for (const row of section.table!.rows) {
    const move = Number(row[0])
    if (move <= 18) assert(rulers[0].includes(`cx="${20 + move / 18 * 272}"`))
    if (move >= 18) assert(rulers[1].includes(`cx="${20 + (move - 18) / 36 * 272}"`))
  }
  assert(rulers[0].includes('data-move="18"'))
  assert(rulers[1].includes('data-move="18"'))
  assert(!rulers[0].includes('data-finish='))
  assert(rulers[1].includes('data-finish="54"'))
})

test('recording intervals are derived from the manuscript, not decorative defaults', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const section = article.sections!.find(section => section.id === 'result')!
  section.table!.rows = [['0', '0'], ['2', '1'], ['4', '16'], ['9', '23'], ['14', '528']]
  article.metrics!.find(metric => metric.label === 'Path')!.value = '15 moves'
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  assert(html.includes('Every 2 moves'))
  assert(html.includes('Every 5 moves'))
  assert(!html.includes('Every 3 moves'))
  assert(!html.includes('Every 7 moves'))
  assert(html.includes('15 · Last tower'))
  assert(!html.includes('54 · Last tower'))
  article.metrics!.find(metric => metric.label === 'Path')!.value = 'Unknown'
  assert.equal(renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />), '')
})

test('the search diagram separates arithmetic from geometry and preserves stage identities', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const section = article.sections!.find(section => section.id === 'arithmetic-before-geometry')!
  const html = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
  assert(html.includes('>Arithmetic</span>'))
  assert(html.includes('>Geometry</span>'))
  assert.equal((html.match(/class="study-search-group"/g) || []).length, 2)
  for (const row of section.table!.rows) assert(html.includes(`aria-label="${row[0]}"`))
  assert(html.indexOf('>Schedules</strong>') < html.indexOf('>Score states</strong>'))
  assert(html.indexOf('>Score states</strong>') < html.indexOf('>Segments</strong>'))
  assert(html.indexOf('>Segments</strong>') < html.indexOf('>One route</strong>'))
})

test('code exhibits preserve their exact contents without adding a competing section heading', () => {
  const article = load('jane-street-exact-search-solver-verification')
  const example = article.sections!.flatMap(section => section.codeExamples || [])[0]
  const html = renderToStaticMarkup(<PublicArticle article={article} />)
  assert(html.includes(`<figcaption>${example.title}</figcaption>`))
  assert(!html.includes(`<h3>${example.title}</h3>`))
  assert(html.includes(renderToStaticMarkup(<code className={`language-${example.language}`}>{example.code}</code>)))
})

test('every study is attached to a real section and appears in the initial document', () => {
  let studies = 0
  for (const summary of catalog) {
    const article = load(summary.slug)
    const html = renderToStaticMarkup(<PublicArticle article={article} />)
    const sections = [...(article.sections || []), ...(article.markdownSections || [])]
    const placed = sections.filter(section => articleStudyKind(article.slug, section.id))
    assert.equal((html.match(/class="article-study article-study-/g) || []).length, placed.length)
    for (const section of placed) {
      const figure = renderToStaticMarkup(<ArticleStudyFigure article={article} section={section} />)
      assert(figure.length > 0)
      assert(html.includes(figure))
      assert.equal(articleStudyKind(article.slug, 'not-a-section'), undefined)
    }
    studies += placed.length
  }
  // Main restored five manuscripts with their own studies alongside the twelve
  // already published when this presentation suite was introduced.
  assert.equal(studies, 17)
})
