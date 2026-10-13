import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { qualityHash, qualityProseWords, qualityReadingMinutes } from './article-quality-integrity.mjs'
import { publicationReceipt, verifyInitialPublication } from './article-publication-integrity.mjs'

const manifestPath = 'docs/texas-business/library.json'
const publicationsPath = 'docs/article-publications.json'
export const bundlePath = 'public/research/texas-business-library-2026-10-12.json'
const json = async path => JSON.parse(await readFile(path, 'utf8'))
export function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
}

export function reviewQueue(library, asOf) {
  assert(validDate(asOf), 'Use an actual ISO calendar date for --as-of')
  return library.articles.map(item => {
    assert(validDate(item.reviewBy), `${item.slug}: invalid editorial review date`)
    return { slug: item.slug, pillar: item.pillar, reviewBy: item.reviewBy, status: item.reviewBy <= asOf ? 'due' : 'upcoming', triggers: item.triggers }
  }).sort((a, b) => a.reviewBy.localeCompare(b.reviewBy) || a.slug.localeCompare(b.slug))
}

// Public projection is an allowlist. Production notes, work records, paths and
// private context in a source ledger must never become a reader download.
export function publicClaims(ledger) {
  return ledger.claims.map((claim, index) => {
    const item = { id: claim.id || `claim-${index + 1}`, claim: claim.claim }
    for (const key of ['status', 'qualification', 'sourceDate', 'referencePeriod', 'effectiveDate']) if (claim[key] !== undefined) item[key] = claim[key]
    const sources = claim.sources || (claim.source || claim.primaryUrl ? [{ url: claim.source || claim.primaryUrl }] : [])
    item.sources = sources.map(source => {
      if (typeof source === 'string') return { url: source }
      const publicSource = { url: source.url || source.href || source.primaryUrl }
      for (const key of ['date', 'status', 'pinpoint']) if (source[key] !== undefined) publicSource[key] = source[key]
      return publicSource
    })
    if (claim.locator || claim.pinpoint) item.locator = claim.locator || claim.pinpoint
    if (claim.recheck || claim.recheckTrigger || claim.updateTriggers) item.recheck = claim.recheck || claim.recheckTrigger || claim.updateTriggers
    return item
  })
}

export function projectArticle(item, article, ledger) {
  return {
    slug: article.slug, title: article.displayTitle || article.title,
    canonical: `https://sulayman-bowles.dev${article.path}`,
    pillar: item.pillar, reader: item.reader, decision: item.decision,
    sourceCutoff: ledger.checkedAt || ledger.verifiedOn || ledger.cutoff || ledger.researchCutoff,
    datePublished: article.date, dateModified: article.dateModified,
    evidenceBoundary: article.evidenceBoundary,
    sources: article.sources.map(source => Object.fromEntries(['id', 'label', 'href', 'publisher', 'date', 'lastVerified', 'note'].filter(key => source[key] !== undefined).map(key => [key, source[key]]))),
    claims: publicClaims(ledger),
    updateTriggers: item.triggers,
    decisionChecklist: article.sections.flatMap(section => section.bullets || []),
  }
}

