import {
  AI_INFORMATION_STATIC_HTML,
  evidenceGroups,
  identityReconciliation,
  sourceMap,
} from '../content/aiInformation';
import { aiSearchAuditChecklist, atlasCheckItems } from '../content/evidenceLists';
import { MARKET_THESES, PUBLIC_MARKET_THESES } from '../content/marketTheses';
import {
  appianAssumptionRows,
  atlasSampleFindings,
  atlasSampleRows,
  auditExampleFindingChain,
  auditCaseStudySteps,
  austinBenchmarkLimits,
  austinBenchmarkSnapshot,
  austinSeoSignals,
  contextualProofLinks,
  RESEARCH_ASSETS,
  voidAgencyProofLinks,
  workProofCards,
} from '../content/seoExpansion';
import { SIMPLE_BOOK_CHAPTERS, SIMPLE_BOOK_LINKS } from '../content/simpleBook';
import { primaryNav, utilityNav } from '../content/siteNavigation';
import type { SeoRoute } from './routes';

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
  ['Indexation Audit at Scale', 'Mapped thousands of URLs to uncover crawl waste, duplicate templates, weak canonicals, orphaned pages, redirect chains, and pages blocked from meaningful discovery.'],
  ['Visibility Benchmark', 'Reviewed whether a company could be understood clearly from its public pages. Tested entity clarity, page structure, schema, source material, and crawler access.'],
  ['Product Discovery System', 'Audited product and collection pages to find missing metadata, thin templates, weak internal links, duplicate paths, and search-intent gaps.'],
  ['Service-Area Visibility Audit', 'Mapped location pages, service pages, Google Business Profile signals, crawl structure, and local entity clarity to improve discovery in high-intent searches.'],
];

const resumeExperience = [
  ['Founder', 'VOID Agency', 'Dec 2025 - Present', 'Built Void Agency around technical SEO audits, website builds, local search work, and crawler-access checks, with $50K+ collected revenue.'],
  ['AI Product Manager Intern', 'Chegg, Office of the Chief Product Officer', 'May 2026 - Aug 2026', 'Supporting AI product research, competitive analysis, workflow mapping, and prototype review for student-facing tools.'],
  ['Technical SEO Analytics', 'Private SEO Engagement', 'May 2026 - Present', 'Supporting launch analytics, GA4/GSC reporting, SEO baselines, traffic analysis, keyword tracking, and prioritized site recommendations.'],
  ['Student Associate', 'Jon Brumley Texas Venture Labs', 'Sep 2025 - Present', 'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.'],
];

const resumeSkills = [
  ['Technical SEO', 'Crawler access, indexability, canonicals, internal links, schema, templates, and performance inputs.'],
  ['AI Product', 'AI product research, competitive mapping, workflow analysis, prompt review, and prototype review.'],
  ['Markets Research', 'Valuation research, operating analysis, GA4/GSC reporting, market notes, and assumptions tables.'],
  ['Software Execution', 'React/Vite interfaces, Python scripts, audit dashboards, structured reports, and public work samples.'],
];

const aboutExperience = [
  ['VOID Agency Founder', 'Built an SEO and web systems practice around technical audits, website builds, local search strategy, and search visibility work, with $50K+ collected revenue.'],
  ['Chegg AI Product Manager Intern', 'Working on AI product strategy, research, competitive analysis, user workflows, prototype review, and AI-enabled student experiences.'],
  ['Technical SEO Analytics', 'Supporting website launch analytics, GA4, Google Search Console, SEO baselines, traffic analysis, keyword performance, and prioritized recommendations.'],
  ['Jon Brumley Texas Venture Labs Student Associate', 'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.'],
];

const homeDisciplines = [
  ['Technical SEO Systems', 'Crawl architecture, indexability, internal links, page templates, metadata, structured data, performance inputs, and issue logic. Built for diagnosis, not vague scoring.'],
  ['Search Visibility', 'Crawler access, entity clarity, structured data, and pages that explain the work without forcing a reader to guess.'],
  ['Atlas / Crawl Data', 'URL discovery, raw and rendered HTML, canonical state, internal-link maps, structured-data checks, and report-ready audit notes.'],
  ['Markets Research', 'Finance research, valuation assumptions, market structure, operating analysis, dashboards, and decision tools built around inspectable assumptions.'],
  ['Product + Web Systems', 'React interfaces, portfolio pages, audit dashboards, product research, and written explanations that make the work easier to inspect.'],
];

