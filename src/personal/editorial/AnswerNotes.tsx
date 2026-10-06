import catalog from './data/catalog.json'
import { answerNotes, answerNotesUpdated } from './answer-notes'
import { sectionHref } from './library'
import { displayDate } from './types'

export default function AnswerNotes({ slug, hash = '' }: { slug: string; hash?: string }) {
  const notes = answerNotes(slug)
  if (!notes) return null
  return <section id="answer-notes" className="reader-section answer-notes" aria-labelledby="answer-notes-title">
    <span className="eyebrow">Reading notes · <time dateTime={answerNotesUpdated}>{displayDate(answerNotesUpdated)}</time></span>
    <h2 id="answer-notes-title">Questions, with evidence</h2>
    <p className="answer-notes-boundary">{notes.boundary}</p>
    {notes.questions.map(note => {
      const related = catalog.find(article => article.slug === note.related.slug)!
      return <section className="answer-note" id={note.id} key={note.id}>
        <h3><a href={sectionHref(hash, note.id)}>{note.question}<span className="sr-only"> — link to this answer</span></a></h3>
        <p>{note.answer}</p>
        <p className="answer-note-evidence">Evidence: {note.sources.map((source, index) => <span key={source.href}>{index > 0 && ' · '}<a href={source.href}>{source.label}</a></span>)}</p>
        <p className="answer-note-reading"><a href={sectionHref(hash, note.section)}>Read the supporting analysis <span aria-hidden="true">↓</span></a><br /><a href={`${related.path}#${encodeURIComponent(note.related.section)}`}>{note.related.label} <span aria-hidden="true">↗</span></a></p>
      </section>
    })}
  </section>
}
