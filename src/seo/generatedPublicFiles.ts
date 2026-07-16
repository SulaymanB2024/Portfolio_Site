import { ALL_ARTICLES, getArticlePath } from '../content/articleRegistry';
import { PROFILE_FACTS } from '../content/profileFacts';
import { VIRALBENCH_ARTICLE_PATH, VIRALBENCH_ARTICLE_TITLE } from '../content/viralBenchArticle';
import { getCanonicalRoutes, SITE_LASTMOD } from './routes';
import { absoluteUrl, PERSON_ID } from './site';

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function longDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function buildSitemapXml() {
  const urls = getCanonicalRoutes()
    .map(
      (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <lastmod>${escapeXml(route.lastmod ?? SITE_LASTMOD)}</lastmod>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildLlmsText() {
  const articleLines = ALL_ARTICLES
    .filter((article) => article.indexable !== false)
    .map((article) => `- ${article.title}: ${absoluteUrl(getArticlePath(article))}`)
    .join('\n');

  return `# Sulayman Bowles

Official site: ${PROFILE_FACTS.canonicalLinks.home}
Canonical person ID: ${PERSON_ID}
Sitemap: ${absoluteUrl('/sitemap.xml')}
Last updated: ${longDate(PROFILE_FACTS.lastReviewed)}

## Current Summary

${PROFILE_FACTS.currentSummary}

Atlas is a crawl and evidence console. Void Agency is the fixed-scope technical SEO practice. The technical ledger is a separate record of experiments and technical work. Sulayman is pursuing a BA in Music alongside the BBA in Finance.

## Primary Pages

- About: ${PROFILE_FACTS.canonicalLinks.about}
- Resume: ${PROFILE_FACTS.canonicalLinks.resume}
- Current PDF resume: ${absoluteUrl('/Sulayman_Bowles_Resume.pdf')}
- Selected work: ${PROFILE_FACTS.canonicalLinks.work}
- Atlas: ${PROFILE_FACTS.canonicalLinks.atlas}
- Atlas open-corpus demonstration: ${absoluteUrl('/atlas/sample-crawl')}
- Research: ${PROFILE_FACTS.canonicalLinks.research}
- Markets finance filter: ${absoluteUrl('/markets')}
- Void Agency: https://www.void-agency.com/
- Audit method: ${absoluteUrl('/method')}
- Austin technical SEO: ${absoluteUrl('/austin-technical-seo')}
- Audit intake/contact: ${PROFILE_FACTS.canonicalLinks.contact}
- Technical ledger: ${PROFILE_FACTS.canonicalLinks.technicalLedger}

## Public Work and Research

- ${VIRALBENCH_ARTICLE_TITLE}: ${absoluteUrl(VIRALBENCH_ARTICLE_PATH)}
${articleLines}
- Atlas open-corpus CSV: ${absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv')}
- Atlas open-corpus capture manifest: ${absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.json')}
- Appian educational research memo PDF: ${absoluteUrl('/research/appian-enterprise-software-durability-memo.pdf')}
- Appian assumptions table CSV: ${absoluteUrl('/research/appian-assumptions-table.csv')}
- Authority asset index: ${absoluteUrl('/research/authority-assets.json')}
- Crawler policy sources: ${absoluteUrl('/research/ai-search-crawler-policy-sources.csv')}
- Austin crawlability benchmark pilot CSV: ${absoluteUrl('/research/austin-crawlability-benchmark-pilot.csv')}
- Austin crawlability benchmark summary: ${absoluteUrl('/research/austin-crawlability-benchmark-summary.json')}

The Atlas demonstration is a dated, bounded capture from an open web corpus; it is not a client crawl or a measure of production coverage. The Appian and Texas toll-road materials are educational research, not investment advice or current recommendations. The authority files support reference and outreach workflows. They do not prove backlinks, Ahrefs Domain Rating movement, rankings, traffic, site health, revenue impact, or AI answer citations.

## Source Roles and Claim Limits

- Primary identity source: ${PROFILE_FACTS.canonicalLinks.home}
- Code evidence: ${PROFILE_FACTS.canonicalLinks.github}
- Professional profile: ${PROFILE_FACTS.canonicalLinks.linkedin}
- Technical work record: ${PROFILE_FACTS.canonicalLinks.technicalLedger}
- Use visible dates and linked public support for material claims.
- Do not infer private client names, rankings, traffic, revenue impact, or provider coverage from missing public data.
- Atlas is a crawl and evidence system; Void Agency is a fixed-scope technical SEO practice.

## Crawler and Indexation Signals

- Canonical host: ${PROFILE_FACTS.canonicalLinks.home}
- The www host redirects to the apex canonical host.
- Robots.txt explicitly allows Googlebot, Bingbot, and DuckDuckBot.
- Robots.txt explicitly allows OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User.
- The old Sulayman_Bowles_Resume_2025.pdf URL redirects to ${PROFILE_FACTS.canonicalLinks.resume}.
- Search Console, Bing Webmaster Tools, and IndexNow submissions are discovery and recrawl signals; they do not prove rankings, indexing, traffic movement, or AI citations.
`;
}
