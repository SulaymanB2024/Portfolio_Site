import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import receipt from '../docs/article-code-label-revisions.json' with { type: 'json' }

export const codeLabelRevisions = receipt.records
const revisions = new Map(codeLabelRevisions.map(record => [record.slug, record]))
assert.equal(revisions.size, codeLabelRevisions.length, 'Duplicate code-label revision')
const hash = value => createHash('sha256').update(value).digest('hex')

/** Canonicalize only explicitly reviewed label pairs; retain every evidence field. */
export function originalCodeLabels(article) {
  const revision = revisions.get(article.slug)
  if (!revision) return article
  const normalized = structuredClone(article)
  const paths = new Set()
  for (const change of revision.changes) {
    const label = `${article.slug}: ${change.sectionId}/codeExamples/${change.exampleIndex}/${change.field}`
    assert(['title', 'description'].includes(change.field), `${label}: non-label exception`)
    assert(Number.isInteger(change.exampleIndex) && change.exampleIndex >= 0, `${label}: invalid example index`)
    assert(typeof change.before === 'string' && typeof change.after === 'string' && change.before.trim() && change.after.trim() && change.before !== change.after, `${label}: invalid label pair`)
    assert(!paths.has(label), `${label}: duplicate label exception`)
    paths.add(label)
    const sections = (normalized.sections || []).filter(section => section.id === change.sectionId)
    assert.equal(sections.length, 1, `${label}: missing or ambiguous section`)
    const example = sections[0].codeExamples?.[change.exampleIndex]
    assert(example && [change.before, change.after].includes(example[change.field]), `${label}: unrecorded label change`)
    example[change.field] = change.before
  }
  return normalized
}

/** A new receipt is valid only when its exact labels reconstruct the prior readback. */
export function verifyCodeLabelReadback(bytes) {
  const article = JSON.parse(String(bytes))
  const revision = revisions.get(article.slug)
  if (!revision) return 0
  assert.equal(hash(bytes), revision.currentSha256, `${article.slug}: unrecorded label readback`)
  const prior = JSON.stringify(originalCodeLabels(article), null, 2) + '\n'
  assert.equal(hash(prior), revision.priorCurrentSha256, `${article.slug}: non-label change to prior readback`)
  return revision.changes.length
}
