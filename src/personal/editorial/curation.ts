import archived from './data/archived-catalog.json' with { type: 'json' }
import published from './data/catalog.json' with { type: 'json' }

const atlas = 'atlas-building-an-evidence-console'
// Retain archived records as restoration provenance. Every retained manuscript
// has its own reader again; a related project is not a replacement destination.
export const withdrawnArticleSlugs: string[] = []
const destinations: Record<string, { slug: string; section?: string }> = {
  'crawl-frontier-state-machine': { slug: atlas, section: 'capture' },
  'sqlite-crawl-pipelines': { slug: atlas, section: 'capture' },
  'raw-html-rendered-dom-evidence': { slug: atlas, section: 'source-and-render' },
  'canonicalization-graph-consistency': { slug: atlas, section: 'findings' },
  'internal-links-directed-retrieval-graph': { slug: atlas, section: 'findings' },
  'robots-txt-courtesy-not-access-control': { slug: atlas, section: 'capture' },
  'ai-search-crawler-policy': { slug: atlas, section: 'capture' },
  'structured-data-without-content-drift': { slug: atlas, section: 'findings' },
  'audit-findings-derived-records': { slug: atlas, section: 'findings' },
  'technical-seo-migration-release-gates': { slug: atlas, section: 'improvement-cycle' },
  'technical-seo-public-data-infrastructure': { slug: atlas, section: 'product' },
  'replayable-traces-ai-agent-evaluation': { slug: 'viralbench-codex-agent-harness' },
  'canonical-identity-personal-seo': { slug: '' },
}

/** Consolidate only notes that do not have their own published reader. */
export function consolidatedDestination(raw: string) {
  const path = raw.replace(/^#/, '').split(/[?#]/)[0].replace(/^\/+|\/+$/g, '')
  const record = archived.find(article => path === `writing/${article.slug}` || path === article.path.slice(1) || article.aliases?.some(alias => path === alias.slice(1)))
  return record && !published.some(article => article.slug === record.slug) ? destinations[record.slug] : undefined
}

export function consolidatedHref(raw: string) {
  const destination = consolidatedDestination(raw)
  if (!destination) return undefined
  return `#/writing${destination.slug ? `/${destination.slug}` : ''}${destination.section ? `?section=${destination.section}` : ''}`
}
