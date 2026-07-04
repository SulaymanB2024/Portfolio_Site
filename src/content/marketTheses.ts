export interface MarketThesis {
  slug: string;
  number: string;
  category: string;
  title: string;
  seoTitle: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  conviction: string;
  horizon: string;
  allocation: string;
  risks: string;
  formula: string;
  formulaLabel: string;
  content: string[];
  metrics?: Array<{ label: string; value: string }>;
  sources?: Array<{ label: string; href: string }>;
  indexable?: boolean;
  claimBoundary?: string;
}

export const MARKET_THESES: MarketThesis[] = [
  {
    slug: 'network-monopolies',
    number: '01',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Network Effects Memo',
    seoTitle: 'Archived Network Effects Memo',
    subtitle: 'A retained methodology example for separating system assumptions from public evidence.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, allocation guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.04.18',
    readTime: '09 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks:
      'Archived material may include old framing. It should not be treated as a current recommendation, forecast, price target, or allocation model.',
    formula: 'research frame = assumption + evidence required + stated limit',
    formulaLabel: 'Archived Method Frame',
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    claimBoundary:
      'Archived strategy note retained for context. It is not investment advice, allocation guidance, a price target, or a current recommendation.',
    content: [
      'This archived note is retained only to preserve research-history context. It now functions as a methodology example: name a system-level assumption, identify the public evidence needed to support it, and keep unsupported forecast language out of current public claims.',
      'The useful signal is the discipline behind the draft, not any old allocation, return, or macro conclusion. Current public research should be read through the newer crawler-policy, public-data, and identity-cleanup articles.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it does not compete with the current research pages or appear as a current recommendation.',
    ],
  },
  {
    slug: 'computational-commodity-systems',
    number: '02',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Compute Infrastructure Memo',
    seoTitle: 'Archived Compute Infrastructure Memo',
    subtitle: 'A retained methodology example for technical-infrastructure assumptions and evidence limits.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, token guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.05.02',
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks:
      'Archived material may include old framing. It should not be treated as current protocol diligence, token guidance, or infrastructure-market advice.',
    formula: 'infrastructure claim = capacity signal + demand evidence + operational risk',
    formulaLabel: 'Archived Method Frame',
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    claimBoundary:
      'Archived strategy note retained for context. It is not investment advice, allocation guidance, a price target, or a current recommendation.',
    content: [
      'This archived note is retained as a research-process example, not as a live market view. The current standard is to separate technical infrastructure observations from unsupported claims about market size, protocol durability, or future token economics.',
      'A useful compute-infrastructure memo needs visible evidence for capacity, demand, verification costs, reliability, security assumptions, and operational bottlenecks. Without those inputs, the public page should describe the question being studied rather than imply a current conclusion.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it remains available as private-context history without becoming part of the current public research surface.',
    ],
  },
  {
    slug: 'fiat-horizon',
    number: '03',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Monetary Assumptions Memo',
    seoTitle: 'Archived Monetary Assumptions Memo',
    subtitle: 'A retained methodology example for macro assumptions, source limits, and careful public language.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, macro guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.05.15',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks:
      'Archived material may include old framing. It should not be treated as current macro research, portfolio guidance, or asset recommendation.',
    formula: 'macro note = source data + assumption table + uncertainty boundary',
    formulaLabel: 'Archived Method Frame',
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    claimBoundary:
      'Archived strategy note retained for context. It is not investment advice, allocation guidance, a price target, or a current recommendation.',
    content: [
      'This archived note is retained as a reminder that macro writing needs stricter limits than ordinary commentary. Public pages should distinguish measured data, inferred relationships, scenario analysis, and unsupported recommendations.',
      'A useful monetary-assumptions memo needs source tables, defined windows, clear units, and uncertainty language. When those pieces are missing, the safer public format is a methodology note rather than a live claim about assets, solvency, or portfolio construction.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it remains available as context without becoming part of the current public research surface.',
    ],
  },
  {
    slug: 'ai-search-crawler-policy',
    number: '04',
    category: 'CRAWLER POLICY',
    title: 'Crawler Policy Comes Before Visibility',
    seoTitle: 'Crawler Policy for Public Websites',
    subtitle: 'A practical map of search, training, and user-requested retrieval agents for public websites.',
    seoDescription:
      'Research note by Sulayman Bowles on crawler policy, robots.txt limits, OpenAI, Claude, Perplexity, IndexNow, canonical URLs, and search visibility.',
    image: '/og-default.png',
    date: '2026.06.19',
    readTime: '08 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'EVIDENCE-LED',
    horizon: '2026 CRAWL POLICY',
    allocation: 'NOT INVESTMENT ADVICE',
    risks:
      'Crawler access is only a discovery condition. It does not guarantee ranking, indexing, AI citation, model inclusion, or answer-system trust.',
    formula: 'visibility != ranking; visibility starts with access + canonical facts + source quality',
    formulaLabel: 'Search Discoverability Constraint',
    metrics: [
      { label: 'Scope', value: 'SEARCH CRAWLERS' },
      { label: 'Horizon', value: '2026 POLICY' },
      { label: 'Limit', value: 'NO GUARANTEE' },
    ],
    sources: [
      { label: 'OpenAI Crawlers', href: 'https://developers.openai.com/api/docs/bots' },
      {
        label: 'Anthropic crawler guidance',
        href: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
      },
      { label: 'Perplexity Crawlers', href: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers' },
      { label: 'Google robots.txt guide', href: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google canonicalization guide', href: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
      { label: 'IndexNow documentation', href: 'https://www.indexnow.org/documentation' },
    ],
    content: [
      'Search visibility now begins with a crawler policy decision. A public site is no longer dealing only with Googlebot and Bingbot. It is also deciding how to handle search-specific agents, training crawlers, and user-triggered retrieval agents from AI systems. That does not make robots.txt a growth hack. It makes robots.txt, canonical URLs, redirects, source pages, and sitemaps part of the public interface that machines use before they can evaluate the content at all.',
      'The most important distinction is intent. OpenAI separates OAI-SearchBot, which supports ChatGPT search results, from GPTBot, which is associated with crawling content that may be used for foundation-model training. Anthropic separates ClaudeBot, Claude-SearchBot, and Claude-User. Perplexity separates PerplexityBot from Perplexity-User. Those names are not trivia. They make it possible to allow search discovery while making a deliberate, separate choice about model-training crawlers or user-requested fetchers.',
      'For a professional portfolio, the default bias should be clarity rather than maximal blocking. Public pages that explain who the person is, what projects exist, what claims are supported, and where the evidence lives should be crawlable by ordinary search systems and search-oriented AI agents. Private drafts, unreleased resumes, client documents, and sensitive files should not be protected by robots.txt alone. Google is explicit that robots.txt is not a mechanism for keeping web pages out of search results, and that password protection or noindex-style controls are the correct tools when the goal is removal or privacy.',
      'IndexNow adds a push layer to the usual crawl-and-wait model. Its documentation describes a key-file mechanism and JSON submission pattern for notifying participating search engines about changed URLs. For small sites, that matters because the site may not be crawled frequently enough for updates to move through the ecosystem quickly. Publishing a new resume route, redirecting an obsolete PDF, or adding a sourced article should be followed by sitemap freshness and an IndexNow notification where the site already has a valid key.',
      'The limitation is that discovery is not the same thing as trust. A crawler can reach a page and still decide not to index it. A search system can fetch a page and still decide that another source answers the query better. That is why the page itself must be answerable: clear title, stable canonical URL, visible author identity, current date where appropriate, source links, and internal links back to the main identity pages. Crawler access removes a technical barrier; it does not replace content quality.',
      'The operating model I use for this site is simple: allow public discovery agents on public pages, keep stale URLs redirected, publish a current sitemap, and keep major claims tied to visible public support. That is not a promise of rankings or AI citations. It is a disciplined way to make the site legible to search engines, retrieval systems, and human reviewers at the same time.',
    ],
  },
  {
    slug: 'technical-seo-public-data-infrastructure',
    number: '05',
    category: 'DATA INFRASTRUCTURE',
    title: 'Technical SEO as Public Data Infrastructure',
    seoTitle: 'Technical SEO as Data Infrastructure',
    subtitle: 'Why crawlability, structured data, and provenance matter for public discovery and finance-style research.',
    seoDescription:
      'Research note by Sulayman Bowles on technical SEO as public data infrastructure: crawl access, structured data, provenance, and SEC-style comparability.',
    image: '/og-default.png',
    date: '2026.06.19',
    readTime: '09 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'SOURCE-NOTED',
    horizon: 'LONG-LIVED WEB',
    allocation: 'METHODOLOGY',
    risks:
      'The analogy to financial data infrastructure is useful but limited. A portfolio site is not a regulated disclosure system, and search visibility should not be framed as guaranteed distribution.',
    formula: 'usable public records = access + identifiers + provenance + consistency',
    formulaLabel: 'Public Data Infrastructure Pattern',
    metrics: [
      { label: 'Scope', value: 'SEO + DATA' },
      { label: 'Frame', value: 'INFRASTRUCTURE' },
      { label: 'Evidence Standard', value: 'SOURCES FIRST' },
    ],
    sources: [
      { label: 'Google structured data introduction', href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
      { label: 'Google helpful content guidance', href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
      { label: 'SEC EDGAR APIs', href: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces' },
      { label: 'SEC developer resources', href: 'https://www.sec.gov/about/developer-resources' },
      { label: 'Google sitemap overview', href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview' },
    ],
    content: [
      'Technical SEO is usually described as a marketing function, but the better frame is data infrastructure. Crawlers need access. Indexes need stable identifiers. Search systems need source clarity. Human readers need provenance. When those layers are missing, the site may still look polished, but it behaves like an unreliable dataset: hard to join, hard to verify, and easy to misread.',
      'Finance research gives a useful analogy. Public-market workflows depend on records that can be located, parsed, compared, and tied back to the issuer. SEC EDGAR APIs expose company submissions and extracted XBRL facts because serious analysis depends on structured public records. A personal site is not EDGAR, but the same quality instinct applies: if a public claim matters, it should have a stable URL, a date or context, a source link, and a consistent relationship to the rest of the public record.',
      'Google describes structured data as a standardized way to provide explicit clues about page meaning. That is not magic markup, and it is not a substitute for visible content. It is a way to make the page easier to classify when the page already says something useful. A ProfilePage schema should match the actual profile page. Article schema should describe the actual article. Person and Organization data should avoid private claims or inflated credentials that users cannot see on the page.',
      'The public-data lens also changes how you think about old files. A stale PDF, duplicate subdomain, outdated bio, or orphaned project page is not only an aesthetic problem. It is a conflicting record. Search engines may discover it without understanding which version is current. Redirecting obsolete URLs, using one canonical host, and keeping internal links pointed at the preferred page are basic data hygiene steps.',
      'Google helpful-content guidance is useful here because it pulls the conversation away from mechanical SEO. The page should make clear who created the content, how the work was produced where that matters, and why the content exists. That is especially important for finance-adjacent writing. If a page discusses markets, valuation logic, or search visibility, the reader should be able to see the assumptions, source base, and limits of the claim.',
      'The practical standard is not more pages. It is better public records. A technical SEO audit should ask whether the site has crawlable support pages, sourced claims, consistent authorship, structured data that matches visible content, and a sitemap that reflects the current public record. If those pieces are in place, the site becomes easier for humans and machines to inspect without pretending that infrastructure alone creates authority.',
    ],
  },
  {
    slug: 'canonical-identity-personal-seo',
    number: '06',
    category: 'ENTITY CONSISTENCY',
    title: 'Canonical Identity Beats More Content',
    seoTitle: 'Canonical Identity for Personal SEO',
    subtitle: 'A reconciliation checklist for profiles, stale PDFs, sameAs links, and public reference pages.',
    seoDescription:
      'Practical research note by Sulayman Bowles on identity cleanup, sameAs discipline, profile-page schema, stale resume PDFs, internal links, and external bio consistency.',
    image: '/og-default.png',
    date: '2026.06.19',
    readTime: '07 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'PRACTICAL',
    horizon: 'ONGOING HYGIENE',
    allocation: 'PROFILE GRAPH',
    risks:
      'External profiles can drift, block unauthenticated crawlers, or expose old positioning. The site should distinguish verified profile links from weak or dead references.',
    formula: 'one person record = canonical URL + profile pages + sameAs discipline + redirected stale files',
    formulaLabel: 'Personal Entity Reconciliation Pattern',
    metrics: [
      { label: 'Scope', value: 'PERSON GRAPH' },
      { label: 'Priority', value: 'CANONICALS' },
      { label: 'Maintenance', value: 'ONGOING' },
    ],
    sources: [
      { label: 'Google canonicalization guide', href: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
      { label: 'Google ProfilePage structured data', href: 'https://developers.google.com/search/docs/appearance/structured-data/profile-page' },
      { label: 'Schema.org Person', href: 'https://schema.org/Person' },
      { label: 'Schema.org ProfilePage', href: 'https://schema.org/ProfilePage' },
      { label: 'Google structured data policies', href: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' },
    ],
    content: [
      'The fastest way to weaken a personal SEO graph is to publish more disconnected versions of the same person. A portfolio homepage says one thing, an old resume PDF says another, GitHub says nothing, LinkedIn uses a different line, and a hackathon profile still points at an abandoned project. None of those pieces is necessarily wrong on its own. The problem is that crawlers and human reviewers have to decide which one is current.',
      'Canonical identity starts with one preferred host and one preferred profile thesis. Google describes redirects as one of the strongest canonicalization signals and recommends consistent canonical URLs across a site. For a personal site, that means the apex domain should resolve clearly, the www host should redirect, internal links should point at the same canonical pages, and stale URLs should be retired through redirects rather than left as dead ends.',
      'The HTML resume should be the durable source of truth because it can carry visible text, internal links, schema, and a current update path. A downloadable PDF can still be useful, but it should not become the canonical identity page unless there is a reason for that tradeoff. When an old resume PDF is already in search results, the clean repair is either to restore the exact file with current content or redirect it to the canonical resume page so the old surface stops returning a dead 404.',
      'Structured data should be conservative. Schema.org defines sameAs as a URL that unambiguously identifies the same item, not a bucket for every social link ever created. For a person, GitHub and LinkedIn can be strong sameAs links when they visibly describe the same person and current role. A dead, private, or weakly matching profile should stay out of sameAs even if it once existed. It can still appear as historical context on a source page if that context is useful.',
      'ProfilePage markup works best when the visible page is clearly about one person or one organization. Google guidance describes mainEntity as the person or organization the profile page is about. That makes /about, /resume, and /ai-information useful profile surfaces if they share the same Person @id, current description, and source links. The markup should not invent claims that the page text does not support.',
      'The reconciliation process is practical: pick the canonical domain, redirect duplicate hosts, redirect stale PDFs, keep /about and /resume aligned, publish an /ai-information page with source roles and caveats, and push the same one-line current identity to external bios. The output is not a bigger personal brand. It is a smaller, cleaner set of records that makes the current public identity easier to verify.',
    ],
  },
];

export const PUBLIC_MARKET_THESES = MARKET_THESES.filter((thesis) => thesis.indexable !== false);

export function getMarketThesisBySlug(slug: string) {
  return MARKET_THESES.find((thesis) => thesis.slug === slug);
}

export function getMarketThesisByIndex(index: number) {
  return MARKET_THESES[index] ?? MARKET_THESES[0];
}
