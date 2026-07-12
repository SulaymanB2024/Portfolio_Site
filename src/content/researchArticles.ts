import type { ResearchArticle } from './articleModels';

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    kind: 'research',
    slug: 'ai-search-crawler-policy',
    number: '01',
    category: 'CRAWLER POLICY',
    title: 'Crawler Policy Comes Before Visibility',
    seoTitle: 'Crawler Policy for Public Websites',
    subtitle: 'A practical map of search, training, and user-requested retrieval agents for public websites.',
    seoDescription:
      'Research note by Sulayman Bowles on crawler policy, robots.txt limits, OpenAI, Claude, Perplexity, IndexNow, canonical URLs, and search visibility.',
    image: '/og-default.png',
    date: '2026.06.19',
    dateModified: '2026.07.12',
    readTime: '08 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Crawler access is a prerequisite for discovery, but access alone never proves indexing, ranking, model inclusion, or answer-system trust.',
    evidenceBoundary:
      'This note documents public crawler controls and source guidance. It does not claim rankings, indexing, AI citations, or provider-side inclusion.',
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
      'The most important distinction is intent. OpenAI separates OAI-SearchBot, which supports ChatGPT search results, from GPTBot, which is associated with crawling content that may be used for foundation-model training. Anthropic separates ClaudeBot, Claude-SearchBot, and Claude-User. Perplexity separates PerplexityBot from Perplexity-User. Those names make it possible to allow search discovery while making a separate choice about model-training crawlers or user-requested fetchers.',
      'For a professional portfolio, the default bias should be clarity rather than maximal blocking. Public pages that explain who the person is, what projects exist, what claims are supported, and where the evidence lives should be crawlable by ordinary search systems and search-oriented AI agents. Private drafts, unreleased resumes, client documents, and sensitive files should not be protected by robots.txt alone. Google is explicit that robots.txt is not a mechanism for keeping web pages out of search results.',
      'IndexNow adds a push layer to the usual crawl-and-wait model. Its documentation describes a key-file mechanism and JSON submission pattern for notifying participating search engines about changed URLs. For small sites, that matters because the site may not be crawled frequently enough for updates to move through the ecosystem quickly.',
      'The limitation is that discovery is not the same thing as trust. A crawler can reach a page and still decide not to index it. A search system can fetch a page and still decide that another source answers the query better. That is why the page itself must be answerable: clear title, stable canonical URL, visible author identity, current date where appropriate, source links, and internal links back to the main identity pages.',
      'The operating model I use for this site is simple: allow public discovery agents on public pages, keep stale URLs redirected, publish a current sitemap, and keep major claims tied to visible public support. That is not a promise of rankings or AI citations. It is a disciplined way to make the site legible to search engines, retrieval systems, and human reviewers at the same time.',
    ],
  },
  {
    kind: 'research',
    slug: 'technical-seo-public-data-infrastructure',
    number: '02',
    category: 'DATA INFRASTRUCTURE',
    title: 'Technical SEO as Public Data Infrastructure',
    seoTitle: 'Technical SEO as Data Infrastructure',
    subtitle: 'Why crawlability, structured data, and provenance matter for public discovery and finance-style research.',
    seoDescription:
      'Research note by Sulayman Bowles on technical SEO as public data infrastructure: crawl access, structured data, provenance, and SEC-style comparability.',
    image: '/og-default.png',
    date: '2026.06.19',
    dateModified: '2026.07.12',
    readTime: '09 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Technical SEO is best understood as public-data infrastructure: access, stable identifiers, provenance, and consistent records before distribution.',
    evidenceBoundary:
      'The comparison to financial-data infrastructure is an analytical frame. A portfolio is not a regulated disclosure system, and infrastructure does not guarantee distribution.',
    metrics: [
      { label: 'Scope', value: 'SEO + DATA' },
      { label: 'Frame', value: 'INFRASTRUCTURE' },
      { label: 'Evidence standard', value: 'SOURCES FIRST' },
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
      'Google describes structured data as a standardized way to provide explicit clues about page meaning. That is not magic markup, and it is not a substitute for visible content. It is a way to make the page easier to classify when the page already says something useful. A ProfilePage schema should match the actual profile page. Article schema should describe the actual article.',
      'The public-data lens also changes how you think about old files. A stale PDF, duplicate subdomain, outdated bio, or orphaned project page is not only an aesthetic problem. It is a conflicting record. Search engines may discover it without understanding which version is current. Redirecting obsolete URLs, using one canonical host, and keeping internal links pointed at the preferred page are basic data hygiene steps.',
      'Google helpful-content guidance is useful here because it pulls the conversation away from mechanical SEO. The page should make clear who created the content, how the work was produced where that matters, and why the content exists. That is especially important for finance-adjacent writing. The reader should be able to see the assumptions, source base, and limits of the claim.',
      'The practical standard is not more pages. It is better public records. A technical SEO audit should ask whether the site has crawlable support pages, sourced claims, consistent authorship, structured data that matches visible content, and a sitemap that reflects the current public record.',
    ],
  },
  {
    kind: 'research',
    slug: 'canonical-identity-personal-seo',
    number: '03',
    category: 'ENTITY CONSISTENCY',
    title: 'Canonical Identity Beats More Content',
    seoTitle: 'Canonical Identity for Personal SEO',
    subtitle: 'A reconciliation checklist for profiles, stale PDFs, sameAs links, and public reference pages.',
    seoDescription:
      'Practical research note by Sulayman Bowles on identity cleanup, sameAs discipline, profile-page schema, stale resume PDFs, internal links, and external bio consistency.',
    image: '/og-default.png',
    date: '2026.06.19',
    dateModified: '2026.07.12',
    readTime: '07 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'A smaller set of current, connected records is more useful than publishing more disconnected versions of the same person.',
    evidenceBoundary:
      'External profiles can drift or block unauthenticated access. Only current, visibly matching profiles should be treated as identity evidence.',
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
      'The HTML resume should be the durable source of truth because it can carry visible text, internal links, schema, and a current update path. A downloadable PDF can still be useful, but it should not become the canonical identity page unless there is a reason for that tradeoff.',
      'Structured data should be conservative. Schema.org defines sameAs as a URL that unambiguously identifies the same item, not a bucket for every social link ever created. A dead, private, or weakly matching profile should stay out of sameAs even if it once existed.',
      'ProfilePage markup works best when the visible page is clearly about one person or one organization. Google guidance describes mainEntity as the person or organization the profile page is about. That makes /about, /resume, and /ai-information useful profile surfaces if they share the same Person identifier, current description, and source links.',
      'The reconciliation process is practical: pick the canonical domain, redirect duplicate hosts, redirect stale PDFs, keep /about and /resume aligned, publish a compact source-role page, and push the same current identity to external bios. The output is not a bigger personal brand. It is a smaller, cleaner set of records that makes the current public identity easier to verify.',
    ],
  },
];

export function getResearchArticleBySlug(slug: string) {
  return RESEARCH_ARTICLES.find((article) => article.slug === slug);
}
