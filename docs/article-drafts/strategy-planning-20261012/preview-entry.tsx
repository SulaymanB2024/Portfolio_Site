import React from 'react'
import { createRoot } from 'react-dom/client'
import { articles } from './schema-check'
import ArticleOpening from '../../../src/personal/editorial/ArticleOpening'
import ArticleTitle from '../../../src/personal/editorial/ArticleTitle'
// The task-only Vite plugin exposes this existing internal component without
// changing shared application source, catalogs or cover assignments.
// @ts-expect-error preview.mjs adds this export to the served module only.
import { DraftNativeSection } from '../../../src/personal/editorial/ArticlePage'
import '../../../src/personal/personal.css'
import '../../../src/personal/editorial/editorial.css'
import '../../../src/personal/editorial/article-design.css'
import '../../../src/personal/editorial/reader-craft.css'
import '../../../src/personal/editorial/restored-articles.css'
import '../../../src/personal/editorial/article-refinement.css'
import '../../../src/personal/editorial/article-distinction.css'
import '../../../src/personal/editorial/article-evidence.css'

function Preview() {
  const requested = new URLSearchParams(window.location.search).get('article')
  const article = articles.find(item => item.slug === requested) || articles[0]
  React.useEffect(() => { document.title = article.title }, [article.title])
  const [appearance, setAppearance] = React.useState('light')
  return <div className="personal-site" data-section="writing" data-appearance={appearance} style={{ minHeight: '100vh', padding: '20px clamp(20px, 5vw, 80px)' }}>
    <aside style={{ display: 'flex', gap: 20, justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--line)', font: '12px/1.6 monospace' }}>
      <span>Local manuscript preview · native body components · cover assignment awaits integration</span>
      <button onClick={() => setAppearance(appearance === 'light' ? 'dark' : 'light')}>Change theme</button>
    </aside>
    <nav aria-label="Draft articles" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', paddingTop: 20, font: '14px/1.6 Georgia, serif' }}>
      {articles.map(item => <a key={item.slug} href={`/?article=${item.slug}`} aria-current={item.slug === article.slug ? 'page' : undefined}>{item.displayTitle}</a>)}
    </nav>
    <article className="article-page" data-story={article.slug} data-form="essay" style={{ maxWidth: 1040, margin: '40px auto' }}>
      <header className="reader-heading"><p className="eyebrow">{article.category}</p><h1><ArticleTitle article={article} /></h1><p className="reader-subtitle">{article.subtitle}</p><p className="reader-byline">Sulayman Bowles · {new Date(article.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })} · {article.readTime.toLowerCase()} read</p></header>
      <div className="reader-prose" style={{ maxWidth: 820, marginTop: 48 }}>
        <ArticleOpening article={article} />
        {article.markdownSections?.map(section => <DraftNativeSection key={section.id} section={section} tables={article.tables} slug={article.slug} article={article} />)}
        <section className="reader-section" id="sources"><h2>Sources</h2><ol>{article.sources?.map(source => <li id={`source-${source.id}`} key={source.id}><a href={source.href}>{source.label}</a><p>{source.publisher} · Verified {source.lastVerified}</p><p>{source.note}</p></li>)}</ol></section>
      </div>
    </article>
  </div>
}

// Reuse the task preview's root when JSON edits trigger module replacement.
const previewRoot = import.meta.hot?.data.previewRoot || createRoot(document.getElementById('root')!)
if (import.meta.hot) import.meta.hot.data.previewRoot = previewRoot
previewRoot.render(<Preview />)
