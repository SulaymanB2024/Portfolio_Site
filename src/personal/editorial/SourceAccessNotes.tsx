import access from './data/source-access.json'
import { displayDate } from './types'
import './reading-guides.css'

export interface SourceAccessNote {
  href: string
  label: string
  note: string
  alternatives: { href: string; label: string }[]
}

export const sourceAccessCheckedAt = access.checkedAt

export function sourceAccessNotes(slug: string): SourceAccessNote[] {
  return (access.articles as Record<string, SourceAccessNote[]>)[slug] || []
}

export default function SourceAccessNotes({ slug }: { slug: string }) {
  const notes = sourceAccessNotes(slug)
  if (!notes.length) return null
  return <section id="source-access-notes" className="reader-section reader-source-access">
    <h2>Source access notes</h2>
    <p>Checked <time dateTime={access.checkedAt}>{displayDate(access.checkedAt)}</time>. The original links below were unavailable. These notes provide available reading alternatives; the investigation retains its original evidence dates.</p>
    {notes.map(source => <details className="reader-disclosure" key={source.href}>
      <summary><span>{source.label}</span><span aria-hidden="true">+</span></summary>
      <p>{source.note}</p>
      {source.alternatives.length > 0 && <ul>{source.alternatives.map(alternative => <li key={alternative.href}><a href={alternative.href}>{alternative.label} ↗</a></li>)}</ul>}
      <p className="source-publisher"><a href={source.href}>Original citation ↗</a></p>
    </details>)}
  </section>
}
