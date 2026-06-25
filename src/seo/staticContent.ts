import {
  AI_INFORMATION_STATIC_HTML,
  evidenceGroups,
  identityReconciliation,
  sourceMap,
} from '../content/aiInformation';
import { aiSearchAuditChecklist, atlasCheckItems } from '../content/evidenceLists';
import { MARKET_THESES } from '../content/marketTheses';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
import {
  appianAssumptionRows,
  atlasSampleFindings,
  atlasSampleRows,
  auditCaseStudySteps,
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
  ['Extract', 'Extract content, links, directives, structured data, signals, and performance artifacts from every discovered URL.'],
  ['Interpret', 'Normalize and connect signals into an understanding of architecture, intent, and indexation potential.'],
  ['Score', 'Score issues by severity, confidence, affected URLs, implementation effort, and evidence quality using documented audit rules.'],
  ['Report', 'Structure operator-ready reports, preview packages, and task lists with evidence and recommended actions.'],
];

const atlasOutputs = [
  ['Issue Detection', 'Prioritized technical issues with impact scoring, severity labels, crawler evidence, and remediation steps.'],
  ['Internal Link Graph', 'A map of flow, crawl depth, orphan risk, inlinks, outlinks, and authority distribution across important pages.'],
  ['Indexation Overview', 'Crawlable versus indexable status across valid sitemap entries, noindex headers, canonical gaps, and robots-blocked URLs.'],
  ['Technical Findings', 'Examples with affected URLs, confidence, evidence, and next implementation actions.'],
  ['Export Preview', 'Sample executive summaries, technical audit sections, issue tables, crawl data layouts, and dashboard views for operators.'],
];

const methodColumns = [
  ['Crawl', 'Map the site as search engines see it. Inspect indexable URLs, crawl depth, sitemaps, robots rules, redirects, canonicals, metadata, templates, and internal links.'],
  ['Diagnose', 'Find the issues that affect discovery, retrieval, indexation, and conversion paths. Every finding is tied to evidence, affected URLs, severity, and implementation context.'],
  ['Repair', 'Turn the audit into implementation work: fix architecture, consolidate weak pages, improve metadata, strengthen schema, clean internal links, correct crawl waste, and improve page speed.'],
  ['Measure', 'Track what changed after implementation: indexation, search queries, page performance, crawl behavior, AI-search references, and conversion events where analytics access supports it.'],
];

const methodCaseStudies = [
  ['Indexation Audit at Scale', 'Mapped thousands of URLs to uncover crawl waste, duplicate templates, weak canonicals, orphaned pages, redirect chains, and pages blocked from meaningful discovery.'],
  ['AI Visibility Benchmark', 'Reviewed whether a company could be clearly understood and cited by AI systems. Tested entity clarity, answer-ready pages, schema, source structure, and crawler access.'],
  ['Product Discovery System', 'Audited product and collection pages to find missing metadata, thin templates, weak internal links, duplicate paths, and search-intent gaps.'],
  ['Service-Area Visibility Audit', 'Mapped location pages, service pages, Google Business Profile signals, crawl structure, and local entity clarity to improve discovery in high-intent searches.'],
];

const resumeExperience = [
  ['Founder', 'VOID Agency', 'Dec 2025 - Present', 'Built Void Agency around technical SEO audits, website builds, local search work, and crawler-access checks. $50K+ in collected client revenue as of May 2026.'],
  ['AI Product Manager Intern', 'Chegg, Office of the Chief Product Officer', 'May 2026 - Aug 2026', 'Supporting AI product research, competitive analysis, workflow mapping, and prototype review for student-facing tools.'],
  ['Technical SEO Analytics', 'Private SEO Engagement', 'May 2026 - Present', 'Supporting launch analytics, GA4/GSC reporting, SEO baselines, traffic analysis, keyword tracking, and prioritized site recommendations.'],
  ['Student Associate', 'Jon Brumley Texas Venture Labs', 'Sep 2025 - Present', 'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.'],
];