async function libraryData() {
  const library = await json(manifestPath), publications = await json(publicationsPath)
  assert.equal(new Set(library.articles.map(item => item.slug)).size, library.articles.length, 'Duplicate library member')
  const articles = []
  for (const item of library.articles) {
    const record = publications.records.find(record => record.slug === item.slug)
    assert(record, `${item.slug}: publication receipt required`)
    assert.equal(record.claimsPath, item.claimsPath, `${item.slug}: claims identity mismatch`)
    const bytes = await readFile(record.path), article = verifyInitialPublication(bytes, record)
    const ledger = await json(item.claimsPath)
    assert.equal(ledger.article || ledger.articleSlug, item.slug, `${item.slug}: wrong claim ledger`)
    assert(ledger.claims?.length, `${item.slug}: material claims required`)
    assert(article.sources.length >= 6 && article.sources.every(source => validDate(source.lastVerified)), `${item.slug}: dated primary evidence required`)
    assert(article.faqs?.length >= 4 && article.faqs.every(faq => /#source-/.test(faq.answer)), `${item.slug}: source-linked answers required`)
    assert(qualityProseWords(article) >= 1000, `${item.slug}: substantial business explanation required`)
    assert(article.sections.some(section => section.bullets?.length), `${item.slug}: decision checklist required`)
    assert(article.sections.some(section => section.table), `${item.slug}: concrete comparison required`)
    articles.push(projectArticle(item, article, ledger))
  }
  return { schemaVersion: 1, title: 'Texas business research library', author: library.owner, editionDate: library.editionDate, purpose: 'Primary sources, decision frameworks and declared assumptions. A source check is not a project-specific approval or evidence of search ranking.', articles }
}

export function reviewedUpdate(record, article, bytes, { reason, evidence }) {
  const previous = publicationReceipt(record)
  assert.equal(article.slug, record.slug, 'Keep the existing article identity')
  assert.equal(article.path, record.canonicalPath, 'Keep the established canonical URL')
  assert.equal(article.date, record.datePublished, 'Keep the original publication date')
  assert(validDate(article.dateModified) && article.dateModified >= previous.dateModified, 'Set dateModified to the actual content update date')
  assert(reason?.trim().length >= 20, 'Explain what changed and why after checking the sources')
  assert(evidence?.length && evidence.every(url => article.sources.some(source => source.href === url)), 'Use primary evidence present in the updated article')
  const update = { previousSha256: previous.articleSha256, articleSha256: qualityHash(bytes), dateModified: article.dateModified, reason, evidence }
  assert.notEqual(update.articleSha256, previous.articleSha256, 'No manuscript change; do not fabricate an update')
  const updated = { ...record, updates: [...(record.updates || []), update] }
  verifyInitialPublication(bytes, updated)
  return updated
}

async function main(args) {
  const [command = 'queue', ...options] = args
  const option = flag => { const index = options.indexOf(flag); return index === -1 ? undefined : options[index + 1] }
  if (command === 'queue') {
    const asOf = option('--as-of') || new Date().toISOString().slice(0, 10)
    console.log(JSON.stringify({ asOf, mode: 'Manual editorial review; no source fetched, article updated or job scheduled.', queue: reviewQueue(await json(manifestPath), asOf) }, null, 2))
  } else if (command === 'bundle' || command === 'check') {
    const data = await libraryData(), bytes = JSON.stringify(data, null, 2) + '\n'
    if (command === 'bundle' && options.includes('--write')) {
      await writeFile(bundlePath, bytes)
      console.log(`Prepared ${data.articles.length} reviewed library entries at ${bundlePath}; no publication performed.`)
    } else {
      assert.equal(await readFile(bundlePath, 'utf8'), bytes, 'Public library is stale; review receipts, then run texas:bundle')
      console.log(`Texas library verified: ${data.articles.length} articles, ${data.articles.reduce((n, article) => n + article.sources.length, 0)} dated source references, claims-only public projection and unchanged publication identities.`)
    }
  } else if (command === 'initial' || command === 'receipt') {
    const slug = option('--slug'), reason = option('--reason')
    const evidence = options.flatMap((value, index) => value === '--evidence' ? [options[index + 1]] : [])
    const publications = await json(publicationsPath), index = publications.records.findIndex(record => record.slug === slug)
    if (command === 'initial') {
      assert.equal(index, -1, 'Preserve the existing initial receipt; use receipt for a reviewed update')
      const library = await json(manifestPath), item = library.articles.find(item => item.slug === slug)
      assert(item, 'Add the commissioned article to the library manifest first')
      const path = `src/personal/editorial/data/articles/${slug}.json`, bytes = await readFile(path), article = JSON.parse(bytes)
      const ledger = await json(item.claimsPath)
      assert.equal(ledger.article || ledger.articleSlug, slug, 'Read and reconcile the actual claim ledger')
      assert(ledger.claims?.length && reason?.trim().length >= 20, 'Explain the factual review before recording an edition')
      assert(evidence.length && evidence.every(url => article.sources.some(source => source.href === url)), 'Use reviewed primary evidence in the manuscript')
      assert(validDate(article.date) && article.dateModified === article.date, 'Initial edition uses its actual prepared publication date')
      const record = { slug, path, canonicalPath: article.path, datePublished: article.date, dateModified: article.dateModified, articleSha256: qualityHash(bytes), proseWords: qualityProseWords(article), readTime: `${qualityReadingMinutes(article)} MIN`, claimsPath: item.claimsPath, initialReview: { reason, evidence } }
      verifyInitialPublication(bytes, record)
      publications.records.push(record)
      await writeFile(publicationsPath, JSON.stringify(publications, null, 2) + '\n')
      console.log(`Recorded initial reviewed edition for ${slug}; no publication performed.`)
      return
    }
    assert(index !== -1, 'receipt only updates an existing reviewed publication')
    const record = publications.records[index], bytes = await readFile(record.path), article = JSON.parse(bytes)
    publications.records[index] = reviewedUpdate(record, article, bytes, { reason, evidence })
    await writeFile(publicationsPath, JSON.stringify(publications, null, 2) + '\n')
    console.log(`Recorded reviewed update for ${slug}; original receipt preserved. Catalog, guides, claim ledger and public bundle still need synchronization and checks. No publication performed.`)
  } else throw new Error('Use queue, check, bundle --write, or initial/receipt --slug SLUG --reason TEXT --evidence PRIMARY_URL')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(process.argv.slice(2))
