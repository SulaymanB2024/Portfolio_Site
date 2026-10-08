import { outreachSlugPattern } from '../../src/personal/outreach-context.ts'

export interface CompanyInput { recordId: string; company: string }
export interface OutreachCompany { name: string; identity: string }
export interface OutreachRegistry {
  version: 1
  revision: number
  records: Record<string, string>
  companies: Record<string, OutreachCompany>
}
export interface CompanyLink { recordId: string; company: string; slug: string; url: string }
export const outreachOrigin = 'https://sulayman-bowles.dev'
export const outreachRegistryKey = 'outreach_companies'
export const initialSlugOverrides: Readonly<Record<string, string>> = {
  'base power company': 'base-power',
  'anduril industries': 'anduril',
  jpmorganchase: 'jpmorgan',
  'mckinsey & company': 'mckinsey',
  'bain & company': 'bain',
  'boston consulting group': 'bcg',
}

export function companyIdentity(company: string) {
  return company.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function companySlug(company: string) {
  const identity = companyIdentity(company)
  const override = Object.hasOwn(initialSlugOverrides, identity) ? initialSlugOverrides[identity] : undefined
  if (override) return override
  return company.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[.'’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 88).replace(/-+$/g, '') || 'company'
}

export function emptyRegistry(): OutreachRegistry {
  return { version: 1, revision: 0, records: {}, companies: {} }
}

export function validateCompanies(value: unknown): CompanyInput[] {
  if (!Array.isArray(value) || value.length > 5000) throw new Error('Expected at most 5000 company rows')
  const seen = new Set<string>()
  return value.map(row => {
    if (!row || typeof row.recordId !== 'string' || !/^[0-9a-f-]{36}$/i.test(row.recordId) || seen.has(row.recordId)) throw new Error('Each row needs a unique stable record ID')
    if (typeof row.company !== 'string') throw new Error('Company must be text')
    const company = row.company.trim().replace(/\s+/g, ' ')
    if (!company || company.length > 160 || /[@\x00-\x1f]|https?:\/\//i.test(company)) throw new Error('Enter a company name, not an email, URL or control characters')
    seen.add(row.recordId)
    return { recordId: row.recordId, company }
  })
}

export function parseRegistry(value: unknown): OutreachRegistry {
  if (value === undefined || value === null) return emptyRegistry()
  const data = value as OutreachRegistry
  if (data.version !== 1 || !Number.isSafeInteger(data.revision) || data.revision < 0 || typeof data.records !== 'object' || !data.records || Array.isArray(data.records) || typeof data.companies !== 'object' || !data.companies || Array.isArray(data.companies)) throw new Error('Invalid registry snapshot')
  for (const [slug, company] of Object.entries(data.companies)) {
    if (!outreachSlugPattern.test(slug) || slug.length > 96 || typeof company?.name !== 'string' || typeof company?.identity !== 'string') throw new Error('Invalid company registry')
  }
  for (const slug of Object.values(data.records)) if (typeof slug !== 'string' || !Object.hasOwn(data.companies, slug)) throw new Error('Invalid record mapping')
  return structuredClone(data)
}

/** Additive publication: omission never destroys a link already used in outreach. */
export function reconcileCompanies(previous: OutreachRegistry, rows: CompanyInput[], reserved: Set<string>) {
  const registry = parseRegistry(previous)
  let changed = false
  const links: CompanyLink[] = []
  const currentIdentities = new Map(rows.filter(row => Object.hasOwn(registry.records, row.recordId))
    .sort((a, b) => b.recordId.localeCompare(a.recordId))
    .map(row => [companyIdentity(row.company), registry.records[row.recordId]]))
  for (const row of rows) {
    const identity = companyIdentity(row.company)
    let slug = Object.hasOwn(registry.records, row.recordId) ? registry.records[row.recordId] : undefined
    if (!slug) slug = currentIdentities.get(identity)
    if (!slug) slug = Object.keys(registry.companies).find(key => registry.companies[key].identity === identity)
    if (!slug) {
      const base = companySlug(row.company)
      slug = base
      for (let suffix = 2; reserved.has(slug) || Object.hasOwn(registry.companies, slug); suffix++) slug = `${base}-${suffix}`
      registry.companies[slug] = { name: row.company, identity }
      changed = true
    }
    if (registry.records[row.recordId] !== slug) { registry.records[row.recordId] = slug; changed = true }
    links.push({ ...row, slug, url: `${outreachOrigin}/${slug}` })
  }
  // One deterministic label per shared URL prevents duplicate rows from toggling its
  // metadata on every retry, including when the spreadsheet is reordered.
  const labels = new Map<string, CompanyLink>()
  for (const link of links) {
    if (!labels.has(link.slug) || link.recordId < labels.get(link.slug)!.recordId) labels.set(link.slug, link)
  }
  for (const [slug, row] of labels) {
    const identity = companyIdentity(row.company)
    if (registry.companies[slug].name !== row.company || registry.companies[slug].identity !== identity) {
      registry.companies[slug] = { name: row.company, identity }; changed = true
    }
  }
  if (changed) registry.revision++
  return { registry, links, changed }
}