const resumeSkills = [
  ['Technical SEO', 'Crawler access, indexability, canonicals, internal links, schema, templates, and performance inputs.'],
  ['AI Search and Product', 'AI product research, competitive mapping, workflow analysis, prompt review, and prototype review.'],
  ['Finance and Data', 'Valuation research, operating analysis, GA4/GSC reporting, market notes, and assumptions tables.'],
  ['Software Execution', 'React/Vite interfaces, Python scripts, audit dashboards, structured reports, and source-backed artifacts.'],
];

const aboutExperience = [
  ['VOID Agency Founder', 'Built an SEO and web systems agency generating $50K+ in collected revenue through technical SEO audits, website builds, local search strategy, and AI-search visibility work.'],
  ['Chegg AI Product Manager Intern', 'Working on AI product strategy, research, competitive analysis, user workflows, prototype review, and AI-enabled student experiences.'],
  ['Technical SEO Analytics', 'Supporting website launch analytics, GA4, Google Search Console, SEO baselines, traffic analysis, keyword performance, and prioritized recommendations.'],
  ['Jon Brumley Texas Venture Labs Student Associate', 'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.'],
];

const homeDisciplines = [
  ['Technical SEO Systems', 'Crawl architecture, indexability, internal links, page templates, metadata, structured data, performance inputs, and issue logic. Built for diagnosis, not vague scoring.'],
  ['AI Search Discoverability', 'Answer-ready pages, entity clarity, citation surfaces, crawl permissions, structured signals, and content that helps AI systems understand who or what a site represents.'],
  ['Finance and Data Analysis', 'Valuation models, market research, operating analysis, dashboards, and decision tools built around assumptions that can be inspected and challenged.'],
  ['Web Systems and Presentation', 'React interfaces, portfolio pages, audit dashboards, visual systems, and written explanations that turn raw work into something legible.'],
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

function proofLinkCards(items: Array<{ label: string; href: string; description?: string }>) {
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
        <p><a href="/ai-information#identity-reconciliation">Read the full identity reconciliation on the AI Information page</a>.</p>
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
      'Research Assets',
      'Citation-ready public research assets across technical SEO, AI-search, Atlas, crawlability, identity, and finance/data work.',
      `<p>This index gives editors, source-page owners, technical SEO writers, AI-search researchers, and profile reviewers one clean URL for public assets and source files.</p>
        <h2>Citation Targets</h2>
        ${publicResearchAssets
          .map(
            (asset) =>
              `<h3><a href="${asset.href}">${escapeHtml(asset.name)}</a></h3><p>Priority: P${asset.priority}. Type: ${escapeHtml(asset.type)}. Preferred anchor: ${escapeHtml(asset.preferredAnchor)}.</p><p>${escapeHtml(asset.pitchAngle)}</p>`,
          )
          .join('\n        ')}
        <h2>Downloadable Public Files</h2>
        ${linkList(publicDataDownloads)}
        <h2>Claim Boundaries</h2>
        <ul>${researchClaimBoundaries.map((boundary) => `<li>${escapeHtml(boundary)}</li>`).join('')}</ul>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/') {
    return articleShell(
      'Sulayman Bowles',
      'UT Austin McCombs, Atlas, technical SEO, AI-search visibility, and finance/data research.',
      `<h2>Introduction</h2>
        <p>Sulayman Bowles is a UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, AI-search visibility, and finance/data research.</p>
        <p>I build systems for search, finance, and decision-making. The common thread is evidence.</p>
        <p>My work starts with messy surfaces: crawl data, page templates, market signals, search behavior, financial assumptions, and unfinished product logic. I turn that into structured systems people can inspect, question, and use.</p>
        <h2>Selected Work</h2>
        <h3><a href="/atlas">Atlas SEO Audit Console</a></h3>
        <p>A crawl-based audit system for finding indexation, architecture, performance, and AI-search readiness issues across real websites.</p>
        <h3><a href="/method">Void Agency Method</a></h3>
        <p>Void Agency is my technical SEO and AI-search consultancy, focused on crawlability, answer-readiness, structured content, and evidence-backed website audits.</p>
        <h3><a href="/markets">Markets Research</a></h3>
        <p>A collection of finance and data work covering valuation, market research, operating models, and decision dashboards.</p>
        <h2>Operating Method</h2>
        <p>I separate signal from presentation. First, collect the evidence. Then structure it. Then decide what it means, what risk it creates, and what should be fixed.</p>
        <ul><li>Crawl before claims</li><li>Structure before scale</li><li>Evidence before polish</li></ul>
        <h2>Disciplines</h2>
        ${definitionCards(homeDisciplines)}
        <h2>Contextual Proof Links</h2>
        ${proofLinkCards(contextualProofLinks)}
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/work') {
    return articleShell(
      'Selected Work',
      'Public work surfaces across Atlas crawl evidence, technical SEO method, sanitized case-study logic, and finance/data artifacts.',
      `<h2>Work Index</h2>
        ${workProofCards
          .map(
            (item) =>
              `<h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.copy)}</p><p><a href="${item.ctaHref}">${escapeHtml(item.cta)}</a></p>`,
          )
          .join('\n        ')}
        <h2>Contextual Proof Links</h2>
        ${proofLinkCards(contextualProofLinks)}
        <h2>Public Routes</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas') {
    return articleShell(
      'Atlas SEO Audit Console',
      'Crawl-based evidence engine for search.',
      `<p>Atlas is a technical SEO audit system that crawls, interprets, and scores websites to surface what search engines see across architecture, indexation, performance, and AI-search readiness. It is not a generic content-writing product.</p>
        <h2>Beyond Basic Crawls</h2>
        <p>Atlas goes deeper than surface reports. It interprets signals, correlates patterns, and prioritizes issues by impact on indexation and visibility.</p>
        <h2>AI-Search Aware</h2>
        <p>Atlas evaluates content and structure for AI-search discoverability: entity clarity, source signals, freshness, and retrievability.</p>
        <h2>Built for Operators</h2>
        <p>Designed for SEO operators and technical teams who need reliable evidence, clear logic, and inspectable outputs to drive decisions.</p>
        <h2>The Atlas Process</h2>
        ${definitionCards(atlasProcess)}
        <h2>What Atlas SEO Audit Console Checks</h2>
        ${evidenceLinkCards(atlasCheckItems)}
        <h2>Evidence and Outputs</h2>
        <p>Structured artifacts make crawler observations reviewable, inspectable, and defensible across technical teams.</p>
        ${definitionCards(atlasOutputs)}
        <h2>Specific Evidence Handled by Atlas</h2>
        ${evidenceGroupCards()}
        <h2>Source Links</h2>
        ${linkList([
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl', description: 'Sanitized URL-level crawl evidence and CSV download.' },
          { label: 'GitHub profile', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'View the GitHub repo for the audit CLI', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-', description: 'Public scraper/audit code evidence.' },
          { label: 'AI Information', href: '/ai-information', description: 'Canonical entity and source page.' },
          { label: 'Read the technical SEO audit method', href: '/method', description: 'Service/process context.' },
          { label: 'Request an audit', href: '/contact', description: 'Technical SEO and AI-search visibility intake.' },
        ])}
        <h2>System Intelligence You Can Act On</h2>
        <p>Atlas turns complexity into inspectable evidence so operators can decide what matters, what should be fixed, and what source data supports the recommendation.</p>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas/sample-crawl') {
    return articleShell(
      'Atlas Sample Crawl Run',
      'Sanitized crawl evidence showing URL status, indexability, link counts, canonical state, issue labels, and notes.',
      `<p>This sample is sanitized/demo data. It supports the public method explanation without identifying a private client or claiming live rankings, traffic movement, revenue impact, or AI-search citations.</p>
        <h2>Downloadable Source Table</h2>
        ${linkList([{ label: 'Download sanitized crawl CSV', href: RESEARCH_ASSETS.atlasSampleCsv, description: 'URL-level Atlas sample data.' }])}
        <h2>What the Sample Proves</h2>
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
      'Technical SEO systems for search, AI-search visibility, and conversion paths.',
      `<p>Void Agency audits the technical layer behind search visibility: crawl paths, indexation, site architecture, internal links, structured data, performance, analytics, and AI crawler access. The method connects back to Sulayman Bowles, Atlas, and evidence-backed web/search systems.</p>
        <h2>Overview</h2>
        <p>Search visibility is no longer only about ranking pages. It is about whether Google, AI systems, and customers can understand your site clearly enough to trust it.</p>
        <p>Void Agency finds the structural problems that block that understanding, then turns them into a prioritized plan your team can implement.</p>
        <h2>Method Columns</h2>
        ${definitionCards(methodColumns)}
        <h2>How It Works</h2>
        <p>A technical SEO process built for accuracy, evidence, and implementation. Void Agency turns messy site data into a clear plan that teams can act on.</p>
        <h3>Crawl</h3><p>Custom crawlers, sitemap checks, and page extraction.</p>
        <h3>Analyze</h3><p>Indexation, architecture, links, metadata, speed, and schema.</p>
        <h3>Prioritize</h3><p>Rank fixes by severity, effort, affected pages, source evidence, and implementation context.</p>
        <h3>Deliver</h3><p>Clear reports, implementation guidance, and measurable next steps.</p>
        <h2>AI Search Visibility Audit Checklist</h2>
        ${evidenceLinkCards(aiSearchAuditChecklist)}
        <h2>Void in Action</h2>
        ${definitionCards(methodCaseStudies)}
        <h2>Evidence Terms Used in the Method</h2>
        ${definitionCards([
          ['Crawlability', 'Robots rules, sitemap coverage, response codes, redirects, page templates, and crawl-depth patterns.'],
          ['Page Evidence', 'Raw HTML, rendered HTML, canonical URLs, metadata, internal links, structured data, and indexability directives.'],
          ['Analytics Review', 'Google Search Console, GA4, query buckets, landing pages, search intent, and page-level recommendations where access is available.'],
          ['Source Map', 'Personal site, GitHub, Void Agency, LinkedIn, UT/McCombs context, Atlas, Markets Research, and the HTML resume.'],
        ])}
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl', description: 'Sanitized crawl evidence used as a public proof artifact.' },
          { label: 'View Void Agency proof', href: '/void-agency', description: 'Organization/source page for Void Agency.' },
          { label: 'Request an audit', href: '/contact', description: 'Audit intake route.' },
          ...primaryLinks,
        ])}`,
    );
  }

  if (route.path === '/void-agency') {
    return articleShell(
      'Void Agency',
      'Organization proof page for the technical SEO and AI-search visibility service branch.',
      `<p>Void Agency is the service branch connected to Sulayman Bowles work in technical SEO, AI-search visibility, crawlability, indexation diagnostics, structured content, analytics review, and evidence-backed web audits.</p>
        <h2>Source-Backed Links</h2>
        ${voidAgencyProofLinks
          .map(
            (link) =>
              `<h3><a href="${link.href}">${escapeHtml(link.label)}</a></h3><p>${escapeHtml(link.role)}: ${escapeHtml(link.copy)}</p>`,
          )
          .join('\n        ')}
        <h2>Route Roles</h2>
        <p>/void-agency is the organization proof page. /method is the technical SEO audit process page.</p>
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
      'Technical SEO, AI-search visibility, crawl evidence, indexation, internal-link, structured-data, analytics, and finance/data research intake.',
      `<p>Use this route for technical SEO, AI-search visibility, crawl evidence, indexation, internal-link, structured-data, analytics, or finance/data research requests.</p>
        <h2>Before You Send</h2>
        ${proofLinkCards(contextualProofLinks.slice(0, 3))}
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
      'Local service-intent page for Austin technical SEO and AI-search visibility work.',
      `<p>Austin teams can use this page to evaluate crawlability, indexation, structured data, source clarity, and implementation evidence before broader content or growth work.</p>
        <h2>What Gets Checked</h2>
        <ul>${austinSeoSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h2>Claim Boundary</h2>
        <p>This page does not claim local rankings, private traffic movement, revenue impact, or AI citations. Analytics and Search Console data are used only when access is available.</p>
        <h2>Contextual Links</h2>
        ${linkList([
          { label: 'Request an audit', href: '/contact' },
          { label: 'Read the technical SEO audit method', href: '/method' },
          { label: 'See an Atlas sample crawl run', href: '/atlas/sample-crawl' },
          { label: 'View Void Agency proof', href: '/void-agency' },
        ])}`,
    );
  }

  if (route.path === '/case-studies/technical-seo-audit') {
    return articleShell(
      'Technical SEO Audit Case Study',
      'A sanitized technical SEO case-study frame for turning crawl evidence into implementation work.',
      `<p>This case study describes a public method and sample artifacts. It does not expose private client records or claim private traffic movement, rankings, revenue impact, or AI-search citation gains.</p>
        <h2>Case Study Steps</h2>
        ${definitionCards(auditCaseStudySteps.map((step) => [step.title, step.copy]))}
        <h2>Evidence Chain</h2>
        ${definitionCards([
          ['Observed field', 'Status code, crawl depth, inlinks, outlinks, canonical state, and indexability.'],
          ['Interpreted risk', 'Duplicate templates, weak hub copy, missing canonical targets, soft-404 risk, or crawl-depth waste.'],
          ['Implementation action', 'Repair canonicals, strengthen internal links, consolidate pages, update templates, and document ownership.'],
          ['Review artifact', 'Sanitized CSV, issue list, method page, source graph, and intake path for next review.'],
        ])}
        <h2>Contextual Links</h2>
        ${proofLinkCards(contextualProofLinks)}`,
    );
  }

  if (route.path === '/resume') {
    return articleShell(
      'Sulayman Bowles Resume',
      'Technical SEO, Atlas, finance/data research, and product/software execution.',
      `<p>UT Austin McCombs student and Void Agency founder building Atlas, technical SEO audit workflows, research notes, and inspectable web interfaces.</p>
        <h2>Profile Summary</h2>
        <h3>Builds</h3><p>Atlas, SEO audit pages, React interfaces, research notes, and data workflows.</p>
        <h3>Analyzes</h3><p>Crawl evidence, AI-search readiness, finance assumptions, operating models, and market structure.</p>
        <h3>Proof</h3><p>Public routes, preview research notes, and source-backed project pages.</p>
        <h2>Experience</h2>
        ${resumeExperience
          .map(([role, org, dates, summary]) => `<h3>${escapeHtml(role)}</h3><p><strong>${escapeHtml(org)}</strong> - ${escapeHtml(dates)}. ${escapeHtml(summary)}</p>`)
          .join('\n        ')}
        <h2>Skills</h2>
        ${definitionCards(resumeSkills)}
        <h2>Proof and Entry Paths</h2>
        ${linkList([
          { label: 'Atlas technical SEO console', href: '/atlas', description: 'Product case study.' },
          { label: 'Markets research index', href: '/markets', description: 'Research notes.' },
          { label: 'Void Agency method', href: '/method', description: 'Technical SEO process.' },
          { label: 'GitHub', href: 'https://github.com/SulaymanB2024', description: 'Public code profile.' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulayman-bowles/', description: 'Professional profile.' },
          { label: 'Download PDF Resume', href: '/Sulayman_Bowles_Resume.pdf', description: 'Current one-page PDF resume.' },
          { label: 'AI Information', href: '/ai-information', description: 'Canonical source map.' },
          { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', description: 'Direct contact.' },
        ])}`,
    );
  }

  if (route.path === '/about') {
    return articleShell(
      'About Sulayman Bowles',
      'Technical SEO, Atlas, and finance/data research.',
      `<p>Sulayman Bowles is a UT Austin McCombs student, founder of Void Agency, and builder of Atlas, technical SEO systems, AI-search workflows, and finance/data research artifacts.</p>
        <h2>Principles</h2>
        <p>Evidence before interpretation. Crawl before claims. Structure before scale.</p>
        <h2>Experience</h2>
        ${definitionCards(aboutExperience)}
        <h2>Work Areas</h2>
        ${definitionCards(homeDisciplines)}
        ${historicalSourceContextStaticHtml()}
        <h2>Public Source Graph</h2>
        ${sourceMapCards(14)}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/simple') {
    return articleShell(
      'A Short Book About Me',
      'I use this first-person text page to explain how technical SEO, AI-search visibility, finance/data research, Atlas, Void Agency, Markets Research, and software systems fit together.',
      `<h2>Chapters</h2>
        ${SIMPLE_BOOK_CHAPTERS.map((chapter) => `<h3>${escapeHtml(`${chapter.numeral}. ${chapter.title}`)}</h3>${paragraphList(chapter.body)}`).join('\n        ')}
        <h2>Links</h2>
        ${linkList(SIMPLE_BOOK_LINKS)}`,
    );
  }

  if (route.path === '/markets') {
    return articleShell(
      'Separate Signal from Noise',
      'Evidence-driven research across markets, crypto, and investment strategy.',
      `<p>Markets Research separates signal from noise through traditional investment cases, crypto research, valuation logic, market systems, and decision frameworks.</p>
        <h2>Research Lanes</h2>
        <h3>Traditional Cases</h3><p>Equity research, operating models, valuation memos, and business-quality analysis.</p>
        <h3>Crypto Protocols</h3><p>Protocol mechanics, incentive design, token economics, and decentralized infrastructure research.</p>
        <h3>Market and Macro</h3><p>Liquidity, volatility, currency systems, commodity reserves, and allocation frameworks.</p>
        <h3>Models and Tools</h3><p>Financial spreadsheets, assumptions tables, dashboards, and analytical workflows.</p>
        <h2>Research Notes</h2>
        ${MARKET_THESES.map((thesis) => `<h3><a href="/markets/${thesis.slug}">${escapeHtml(thesis.title)}</a></h3><p>${escapeHtml(thesis.subtitle)}</p>`).join('\n        ')}
        <h2 id="appian-assumptions">Finance/Data Memo With Assumptions</h2>
        <p>The Appian materials are educational research samples. They are not investment advice, a price target, or a live market recommendation.</p>
        ${linkList([
          { label: 'Read the finance/data memo with assumptions', href: RESEARCH_ASSETS.appianMemoPdf, description: 'Educational Appian research memo PDF.' },
          { label: 'Download the Appian assumptions table', href: RESEARCH_ASSETS.appianAssumptionsCsv, description: 'CSV source table for the research assumptions.' },
        ])}
        ${appianAssumptionTableStaticHtml()}
        <h2>How This Supports the Main Thesis</h2>
        <p>Markets Research is included because it shows finance/data judgment: assumptions, risk vectors, valuation logic, and decision frameworks. It should be read as evidence of analytical method, not as unrelated content.</p>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  const thesis = MARKET_THESES.find((item) => route.path === `/markets/${item.slug}`);
  if (thesis) {
    const metrics = thesis.metrics ?? [
      { label: 'Conviction', value: thesis.conviction },
      { label: 'Horizon', value: thesis.horizon },
      { label: 'Allocation', value: thesis.allocation },
    ];
    const sourceLinks = thesis.sources?.length ? thesis.sources.map((source) => ({ label: source.label, href: source.href })) : [];

    return articleShell(
      thesis.title,
      thesis.subtitle,
      `<h2>Memo Details</h2>
        <p>Category: ${escapeHtml(thesis.category)}. Published: ${escapeHtml(thesis.date)}. Read time: ${escapeHtml(thesis.readTime)}.</p>
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
