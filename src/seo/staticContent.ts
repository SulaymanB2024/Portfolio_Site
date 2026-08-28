import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  buyerDecisionEvidence,
  contactBuyerQuestions,
  contactDecisionProtocol,
  contactIntakeNotes,
  contactResponsePaths,
} from '../content/evidenceLists';
import { getArticleByPath } from '../content/articleRegistry';
import { isInvestmentMemo, type ArticleResource, type ArticleSection } from '../content/articleModels';
import { PUBLIC_MARKET_THESES } from '../content/marketTheses';
import { PUBLICATION_CATEGORY_SUMMARY, PUBLICATION_INDEX } from '../content/publicationIndex';
import {
  getProgrammaticPagesByFamily,
  getProgrammaticSeoHub,
  getProgrammaticSeoPage,
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
} from '../content/programmaticSeo';
import { PROFILE_FACTS, formatEducation, formatIsoDate } from '../content/profileFacts';
import {
  appianAssumptionRows,
  atlasSampleFindings,
  atlasSampleRows,
  auditExampleFindingChain,
  austinBenchmarkSnapshot,
  austinDiagnosticExamples,
  austinPilotMethod,
  contextualProofLinks,
  RESEARCH_ASSETS,
  researchContextLinks,
  workProofCards,
} from '../content/seoExpansion';
import {
  AI_MANAGER_CASES,
  AI_MANAGER_FAQS,
  AI_MANAGER_OPEN_QUESTIONS,
  AI_MANAGER_SOURCES,
  AI_MANAGERS_ARTICLE_CONCLUSION,
  AI_MANAGERS_ARTICLE_DESCRIPTION,
  AI_MANAGERS_ARTICLE_DISPLAY_TITLE,
  AI_MANAGERS_ARTICLE_LEDE,
  AI_MANAGERS_ARTICLE_PATH,
  AI_MANAGERS_ARTICLE_SECTIONS,
  AI_MANAGERS_ARTICLE_TITLE,
} from '../content/aiManagersArticle';
import { canonicalizeKnownExternalLinks } from '../content/canonicalExternalLinks';
import {
  VIRALBENCH_ARTICLE_EXCERPT,
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_INLINE_IMAGE,
  VIRALBENCH_ARTICLE_MARKDOWN,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import { primaryNav, utilityNav } from '../content/siteNavigation';
import {
  TEXAS_TOLL_ARTICLE_CONCLUSION,
  TEXAS_TOLL_ARTICLE_DESCRIPTION,
  TEXAS_TOLL_ARTICLE_FACT_GAPS,
  TEXAS_TOLL_ARTICLE_FAQS,
  TEXAS_TOLL_ARTICLE_LEDE_MARKDOWN,
  TEXAS_TOLL_ARTICLE_SECTIONS,
  TEXAS_TOLL_ARTICLE_SLUG,
  TEXAS_TOLL_ARTICLE_SOURCES,
  TEXAS_TOLL_ARTICLE_TABLES,
  TEXAS_TOLL_ARTICLE_TITLE,
  type TexasTollArticleTable,
} from '../content/texasTollRoadArticle';
import {
  TEXAS_TOLL_DIRECT_ANSWER,
  TEXAS_TOLL_OWNERSHIP_CSV_PATH,
  TEXAS_TOLL_OWNERSHIP_ROWS,
} from '../content/texasTollRoadOwnership';
import { markdownToHtml } from '../utils/markdownToHtml';
import { getArticleRelatedLinkLabel, getArticleSearchTarget } from './articleSearchTargets';
import { getSeoRoute, type SeoRoute } from './routes';

type LinkItem = {
  label: string;
  href: string;
  description?: string;
};

const primaryLinks: LinkItem[] = [
  { label: 'Home', href: '/', description: 'Portfolio homepage and selected work.' },
  ...primaryNav.map(({ label, href, description }) => ({ label, href, description })),
  ...utilityNav.map(({ label, href, description }) => ({ label, href, description })),
];

function getSeoRouteLabel(path: string) {
  return getSeoRoute(path)?.h1 ?? path;
}

const atlasProcess = [
  ['Crawl', 'High-fidelity crawling with smart rate control, JavaScript rendering, and adaptive discovery to map the site as search engines do.'],
  ['Extract', 'Extract content, links, directives, structured data, signals, and performance data from every discovered URL.'],
  ['Interpret', 'Normalize and connect signals into an understanding of architecture, intent, and indexation potential.'],
  ['Score', 'Score issues by severity, confidence, affected URLs, implementation effort, and source quality using documented audit rules.'],
  ['Report', 'Structure operator-ready reports, preview packages, and task lists with source notes and recommended actions.'],
];

const atlasOutputs = [
  ['Issue Detection', 'Prioritized technical issues with impact scoring, severity labels, crawler observations, and remediation steps.'],
  ['Internal Link Graph', 'A map of flow, crawl depth, orphan risk, inlinks, outlinks, and authority distribution across important pages.'],
  ['Indexation Overview', 'Crawlable versus indexable status across valid sitemap entries, noindex headers, canonical gaps, and robots-blocked URLs.'],
  ['Technical Findings', 'Examples with affected URLs, confidence, source notes, and next implementation actions.'],
  ['Export Preview', 'Sample executive summaries, technical audit sections, issue tables, crawl data layouts, and dashboard views for operators.'],
];

const methodColumns = [
  ['Crawl', 'Map the site as search engines see it. Inspect indexable URLs, crawl depth, sitemaps, robots rules, redirects, canonicals, metadata, templates, and internal links.'],
  ['Diagnose', 'Find the issues that affect discovery, indexation, and conversion paths. Every finding is tied to observed data, affected URLs, severity, and implementation context.'],
  ['Repair', 'Turn the audit into implementation work: fix architecture, consolidate weak pages, improve metadata, strengthen schema, clean internal links, correct crawl waste, and improve page speed.'],
  ['Measure', 'Track what changed after implementation: indexation, search queries, page performance, crawl behavior, and conversion events where analytics access supports it.'],
];

const methodCaseStudies = [
  {
    title: 'Indexation Audit at Scale',
    copy: 'Mapped thousands of URLs to uncover crawl waste, duplicate templates, weak canonicals, orphaned pages, redirect chains, and pages blocked from meaningful discovery.',
    href: '/atlas',
    cta: 'Open Atlas page',
  },
  {
    title: 'Public Page Clarity Review',
    copy: 'Reviewed whether a company could be understood clearly from its public pages. Tested entity clarity, page structure, schema, source material, and crawler access.',
    href: '/about',
    cta: 'Open profile page',
  },
  {
    title: 'Product Discovery System',
    copy: 'Audited product and collection pages to find missing metadata, thin templates, weak internal links, duplicate paths, and search-intent gaps.',
    href: '/contact',
    cta: 'Request product audit',
  },
  {
    title: 'Service-Area Visibility Audit',
    copy: 'Mapped location pages, service pages, Google Business Profile signals, crawl structure, and local entity clarity to improve discovery in high-intent searches.',
    href: '/austin-technical-seo',
    cta: 'Open local SEO page',
  },
];

const methodDeliverables = [
  ['URL-level findings', 'A table of affected URLs, observed issue, evidence source, severity, owner, and implementation note.'],
  ['Priority repair plan', 'A short order of operations for crawlability, indexation, internal links, page templates, structured data, and conversion paths.'],
  ['Evidence appendix', 'Crawl rows, screenshots or rendered observations where useful, sitemap/robots notes, and analytics references when access is available.'],
  ['Rerun checklist', 'The specific checks to run after fixes ship so the team can separate implementation completion from actual search movement.'],
];

const methodTimeline = [
  ['Day 0', 'Confirm scope, canonical domain, priority pages, target queries or page types, access boundaries, and the business decision the audit must support.'],
  ['Days 1-3', 'Run the crawl, inspect templates, review source pages, and map visible issues to affected URLs and owner-ready fixes.'],
  ['Days 4-5', 'Deliver the prioritized findings, implementation notes, and measurement plan. Larger sites can split this into crawl, template, and analytics phases.'],
];

const methodRequiredAccess = [
  ['Public site', 'Canonical domain, staging or production URL, known important pages, sitemap URL, and any launch or migration context.'],
  ['Optional analytics', 'Google Search Console, GA4, CMS, log files, or rank-tracking exports can improve prioritization, but the public crawl can start without them.'],
  ['Implementation context', 'CMS or framework constraints, developer availability, previous SEO changes, and any pages that should stay private or out of scope.'],
];

const methodExclusions = [
  ['No ranking guarantees', 'The audit can identify crawl, indexation, page, and measurement problems. It does not promise rankings, traffic, AI citations, or revenue movement.'],
  ['No generic content package', 'The work can identify missing page substance and intent gaps, but it is not a bulk blog calendar or outsourced publishing retainer.'],
  ['No credential-first work', 'Private credentials, API keys, and production access should not be sent through the public form and are not required before scope is agreed.'],
];

const methodMeasurementPlan = [
  ['After implementation', 'Rerun crawl checks, inspect changed pages, verify canonical/indexation behavior, and confirm the expected pages are still internally reachable.'],
  ['Search data window', 'Track Search Console query groups, indexed URLs, landing pages, crawl errors, and page-level changes over a realistic post-ship window.'],
  ['Conversion path', 'Review whether audit-relevant CTAs, form submissions, phone/email clicks, and analytics events are measurable from the fixed pages.'],
];

const austinBuyerFit = [
  'Austin founders, local service owners, and small growth teams that need to know whether their important pages can be crawled, understood, and measured.',
  'Teams with a site redesign, new service page, local landing page, or migration that needs a technical review before more content is added.',
  'Operators who want a short implementation list, not a broad SEO retainer or vague visibility score.',
];

const austinDeliverables = [
  'A short URL-level issue list with observed fields, affected pages, severity, and implementation notes.',
  'A crawlability and source-clarity review covering robots.txt, sitemap, canonicals, structured data, internal links, and page copy.',
  'A local-intent map that pairs each priority query family with the ranking URL, proof block, CTA path, and measurement field.',
  'A practical next-step order for founders, marketers, or developers, with unsupported ranking and traffic claims left out.',
];

const austinAuditCoverage = [
  ['Crawlability and indexation audit', 'Review robots.txt, XML sitemaps, status codes, redirects, canonicals, noindex rules, crawl paths, and priority Austin service pages.'],
  ['JavaScript rendering and templates', 'Compare raw and rendered HTML and identify content, links, metadata, or structured data that depend on client-side rendering.'],
  ['Site architecture and internal links', 'Map crawl depth, orphan risk, navigation, anchor text, service-page relationships, and internal links supporting local commercial intent.'],
  ['Structured data and AI search readiness', 'Review entity clarity, schema, public source files, crawler access, and the evidence available to search engines and AI answer systems.'],
];

const austinWhenNotToHire = [
  'You need paid ads, social media management, generic blog production, or guaranteed local rankings.',
  'You cannot make website changes or give a developer enough context to implement the fixes.',
  'The problem is mainly branding, sales process, offer clarity, or operations rather than crawlability, indexation, page structure, or measurement.',
];

const homeDisciplines = [
  ['Technical SEO Systems', 'Crawl architecture, indexability, internal links, page templates, metadata, structured data, performance inputs, and issue logic. Built for diagnosis, not vague scoring.'],
  ['Search Visibility', 'Crawler access, entity clarity, structured data, and pages that explain the work without forcing a reader to guess.'],
  ['Atlas / Crawl Data', 'URL discovery, raw and rendered HTML, canonical state, internal-link maps, structured-data checks, and report-ready audit notes.'],
  ['Markets Research', 'Finance research, valuation assumptions, market structure, operating analysis, dashboards, and decision tools built around inspectable assumptions.'],
  ['Product + Web Systems', 'React interfaces, portfolio pages, audit dashboards, product research, and written explanations that make the work easier to inspect.'],
];

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function paragraphList(items: string[]) {
  return items.map((item) => `<p>${escapeHtml(item)}</p>`).join('\n        ');
}

function definitionCards(items: string[][]) {
  return items
    .map(([title, ...body]) => `<h3>${escapeHtml(title)}</h3><p>${body.map(escapeHtml).join(' ')}</p>`)
    .join('\n        ');
}

function objectDefinitionCards(items: Array<{ label: string; copy: string }>) {
  return items.map((item) => `<h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.copy)}</p>`).join('\n        ');
}

function evidenceGroupCards() {
  return [
    { title: 'Captured page state', items: ['HTTP response state', 'raw source body', 'rendered-page comparison', 'captured timestamp'] },
    { title: 'Derived review state', items: ['traceable finding', 'confidence level', 'failure or gap state', 'CSV and JSON export'] },
  ]
    .map(
      (group) =>
        `<h3>${escapeHtml(group.title)}</h3><ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`,
    )
    .join('\n        ');
}

function evidenceLinkCards(items: Array<{ category?: string; label: string; href: string; proves: string }>) {
  return items
    .map((item) => {
      const title = item.category ? `${item.category}: ${item.label}` : item.label;
      return `<h3><a href="${item.href}">${escapeHtml(title)}</a></h3><p>${escapeHtml(item.proves)}</p>`;
    })
    .join('\n        ');
}

function linkList(items: LinkItem[]) {
  return `<ul>${items
    .map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a>${item.description ? ` - ${escapeHtml(item.description)}` : ''}</li>`)
    .join('')}</ul>`;
}

function linkCards(items: Array<{ label: string; href: string; description?: string }>) {
  return items
    .map(
      (item) =>
        `<h3><a href="${item.href}">${escapeHtml(item.label)}</a></h3><p>${escapeHtml(item.description ?? '')}</p>`,
    )
    .join('\n        ');
}

function methodCaseStudyCards() {
  return methodCaseStudies
    .map(
      (item) =>
        `<h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.copy)}</p><p><a href="${item.href}">${escapeHtml(item.cta)}</a></p>`,
    )
    .join('\n        ');
}

function atlasSampleTableStaticHtml() {
  return `<table>
          <thead><tr><th>URL</th><th>Status</th><th>Indexability</th><th>Depth</th><th>Inlinks</th><th>Outlinks</th><th>Canonical</th><th>Issue</th><th>Evidence note</th></tr></thead>
          <tbody>
          ${atlasSampleRows
            .map(
              (row) =>
                `<tr><td>${escapeHtml(row.url)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(row.indexability)}</td><td>${escapeHtml(row.depth)}</td><td>${escapeHtml(row.inlinks)}</td><td>${escapeHtml(row.outlinks)}</td><td>${escapeHtml(row.canonical)}</td><td>${escapeHtml(row.issue)}</td><td>${escapeHtml(row.note)}</td></tr>`,
            )
            .join('\n          ')}
          </tbody>
        </table>`;
}

function appianAssumptionTableStaticHtml() {
  return `<table>
          <thead><tr><th>Category</th><th>Variable</th><th>Base case</th><th>Downside case</th><th>Boundary</th></tr></thead>
          <tbody>
          ${appianAssumptionRows
            .map(
              (row) =>
                `<tr><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.variable)}</td><td>${escapeHtml(row.baseCase)}</td><td>${escapeHtml(row.downsideCase)}</td><td>${escapeHtml(row.boundary)}</td></tr>`,
            )
            .join('\n          ')}
          </tbody>
        </table>`;
}

function articleShell(title: string, intro: string, body: string) {
  return `<article class="route-static-content">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(intro)}</p>
        ${body}
      </article>`;
}

function articleSearchBriefStaticHtml(path: string, options: { includeDirectAnswer?: boolean } = {}) {
  const target = getArticleSearchTarget(path);
  if (!target) return '';
  const includeDirectAnswer = options.includeDirectAnswer ?? true;

  return `<section ${includeDirectAnswer ? 'aria-labelledby="direct-answer-title"' : 'aria-label="Article research brief"'}>
        ${includeDirectAnswer ? `<h2 id="direct-answer-title">Direct answer: ${escapeHtml(target.primaryQuery)}</h2>
        <p>${escapeHtml(target.directAnswer)}</p>` : ''}
        <h3>Original research artifact</h3>
        <p>${escapeHtml(target.originalArtifact)}</p>
        <h3>What this page adds</h3>
        <p>${escapeHtml(target.serpGap)}</p>
        <h3>Related research</h3>
        ${linkList(target.relatedPaths.map((relatedPath) => {
          return {
            href: relatedPath,
            label: getArticleRelatedLinkLabel(path, relatedPath),
          };
        }))}
      </section>`;
}

function texasTollOwnershipLookupStaticHtml() {
  const rows = TEXAS_TOLL_OWNERSHIP_ROWS.map(
    (row) => `<tr>
            <th scope="row">${escapeHtml(row.facility)}<br /><small>${escapeHtml(row.region)}</small></th>
            <td>${escapeHtml(row.physicalOwner)}</td>
            <td><strong>${escapeHtml(row.operator)}</strong><br /><small>${escapeHtml(row.tollRevenueClaimant)}</small></td>
            <td>${escapeHtml(row.privateRightsStatus)}<br /><small>${escapeHtml(row.term)}</small></td>
            <td>${escapeHtml(row.billingAgency)}<br /><small>${row.sourceIds.map((sourceId) => `<a href="#source-${sourceId}">${sourceId.toUpperCase()}</a>`).join(', ')}</small></td>
          </tr>`,
  ).join('\n          ');

  return `<section id="ownership-lookup" aria-labelledby="ownership-lookup-title">
        <h2 id="ownership-lookup-title">Are Texas toll roads privately owned?</h2>
        <p>${escapeHtml(TEXAS_TOLL_DIRECT_ANSWER)}</p>
        <p>Use this lookup to separate the physical owner from the operator, toll-revenue claimant, private-rights status, and billing agency. It also answers “Are toll roads in Texas privately owned?” and “Who owns Texas toll roads?” at the facility level.</p>
        <table>
          <thead><tr><th>Facility or system</th><th>Physical owner</th><th>Operator / revenue claimant</th><th>Private rights</th><th>Billing agency</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p><a href="${TEXAS_TOLL_OWNERSHIP_CSV_PATH}" download>Download the complete Texas toll-road ownership matrix (CSV)</a> · <a href="https://www.txdot.gov/discover/toll-roads-managed-lanes/txdot-toll-roads.html">Compare TxDOT’s current operator inventory</a></p>
      </section>`;
}

function viralBenchArticleStaticHtml() {
  const evidenceLayerHeading = '<h2 id="the-evidence-layer-comes-before-the-codex-layer">The evidence layer comes before the Codex layer</h2>';
  const architectureFigure = `<figure>
          <img src="/images/viralbench-codex-harness.svg" width="1200" height="630" alt="Architecture showing ViralBench as a live marketing-agent loop, an immutable evidence and evaluation layer, and Codex improving the system through isolated experiments." />
          <figcaption>ViralBench inner marketing-agent loop, evidence and evaluation layer, and Codex outer engineering loop.</figcaption>
        </figure>`;
  const inlineFigure = `<figure>
          <img src="${VIRALBENCH_ARTICLE_INLINE_IMAGE}" width="1672" height="941" alt="An abstract monochrome room filled with speech bubbles connected by fine lines and flowing data-like strands." />
        </figure>`;
  const articleHtml = markdownToHtml(canonicalizeKnownExternalLinks(VIRALBENCH_ARTICLE_MARKDOWN)).replace(
    evidenceLayerHeading,
    `${architectureFigure}\n        ${evidenceLayerHeading}\n        ${inlineFigure}`,
  );

  return `<figure>
          <img src="${VIRALBENCH_ARTICLE_IMAGE}" width="1800" height="1200" alt="A dark gallery of suspended social-media posts receding toward a bright exit, with a dotted path curving through the space." />
        </figure>
        ${articleHtml}
        <h2 id="article-conclusion-title">The harness determines whether the agent can learn</h2>
        <p>ViralBench supplies a live multimodal environment; the durable system is the evidence layer that makes each change replayable, reviewable, and independently evaluated before any promotion.</p>
        <h2>Source ledger</h2>
        ${linkList([
          { href: 'https://viralbench.ai/', label: 'ViralBench live methodology' },
          { href: 'https://github.com/JibranK12345/Viral-Bench', label: 'ViralBench public repository' },
          { href: 'https://openai.com/index/harness-engineering/', label: 'OpenAI harness engineering' },
          { href: 'https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop', label: 'OpenAI agent improvement loop' },
          { href: 'https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content', label: 'TikTok AI-generated content policy' },
        ])}`;
}

function articleSectionsStaticHtml(sections: ArticleSection[]) {
  return sections.map((section) => {
    const table = section.table
      ? `<figure>
          <figcaption>${escapeHtml(section.table.caption)}</figcaption>
          <table>
            <thead><tr>${section.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead>
            <tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </figure>`
      : '';
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
    const codeExamples = section.codeExamples?.map(
      (example) => `<figure>
          <figcaption><strong>${escapeHtml(example.title)}</strong> — ${escapeHtml(example.description)}</figcaption>
          <pre><code>${escapeHtml(example.code)}</code></pre>
        </figure>`,
    ).join('\n        ') ?? '';
    const figures = section.figures?.map(
      (figure) => `<figure>
          <img src="${escapeHtml(figure.src)}" width="${figure.width}" height="${figure.height}" alt="${escapeHtml(figure.alt)}" />
          <figcaption><strong>${escapeHtml(figure.label)}</strong> — ${escapeHtml(figure.caption)}</figcaption>
        </figure>`,
    ).join('\n        ') ?? '';

    return `<section aria-labelledby="${section.id}-title">
        <h2 id="${section.id}-title">${escapeHtml(section.title)}</h2>
        ${paragraphList(section.paragraphs)}
        ${bullets}
        ${figures}
        ${table}
        ${codeExamples}
      </section>`;
  }).join('\n        ');
}

function articleResourcesStaticHtml(resources: ArticleResource[]) {
  return `<section aria-labelledby="article-downloads-title">
        <h2 id="article-downloads-title">Downloads</h2>
        <p>The web article is the reading layer. These files preserve the supplied source package and model.</p>
        <ul>${resources.map((resource) => `<li>
          <a href="${escapeHtml(resource.href)}">${escapeHtml(resource.label)} (${escapeHtml(resource.format)})</a>
          — ${escapeHtml(resource.description)}
        </li>`).join('')}</ul>
      </section>`;
}

function texasTollTableStaticHtml(table: TexasTollArticleTable) {
  return `<table>
          <caption>${escapeHtml(table.caption)}</caption>
          <thead><tr>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead>
          <tbody>
          ${table.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
            .join('\n          ')}
          </tbody>
        </table>
        ${table.note ? `<p>${escapeHtml(table.note)}</p>` : ''}`;
}

function texasTollArticleStaticHtml() {
  const tableById = new Map(TEXAS_TOLL_ARTICLE_TABLES.map((table) => [table.id, table]));
  const sections = TEXAS_TOLL_ARTICLE_SECTIONS.map((section) => {
    const blocks = section.blocks.map((block) => {
      if (block.kind === 'markdown') return markdownToHtml(block.markdown);
      const table = tableById.get(block.tableId);
      return table ? texasTollTableStaticHtml(table) : '';
    });
    return `<h2 id="${section.id}">${escapeHtml(section.title)}</h2>${blocks.join('\n        ')}`;
  }).join('\n        ');
  const factGaps = TEXAS_TOLL_ARTICLE_FACT_GAPS.map(
    (group) => `<h3>${escapeHtml(group.title)}</h3>${markdownToHtml(group.items.map((item) => `- ${item}`).join('\n'))}`,
  ).join('\n        ');
  const faqs = TEXAS_TOLL_ARTICLE_FAQS.map(
    (faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`,
  ).join('\n        ');
  const sources = TEXAS_TOLL_ARTICLE_SOURCES.map(
    (source) => `<li id="source-${source.id}"><strong>${escapeHtml(`${source.id.toUpperCase()}: ${source.label}`)}</strong><p>${escapeHtml(source.note)}</p>${source.hrefs.map((href, index) => `<a href="${href}">${escapeHtml(source.hrefs.length > 1 ? `Open source ${index + 1}` : 'Open source')}</a>`).join(' ')}</li>`,
  ).join('\n          ');

  return articleShell(
    TEXAS_TOLL_ARTICLE_TITLE,
    TEXAS_TOLL_ARTICLE_DESCRIPTION,
    `${texasTollOwnershipLookupStaticHtml()}
        ${articleSearchBriefStaticHtml(`/markets/${TEXAS_TOLL_ARTICLE_SLUG}`, { includeDirectAnswer: false })}
        ${markdownToHtml(TEXAS_TOLL_ARTICLE_LEDE_MARKDOWN)}
        ${sections}
        <h2 id="analyst-model-screen">Analyst model screening</h2>
        <p><strong>Scenario, not price.</strong> These 2025-base finite-life DCF ranges are analyst screening estimates, not bids, carrying values, appraisals, fairness opinions, or current security quotations.</p>
        <table>
          <thead><tr><th>Project</th><th>Bear EV</th><th>Base EV</th><th>Bull EV</th><th>Base equity</th><th>Base discount rate</th><th>Input status</th></tr></thead>
          <tbody>
            <tr><td>North Tarrant Express</td><td>$2.88B</td><td>$4.44B</td><td>$6.91B</td><td>$2.84B</td><td>7.25%</td><td>DFW inputs source-backed</td></tr>
            <tr><td>LBJ Express</td><td>$1.89B</td><td>$2.95B</td><td>$4.50B</td><td>$0.91B</td><td>7.50%</td><td>DFW inputs source-backed</td></tr>
            <tr><td>NTE 35W</td><td>$2.74B</td><td>$4.72B</td><td>$8.12B</td><td>$3.12B</td><td>7.75%</td><td>DFW inputs source-backed</td></tr>
            <tr><td>SH 130 Segments 5–6</td><td>$0.56B</td><td>$0.99B</td><td>$2.12B</td><td>$0.54B</td><td>9.00%</td><td>Revenue, EBITDA, and $450M debt estimated</td></tr>
          </tbody>
        </table>
        <p>The model holds margins constant and simplifies maintenance, sharing, cash tax, and handback reserves. It omits a levered debt-service schedule, refinancing, swaps, working capital, tax basis, and explicit growth capex. SH 130 inputs are analyst estimates.</p>
        <h2 id="what-remains-unknown">What remains unknown</h2>
        <p>Missing cap-table rights, debt schedules, or current financial statements are measurement gaps, not evidence for or against the asset.</p>
        ${factGaps}
        <h2 id="frequently-asked-questions">Frequently asked questions</h2>
        ${faqs}
        <h2 id="source-ledger">Source ledger</h2>
        <ol>${sources}</ol>
        <h2 id="article-conclusion-title">${escapeHtml(TEXAS_TOLL_ARTICLE_CONCLUSION.title)}</h2>
        <p>${escapeHtml(TEXAS_TOLL_ARTICLE_CONCLUSION.content)}</p>
        <h2>Related research</h2>
        ${linkList([
          { label: 'Markets research', href: '/markets' },
          { label: 'Research assets', href: '/research' },
          { label: 'Source methodology', href: '/research/search-console/technical-seo-public-data-infrastructure' },
          { label: 'About the author', href: '/about' },
        ])}`,
  );
}

