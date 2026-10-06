import notes from './data/answer-notes.json' with { type: 'json' }

export interface AnswerNote {
  id: string
  question: string
  answer: string
  section: string
  sources: { label: string; href: string }[]
  related: { slug: string; section: string; label: string }
}
export interface AnswerNotesRecord {
  boundary: string
  questions: AnswerNote[]
}

export const answerNotesUpdated = notes.updated
export function answerNotes(slug: string): AnswerNotesRecord | undefined {
  return (notes.articles as Record<string, AnswerNotesRecord>)[slug]
}

// A real reader addition changes the edition date, never the research cutoff.
// Unchanged essays keep their recorded dates across builds.
export function readerModifiedDate(slug: string, original?: string) {
  const recorded = original?.replaceAll('.', '-')
  return answerNotes(slug) && (!recorded || recorded < answerNotesUpdated) ? answerNotesUpdated : recorded
}

// Stable wording-based targets survive reordering the existing questions.
export function questionAnchor(question: string) {
  return `question-${question.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}
