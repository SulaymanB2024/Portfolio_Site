/** Illustrative fixtures, not crawls of real clients or claims about platform defaults. */
export type DiagnosticExample = {
  title: string;
  scenario: string;
  checks: [string, string, string][];
  decision: string;
};

export const DIAGNOSTIC_EXAMPLES: Record<string, DiagnosticExample> = {
  'missing-canonical': {
    title: 'An article and its campaign URL',
    scenario: 'A publisher serves the same article at /guides/storage and /guides/storage?utm_source=newsletter. Both return complete HTML, but neither identifies the preferred address. The content is public and intended for search; there is no separate campaign-specific article.',
    checks: [['HTTP response', 'Both URLs return 200', 'Both still return 200'], ['Head canonical', 'Absent from both responses', 'One absolute canonical to /guides/storage on each'], ['Navigation and sitemap', 'Tracking URL appears in permanent links', 'Clean article address is the durable discovery target']],
    decision: 'Keep campaign measurement separate from document identity. Add the shared canonical at the template source and remove tracking parameters from permanent internal links. A missing tag alone does not prove exclusion: check Google’s selected canonical before claiming this explains a missing result.',
  },
  'multiple-canonical-tags': {
    title: 'A theme and plugin claim different URLs',
    scenario: 'The response for /services/audit contains one canonical to itself and another to the homepage. One is emitted by the theme and the other by an SEO plugin. Removing a tag in browser JavaScript would leave the first fetched document contradictory.',
    checks: [['Raw head', 'Two different rel=canonical values', 'One canonical matching the service page'], ['HTTP Link header', 'A third owner may also emit a canonical', 'No conflicting canonical header'], ['Rendered head', 'Client code appends another tag', 'Same canonical as the server response']],
    decision: 'Choose the canonical owner first, then disable the duplicate outputs. Do not pick whichever tag happens to appear first in a local parser. Test a second service page to ensure the repair does not hard-code every route to /services/audit.',
  },
  'canonical-to-redirect': {
    title: 'A renamed guide retains its old canonical',
    scenario: 'The current guide is /guides/crawlability. Its HTML still declares /guides/crawl as canonical, even though that old address permanently redirects to the new guide. The destination content exists and is not intended to be excluded.',
    checks: [['Current page', '200 with canonical to the old slug', '200 with canonical to itself'], ['Old slug', '301 to /guides/crawlability', 'The same permanent redirect remains'], ['Sitemap entry', 'The retired slug is still listed', 'Only /guides/crawlability is listed']],
    decision: 'Point signals directly at the final document without removing the useful legacy redirect. The desired indexed URL is the destination, not both addresses. Inspect the terminal response for a hidden noindex header before treating canonical cleanup as sufficient.',
  },
  'canonical-noindex-conflict': {
    title: 'A public guide inherits a staging header',
    scenario: 'The HTML for /guides/canonicalization declares a self-canonical and index,follow. A production response header still sends X-Robots-Tag: noindex from a staging rule. Reading only the HTML makes this page look eligible when it is not.',
    checks: [['HTML robots', 'index,follow', 'index,follow'], ['HTTP robots', 'X-Robots-Tag: noindex', 'No exclusion directive on the public response'], ['Preview environment', 'Shares the production header rule', 'Keeps its own exclusion or authentication policy']],
    decision: 'Narrow the staging rule rather than turning indexing on across every environment. For an intentionally retired page, choose exclusion or an equivalent replacement instead. The correct outcome follows the page’s purpose, not a blanket instruction to remove every noindex.',
  },
  'redirect-chain': {
    title: 'Host normalization and a slug move stack up',
    scenario: 'An old HTTP www link first upgrades to HTTPS, then drops www, then redirects an obsolete article slug. Each rule is individually plausible, but visitors and crawlers traverse three responses before reaching the same final guide.',
    checks: [['Old entry point', 'HTTP www → HTTPS www → apex old slug → new slug', 'Known old entry points lead directly to the new slug'], ['Final article', '200 and self-canonical', 'Still 200 and self-canonical'], ['Internal anchors', 'Point at an intermediate alias', 'Point directly at the final HTTPS URL']],
    decision: 'Map established aliases to the intended final resource and test the entire host/path matrix. Preserve required query parameters during the move. Do not collapse unrelated obsolete pages onto the homepage merely to make every request finish with status 200.',
  },
  'redirect-loop': {
    title: 'Competing trailing-slash rules',
    scenario: 'The hosting layer redirects /docs/setup to /docs/setup/, while the application redirects /docs/setup/ back to /docs/setup. No request reaches the article even though a local application preview may render it successfully.',
    checks: [['Without slash', '308 to the slash variant', 'One documented normalization outcome'], ['With slash', '308 back to the first URL', 'Redirect to the chosen canonical or serve it'], ['Terminal response', 'Request exceeds redirect limit', 'A finite path ends at the expected 200 document']],
    decision: 'Remove the reciprocal rule at the layer that owns it. Test production routing, not only the framework server, and include host normalization in the test. A longer redirect limit hides the symptom rather than repairing the cycle.',
  },
  'soft-404': {
    title: 'An unknown product receives the application shell',
    scenario: 'Requesting /products/never-existed returns status 200 with the generic application document. JavaScript later displays “Product not found.” The public catalog page and an out-of-stock product still contain useful content and need different handling.',
    checks: [['Nonexistent product', '200 with an error message', '404 or 410, outside the canonical sitemap'], ['Temporary stockout', 'Treated like a deleted resource', 'Useful product details and accurate availability remain'], ['Replacement mapping', 'Every missing product redirects home', 'Redirect only when a genuinely equivalent replacement exists']],
    decision: 'Classify inventory before changing the router. A status-200 error shell can be a soft-404 risk, but a thin-looking page alone is not proof of Google’s classification. Check the URL Inspection result for the actual reason and keep an unknown-path regression test.',
  },
  'robots-blocked-indexable-url': {
    title: 'A public guide is blocked with an obsolete directory',
    scenario: 'A robots rule disallows /guides/ even though the site links to a public guide in that directory and expects it to rank. The file’s canonical and content cannot be fetched through that rule. A separate private account area must stay protected.',
    checks: [['Public guide rule', 'Disallow: /guides/', 'Public guide can be fetched'], ['Guide response', 'No live response visible to the permitted crawler', '200 with the intended canonical and indexability'], ['Private account content', 'Assumed private because robots blocks it', 'Authentication and authorization remain the access boundary']],
    decision: 'For a guide intended for search, remove the unintended crawl block and retain coherent indexing signals. For a URL meant to leave search, let the crawler observe noindex or the removal status instead. These are opposite goals and should not share one automatic repair.',
  },
  'noindex-in-sitemap': {
    title: 'A draft leaks into the published route feed',
    scenario: 'A content export includes /research/draft-model in sitemap.xml while the draft template correctly sends noindex. The entry looks like a failure to index, but the publishing decision is to keep the incomplete model out of search.',
    checks: [['Draft document', '200 with noindex', 'Exclusion remains while the model is incomplete'], ['Canonical sitemap', 'Lists the draft', 'Omits the draft'], ['Published article', 'Indistinguishable in the feed generator', 'Included only after the publish and indexability checks pass']],
    decision: 'Fix feed membership, not the correct exclusion directive. Derive both outputs from the publishing record so a later release changes them together. Adding a page to a sitemap does not override noindex, and removing it from the sitemap alone does not remove an already indexed document.',
  },
  'sitemap-redirects': {
    title: 'The feed still lists a moved research URL',
    scenario: 'An article moved from /notes/crawlers to /research/crawlers. Readers following old citations reach the correct document through a permanent redirect, but the sitemap continues recommending the old address as an indexable page.',
    checks: [['Old address', '301 to the current article', 'Keep the redirect for existing references'], ['Sitemap', 'Contains /notes/crawlers', 'Contains /research/crawlers only'], ['Destination', 'Canonical or robots state not checked', '200, allowed, and self-canonical']],
    decision: 'Generate the feed from canonical publication records rather than a crawl that includes aliases. A “Page with redirect” report for the source is expected. Investigate the destination separately before reporting the article itself as non-indexed.',
  },
  'orphan-page': {
    title: 'A model is listed only in XML',
    scenario: 'A finished research model has a sitemap entry and can be opened directly, but the research browser omits it. No ordinary navigation path reaches the model. Adding more identical sitemap entries would not repair the missing reader journey.',
    checks: [['Research browser', 'No link to the article', 'Descriptive article link in the relevant category'], ['Related research', 'Relevant peers do not mention the model', 'Contextual references where they help the reader'], ['Coverage check', 'Counts only links from the sitemap', 'Verifies every published article appears in a real browsing surface']],
    decision: 'Add the missing catalog entry and a relevant contextual path. Distinguish a page absent from the normal browser from a fully orphaned URL; footer and machine-readable links may already exist. Do not invent measured ranking gains from the link repair.',
  },
  'excessive-crawl-depth': {
    title: 'A useful guide is buried behind archive pagination',
    scenario: 'An evergreen setup guide can be reached only by opening the archive and following several older-page links. A new customer looking for setup instructions has to traverse the same chronology even though the guide is still maintained.',
    checks: [['Shortest useful path', 'Home → archive → older pages → guide', 'Home → documentation hub → guide'], ['Topic hub', 'Groups entries only by date', 'Groups setup, configuration, and troubleshooting by intent'], ['Other old posts', 'Every entry promoted equally', 'Low-value history remains appropriately secondary']],
    decision: 'Use topic-based shortcuts for documents that deserve persistent discovery. There is no universal number of clicks that guarantees indexing. Record depth under a stated graph definition and check that the new links are visible without opening menus or pressing buttons.',
  },
  'broken-internal-link': {
    title: 'A citation points to an obsolete slug without a redirect',
    scenario: 'A research article links to /guides/schema-check, which now returns 404. The maintained equivalent is /guides/structured-data. The source paragraph still accurately describes that equivalent, so the link can be repaired without rewriting the argument.',
    checks: [['Source anchor', 'href points to /guides/schema-check', 'href points directly to /guides/structured-data'], ['Old external entry', '404 despite an equivalent replacement', 'Permanent redirect if the old resource was actually moved'], ['Section fragment', '#validation may not exist on the destination', 'A verified destination section or the article itself']],
    decision: 'Repair both the URL and any fragment. Do not use a homepage redirect as a substitute for a missing source. When no equivalent exists, remove or explain the reference rather than suggesting an unrelated document supports the same claim.',
  },
  'javascript-only-link': {
    title: 'A clickable card lacks an address',
    scenario: 'The research index renders each card as a div whose click handler updates application state. A mouse click works in testing, but the first HTML response contains no anchor for the underlying article and keyboard users cannot open it normally.',
    checks: [['Markup', 'div with an onClick handler', 'a element with a real href'], ['Navigation without JavaScript', 'Card cannot navigate', 'Link opens the canonical article'], ['Client enhancement', 'Only route state changes', 'Routing may intercept an otherwise functional link']],
    decision: 'Keep the address in semantic HTML and treat client routing as an enhancement. Test opening a new tab and keyboard activation as well as a normal click. Crawl discovery should not require the crawler to simulate a user action.',
  },
  'raw-rendered-content-mismatch': {
    title: 'Pricing exists only after a successful API request',
    scenario: 'A public pricing page initially sends a heading and loading indicator. The plan descriptions and eligibility limits appear only after a client request succeeds. A crawler or visitor receiving a script error sees much less than a normal browser session.',
    checks: [['Initial document', 'Heading and placeholder only', 'Current public plan descriptions and limits'], ['Client success', 'Adds a different title or canonical', 'Preserves document identity while enabling interactions'], ['Client failure', 'Loading indicator remains indefinitely', 'Server-delivered content stays readable']],
    decision: 'Publish the stable public information in server or build output. Keep personalized account prices behind the appropriate access boundary. A raw/rendered difference is not automatically harmful; the concern is whether primary meaning and navigation disappear when enhancement fails.',
  },
  'structured-data-content-drift': {
    title: 'A product price changed in HTML but not JSON-LD',
    scenario: 'A product detail page displays a price of 120 in the selected currency, while its structured data still declares 90 from an earlier export. The variant and currency are the same, so this is not an intentional regional offer difference.',
    checks: [['Visible offer', '120 in the displayed currency', 'Uses the authoritative offer record'], ['JSON-LD offer', '90 from a stale export', 'Same eligible offer and currency as the visible page'], ['Unavailable fields', 'Old rating copied into every product', 'Unsupported properties omitted rather than fabricated']],
    decision: 'Bind the two outputs to the same versioned record and invalidate stale derived data. A structured-data fix can restore consistency without determining whether the page will be indexed or receive a rich result. Validate the visible claim as well as the schema syntax.',
  },
  'duplicate-title-tag': {
    title: 'Different service pages inherit one generic title',
    scenario: 'The audit and migration service pages answer different customer questions but both use the title “Services | Example.” Their bodies are substantial and separate; they are not equivalent pages that should be canonicalized to each other.',
    checks: [['Audit page title', 'Services | Example', 'Technical SEO Audit Scope | Example'], ['Migration page title', 'Services | Example', 'Website Migration Review | Example'], ['Head tag count', 'A layout may append a second title', 'Exactly one title with the correct route meaning']],
    decision: 'Fix the route-specific title source and remove duplicate elements if present. Do not invent differences in the title when the pages actually duplicate each other. Duplicate titles can hurt result clarity, but a title repair is not evidence that Google has newly indexed either page.',
  },
  'duplicate-meta-description': {
    title: 'A tutorial and reference page share marketing copy',
    scenario: 'A setup tutorial and an API reference both inherit the sitewide sentence “Explore our powerful platform.” Their purposes differ: one teaches an initial workflow, while the other lists request fields and response behavior.',
    checks: [['Tutorial description', 'Generic platform promotion', 'Names the setup task and prerequisites'], ['Reference description', 'The same generic promotion', 'Names request fields, response format, and version scope'], ['Body support', 'Promises features absent from the page', 'Description reflects information actually present']],
    decision: 'Write descriptions from the page’s useful content, not keyword permutations. Search engines may choose another snippet, and missing or duplicate descriptions do not by themselves establish a reason for non-indexing. Resolve duplicate content separately if the body does not support two intents.',
  },
  'faceted-navigation-crawl-trap': {
    title: 'Filters produce endless orderings of the same inventory',
    scenario: 'A catalog links every color, size, sort order, and empty filter combination. The same selection can be requested with parameters in different orders. Some combinations contain useful distinct inventory; others are empty or merely reorder the same products.',
    checks: [['Valuable category', 'Mixed with every parameter permutation', 'A defined public landing page with its own content'], ['Sorting variants', 'Generate more crawlable URLs', 'Avoid unnecessary discovery of equivalent orderings'], ['Empty combinations', '200 with a bare “No results” message', 'Appropriate status and discovery policy for the intended state']],
    decision: 'Classify useful combinations before choosing crawl restrictions. A canonical needs to be fetched to be seen; a robots block prevents that fetch. Do not claim that simultaneously blocking a URL and adding a canonical guarantees consolidation.',
  },
  'parameter-url-duplication': {
    title: 'Tracking, sorting, and pagination need different rules',
    scenario: 'A guide has a utm_source parameter, while a catalog uses sort and page. Removing all parameters with one global redirect would clean the guide URL but could erase the second page of products or a meaningful search result.',
    checks: [['Tracking parameter', 'Creates permanent duplicate links', 'Clean canonical and clean permanent internal links'], ['Sort parameter', 'Changes order but not inventory membership', 'Documented equivalent-variant treatment'], ['Page parameter', 'Stripped despite different product coverage', 'Preserved as a distinct navigable page when it carries distinct content']],
    decision: 'Classify each parameter by meaning, then test combinations rather than individual examples only. Preserve attribution where it is needed for the incoming request without using tracking addresses as durable document identities. Canonical preferences should not erase unique content.',
  },
  'pagination-infinite-scroll-indexing': {
    title: 'Older research loads only after scrolling',
    scenario: 'The first archive response contains ten articles. A client scroll handler retrieves the next ten, but the URL never changes and the server cannot return that second group on its own. Those older items have no stable sequential discovery path.',
    checks: [['Second archive page', 'No independently fetchable address', 'A stable page URL containing the second group'], ['Next-page control', 'Button or scroll event only', 'A real next-page anchor'], ['Canonical of page two', 'Always points back to page one', 'Represents page two when its entries differ']],
    decision: 'Expose paginated documents before adding infinite scrolling. A fragment such as #page-2 is not a separate server document. Verify coverage by collecting article URLs across the sequence without running any click or scroll handlers.',
  },
  'hreflang-return-tag-error': {
    title: 'One language page has an outdated alternate list',
    scenario: 'The English guide points to its French counterpart, but the French guide still references an old English URL. Both current translations are public and contain comparable material. The broken relationship is in the locale map rather than translation availability.',
    checks: [['English alternates', 'en and fr references', 'Current canonical addresses including self-reference'], ['French alternates', 'Returns to a retired English address', 'Reciprocal current en and fr references'], ['Alternate destination', 'Redirect or noindex not checked', 'Eligible final document with the intended language']],
    decision: 'Generate each locale cluster from one inventory and test both directions. Hreflang is not a substitute for canonicalization or permission to index a blocked page. Do not create a translated URL merely to make an incomplete cluster appear complete.',
  },
  'mobile-desktop-content-mismatch': {
    title: 'Mobile drops the evidence table',
    scenario: 'A desktop research article includes the sources and assumptions that support its conclusion. The mobile component removes the table entirely to shorten the page. A responsive layout change would be appropriate; losing the evidence itself is not equivalent.',
    checks: [['Desktop document', 'Complete argument and evidence', 'Retains the same primary material'], ['Mobile document', 'Sources and assumptions omitted', 'Equivalent evidence in a readable responsive form'], ['Mobile interaction', 'Requires a tap to fetch core content', 'Core content is present without an interaction-triggered fetch']],
    decision: 'Change presentation rather than the underlying publication. Test the mobile viewport and user agent, not only a resized screenshot. Metadata parity cannot compensate for a mobile page that omits the information needed to understand the article.',
  },
  'lazy-loaded-primary-content': {
    title: 'An article waits for IntersectionObserver',
    scenario: 'The article body is loaded when a placeholder enters the viewport. A user who scrolls gets the text, but the initial document and an idle browser do not. Lazy-loading an illustration is a different decision from delaying the article’s primary answer.',
    checks: [['Article body', 'Absent until viewport callback fires', 'Present in initial HTML'], ['Below-fold media', 'Loads eagerly with no dimensions', 'May load lazily with stable dimensions and useful text alternatives'], ['Idle or failed JavaScript', 'Only the placeholder is visible', 'Primary text and article links remain available']],
    decision: 'Send the answer, supporting text, and necessary navigation with the page. Reserve deferred fetching for supplementary material where failure does not erase the document’s purpose. Check before scrolling, because a full-page screenshot tool may otherwise hide this defect.',
  },
  nextjs: {
    title: 'A layout exclusion reaches a public route',
    scenario: 'A Next.js application has separate preview and public publishing paths. A shared layout or metadata helper accidentally gives the public guide the preview noindex setting. A working browser interface does not reveal this head-level mistake.',
    checks: [['Public response', 'Public content with inherited noindex', 'Eligible metadata generated from the published record'], ['Preview response', 'Shares the public eligibility switch', 'Remains access-controlled or explicitly excluded'], ['Generated metadata', 'Title and canonical assembled separately', 'Stable route data drives both the head and visible document']],
    decision: 'Inspect the final deployed response and metadata inheritance, not only a page component. Keep preview protections local to preview routes. Confirm streaming or client behavior does not replace a valid canonical with a different URL after the first response.',
  },
  'react-vite': {
    title: 'A prerender exists but a loading class hides it',
    scenario: 'A Vite site generates complete article HTML, then ships a server-set loading class that hides the article whenever JavaScript is enabled. If the route chunk fails, the full text stays hidden behind a spinner even though it is already in the response.',
    checks: [['Initial article', 'Present but display:none until client startup', 'Visible before any script succeeds'], ['Blocked route chunk', 'Loading shell persists', 'Server article remains readable and linked'], ['Successful mount', 'Static and client copies may overlap', 'Static copy is removed only after the real route commits']],
    decision: 'Treat rendering as progressive enhancement. Neither a browser supporting JavaScript nor the entry module starting proves the article has mounted. Test the entry script and the lazy route chunk failing independently, plus a normal successful transition.',
  },
  wordpress: {
    title: 'Theme, plugin, and archive rules disagree',
    scenario: 'A WordPress publication uses an SEO plugin and a theme that both emit metadata. A tag archive with little distinct content enters a sitemap while a substantial article receives a conflicting canonical. These require different publishing decisions.',
    checks: [['Article head', 'Plugin and theme canonical outputs differ', 'One metadata owner and the correct article identity'], ['Tag archive', 'Indexed by default without an editorial decision', 'Explicit treatment based on usefulness and duplication'], ['Sitemap', 'Generated from a different eligibility rule', 'Matches the final public page policy']],
    decision: 'Inspect the actual theme and active plugin configuration rather than assuming a platform default. Resolve ownership before making bulk edits. Do not remove useful category navigation or expose private content simply because an SEO audit reports excluded archive URLs.',
  },
  shopify: {
    title: 'Collection links and product identity diverge',
    scenario: 'A store links to a product through multiple collection-context addresses. The product detail is equivalent, but the theme uses those contextual addresses in every permanent recommendation. Meanwhile, a genuinely distinct collection page has its own shopping purpose.',
    checks: [['Product variants', 'Multiple discovery addresses for the same product', 'Coherent canonical product identity'], ['Collection page', 'Mistakenly consolidated with a product', 'Retains its distinct collection purpose and inventory'], ['Unavailable product', 'Always redirected to the homepage', 'Handled according to temporary stockout, removal, or equivalent replacement']],
    decision: 'Review rendered theme links, canonical output, and product-state logic together. Do not apply a blanket parameter or collection-path deletion. Test the exact storefront because apps and theme edits can change behavior beyond platform defaults.',
  },
  webflow: {
    title: 'A CMS item publishes with empty SEO fields',
    scenario: 'A Webflow collection template combines an item name and topic into the page title. One published item has a missing name field, so it inherits a generic title and thin heading. Custom head code adds another canonical rather than correcting the record.',
    checks: [['CMS record', 'Required name and topic are blank', 'Complete publication fields or do not publish the item'], ['Published head', 'Generic title and conflicting custom canonical', 'One accurate title and canonical'], ['Custom domain', 'Only the staging preview was reviewed', 'Actual production response is checked after publishing']],
    decision: 'Repair the collection data and template binding instead of adding another metadata layer. Keep draft items out of discovery. Verify the deployed document because editor previews do not establish the canonical, robots state, or response served on the public domain.',
  },
  squarespace: {
    title: 'Injected metadata duplicates native page settings',
    scenario: 'A Squarespace service page has its own search title, but a sitewide code injection adds a second generic title and description. A second service is buried as an unlinked page even though it is intended as a public landing page.',
    checks: [['Page-specific fields', 'Valid but contradicted by injected head code', 'One accurate title and description in the response'], ['Canonical ownership', 'Custom code guesses the preferred URL', 'A single verified canonical output'], ['Public discovery', 'Useful service page has no navigation path', 'Relevant service-hub and contextual links']],
    decision: 'Remove unnecessary custom duplication before adding more code. Inspect both affected service pages after publishing. An unlinked page can still be public and indexable; confirm whether the intended outcome is discovery, a utility page, or genuine private access.',
  },
  wix: {
    title: 'Dynamic-page patterns publish incomplete records',
    scenario: 'A Wix dynamic-page pattern creates pages for records that have a city and slug but no actual service details. Another record is complete and useful. The technical template works for both, but identical eligibility rules would publish empty inventory.',
    checks: [['Incomplete record', 'Public page with mostly substituted place names', 'Held back until useful content exists'], ['Complete record', 'Shares a generic title and description', 'Accurate route-specific fields'], ['Structured data', 'Claims services or ratings not visible on the page', 'Contains only supported, visible facts']],
    decision: 'Gate publication on useful information, not just a valid slug. Confirm the dynamic-page SEO pattern and any custom structured data against the actual page. Changing a robots toggle cannot make an empty location record a useful search result.',
  },
  'headless-cms': {
    title: 'Publishing updates the feed before the document',
    scenario: 'A headless CMS marks an article published and a separate job immediately adds its URL to the sitemap. The frontend build has not deployed that record yet, so the public URL returns 404 or an earlier draft. The two systems disagree about publication readiness.',
    checks: [['Publication event', 'Feed updates before page deployment', 'Public discovery follows an eligible deployed document'], ['Document version', 'Body and metadata come from different revisions', 'One revision drives body, head, and structured data'], ['Preview route', 'Shares publication credentials or public URLs', 'Remains separate and protected']],
    decision: 'Make publish readiness an explicit state and verify it at the public URL before advertising the article. A successful CMS webhook is not evidence of a successful frontend deployment. Retain rollback behavior for both the document and its discovery records.',
  },
  'javascript-seo-audit': {
    title: 'A three-state rendering test catches a false pass',
    scenario: 'A JavaScript audit passes when it checks only the final browser after every request succeeds. The same route fails with scripts blocked and when its lazy chunk returns an error. The audit needs to distinguish absent content from content that was merely delayed.',
    checks: [['Raw response', 'Only head tags inspected', 'Primary answer, links, and canonical inspected'], ['Idle rendered page', 'Test scrolls or clicks before checking', 'Core content is checked before interactions'], ['Failure path', 'Never exercised', 'Entry and route-chunk failure leave useful server content']],
    decision: 'Record each state separately and use the same representative routes across them. Do not interpret a screenshot taken after automated scrolling as evidence that an idle crawler saw the content. Fix the delivery defect before adding another layer of schema or sitemap entries.',
  },
  'ecommerce-technical-seo-audit': {
    title: 'Inventory states determine the release gate',
    scenario: 'The catalog contains an active product, a temporarily unavailable product, a permanently removed product with an equivalent successor, and an empty filter combination. A single “all products indexable” flag cannot express their different user outcomes.',
    checks: [['Active or useful stockout page', 'Identity and availability disagree', 'Accurate details, canonical, and supported availability'], ['Removed item with successor', 'Still listed in the canonical sitemap', 'Equivalent redirect; only the destination is advertised'], ['Filter combination', 'Creates empty duplicate crawl inventory', 'Useful landing pages separated from nonvaluable variants']],
    decision: 'Sample each inventory state rather than just popular products. Join product status, links, canonical hints, structured offers, and sitemap output into one decision table. Keep feed eligibility separate from whether a product is currently purchasable.',
  },
  'saas-technical-seo-audit': {
    title: 'Marketing, documentation, and app routes collide',
    scenario: 'A SaaS company has public pricing, versioned API documentation, and an authenticated dashboard. A shared routing rule gives every route the homepage canonical, while a sitewide exclusion meant for the dashboard also reaches the pricing page.',
    checks: [['Pricing', 'Public answer inherits app exclusion', 'Eligible public response with its own identity'], ['Versioned documentation', 'Every version canonicalizes to the marketing homepage', 'Version policy reflects actual content equivalence'], ['Dashboard', 'Robots used instead of access control', 'Authentication preserved; not added to the public sitemap']],
    decision: 'Separate route families before reviewing individual flags. Public documentation does not become duplicate marketing content just because it belongs to the same product. Test login, expired-session, and anonymous states without publishing private account information.',
  },
  'local-business-technical-seo-audit': {
    title: 'Two addresses describe one office',
    scenario: 'A business moved offices but still has separate old- and new-location pages containing contradictory addresses and opening hours. Another neighborhood page is only a copied city-name variation with no distinct service information.',
    checks: [['Current office', 'Visible details and schema use different addresses', 'One current, supported business record'], ['Former office', 'Appears as a second operating location', 'Clear move handling or an equivalent redirect'], ['Neighborhood variation', 'Generic duplicated service copy', 'Publish only when the page supplies genuinely useful local information']],
    decision: 'Resolve the business facts before generating additional location pages. A real service area is not proof of a separate staffed office. Keep contact details, visible copy, location schema, links, and sitemap membership consistent with what the business actually offers.',
  },
};
