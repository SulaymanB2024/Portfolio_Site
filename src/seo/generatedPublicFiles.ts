import { ALL_ARTICLES, getArticlePath } from '../content/articleRegistry';
import { PROFILE_FACTS } from '../content/profileFacts';
import { PROGRAMMATIC_SEO_HUBS, PROGRAMMATIC_SEO_PAGES } from '../content/programmaticSeo';
import { TEXAS_TOLL_ARTICLE_SOURCES } from '../content/texasTollRoadArticle';
import {
  TEXAS_TOLL_OWNERSHIP_CSV_PATH,
  TEXAS_TOLL_OWNERSHIP_JSON_PATH,
  TEXAS_TOLL_OWNERSHIP_ROWS,
} from '../content/texasTollRoadOwnership';
import { VIRALBENCH_ARTICLE_PATH, VIRALBENCH_ARTICLE_TITLE } from '../content/viralBenchArticleMeta';
import { ARTICLE_SEARCH_TARGETS } from './articleSearchTargets';
import {
  CRAWLER_POLICY_GROUPS,
  CRAWLER_POLICY_REVIEWED,
  LLMS_TXT_LIMITS,
  assertSeoAuthorityContract,
} from './machineReadableAuthority';
import { getCanonicalRoutes, SEO_ROUTES, SITE_LASTMOD } from './routes';
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

function llmsLink(label: string, url: string, note?: string) {
  return `- [${label}](${url})${note ? `: ${note}` : ''}`;
}

function crawlerGroup(label: (typeof CRAWLER_POLICY_GROUPS)[number]['label']) {
  const group = CRAWLER_POLICY_GROUPS.find((candidate) => candidate.label === label);
  if (!group) throw new Error(`Missing crawler policy group: ${label}`);
  return group;
}

