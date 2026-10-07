import { markdownToReact, inlineText } from '../src/personal/editorial/Markdown'
import { displayDate, type ArticleTable, type ArticleSection, type WritingArticle } from '../src/personal/editorial/types'
import { AuthorNote } from '../src/personal/PersonalProfile'
import ResearchFigure from '../src/personal/editorial/ResearchFigure'
import RestoredArticleBody from '../src/personal/editorial/RestoredArticleBody'
import { articleDownloads, sourceAnchor } from '../src/personal/editorial/article-content'
import ArticleOpening, { ArticleMetrics, OpeningNotes } from '../src/personal/editorial/ArticleOpening'
import { relatedArticles } from '../src/personal/editorial/library'
import catalog from '../src/personal/editorial/data/catalog.json'
import { siteCopy } from '../src/personal/site-copy'
import ArticleStudyFigure from '../src/personal/editorial/ArticleStudyFigure'
import ReaderGuide from '../src/personal/editorial/ReaderGuide'
import SourceAccessNotes from '../src/personal/editorial/SourceAccessNotes'

const paragraphs = (values: string[] = []) => values.map((value, index) => <p key={index}>{inlineText(value)}</p>)

function Table({ table }: { table: ArticleTable }) {
  return <figure id={table.id}>
    {(table.title || table.caption) && <figcaption>{table.caption || table.title}</figcaption>}
    <div style={{ overflowX: 'auto' }}><table>
      <thead><tr>{table.columns.map((column, index) => <th scope="col" key={index}>{inlineText(column)}</th>)}</tr></thead>
      <tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineText(String(cell))}</td>)}</tr>)}</tbody>
    </table></div>
    {table.note && <p>{inlineText(table.note)}</p>}
  </figure>
}

function Section({ section, tables = [], article }: { section: ArticleSection; tables?: ArticleTable[]; article?: WritingArticle }) {
  return <section id={section.id}>
    <h2>{section.title}</h2>
    {section.markdown && markdownToReact(section.markdown)}
    {section.blocks?.map((block, index) => {
      if (block.kind === 'markdown') return <div key={index}>{markdownToReact(block.markdown)}</div>
      const table = tables.find(table => table.id === block.tableId)
      if (!table) throw new Error(`Missing table: ${block.tableId}`)
      return <Table table={table} key={index} />
    })}
    {paragraphs(section.paragraphs)}
    {section.bullets && <ul>{section.bullets.map((bullet, index) => <li key={index}>{inlineText(bullet)}</li>)}</ul>}
    {article?.metricSection === section.id && <ArticleMetrics article={article} />}
    {article && <ArticleStudyFigure article={article} section={section} />}
    {section.figuresPosition === 'before-table' && section.figures?.map(figure => <ResearchFigure key={figure.src} figure={figure} />)}
    {section.table && <Table table={section.table} />}
    {section.figuresPosition !== 'before-table' && section.figures?.map(figure => <ResearchFigure key={figure.src} figure={figure} />)}
    {section.codeExamples?.map(example => <figure className="reader-code" key={example.title}>
      <figcaption>{example.title}</figcaption><p>{inlineText(example.description)}</p><pre><code className={`language-${example.language}`}>{example.code}</code></pre>
    </figure>)}
  </section>
}

