import { ALL_ARTICLES, getArticlePath } from '../content/articleRegistry';
import { PROFILE_FACTS } from '../content/profileFacts';
import {
  TEXAS_TOLL_OWNERSHIP_CSV_PATH,
  TEXAS_TOLL_OWNERSHIP_ROWS,
} from '../content/texasTollRoadOwnership';
import { VIRALBENCH_ARTICLE_PATH, VIRALBENCH_ARTICLE_TITLE } from '../content/viralBenchArticle';
import { ARTICLE_SEARCH_TARGETS } from './articleSearchTargets';
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

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildTexasTollOwnershipCsv() {
  const header = [
    'facility',
    'region',
    'physical_owner',
    'operator',
    'toll_revenue_claimant',
    'concessionaire',
    'term',
    'private_rights_status',
    'billing_agency',
    'evidence_date',
    'source_ids',
  ];
  const rows = TEXAS_TOLL_OWNERSHIP_ROWS.map((row) => [
    row.facility,
    row.region,
    row.physicalOwner,
    row.operator,
    row.tollRevenueClaimant,
    row.concessionaire,
    row.term,
    row.privateRightsStatus,
    row.billingAgency,
    row.evidenceDate,
    row.sourceIds.join('|'),
  ]);

  return `${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
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
- Evidence-led technical SEO audit method: ${absoluteUrl('/method')}
- Austin technical SEO consultant and audit services: ${absoluteUrl('/austin-technical-seo')}
- Technical SEO consultant contact and audit intake: ${PROFILE_FACTS.canonicalLinks.contact}
- Technical ledger: ${PROFILE_FACTS.canonicalLinks.technicalLedger}

## Public Work and Research

- ${VIRALBENCH_ARTICLE_TITLE}: ${absoluteUrl(VIRALBENCH_ARTICLE_PATH)}
${articleLines}
- Atlas open-corpus CSV: ${absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv')}
- Atlas open-corpus capture manifest: ${absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.json')}
- Appian educational research memo PDF: ${absoluteUrl('/research/appian-enterprise-software-durability-memo.pdf')}
- Appian assumptions table CSV: ${absoluteUrl('/research/appian-assumptions-table.csv')}
- Authority asset index: ${absoluteUrl('/research/authority-assets.json')}
- Article research briefs: ${absoluteUrl('/research/article-research-briefs.json')}
- Texas toll-road ownership matrix: ${absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH)}
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

export function buildArticleResearchBriefsJson() {
  return `${JSON.stringify({
    generated_at: '2026-07-23',
    canonical_host: 'https://sulayman-bowles.dev',
    objective: 'Public intent, evidence, artifact, and related-reading briefs for the site research archive.',
    limits: [
      'These briefs describe editorial scope and evidence boundaries; they do not claim rankings, indexing, traffic, revenue impact, or backlinks.',
      'Dates are verification dates for source and artifact review, not artificial freshness signals.',
      'Related links are selected for reader relevance and crawlable context, not exact-match anchor manipulation.',
    ],
    articles: ARTICLE_SEARCH_TARGETS.map((target) => ({
      url: absoluteUrl(target.path),
      question: target.primaryQuery,
      supporting_questions: target.supportingQueries,
      intent: target.intent,
      cohort: target.cohort,
      direct_answer: target.directAnswer,
      evidence_gap: target.serpGap,
      original_artifact: target.originalArtifact,
      scope_boundary: target.cannibalizationBoundary,
      related_articles: target.relatedPaths.map(absoluteUrl),
      ranking_goal: 'rankingGoal' in target ? target.rankingGoal : null,
      last_verified: '2026-07-23',
    })),
  }, null, 2)}\n`;
}

export function buildAuthorityAssetsJson() {
  const articleAssets = ARTICLE_SEARCH_TARGETS.map((target, index) => {
    const route = getCanonicalRoutes().find((candidate) => candidate.path === target.path);
    if (!route) throw new Error(`Authority asset route is missing: ${target.path}`);
    return {
      priority: target.cohort,
      name: route.h1,
      url: absoluteUrl(target.path),
      type: 'source_led_article',
      cluster: target.path.split('/')[2] || 'ai-systems',
      preferred_anchor: target.path === '/markets/who-owns-texas-toll-roads'
        ? 'Texas toll-road ownership and concession guide'
        : route.h1,
      pitch_angle: target.serpGap,
      supporting_assets: [
        absoluteUrl('/research/article-research-briefs.json'),
        ...(target.path === '/markets/who-owns-texas-toll-roads'
          ? [absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH)]
          : []),
        ...target.relatedPaths.slice(0, index === 0 ? 3 : 2).map(absoluteUrl),
      ],
    };
  });

  return `${JSON.stringify({
    generated_at: '2026-07-23',
    canonical_host: 'https://sulayman-bowles.dev',
    objective: 'Topical authority index for source-led technical SEO, crawler, AI-agent, data-system, and infrastructure research.',
    claim_boundaries: [
      'The index does not claim rankings, indexing, traffic movement, revenue impact, backlinks, Domain Rating movement, or AI citations.',
      'Outreach targets are editorial-fit candidates, not promised placements.',
      'Preferred anchors are descriptive suggestions only; publishers retain editorial control and forced exact-match anchors are prohibited.',
      'Private clients, private outcomes, and unsupported performance claims are intentionally excluded.',
      'Artifacts preserve verification dates and evidence limits; publication dates are not changed merely to signal freshness.',
    ],
    assets: [
      {
        priority: 1,
        name: 'Research Notes',
        url: absoluteUrl('/research'),
        type: 'research_hub',
        cluster: 'all',
        preferred_anchor: 'Sulayman Bowles research notes',
        pitch_angle: 'A crawlable hub connecting source-led articles, public artifacts, methodology, and explicit claim boundaries.',
        supporting_assets: [absoluteUrl('/research/article-research-briefs.json')],
      },
      ...articleAssets,
      {
        priority: 1,
        name: 'Atlas Open-Corpus Demonstration',
        url: absoluteUrl('/atlas/sample-crawl'),
        type: 'public_demonstration',
        cluster: 'crawler-engineering',
        preferred_anchor: 'Atlas open-corpus crawl demonstration',
        pitch_angle: 'A bounded public crawl dataset with raw evidence, runtime indicators, and an explicit measurement boundary.',
        supporting_assets: [
          absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv'),
          absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.json'),
        ],
      },
      ...[
        ['/atlas', 'Atlas technical SEO audit software', 'crawler-engineering', 'Atlas crawl evidence system', 'A product page connecting crawl contracts, evidence preservation, review states, and public demonstration artifacts.'],
        ['/austin-technical-seo', 'Austin Technical SEO', 'technical-seo', 'Austin technical SEO audit services', 'A locally scoped technical SEO service page with a bounded public crawlability benchmark.'],
        ['/method', 'Evidence-Led Technical SEO Audit Method', 'technical-seo', 'technical SEO audit method', 'Sulayman Bowles’s personal audit method, organized around crawl evidence, implementation priorities, and reviewable handoff.'],
        ['/markets', 'Markets and Investing', 'infrastructure', 'markets and infrastructure research', 'A finance-only research filter with visible assumptions, ownership evidence, and recommendation boundaries.'],
        ['/resume', 'Resume', 'identity', 'Sulayman Bowles resume', 'The current canonical résumé and professional history source.'],
        ['/work', 'Selected Work', 'identity', 'Sulayman Bowles technical portfolio', 'A selected-work index linking public software, research, and implementation evidence.'],
        ['/about', 'About Sulayman Bowles', 'identity', 'about Sulayman Bowles', 'The canonical public identity page with current work, education, controlled profiles, and evidence boundaries.'],
      ].map(([assetPath, name, cluster, preferredAnchor, pitchAngle], index) => ({
        priority: index < 3 ? 1 : 2,
        name,
        url: absoluteUrl(assetPath),
        type: 'canonical_site_asset',
        cluster,
        preferred_anchor: preferredAnchor,
        pitch_angle: pitchAngle,
        supporting_assets: [absoluteUrl('/research')],
      })),
    ],
  }, null, 2)}\n`;
}
