import type { ArticleCodeExample, ArticleSource, ArticleTable } from './articleModels';

export type ProgrammaticPageFamily = 'issue' | 'platform' | 'checklist';
export type ProgrammaticIndexabilityState = 'indexable' | 'noindex' | 'draft' | 'failed-quality';

export type ProgrammaticEvidenceArtifact = {
  label: string;
  kind: 'atlas-compatible-fixture';
  description: string;
  fields: string[];
};

export type ProgrammaticSeoSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: ArticleTable;
  codeExamples?: ArticleCodeExample[];
};

export type ProgrammaticSeoPage = {
  kind: 'programmatic-seo';
  family: ProgrammaticPageFamily;
  path: string;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  primaryQuery: string;
  supportingQueries: string[];
  directAnswer: string;
  evidenceArtifact: ProgrammaticEvidenceArtifact;
  diagnosticProcedure: string[];
  falsePositiveBoundary: string;
  repairSteps: string[];
  rerunAcceptanceCheck: string[];
  sources: ArticleSource[];
  foundationalPath: string;
  relatedPaths: string[];
  cta: { label: string; href: '/contact' };
  datePublished: string;
  dateModified: string;
  indexabilityState: ProgrammaticIndexabilityState;
  indexable: boolean;
  sections: ProgrammaticSeoSection[];
};

export type ProgrammaticSeoHub = {
  family: ProgrammaticPageFamily | 'all';
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  directAnswer: string;
  datePublished: string;
  dateModified: string;
  indexabilityState: ProgrammaticIndexabilityState;
  indexable: boolean;
};

type PageSeed = {
  family: ProgrammaticPageFamily;
  slug: string;
  title: string;
  primaryQuery: string;
  supportingQueries: [string, string, string];
  signal: string;
  mechanism: string;
  consequence: string;
  falsePositive: string;
  repair: string;
  acceptance: string;
  sources: [keyof typeof SOURCE_LIBRARY, keyof typeof SOURCE_LIBRARY];
  foundationalPath: string;
};

const PUBLISHED = '2026-07-20';
const BASE = '/research/technical-seo';

