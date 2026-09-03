import { ALL_ARTICLES, getArticlePath } from '../content/articleRegistry';
import { PROFILE_FACTS } from '../content/profileFacts';
import { PROGRAMMATIC_SEO_HUBS, PROGRAMMATIC_SEO_PAGES } from '../content/programmaticSeo';
import {
  TEXAS_TOLL_OWNERSHIP_CSV_PATH,
  TEXAS_TOLL_OWNERSHIP_ROWS,
} from '../content/texasTollRoadOwnership';
import {
  US_TOLL_PRIVATE_HYBRID_ROWS,
  US_TOLL_ROAD_METHODOLOGY_MARKDOWN,
  US_TOLL_ROAD_METHODOLOGY_PATH,
  US_TOLL_ROAD_OWNERSHIP_ARTICLE,
  US_TOLL_ROAD_PRIVATE_HYBRID_CSV_PATH,
  US_TOLL_ROAD_SOURCE_LEDGER_CSV_PATH,
  US_TOLL_ROAD_STATE_OVERVIEW_CSV_PATH,
  US_TOLL_STATE_OVERVIEW,
} from '../content/usTollRoadOwnershipArticle';
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

export function buildUsTollRoadStateOverviewCsv() {
  const header = ['jurisdiction', 'code', 'pattern', 'note'];
  const rows = US_TOLL_STATE_OVERVIEW.map((row) => [
    row.jurisdiction,
    row.code,
    row.pattern,
    row.note,
  ]);
  return `${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
}

export function buildUsTollRoadPrivateHybridCsv() {
  const header = [
    'facility',
    'states',
    'structure',
    'public_title_or_sponsor',
    'private_role_and_current_chain',
    'term_or_reversion',
    'confidence',
    'primary_source',
  ];
  const rows = US_TOLL_PRIVATE_HYBRID_ROWS.map((row) => [
    row.facility,
    row.states,
    row.structure,
    row.public,
    row.private_role,
    row.term,
    row.confidence,
    row.primary_source,
  ]);
  return `${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
}

export function buildUsTollRoadSourceLedgerCsv() {
  const header = ['source_id', 'label', 'url', 'last_verified', 'source_role'];
  const rows = US_TOLL_ROAD_OWNERSHIP_ARTICLE.sources.map((source, index) => [
    `S${String(index + 1).padStart(2, '0')}`,
    source.label,
    source.href,
    source.lastVerified ?? '',
    source.href.startsWith('https://')
      ? 'Primary public or first-party record'
      : 'Internal related investigation',
  ]);
  return `${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
}

export function buildUsTollRoadMethodologyMarkdown() {
  return US_TOLL_ROAD_METHODOLOGY_MARKDOWN.endsWith('\n')
    ? US_TOLL_ROAD_METHODOLOGY_MARKDOWN
    : `${US_TOLL_ROAD_METHODOLOGY_MARKDOWN}\n`;
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
  const programmaticLines = PROGRAMMATIC_SEO_PAGES
    .map((page) => llmsLink(page.title, absoluteUrl(page.path), `${page.family} diagnostic guide with a labeled evidence fixture and rerun gate.`))
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
${llmsLink('Technical SEO diagnostic library', absoluteUrl('/research/technical-seo'), 'Evidence-backed issue, platform, and audit-checklist guides.')}
${llmsLink('Technical SEO issue guides', absoluteUrl('/research/technical-seo/issues'), 'Diagnostic references organized by technical failure mode.')}
${llmsLink('Technical SEO platform guides', absoluteUrl('/research/technical-seo/platforms'), 'Platform-specific diagnostics and repair gates.')}
${llmsLink('Technical SEO audit checklists', absoluteUrl('/research/technical-seo/checklists'), 'Reusable audit procedures with acceptance checks.')}
${llmsLink('Markets finance filter', absoluteUrl('/markets'), 'Finance and infrastructure research subset.')}
${llmsLink('Void Agency', 'https://www.void-agency.com/', 'Separate canonical host for the technical SEO practice.')}
${llmsLink('Technical SEO audit services and process', absoluteUrl('/method'), 'Service method and engagement boundary.')}
${llmsLink('Austin technical SEO consultant and audit services', absoluteUrl('/austin-technical-seo'), 'Austin-scoped service page.')}
${llmsLink('Technical SEO consultant contact and audit intake', PROFILE_FACTS.canonicalLinks.contact, 'Direct inquiry and bounded brief path.')}
${llmsLink('Technical ledger', PROFILE_FACTS.canonicalLinks.technicalLedger, 'Separate record of experiments and technical work.')}

## Public Work and Research

${llmsLink(VIRALBENCH_ARTICLE_TITLE, absoluteUrl(VIRALBENCH_ARTICLE_PATH))}
${articleLines}
${programmaticLines}
${llmsLink('Atlas open-corpus CSV', absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv'), 'URL-level rows from the dated public demonstration.')}
${llmsLink('Atlas open-corpus capture manifest', absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.json'), 'Run scope, method, and claim limit.')}
${llmsLink('Appian educational research memo PDF', absoluteUrl('/research/appian-enterprise-software-durability-memo.pdf'), 'Educational research, not investment advice.')}
${llmsLink('Appian assumptions table CSV', absoluteUrl('/research/appian-assumptions-table.csv'), 'Companion assumptions table.')}
${llmsLink('Authority asset index', absoluteUrl('/research/authority-assets.json'), 'Typed index of public assets and their claim boundaries.')}
${llmsLink('Article research briefs', absoluteUrl('/research/article-research-briefs.json'), 'Intent, evidence-gap, artifact, and scope records.')}
${llmsLink('Technical SEO reference index', absoluteUrl('/research/technical-seo-reference-index.json'), 'Structured index of every programmatic diagnostic guide and its evidence boundaries.')}
${llmsLink('Texas toll-road ownership matrix', absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH), 'Dated source-linked ownership rows.')}
${llmsLink('U.S. toll-road state ownership overview', absoluteUrl(US_TOLL_ROAD_STATE_OVERVIEW_CSV_PATH), 'Map-ready 50-state and District of Columbia ownership categories.')}
${llmsLink('U.S. private and hybrid toll structures', absoluteUrl(US_TOLL_ROAD_PRIVATE_HYBRID_CSV_PATH), 'Material private-title, traffic-risk, availability-payment, and nonprofit records.')}
${llmsLink('U.S. toll-road ownership source ledger', absoluteUrl(US_TOLL_ROAD_SOURCE_LEDGER_CSV_PATH), 'Dated government, authority, concessionaire, and owner sources.')}
${llmsLink('U.S. toll-road ownership methodology', absoluteUrl(US_TOLL_ROAD_METHODOLOGY_PATH), 'Universe, grouping rules, confidence scale, and correction protocol.')}
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
- Alias, retired, prototype, and archive-methodology routes are omitted from the XML sitemap; generated noindex metadata is the route-level exclusion signal.
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
  return `${JSON.stringify({
    generated_at: '2026-07-20',
    canonical_host: 'https://sulayman-bowles.dev',
    objective: 'Evidence-backed technical SEO diagnostic references for issue, platform, and audit-checklist queries.',
    claim_boundaries: [
      'Fixtures are illustrative and Atlas-compatible; they are not client crawl evidence or claims about a live third-party site.',
      'Publication and discovery do not guarantee indexation, rankings, impressions, clicks, backlinks, leads, or revenue.',
      'A guide remains indexable only while it retains unique evidence, substantive utility, and a reproducible acceptance gate.',
    ],
    hubs: PROGRAMMATIC_SEO_HUBS.map((hub) => ({
      family: hub.family,
      url: absoluteUrl(hub.path),
      title: hub.title,
      description: hub.description,
      last_verified: hub.dateModified,
    })),
    pages: PROGRAMMATIC_SEO_PAGES.map((page) => ({
      family: page.family,
      url: absoluteUrl(page.path),
      title: page.title,
      primary_query: page.primaryQuery,
      supporting_queries: page.supportingQueries,
      direct_answer: page.directAnswer,
      evidence_artifact: page.evidenceArtifact,
      diagnostic_procedure: page.diagnosticProcedure,
      false_positive_boundary: page.falsePositiveBoundary,
      repair_steps: page.repairSteps,
      rerun_acceptance_check: page.rerunAcceptanceCheck,
      sources: page.sources,
      related_pages: page.relatedPaths.map(absoluteUrl),
      cta: { label: page.cta.label, url: absoluteUrl(page.cta.href) },
      indexability_state: page.indexabilityState,
      indexable: page.indexable,
      last_verified: page.dateModified,
    })),
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
          ? [absoluteUrl(TEXAS_TOLL_OWNERSHIP_CSV_PATH)]
          : []),
        ...target.relatedPaths.slice(0, index === 0 ? 3 : 2).map(absoluteUrl),
      ],
    };
  });
  const cornerstoneAssets = PROGRAMMATIC_SEO_PAGES
    .filter((page) => page.family === 'platform')
    .map((page) => ({
      priority: 1,
      name: page.title,
      url: absoluteUrl(page.path),
      type: 'technical_seo_cornerstone',
      cluster: 'technical-seo-platforms',
      preferred_anchor: page.primaryQuery,
      pitch_angle: `A platform-specific ${page.primaryQuery} reference with a labeled evidence fixture, false-positive boundary, repair sequence, and rerun gate.`,
      supporting_assets: [
        absoluteUrl('/research/technical-seo-reference-index.json'),
        ...page.sources.map((source) => source.href),
      ],
    }));

  return `${JSON.stringify({
    generated_at: '2026-07-26',
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
      {
        priority: 1,
        name: 'Technical SEO Diagnostic Library',
        url: absoluteUrl('/research/technical-seo'),
        type: 'research_hub',
        cluster: 'technical-seo',
        preferred_anchor: 'technical SEO diagnostic library',
        pitch_angle: 'Forty issue, platform, checklist, and collection routes governed by evidence, false-positive, repair, and rerun contracts.',
        supporting_assets: [absoluteUrl('/research/technical-seo-reference-index.json')],
      },
      ...cornerstoneAssets,
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
        ['/method', 'Void Agency Method', 'technical-seo', 'technical SEO audit method', 'A fixed-scope audit method organized around crawl evidence, implementation priorities, and reviewable handoff.'],
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