// Render the same prose branch and evidence records as the interactive reader.
// This document is delivered identically to visitors and crawlers.
export function PublicArticle({ article }: { article: WritingArticle }) {
  const markdown = article.markdown && !article.markdownSections ? article.markdown.replace(/^# .+\n+/, '') : undefined
  const image = article.pageContent?.hero?.image
  const downloads = articleDownloads(article)
  return <>
    <p><a href="/about" rel="author">Sulayman Bowles</a> · <time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time>
      {article.dateModified && article.dateModified !== article.date && <> · Updated <time dateTime={article.dateModified.replaceAll('.', '-')}>{displayDate(article.dateModified)}</time></>}
    </p>
    {image && <figure><img src={image.src} alt={image.alt} loading="lazy" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>}
    <ReaderGuide slug={article.slug} />
    {article.htmlBody ? <><OpeningNotes article={article} boundary /><RestoredArticleBody html={article.htmlBody} /></> : markdown ? <>{markdownToReact(markdown)}<OpeningNotes article={article} boundary /></> : <>
      <ArticleOpening article={article} />
      {[...(article.sections || []), ...(article.markdownSections || [])].map(section => <Section key={section.id} section={section} tables={article.tables} article={article} />)}
    </>}
    {article.conclusion && <Section section={{ id: 'conclusion', title: article.conclusion.title, paragraphs: [article.conclusion.content] }} />}
    {article.cases && <section id="case-inventory"><h2>Case inventory</h2>{article.cases.map(item => <details key={item.name}><summary>{item.name} — {item.grade}</summary><dl>{Object.entries(item).filter(([key]) => !['name', 'href'].includes(key)).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl><a href={item.href}>Source</a></details>)}</section>}
    {article.factGaps && <section id="fact-gaps"><h2>What remains unknown</h2>{article.factGaps.map(gap => <div key={gap.title}><h3>{gap.title}</h3><ul>{gap.items.map(item => <li key={item}>{inlineText(item)}</li>)}</ul></div>)}</section>}
    {article.openQuestions && <section id="open-questions"><h2>Open questions</h2><ul>{article.openQuestions.map(question => <li key={question}>{inlineText(question)}</li>)}</ul></section>}
    {article.assumptions && <section id="reader-assumptions"><h2>Assumptions</h2><ul>{article.assumptions.map(assumption => <li key={assumption}>{inlineText(assumption)}</li>)}</ul></section>}
    {article.valuationFrame && <section id="reader-valuation"><h2>Valuation</h2><p>{inlineText(article.valuationFrame)}</p></section>}
    {article.risks && <section id="reader-risks"><h2>Risks</h2><p>{inlineText(article.risks)}</p></section>}
    {article.recommendationBoundary && <p>{inlineText(article.recommendationBoundary)}</p>}
    {article.faqs && <section id="questions"><h2>Questions</h2>{article.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary>{markdownToReact(faq.answer)}</details>)}</section>}
    {/* Markdown essays already include their own sources and footnote targets. */}
    {article.sources?.length && !article.htmlBody && !markdown ? <section id="sources"><h2>Sources</h2><ol>{article.sources.map((source, index) => <li key={index} id={sourceAnchor(source, index)}>
      {!source.id && <span id={`source-${index + 1}`} />}
      {source.markdown ? markdownToReact(source.markdown) : (source.href ? [source.href] : source.hrefs || []).map((href, hrefIndex) => <a key={href} href={href}>{hrefIndex ? `Additional source ${hrefIndex + 1}` : source.label}</a>)}
      {(source.publisher || source.date || source.type) && <p>{[source.publisher, source.date, source.type].filter(Boolean).join(' · ')}</p>}
      {source.lastVerified && <p>Verified {displayDate(source.lastVerified)}</p>}
      {source.note && <p>{inlineText(source.note)}</p>}{source.limitation && <p>{inlineText(source.limitation)}</p>}
    </li>)}</ol></section> : null}
    {downloads.length > 0 && !article.htmlBody && <section id="reader-downloads"><h2>Supporting material</h2><ul>{downloads.map(asset => <li key={asset.href}><a href={asset.href}>{asset.label}</a>{'description' in asset && asset.description && <p>{asset.description}</p>}</li>)}</ul></section>}
    {article.pageContent?.endnotes?.map((note, index) => <footer key={index}>{markdownToReact(note.markdown)}<nav aria-label="Related reading">{note.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></footer>)}
    <SourceAccessNotes slug={article.slug} />
    <AuthorNote />
    <section><h2>{siteCopy.reader.more}</h2><nav aria-label="More articles">
      {relatedArticles(article, catalog).map(item => <div key={item.slug}><a href={item.path}>{item.displayTitle || item.title}</a><p>{item.subtitle}</p></div>)}
    </nav></section>
  </>
}