const SOURCE_LIBRARY = {
  canonical: { label: 'Google Search Central: canonical URLs', href: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
  redirects: { label: 'Google Search Central: redirects', href: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
  robots: { label: 'Google Search Central: robots.txt', href: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
  noindex: { label: 'Google Search Central: robots meta tags', href: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag' },
  sitemaps: { label: 'Google Search Central: sitemap guidance', href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
  soft404: { label: 'Google Search Central: troubleshoot crawling errors', href: 'https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors' },
  links: { label: 'Google Search Central: crawlable links', href: 'https://developers.google.com/search/docs/crawling-indexing/links-crawlable' },
  javascript: { label: 'Google Search Central: JavaScript SEO basics', href: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics' },
  structured: { label: 'Google Search Central: structured data policies', href: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' },
  titles: { label: 'Google Search Central: title links', href: 'https://developers.google.com/search/docs/appearance/title-link' },
  snippets: { label: 'Google Search Central: snippets', href: 'https://developers.google.com/search/docs/appearance/snippet' },
  faceted: { label: 'Google Search Central: faceted navigation URLs', href: 'https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation' },
  ecommerce: { label: 'Google Search Central: ecommerce URL design', href: 'https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites' },
  pagination: { label: 'Google Search Central: pagination and incremental loading', href: 'https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading' },
  hreflang: { label: 'Google Search Central: localized versions', href: 'https://developers.google.com/search/docs/specialty/international/localized-versions' },
  mobile: { label: 'Google Search Central: mobile-first indexing', href: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing' },
  lazy: { label: 'Google Search Central: lazy-loaded content', href: 'https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading' },
  next: { label: 'Next.js: metadata and OG images', href: 'https://nextjs.org/docs/app/getting-started/metadata-and-og-images' },
  vite: { label: 'Vite: server-side rendering', href: 'https://vite.dev/guide/ssr' },
  wordpress: { label: 'WordPress: canonical API', href: 'https://developer.wordpress.org/reference/functions/rel_canonical/' },
  shopify: { label: 'Shopify Help: SEO overview', href: 'https://help.shopify.com/en/manual/promoting-marketing/seo/seo-overview' },
  webflow: { label: 'Webflow Help: SEO title and description', href: 'https://help.webflow.com/hc/en-us/articles/33961237278611-Add-SEO-title-and-meta-description' },
  squarespace: { label: 'Squarespace Help: SEO checklist', href: 'https://support.squarespace.com/hc/en-us/articles/360002090267-SEO-checklist' },
  wix: { label: 'Wix: technical SEO introduction', href: 'https://www.wix.com/seo/learn/resource/technical-seo-101' },
  headless: { label: 'web.dev: rendering on the web', href: 'https://web.dev/articles/rendering-on-the-web' },
  local: { label: 'Google Search Central: local business structured data', href: 'https://developers.google.com/search/docs/appearance/structured-data/local-business' },
} as const satisfies Record<string, ArticleSource>;

const FAMILIES: Record<ProgrammaticPageFamily, { segment: string; hub: string; label: string }> = {
  issue: { segment: 'issues', hub: `${BASE}/issues`, label: 'technical SEO issue' },
  platform: { segment: 'platforms', hub: `${BASE}/platforms`, label: 'technical SEO platform' },
  checklist: { segment: 'checklists', hub: `${BASE}/checklists`, label: 'technical SEO audit checklist' },
};

const issue = (seed: Omit<PageSeed, 'family'>): PageSeed => ({ family: 'issue', ...seed });
const platform = (seed: Omit<PageSeed, 'family'>): PageSeed => ({ family: 'platform', ...seed });
const checklist = (seed: Omit<PageSeed, 'family'>): PageSeed => ({ family: 'checklist', ...seed });

const SEEDS: PageSeed[] = [
  issue({ slug: 'missing-canonical', title: 'Missing Canonical Tag: Diagnosis and Repair', primaryQuery: 'missing canonical tag', supportingQueries: ['page has no canonical tag', 'how to fix missing canonical', 'canonical tag audit'], signal: 'an indexable HTML document returns no usable rel=canonical declaration in its raw or rendered head', mechanism: 'duplicate candidates remain without an explicit preferred-URL hint, so consolidation depends on weaker signals', consequence: 'Google may select a different canonical, split signals, or repeatedly crawl avoidable variants', falsePositive: 'A self-referencing canonical is recommended, but an absent tag is not automatically an error when every other signal is singular and stable.', repair: 'emit one absolute, indexable, final-destination canonical from the server-rendered head', acceptance: 'raw and rendered HTML expose the same single canonical and the declared URL returns 200 without noindex', sources: ['canonical', 'javascript'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'multiple-canonical-tags', title: 'Multiple Canonical Tags: Diagnosis and Repair', primaryQuery: 'multiple canonical tags', supportingQueries: ['two canonical tags SEO', 'conflicting canonicals', 'duplicate rel canonical'], signal: 'one document publishes two or more rel=canonical values through HTML, HTTP headers, or rendering', mechanism: 'conflicting declarations make the preferred URL ambiguous and can cause the hints to be ignored', consequence: 'consolidation becomes unpredictable across templates and crawls', falsePositive: 'Duplicate declarations that resolve to the identical normalized URL are still implementation debt, but they are less severe than conflicting targets.', repair: 'assign one canonical owner and remove template, plugin, header, or client-side duplicates', acceptance: 'every delivery layer resolves to one normalized canonical target on two consecutive crawls', sources: ['canonical', 'javascript'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'canonical-to-redirect', title: 'Canonical to Redirect: Diagnosis and Repair', primaryQuery: 'canonical points to redirect', supportingQueries: ['canonical URL redirects', 'canonical to 301', 'redirected canonical fix'], signal: 'the declared canonical target responds with a redirect instead of a final 200 document', mechanism: 'the canonical hint and redirect destination disagree about the preferred terminal URL', consequence: 'bots spend requests traversing the hop and may select another canonical', falsePositive: 'A temporary migration can briefly contain old canonicals, but the state should have an explicit deadline and monitored decline.', repair: 'update the canonical directly to the final indexable destination and align internal links', acceptance: 'the canonical target returns 200 in one request and all sampled links use that same destination', sources: ['canonical', 'redirects'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'canonical-noindex-conflict', title: 'Canonical and Noindex Conflict: Diagnosis and Repair', primaryQuery: 'canonical noindex conflict', supportingQueries: ['canonical page has noindex', 'noindex canonical URL', 'canonical robots conflict'], signal: 'a URL declares a canonical relationship while a noindex directive tells search engines to exclude the document', mechanism: 'the page combines consolidation and exclusion instructions that express different intended outcomes', consequence: 'the source can disappear while signals fail to consolidate as expected', falsePositive: 'During a tightly controlled decommission, noindex may be intentional; a redirect is usually clearer when an equivalent replacement exists.', repair: 'choose index-and-consolidate or exclude, then remove the directive that contradicts that decision', acceptance: 'the final response has one coherent canonical/indexability state confirmed in headers and rendered HTML', sources: ['canonical', 'noindex'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'redirect-chain', title: 'Redirect Chain: Diagnosis and Repair', primaryQuery: 'redirect chain SEO', supportingQueries: ['multiple redirect hops', 'fix redirect chain', '301 chain audit'], signal: 'a requested URL passes through two or more redirect responses before reaching content', mechanism: 'legacy migrations or competing rules compose into an unnecessary sequence', consequence: 'crawlers and users pay latency while link destinations become harder to govern', falsePositive: 'A single protocol or hostname normalization hop can be acceptable, though direct linking remains preferable.', repair: 'collapse each known source to the final destination and replace internal references to intermediate URLs', acceptance: 'every tested source reaches the intended 200 URL in one redirect or fewer', sources: ['redirects', 'links'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'redirect-loop', title: 'Redirect Loop: Diagnosis and Repair', primaryQuery: 'redirect loop SEO', supportingQueries: ['too many redirects SEO', 'redirect cycle fix', 'crawler redirect loop'], signal: 'redirect rules revisit a prior URL or alternate indefinitely between normalized variants', mechanism: 'host, path, locale, slash, or application rules apply in incompatible order', consequence: 'the resource is unreachable and its crawl signals cannot terminate at content', falsePositive: 'Cookie or geolocation behavior may look cyclic to one client; reproduce with a clean, stateless request before changing rules.', repair: 'identify the smallest cycle, establish one normalization order, and remove the reciprocal rule', acceptance: 'clean clients across HTTP and HTTPS reach one final 200 response with no repeated location', sources: ['redirects', 'links'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'soft-404', title: 'Soft 404: Diagnosis and Repair', primaryQuery: 'soft 404 SEO', supportingQueries: ['soft 404 error fix', 'Google soft 404', '200 page not found'], signal: 'a thin, empty, or error-like page returns 200 instead of an honest unavailable or useful response', mechanism: 'the application shell masks missing content while the transport layer reports success', consequence: 'search engines waste crawl effort and may exclude the URL as low value', falsePositive: 'A sparse utility page is not a soft 404 when it fulfills a clear intent and supplies substantive unique information.', repair: 'return 404 or 410 for missing resources, or rebuild the page with complete intent-matching content', acceptance: 'removed URLs return the intended error status and retained URLs pass a rendered-content usefulness review', sources: ['soft404', 'javascript'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'robots-blocked-indexable-url', title: 'Robots-Blocked Indexable URL: Diagnosis and Repair', primaryQuery: 'robots blocked indexed page', supportingQueries: ['indexed though blocked by robots', 'robots.txt indexable URL', 'blocked page in Google'], signal: 'robots.txt prevents fetching a URL that remains discoverable and potentially indexable from external signals', mechanism: 'crawl control is being used as if it were an index-removal directive', consequence: 'search engines cannot see canonical or noindex changes and may retain a URL-only result', falsePositive: 'Blocking non-public crawl traps can be correct when those URLs are not linked, indexed, or expected to carry removal directives.', repair: 'allow crawling long enough to process noindex or return an appropriate status, then control future discovery', acceptance: 'the crawler can observe the intended exclusion response and the URL leaves index coverage without new variants', sources: ['robots', 'noindex'], foundationalPath: '/research/ai-crawlers/robots-txt-courtesy-not-access-control' }),
  issue({ slug: 'noindex-in-sitemap', title: 'Noindex URL in Sitemap: Diagnosis and Repair', primaryQuery: 'noindex URL in sitemap', supportingQueries: ['sitemap contains noindex pages', 'XML sitemap indexability errors', 'remove noindex from sitemap'], signal: 'an XML sitemap lists a URL whose final response or rendered document declares noindex', mechanism: 'the discovery feed recommends crawling a page that the page itself rejects from indexing', consequence: 'coverage reporting becomes noisy and crawl attention is sent to excluded inventory', falsePositive: 'A very brief deployment transition can produce overlap, but recurring sitemap generations should never preserve it.', repair: 'derive sitemap membership from the same final indexability contract that emits page directives', acceptance: 'a regenerated sitemap contains only canonical 200 URLs and a recrawl finds no noindex members', sources: ['sitemaps', 'noindex'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'sitemap-redirects', title: 'Redirecting URLs in Sitemap: Diagnosis and Repair', primaryQuery: 'redirect URLs in sitemap', supportingQueries: ['sitemap contains redirects', '301 URL XML sitemap', 'sitemap redirect errors'], signal: 'an XML sitemap includes one or more URLs that return redirects', mechanism: 'the sitemap source lags behind routing, migration, or canonical changes', consequence: 'search engines receive stale discovery hints and must spend requests resolving them', falsePositive: 'Short-lived overlap during a cutover is tolerable only when the regenerated feed promptly converges on final URLs.', repair: 'replace every redirected entry with its canonical final destination and update the feed generator', acceptance: 'all sitemap members return 200 directly and match their own canonical declarations', sources: ['sitemaps', 'redirects'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'orphan-page', title: 'Orphan Page: Diagnosis and Repair', primaryQuery: 'orphan page SEO', supportingQueries: ['find orphan pages', 'page with no internal links', 'orphan URL audit'], signal: 'an indexable canonical page receives no crawlable internal link from another indexable page', mechanism: 'publishing, migration, or filtering creates inventory outside the governed navigation graph', consequence: 'discovery slows and the page receives no contextual internal authority', falsePositive: 'Private campaign or account pages may be intentionally unlinked, but those should not remain indexable search landing pages.', repair: 'add descriptive links from relevant hubs and peer content, or exclude the page if no durable user path exists', acceptance: 'the page has at least three contextual inbound links and remains within two clicks of the homepage', sources: ['links', 'sitemaps'], foundationalPath: '/research/technical-seo/internal-links-directed-retrieval-graph' }),
  issue({ slug: 'excessive-crawl-depth', title: 'Excessive Crawl Depth: Diagnosis and Repair', primaryQuery: 'crawl depth SEO', supportingQueries: ['pages too many clicks deep', 'reduce crawl depth', 'internal link depth audit'], signal: 'important indexable pages require several navigation hops from an authoritative entry point', mechanism: 'taxonomy and pagination expose business-priority content only through long paths', consequence: 'users struggle to discover pages and crawlers receive weak importance signals', falsePositive: 'Low-priority archival material can sit deeper when hubs, sitemaps, and demand do not justify promotion.', repair: 'introduce intent-based hubs, breadcrumbs, and contextual shortcuts for pages that deserve search visibility', acceptance: 'priority pages are reachable within two clicks and maintain descriptive inbound paths', sources: ['links', 'sitemaps'], foundationalPath: '/research/technical-seo/internal-links-directed-retrieval-graph' }),
  issue({ slug: 'broken-internal-link', title: 'Broken Internal Link: Diagnosis and Repair', primaryQuery: 'broken internal links SEO', supportingQueries: ['fix internal 404 links', 'broken link audit', 'internal link redirects'], signal: 'a crawlable internal anchor resolves to a 4xx, 5xx, loop, or unintended destination', mechanism: 'content references outlive moved, renamed, or removed routes', consequence: 'users hit dead ends while crawlers spend attention on invalid nodes', falsePositive: 'Links in historical code examples can intentionally demonstrate invalid paths when they are visibly labeled and not interactive.', repair: 'point the source directly to the best live equivalent or remove the link when no replacement exists', acceptance: 'the full internal graph returns expected final statuses with no broken interactive anchors', sources: ['links', 'redirects'], foundationalPath: '/research/technical-seo/internal-links-directed-retrieval-graph' }),
  issue({ slug: 'javascript-only-link', title: 'JavaScript-Only Link: Diagnosis and Repair', primaryQuery: 'JavaScript only links SEO', supportingQueries: ['onclick link not crawlable', 'SPA crawlable links', 'anchor href SEO'], signal: 'navigation depends on event handlers, buttons, or router state without a resolvable anchor href', mechanism: 'the interface exposes an action but omits the web-native URL relationship', consequence: 'crawlers and assistive technology may not discover the destination reliably', falsePositive: 'A button is correct for a non-navigation action such as opening a dialog or submitting a form.', repair: 'render semantic anchors with stable href values and enhance them with client routing only after navigation works', acceptance: 'raw HTML contains crawlable anchors and keyboard, no-script, and rendered tests reach the same URLs', sources: ['links', 'javascript'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'raw-rendered-content-mismatch', title: 'Raw and Rendered HTML Mismatch: Diagnosis and Repair', primaryQuery: 'raw rendered HTML mismatch SEO', supportingQueries: ['rendered HTML SEO audit', 'JavaScript content mismatch', 'view source versus DOM'], signal: 'critical headings, copy, links, directives, or schema differ materially between the response HTML and rendered DOM', mechanism: 'hydration, asynchronous data, personalization, or client mutations change the search-visible document', consequence: 'validation on only one representation produces false confidence about discoverability', falsePositive: 'Benign interactive state and decorative attributes can differ without changing meaning, links, or indexability.', repair: 'server-render critical intent and reconcile deterministic client output against the same content source', acceptance: 'raw and rendered comparisons agree on primary copy, links, metadata, canonical, robots, and schema', sources: ['javascript', 'links'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'structured-data-content-drift', title: 'Structured Data Content Drift: Diagnosis and Repair', primaryQuery: 'structured data content mismatch', supportingQueries: ['schema markup content mismatch', 'JSON-LD drift', 'structured data audit'], signal: 'JSON-LD claims names, offers, dates, ratings, or entities that the visible page no longer supports', mechanism: 'schema and content are generated from separate sources or refresh schedules', consequence: 'rich-result eligibility and evidence integrity deteriorate', falsePositive: 'Structured data can provide machine-readable identifiers not printed verbatim when the visible entity and claim remain unambiguous.', repair: 'generate visible content and JSON-LD from one typed record and remove unsupported properties', acceptance: 'schema validation passes and every material property maps to current visible evidence', sources: ['structured', 'javascript'], foundationalPath: '/research/technical-seo/structured-data-without-content-drift' }),
  issue({ slug: 'duplicate-title-tag', title: 'Duplicate Title Tag: Diagnosis and Repair', primaryQuery: 'duplicate title tags SEO', supportingQueries: ['same SEO title multiple pages', 'duplicate title audit', 'unique title tags'], signal: 'multiple indexable canonical pages publish the same or functionally indistinguishable title', mechanism: 'templates omit the differentiating entity, intent, location, or state', consequence: 'searchers and engines receive weak cues about which result satisfies which query', falsePositive: 'Paginated or translated pages can share a stem when each title still exposes its distinct state and audience.', repair: 'write concise titles around each page’s unique intent and bind generation to validated route data', acceptance: 'every indexable canonical has a unique title that matches its H1 and primary query without boilerplate collision', sources: ['titles', 'canonical'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'duplicate-meta-description', title: 'Duplicate Meta Description: Diagnosis and Repair', primaryQuery: 'duplicate meta descriptions SEO', supportingQueries: ['same meta description pages', 'unique description tags', 'meta description audit'], signal: 'several indexable pages reuse the same search-result summary despite serving different intents', mechanism: 'a global fallback replaces page-specific outcome, scope, and evidence language', consequence: 'snippets become less differentiated and click-through diagnosis loses a controlled input', falsePositive: 'Google may rewrite even unique descriptions; duplication is a publishing-quality issue, not a ranking penalty by itself.', repair: 'generate a specific benefit-and-boundary description for every canonical route', acceptance: 'descriptions are unique, within a practical snippet length, and accurately preview each page', sources: ['snippets', 'titles'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'faceted-navigation-crawl-trap', title: 'Faceted Navigation Crawl Trap: Diagnosis and Repair', primaryQuery: 'faceted navigation crawl trap', supportingQueries: ['filter URL SEO', 'faceted navigation indexing', 'crawl budget filters'], signal: 'filter combinations create a near-unbounded set of low-value, duplicate, or empty URLs', mechanism: 'every facet state becomes crawlable without an inventory or demand policy', consequence: 'crawler attention fragments across permutations instead of durable category pages', falsePositive: 'A curated facet can deserve indexation when it has demand, stable inventory, unique content, and intentional internal links.', repair: 'allowlist valuable combinations, constrain link generation, and canonicalize or exclude the remaining states coherently', acceptance: 'crawl growth is bounded while approved facet pages remain unique, linked, indexable, and stocked', sources: ['faceted', 'ecommerce'], foundationalPath: '/research/crawler-engineering/crawl-frontier-state-machine' }),
  issue({ slug: 'parameter-url-duplication', title: 'Parameter URL Duplication: Diagnosis and Repair', primaryQuery: 'URL parameter duplicate content SEO', supportingQueries: ['query parameter indexing', 'duplicate parameter URLs', 'tracking parameters canonical'], signal: 'query strings expose duplicate content under sortable, trackable, session, or presentation variants', mechanism: 'parameter semantics are not classified before URLs enter links, sitemaps, canonicals, and analytics', consequence: 'duplicate discovery expands and measurement splits across equivalent locations', falsePositive: 'A parameter represents a separate page when it materially changes intent and produces durable, useful content.', repair: 'classify parameters, strip tracking from links, and consolidate equivalent variants onto one canonical URL', acceptance: 'equivalent parameters disappear from internal discovery and resolve to the chosen canonical behavior', sources: ['canonical', 'ecommerce'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'pagination-infinite-scroll-indexing', title: 'Pagination and Infinite Scroll Indexing: Diagnosis and Repair', primaryQuery: 'infinite scroll SEO pagination', supportingQueries: ['pagination indexing SEO', 'infinite scroll crawlable', 'load more SEO'], signal: 'items beyond the initial viewport require interaction and lack stable crawlable component URLs', mechanism: 'the interface models a sequence as transient client state instead of addressable pages', consequence: 'deeper products or articles may remain undiscovered and unlinked', falsePositive: 'Infinite scroll is compatible with search when each segment has a stable URL and crawlable sequential links.', repair: 'provide unique paginated URLs, server-visible content, and ordered anchors while retaining progressive enhancement', acceptance: 'a clean crawl reaches every intended item without scrolling, clicking, or executing custom gestures', sources: ['pagination', 'links'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'hreflang-return-tag-error', title: 'Hreflang Return Tag Error: Diagnosis and Repair', primaryQuery: 'hreflang return tag error', supportingQueries: ['missing reciprocal hreflang', 'hreflang no return tag', 'international SEO hreflang audit'], signal: 'one localized URL references an alternate that does not reciprocally reference the source', mechanism: 'locale sets are generated independently or omit a region from the shared cluster', consequence: 'search engines can ignore incomplete alternate relationships and serve the wrong locale', falsePositive: 'A page excluded from the locale set should not return a tag, but all included members need coherent reciprocal membership.', repair: 'generate complete hreflang clusters from one locale matrix and include a valid self-reference', acceptance: 'every indexable member returns the identical reciprocal set with valid final canonical URLs', sources: ['hreflang', 'canonical'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  issue({ slug: 'mobile-desktop-content-mismatch', title: 'Mobile and Desktop Content Mismatch: Diagnosis and Repair', primaryQuery: 'mobile desktop content mismatch SEO', supportingQueries: ['mobile first indexing missing content', 'responsive content parity', 'mobile SEO audit'], signal: 'mobile rendering omits primary text, links, images, metadata, or structured data present on desktop', mechanism: 'responsive components, user-agent branching, or deferred resources deliver unequal evidence', consequence: 'mobile-first indexing evaluates an incomplete version of the page', falsePositive: 'Layout, navigation density, and presentation may differ when both modes preserve equivalent meaning and access.', repair: 'serve content and metadata parity through responsive rendering and test the mobile user-agent independently', acceptance: 'mobile and desktop audits match on primary content, links, directives, image context, and schema claims', sources: ['mobile', 'structured'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  issue({ slug: 'lazy-loaded-primary-content', title: 'Lazy-Loaded Primary Content: Diagnosis and Repair', primaryQuery: 'lazy loaded content SEO', supportingQueries: ['lazy loading text SEO', 'Googlebot lazy content', 'intersection observer SEO'], signal: 'primary copy or links appear only after scrolling, intersection events, or user interaction', mechanism: 'performance optimization defers the very evidence needed to understand the page', consequence: 'rendering tests can miss content and crawlers may receive an incomplete document', falsePositive: 'Below-the-fold images and secondary modules can load lazily when useful placeholders and accessible fallbacks remain.', repair: 'server-render primary content and reserve lazy loading for nonessential assets with deterministic fallbacks', acceptance: 'initial raw and rendered output contains the complete main intent before any viewport event', sources: ['lazy', 'javascript'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),

  platform({ slug: 'nextjs', title: 'Next.js Technical SEO Guide', primaryQuery: 'Next.js technical SEO', supportingQueries: ['Next.js SEO checklist', 'Next.js metadata canonical', 'Next.js rendering SEO'], signal: 'a Next.js site distributes metadata, rendering, caching, redirects, and sitemap behavior across route conventions', mechanism: 'App Router and Pages Router features can drift when route-level ownership is not explicit', consequence: 'otherwise strong pages ship mismatched head data, client-only content, or stale discovery files', falsePositive: 'Client Components are not inherently harmful when critical content and links arrive in indexable HTML.', repair: 'centralize typed metadata, choose rendering per intent, and validate built HTML for every canonical route', acceptance: 'production output exposes unique server-visible content, metadata, schema, status, and discovery signals per route', sources: ['next', 'javascript'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  platform({ slug: 'react-vite', title: 'React and Vite Technical SEO Guide', primaryQuery: 'React Vite SEO', supportingQueries: ['Vite SPA SEO', 'React static rendering SEO', 'Vite sitemap metadata'], signal: 'a React/Vite application initially delivers a shared shell while route evidence appears only after JavaScript', mechanism: 'a client-first build lacks route-aware prerendering, head ownership, and response-status semantics', consequence: 'crawlers and link unfurlers receive incomplete or duplicated documents', falsePositive: 'A client-rendered application can be discoverable, but relying on rendering adds avoidable latency and evidence uncertainty.', repair: 'prerender public routes from the canonical registry and hydrate without changing their semantic output', acceptance: 'each built route has complete static HTML, unique head tags, schema, crawlable links, and correct fallback status', sources: ['vite', 'javascript'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  platform({ slug: 'wordpress', title: 'WordPress Technical SEO Guide', primaryQuery: 'WordPress technical SEO', supportingQueries: ['WordPress SEO audit', 'WordPress canonical issues', 'WordPress crawl optimization'], signal: 'WordPress exposes posts, pages, taxonomies, feeds, archives, media, and plugin output as overlapping crawl surfaces', mechanism: 'themes, plugins, and core conventions can each emit independent metadata and URL variants', consequence: 'indexation expands beyond useful inventory while canonical and schema ownership conflicts', falsePositive: 'Archives are valuable when they serve a distinct browsing intent with unique copy and maintained membership.', repair: 'assign one owner for canonicals, schema, redirects, sitemaps, and archive indexability before pruning variants', acceptance: 'a clean crawl maps one intended canonical per document and no plugin duplicates the governed head output', sources: ['wordpress', 'canonical'], foundationalPath: '/research/technical-seo/canonicalization-graph-consistency' }),
  platform({ slug: 'shopify', title: 'Shopify Technical SEO Guide', primaryQuery: 'Shopify technical SEO', supportingQueries: ['Shopify SEO audit', 'Shopify duplicate URLs', 'Shopify collection SEO'], signal: 'Shopify storefronts expose products through collections, filters, pagination, locale paths, and theme-generated metadata', mechanism: 'platform URL conventions and theme links can create multiple discovery paths to equivalent inventory', consequence: 'crawl attention and internal signals spread across parameters, collection variants, and thin states', falsePositive: 'Collection-specific product paths can support browsing, but canonical and linking behavior must still communicate one index target.', repair: 'govern theme links, collection architecture, canonical output, structured data, redirects, and unavailable-product states together', acceptance: 'sample products and collections resolve to unique final canonicals with bounded filters and valid visible schema', sources: ['shopify', 'ecommerce'], foundationalPath: '/research/technical-seo/internal-links-directed-retrieval-graph' }),
  platform({ slug: 'webflow', title: 'Webflow Technical SEO Guide', primaryQuery: 'Webflow technical SEO', supportingQueries: ['Webflow SEO audit', 'Webflow canonical tag', 'Webflow CMS SEO'], signal: 'Webflow page settings, CMS templates, custom code, redirects, and published domains jointly determine search output', mechanism: 'manual fields and reusable templates can leave blank, duplicated, or environment-specific head values', consequence: 'CMS inventory scales faster than its quality and indexability controls', falsePositive: 'A Webflow-generated sitemap is useful by default; custom handling is only justified by a demonstrated inventory rule.', repair: 'require CMS SEO fields, govern custom code centrally, and validate the published domain after each structural release', acceptance: 'all public templates publish unique metadata, correct canonicals, useful content, and direct internal paths', sources: ['webflow', 'canonical'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  platform({ slug: 'squarespace', title: 'Squarespace Technical SEO Guide', primaryQuery: 'Squarespace technical SEO', supportingQueries: ['Squarespace SEO audit', 'Squarespace indexing issues', 'Squarespace sitemap SEO'], signal: 'Squarespace combines global settings, page fields, collection types, domain configuration, and injected code', mechanism: 'sitewide defaults can conceal missing page-specific intent or collide with custom metadata additions', consequence: 'titles, descriptions, canonicals, and content structure become inconsistent across collections', falsePositive: 'Platform-managed canonicals and sitemaps should remain in place unless current output proves a concrete defect.', repair: 'prioritize information architecture and page-specific fields, then remove custom code that duplicates platform output', acceptance: 'published pages have unique intent, one canonical, one title, stable status, and crawlable contextual links', sources: ['squarespace', 'canonical'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  platform({ slug: 'wix', title: 'Wix Technical SEO Guide', primaryQuery: 'Wix technical SEO', supportingQueries: ['Wix SEO audit', 'Wix crawl issues', 'Wix structured data SEO'], signal: 'Wix SEO patterns, page settings, dynamic routes, redirects, and structured-data overrides form the indexable surface', mechanism: 'bulk patterns can propagate a weak field or unsupported markup across many dynamic pages', consequence: 'scaled inventory inherits duplicate snippets, thin pages, or schema-content mismatch', falsePositive: 'Default Wix rendering is not an SEO defect; changes need page-level evidence rather than platform folklore.', repair: 'configure patterns from reliable CMS fields, restrict indexability to useful routes, and review custom schema against visible content', acceptance: 'dynamic samples pass raw/rendered, metadata, canonical, schema, link, and status checks without pattern collisions', sources: ['wix', 'structured'], foundationalPath: '/research/technical-seo/structured-data-without-content-drift' }),
  platform({ slug: 'headless-cms', title: 'Headless CMS Technical SEO Guide', primaryQuery: 'headless CMS SEO', supportingQueries: ['headless website technical SEO', 'CMS frontend SEO', 'headless rendering audit'], signal: 'a headless stack separates editorial data, frontend rendering, routing, cache invalidation, and search metadata', mechanism: 'distributed ownership lets content and derived artifacts update at different times', consequence: 'stale pages, broken previews, missing fallbacks, and schema drift reach production', falsePositive: 'Architectural separation is not a disadvantage when publishing contracts and cache invalidation are observable and tested.', repair: 'define a typed publishing contract that atomically drives HTML, head data, schema, redirects, sitemaps, and previews', acceptance: 'content changes propagate to every derived surface within the declared freshness window and route tests stay deterministic', sources: ['headless', 'javascript'], foundationalPath: '/research/technical-seo/structured-data-without-content-drift' }),

  checklist({ slug: 'javascript-seo-audit', title: 'JavaScript Technical SEO Audit Checklist', primaryQuery: 'JavaScript SEO audit checklist', supportingQueries: ['JavaScript SEO audit', 'rendering SEO checklist', 'SPA technical SEO audit'], signal: 'a JavaScript application needs evidence across response HTML, rendered DOM, resources, routing, metadata, and status behavior', mechanism: 'testing only the browser-visible final state misses discovery and rendering dependencies', consequence: 'critical content can appear healthy to users while remaining fragile for crawlers', falsePositive: 'JavaScript usage alone is not an issue; the audit should flag only measured gaps in access, parity, or stability.', repair: 'audit raw and rendered states, then move critical evidence to deterministic server or build output', acceptance: 'representative routes pass no-interaction discovery, parity, metadata, schema, link, and error-state checks', sources: ['javascript', 'links'], foundationalPath: '/research/technical-seo/raw-html-rendered-dom-evidence' }),
  checklist({ slug: 'ecommerce-technical-seo-audit', title: 'Ecommerce Technical SEO Audit Checklist', primaryQuery: 'ecommerce technical SEO audit checklist', supportingQueries: ['ecommerce SEO audit', 'online store technical SEO', 'product category crawl audit'], signal: 'an ecommerce site needs coordinated checks across products, categories, facets, pagination, availability, schema, and migrations', mechanism: 'large changing catalogs create URL states faster than manual review can govern them', consequence: 'crawl traps and low-value variants compete with revenue pages for discovery and signals', falsePositive: 'A large URL count is not waste when each page serves demand, remains stocked, and has unique evidence.', repair: 'classify inventory states and automate indexability, linking, canonical, schema, and sitemap decisions from them', acceptance: 'sampled revenue templates and edge states match the approved inventory contract after a full crawl', sources: ['ecommerce', 'structured'], foundationalPath: '/research/crawler-engineering/crawl-frontier-state-machine' }),
  checklist({ slug: 'saas-technical-seo-audit', title: 'SaaS Technical SEO Audit Checklist', primaryQuery: 'SaaS technical SEO audit checklist', supportingQueries: ['SaaS SEO audit', 'B2B software technical SEO', 'SaaS website crawl audit'], signal: 'a SaaS site mixes marketing, documentation, integrations, comparisons, localization, authentication, and application routes', mechanism: 'separate teams and frameworks publish overlapping paths without one search inventory model', consequence: 'valuable solution pages become orphaned while app or duplicate documentation URLs leak into search', falsePositive: 'Subdomains and multiple frameworks are acceptable when canonicals, navigation, ownership, and measurement remain coherent.', repair: 'map intent and ownership first, then align routing, metadata, linking, sitemaps, status codes, and conversion paths', acceptance: 'every indexable route has a distinct buyer or user intent, contextual inbound links, and an accountable template owner', sources: ['links', 'canonical'], foundationalPath: '/research/technical-seo/internal-links-directed-retrieval-graph' }),
  checklist({ slug: 'local-business-technical-seo-audit', title: 'Local Business Technical SEO Audit Checklist', primaryQuery: 'local business technical SEO audit checklist', supportingQueries: ['local SEO technical audit', 'local business website SEO checklist', 'location page technical SEO'], signal: 'a local business site needs consistent location identity across pages, structured data, links, domains, and conversion details', mechanism: 'copied location templates or stale business facts create contradictory geographic signals', consequence: 'searchers encounter weak landing pages and engines cannot confidently reconcile the entity', falsePositive: 'Shared service language is reasonable when each location page adds real local proof, access details, and distinct usefulness.', repair: 'normalize business facts, consolidate duplicate locations, and connect useful local pages through service and geographic context', acceptance: 'each retained location has unique proof, consistent visible/schema facts, direct contact paths, and valid canonical status', sources: ['local', 'structured'], foundationalPath: '/research/technical-seo/structured-data-without-content-drift' }),
];

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function buildSections(seed: PageSeed): ProgrammaticSeoSection[] {
  return [
    {
      id: 'interpretation', title: 'What to establish first',
      paragraphs: [
        `${capitalize(seed.signal)}. The underlying mechanism is that ${seed.mechanism}.`,
        `${capitalize(seed.consequence)}. Record the affected URL, intended search state, and template before choosing a fix. A tool warning alone is not evidence that the page should change.`,
      ],
    },
    {
      id: 'evidence', title: 'Preserve a reproducible record',
      paragraphs: [
        `Use this fixture specification to investigate ${seed.primaryQuery}. It describes the fields to collect, not a completed client crawl or proof of a production defect. Keep missing observations empty and explain why they could not be collected.`,
      ],
      table: {
        caption: 'Minimum evidence fields', columns: ['Field', 'Capture', 'Decision use'],
        rows: [
          ['Requested and final URL', 'Absolute addresses, response status, and every redirect hop', 'Separate the starting URL from the response actually inspected'],
          ['Raw and rendered signals', 'HTML, canonical, robots, headings, links, and structured data', 'Identify differences introduced by browser execution'],
          ['Discovery and time', 'Source page, anchor, sitemap or log reference, and observation timestamp', 'Make the request repeatable and expose stale observations'],
          ['Control sample', 'A passing page from the same template and deployment', 'Test whether the problem is systemic or isolated'],
        ],
      },
    },
    {
      id: 'diagnosis', title: 'Reproduce the observed behavior',
      paragraphs: [
        `Start with the page exhibiting ${seed.primaryQuery}, not a homepage proxy. Capture its first HTTP response before following redirects. Inspect the terminal document separately; saving a redirect body does not capture the destination page.`,
        'Compare the saved server response with a browser-rendered capture at desktop and mobile widths. Record device, user agent, consent state, and deployment version. Retest a representative control under the same conditions before estimating how many pages are affected.',
      ],
      bullets: [
        `Check the specific signal: ${seed.signal}.`,
        'Trace the URL through contextual links, navigation, sitemaps, and canonical declarations.',
        'Group the affected pages by template and intended indexability, not just URL count.',
        'Retain the request and control records so another person can reproduce the finding.',
      ],
      codeExamples: [{
        title: 'Save the first response', language: 'shell',
        description: 'Replace the example URL. This command deliberately does not follow redirects or execute JavaScript.',
        code: `curl --silent --show-error --max-time 30 \\\n  --header 'Cache-Control: no-cache' \\\n  --dump-header ${seed.slug}.headers.txt \\\n  --output ${seed.slug}.html \\\n  'https://example.com/page-to-check'\nrg -n 'canonical|noindex|href=|application/ld\\+json' ${seed.slug}.html`,
      }],
    },
    {
      id: 'false-positive-boundary', title: 'When the warning is not a defect',
      paragraphs: [
        seed.falsePositive,
        'Check the intended outcome before changing production. Preview pages, private routes, intentional exclusions, and retired URLs do not share the same acceptance criteria as public landing pages. A difference caused by a deployment in progress requires another capture, not an immediate template rewrite.',
      ],
    },
    {
      id: 'remediation', title: 'Change the system that owns the problem',
      paragraphs: [
        `The repair is to ${seed.repair}. Identify whether the authoritative value lives in routing, a CMS field, the page template, a server rule, or a discovery generator.`,
        'Make the narrowest change that corrects the observed behavior, then regenerate dependent output. Changing only a crawler exclusion or a dashboard label can hide a symptom while leaving the underlying URL and user experience unchanged.',
      ],
      bullets: [
        'Save a before-and-after sample and define a rollback condition.',
        'Update links, metadata, structured data, and sitemap membership where the repair changes their intended values.',
        'Check a passing peer for regressions; preserve intentional exclusions.',
        'Keep the original failing example as a regression fixture.',
      ],
    },
    {
      id: 'rerun-gate', title: 'Acceptance check',
      paragraphs: [
        `Accept the repair when ${seed.acceptance}. Repeat the failing request and its control without relying on an earlier cached capture.`,
        'Confirm that the intended indexability is preserved. An intentionally excluded URL should remain excluded; a public canonical page should resolve correctly and retain its expected discovery links. Passing this check establishes a technical state, not a promise of crawling, indexing, or rankings.',
      ],
    },
  ];
}

function pagePath(seed: PageSeed) {
  return `${BASE}/${FAMILIES[seed.family].segment}/${seed.slug}`;
}

/** Prefer shared mechanisms and primary documentation, not neighbors in an arbitrary array. */
function relatedSeeds(seed: PageSeed) {
  const score = (candidate: PageSeed) =>
    (candidate.foundationalPath === seed.foundationalPath ? 4 : 0)
    + candidate.sources.filter((source) => seed.sources.includes(source)).length * 2
    + (candidate.family === seed.family ? 1 : 0);
  return SEEDS.filter((candidate) => candidate.slug !== seed.slug)
    .sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug))
    .slice(0, 3);
}

function buildPage(seed: PageSeed): ProgrammaticSeoPage {
  const brandedSeoTitle = `${seed.title} | Sulayman Bowles`;
  return {
    kind: 'programmatic-seo', family: seed.family, path: pagePath(seed), slug: seed.slug,
    title: seed.title, seoTitle: brandedSeoTitle.length <= 70 ? brandedSeoTitle : seed.title,
    description: `Diagnose ${seed.primaryQuery} with a reproducible evidence record, false-positive checks, repair steps, and an acceptance test.`,
    primaryQuery: seed.primaryQuery, supportingQueries: seed.supportingQueries,
    directAnswer: `${capitalize(seed.signal)}. To address ${seed.primaryQuery}, ${seed.repair}. The acceptance condition is that ${seed.acceptance}.`,
    evidenceArtifact: {
      label: `${seed.title} evidence fixture`, kind: 'atlas-compatible-fixture',
      description: `Illustrative capture specification for ${seed.primaryQuery}; not a live-client result.`,
      fields: ['requested_url', 'final_url', 'status_chain', 'raw_html_sha256', 'rendered_html_sha256', 'canonical_url', 'robots_state', 'discovery_source', 'observed_at'],
    },
    diagnosticProcedure: [
      `Check whether ${seed.signal}.`,
      'Capture the first response and each redirect hop; compare server and rendered output.',
      'Inspect sitemap, canonical, and internal-link discovery for the affected URL.',
      'Compare a passing template peer and record intended indexability before assigning impact.',
    ],
    falsePositiveBoundary: seed.falsePositive,
    repairSteps: [
      'Identify the authoritative route, content, or infrastructure owner.',
      `${capitalize(seed.repair)}.`,
      'Regenerate affected links, metadata, structured data, and sitemaps.',
      'Preserve the failure and a passing control as regression fixtures.',
    ],
    rerunAcceptanceCheck: [
      `${capitalize(seed.acceptance)}.`,
      'Repeated uncached captures agree on the repaired behavior.',
      'The intended indexability and contextual discovery paths are preserved.',
    ],
    sources: seed.sources.map((source) => ({ ...SOURCE_LIBRARY[source], lastVerified: PUBLISHED })),
    foundationalPath: seed.foundationalPath,
    relatedPaths: [...relatedSeeds(seed).map(pagePath), seed.foundationalPath],
    cta: { label: `Discuss a ${seed.primaryQuery} audit`, href: '/contact' },
    datePublished: PUBLISHED, dateModified: '2026-09-10',
    indexabilityState: 'indexable', indexable: true, sections: buildSections(seed),
  };
}

export const PROGRAMMATIC_SEO_PAGES: readonly ProgrammaticSeoPage[] = SEEDS.map(buildPage);

export const PROGRAMMATIC_SEO_HUBS: readonly ProgrammaticSeoHub[] = [
  {
    family: 'all',
    path: BASE,
    title: 'Technical SEO Diagnostic Library',
    seoTitle: 'Technical SEO Diagnostic Library | Sulayman Bowles',
    description: 'Evidence-backed technical SEO issue guides, platform playbooks, and audit checklists with reproducible repair gates.',
    directAnswer: 'This technical SEO library turns crawl symptoms into reproducible decisions. Each guide starts with a direct answer, labels its evidence boundary, separates false positives, defines the repair owner, and ends with a rerun acceptance gate.',
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    indexabilityState: 'indexable',
    indexable: true,
  },
  {
    family: 'issue',
    path: `${BASE}/issues`,
    title: 'Technical SEO Issue Guides',
    seoTitle: 'Technical SEO Issue Guides | Sulayman Bowles',
    description: 'Diagnose 24 common technical SEO issues with evidence fields, false-positive boundaries, repairs, and rerun checks.',
    directAnswer: 'The issue library covers 24 crawl, indexation, rendering, metadata, linking, and internationalization failures. Use each guide to reproduce the signal before changing production, then rerun the exact failing case against an explicit pass condition.',
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    indexabilityState: 'indexable',
    indexable: true,
  },
  {
    family: 'platform',
    path: `${BASE}/platforms`,
    title: 'Technical SEO Platform Guides',
    seoTitle: 'Technical SEO Platform Guides | Sulayman Bowles',
    description: 'Technical SEO implementation guides for Next.js, React/Vite, WordPress, Shopify, Webflow, Squarespace, Wix, and headless CMS stacks.',
    directAnswer: 'The platform library maps technical SEO controls to the systems that actually own them. Each guide distinguishes platform defaults from measured defects and provides a production-oriented validation gate for routes, content, metadata, schema, and discovery.',
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    indexabilityState: 'indexable',
    indexable: true,
  },
  {
    family: 'checklist',
    path: `${BASE}/checklists`,
    title: 'Technical SEO Audit Checklists',
    seoTitle: 'Technical SEO Audit Checklists | Sulayman Bowles',
    description: 'Evidence-driven JavaScript, ecommerce, SaaS, and local-business technical SEO audit checklists.',
    directAnswer: 'These four audit checklists organize technical SEO review by business and delivery model. They prioritize observable states, representative templates, false-positive controls, accountable repair owners, and repeatable release gates over generic score chasing.',
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    indexabilityState: 'indexable',
    indexable: true,
  },
];

export function getProgrammaticSeoPage(path: string): ProgrammaticSeoPage | undefined {
  return PROGRAMMATIC_SEO_PAGES.find((page) => page.path === path);
}

export function getProgrammaticSeoHub(path: string): ProgrammaticSeoHub | undefined {
  return PROGRAMMATIC_SEO_HUBS.find((hub) => hub.path === path);
}

export function getProgrammaticPagesByFamily(family: ProgrammaticPageFamily): readonly ProgrammaticSeoPage[] {
  return PROGRAMMATIC_SEO_PAGES.filter((page) => page.family === family);
}

export function programmaticPageWordCount(page: ProgrammaticSeoPage): number {
  const prose = [
    page.directAnswer,
    ...page.sections.flatMap((section) => [
      ...section.paragraphs,
      ...(section.bullets ?? []),
      ...(section.table?.rows.flat() ?? []),
      ...(section.codeExamples?.flatMap((example) => [example.title, example.description]) ?? []),
    ]),
  ].join(' ');

  return prose.match(/[A-Za-z0-9][A-Za-z0-9’'/-]*/g)?.length ?? 0;
}
