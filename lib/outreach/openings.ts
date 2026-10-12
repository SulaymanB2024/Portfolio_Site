import { personalizedOpeningIdPattern, personalizedOpeningPath, validOpeningLines, type OpeningLines } from '../../src/personal/recruiter/personalized-copy.ts'
import { companyIdentity, companySlug, initialSlugOverrides, outreachOrigin, parseRegistry, type OutreachRegistry } from './registry.ts'

export type OpeningStatus = 'Draft' | 'Ready' | 'Paused'
export interface PersonalizedOpeningInput { recordId: string; company: string; status: OpeningStatus; lines?: OpeningLines }
export interface PublishedOpening { companySlug: string; lines: OpeningLines; enabled: boolean }
export interface PersonalizedOpeningLink { recordId: string; company: string; status: OpeningStatus; slug?: string; url?: string }

export function validateOpenings(value: unknown): PersonalizedOpeningInput[] {
  if (!Array.isArray(value) || value.length > 1000) throw new Error('Expected at most 1000 opening rows')
  const seen = new Set<string>()
  return value.map(row => {
    if (!row || typeof row.recordId !== 'string' || !personalizedOpeningIdPattern.test(row.recordId) || seen.has(row.recordId)) throw new Error('Each opening needs a unique stable page ID')
    if (typeof row.company !== 'string') throw new Error('Company must be text')
    const company = row.company.trim().replace(/\s+/g, ' ')
    if (!company || company.length > 160 || /[@\x00-\x1f]|https?:\/\//i.test(company)) throw new Error('Enter a public company name')
    if (!['Draft', 'Ready', 'Paused'].includes(row.status)) throw new Error('Opening status must be Draft, Ready or Paused')
    if (row.status === 'Ready' && !validOpeningLines(row.lines)) throw new Error('Ready openings need four concise text rows without email, URLs or control characters')
    seen.add(row.recordId)
    return { recordId: row.recordId, company, status: row.status, ...(validOpeningLines(row.lines) ? { lines: [...row.lines] as OpeningLines } : {}) }
  })
}

/** Recipient rows never rename a shared company label or reuse a company-row ID. */
export function reconcileOpenings(previous: OutreachRegistry, input: PersonalizedOpeningInput[], reserved: Set<string>) {
  const registry = parseRegistry(previous)
  let changed = false
  const links: PersonalizedOpeningLink[] = []
  for (const row of [...input].sort((a, b) => a.recordId.localeCompare(b.recordId))) {
    let opening = registry.openings?.[row.recordId]
    if (row.status === 'Ready') {
      const identity = companyIdentity(row.company)
      let slug = Object.keys(registry.companies).find(key => registry.companies[key].identity === identity)
      const alias = Object.hasOwn(initialSlugOverrides, identity) ? initialSlugOverrides[identity] : undefined
      if (!slug && alias && Object.hasOwn(registry.companies, alias)) slug = alias
      if (!slug) {
        const base = companySlug(row.company)
        slug = base
        for (let suffix = 2; reserved.has(slug) || Object.hasOwn(registry.companies, slug); suffix++) slug = `${base}-${suffix}`
        registry.companies[slug] = { name: row.company, identity }
        changed = true
      }
      if (!opening || opening.companySlug !== slug || !opening.enabled || opening.lines.some((line, index) => line !== row.lines![index])) {
        registry.openings ??= {}
        opening = registry.openings[row.recordId] = { companySlug: slug, lines: [...row.lines!] as OpeningLines, enabled: true }
        changed = true
      }
    } else if (row.status === 'Paused' && opening?.enabled) {
      opening.enabled = false
      changed = true
    }
    links.push({ recordId: row.recordId, company: row.company, status: row.status,
      ...(opening ? { slug: opening.companySlug, url: `${outreachOrigin}${personalizedOpeningPath(row.recordId)}` } : {}) })
  }
  if (changed) registry.revision++
  return { registry, links, changed }
}
