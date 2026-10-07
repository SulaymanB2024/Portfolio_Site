import { createHash } from 'node:crypto'

export const sha256 = value => createHash('sha256').update(value).digest('hex')
export const originalFields = (article, keys) => Object.fromEntries(keys.map(key => [key, article[key]]))

// Editorial revisions may change prose and move a figure. Freeze the underlying
// evidence independently: identity, research scope, sources, data, and downloads.
export function protectedArticleEvidence(article, keys, exceptions = []) {
  const prose = new Set(['subtitle', 'seoTitle', 'seoDescription', 'description', 'excerpt', 'dateModified', 'thesis', 'conclusion', 'content', 'sections', 'readTime', 'wordCount'])
  const identity = Object.fromEntries(keys.filter(key => !prose.has(key)).map(key => [key, article[key]]))
  for (const exception of exceptions.filter(item => item.slug === article.slug && item.removedResource)) {
    const resources = identity.resources || []
    const index = resources.findIndex(resource => JSON.stringify(resource) === JSON.stringify(exception.removedResource))
    if (index < 0) throw new Error(`Declared removed resource does not match the original: ${article.slug}`)
    identity.resources = resources.filter((_, resourceIndex) => resourceIndex !== index)
  }
  const sections = (article.sections || []).map(section => {
    const { title, paragraphs, figures, figuresPosition, codeExamples, ...evidence } = section
    // Caption prose is quantity/citation-checked by article-quality-integrity.
    // Freeze the actual executable examples here independently of those labels.
    if (codeExamples) evidence.codeExamples = codeExamples.map(({ title, description, ...example }) => example)
    return evidence
  })
  const figures = (article.sections || []).flatMap(section => section.figures || []).sort((a, b) => a.src.localeCompare(b.src))
  return { identity, sections, figures }
}

export function articleProseWords(article) {
  const text = [article.subtitle, article.thesis, article.evidenceBoundary, ...(article.content || []),
    ...(article.sections || []).flatMap(section => [section.title, ...(section.paragraphs || []), ...(section.bullets || [])]),
    article.conclusion?.title, article.conclusion?.content].filter(Boolean).join(' ')
  return text.split(/\s+/).filter(Boolean).length
}

export function readingMinutes(article) {
  const text = [article.subtitle, article.evidenceBoundary, ...(article.content || []),
    article.openingPresentation === 'integrated' ? '' : article.thesis,
    ...(article.sections || []).flatMap(section => [section.title, ...(section.paragraphs || []), ...(section.bullets || []),
      section.table?.caption, section.table?.title, section.table?.note, ...(section.table?.columns || []),
      ...(section.table?.rows || []).flat(), ...(section.figures || []).map(figure => figure.caption)]),
    article.conclusion?.title, article.conclusion?.content].filter(Boolean).join(' ')
  // The estimate includes evidence tables and captions; source ledgers and
  // downloadable reports are separate reading, rather than hidden inflation.
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220))
}
