import { AI_INFORMATION_STATIC_HTML } from '../content/aiInformation';
import { MARKET_THESES } from '../content/marketTheses';
import type { SeoRoute } from './routes';

type LinkItem = {
  label: string;
  href: string;
  description?: string;
};

const primaryLinks: LinkItem[] = [
  { label: 'Home', href: '/', description: 'Portfolio homepage and selected work.' },
  { label: 'Atlas', href: '/atlas', description: 'Technical SEO audit console project.' },
  { label: 'Markets', href: '/markets', description: 'Finance and market research archive.' },
  { label: 'Method', href: '/method', description: 'Void Agency technical SEO process.' },
  { label: 'About', href: '/about', description: 'Profile, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'HTML resume and proof links.' },
  { label: 'AI Information', href: '/ai-information', description: 'Official entity information for search and AI systems.' },
  { label: 'Sitemap', href: '/sitemap', description: 'Plain HTML links to public pages.' },
  { label: 'Contact', href: '/#contact', description: 'Homepage contact form.' },
];

const atlasProcess = [
  ['Crawl', 'High-fidelity crawling with smart rate control, JavaScript rendering, and adaptive discovery to map the site as search engines do.'],
  ['Extract', 'Extract content, links, directives, structured data, signals, and performance artifacts from every discovered URL.'],
  ['Interpret', 'Normalize and connect signals into an understanding of architecture, intent, and indexation potential.'],
  ['Score', 'Score issues by impact, confidence, and effort using heuristics and historical patterns.'],
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
  ['Diagnose', 'Find the issues that affect discovery, ranking, AI retrieval, and conversion. Every finding is tied to evidence, affected URLs, severity, and likely business impact.'],
  ['Repair', 'Turn the audit into implementation work: fix architecture, consolidate weak pages, improve metadata, strengthen schema, clean internal links, correct crawl waste, and improve page speed.'],
  ['Measure', 'Track what changed after implementation: indexation, search queries, rankings, page performance, crawl behavior, AI visibility, and conversion events.'],
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
  ['SEO & Digital Marketing Analytics Intern', 'B2B Semiconductor Company', 'May 2026 - Present', 'Supporting launch analytics, GA4/GSC reporting, SEO baselines, traffic analysis, keyword tracking, and prioritized site recommendations.'],
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
  ['SEO and Digital Marketing Analytics Intern', 'Supporting website launch analytics, GA4, Google Search Console, SEO baselines, traffic analysis, keyword performance, and prioritized recommendations.'],
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

function linkList(items: LinkItem[]) {
  return `<ul>${items
    .map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a>${item.description ? ` - ${escapeHtml(item.description)}` : ''}</li>`)
    .join('')}</ul>`;
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

  if (route.path === '/') {
    return articleShell(
      'Sulayman Bowles',
      'Technical SEO systems, AI-search discoverability, and finance/data tools.',
      `<h2>Introduction</h2>
        <p>I build systems for search, finance, and decision-making. The common thread is evidence.</p>
        <p>My work starts with messy surfaces: crawl data, page templates, market signals, search behavior, financial assumptions, and unfinished product logic. I turn that into structured systems people can inspect, question, and use.</p>
        <h2>Selected Work</h2>
        <h3><a href="/atlas">Atlas SEO Audit Console</a></h3>
        <p>A crawl-based audit system for finding indexation, architecture, performance, and AI-search readiness issues across real websites.</p>
        <h3><a href="/markets">Markets Research</a></h3>
        <p>A collection of finance and data work covering valuation, market research, operating models, and decision dashboards.</p>
        <h3><a href="/method">Void Agency Method</a></h3>
        <p>Void Agency is my technical SEO and AI-search consultancy, focused on crawlability, answer-readiness, structured content, and evidence-backed website audits.</p>
        <h2>Operating Method</h2>
        <p>I separate signal from presentation. First, collect the evidence. Then structure it. Then decide what it means, what risk it creates, and what should be fixed.</p>
        <ul><li>Crawl before claims</li><li>Structure before scale</li><li>Evidence before polish</li></ul>
        <h2>Disciplines</h2>
        ${definitionCards(homeDisciplines)}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/atlas') {
    return articleShell(
      'Atlas SEO Audit Console',
      'Crawl-based evidence engine for search.',
      `<p>Atlas is a technical SEO audit system that crawls, interprets, and scores websites to surface what search engines see across architecture, indexation, performance, and AI-search readiness.</p>
        <h2>Beyond Basic Crawls</h2>
        <p>Atlas goes deeper than surface reports. It interprets signals, correlates patterns, and prioritizes issues by impact on indexation and visibility.</p>
        <h2>AI-Search Aware</h2>
        <p>Atlas evaluates content and structure for AI-search discoverability: entity clarity, source signals, freshness, and retrievability.</p>
        <h2>Built for Operators</h2>
        <p>Designed for SEO operators and technical teams who need reliable evidence, clear logic, and inspectable outputs to drive decisions.</p>
        <h2>The Atlas Process</h2>
        ${definitionCards(atlasProcess)}
        <h2>Evidence and Outputs</h2>
        <p>Structured artifacts make crawler observations reviewable, inspectable, and defensible across technical teams.</p>
        ${definitionCards(atlasOutputs)}
        <h2>System Intelligence You Can Act On</h2>
        <p>Atlas turns complexity into clarity so teams can fix what matters and prove the impact.</p>
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/method') {
    return articleShell(
      'Void Agency Method',
      'Technical SEO systems for search, AI visibility, and conversion.',
      `<p>Void Agency audits the technical layer behind search visibility: crawl paths, indexation, site architecture, internal links, structured data, performance, analytics, and AI crawler access. The goal is simple: make your site easier to find, understand, cite, and act on.</p>
        <h2>Overview</h2>
        <p>Search visibility is no longer only about ranking pages. It is about whether Google, AI systems, and customers can understand your site clearly enough to trust it.</p>
        <p>Void Agency finds the structural problems that block that understanding, then turns them into a prioritized plan your team can implement.</p>
        <h2>Method Columns</h2>
        ${definitionCards(methodColumns)}
        <h2>How It Works</h2>
        <p>A technical SEO process built for accuracy, evidence, and implementation. Void Agency turns messy site data into a clear plan that teams can act on.</p>
        <h3>Crawl</h3><p>Custom crawlers, sitemap checks, and page extraction.</p>
        <h3>Analyze</h3><p>Indexation, architecture, links, metadata, speed, and schema.</p>
        <h3>Prioritize</h3><p>Rank fixes by severity, effort, affected pages, and revenue risk.</p>
        <h3>Deliver</h3><p>Clear reports, implementation guidance, and measurable next steps.</p>
        <h2>Void in Action</h2>
        ${definitionCards(methodCaseStudies)}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/resume') {
    return articleShell(
      'Sulayman Bowles Resume',
      'Technical SEO, finance research, AI search, and product/software execution.',
      `<p>McCombs School of Business student and Void Agency founder building Atlas, technical SEO audit workflows, research notes, and inspectable web interfaces.</p>
        <h2>Profile Summary</h2>
        <h3>Builds</h3><p>Atlas, SEO audit pages, React interfaces, research notes, and data workflows.</p>
        <h3>Analyzes</h3><p>Crawl evidence, AI-search readiness, finance assumptions, operating models, and market structure.</p>
        <h3>Proof</h3><p>Public routes, sanitized crawl samples, research artifacts, and source-backed project notes.</p>
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
          { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', description: 'Direct contact.' },
        ])}`,
    );
  }

  if (route.path === '/about') {
    return articleShell(
      'About Sulayman Bowles',
      'Technical SEO, Atlas, and finance research.',
      `<p>Sulayman Bowles is a McCombs School of Business student at UT Austin, founder of Void Agency, and builder of Atlas, technical SEO systems, AI-search workflows, and finance/data tools.</p>
        <h2>Principles</h2>
        <p>Evidence before interpretation. Crawl before claims. Structure before scale.</p>
        <h2>Experience</h2>
        ${definitionCards(aboutExperience)}
        <h2>Work Areas</h2>
        ${definitionCards(homeDisciplines)}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  if (route.path === '/markets') {
    return articleShell(
      'Markets Research',
      'Investment cases, valuation logic, crypto research, market systems, and finance/data reasoning.',
      `<p>Markets Research is a finance and data archive covering traditional investment cases, crypto research, valuation logic, market systems, and decision frameworks.</p>
        <h2>Research Lanes</h2>
        <h3>Traditional Cases</h3><p>Equity research, operating models, valuation memos, and business-quality analysis.</p>
        <h3>Crypto Protocols</h3><p>Protocol mechanics, incentive design, token economics, and decentralized infrastructure research.</p>
        <h3>Market and Macro</h3><p>Liquidity, volatility, currency systems, commodity reserves, and allocation frameworks.</p>
        <h3>Models and Tools</h3><p>Financial spreadsheets, assumptions tables, dashboards, and analytical workflows.</p>
        <h2>Research Notes</h2>
        ${MARKET_THESES.map((thesis) => `<h3><a href="/markets/${thesis.slug}">${escapeHtml(thesis.title)}</a></h3><p>${escapeHtml(thesis.subtitle)}</p>`).join('\n        ')}
        <h2>Internal Links</h2>
        ${linkList(primaryLinks)}`,
    );
  }

  const thesis = MARKET_THESES.find((item) => route.path === `/markets/${item.slug}`);
  if (thesis) {
    return articleShell(
      thesis.title,
      thesis.subtitle,
      `<h2>Memo Details</h2>
        <p>Category: ${escapeHtml(thesis.category)}. Published: ${escapeHtml(thesis.date)}. Read time: ${escapeHtml(thesis.readTime)}. Conviction: ${escapeHtml(thesis.conviction)}. Horizon: ${escapeHtml(thesis.horizon)}. Allocation: ${escapeHtml(thesis.allocation)}.</p>
        <h2>Research Thesis</h2>
        ${paragraphList(thesis.content)}
        <h2>Model Frame</h2>
        <p>${escapeHtml(thesis.formulaLabel)}: ${escapeHtml(thesis.formula)}</p>
        <h2>Key Risk Vector</h2>
        <p>${escapeHtml(thesis.risks)}</p>
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