const homeProofHighlights = [
  ['Atlas', 'Built a crawl system for indexation, internal links, schema, and audit reports.', '/atlas'],
  ['Void Agency', 'Founded a technical SEO and web systems practice with $50K+ collected revenue.', '/void-agency'],
  ['Chegg AI PM', 'AI Product Manager intern in the Office of the Chief Product Officer.', '/resume'],
  ['SEO Analytics', 'GA4 and Google Search Console work across launch baselines, query tracking, and prioritized recommendations.', '/method'],
  ['Texas Venture Labs', 'Student Associate work on market validation, customer discovery, unit economics, and financial models.', '/resume'],
  ['Public Work', 'GitHub projects, research notes, sample data, and current profile links are collected here.', '/research'],
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

function sourceMapCards(limit?: number) {
  return sourceMap
    .slice(0, limit)
    .map(
      (item) =>
        `<h3>${escapeHtml(item.role)}: <a href="${item.href}">${escapeHtml(item.label)}</a></h3><p>${escapeHtml(item.proves)}</p>`,
    )
    .join('\n        ');
}

function evidenceGroupCards() {
  return evidenceGroups
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

function historicalSourceContextStaticHtml() {
  return `<h2>Historical Source Context</h2>
        <p>${escapeHtml(identityReconciliation.copy)}</p>
        ${linkList(identityReconciliation.links)}`;
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

export function buildRouteStaticHtml(route: SeoRoute) {
  if (route.path === '/ai-information') {
    return AI_INFORMATION_STATIC_HTML;
  }

  if (route.path === '/research') {
    return articleShell(
      'Research Notes',
      'Selected notes on search systems, crawlability, Atlas, public data, and markets work.',
      `<h2>Selected Notes</h2>
        <h3><a href="/markets/ai-search-crawler-policy">Crawler Policy Comes Before Visibility</a></h3>
        <p>A note on crawler access, redirects, and why discovery has to be settled before visibility claims matter.</p>
        <h3><a href="/markets/technical-seo-public-data-infrastructure">Technical SEO as Public Data Infrastructure</a></h3>
        <p>A practical bridge between crawlability, structured data, provenance, and public records people can inspect.</p>
        <h3><a href="/markets/canonical-identity-personal-seo">Canonical Identity for Personal SEO</a></h3>
        <p>A reconciliation checklist for profiles, stale PDFs, source pages, and external bio consistency.</p>
        <h3><a href="/atlas/sample-crawl">Atlas Sample Crawl Run</a></h3>
        <p>A sanitized walkthrough of how crawl rows, canonical state, depth, links, and issue labels become reviewable evidence.</p>
        <h2>Related Work</h2>
        ${linkList([
          { label: 'Atlas audit console', href: '/atlas', description: 'The crawl and evidence workflow behind the audit examples.' },
          { label: 'Markets research', href: '/markets', description: 'Finance notes, assumptions, and source-backed market questions.' },
          { label: 'Selected work', href: '/work', description: 'Projects, case studies, and public work in one place.' },
        ])}`,
    );
  }

  if (route.path === '/') {
    return articleShell(
      'Sulayman Bowles',
      'UT Austin McCombs, Atlas, technical SEO, search visibility, and finance research.',
      `<h2>Introduction</h2>
        <p>Sulayman Bowles is a UT Austin McCombs student building Atlas, Void Agency, web tools, and finance research notes.</p>
        <p>Most of the work sits where technical SEO, product, and research meet: crawl the site, find what blocks discovery, and turn the mess into fixes people can ship.</p>
        <p>My work starts with messy surfaces: crawl data, page templates, market signals, search behavior, financial assumptions, and unfinished product logic. I turn that into structured systems people can inspect, question, and use.</p>
        <h2>Work in 30 seconds</h2>
        ${homeProofHighlights.map(([label, copy, href]) => `<h3><a href="${href}">${escapeHtml(label)}</a></h3><p>${escapeHtml(copy)}</p>`).join('\n        ')}
        <h2>Selected Work</h2>
        <h3><a href="/atlas">Atlas SEO Audit Console</a></h3>
        <p>A crawl-based audit system for finding indexation, architecture, performance, and structured-data issues across real websites.</p>
        <h3><a href="/void-agency">Void Agency technical SEO practice</a></h3>
        <p>Void Agency is my technical SEO consultancy, focused on crawlability, structured content, and website audits.</p>
        <p><a href="/method">Read the technical SEO audit method</a>.</p>
        <h3><a href="/markets">Markets Research</a></h3>
        <p>Markets research covering valuation, market structure, operating models, and decision dashboards with visible assumptions.</p>
        <h2>Operating Method</h2>
        <p>I separate signal from presentation. First, collect the source material. Then structure it. Then decide what it means, what risk it creates, and what should be fixed.</p>
        <ul><li>Crawl before claims</li><li>Structure before scale</li><li>Inputs before polish</li></ul>
        <h2>Disciplines</h2>
        ${definitionCards(homeDisciplines)}
        <h2>Supporting Links</h2>
        ${linkCards(contextualProofLinks)}
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/work') {
    return articleShell(
      'Selected Work',
      'Selected work across Atlas crawl audits, the technical SEO method, a sanitized case-study frame, and markets research notes.',
      `<h2>Work Index</h2>
        ${workProofCards
          .map(
            (item) =>
              `<h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.copy)}</p><p><a href="${item.ctaHref}">${escapeHtml(item.cta)}</a></p>`,
          )
          .join('\n        ')}
        <h2>Supporting Links</h2>
        ${linkCards(contextualProofLinks)}
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas') {
    return articleShell(
      'Atlas SEO Audit Console',
      'Crawl-based audit system for search.',
      `<p>Atlas is a technical SEO audit system that crawls, interprets, and scores websites to surface what search engines see across architecture, indexation, and performance. It is not a generic content-writing product.</p>
        <h2>Beyond Basic Crawls</h2>
        <p>Atlas goes deeper than surface reports. It interprets signals, correlates patterns, and prioritizes issues by impact on indexation and visibility.</p>
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
        <h2>Specific Data Handled by Atlas</h2>
        ${evidenceGroupCards()}
        <h2>Source Links</h2>
        ${linkList([
	          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl', description: 'Sanitized URL-level crawl data and CSV download.' },
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
      'Atlas Sample Crawl Run',
      'Sanitized crawl data showing URL status, indexability, link counts, canonical state, issue labels, and notes.',
      `<p>This sample is sanitized/demo data. It supports the public method explanation without identifying a private client or claiming live rankings, traffic movement, revenue impact, or answer placement.</p>
        <h2>Downloadable Source Table</h2>
        ${linkList([{ label: 'Download sanitized crawl CSV', href: RESEARCH_ASSETS.atlasSampleCsv, description: 'URL-level Atlas sample data.' }])}
        <h2>What the Sample Shows</h2>
        <ul>${atlasSampleFindings.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
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
      'Void Agency Method',
      'Technical SEO systems for search visibility and conversion paths.',
      `<p>Void Agency audits the technical layer behind search visibility: crawl paths, indexation, site architecture, internal links, structured data, performance, analytics, and crawler access. The method connects back to Sulayman Bowles, Atlas, and practical web/search systems.</p>
        <h2>Overview</h2>
        <p>Search visibility is no longer only about ranking pages. It is about whether search engines, referral systems, and customers can understand your site clearly enough to trust it.</p>
        <p>Void Agency finds the structural problems that block that understanding, then turns them into a prioritized plan your team can implement.</p>
        <h2>Method Columns</h2>
        ${definitionCards(methodColumns)}
        <h2>How It Works</h2>
        <p>A technical SEO process built for accuracy, source material, and implementation. Void Agency turns messy site data into a clear plan that teams can act on.</p>
        <h3>Crawl</h3><p>Custom crawlers, sitemap checks, and page extraction.</p>
        <h3>Analyze</h3><p>Indexation, architecture, links, metadata, speed, and schema.</p>
        <h3>Prioritize</h3><p>Rank fixes by severity, effort, affected pages, source notes, and implementation context.</p>
        <h3>Deliver</h3><p>Clear reports, implementation guidance, and measurable next steps.</p>
        <h2>Search Visibility Audit Checklist</h2>
        ${evidenceLinkCards(aiSearchAuditChecklist)}
        <h2>Void in Action</h2>
        ${definitionCards(methodCaseStudies)}
        <h2>Source Material Used in the Method</h2>
        ${definitionCards([
          ['Crawlability', 'Robots rules, sitemap coverage, response codes, redirects, page templates, and crawl-depth patterns.'],
	          ['Page Data', 'Raw HTML, rendered HTML, canonical URLs, metadata, internal links, structured data, and indexability directives.'],
          ['Analytics Review', 'Google Search Console, GA4, query buckets, landing pages, search intent, and page-level recommendations where access is available.'],
          ['Source List', 'Personal site, sulayman-bowles.tech, GitHub, Void Agency, LinkedIn, UT/McCombs context, Atlas, Markets Research, and the HTML resume.'],
        ])}
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl', description: 'Sanitized crawl sample used to explain the method.' },
          { label: 'View Void Agency', href: '/void-agency', description: 'Service-practice page for Void Agency.' },
          { label: 'Request an audit', href: '/contact', description: 'Audit intake route.' },
          ...primaryLinks,
        ])}`,
    );
  }

  if (route.path === '/void-agency') {
    return articleShell(
      'Void Agency',
      'Service-practice page for the technical SEO branch.',
      `<p>Void Agency is the service branch connected to Sulayman Bowles work in technical SEO, crawlability, indexation diagnostics, structured content, analytics review, and web audits.</p>
        <h2>What Gets Reviewed Before Claims</h2>
        <h3>Audit inputs</h3>
        <ul><li>Crawlable public URLs, sitemap coverage, robots directives, redirects, canonical tags, and indexability controls.</li><li>Page templates, internal-link paths, structured data, source clarity, and visible service proof before any growth claim.</li><li>Google Search Console, GA4, query groups, and conversion paths when the site owner can provide access.</li></ul>
        <h3>Public limits</h3>
        <ul><li>No private client names, traffic gains, rankings, revenue movement, or AI citations are implied from this page.</li><li>The agency page explains the service branch; the method page carries the process; sample crawl data shows the evidence format.</li><li>Recommendations should stay tied to affected URLs, source observations, implementation effort, and a decision the owner can act on.</li></ul>
        <h2>Supporting Links</h2>
        ${voidAgencyProofLinks
          .map(
            (link) =>
              `<h3><a href="${link.href}">${escapeHtml(link.label)}</a></h3><p>${escapeHtml(link.role)}: ${escapeHtml(link.copy)}</p>`,
          )
          .join('\n        ')}
        <h2>Route Roles</h2>
        <p>/void-agency explains the service practice. /method explains the technical SEO audit process.</p>
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'Read the technical SEO audit method', href: '/method' },
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl' },
          { label: 'Request an audit', href: '/contact' },
        ])}`,
    );
  }

  if (route.path === '/contact') {
    return articleShell(
      'Request a Technical SEO Audit',
      'Audit intake for technical SEO, crawl reviews, indexation, internal-link, structured-data, analytics, and markets research requests.',
      `<p>Use this route for technical SEO audits, crawl reviews, analytics, markets research, or other projects that need the source material checked before the recommendation.</p>
        <h2>What Makes the Brief Usable</h2>
        <h3>Include</h3>
        <ul><li>The canonical site URL, the pages or templates that feel underperforming, and whether the issue is crawlability, indexation, visibility, conversion, or reporting.</li><li>Any available Search Console, GA4, CMS, sitemap, crawl export, or analytics context that can be reviewed after scope is agreed.</li><li>The decision the audit should support: what to fix first, what to stop doing, what evidence is missing, or what handoff an engineer or owner needs.</li></ul>
        <h3>Keep out of the form</h3>
        <ul><li>Do not send passwords, API keys, payment details, unreleased client data, or production credentials through the public form.</li><li>The first pass can use public pages and crawl evidence. Private analytics or Search Console data should only enter after the project scope is clear.</li><li>The output should separate observations from interpretation, then turn the evidence into a short implementation path.</li></ul>
        <h2>Project Types</h2>
        <ul><li>Technical SEO and search visibility audit</li><li>Atlas-style crawl review</li><li>GA4/GSC search analytics and launch baseline</li></ul>
        <h2>Typical Output</h2>
        <ul><li>Crawl findings tied to affected URLs and source notes</li><li>Indexation, canonical, internal-link, and structured-data review</li><li>GSC/GA4 review where access is available</li><li>Prioritized implementation notes for the next fixes</li></ul>
        <h2>Best Fit</h2>
        <p>Startups, local businesses, B2B sites, technical websites, and content-heavy sites that need crawlability, indexation, page structure, or search visibility reviewed.</p>
        <h2>Not a Fit</h2>
        <p>Generic content packages, paid ads management, social media management, or work that depends on private credentials before scope is clear.</p>
        <h2>Before You Send</h2>
        ${linkCards([
          ...contextualProofLinks.slice(0, 2),
          { label: 'Void Agency page', href: '/void-agency', description: 'Service-practice page for the Void Agency technical SEO work.' },
        ])}
        <h2>Direct Contact</h2>
        ${linkList([
          { label: 'Email Sulayman Bowles', href: 'mailto:sulayman.bowles@gmail.com', description: 'Direct contact path if the form is unavailable.' },
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl' },
          { label: 'Read the technical SEO audit method', href: '/method' },
        ])}`,
    );
  }

  if (route.path === '/austin-technical-seo') {
    return articleShell(
      'Austin Technical SEO',
      'Local service-intent page for Austin technical SEO work.',
      `<p>Austin teams can use this page to evaluate crawlability, indexation, structured data, page clarity, and implementation detail before broader content or growth work.</p>
        <h2>Austin Crawlability Pilot Snapshot</h2>
        <p>The local page is backed by a bounded public fetch sample, not a local-ranking claim. It gives a small public-data baseline for how Austin-area company sites expose crawlability signals.</p>
        ${definitionCards(austinBenchmarkSnapshot.map((item) => [item.label, item.value]))}
        <h3>Measurement Limits</h3>
        <ul>${austinBenchmarkLimits.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        ${linkList([
          { label: 'Open Austin benchmark summary JSON', href: '/research/austin-crawlability-benchmark-summary.json' },
          { label: 'Open Austin benchmark pilot CSV', href: '/research/austin-crawlability-benchmark-pilot.csv' },
        ])}
        <h2>Local Evidence Before Local Claims</h2>
        <ul><li>Review whether Austin service, product, location, and proof pages are reachable from normal internal paths and represented by stable canonical URLs.</li><li>Check whether the page explains who the business serves, what is offered, how to contact the owner, and which public evidence supports the claim.</li><li>Use Search Console, analytics, and Google Business Profile data only when access is available; do not infer private performance from public crawl output.</li></ul>
        <h2>What Gets Checked</h2>
        <ul>${austinSeoSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h2>Claim Boundary</h2>
        <p>This page does not claim local rankings, private traffic movement, revenue impact, or AI citations. Analytics and Search Console data are used only when access is available.</p>
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'Request an audit', href: '/contact' },
          { label: 'Read the technical SEO audit method', href: '/method' },
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl' },
          { label: 'View Void Agency', href: '/void-agency' },
        ])}`,
    );
  }

  if (route.path === '/case-studies/technical-seo-audit') {
    return articleShell(
      'Technical SEO Audit Case Study',
      'A sanitized technical SEO case-study frame for turning crawl data into implementation work.',
      `<p>This case study describes a public method and sample files. It does not expose private client records or claim private traffic movement, rankings, revenue impact, or answer-placement gains.</p>
        <h2>Case Study Steps</h2>
        ${definitionCards(auditCaseStudySteps.map((step) => [step.title, step.copy]))}
        <h2>One Finding Chain</h2>
        <p>A useful audit does not jump from a crawl field to a recommendation. It keeps the observed row, interpreted risk, implementation action, and boundary visible.</p>
        ${definitionCards(auditExampleFindingChain.map((item) => [item.label, item.value]))}
        <h2>Review Chain</h2>
        ${definitionCards([
          ['Observed field', 'Status code, crawl depth, inlinks, outlinks, canonical state, and indexability.'],
          ['Interpreted risk', 'Duplicate templates, weak hub copy, missing canonical targets, soft-404 risk, or crawl-depth waste.'],
          ['Implementation action', 'Repair canonicals, strengthen internal links, consolidate pages, update templates, and document ownership.'],
	          ['Review note', 'Sanitized CSV, issue list, method page, source list, and intake path for next review.'],
        ])}
        <h2>Contextual Links</h2>
        ${linkCards(contextualProofLinks)}`,
    );
  }

  if (route.path === '/resume') {
    return articleShell(
      'Sulayman Bowles Resume',
      'Technical SEO, Atlas, finance research, and product/software execution.',
      `<p>UT Austin McCombs student, Void Agency founder, and builder of Atlas. I work across technical SEO, crawl analysis, web tools, product research, and markets notes.</p>
        <h2>Profile Summary</h2>
        <h3>Builds</h3><p>Atlas, SEO audit pages, React interfaces, research notes, and data workflows.</p>
        <h3>Analyzes</h3><p>Crawl data, search readiness, finance assumptions, operating models, and market structure.</p>
	        <h3>Work samples</h3><p>Public pages, code samples, audit notes, research files, and structured pages that show how the work was done.</p>
        <h2>Experience</h2>
        ${resumeExperience
          .map(([role, org, dates, summary]) => `<h3>${escapeHtml(role)}</h3><p><strong>${escapeHtml(org)}</strong> - ${escapeHtml(dates)}. ${escapeHtml(summary)}</p>`)
          .join('\n        ')}
        <h2>Skills</h2>
        ${definitionCards(resumeSkills)}
	        <h2>Supporting Links</h2>
        ${linkList([
          { label: 'Atlas technical SEO console', href: '/atlas', description: 'Product case study.' },
          { label: 'Markets research index', href: '/markets', description: 'Research notes.' },
          { label: 'Void Agency method', href: '/method', description: 'Technical SEO process.' },
          { label: 'GitHub', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulayman-bowles/', description: 'Professional profile.' },
          { label: 'Download PDF Resume', href: '/Sulayman_Bowles_Resume.pdf', description: 'Current one-page PDF resume.' },
          { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', description: 'Direct contact.' },
        ])}`,
    );
  }

  if (route.path === '/about') {
    return articleShell(
      'About Sulayman Bowles',
      'Technical SEO, Atlas, and finance research.',
      `<p>Sulayman Bowles is a UT Austin McCombs student, founder of Void Agency, and builder of Atlas, technical SEO systems, and finance research workflows.</p>
        <h2>Principles</h2>
        <p>Inputs before interpretation. Crawl before claims. Structure before scale.</p>
        <h2>Experience</h2>
        ${definitionCards(aboutExperience)}
        <h2>Work Areas</h2>
        ${definitionCards(homeDisciplines)}
        ${historicalSourceContextStaticHtml()}
		        <h2>Supporting Links</h2>
        ${sourceMapCards(14)}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/simple') {
    return articleShell(
      'A Short Book About Me',
      'I use this first-person text page to explain how technical SEO, finance research, Atlas, Void Agency, Markets Research, and software systems fit together.',
      `<h2>Chapters</h2>
        ${SIMPLE_BOOK_CHAPTERS.map((chapter) => `<h3>${escapeHtml(`${chapter.numeral}. ${chapter.title}`)}</h3>${paragraphList(chapter.body)}`).join('\n        ')}
        <h2>Links</h2>
        ${linkList(SIMPLE_BOOK_LINKS)}`,
    );
  }

  if (route.path === '/markets') {
    return articleShell(
      'Separate Signal from Noise',
      'Research notes across crawler policy, public data hygiene, markets research assumptions, source tables, and educational samples.',
      `<p>Markets Research is a compact research surface. It keeps current public notes focused on crawler policy, public data hygiene, canonical identity, and markets research assumptions rather than broad market commentary.</p>
        <h2>Research Lanes</h2>
        <h3>Crawler Policy</h3><p>Robots directives, canonical URLs, source clarity, and the cleanup that makes public pages easier to inspect.</p>
        <h3>Public Data Hygiene</h3><p>Structured data, source pages, provenance, and current public records that search systems and human reviewers can inspect.</p>
        <h3>Markets Research Assumptions</h3><p>Educational assumptions tables, risk framing, and data workflows with explicit limits.</p>
        <h3>Models and Tools</h3><p>Spreadsheets, CSV sources, dashboards, and analytical files that show method without implying investment recommendations.</p>
        <h2>Public Research Notes</h2>
        ${PUBLIC_MARKET_THESES.map((thesis) => `<h3><a href="/markets/${thesis.slug}">${escapeHtml(thesis.title)}</a></h3><p>${escapeHtml(thesis.subtitle)}</p>`).join('\n        ')}
        <h2 id="appian-assumptions">Markets Research Memo With Assumptions</h2>
        <p>The Appian materials are educational research samples. Educational research sample, not an investment recommendation. Not a recommendation or price target.</p>
        ${linkList([
          { label: 'Read the markets research memo with assumptions', href: RESEARCH_ASSETS.appianMemoPdf, description: 'Educational Appian research memo PDF.' },
          { label: 'Download the Appian assumptions table', href: RESEARCH_ASSETS.appianAssumptionsCsv, description: 'CSV source table for the research assumptions.' },
        ])}
        ${appianAssumptionTableStaticHtml()}
        <h2>How This Supports the Main Thesis</h2>
        <p>Markets Research is included because it shows finance research judgment: assumptions, risk vectors, valuation logic, and decision frameworks. It should be read as a sample of analytical method, not as unrelated content.</p>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  const thesis = MARKET_THESES.find((item) => route.path === `/markets/${item.slug}`);
  if (thesis) {
    const metrics = thesis.metrics ?? [
      { label: 'Research confidence', value: thesis.conviction },
      { label: 'Horizon', value: thesis.horizon },
      { label: 'Sample portfolio weight', value: thesis.allocation },
    ];
    const sourceLinks = thesis.sources?.length ? thesis.sources.map((source) => ({ label: source.label, href: source.href })) : [];

    return articleShell(
      thesis.title,
      thesis.subtitle,
      `<h2>Memo Details</h2>
        <p>Category: ${escapeHtml(thesis.category)}. Published: ${escapeHtml(thesis.date)}. Read time: ${escapeHtml(thesis.readTime)}.</p>
        ${thesis.claimBoundary ? `<h2>Claim Boundary</h2><p>${escapeHtml(thesis.claimBoundary)}</p>` : ''}
        <h2>Educational Boundary</h2><p>Educational research sample, not an investment recommendation.</p>
        <h2>Article Metrics</h2>
        ${definitionCards(metrics.map((metric) => [metric.label, metric.value]))}
        <h2>Research Thesis</h2>
        ${paragraphList(thesis.content)}
        <h2>Model Frame</h2>
        <p>${escapeHtml(thesis.formulaLabel)}: ${escapeHtml(thesis.formula)}</p>
        <h2>Key Risk Vector</h2>
        <p>${escapeHtml(thesis.risks)}</p>
        ${sourceLinks.length ? `<h2>Research Sources</h2>${linkList(sourceLinks)}` : ''}
        <h2>Internal Links</h2>
        ${linkList([
          { label: 'Markets Research', href: '/markets' },
          { label: 'Home', href: '/' },
          { label: 'Atlas', href: '/atlas' },
          { label: 'Method', href: '/method' },
          { label: 'Resume', href: '/resume' },
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
