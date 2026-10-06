import type { ReactNode } from 'react'
import { inlineText, markdownToReact } from './Markdown'
import type { WritingArticle } from './types'
import { articlePresentation } from './article-presentation'

export function ArticleMetrics({ article }: { article: WritingArticle }) {
  const metrics = article.pageContent?.metrics || article.metrics
  if (!metrics?.length) return null
  return <dl className="reader-metrics" data-form={articlePresentation(article).form}>{metrics.map(metric => <div key={metric.label}>
    <dt>{metric.label}</dt><dd>{metric.value}</dd>
    {metric.note && <dd className="reader-metric-note">{metric.note}</dd>}
  </div>)}</dl>
}

export function OpeningNotes({ article, boundary = false }: { article: WritingArticle; boundary?: boolean }) {
  const scope = article.pageContent?.boundary?.text || article.evidenceBoundary
  const notebook = articlePresentation(article).form === 'notebook' && boundary && !!scope
  const callouts = article.pageContent?.callouts?.filter(callout =>
    article.openingPresentation !== 'integrated' || callout.label.toLowerCase() !== 'short answer',
  )
  return <>
    {callouts?.map(callout => <aside className="reader-callout" key={callout.title}>
      <span className="eyebrow">{callout.label}</span><h2>{callout.title}</h2>{markdownToReact(callout.markdown)}
    </aside>)}
    {!article.metricSection && !notebook && <ArticleMetrics article={article} />}
    {boundary && scope && <details className="reader-disclosure reader-scope">
      <summary><span>{article.pageContent?.boundary?.label || 'Scope and assumptions'}</span><span aria-hidden="true">+</span></summary>
      <p>{inlineText(scope)}</p>
      {notebook && !article.metricSection && <ArticleMetrics article={article} />}
    </details>}
  </>
}

// Use the same opening in the interactive and static readers. Revised essays
// integrate the thesis into the lede rather than repeating it beneath the lede.
export default function ArticleOpening({ article, children }: { article: WritingArticle; children?: ReactNode }) {
  const hasLede = Boolean(article.ledeMarkdown || article.lede || article.content?.length)
  return <div className="reader-opening">
    <div className="article-lede">{article.ledeMarkdown || article.lede
      ? markdownToReact(article.ledeMarkdown || article.lede || '')
      : article.content?.map((paragraph, index) => <p key={index}>{inlineText(paragraph, `intro-${index}`)}</p>)}</div>
    {children}
    {!hasLede && article.thesis && <p className="reader-thesis">{inlineText(article.thesis)}</p>}
    <OpeningNotes article={article} boundary />
  </div>
}
