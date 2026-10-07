import guides from './data/reader-guides.json'
import { sectionHref } from './library'
import { articleTopic } from './topics'
import { sourceAccessCheckedAt, sourceAccessNotes } from './SourceAccessNotes'
import { displayDate } from './types'
import { answerNotes } from './answer-notes'
import './reading-guides.css'

interface Guide {
  question: string
  answer: string
  paths: { label: string; section: string; description: string }[]
  sources: { label: string; href: string }[]
}

export default function ReaderGuide({ slug, hash = '' }: { slug: string; hash?: string }) {
  const guide = (guides as Record<string, Guide>)[slug]
  if (!guide) return null
  const topic = articleTopic(slug)
  return <>
    <section className="reader-guide" aria-labelledby={`guide-${slug}`}>
      <span className="eyebrow">Find your answer</span>
      <h2 id={`guide-${slug}`}>{guide.question}</h2>
      <p className="reader-guide-answer">{guide.answer}</p>
      <nav className="reader-guide-paths" aria-label="Where to read next">{guide.paths.map(path => <div key={path.section}>
        <a href={sectionHref(hash, path.section)}>{path.label} <span aria-hidden="true">↓</span></a><p>{path.description}</p>
      </div>)}</nav>
      <p className="reader-guide-sources">Evidence: {guide.sources.map((source, index) => <span key={source.href}>{index > 0 && ' · '}<a href={source.href}>{source.label}</a></span>)}</p>
      {answerNotes(slug) && <p className="reader-guide-sources"><a href={sectionHref(hash, 'answer-notes')}>Questions, with evidence</a> · {answerNotes(slug)!.questions.length} answers with source links and supporting passages</p>}
      {sourceAccessNotes(slug).length > 0 && <p className="reader-guide-sources"><a href={sectionHref(hash, 'source-access-notes')}>Source access notes and reading alternatives</a> · Checked {displayDate(sourceAccessCheckedAt)}</p>}
    </section>
    {topic && <p className="reader-topic-link">Read this alongside <a href={`${hash.startsWith('#/') ? '#' : ''}/topics/${topic.slug}`}>{topic.title}</a>.</p>}
  </>
}