function aiManagersArticleStaticHtml() {
  const sections = AI_MANAGERS_ARTICLE_SECTIONS.map(
    (section) => `<section id="${section.id}" aria-labelledby="${section.id}-title">
        <h2 id="${section.id}-title">${escapeHtml(section.title)}</h2>
        ${markdownToHtml(section.markdown)}
      </section>`,
  ).join('\n        ');
  const cases = AI_MANAGER_CASES.map(
    (item) => `<li>
        <h3>${escapeHtml(`${item.name} — Grade ${item.grade}`)}</h3>
        <p>${escapeHtml(`${item.form}; ${item.geography}.`)}</p>
        <p><strong>Agent authority:</strong> ${escapeHtml(item.authority)}</p>
        <p><strong>Human layer:</strong> ${escapeHtml(item.humanLayer)}</p>
        <p><strong>Economics:</strong> ${escapeHtml(item.economics)}</p>
        <p><strong>Evidence limit:</strong> ${escapeHtml(item.caveat)}</p>
        <p><a href="${item.href}">Open case source</a></p>
      </li>`,
  ).join('\n        ');
  const faqs = AI_MANAGER_FAQS.map(
    (faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`,
  ).join('\n        ');
  const sources = AI_MANAGER_SOURCES.map(
    (source) => `<li id="source-${source.id}">
        <h3>${escapeHtml(`${source.id.toUpperCase()}: ${source.label}`)}</h3>
        <p>${escapeHtml(`${source.publisher}; ${source.date}; ${source.type}.`)}</p>
        <p>${escapeHtml(source.note)}</p>
        <p><strong>Limit:</strong> ${escapeHtml(source.limitation)}</p>
        <p><a href="${source.href}">${escapeHtml(source.href.startsWith('#') ? 'Open field map' : 'Open source')}</a></p>
      </li>`,
  ).join('\n        ');

  return articleShell(
    AI_MANAGERS_ARTICLE_TITLE,
    AI_MANAGERS_ARTICLE_DESCRIPTION,
    `<p><a href="/research">Research archive</a> · AI systems · Published July 14, 2026 · By <a href="/about">Sulayman Bowles</a></p>
      <h2>${escapeHtml(AI_MANAGERS_ARTICLE_DISPLAY_TITLE)}</h2>
      <p><strong>Short answer:</strong> AI can run the next action. It still cannot reliably preserve the company.</p>
      ${articleSearchBriefStaticHtml(AI_MANAGERS_ARTICLE_PATH)}
      <p><strong>Evidence boundary:</strong> Operator dashboards are unaudited. Simulations are not businesses. Human legal, financial, physical, and supervisory work remains part of every live case.</p>
      ${markdownToHtml(AI_MANAGERS_ARTICLE_LEDE)}
      ${sections}
      <section aria-labelledby="case-field-title">
        <h2 id="case-field-title">Explore all 30 reviewed cases</h2>
        <p>Grades describe evidence quality and operating reality, not commercial success.</p>
        <ol>${cases}</ol>
      </section>
      <section aria-labelledby="open-questions-title">
        <h2 id="open-questions-title">Open questions</h2>
        <ul>${AI_MANAGER_OPEN_QUESTIONS.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ul>
      </section>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        ${faqs}
      </section>
      <section aria-labelledby="source-ledger-title">
        <h2 id="source-ledger-title">Source ledger</h2>
        <ol>${sources}</ol>
      </section>
      <section id="article-conclusion" aria-labelledby="article-conclusion-title">
        <h2 id="article-conclusion-title">${escapeHtml(AI_MANAGERS_ARTICLE_CONCLUSION.title)}</h2>
        <p>${escapeHtml(AI_MANAGERS_ARTICLE_CONCLUSION.content)}</p>
      </section>`,
  );
}

export function buildRouteStaticHtml(route: SeoRoute) {
  const programmaticHub = getProgrammaticSeoHub(route.path);
  if (programmaticHub) {
    const pages = programmaticHub.family === 'all'
      ? PROGRAMMATIC_SEO_PAGES
      : getProgrammaticPagesByFamily(programmaticHub.family);
    const collectionLinks = programmaticHub.family === 'all'
      ? `<h2>Diagnostic collections</h2>${linkList(PROGRAMMATIC_SEO_HUBS.filter((hub) => hub.family !== 'all').map((hub) => ({ label: hub.title, href: hub.path, description: hub.description })))}`
      : `<p><a href="/research/technical-seo">Technical SEO diagnostic library</a></p>`;

    return articleShell(
      programmaticHub.title,
      programmaticHub.directAnswer,
      `${collectionLinks}
        <h2>${pages.length} evidence-backed guides</h2>
        ${pages.map((page) => `<h3><a href="${page.path}">${escapeHtml(page.title)}</a></h3><p>${escapeHtml(page.description)}</p>`).join('\n        ')}
        <h2>Implementation boundaries</h2>
        ${linkList([
          { label: 'Read the technical SEO audit method', href: '/method', description: 'Service-process intent remains on the method route.' },
          { label: 'Contact Sulayman Bowles', href: '/contact', description: 'Conversion and audit-intake endpoint.' },
          { label: 'Return to the research archive', href: '/research', description: 'Research notes and public evidence.' },
        ])}`,
    );
  }

  const programmaticPage = getProgrammaticSeoPage(route.path);
  if (programmaticPage) {
    const familyHub = `/research/technical-seo/${programmaticPage.family === 'issue' ? 'issues' : programmaticPage.family === 'platform' ? 'platforms' : 'checklists'}`;

    return articleShell(
      programmaticPage.title,
      programmaticPage.directAnswer,
      `<section aria-labelledby="artifact-title">
        <h2 id="artifact-title">Atlas-compatible evidence fixture for ${escapeHtml(programmaticPage.primaryQuery)}</h2>
        <p><strong>${escapeHtml(programmaticPage.evidenceArtifact.label)}.</strong> ${escapeHtml(programmaticPage.evidenceArtifact.description)}</p>
        <p>Fixture fields: ${escapeHtml(programmaticPage.evidenceArtifact.fields.map((field) => `${field} ${programmaticPage.slug.replaceAll('-', '').toUpperCase()}`).join(', '))}.</p>
      </section>
      ${articleSectionsStaticHtml(programmaticPage.sections)}
      <section aria-labelledby="sources-title">
        <h2 id="sources-title">Source ledger</h2>
        ${linkList(programmaticPage.sources.map((source) => ({ label: source.label, href: source.href, description: `Last verified ${source.lastVerified}.` })))}
      </section>
      <section aria-labelledby="related-title">
        <h2 id="related-title">Related diagnostics for ${escapeHtml(programmaticPage.primaryQuery)}</h2>
        <p>Continue the ${escapeHtml(programmaticPage.primaryQuery)} investigation through its family, evidence foundation, service method, or conversion endpoint.</p>
        ${linkList([
          { label: `${programmaticPage.family} guide collection`, href: familyHub },
          { label: 'Technical SEO diagnostic library', href: '/research/technical-seo' },
          ...programmaticPage.relatedPaths.map((href) => ({ label: getSeoRouteLabel(href), href })),
          { label: 'Technical SEO audit method', href: '/method' },
          { label: programmaticPage.cta.label, href: programmaticPage.cta.href },
        ])}
      </section>`,
    );
  }

  if (route.path === '/research') {
    return articleShell(
      'Research Notes',
      'Selected notes on search systems, crawlability, Atlas, public data, and markets work.',
      `<h2>Four Research Categories</h2>
        ${definitionCards(PUBLICATION_CATEGORY_SUMMARY.map(([title, description]) => [title, description]))}
        <h2>${PUBLICATION_INDEX.length} Notes and Artifacts</h2>
        ${PUBLICATION_INDEX.map((item) => `<h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.description)}</p>`).join('\n        ')}
        <h2>From Research to Implementation</h2>
        ${linkList([...researchContextLinks])}`,
    );
  }

  if (route.path === '/viralbench-codex-agent-harness') {
    return articleShell(
      VIRALBENCH_ARTICLE_TITLE,
      VIRALBENCH_ARTICLE_EXCERPT,
      `<p><a href="/research">Research notes</a> · AI Systems Engineering · Published July 9, 2026 · By <a href="/about">Sulayman Bowles</a></p>
        ${articleSearchBriefStaticHtml('/viralbench-codex-agent-harness')}
        ${viralBenchArticleStaticHtml()}`,
    );
  }

  if (route.path === '/') {
    return articleShell(
      'Sulayman Bowles',
      'Technical SEO, AI product, systems, and source-led research from Sulayman Bowles.',
      `<h2>Technical SEO, AI product, systems, and investment research.</h2>
        <p>UT Austin student working in AI product at Chegg, running technical SEO consulting through Void Agency, building Atlas audit software, and publishing source-led research.</p>
        <h2>Start with the proof</h2>
        <h3><a href="/research/ai-systems/the-first-ai-managers">The First AI Managers</a></h3>
        <p>A source-led review of the operational realities behind businesses that claim AI management.</p>
        <h3><a href="/atlas">Atlas technical SEO audit software</a></h3>
        <p>A technical SEO crawler and evidence system that preserves raw and rendered pages, tests indexation, canonicals, links, and structured data, then exports reviewable findings.</p>
        <h3><a href="/method">Technical SEO audit services</a></h3>
        <p>A fixed-scope audit process for crawlability, indexation, rendering, internal links, structured data, analytics, implementation, and rerun checks.</p>
        <h3><a href="/austin-technical-seo">Austin technical SEO consultant</a></h3>
        <p>Local technical SEO audits for Austin teams that need service pages, crawl paths, evidence, and implementation priorities reviewed.</p>
        <h3><a href="/research">Technical SEO research</a></h3>
        <p>Source-led notes on crawlability, crawler policy, public search data, canonical identity, AI systems, and evidence limits.</p>
        <h3><a href="/research/technical-seo">Technical SEO diagnostic library</a></h3>
        <p>Evidence-backed issue guides, platform playbooks, and audit checklists with reproducible repair gates.</p>
        <h3><a href="/markets/who-owns-texas-toll-roads">Texas Toll-Road Ownership Map</a></h3>
        <p>Source-led infrastructure research on public ownership, private concessions, operators, debt claims, revenue rights, and missing facts.</p>
        <h2>How I work</h2>
        <p>Collect the source material, preserve the observed state, separate interpretation from fact, name the owner, and define the next check.</p>
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/work') {
    return articleShell(
      'Selected Work',
      'A technical SEO portfolio and AI systems portfolio with six public artifacts, explicit ownership, implementation details, constraints, and inspectable evidence.',
      `<h2>Six Public Artifacts</h2>
        ${workProofCards
          .map(
            (item) =>
              `<h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3>
              <p><strong>Problem:</strong> ${escapeHtml(item.problem)}</p>
              <p><strong>Role:</strong> ${escapeHtml(item.role)}</p>
              <p><strong>Built:</strong> ${escapeHtml(item.built)}</p>
              <p><strong>Constraints:</strong> ${escapeHtml(item.constraints)}</p>
              <p><strong>Status:</strong> ${escapeHtml(item.status)}</p>
              <p><strong>Not public:</strong> ${escapeHtml(item.notPublic)}</p>
              <p><a href="${item.evidenceHref}">${escapeHtml(item.evidenceLabel)}</a></p>`,
          )
          .join('\n        ')}
        <h2>Supporting Links</h2>
        ${linkCards(contextualProofLinks)}
        <h2>Evidence Before Intake</h2>
        ${buyerDecisionEvidence
          .map(
            (item) =>
              `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p><p><a href="${escapeHtml(item.href)}">${escapeHtml(item.action)}</a></p>`,
          )
          .join('\n        ')}
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas') {
    return articleShell(
      'Atlas SEO Audit Console',
      'Technical SEO audit software and crawl-analysis system for reviewable site evidence.',
      `<p>Atlas is technical SEO audit software that preserves page-level crawl evidence—HTTP responses, raw and rendered HTML, directives, canonicals, internal links, structured data, and fetch state—before a finding enters review. It is not a generic content-writing product.</p>
        <h2>Beyond Basic Crawls</h2>
        <p>The system connects observations to URL, run, source, and review state; stores crawl history; and produces structured exports. Derived findings stay distinguishable from observations and measurement gaps.</p>
        <h2>Search Visibility Aware</h2>
        <p>Atlas evaluates content and structure for entity clarity, source signals, freshness, and crawlability.</p>
        <h2>Built for Operators</h2>
        <p>Designed for SEO operators and technical teams who need reliable source material, clear logic, and inspectable outputs to drive decisions.</p>
        <h2>The Atlas Process</h2>
        ${definitionCards(atlasProcess)}
        <h2>What Atlas SEO Audit Console Checks</h2>
        ${evidenceLinkCards(atlasCheckItems)}
        <h2>Data and Outputs</h2>
        <p>Structured outputs make crawler observations reviewable, inspectable, and defensible across technical teams.</p>
        ${definitionCards(atlasOutputs)}
        <h2>Capability Status</h2>
        ${definitionCards([
          ['Crawl inventory — Shipped', 'Public sanitized run available.'],
          ['Evidence ledger — Shipped', 'Observed and interpreted states remain separate.'],
          ['Run persistence and exports — Shipped / partial', 'Technical architecture is documented; public coverage remains bounded.'],
          ['Provider mesh — Prototype', 'Missing provider coverage remains a measurement gap.'],
          ['Scoring policy — In development', 'The review gate remains authoritative.'],
        ])}
        <h2>Specific Data Handled by Atlas</h2>
        ${evidenceGroupCards()}
        <h2>Source Links</h2>
        ${linkList([
          { label: 'See the Atlas open-corpus demonstration', href: '/atlas/sample-crawl', description: 'Dated raw/render capture, source records, and exports.' },
          { label: 'GitHub profile', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'View the GitHub repo for the audit CLI', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-', description: 'Public scraper/audit code.' },
          { label: 'Read the technical SEO audit method', href: '/method', description: 'Service/process context.' },
          { label: 'Request an audit', href: '/contact', description: 'Audit intake for technical SEO, analytics, and markets research.' },
        ])}
        <h2>System Intelligence You Can Act On</h2>
        <p>Atlas turns complexity into inspectable records so operators can decide what matters, what should be fixed, and what source data supports the recommendation.</p>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas/sample-crawl') {
    return articleShell(
      'Atlas Open-Corpus Demonstration',
      'A dated, versioned raw-versus-rendered capture from a small open-web corpus, with traceable findings and source exports.',
      `<p>This is a bounded public demonstration, captured on July 16, 2026 from an open web corpus. It does not represent a client crawl or support claims about rankings, traffic, revenue, or production coverage.</p>
        <h2>Captured Artifacts</h2>
        ${linkList([
          { label: 'Download open-corpus CSV', href: RESEARCH_ASSETS.atlasSampleCsv, description: 'URL-level capture records.' },
          { label: 'Download capture manifest', href: RESEARCH_ASSETS.atlasSampleManifest, description: 'Dated run metadata and claim limits.' },
        ])}
        <h2>Traceable Findings</h2>
        <ul>${atlasSampleFindings
          .map((item) => `<li><strong>${escapeHtml(item.label)}</strong>: ${escapeHtml(item.observation)} ${escapeHtml(item.derivation)} Confidence: ${escapeHtml(item.confidence)}.</li>`)
          .join('')}</ul>
        <h2>Sample Rows</h2>
        ${atlasSampleTableStaticHtml()}
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'Read the technical SEO audit method', href: '/method' },
          { label: 'View the GitHub repo for the audit CLI', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-' },
          { label: 'Request an audit', href: '/contact' },
        ])}`,
    );
  }

  if (route.path === '/method') {
    return articleShell(
      'Technical SEO Audit Services',
      'Fixed-scope technical SEO audit services from inspectable site evidence to implementation work, owners, and rerun checks.',
      `<p>Void Agency reviews crawlability, indexation, JavaScript rendering, internal links, structured data, analytics, and implementation constraints. The deliverable is a bounded set of defensible findings and acceptance checks—not a long generic checklist.</p>
        <h2>Technical SEO Audit Process</h2>
        ${definitionCards(methodColumns)}
        <h2>Deliverables</h2>
        ${definitionCards(methodDeliverables)}
        <h2>Typical Timing</h2>
        ${definitionCards(methodTimeline)}
        <h2>Inputs and Access</h2>
        ${definitionCards(methodRequiredAccess)}
        <h2>Exclusions</h2>
        ${definitionCards(methodExclusions)}
        <section id="worked-finding"><h2>Worked Finding</h2>
        ${definitionCards(auditExampleFindingChain.map((item) => [item.label, item.value]))}</section>
        <h2>Evidence Links</h2>
        ${linkList([
          { label: 'See the Atlas open-corpus demonstration', href: '/atlas/sample-crawl' },
          { label: 'Read the worked finding', href: '/method#worked-finding' },
          { label: 'Austin technical SEO consultant', href: '/austin-technical-seo' },
          { label: 'View Void Agency', href: 'https://www.void-agency.com/' },
          { label: 'Request an audit', href: '/contact' },
        ])}`,
    );
  }

  if (route.path === '/contact') {
    return articleShell(
      'Contact a Technical SEO Consultant',
      'Direct contact for technical SEO consulting, crawl evidence, analytics, implementation support, validation, and source-backed research.',
      `<p>I work as a technical SEO consultant on bounded crawlability, indexation, rendering, internal-link, structured-data, analytics, and implementation problems. Typical outputs include URL-level findings, raw/render comparisons, owners, acceptance checks, and a rerun path—not an opaque score or generic audit deck.</p>
        <h2>Good-Fit Technical Work</h2>
        ${definitionCards(contactResponsePaths.map((item) => [item.label, item.description]))}
        <h2>Direct Contact</h2>
        ${linkList([
          { label: 'Email Sulayman Bowles', href: 'mailto:sulayman.bowles@gmail.com', description: 'Primary contact path.' },
        ])}
        <h2>Brief Form</h2>
        <p>The public brief form is secondary to direct contact. It is useful when the site URL, suspected problem, and decision the work needs to support are already clear.</p>
        ${definitionCards(contactIntakeNotes.map((item) => [item.label, item.description]))}
        <p>Do not include passwords, API keys, payment details, unreleased client data, or production secrets.</p>
        <h2>Decision Gates</h2>
        ${definitionCards(contactDecisionProtocol.map((item) => [item.title, `${item.label}. ${item.description}`]))}
        <h2>Buyer Questions</h2>
        ${definitionCards(contactBuyerQuestions.map((item) => [item.question, item.answer]))}
        <h2>Elsewhere</h2>
        ${linkList([
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulayman-bowles/', description: 'Professional profile.' },
          { label: 'GitHub', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'Resume', href: '/resume', description: 'Readable profile.' },
          { label: 'Tech Ledger', href: 'https://sulayman-bowles.tech/', description: 'Technical projects, experiments, and project ledger.' },
          { label: 'Public Site', href: '/', description: 'Home page.' },
        ])}
        <h2>Related Context</h2>
        ${linkList([
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl' },
          { label: 'Review technical SEO audit services and process', href: '/method' },
          { label: 'Austin technical SEO consultant', href: '/austin-technical-seo' },
        ])}`,
    );
  }

  if (route.path === '/austin-technical-seo') {
    return articleShell(
      'Austin Technical SEO Consultant',
      'Austin technical SEO consulting and audit services for local businesses and growth teams.',
      `<p>Based in Austin, Sulayman Bowles runs fixed-scope technical SEO audits for teams that need crawlability, indexation, JavaScript rendering, internal links, structured data, local service pages, analytics, and implementation checked.</p>
        <h2>Short Answer</h2>
        <p>An Austin technical SEO consultant checks whether priority service pages can be crawled, indexed, understood, internally supported, and measured before anyone expands content or claims local visibility gains.</p>
        <h2>What an Austin Technical SEO Audit Covers</h2>
        ${definitionCards(austinAuditCoverage)}
        <h2>Who This Is For</h2>
        <ul>${austinBuyerFit.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h2>What You Receive</h2>
        <ul>${austinDeliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h2>When Not To Hire Me</h2>
        <ul>${austinWhenNotToHire.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h2>Austin Crawlability Pilot Snapshot</h2>
        <p>The local page is backed by a bounded public fetch sample, not a local-ranking claim. It gives a small public-data baseline for how Austin-area company sites expose crawlability signals.</p>
        <p><strong>Evidence cutoff:</strong> June 25, 2026.</p>
        <figure id="austin-report-example"><img src="/images/austin-audit-report-example.png" width="1200" height="760" alt="Example report layout using the June 25, 2026 public Austin pilot values." /><figcaption>Illustrative report layout; values come from the published summary and CSV.</figcaption></figure>
        ${definitionCards(austinBenchmarkSnapshot.map((item) => [item.label, item.value]))}
        <h3>Pilot Method</h3>
        <ul>${austinPilotMethod.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h3>Disclosure</h3>
        <p>This bounded public fetch sample is not a local-ranking claim and does not establish traffic, revenue, or site health.</p>
        ${linkList([
          { label: 'Open Austin benchmark summary JSON', href: '/research/austin-crawlability-benchmark-summary.json' },
          { label: 'Open Austin benchmark pilot CSV', href: '/research/austin-crawlability-benchmark-pilot.csv' },
        ])}
        <h2>Query Examples Before Page Expansion</h2>
        <p>The audit starts with concrete queries such as technical SEO Austin, Austin SEO audit, and Austin crawlability audit, then checks whether the public page, proof, profile signals, and measurement path support that intent.</p>
        ${definitionCards(austinDiagnosticExamples.map((item) => [item.prompt, item.review]))}
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'Request an Austin technical SEO audit', href: '/contact' },
          { label: 'Review technical SEO audit services and process', href: '/method' },
          { label: 'See the Atlas open-corpus demonstration', href: '/atlas/sample-crawl' },
          { label: 'View Void Agency', href: 'https://www.void-agency.com/' },
        ])}`,
    );
  }

  if (route.path === '/resume') {
    return articleShell(
      'Sulayman Bowles Resume',
      'Technical systems work across crawl infrastructure, AI product workflows, analytics, and finance research.',
      `<p>${escapeHtml(PROFILE_FACTS.currentSummary)}</p>
        <p>Reviewed ${escapeHtml(formatIsoDate(PROFILE_FACTS.lastReviewed))}. Current-role tense review scheduled for ${escapeHtml(formatIsoDate(PROFILE_FACTS.nextRoleReview))}.</p>
        <h2>Education and Current Focus</h2>
        <h3>UT Austin</h3><p>${escapeHtml(formatEducation())}, ${escapeHtml(PROFILE_FACTS.education.institution)}. Expected ${escapeHtml(PROFILE_FACTS.education.expectedGraduation)}.</p>
        <h3>Current focus</h3><p>${escapeHtml(PROFILE_FACTS.currentSummary)}</p>
        <h2>Experience</h2>
        ${PROFILE_FACTS.experience
          .map((item) => `<h3>${escapeHtml(item.title)}</h3><p><strong>${escapeHtml(item.organization)}</strong> - ${escapeHtml(item.dates)}. ${escapeHtml(item.publicSummary)}</p><ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`)
          .join('\n        ')}
        <h2>Skill Inventory</h2>
        ${definitionCards(PROFILE_FACTS.skillGroups.map((group) => [group.label, group.items.join(', ')]))}
        <h2>Awards and Leadership</h2>
        ${PROFILE_FACTS.awardsAndLeadership.map((item) => `<h3>${escapeHtml(item.title)}</h3><p><strong>${escapeHtml(item.organization)}</strong> - ${escapeHtml(item.dates)}. ${escapeHtml(item.detail)}</p>`).join('\n        ')}
	        <h2>Supporting Links</h2>
        ${linkList([
          { label: 'Atlas technical SEO console', href: '/atlas', description: 'Product case study.' },
          { label: 'Markets research index', href: '/markets', description: 'Research notes.' },
          { label: 'Void Agency method', href: '/method', description: 'Technical SEO process.' },
          { label: 'GitHub', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulayman-bowles/', description: 'Professional profile.' },
          { label: 'Download PDF résumé', href: '/Sulayman_Bowles_Resume.pdf', description: 'Current PDF résumé.' },
          { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', description: 'Direct contact.' },
        ])}`,
    );
  }

  if (route.path === '/about') {
    return articleShell(
      'About Sulayman Bowles',
      'Technical practice, current work, experience, and operating principles from Sulayman Bowles.',
      `<p>Sulayman Bowles works across technical SEO consulting, AI product, crawl software, analytics, and research systems. Atlas is the clearest expression of that work: preserve raw and rendered page states, connect findings to URL-level evidence, and carry reviewed results through persistence and exports.</p>
        <p>My implementation work spans React and TypeScript interfaces, Python and SQLite workflows, CSV and JSON exports, analytics, and validation gates. I am pursuing ${escapeHtml(formatEducation())} at UT Austin.</p>
        <p>The work is inspectable rather than assertion-led: the relevant project pages attach sanitized crawl rows, source ledgers, method notes, system designs, public code, and explicit evidence limits.</p>
        <h2>Current Work</h2>
        <h3><a href="/atlas">Atlas</a></h3><p>I designed the product, crawl evidence contract, review states, persistence, and export paths.</p>
        <h3><a href="https://www.void-agency.com/">Void Agency</a></h3><p>I run fixed-scope technical audits, web systems, analytics review, and implementation handoffs through this practice.</p>
        <h3><a href="/resume">Product work</a></h3><p>AI product research, competitive analysis, workflow mapping, and prototype review.</p>
        <h3><a href="/research">Finance and research</a></h3><p>Ownership, operating logic, source tables, market validation, unit economics, and financial models.</p>
        <h2>Experience</h2>
        ${PROFILE_FACTS.experience.map((item) => `<h3>${escapeHtml(item.title)}</h3><p><strong>${escapeHtml(item.organization)}</strong> - ${escapeHtml(item.dates)}. ${escapeHtml(item.publicSummary)}</p>`).join('\n        ')}
        <h2>Operating Principles</h2>
        <p>Inspect the inputs. Separate fact from inference. Ship the review path.</p>
        <h2>Music</h2>
        <p>Music is a current second degree, not a historical aside. Classical bass and composition inform how I think about structure, iteration, and whether an underlying system holds together.</p>`,
    );
  }

  if (route.path === '/markets') {
    return articleShell(
      'Markets and Investing',
      'Finance and infrastructure-investing research with visible assumptions, source tables, valuation frames, risks, and recommendation boundaries.',
      `<p>This is the finance-only filter within the broader Research hub. It covers ownership, cash-flow rights, valuation frames, assumptions, downside cases, and explicit recommendation boundaries.</p>
        <h2>Current Investment Research</h2>
        ${PUBLIC_MARKET_THESES.map((thesis) => `<h3><a href="/markets/${thesis.slug}">${escapeHtml(thesis.title)}</a></h3><p>${escapeHtml(thesis.subtitle)}</p>`).join('\n        ')}
        <h2 id="appian-assumptions">Supporting Model With Visible Assumptions</h2>
        <p>The Appian materials are educational research samples. Educational research sample, not an investment recommendation. Not a recommendation or price target.</p>
        ${linkList([
          { label: 'Read the markets research memo with assumptions', href: RESEARCH_ASSETS.appianMemoPdf, description: 'Educational Appian research memo PDF.' },
          { label: 'Download the Appian assumptions table', href: RESEARCH_ASSETS.appianAssumptionsCsv, description: 'CSV source table for the research assumptions.' },
        ])}
        ${appianAssumptionTableStaticHtml()}
        <h2>All Research Categories</h2>
        ${linkList([{ label: 'Open the unified Research hub', href: '/research' }])}`,
    );
  }

  if (route.path === `/markets/${TEXAS_TOLL_ARTICLE_SLUG}`) {
    return texasTollArticleStaticHtml();
  }

  if (route.path === AI_MANAGERS_ARTICLE_PATH) {
    return aiManagersArticleStaticHtml();
  }

  const article = getArticleByPath(route.path);
  if (article) {
    const investmentMemo = isInvestmentMemo(article);
    const metrics = article.metrics ?? [
      { label: 'Category', value: article.category },
      { label: 'Updated', value: article.dateModified ?? article.date },
      { label: 'Sources', value: String(article.sources.length) },
    ];
    const sourceLinks = article.sources.map((source) => ({ label: source.label, href: source.href }));
    const boundary = investmentMemo ? article.recommendationBoundary : article.evidenceBoundary;
    const structuredSections = article.sections
      ? articleSectionsStaticHtml(article.sections)
      : '';
    const articleImage = article.artwork.kind === 'image'
      ? `<figure>
          <img src="${escapeHtml(article.artwork.heroSrc)}" alt="${escapeHtml(article.artwork.alt)}" />
          <figcaption>${escapeHtml(article.artwork.caption)}</figcaption>
        </figure>`
      : '';
    const resources = article.resources?.length
      ? articleResourcesStaticHtml(article.resources)
      : '';
    const investmentSections = investmentMemo
      ? `<h2>Valuation Frame</h2>
        <p>${escapeHtml(article.formulaLabel)}: ${escapeHtml(article.formula)}</p>
        <h2>Key Risk Vector</h2>
        <p>${escapeHtml(article.risks)}</p>`
      : article.thesis
        ? `<h2>Thesis</h2><p>${escapeHtml(article.thesis)}</p>`
        : '';

    return articleShell(
      article.title,
      article.subtitle,
      `${articleSearchBriefStaticHtml(route.path)}
        ${articleImage}
        <h2>Memo Details</h2>
        <p>Category: ${escapeHtml(article.category)}. Author: ${escapeHtml(article.author)}. Published: ${escapeHtml(article.date)}. Read time: ${escapeHtml(article.readTime)}. Source count: ${String(article.sources.length)}.</p>
        ${boundary ? `<h2>${investmentMemo ? 'Recommendation Boundary' : 'Evidence Boundary'}</h2><p>${escapeHtml(boundary)}</p>` : ''}
        <h2>Article Metrics</h2>
        ${definitionCards(metrics.map((metric) => [metric.label, metric.value]))}
        <h2>Research Note</h2>
        ${paragraphList(article.content)}
        ${structuredSections}
        ${investmentSections}
        ${resources}
        <h2 id="article-conclusion-title">${escapeHtml(article.conclusion.title)}</h2>
        <p>${escapeHtml(article.conclusion.content)}</p>
        ${sourceLinks.length ? `<h2>${structuredSections ? 'Source Ledger' : 'Research Sources'}</h2>${linkList(sourceLinks)}` : ''}
        <h2>Internal Links</h2>
        ${linkList([
          { label: investmentMemo ? 'Markets Research' : 'Research Notes', href: investmentMemo ? '/markets' : '/research' },
          { label: 'Home', href: '/' },
          { label: 'Atlas technical SEO audit software', href: '/atlas' },
          { label: 'Technical SEO audit services', href: '/method' },
          { label: 'Sulayman Bowles resume', href: '/resume' },
        ])}`,
    );
  }

  return articleShell(route.h1, route.staticSummary, `<h2>Internal Links</h2>${linkList(primaryLinks)}`);
}

export function buildSitemapStaticHtml(routes: SeoRoute[]) {
  return articleShell(
    'HTML Sitemap',
    'Plain links to every public page on sulayman-bowles.dev.',
    `<h2>Pages</h2>
        ${linkList(routes.map((route) => ({ label: route.h1, href: route.path, description: route.description })))}`,
  );
}