export function buildTexasTollOwnershipCsv() {
  const header = [
    'facility',
    'geography',
    'authority',
    'operator',
    'toll_revenue_claimant',
    'concession',
    'concession_term',
    'concession_status',
    'billing_agency',
    'evidence_date',
    'primary_source_ids',
    'primary_source_urls',
  ];
  const rows = buildTexasTollOwnershipTrackerRows().map((row) => [
    row.facility,
    row.geography,
    row.authority,
    row.operator,
    row.tollRevenueClaimant,
    row.concession,
    row.concessionTerm,
    row.concessionStatus,
    row.billingAgency,
    row.evidenceDate,
    row.primarySources.map((source) => source.id).join('|'),
    row.primarySources.flatMap((source) => source.urls).join('|'),
  ]);

  return `${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
}

export function buildTexasTollOwnershipTrackerRows() {
  const sourcesById = new Map(TEXAS_TOLL_ARTICLE_SOURCES.map((source) => [source.id, source]));

  return TEXAS_TOLL_OWNERSHIP_ROWS.map((row) => ({
    facility: row.facility,
    geography: row.region,
    authority: row.physicalOwner,
    operator: row.operator,
    tollRevenueClaimant: row.tollRevenueClaimant,
    concession: row.concessionaire,
    concessionTerm: row.term,
    concessionStatus: row.privateRightsStatus,
    billingAgency: row.billingAgency,
    evidenceDate: row.evidenceDate,
    primarySources: row.sourceIds.map((id) => {
      const source = sourcesById.get(id);
      if (!source) throw new Error(`${row.facility}: missing primary source ${id}.`);
      return { id, label: source.label, urls: source.hrefs };
    }),
  }));
}

export function buildTexasTollOwnershipJson() {
  return `${JSON.stringify({
    schema_version: 'texas_toll_road_ownership_v1',
    canonical_page: absoluteUrl('/markets/who-owns-texas-toll-roads'),
    generated_at: '2026-09-03',
    evidence_cutoff: TEXAS_TOLL_OWNERSHIP_ROWS[0]?.evidenceDate ?? null,
    interpretation: 'Authority identifies the public titleholder or public system. Concession identifies a finite private operating and revenue-right holder, not ownership of the pavement.',
    records: buildTexasTollOwnershipTrackerRows(),
  }, null, 2)}\n`;
}

export function buildSeoPortfolioRoutesJson() {
  return `${JSON.stringify({
    schema_version: 'SeoPortfolioRouteV1',
    generated_at: '2026-09-03',
    source_domain: 'sulayman-bowles.dev',
    expansion_frozen: true,
    routes: SEO_ROUTES.map((route) => route.portfolioRoute),
  }, null, 2)}\n`;
}

export function buildSeoRedirectsJson() {
  return `${JSON.stringify({
    schema_version: 'SeoPortfolioRedirectTableV1',
    generated_at: '2026-09-03',
    source_domain: 'sulayman-bowles.dev',
    redirects: SEO_ROUTES
      .filter((route) => route.portfolioRoute?.lifecycle === 'merge')
      .map((route) => ({
        source: route.path,
        destination: route.portfolioRoute?.redirectTarget,
        status: 308,
        intent_cluster: route.portfolioRoute?.intentCluster,
        owner_domain: route.portfolioRoute?.ownerDomain,
      })),
  }, null, 2)}\n`;
}

export function buildSitemapXml() {
  assertSeoAuthorityContract(SEO_ROUTES);
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
  assertSeoAuthorityContract(SEO_ROUTES);
  const articleLines = ALL_ARTICLES
    .filter((article) => article.indexable !== false)
    .map((article) => llmsLink(article.title, absoluteUrl(getArticlePath(article))))
    .join('\n');
  const searchCrawlerGroup = crawlerGroup('Conventional search crawlers');
  const aiSearchCrawlerGroup = crawlerGroup('AI answer-search crawlers');
  const userRetrievalGroup = crawlerGroup('User-triggered retrieval agents');
  const modelDevelopmentGroup = crawlerGroup('Model-development crawlers');

  return `# Sulayman Bowles

> Official context index for the public identity, work, research, and source files on sulayman-bowles.dev.

Official site: ${PROFILE_FACTS.canonicalLinks.home}
Canonical person ID: ${PERSON_ID}
Sitemap: ${absoluteUrl('/sitemap.xml')}
Authority contract reviewed: ${longDate(CRAWLER_POLICY_REVIEWED)}
Profile facts reviewed: ${longDate(PROFILE_FACTS.lastReviewed)}

## How to Interpret This File

${LLMS_TXT_LIMITS.map((limit) => `- ${limit}`).join('\n')}

## Current Summary

${PROFILE_FACTS.currentSummary}

Atlas is a crawl and evidence console. Void Agency is the fixed-scope technical SEO practice. The technical ledger is a separate record of experiments and technical work. Sulayman is pursuing a BA in Music alongside the BBA in Finance.

## Primary Pages

${llmsLink('About', PROFILE_FACTS.canonicalLinks.about, 'Canonical public profile and the page that owns the Person entity.')}
${llmsLink('Resume', PROFILE_FACTS.canonicalLinks.resume, 'Current HTML professional and education record.')}
${llmsLink('Current PDF resume', absoluteUrl('/Sulayman_Bowles_Resume.pdf'), 'Downloadable companion to the HTML resume.')}
${llmsLink('Selected work', PROFILE_FACTS.canonicalLinks.work, 'Public project and evidence index.')}
${llmsLink('Atlas', PROFILE_FACTS.canonicalLinks.atlas, 'Product scope and implementation-status page.')}
${llmsLink('Atlas open-corpus demonstration', absoluteUrl('/atlas/sample-crawl'), 'Dated, bounded public demonstration; not production coverage.')}
${llmsLink('Research', PROFILE_FACTS.canonicalLinks.research, 'Public research hub and article index.')}
${llmsLink('Markets finance filter', absoluteUrl('/markets'), 'Finance and infrastructure research subset.')}
${llmsLink('VOID technical SEO audit kit', 'https://www.void-agency.com/tools/technical-seo-audit-checklist', 'Canonical commercial owner for audit checklists and process guidance.')}
${llmsLink('VOID technical SEO service', 'https://www.void-agency.com/services/technical-seo-ai-search-visibility', 'Canonical commercial owner for Austin and technical SEO service intent.')}
${llmsLink('Technical SEO consultant contact and audit intake', PROFILE_FACTS.canonicalLinks.contact, 'Direct inquiry and bounded brief path.')}
${llmsLink('Technical ledger', PROFILE_FACTS.canonicalLinks.technicalLedger, 'Separate record of experiments and technical work.')}

## Public Work and Research

${llmsLink(VIRALBENCH_ARTICLE_TITLE, absoluteUrl(VIRALBENCH_ARTICLE_PATH))}
${articleLines}
${llmsLink('Atlas open-corpus CSV', absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv'), 'URL-level rows from the dated public demonstration.')}
${llmsLink('Atlas open-corpus capture manifest', absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.json'), 'Run scope, method, and claim limit.')}
${llmsLink('Appian educational research memo PDF', absoluteUrl('/research/appian-enterprise-software-durability-memo.pdf'), 'Educational research, not investment advice.')}
${llmsLink('Appian assumptions table CSV', absoluteUrl('/research/appian-assumptions-table.csv'), 'Companion assumptions table.')}
${llmsLink('Authority asset index', absoluteUrl('/research/authority-assets.json'), 'Typed index of public assets and their claim boundaries.')}
${llmsLink('Article research briefs', absoluteUrl('/research/article-research-briefs.json'), 'Intent, evidence-gap, artifact, and scope records.')}
${llmsLink('SEO portfolio ownership manifest', absoluteUrl('/research/seo-portfolio-routes-v1.json'), 'Versioned lifecycle, canonical-owner, and redirect decisions for every registered route.')}
${llmsLink('SEO portfolio redirect table', absoluteUrl('/research/seo-redirects-v1.json'), 'One-hop permanent redirects generated from the same route-ownership contract.')}
${llmsLink('Technical SEO migration index', absoluteUrl('/research/technical-seo-reference-index.json'), 'Structured source-to-VOID ownership and redirect decisions for the frozen commodity library.')}
${llmsLink('Texas toll-road ownership matrix', absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH), 'Dated source-linked ownership rows.')}
${llmsLink('Texas toll-road ownership dataset', absoluteUrl(TEXAS_TOLL_OWNERSHIP_JSON_PATH), 'Machine-readable authority, operator, concession, geography, and primary-source records.')}
${llmsLink('Crawler policy sources', absoluteUrl('/research/ai-search-crawler-policy-sources.csv'), 'Official documentation and IP-manifest source map.')}
${llmsLink('Austin crawlability benchmark pilot CSV', absoluteUrl('/research/austin-crawlability-benchmark-pilot.csv'), 'Bounded public fetch observations.')}
${llmsLink('Austin crawlability benchmark summary', absoluteUrl('/research/austin-crawlability-benchmark-summary.json'), 'Aggregate limits and counts for the pilot.')}

The Atlas demonstration is a dated, bounded capture from an open web corpus; it is not a client crawl or a measure of production coverage. The Appian and Texas toll-road materials are educational research, not investment advice or current recommendations. The authority files support reference and outreach workflows. They do not prove backlinks, Ahrefs Domain Rating movement, rankings, traffic, site health, revenue impact, or AI answer citations.

## Canonical Entities and Source Roles

${llmsLink('Canonical Person entity', PERSON_ID, 'Stable graph identifier anchored on the About page; the fragment is an entity ID, not a separate document.')}
${llmsLink('Primary identity source', PROFILE_FACTS.canonicalLinks.about, 'Current public profile and mainEntityOfPage for the Person entity.')}
${llmsLink('Official site root', PROFILE_FACTS.canonicalLinks.home, 'Canonical WebSite and publisher context.')}
${llmsLink('Code evidence', PROFILE_FACTS.canonicalLinks.github, 'Controlled public code profile; repository existence does not prove every product claim.')}
${llmsLink('Professional profile', PROFILE_FACTS.canonicalLinks.linkedin, 'Controlled corroborating profile; time-sensitive facts should be checked against visible dates.')}
${llmsLink('Technical work record', PROFILE_FACTS.canonicalLinks.technicalLedger, 'Separate technical ledger, not a duplicate canonical identity site.')}
- Use visible dates and linked public support for material claims.
- Do not infer private client names, rankings, traffic, revenue impact, or provider coverage from missing public data.
- Atlas is a crawl and evidence system; Void Agency is a fixed-scope technical SEO practice.

## Indexability Contract

${llmsLink('Canonical host', PROFILE_FACTS.canonicalLinks.home, 'The apex host is authoritative for this site.')}
- The www host redirects to the apex canonical host.
${llmsLink('XML sitemap', absoluteUrl('/sitemap.xml'), 'Only canonical HTML routes in this inventory are intended for indexing.')}
- Alias, merged, retired, prototype, sitemap-directory, and archive-methodology routes are omitted from the XML sitemap. Merged routes resolve by permanent redirect; retained nonindex routes emit noindex,follow.
- Canonical links, Open Graph URLs, WebPage URLs, Article URLs, and sitemap locations are required to converge on the same canonical URL.
${llmsLink('Resume redirect destination', PROFILE_FACTS.canonicalLinks.resume, 'The retired 2025 PDF resume alias redirects here.')}
- Search Console, Bing Webmaster Tools, and IndexNow submissions are discovery and recrawl signals; they do not prove rankings, indexing, traffic movement, or AI citations.

## Crawler Policy

${llmsLink('robots.txt', absoluteUrl('/robots.txt'), 'Host-scoped crawl preference; advisory rather than access control.')}
${llmsLink('Crawler policy source map', absoluteUrl('/research/ai-search-crawler-policy-sources.csv'), `Published row-level verification dates remain in the file; this policy contract was reviewed ${CRAWLER_POLICY_REVIEWED}.`)}
- ${searchCrawlerGroup.label}: ${searchCrawlerGroup.agents.join(', ')} are explicitly allowed.
- ${aiSearchCrawlerGroup.label}: ${aiSearchCrawlerGroup.agents.join(', ')} are explicitly allowed for public discovery.
- ${userRetrievalGroup.label}: ${userRetrievalGroup.agents.join(', ')} are explicitly allowed, but provider documentation determines whether robots.txt applies to a user-initiated fetch.
- ${modelDevelopmentGroup.label}: ${modelDevelopmentGroup.agents.join(', ')} are explicitly allowed as a deliberate public-crawl preference, independent of answer-search crawlers.
- User-Agent text alone does not authenticate a crawler. Server-log attribution should also use current provider-published IP ranges where available.
`;
}

export function buildProgrammaticSeoIndexJson() {
  const decisions = [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => {
    const route = SEO_ROUTES.find((candidate) => candidate.path === item.path);
    if (!route?.portfolioRoute) throw new Error(`${item.path}: missing portfolio migration decision.`);
    return {
      source_url: absoluteUrl(item.path),
      title: item.title,
      family: item.family,
      primary_query: 'primaryQuery' in item ? item.primaryQuery : null,
      owner_domain: route.portfolioRoute.ownerDomain,
      lifecycle: route.portfolioRoute.lifecycle,
      canonical: route.portfolioRoute.canonical,
      redirect_target: route.portfolioRoute.redirectTarget,
      last_meaningful_update: route.portfolioRoute.lastMeaningfulUpdate,
    };
  });

  return `${JSON.stringify({
    schema_version: 'technical_seo_migration_v1',
    generated_at: '2026-09-03',
    source_host: 'https://sulayman-bowles.dev',
    canonical_owner: 'https://www.void-agency.com',
    expansion_frozen: true,
    objective: 'Preserve an auditable source-to-destination map while VOID owns commodity technical SEO, platform, and audit-checklist intent.',
    claim_boundaries: [
      'The legacy source content remains in version control for provenance; production must serve a one-hop permanent redirect rather than duplicate HTML.',
      'A redirect deployment does not prove recrawl, canonical consolidation, rankings, impressions, clicks, links, leads, or revenue.',
      'New commodity route expansion stays frozen until each proposed page has distinct evidence, a durable owner, and an approved lifecycle decision.',
    ],
    routes: decisions,
  }, null, 2)}\n`;
}

export function buildArticleResearchBriefsJson() {
  return `${JSON.stringify({
    generated_at: '2026-07-26',
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
      last_verified: 'lastVerified' in target ? target.lastVerified : '2026-07-23',
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
          ? [absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH), absoluteUrl(TEXAS_TOLL_OWNERSHIP_JSON_PATH)]
          : []),
        ...target.relatedPaths.slice(0, index === 0 ? 3 : 2).map(absoluteUrl),
      ],
    };
  });
  return `${JSON.stringify({
    generated_at: '2026-09-03',
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
