import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { originalCodeLabels } from './article-code-label-integrity.mjs'

export const qualityHash = value => createHash('sha256').update(value).digest('hex')
const editorial = new Set(['title', 'displayTitle', 'subtitle', 'seoTitle', 'seoDescription', 'description', 'excerpt', 'readTime', 'wordCount', 'dateModified', 'openingPresentation', 'content', 'thesis', 'conclusion', 'lede', 'ledeMarkdown', 'markdown', 'htmlBody', 'outline', 'sections', 'markdownSections'])
const sectionEvidence = section => {
  const { title, paragraphs, markdown, blocks, ...fixed } = section
  return { ...fixed, ...(blocks ? { blocks: blocks.map(block => block.kind === 'markdown' ? { kind: block.kind } : block) } : {}) }
}

export function protectedQualityEvidence(article) {
  article = originalCodeLabels(article)
  const fixed = Object.fromEntries(Object.entries(article).filter(([key]) => !editorial.has(key)))
  return { fixed, sections: (article.sections || []).map(sectionEvidence), markdownSections: (article.markdownSections || []).map(sectionEvidence),
    outlineIds: article.outline?.map(item => item.id),
    ...(article.htmlBody ? { html: {
      structure: article.htmlBody.match(/<[^>]*>/g),
      tables: article.htmlBody.match(/<table\b[\s\S]*?<\/table>/g),
      figures: article.htmlBody.match(/<figure\b[\s\S]*?<\/figure>/g),
      sources: article.htmlBody.match(/<section\b[^>]*id="(?:sources|source-ledger)"[\s\S]*?<\/section>/g),
    } } : {}),
  }
}

export function proseUnits(article) {
  return [
    { id: 'opening', text: [article.ledeMarkdown || article.lede || (article.content || []).join('\n\n'), article.thesis].filter(Boolean).join('\n') },
    ...[...(article.sections || []), ...(article.markdownSections || [])].map(section => ({ id: section.id, text: [section.title, ...(section.paragraphs || []), section.markdown, ...(section.blocks || []).filter(block => block.kind === 'markdown').map(block => block.markdown)].filter(Boolean).join('\n') })),
    ...(article.markdown && !article.markdownSections ? [{ id: 'markdown', text: article.markdown }] : []),
    ...(article.htmlBody ? [{ id: 'html', text: article.htmlBody }] : []),
    ...(article.conclusion ? [{ id: 'conclusion', text: `${article.conclusion.title}\n${article.conclusion.content}` }] : []),
  ]
}

export function consequentialLiterals(text) {
  return {
    numbers: [...new Set(text.match(/\b\d+(?:[,.]\d+)*(?:%|×)?/g) || [])].sort(),
    citations: [...new Set(text.match(/\[S\d+\]|#source-[\w-]+|\[\^\d+\]/g) || [])].sort(),
    links: [...new Set([...text.matchAll(/\]\(([^)]+)\)|href="([^"]+)"/g)].map(match => match[1] || match[2]))].sort(),
    code: [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(match => match[1]),
  }
}

const plain = text => String(text || '').replace(/<[^>]*>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\[S\d+\]|\[\^\d+\]/g, '').replace(/[*_`#|]/g, ' ').replace(/&(?:\w+|#\d+);/g, ' ')
const words = text => plain(text).split(/\s+/).filter(Boolean).length
const manuscriptMarkdown = markdown => markdown.replace(/^\[\^\d+\]:.*(?:\n[ \t]+.*)*/gm, '').split(/^## (?:Sources|Source ledger|References)\s*$/im)[0]
const htmlManuscript = html => html.replace(/<section\b[^>]*(?:id="(?:sources|source-ledger|downloads|related)"|class="related")[\s\S]*?<\/section>/g, '')
const tableText = table => [table.title, table.caption, ...(table.columns || []), ...(table.rows || []).flat(), table.note].filter(Boolean).join('\n')
const codeText = example => [example.title, example.description, example.code].filter(Boolean).join('\n')

export function articleBodyText(article, includeEvidence = false) {
  if (article.htmlBody) {
    const body = htmlManuscript(article.htmlBody)
    return includeEvidence ? body : body.replace(/<(?:table|figure)\b[\s\S]*?<\/(?:table|figure)>/g, '')
  }
  if (article.markdown && !article.markdownSections) return manuscriptMarkdown(article.markdown)
  const body = [article.ledeMarkdown || article.lede || (article.content || []).join('\n\n'),
    article.openingPresentation === 'integrated' ? '' : article.thesis,
    ...(article.sections || []).concat(article.markdownSections || []).flatMap(section => [section.title, ...(section.paragraphs || []), ...(section.bullets || []), section.markdown,
      ...(section.blocks || []).filter(block => block.kind === 'markdown').map(block => block.markdown),
      ...(includeEvidence ? [section.table && tableText(section.table), ...(section.figures || []).map(figure => figure.caption), ...(section.codeExamples || []).map(codeText)] : [])]),
    article.conclusion?.title, article.conclusion?.content]
  if (includeEvidence) body.push(...(article.tables || []).map(tableText))
  return body.filter(Boolean).join('\n')
}

export const qualityProseWords = article => words(articleBodyText(article))
export function qualityReadingMinutes(article) {
  // Estimate the main manuscript and its evidence, not the separate source
  // ledger, expandable registry, downloads or related articles.
  return Math.max(1, Math.ceil(words([article.subtitle, article.evidenceBoundary, articleBodyText(article, true)].filter(Boolean).join('\n')) / 220))
}

export function verifyQualityRevision(before, article, record, exceptions = []) {
  const label = record.slug
  assert.equal(article.slug, label)
  assert.equal(article.title, before.title, `${label}: title identity`)
  assert.equal(article.displayTitle, before.displayTitle, `${label}: visible title identity`)
  assert.deepEqual(protectedQualityEvidence(article), protectedQualityEvidence(before), `${label}: frozen evidence`)
  const previous = proseUnits(before), next = proseUnits(article)
  assert.notDeepEqual(next, previous, `${label}: substantive manuscript revision`)
  for (const unit of previous) {
    const revised = next.find(item => item.id === unit.id)
    assert(revised, `${label}: lost unit ${unit.id}`)
    const expected = consequentialLiterals(unit.text)
    const exception = exceptions.find(item => item.slug === label && item.unit === unit.id)
    for (const kind of ['numbers', 'links']) {
      expected[kind] = [...new Set([...expected[kind], ...(exception?.[kind === 'numbers' ? 'addedNumbers' : 'addedLinks'] || [])])].sort()
    }
    assert.deepEqual(consequentialLiterals(revised.text), expected, `${label}: consequential literals in ${unit.id}`)
  }
  assert.equal(article.dateModified, '2026-10-05', `${label}: editorial revision date`)
  assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`, `${label}: reading estimate`)
  assert(article.seoTitle?.trim() && article.seoDescription?.trim(), `${label}: authored metadata`)
  assert.equal(article.seoTitle, record.seoTitle)
  assert.equal(article.seoDescription, record.seoDescription)
  assert.deepEqual(record.proseWords, { before: qualityProseWords(before), after: qualityProseWords(article) })
  return next.length
}
