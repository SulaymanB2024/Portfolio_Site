import type { ArticleSource, ResearchArticle } from './articleModels';

const PUBLISHED = '2026.07.19';
const VERIFIED = '2026.07.19';

function source(label: string, href: string): ArticleSource {
  return { label, href, lastVerified: VERIFIED };
}

const URI_STANDARD = source(
  'RFC 3986: Uniform Resource Identifier generic syntax',
  'https://www.rfc-editor.org/rfc/rfc3986.html',
);
const ROBOTS_STANDARD = source(
  'RFC 9309: Robots Exclusion Protocol',
  'https://www.rfc-editor.org/rfc/rfc9309.html',
);
const HTTP_STANDARD = source(
  'RFC 9110: HTTP Semantics',
  'https://www.rfc-editor.org/rfc/rfc9110.html',
);
const GOOGLE_URL_STRUCTURE = source(
  'Google Search: URL structure best practices',
  'https://developers.google.com/search/docs/crawling-indexing/url-structure',
);
const GOOGLE_CRAWL_BUDGET = source(
  'Google Crawling Infrastructure: crawl budget management',
  'https://developers.google.com/crawling/docs/crawl-budget',
);
const GOOGLE_JS_SEO = source(
  'Google Search: JavaScript SEO basics',
  'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
);
const GOOGLE_STATUS_CODES = source(
  'Google Crawling Infrastructure: HTTP status codes',
  'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes',
);
const GOOGLE_CANONICALS = source(
  'Google Search: canonical URL consolidation',
  'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
);
const GOOGLE_REDIRECTS = source(
  'Google Search: redirects and canonical signals',
  'https://developers.google.com/search/docs/crawling-indexing/301-redirects',
);
const GOOGLE_LINKS = source(
  'Google Search: crawlable and internal link best practices',
  'https://developers.google.com/search/docs/crawling-indexing/links-crawlable',
);
const GOOGLE_SITEMAPS = source(
  'Google Search: build and submit a sitemap',
  'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
);
const SITEMAP_PROTOCOL = source(
  'Sitemaps XML protocol',
  'https://www.sitemaps.org/protocol.html',
);
const GOOGLE_ROBOTS_INTRO = source(
  'Google Search: introduction to robots.txt',
  'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
);
const OWASP_AUTHORIZATION = source(
  'OWASP Authorization Cheat Sheet',
  'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
);
const JSON_LD_STANDARD = source(
  'W3C JSON-LD 1.1 Recommendation',
  'https://www.w3.org/TR/json-ld11/',
);
const GOOGLE_STRUCTURED_DATA = source(
  'Google Search: introduction to structured data',
  'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
);
const GOOGLE_STRUCTURED_DATA_POLICY = source(
  'Google Search: general structured data guidelines',
  'https://developers.google.com/search/docs/appearance/structured-data/sd-policies',
);
const PROV_STANDARD = source(
  'W3C PROV-O provenance ontology',
  'https://www.w3.org/TR/prov-o/',
);
const OPENLINEAGE_API = source(
  'OpenLineage API specification',
  'https://openlineage.io/apidocs/openapi/',
);
const TRACE_CONTEXT = source(
  'W3C Trace Context Recommendation',
  'https://www.w3.org/TR/trace-context/',
);
const OPENTELEMETRY_SIGNALS = source(
  'OpenTelemetry signals documentation',
  'https://opentelemetry.io/docs/concepts/signals/',
);
const ANTHROPIC_AGENT_EVALS = source(
  'Anthropic Engineering: demystifying evals for AI agents',
  'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents',
);
const OPENAI_EVALS_API = source(
  'OpenAI API reference: Evals',
  'https://developers.openai.com/api/reference/resources/evals',
);
const AGENT_REWARD_BENCH = source(
  'AgentRewardBench: evaluating automatic evaluations of web-agent trajectories',
  'https://arxiv.org/abs/2504.08942',
);
const SQLITE_TRANSACTIONS = source(
  'SQLite transaction documentation',
  'https://www.sqlite.org/lang_transaction.html',
);
const SQLITE_UPSERT = source(
  'SQLite UPSERT documentation',
  'https://www.sqlite.org/lang_upsert.html',
);
const SQLITE_WAL = source(
  'SQLite write-ahead logging documentation',
  'https://www.sqlite.org/wal.html',
);
const SQLITE_ATOMIC_COMMIT = source(
  'SQLite atomic commit documentation',
  'https://www.sqlite.org/atomiccommit.html',
);
const GOOGLE_SITE_MOVES = source(
  'Google Search: site moves and URL migrations',
  'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes',
);

export const TECHNICAL_ARTICLE_SERIES: ResearchArticle[] = [
  {
    kind: 'research',
    cluster: 'crawler-engineering',
    slug: 'crawl-frontier-state-machine',
    number: '05',
    category: 'CRAWLER ENGINEERING',
    title: 'The Crawl Frontier Is a State Machine, Not a Queue',
    seoTitle: 'Crawl Frontier Design: URL Identity, States, and Retries',
    subtitle:
      'A practical architecture for URL identity, admission control, host politeness, bounded retries, crawl traps, and evidence-preserving frontier transitions.',
    seoDescription:
      'Design a reliable web-crawler frontier with explicit URL identity, state transitions, per-origin scheduling, retry policy, crawl-trap controls, and reproducible evidence.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/crawl-frontier-editorial.webp',
      socialSrc: '/images/research/crawl-frontier-social.jpg',
      alt: 'A monochrome mechanical switchyard routes URL records through explicit crawler states.',
      label: 'Crawler lifecycle / state study',
      caption: 'Branching tracks make scheduling, retries, completion, and terminal states visible as separate transitions.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '15 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'A crawler becomes trustworthy when every URL transition is explicit, replayable, and bounded; a fast queue without an identity and state contract only processes ambiguity faster.',
    evidenceBoundary:
      'This architecture describes an operator-controlled crawler. It does not predict how any search engine schedules a site, and provider crawl-budget guidance is used only to distinguish host capacity, demand, and URL-inventory concerns.',
    metrics: [
      { label: 'Core states', value: '08' },
      { label: 'Scheduling grain', value: 'ORIGIN' },
      { label: 'Retry rule', value: 'BOUNDED' },
      { label: 'Primary artifact', value: 'TRANSITION LOG' },
    ],
    sources: [
      URI_STANDARD,
      ROBOTS_STANDARD,
      GOOGLE_URL_STRUCTURE,
      GOOGLE_CRAWL_BUDGET,
      HTTP_STANDARD,
    ],
    content: [
      'A crawl frontier is often introduced as a queue of URLs waiting to be fetched. That description is convenient and incomplete. Before a URL reaches a network client, the crawler has already made decisions about identity, scope, priority, policy, host capacity, and prior attempts. After the request, the address may redirect, retry, fail permanently, produce new links, or remain unresolved. Those decisions form a state machine whether the implementation acknowledges them or not.',
      'The reliable design makes the machine visible. It stores the submitted address separately from its normalized comparison key, records why the address entered scope, schedules by origin rather than global arrival order, and emits one transition record for every admission, deferral, fetch, retry, suppression, and completion. The result is not merely a crawl that finishes. It is a crawl whose omissions and repeated work can be explained.',
    ],
    sections: [
      {
        id: 'identity-before-scheduling',
        title: 'Define URL identity before scheduling work',
        paragraphs: [
          'The first frontier decision is not priority; it is whether two references identify the same work item for this crawler. RFC 3986 permits syntax-based normalization such as lowercasing the scheme and host, normalizing percent-encoding for unreserved characters, and removing dot segments. It does not authorize arbitrary product decisions such as deleting query parameters, lowercasing a case-sensitive path, or treating a trailing slash as equivalent on every server.',
          'Keep three fields instead of collapsing them into one string: the discovered reference exactly as observed, the absolute resolved URL used for the request, and a comparison key produced by documented crawler rules. This preserves evidence when an aggressive rule proves wrong. A parameter classifier can later mark a key as tracking-only, order-sensitive, content-bearing, or unknown without rewriting the captured source.',
          'Fragments usually do not cause a new HTTP retrieval, but the fragment can still matter as evidence about in-page navigation. Store it on the discovered edge while excluding it from the fetch key. User information, unsupported schemes, malformed ports, and out-of-scope hosts should produce named rejection states rather than disappearing during parsing.',
        ],
        table: {
          caption: 'URL identity record',
          columns: ['Field', 'Purpose', 'Mutation rule'],
          rows: [
            ['observed_ref', 'Exact href, sitemap value, or seed submitted', 'Immutable'],
            ['resolved_url', 'Absolute request target after base resolution', 'New value per redirect hop'],
            ['fetch_key', 'Documented comparison identity for deduplication', 'Version with normalizer'],
            ['discovery_source', 'Page, sitemap, redirect, feed, or manual seed', 'Append-only edge'],
            ['scope_decision', 'Accepted, rejected, deferred, or unknown', 'New transition, never silent overwrite'],
          ],
        },
      },
      {
        id: 'frontier-states',
        title: 'Model lifecycle states, not queue positions',
        paragraphs: [
          'A single pending flag cannot distinguish a URL that is waiting for its host window from one paused by robots policy, one awaiting a retry, and one rejected by scope. Use named lifecycle states such as discovered, admitted, scheduled, fetching, fetched, retryable, suppressed, and terminal. The exact vocabulary can differ, but every state needs an entry condition, an allowed successor set, and an invariant that can be checked.',
          'Transitions should be append-only events keyed by run, URL identity, attempt, and timestamp. The materialized current state is a projection that can be rebuilt. This protects the crawler from the common failure where a worker crashes between updating a row and recording the response artifact. It also makes recovery conservative: a stale fetching lease can return to scheduled while a terminal response cannot be fetched again without an explicit new attempt or run.',
          'Use leases rather than permanent ownership. A worker claims a scheduled item until a deadline and renews only while it is doing useful work. If the process disappears, the frontier can reclaim the item and retain the abandoned attempt. The record then shows that two attempts occurred instead of pretending that one continuous request existed.',
        ],
        table: {
          caption: 'Minimal crawl-frontier transition contract',
          columns: ['From', 'Event', 'To', 'Required evidence'],
          rows: [
            ['discovered', 'scope accepted', 'admitted', 'discovery edge and comparison key'],
            ['admitted', 'origin slot assigned', 'scheduled', 'priority, earliest fetch time, policy version'],
            ['scheduled', 'worker lease acquired', 'fetching', 'worker, lease expiry, attempt ID'],
            ['fetching', 'response captured', 'fetched', 'status, headers, body reference, timings'],
            ['fetching', 'transient failure', 'retryable', 'error class, retry count, next eligible time'],
            ['any pre-fetch state', 'policy denies', 'suppressed', 'rule, policy source, evaluation time'],
            ['fetched or retryable', 'completion rule met', 'terminal', 'terminal reason and artifact set'],
          ],
        },
      },
      {
        id: 'origin-scheduling',
        title: 'Schedule capacity at the origin boundary',
        paragraphs: [
          'A global FIFO queue lets one large host dominate workers and makes politeness an afterthought. Partition eligible work by origin, where origin includes scheme, host, and port. Give each partition a concurrency ceiling, minimum interval, next-eligible time, and recent response-health record. A global scheduler can then select among origins while the origin scheduler selects the next URL.',
          'Rate is only one dimension. A host returning fast successful responses may tolerate more concurrency than one returning timeouts or server errors, but an adaptive controller should move slowly and remain bounded. Apply backoff to the origin after transport failures, 429 responses, or repeated 5xx responses; do not punish unrelated origins. Persist the decision inputs so the same response history can reproduce the scheduling decision.',
          'Robots policy belongs before dispatch, not inside the response parser. Cache the host-scoped policy with retrieval time, status, expiry, and parser version. RFC 9309 defines protocol behavior, including handling of access failures and caching, but an operator may choose a more conservative local policy. Record that choice separately from the standard-derived parse result.',
        ],
        bullets: [
          'Use a fair origin selector so a deep host cannot starve smaller hosts.',
          'Apply random jitter within a bounded window to avoid synchronized retry bursts.',
          'Cap both per-origin concurrency and total active sockets.',
          'Re-evaluate host policy when a cached robots record expires or changes.',
          'Treat server health as a scheduling input, not as evidence about page quality.',
        ],
      },
      {
        id: 'crawl-traps',
        title: 'Bound the address space before it becomes a crawl trap',
        paragraphs: [
          'The web graph can be finite in content and effectively infinite in URLs. Calendars can generate one month forever; faceted navigation can permute filters; sort orders can multiply equivalent inventories; session identifiers can create a new address per visit; and internal search can expose an unbounded query space. A crawler that discovers until the queue is empty has no meaningful stop condition in those environments.',
          'Set independent budgets for total accepted URLs, depth, query-key combinations, path patterns, per-host pages, redirect hops, response bytes, render time, and wall-clock duration. A budget breach should produce a gap record containing the rule, affected pattern, first example, and count suppressed. This is materially different from silently truncating the crawl and later describing the sampled set as the site.',
          'Trap detection is a classification problem with asymmetric costs. An overbroad rule can erase a valid product dimension; an underbroad rule can consume the run. Begin with reversible deferral, group candidates by structural signature, and promote a rule only after examples show which address components change content. Keep allow exceptions narrower and more explicit than the rule they override.',
        ],
        table: {
          caption: 'Crawl-bound controls and their failure states',
          columns: ['Bound', 'Protects against', 'Required gap record'],
          rows: [
            ['URL count', 'Unbounded inventory', 'accepted count, suppressed count, frontier remainder'],
            ['Pattern cardinality', 'Calendars and generated paths', 'pattern, examples, first blocked transition'],
            ['Parameter combinations', 'Facet and sort permutations', 'keys, values, observed content delta'],
            ['Redirect hops', 'Loops and long chains', 'hop list and terminal status'],
            ['Response and render budget', 'Large files and hanging applications', 'limit, bytes or time observed, completeness state'],
          ],
        },
      },
      {
        id: 'retry-and-replay',
        title: 'Retry only when the next attempt can mean something',
        paragraphs: [
          'A retry policy should answer three questions: is the failure plausibly transient, when is the next attempt eligible, and how many attempts can still occur? DNS timeouts, connection resets, 429 responses, and many 5xx responses can be retryable. A stable 404, a scope rejection, or a robots denial generally needs a new run or policy change rather than immediate repetition. Preserve the original response and error even when a later attempt succeeds.',
          'Use exponential backoff with bounded jitter and a maximum delay. Honor an applicable Retry-After value within local safety limits. Store the classification rule and the computed next time, because a timestamp without its reasoning is not replayable. When the attempt budget is exhausted, transition to a terminal failure that remains visible in coverage reports.',
          'The frontier is complete when every admitted item is terminal or represented by an explicit unresolved state, not when no worker is busy. A run summary should reconcile counts across discovery, deduplication, suppression, fetch, retry, and failure states. That accounting identity is the crawler equivalent of balancing a ledger: if accepted URLs cannot be traced to final states, the crawl report is not ready to support a site-wide claim.',
        ],
        codeExamples: [
          {
            title: 'A typed transition rather than an in-place status update',
            description: 'The event stores both the decision and the inputs needed to review it later.',
            language: 'typescript',
            code: [
              'type FrontierTransition = {',
              '  runId: string;',
              '  fetchKey: string;',
              '  attemptId: string;',
              '  from: FrontierState;',
              '  event: string;',
              '  to: FrontierState;',
              '  occurredAt: string;',
              '  policyVersion: string;',
              '  evidenceRef?: string;',
              '  reason: string;',
              '};',
            ].join('\n'),
          },
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'technical-seo',
    slug: 'raw-html-rendered-dom-evidence',
    number: '06',
    category: 'RENDERING EVIDENCE',
    title: 'Raw HTML and Rendered DOM Are Separate Evidence',
    seoTitle: 'Raw HTML vs Rendered DOM: A Technical SEO Evidence Contract',
    subtitle:
      'How to capture, compare, and qualify transport source, browser output, dependent requests, runtime failures, and render completeness without treating screenshots as data.',
    seoDescription:
      'Build a raw HTML versus rendered DOM evidence contract for JavaScript SEO, including capture fields, completeness states, DOM diffs, runtime failures, and triage.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/raw-html-rendered-dom-editorial.webp',
      socialSrc: '/images/research/raw-html-rendered-dom-social.jpg',
      alt: 'A monochrome source-document field faces a reconstructed rendered architecture across a bright boundary.',
      label: 'Rendering evidence / source and reconstruction',
      caption: 'Transport markup and browser-rendered state remain separate observations joined by an explicit rendering boundary.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '14 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Raw source and browser-rendered output answer different questions, so a technical audit must preserve both artifacts and qualify the browser environment before interpreting their delta.',
    evidenceBoundary:
      'A controlled browser run describes the tested environment at a recorded time. It does not reproduce every search crawler, user device, cache state, geography, consent choice, or personalization path, and a successful local render does not prove indexing.',
    metrics: [
      { label: 'Evidence states', value: 'SOURCE + DOM' },
      { label: 'Completeness', value: 'EXPLICIT' },
      { label: 'Diff grain', value: 'FIELD' },
      { label: 'Primary artifact', value: 'RENDER ENVELOPE' },
    ],
    sources: [
      GOOGLE_JS_SEO,
      GOOGLE_STATUS_CODES,
      source('WHATWG DOM Standard', 'https://dom.spec.whatwg.org/'),
      source('Chrome DevTools Protocol', 'https://chromedevtools.github.io/devtools-protocol/'),
      HTTP_STANDARD,
    ],
    content: [
      'Raw HTML is the response body delivered by the server for a request. The rendered DOM is a browser-created document state after parsing, script execution, network activity, and mutations. They are related artifacts, not competing screenshots of one truth. The source can contain meaningful content that JavaScript removes; the DOM can contain meaningful content that the source never delivered; either state can be incomplete for reasons unrelated to the page template.',
      'A useful rendering audit records both sides of the transformation and the environment between them. That means request and response metadata, source bytes, browser identity, navigation timing, dependent-request outcomes, console errors, stop conditions, DOM serialization, and a completeness label. Only then can a reviewer distinguish an implementation defect from a blocked resource, consent branch, timeout, authentication boundary, or instrumentation failure.',
    ],
    sections: [
      {
        id: 'transport-artifact',
        title: 'Capture the transport artifact before opening a browser',
        paragraphs: [
          'Begin with a direct request whose target, headers, redirect chain, status, response headers, body hash, byte length, and timing are stored together. The requested URL and final URL must remain separate. A 200 response with an empty application shell is not equivalent to a 200 response containing the visible article, even though the status field matches.',
          'Preserve the body rather than only extracted fields. Extraction rules change, and a later reviewer may need to establish whether a title, canonical, link, or structured record was absent from the response or missed by the parser. Content encoding and character decoding should also be recorded; replacement characters introduced during a bad decode can look like source defects.',
          'HTTP state remains useful even when rendering is required. Redirects, cache headers, content type, robots directives, and transport failures exist before client execution. A browser screenshot cannot recover a lost redirect hop or prove which markup the origin returned.',
        ],
        table: {
          caption: 'Minimum source-capture envelope',
          columns: ['Layer', 'Required fields', 'Why it matters'],
          rows: [
            ['Request', 'requested URL, method, selected headers, timestamp', 'Defines the attempted observation'],
            ['Redirects', 'hop URL, status, location, elapsed time', 'Preserves routing and canonicalization evidence'],
            ['Response', 'final URL, status, headers, content type', 'Defines transport outcome'],
            ['Body', 'artifact reference, hash, bytes, decoded charset', 'Makes extraction reviewable'],
            ['Failure', 'error class, phase, retry state', 'Separates no response from an empty response'],
          ],
        },
      },
      {
        id: 'render-environment',
        title: 'Treat the browser environment as part of the result',
        paragraphs: [
          'A rendered DOM depends on the browser engine and version, viewport, locale, time zone, cookie jar, storage state, user agent, JavaScript policy, service workers, network interception, authentication, and consent choices. If those inputs are not named, two runs that disagree cannot be compared. A generic label such as desktop render is insufficient.',
          'Isolate contexts between URLs unless the test intentionally models a continuing session. Persistent cookies can turn a public route into a personalized one; a service worker can serve a cached response that no longer matches the origin; shared local storage can suppress a modal or trigger a different application branch. Save the scenario name and state seed next to the artifact.',
          'Browser instrumentation should observe navigation requests, subresource failures, console output, page exceptions, and redirects. It should not inject fixes that make the page succeed unless the intervention itself is the subject of a second experiment. Blocking analytics may be a reasonable privacy choice, but that modified network policy belongs in the evidence envelope.',
        ],
        bullets: [
          'Pin browser family and exact version for comparable reruns.',
          'Record viewport, locale, time zone, reduced-motion setting, and color preference.',
          'Start from a named cookie and storage state.',
          'Store failed requests and page exceptions with timestamps.',
          'Mark every interception, mock, or blocked resource as an intervention.',
        ],
      },
      {
        id: 'completion-contract',
        title: 'Replace “network idle” with a page-specific completion contract',
        paragraphs: [
          'Modern pages may keep telemetry, chat, streaming, or polling requests open indefinitely. Conversely, a quiet network does not prove that meaningful content appeared. A fixed sleep has the opposite problem: it can be too short under load and wasteful when the page is already complete. Completion should be a testable contract tied to the page type.',
          'A product page might require one main heading, price text, primary image state, canonical link, product structured record, and no fatal application error. An article might require the title, body threshold, publication metadata, and internal navigation. Use a maximum wall-clock deadline around these conditions, then label the result complete, partial, timed out, blocked, or failed.',
          'The label must survive downstream extraction. A parser can still emit fields from a partial DOM, but the record should carry the completeness state and missing conditions. Otherwise a half-rendered navigation can be converted into a false orphan-page finding or a missing-content claim.',
        ],
        table: {
          caption: 'Render-completeness states',
          columns: ['State', 'Meaning', 'Allowed interpretation'],
          rows: [
            ['complete', 'All required page-type conditions observed', 'Field comparison is supported for this scenario'],
            ['partial', 'Some required conditions observed before stop', 'Present fields are evidence; missing fields remain uncertain'],
            ['timed_out', 'Deadline reached before the contract resolved', 'No normal-health conclusion'],
            ['blocked', 'Challenge, authentication, or explicit denial prevented access', 'Coverage gap with visible boundary'],
            ['failed', 'Browser, navigation, or instrumentation error', 'Tool failure until reproduced otherwise'],
          ],
        },
      },
      {
        id: 'semantic-diff',
        title: 'Diff semantic fields before diffing serialized markup',
        paragraphs: [
          'A character-level diff between HTML strings is dominated by generated identifiers, attribute order, hydration markers, timestamps, and framework wrappers. Those changes may be irrelevant to discovery or understanding. Extract comparable semantic fields from source and DOM first: headings, visible text blocks, links, canonical, robots directives, language alternates, structured records, forms, media, and named page components.',
          'For each field, classify added, removed, changed, or unchanged values and retain pointers to both artifacts. Links should be compared after resolution while preserving their original href and anchor text. Structured data should be compared as parsed records with stable identifiers, not as raw JSON key order. Text comparisons should report both normalized and exact states so normalization cannot hide a meaningful difference.',
          'Serialized DOM remains valuable for debugging, especially when a field-level delta points to a component. The order matters: begin with a claim-relevant difference, then inspect the markup that produced it. This keeps a technical SEO report centered on operational consequences rather than on every mutation a framework performs.',
        ],
        codeExamples: [
          {
            title: 'A render envelope that keeps observation and interpretation apart',
            description: 'The completeness result and artifact references travel with every extracted field.',
            language: 'json',
            code: [
              '{',
              '  "run_id": "render-2026-07-19-001",',
              '  "requested_url": "https://example.com/article",',
              '  "source_artifact": "sha256:source-hash",',
              '  "dom_artifact": "sha256:dom-hash",',
              '  "browser": { "name": "chromium", "version": "pinned" },',
              '  "scenario": "anonymous-desktop",',
              '  "completion": { "state": "partial", "missing": ["article-body"] },',
              '  "failed_requests": 2,',
              '  "field_diff_ref": "artifact://field-diff.json"',
              '}',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'triage-order',
        title: 'Triage delivery, execution, extraction, and interpretation in order',
        paragraphs: [
          'When a source field is absent and the DOM field is present, first ask whether client rendering is an intentional delivery choice and whether the render contract completed. When the source field is present and the DOM field is absent, inspect component logic, hydration, consent, and runtime failures. When both are present but an audit says missing, reproduce the extractor against the saved artifacts before changing the site.',
          'Keep crawler accessibility separate from browser capability. Google documents a crawling, rendering, and indexing process for JavaScript pages, but a local Chromium run is not a Googlebot result. It is controlled implementation evidence. The audit can say that content depends on successful client execution in the tested scenario; it cannot infer that every downstream system failed to process it.',
          'Close the loop with a focused rerun after a repair. Use the same request headers, browser version, scenario, completion contract, and field extractor. A passing rerun should show the expected delta and no new failure state. If the environment changed, treat it as a new comparison rather than silently declaring the old finding resolved.',
        ],
        table: {
          caption: 'Source-to-DOM triage matrix',
          columns: ['Source', 'DOM', 'First question', 'Claim boundary'],
          rows: [
            ['present', 'present', 'Did extraction or normalization fail?', 'Delivery is visible in both saved states'],
            ['absent', 'present', 'Did required client execution complete reliably?', 'Content depends on tested render path'],
            ['present', 'absent', 'What mutation removed or replaced it?', 'Client execution changed delivered content'],
            ['absent', 'absent', 'Was the page complete and was the right route captured?', 'Missing only if both observations are valid'],
            ['unknown', 'partial', 'Which completion condition failed?', 'Coverage gap, not confirmed absence'],
          ],
        },
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'technical-seo',
    slug: 'canonicalization-graph-consistency',
    number: '07',
    category: 'TECHNICAL SEO',
    title: 'Canonicalization Is a Graph Consistency Problem',
    seoTitle: 'Canonicalization as a Graph Consistency Problem',
    subtitle:
      'A systems method for finding conflicting canonicals, redirect chains, cycles, duplicate clusters, and sitemap disagreements before they become indexation ambiguity.',
    seoDescription:
      'Model canonicalization as a graph across redirects, rel canonical, sitemaps, internal links, and duplicate clusters, then validate consistency with executable gates.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/canonicalization-editorial.webp',
      socialSrc: '/images/research/canonicalization-social.jpg',
      alt: 'A dense monochrome network of routes converges on one illuminated authoritative node.',
      label: 'Canonical graph / convergence study',
      caption: 'Redirects, canonicals, internal links, and sitemap references converge on one route identity.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '14 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Canonicalization is reliable when every duplicate cluster converges on one reachable representative and redirects, annotations, sitemaps, and internal links agree with that graph.',
    evidenceBoundary:
      'Canonical annotations and related site signals express preferences; they do not compel a search system to select a URL. The graph method diagnoses internal consistency and transport behavior, not the final decision of an external index.',
    metrics: [
      { label: 'Graph nodes', value: 'URL STATES' },
      { label: 'Edge classes', value: '05' },
      { label: 'Failure mode', value: 'NON-CONVERGENCE' },
      { label: 'Primary artifact', value: 'CLUSTER MAP' },
    ],
    sources: [
      GOOGLE_CANONICALS,
      GOOGLE_REDIRECTS,
      GOOGLE_SITEMAPS,
      SITEMAP_PROTOCOL,
      source('RFC 6596: The Canonical Link Relation', 'https://www.rfc-editor.org/rfc/rfc6596.html'),
      URI_STANDARD,
    ],
    content: [
      'A canonical tag is one edge in a larger URL graph. Redirects move a requester, rel canonical annotations name a preferred representative, sitemaps nominate URLs, internal links reinforce destinations, and duplicate detection groups similar documents. Reviewing any one signal in isolation misses the failures created by their interaction: a sitemap can list a URL that redirects, a canonical can target a page that canonicals elsewhere, and two duplicates can point at each other.',
      'Graph analysis turns those contradictions into testable structures. Each observed URL is a node with transport and indexability fields. Each redirect, canonical, internal link, sitemap membership, alternate relationship, and duplicate classification becomes a typed edge with an evidence source. The central question is convergence: does every eligible member of a duplicate cluster lead to one stable, indexable representative without cycles, broken targets, or competing nominations?',
    ],
    sections: [
      {
        id: 'typed-url-graph',
        title: 'Build a typed URL graph instead of a canonical column',
        paragraphs: [
          'A spreadsheet row with URL and canonical target cannot represent redirect hops, source-versus-render differences, sitemap membership, or the fact that several pages claim the same representative. Store a URL node once per run and attach typed observations. The node should include requested and final status, indexability directives, content signature, source canonical, rendered canonical, and whether the address was nominated by a sitemap or internal link.',
          'Edges require provenance. A redirect edge comes from an HTTP response and status. A canonical edge can come from an HTML link element or HTTP Link header. A duplicate edge comes from an exact hash, normalized fingerprint, or reviewed similarity rule. A sitemap edge records the specific sitemap artifact. The type and source prevent a weak derived similarity from being mistaken for a server instruction.',
          'Retain contradictory edges. If source HTML points to A and rendered HTML points to B, storing only the last extracted value hides the defect. The inconsistency itself is the finding. The same principle applies when a canonical target changes between locales, device templates, or repeated captures.',
        ],
        table: {
          caption: 'Canonical graph edge types',
          columns: ['Edge', 'Source', 'Meaning', 'Validation'],
          rows: [
            ['redirects_to', 'HTTP Location and status', 'Request resolves elsewhere', 'Target reachable; chain and loop bounds'],
            ['declares_canonical', 'HTML or HTTP Link relation', 'Publisher preference', 'Absolute target; one effective declaration'],
            ['listed_in', 'Sitemap artifact', 'Publisher nomination', 'Canonical, indexable URL on intended host'],
            ['links_to', 'Crawlable internal anchor', 'Discovery and navigation relation', 'Destination and anchor context'],
            ['duplicates', 'Hash or reviewed similarity rule', 'Content-equivalence hypothesis', 'Method, threshold, and exceptions'],
          ],
        },
      },
      {
        id: 'convergence-invariant',
        title: 'Define convergence as an executable invariant',
        paragraphs: [
          'For each duplicate cluster, choose the intended representative from product requirements rather than from whichever URL the crawler encountered first. Every non-representative should either permanently redirect to that URL or return a usable page with a consistent canonical annotation when the duplicate must remain accessible. The representative should self-canonicalize, return an eligible response, and appear in internal links and sitemaps where appropriate.',
          'Resolve canonical and redirect edges repeatedly until they reach a fixed point or violate a bound. A valid cluster has one terminal representative. A chain may be technically resolvable and still operationally weak because every additional hop creates another dependency and another place for a target to change. Flatten known redirect and canonical chains during implementation.',
          'The invariant should name exceptions. Paginated series, language alternates, syndication, faceted collections, printable views, PDFs, and application states can have different product requirements. An exception record needs scope, owner, rationale, and expiry; otherwise exception becomes a permanent label for an unreviewed contradiction.',
        ],
        bullets: [
          'Exactly one intended representative exists per reviewed duplicate cluster.',
          'The representative returns an eligible response and declares itself when an annotation is used.',
          'Every declared target resolves within the configured hop limit.',
          'No canonical or redirect cycle exists.',
          'Sitemaps and canonical internal links nominate the representative, not its aliases.',
          'Source and rendered declarations do not conflict.',
        ],
      },
      {
        id: 'cycles-and-components',
        title: 'Use graph components to find cycles and split-brain clusters',
        paragraphs: [
          'Canonical cycles are strongly connected components with more than one URL, or a self-loop that does not represent an intentional self-canonical. Redirect loops are the same structural failure with a different edge type. Detecting components is more reliable than following a target until a timeout because it produces the complete set of URLs participating in the loop.',
          'Split-brain clusters occur when members converge on different representatives. This can happen when templates use the current request host, query state, or locale to construct canonicals; when old and new routing systems run together; or when a migration map covers only some aliases. Group by the duplicate relation first, then count terminal representatives reached through canonical and redirect edges.',
          'A high in-degree target is not automatically correct. It may be a category page that a template mistakenly emits site-wide. Review whether the target is equivalent to its sources, whether it serves the same user purpose, and whether consolidation would discard unique content. Graph metrics locate concentration; product and content evidence decide whether the concentration is valid.',
        ],
        table: {
          caption: 'Graph structures and likely causes',
          columns: ['Structure', 'Detection', 'Likely cause', 'Repair direction'],
          rows: [
            ['cycle', 'Strongly connected component', 'Mutual or template-derived targets', 'Select one representative and remove the loop'],
            ['chain', 'Path length greater than one', 'Layered migrations or stale aliases', 'Point every known source to the terminal URL'],
            ['split cluster', 'Multiple terminal targets', 'Mixed rules or partial migration', 'Reconcile product identity and generation logic'],
            ['fan-in anomaly', 'Unexpectedly high target in-degree', 'Default or site-wide canonical', 'Check equivalence before consolidation'],
            ['dead target', 'Terminal non-eligible response', 'Deleted, blocked, or malformed representative', 'Restore or retarget with explicit mapping'],
          ],
        },
      },
      {
        id: 'signal-alignment',
        title: 'Align redirects, annotations, links, and sitemaps at their source',
        paragraphs: [
          'Google documents redirects and rel canonical as stronger canonicalization signals than sitemap inclusion, while also recommending consistent internal links. The implementation lesson is not to stack every signal blindly. It is to generate them from one route-identity model so they cannot drift. A page registry should own the canonical path, aliases, indexability, and sitemap eligibility.',
          'Generate the redirect map from retired aliases, the canonical URL from the page record, the sitemap from eligible canonical pages, and navigation links from the same route keys. If a route is removed or renamed, a typed change should update every representation. Manual lists in four files are eventually four different truths.',
          'Do not use robots.txt to repair canonicalization. A blocked duplicate can remain known while its content and canonical annotation cannot be fetched. Do not mix a noindex directive with a canonical preference unless the product requirement truly calls for removal from search rather than consolidation. Each mechanism has a distinct job.',
        ],
        codeExamples: [
          {
            title: 'One route identity drives every public signal',
            description: 'Aliases, canonical metadata, sitemap eligibility, and links are projections of one record.',
            language: 'typescript',
            code: [
              'type PublicRoute = {',
              '  key: string;',
              '  canonicalPath: `/${string}` | "/";',
              '  aliases: `/${string}`[];',
              '  indexable: boolean;',
              '  lastSignificantChange: string;',
              '};',
              '',
              'const sitemapRoutes = routes.filter((route) => route.indexable);',
              'const redirects = routes.flatMap((route) =>',
              '  route.aliases.map((from) => ({ from, to: route.canonicalPath, permanent: true })),',
              ');',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'release-gate',
        title: 'Fail the release on non-convergent canonical graphs',
        paragraphs: [
          'A release gate can validate the route registry before deployment and then validate sampled or complete production responses after deployment. Static checks catch duplicate canonical paths, alias collisions, sitemap disagreement, and graph cycles. Production checks catch host rewrites, middleware redirects, stale caches, injected tags, and response headers that source code alone cannot prove.',
          'Test both canonical pages and aliases. For each canonical page, assert the expected status, one effective canonical declaration, eligible directives, intended sitemap membership, and at least one crawlable internal path when the page is public. For each retired alias, assert a bounded permanent redirect chain to the exact representative. Record actual hops rather than only the final URL.',
          'A passing graph test proves internal consistency at the tested time. External canonical selection still depends on systems outside the site. The correct post-release language is therefore precise: the site emits a convergent set of publisher signals, and any external disagreement can now be investigated against a coherent source state.',
        ],
        bullets: [
          'Reject duplicate canonical route keys and aliases owned by more than one route.',
          'Reject canonical targets outside the known public inventory unless explicitly approved.',
          'Reject cycles and chains beyond the documented hop budget.',
          'Reject sitemap URLs that redirect, noindex, fail, or canonicalize elsewhere.',
          'Compare source and rendered canonical declarations on JavaScript templates.',
          'Save the production response evidence used by the gate.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'technical-seo',
    slug: 'internal-links-directed-retrieval-graph',
    number: '08',
    category: 'SITE ARCHITECTURE',
    title: 'Internal Links Are a Directed Retrieval Graph',
    seoTitle: 'Internal Linking as a Directed Retrieval Graph',
    subtitle:
      'A graph-first method for crawlable links, reachability, depth, contextual edges, orphan diagnosis, and repair plans that preserve user intent.',
    seoDescription:
      'Analyze internal links as a directed graph using reachability, depth, components, edge context, orphan states, and executable validation instead of raw link counts.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/internal-links-editorial.webp',
      socialSrc: '/images/research/internal-links-social.jpg',
      alt: 'A deep monochrome architectural lattice connects chambers with directed paths.',
      label: 'Internal retrieval / directed lattice',
      caption: 'Reachability emerges from directed pathways between entry points, hubs, and isolated chambers.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '13 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Internal-link quality is the ability of people and crawlers to reach the right canonical pages through meaningful, crawlable paths—not the number of links a template can emit.',
    evidenceBoundary:
      'Graph metrics describe the captured internal architecture and help prioritize review. They do not measure proprietary ranking weights, guarantee crawling or indexing, or prove that adding a link will improve search performance.',
    metrics: [
      { label: 'Graph', value: 'DIRECTED' },
      { label: 'Edge context', value: 'RETAINED' },
      { label: 'Orphan states', value: '04' },
      { label: 'Primary artifact', value: 'LINK EDGE TABLE' },
    ],
    sources: [
      GOOGLE_LINKS,
      GOOGLE_SITEMAPS,
      GOOGLE_URL_STRUCTURE,
      URI_STANDARD,
      source(
        'The PageRank Citation Ranking: Bringing Order to the Web',
        'https://ilpubs.stanford.edu/422/',
      ),
    ],
    content: [
      'An internal link is a directed edge from one document to another, observed in a particular source or rendered state with anchor text, placement, and crawlability conditions. Reducing that edge to a destination count discards the information needed to explain architecture. A global navigation link, an editorial citation, a related-product card, a pagination control, and a hidden script route can all point to the same URL while serving different retrieval functions.',
      'The graph-first approach preserves node identity and edge context, then asks reachable questions: which canonical pages can be reached from approved entry points, how many hops are required, which components are disconnected, where do redirects consume edges, and which important pages depend on one fragile source? Metrics narrow the review set. They do not replace the product judgment that determines which paths should exist.',
    ],
    sections: [
      {
        id: 'edge-contract',
        title: 'Store a link edge with enough context to review it',
        paragraphs: [
          'The minimum edge has a source URL, observed href, resolved destination, anchor or accessible name, DOM or source location, link type, discovery state, and artifact reference. Preserve whether the element was an anchor with an href because Google documents that form as the generally crawlable link pattern. A click handler on a div may support a user interaction while remaining a different technical object.',
          'Normalize the source and destination against the same route-identity contract used by the crawl frontier, but retain the observed href. Relative paths, fragments, alternate hosts, tracking parameters, and redirects can then be diagnosed without losing evidence. Classify the destination after resolution as canonical, alias, external, asset, non-HTTP, malformed, or unknown.',
          'Placement should be derived cautiously. Header, primary navigation, breadcrumb, main content, related content, pagination, filter, and footer are useful classes when the DOM structure supports them. Do not infer importance from CSS coordinates alone. The important point is that a repeated template edge and a unique editorial edge remain distinguishable.',
        ],
        table: {
          caption: 'Internal-link edge contract',
          columns: ['Field', 'Example', 'Review question'],
          rows: [
            ['source_key', '/guides/crawling', 'Which canonical page emits the edge?'],
            ['observed_href', '../tools/crawler?ref=guide', 'What did the document actually contain?'],
            ['destination_key', '/tools/crawler', 'Which canonical identity receives it?'],
            ['label', 'crawler architecture tool', 'Can a reader predict the destination?'],
            ['placement', 'main/editorial', 'Is the edge contextual or repeated template chrome?'],
            ['artifact_ref', 'run/url/source#node-184', 'Can another reviewer reproduce the observation?'],
          ],
        },
      },
      {
        id: 'reachability',
        title: 'Measure reachability from real entry points',
        paragraphs: [
          'A page is structurally reachable when a directed path exists from an approved entry set through crawlable internal edges. The homepage is one entry, not the only one. Category hubs, section roots, locale roots, authenticated application shells, and feed or campaign landings can represent different user journeys. Define the entry set before calculating depth.',
          'Run breadth-first search on canonical destinations after resolving known redirects. Report shortest depth and at least one path, but also count independent parent sources. A priority page reachable in two hops through one soon-to-be-retired article is more fragile than a page with several relevant parents. Path diversity is not a ranking metric; it is an architecture resilience measure.',
          'Keep source and rendered graphs separate when client execution adds navigation. If the source graph cannot reach an article but the rendered graph can, the finding is dependency on the tested client path, not absolute orphaning. If neither graph reaches it but a sitemap lists it, label it sitemap-only. Each state implies a different repair.',
        ],
        table: {
          caption: 'Reachability states for a public canonical page',
          columns: ['State', 'Observed evidence', 'Interpretation'],
          rows: [
            ['source-reachable', 'Path through source anchor href edges', 'Server-delivered discovery path exists'],
            ['render-only', 'No source path; path appears after tested execution', 'Discovery depends on client rendering scenario'],
            ['sitemap-only', 'No internal path; canonical URL is nominated in sitemap', 'Declared but not architecturally integrated'],
            ['external-only', 'Known inbound reference but no internal path', 'Third-party discovery exists; internal context absent'],
            ['unobserved', 'No captured path or nomination', 'Coverage or publication gap; verify inventory first'],
          ],
        },
      },
      {
        id: 'components-and-orphans',
        title: 'Diagnose components before labeling orphan pages',
        paragraphs: [
          'A directed graph can contain weakly connected groups that are isolated from the primary site and strongly connected groups that circulate internally without a path from an entry. These components often reveal retired subdirectories, alternate hosts, faceted islands, staging remnants, or microsites imported without navigation. Inspect representative URLs and edge classes before assigning one site-wide remedy.',
          'An orphan label needs an inventory source. A page discovered only through a database export, analytics, log file, external backlink, or sitemap is not equivalent to a page discovered during the internal crawl. Record the source that proves the node exists. Without that, the absence of inlinks may simply mean the crawler never knew the URL.',
          'Not every zero-inlink URL needs a new link. Redirect targets, campaign pages, utility endpoints, legal notices, feed documents, and intentionally private states may have special entry paths or should leave the indexable inventory. The decision should be keep and link, consolidate and redirect, retain with bounded reachability, noindex, or remove—not add links everywhere.',
        ],
        bullets: [
          'Compare crawl nodes with sitemap, analytics, logs, CMS exports, and approved route registries.',
          'Separate zero observed inlinks from zero eligible crawlable inlinks.',
          'Inspect weak and strong components for shared template or host causes.',
          'Assign an intended entry path before proposing a link.',
          'Remove aliases and noncanonical URLs from the candidate set before counting orphans.',
        ],
      },
      {
        id: 'context-and-concentration',
        title: 'Use graph metrics to find questions, not to manufacture importance',
        paragraphs: [
          'In-degree identifies destinations receiving many captured edges; out-degree identifies sources that distribute many. Depth exposes long retrieval paths. Betweenness can identify bridge pages whose removal disconnects routes. Strong components expose circulation. Edge concentration shows whether most paths depend on one template. These measures are useful because they reveal structures worth reviewing.',
          'Raw PageRank or similar centrality scores can be calculated on an internal graph, but the score is a model of the captured link network, not a disclosed search-engine value. Results are sensitive to which nodes and edges were included, how redirects were resolved, whether repeated links were collapsed, and how dangling nodes were handled. Store those choices next to the output.',
          'Anchor text and surrounding context answer a different question: whether the relationship is legible. Repeated exact-match anchors are not automatically better, and generic labels are not automatically wrong. Review whether the phrase helps a reader understand the destination, fits the sentence or component, and distinguishes nearby links.',
        ],
        table: {
          caption: 'Graph metrics as diagnostic prompts',
          columns: ['Metric', 'Useful question', 'Common misuse'],
          rows: [
            ['shortest depth', 'How many eligible hops from the intended entry?', 'Treating every deep page as low quality'],
            ['in-degree', 'Which destinations attract or lack internal references?', 'Equating count with proprietary authority'],
            ['parent diversity', 'How many independent sources support the route?', 'Counting repeated template links as independent'],
            ['betweenness', 'Which pages bridge otherwise separate sections?', 'Changing bridges without journey review'],
            ['component membership', 'Which routes circulate outside the main architecture?', 'Calling every isolated component an error'],
          ],
        },
      },
      {
        id: 'repair-and-rerun',
        title: 'Repair journeys, then rerun the same graph contract',
        paragraphs: [
          'A link plan should name the source page, destination canonical, placement, intended reader question, anchor or component label, owner, and expected graph change. This prevents the recommendation “add more internal links” from becoming a site-wide template block. The strongest repairs usually connect an existing explanatory page to the next useful artifact or decision.',
          'After implementation, crawl the same scope and rebuild both source and rendered edge tables. Assert that the new edge is a crawlable anchor, reaches the canonical destination without an avoidable redirect, appears in the intended component, and does not create broken or duplicate links. Recalculate reachability and depth only after the edge-level checks pass.',
          'Monitor for regressions when templates or route registries change. A page can return to sitemap-only status when a collection stops rendering, a navigation key changes, or a canonical path is renamed without updating contextual links. The durable artifact is therefore not a one-time score; it is a versioned graph and a small set of architecture invariants.',
        ],
        codeExamples: [
          {
            title: 'Find sitemap URLs with no eligible internal inlinks',
            description: 'This query assumes redirects and canonical aliases were resolved before edge loading.',
            language: 'sql',
            code: [
              'SELECT u.canonical_url',
              'FROM url_inventory AS u',
              'LEFT JOIN link_edges AS e',
              '  ON e.destination_key = u.url_key',
              ' AND e.is_crawlable = 1',
              'WHERE u.in_sitemap = 1',
              '  AND u.is_indexable = 1',
              'GROUP BY u.url_key, u.canonical_url',
              'HAVING COUNT(e.source_key) = 0',
              'ORDER BY u.canonical_url;',
            ].join('\n'),
          },
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'robots-txt-courtesy-not-access-control',
    number: '09',
    category: 'CRAWLER POLICY',
    title: 'Robots.txt Is a Courtesy Layer, Not Access Control',
    seoTitle: 'Robots.txt Is Not Access Control: A Layered Crawler Policy',
    subtitle:
      'A precise model for separating crawler requests, indexing directives, authentication, authorization, rate controls, and evidence of enforcement.',
    seoDescription:
      'Separate robots.txt from authentication, authorization, indexing directives, rate limits, and bot verification with a layered crawler-control model and release checks.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/robots-policy-editorial.webp',
      socialSrc: '/images/research/robots-policy-social.jpg',
      alt: 'A ceremonial paper boundary gives way to progressively stronger barriers protecting a monochrome vault.',
      label: 'Crawler policy / access boundary',
      caption: 'A published courtesy rule and a materially secured resource are different control layers.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '13 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Robots.txt is a host-scoped request policy for cooperating crawlers; confidential or costly resources need enforceable server-side authorization and capacity controls that do not depend on a claimed user agent.',
    evidenceBoundary:
      'The controls in this article describe publisher-side policy and enforcement. A rule does not prove that every client complies, that a provider attributed a request the same way, or that an allowed page will be crawled, indexed, trained on, or cited.',
    metrics: [
      { label: 'Control layers', value: '06' },
      { label: 'Security boundary', value: 'SERVER' },
      { label: 'Identity claim', value: 'UNTRUSTED' },
      { label: 'Primary artifact', value: 'POLICY MATRIX' },
    ],
    sources: [
      ROBOTS_STANDARD,
      HTTP_STANDARD,
      GOOGLE_ROBOTS_INTRO,
      OWASP_AUTHORIZATION,
      source('OpenAI crawler documentation', 'https://developers.openai.com/api/docs/bots'),
    ],
    content: [
      'A robots.txt file is public text that asks automated clients how they may access paths on one service. It is valuable because cooperating crawlers can retrieve one predictable policy before requesting content. It is not a credential, firewall, authorization decision, encryption layer, or proof of the client behind a User-Agent string. Treating it as any of those creates a security boundary that an ordinary HTTP client can cross by ignoring the file.',
      'A robust crawler policy uses separate controls for separate outcomes. Robots rules govern cooperating automated retrieval. Page-level robots directives express indexing and presentation preferences to supporting systems. Authentication establishes an identity; authorization decides whether that identity may access a resource. Edge and application controls protect capacity. Logging and verification provide evidence about what happened. The layers can support one policy, but none substitutes for the others.',
    ],
    sections: [
      {
        id: 'six-control-layers',
        title: 'Name the six control layers before writing rules',
        paragraphs: [
          'The first layer is discovery policy: robots.txt communicates path rules to crawlers that implement the protocol. The second is document processing policy: robots meta elements and response headers can ask supporting indexers not to index a fetched resource or not to expose certain features. The third and fourth are authentication and authorization, which establish who or what is making a request and whether that principal may perform the action.',
          'The fifth layer protects service capacity with connection limits, rate limits, quotas, caching, circuit breakers, and workload isolation. The sixth is observation: logs, challenge outcomes, provider-published address ranges, and response evidence used to classify requests after or during access. Observation can inform an enforcement decision, but a log label alone does not protect a route.',
          'Write the desired outcome first. “Do not spend crawler capacity on faceted combinations,” “do not expose this account document publicly,” “allow search discovery but decline a named model-development crawler,” and “keep the origin healthy under bursts” are different requirements. Each belongs to a different combination of layers.',
        ],
        table: {
          caption: 'Crawler-control layers and their boundaries',
          columns: ['Layer', 'Mechanism', 'Controls', 'Does not establish'],
          rows: [
            ['Discovery policy', '/robots.txt', 'Cooperating crawler path access', 'Confidentiality or client identity'],
            ['Document policy', 'robots meta or X-Robots-Tag', 'Supporting indexer processing', 'Request denial'],
            ['Authentication', 'Session, token, certificate, signed request', 'Claimed principal', 'Permission by itself'],
            ['Authorization', 'Server or edge policy', 'Allowed action on resource', 'Crawler compliance'],
            ['Capacity', 'Rate, concurrency, quota, cache', 'Resource consumption', 'Content eligibility'],
            ['Observation', 'Logs, ranges, reverse verification, traces', 'Attribution evidence', 'Retroactive prevention'],
          ],
        },
      },
      {
        id: 'rep-semantics',
        title: 'Implement robots semantics as a versioned policy parser',
        paragraphs: [
          'RFC 9309 standardizes the Robots Exclusion Protocol, including user-agent matching, rule matching, access results, and caching. A production parser should be covered by fixtures for casing, group selection, percent-encoding, longest-match behavior, comments, empty rules, Unicode handling, and retrieval failure states. A hand-written substring test is not an adequate policy engine.',
          'Policy is scoped to the service where the file is served. Hostname, scheme, and port distinctions matter operationally. Redirects and cache behavior must be recorded because a stale or cross-host file can produce a policy different from the one an operator inspected in source control. Store the retrieved bytes, effective URL, status, fetch time, parser version, selected group, and matched rule.',
          'A missing, unreachable, or invalid file is not the same observation as an explicit Allow or Disallow. Preserve the protocol-derived result and any conservative local override as separate fields. That distinction lets operators change local risk posture without rewriting what the remote service published.',
        ],
        bullets: [
          'Fetch the production file from every relevant scheme, host, and port combination.',
          'Keep the raw policy artifact and its redirect chain.',
          'Version parser fixtures against the standard and known edge cases.',
          'Record the selected group and exact matching rule for each decision.',
          'Expire cached policy deliberately and expose stale-policy state.',
        ],
      },
      {
        id: 'protect-private-content',
        title: 'Protect private content even when every crawler rule disappears',
        paragraphs: [
          'The practical test for confidential content is simple: if robots.txt were deleted and the client changed its User-Agent, would the server still deny the request? If not, the content is public. Move the decision to an authorization layer that validates a principal and checks permission for the resource on every request. Default denial is appropriate when no rule grants access.',
          'Do not publish sensitive paths in robots.txt as a substitute for protection. The file is public and can reveal route names. A disallowed URL can also be discovered from links, logs, referrers, sitemaps, or prior crawls. The response itself must avoid returning the protected representation to an unauthorized requester.',
          'Choose HTTP responses according to the application and standard semantics, then test them at the boundary. The important invariant is not a specific status alone; it is that an unauthenticated or unauthorized request cannot obtain the representation through alternate methods, encodings, hosts, cache keys, file variants, or indirect endpoints.',
        ],
        table: {
          caption: 'Outcome-to-control mapping',
          columns: ['Requirement', 'Primary control', 'Supporting controls', 'Verification'],
          rows: [
            ['Keep account data private', 'Authorization', 'Authentication, cache isolation, audit log', 'Anonymous and wrong-principal requests denied'],
            ['Reduce duplicate crawling', 'Robots policy or URL inventory repair', 'Canonical routes, link cleanup', 'Production policy and request logs reviewed'],
            ['Remove a public page from an index', 'Page-level directive or removal workflow', 'Status and sitemap updates', 'Fetched response contains intended directive'],
            ['Protect origin capacity', 'Rate and concurrency controls', 'Caching, backoff, workload queues', 'Load and rejection behavior measured'],
            ['Classify a named provider bot', 'Multi-signal observation', 'Published ranges and reverse checks when available', 'Attribution confidence retained'],
          ],
        },
      },
      {
        id: 'bot-identity',
        title: 'Treat User-Agent as a claim, not an identity',
        paragraphs: [
          'Any client can send a familiar crawler token. The header is still useful for routing logs and selecting a robots group because the protocol depends on crawler identification, but it should not unlock privileged content or bypass expensive-request controls. Security decisions need a stronger authenticated signal or a policy that remains safe when identity is unknown.',
          'Some providers publish address ranges or verification guidance. Use those records as dated attribution evidence, not as a timeless allowlist copied into application code. Retrieve the provider artifact securely, validate its format, record the version or hash, compare the observed address, and define what happens when the feed is stale or unavailable. Network ownership can support classification without proving the purpose of an individual request.',
          'Separate observed, claimed, and attributed identity in logs. Observed fields include address, TLS and request properties, time, host, path, and complete User-Agent. Claimed identity is the token. Attributed identity is a derived conclusion with method and confidence. This prevents dashboards from turning a string match into a verified traffic count.',
        ],
        codeExamples: [
          {
            title: 'Verify policy and authorization as independent checks',
            description: 'The public policy response and protected-resource denial should both be tested.',
            language: 'shell',
            code: [
              'curl -fsS -D robots.headers https://example.com/robots.txt -o robots.body',
              '',
              'curl -sS -o /dev/null -w "%{http_code}\\n" \\',
              '  -A "ExampleCrawler/1.0" https://example.com/private/account',
              '',
              'curl -sS -o /dev/null -w "%{http_code}\\n" \\',
              '  -A "Mozilla/5.0" https://example.com/private/account',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'release-evidence',
        title: 'Release policy with an evidence matrix',
        paragraphs: [
          'A crawler-policy change can affect discovery, indexing workflows, origin load, data use, and user-triggered retrieval. Review the exact user-agent groups, path rules, existing search-engine rules, sitemap declarations, and inherited edge controls before deployment. Generate the final file from structured policy when several hosts or environments must stay aligned.',
          'After deployment, fetch the public file without relying on a local filesystem copy. Assert status, content type, expected group selection, sitemap hostname, redirect behavior, and cache headers. Exercise representative allowed and disallowed paths with the policy parser, then separately test authorization and rate-control boundaries. A robots test passing says nothing about the private-route test.',
          'Monitor outcomes with bounded language. Logs can show requests carrying selected tokens, response statuses, and rate-control events. They cannot show requests that never reached the measured layer, prove full provider identity from a token, or prove downstream indexing or training decisions. A useful policy report includes those gaps instead of converting silence into compliance.',
        ],
        bullets: [
          'Review every existing group before merging a new crawler policy.',
          'Test the deployed file from outside the origin environment.',
          'Run parser fixtures against representative site paths.',
          'Test private resources with no credentials and wrong credentials.',
          'Measure origin rejections and latency after capacity-policy changes.',
          'Date every provider-specific identity source and attribution rule.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'technical-seo',
    slug: 'structured-data-without-content-drift',
    number: '10',
    category: 'STRUCTURED DATA',
    title: 'Structured Data Without Content Drift',
    seoTitle: 'Structured Data Without Drift: One Source for HTML and JSON-LD',
    subtitle:
      'A typed-content architecture for keeping visible pages, metadata, JSON-LD, sitemaps, and exports consistent through generation, invariants, and production tests.',
    seoDescription:
      'Prevent structured-data drift by generating HTML, metadata, JSON-LD, sitemaps, and exports from one typed content model with semantic invariants and release checks.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/structured-data-editorial.webp',
      socialSrc: '/images/research/structured-data-social.jpg',
      alt: 'Two synchronized monochrome ledgers run in parallel while one translucent layer begins to drift.',
      label: 'Structured data / synchronized ledgers',
      caption: 'Visible content and machine-readable projections stay aligned until an unmanaged shadow layer separates.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '14 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Structured data is trustworthy when it is a typed projection of the same maintained record that renders the page, and release gates test semantic agreement rather than syntax alone.',
    evidenceBoundary:
      'Valid JSON-LD and policy-aligned page content can establish internal consistency and eligibility conditions. They do not guarantee a rich result, ranking change, indexation, citation, or any particular downstream interpretation.',
    metrics: [
      { label: 'Source records', value: 'ONE' },
      { label: 'Projections', value: 'HTML + JSON-LD' },
      { label: 'Gate', value: 'SEMANTIC' },
      { label: 'Primary artifact', value: 'CONTENT CONTRACT' },
    ],
    sources: [
      JSON_LD_STANDARD,
      GOOGLE_STRUCTURED_DATA,
      GOOGLE_STRUCTURED_DATA_POLICY,
      source('Schema.org documentation', 'https://schema.org/docs/documents.html'),
      GOOGLE_SITEMAPS,
    ],
    content: [
      'Structured data drifts when it is maintained as a second copy of the page. A title changes in the component but not in JSON-LD; a publication date updates in the sitemap but not the article record; an offer expires while a cached schema block still marks it available; a profile page names a current role that the visible biography no longer supports. Every representation can be syntactically valid and collectively contradictory.',
      'The durable fix is architectural. Define one typed domain record with stable identifiers, validated fields, provenance, and explicit optionality. Render visible HTML, head metadata, JSON-LD, sitemap rows, feeds, and exports as projections of that record. Then test both the schema shape and the agreement between machine-readable values and the page a person can inspect.',
    ],
    sections: [
      {
        id: 'domain-record',
        title: 'Start with a domain record, not a schema-shaped object',
        paragraphs: [
          'The content model should describe the product or publication, not the vocabulary of one consumer. An Article record might own canonical path, headline, description, author reference, publication time, modification time, image asset, body, evidence boundary, and indexability. A Product record might own identity, offer state, price amount and currency, availability source, and review policy. JSON-LD is one serialization of those facts.',
          'Validate the domain record at ingestion or build time. Dates should be parseable and ordered, money should carry currency, canonical paths should be unique, referenced assets should exist, and identifiers should be stable across deployments. Optional fields should reflect genuinely absent facts rather than a renderer failing to locate them.',
          'Keep editorial language and normalized values together. The page may display “Updated July 19, 2026” while the machine value is an ISO timestamp. Both should derive from the same instant. If two teams maintain the human and machine forms separately, a formatting change can become a factual disagreement.',
        ],
        table: {
          caption: 'Domain field to public projection',
          columns: ['Domain field', 'Visible projection', 'Machine projection', 'Invariant'],
          rows: [
            ['canonicalPath', 'Internal link destination', 'url and mainEntityOfPage', 'One absolute canonical identity'],
            ['headline', 'Page h1', 'headline or name', 'Meaningfully identical text'],
            ['publishedAt', 'Publication label', 'datePublished', 'Same instant and time zone policy'],
            ['modifiedAt', 'Updated label', 'dateModified and sitemap lastmod', 'Significant change only; not before publication'],
            ['authorId', 'Linked byline', 'Person or Organization @id', 'Resolves to the same visible author'],
            ['imageId', 'Relevant visible media', 'image URL', 'Crawlable asset represents the page'],
          ],
        },
      },
      {
        id: 'stable-identifiers',
        title: 'Use stable identifiers to connect page entities',
        paragraphs: [
          'JSON-LD can represent several related entities: the WebPage, its main Article or Product, the author, publisher, organization, breadcrumb, image, and dataset. Stable absolute identifiers let those nodes refer to one another without copying full records into every page. A profile can own the Person node while articles refer to its identifier.',
          'An identifier is a public contract. Avoid build hashes, deployment URLs, random values, and environment-specific hosts. Define identifiers from the canonical production origin and stable fragments or routes. If a domain changes, migrate identifiers deliberately and preserve equivalent public relationships where appropriate.',
          'Do not create identity connections merely because two labels resemble each other. A sameAs relation, author reference, or organization membership should be supported by the maintained domain record and visible content. Stronger graph connectivity is not useful when the edges are unreviewed assertions.',
        ],
        bullets: [
          'Use canonical absolute URLs for public entity identifiers.',
          'Keep one identifier per enduring entity role.',
          'Reference shared entities rather than emitting divergent copies.',
          'Separate current identity facts from dated historical claims.',
          'Validate that every internal @id resolves within the generated graph.',
        ],
      },
      {
        id: 'projection-boundary',
        title: 'Generate JSON-LD at the projection boundary',
        paragraphs: [
          'Place schema generation near the code that converts a validated domain record into page output, not inside a presentation component that receives fragments of data. The generator should be a pure function: the same input record and site configuration produce the same JSON-compatible object. That makes snapshots, property tests, and cross-output comparisons possible.',
          'Select the most specific applicable type only after the page purpose is clear. A page can contain several entities, but the main entity should match what a reader sees. Google structured-data guidance emphasizes visible, representative, current content. A richly populated object describing hidden or unrelated material is a quality defect even if a validator accepts every property.',
          'Treat consumer-specific requirements as adapters. The JSON-LD standard defines a serialization model; schema.org defines vocabulary; individual search features impose additional eligibility rules. Keep those layers distinguishable so a change in one consumer does not corrupt the underlying domain record.',
        ],
        codeExamples: [
          {
            title: 'Generate Article JSON-LD from the maintained record',
            description: 'The function receives validated content and emits no independently maintained facts.',
            language: 'typescript',
            code: [
              'function articleJsonLd(article: ArticleRecord, site: SiteConfig) {',
              '  const url = new URL(article.canonicalPath, site.origin).href;',
              '  return {',
              '    "@context": "https://schema.org",',
              '    "@type": "Article",',
              '    "@id": `${url}#article`,',
              '    mainEntityOfPage: { "@id": url },',
              '    headline: article.headline,',
              '    description: article.description,',
              '    datePublished: article.publishedAt,',
              '    dateModified: article.modifiedAt,',
              '    author: { "@id": `${site.origin}/about#person` },',
              '    image: new URL(article.artwork.socialSrc, site.origin).href,',
              '  };',
              '}',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'semantic-invariants',
        title: 'Test semantic invariants across outputs',
        paragraphs: [
          'A schema validator answers whether an object satisfies a vocabulary or feature shape. It may not know that the page h1 says one thing while the headline property says another, that the declared image returns 404, or that a sitemap modification date changes on every build. Add site-specific invariants that compare generated outputs against the domain record.',
          'Parse the built HTML rather than searching source strings. Extract the canonical, visible heading, relevant date labels, image references, and embedded JSON-LD. Resolve URLs against the production origin, locate the main entity, and compare normalized values. Fetch or file-check referenced assets in the appropriate validation stage.',
          'Test negative cases. A missing required field should fail before emission; a future publication time should be rejected unless scheduled publishing is a supported state; a noindex route should not enter the canonical sitemap; and two pages should not claim the same unique entity identifier unless they intentionally describe one entity.',
        ],
        table: {
          caption: 'Semantic release invariants',
          columns: ['Invariant', 'Inputs compared', 'Failure prevented'],
          rows: [
            ['title agreement', 'h1, title, JSON-LD headline', 'Conflicting page identity'],
            ['URL agreement', 'route, canonical, @id, sitemap loc', 'Competing canonical records'],
            ['date agreement', 'visible label, JSON-LD, sitemap lastmod', 'False or stale freshness'],
            ['image integrity', 'visible image, schema URL, built asset', 'Broken or unrelated media claim'],
            ['indexability alignment', 'robots directives, route policy, sitemap', 'Noindex URL nominated as canonical'],
            ['entity uniqueness', '@id set across built routes', 'Accidental identity collision'],
          ],
        },
      },
      {
        id: 'change-management',
        title: 'Version the contract and make drift observable',
        paragraphs: [
          'Vocabulary and consumer documentation evolve. Record the date and source used for feature-specific fields, then isolate changes in a schema adapter with focused tests. Do not rewrite historical publication facts to make markup look fresh. Modification dates should represent significant changes to the page or structured record according to a documented policy.',
          'Add a production smoke check because middleware, caches, tag managers, and client code can change the delivered document after the build passes. Fetch representative routes, parse the final head and body, verify JSON-LD once, and compare the public sitemap. If client rendering mutates structured data, capture source and DOM values separately and fail on contradictions.',
          'Monitor errors as evidence, not as an automatic editing feed. A consumer warning may be optional, page-type specific, or based on stale retrieval. Reproduce it against the current public response, map it to the maintained domain field, and change the source record or adapter once. The objective is one coherent public fact graph, not a validator with zero yellow icons.',
        ],
        bullets: [
          'Document which changes qualify as dateModified and sitemap lastmod updates.',
          'Pin validation fixtures to representative page types.',
          'Store the built JSON-LD artifact used by release checks.',
          'Re-fetch production after cache and middleware layers.',
          'Route consumer warnings back to the owning domain field.',
          'Recheck source guidance before adopting newly recommended properties.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'data-systems',
    slug: 'audit-findings-derived-records',
    number: '11',
    category: 'EVIDENCE SYSTEMS',
    title: 'Audit Findings Should Be Derived Records',
    seoTitle: 'Audit Findings as Derived Records: Provenance for Technical SEO',
    subtitle:
      'A data model that separates captured observations, artifacts, rule evaluations, findings, confidence, review state, and recommendations without losing lineage.',
    seoDescription:
      'Model technical SEO audit findings as derived records with observation lineage, immutable artifacts, versioned rules, explicit gaps, confidence, review, and reproducible exports.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/audit-findings-editorial.webp',
      socialSrc: '/images/research/audit-findings-social.jpg',
      alt: 'Captured evidence passes through transparent rule plates into a sealed monochrome finding record.',
      label: 'Audit lineage / sealed findings',
      caption: 'Artifacts pass through versioned rules before becoming traceable, reviewable finding records.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '15 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'An audit finding is defensible only when it can be regenerated from named observations and a versioned rule while preserving uncertainty, reviewer decisions, and the exact evidence used.',
    evidenceBoundary:
      'Provenance makes derivation inspectable; it does not make the observation complete or the rule correct. Findings still require scope, data-quality checks, domain review, and explicit treatment of measurement gaps.',
    metrics: [
      { label: 'Record layers', value: '06' },
      { label: 'Rule identity', value: 'VERSIONED' },
      { label: 'History', value: 'APPEND-ONLY' },
      { label: 'Primary artifact', value: 'LINEAGE CHAIN' },
    ],
    sources: [
      PROV_STANDARD,
      OPENLINEAGE_API,
      TRACE_CONTEXT,
      OPENTELEMETRY_SIGNALS,
      source('OpenLineage facets and extensibility', 'https://openlineage.io/docs/spec/facets/'),
    ],
    content: [
      'A technical audit often jumps from a crawl table to a sentence: “these pages have missing canonicals,” “this template is orphaned,” or “JavaScript hides the content.” The sentence may be right, but the system has compressed several steps into one label. It observed a response, parsed an artifact, normalized fields, applied a rule, grouped URLs, interpreted impact, and proposed an action. When those layers are not stored separately, the conclusion cannot be reproduced or safely revised.',
      'Treat a finding as a derived record. Captured artifacts remain immutable. Observations point to fields inside those artifacts. A versioned rule consumes observations and emits an evaluation. A finding groups evaluations into an operator-facing claim with scope, confidence, and gap states. Review events approve, reject, amend, or supersede that claim. Recommendations remain a final planning layer rather than being embedded in the observation.',
    ],
    sections: [
      {
        id: 'six-record-layers',
        title: 'Separate the six records an audit usually collapses',
        paragraphs: [
          'The artifact is the captured object: response headers and body, rendered DOM, screenshot, log slice, sitemap, configuration, or analytics export. An observation is a typed fact extracted from an artifact, such as status 200, canonical absent in source, or three crawlable inlinks. The observation should retain the artifact pointer, extractor version, capture time, and completeness state.',
          'A rule evaluation records the rule ID and version, input observations, outcome, and parameters. A finding turns one or more evaluations into a scoped claim such as “the product template emits conflicting source and rendered canonicals on 184 reviewed URLs.” Review state records human or automated decisions without overwriting the claim. A recommendation proposes a change, owner, risk, and acceptance test.',
          'These layers have different truth conditions. An artifact can be authentic while incomplete. An observation can correctly describe the artifact while the capture scenario is unrepresentative. A rule can run deterministically and still encode the wrong requirement. A recommendation can be impractical even when the finding is sound. Keeping the layers visible makes disagreement productive.',
        ],
        table: {
          caption: 'Six-layer audit record model',
          columns: ['Layer', 'Example', 'Immutable core', 'Can be superseded by'],
          rows: [
            ['artifact', 'HTTP response body and headers', 'Bytes, hash, capture metadata', 'A new capture, never an overwrite'],
            ['observation', 'Source canonical is absent', 'Artifact pointer, extractor, field value', 'A corrected extractor result'],
            ['evaluation', 'canonical_presence@2.1 = fail', 'Rule version, inputs, outcome', 'A new rule evaluation'],
            ['finding', 'Template conflict affects 184 URLs', 'Claim version and evidence set', 'A reviewed successor finding'],
            ['review', 'Accepted with scope amendment', 'Actor, time, decision, rationale', 'Another append-only review event'],
            ['recommendation', 'Generate source canonical from route registry', 'Proposed change and acceptance test', 'An updated implementation plan'],
          ],
        },
      },
      {
        id: 'lineage-identifiers',
        title: 'Give every run, artifact, rule, and claim a stable identifier',
        paragraphs: [
          'W3C PROV distinguishes entities, activities, and agents; OpenLineage similarly represents runs, jobs, inputs, outputs, and event state. A technical audit does not need to reproduce either vocabulary completely to benefit from the structure. The core requirement is that a derived record names the input entities, generating activity, responsible software or reviewer, and time.',
          'Use run IDs for bounded executions, artifact IDs derived from content hashes plus storage identity, observation IDs tied to artifact location and extractor version, and rule IDs separated from rule versions. A finding ID should represent the continuing issue identity while each revision receives a distinct version. This supports comparison without pretending that amended claims are the same record.',
          'Propagate a correlation identifier through fetch, render, extract, evaluate, review, and export events. W3C Trace Context offers a standard mechanism for distributed request correlation, but audit lineage also needs durable domain IDs because a trace may be sampled, short-lived, or split across asynchronous work. Correlation helps locate events; provenance defines what was derived from what.',
        ],
        bullets: [
          'Do not use mutable filenames as the only artifact identity.',
          'Separate rule identity from code deployment identity.',
          'Retain the exact input set for every evaluation.',
          'Make review actor and automation identity explicit.',
          'Carry run and URL identity into every export row.',
          'Record sampling and missing-event states when telemetry is incomplete.',
        ],
      },
      {
        id: 'versioned-rules',
        title: 'Make rule evaluation deterministic and versioned',
        paragraphs: [
          'A rule should declare required input fields, eligibility conditions, parameters, outcomes, and gap behavior. “Missing title” is incomplete if the parser failed, the response was not HTML, the render timed out, or the route intentionally returns no document. Evaluate prerequisites first and return not-applicable or insufficient-evidence when they are not satisfied.',
          'Version a rule whenever its logic, threshold, normalization, or required inputs change. Store a human-readable summary and a machine-executable implementation reference. Re-running old artifacts through a new rule should create new evaluations rather than mutating historical results. This makes changes in issue counts explainable.',
          'Determinism requires controlled inputs. Time-dependent checks need a recorded evaluation time. External lookups need captured responses or versioned datasets. Machine-learned classification needs model and prompt or feature versions, confidence, and a review threshold. If the same inputs can produce materially different results, the evaluation must store the trial or sampling contract.',
        ],
        codeExamples: [
          {
            title: 'A normalized schema for lineage-preserving evaluations',
            description: 'The composite key prevents a new rule run from overwriting an earlier interpretation.',
            language: 'sql',
            code: [
              'CREATE TABLE rule_evaluation (',
              '  run_id TEXT NOT NULL,',
              '  url_key TEXT NOT NULL,',
              '  rule_id TEXT NOT NULL,',
              '  rule_version TEXT NOT NULL,',
              '  input_set_hash TEXT NOT NULL,',
              '  outcome TEXT NOT NULL CHECK (outcome IN',
              '    ("pass", "fail", "gap", "not_applicable")),',
              '  evidence_json TEXT NOT NULL,',
              '  evaluated_at TEXT NOT NULL,',
              '  PRIMARY KEY (run_id, url_key, rule_id, rule_version, input_set_hash)',
              ');',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'gaps-and-confidence',
        title: 'Represent gaps and confidence without turning them into scores',
        paragraphs: [
          'A missing observation is data. The fetch may have been blocked, the render may have timed out, the parser may not support the content type, the route may require authentication, or the source inventory may be incomplete. Give those states codes and evidence. Do not convert every gap into a failing finding or exclude it from the denominator without disclosure.',
          'Confidence should explain which uncertainty it summarizes. Observation confidence can describe parser certainty; rule confidence can describe classification strength; coverage confidence can describe whether the affected set is complete; recommendation confidence can describe implementation assumptions. One unlabeled percentage collapses those distinct questions.',
          'Use counts with denominators and eligibility definitions. “184 of 210 eligible product URLs failed; 17 additional URLs had incomplete renders” is more useful than “87.6% issue confidence.” The first statement lets a reviewer locate both evidence and gaps. The second sounds precise while hiding what was measured.',
        ],
        table: {
          caption: 'Gap states that should survive into the report',
          columns: ['Gap', 'Example cause', 'Report treatment', 'Next action'],
          rows: [
            ['not_captured', 'URL never entered the bounded run', 'Outside measured coverage', 'Review discovery and scope'],
            ['fetch_failed', 'DNS, timeout, or transport failure', 'No response-state claim', 'Bounded retry or operator review'],
            ['render_partial', 'Completion conditions not met', 'Present fields only; absence uncertain', 'Inspect dependencies and rerun'],
            ['unsupported', 'Parser lacks format or feature', 'Tooling gap', 'Add support or exclude explicitly'],
            ['ambiguous', 'Rule inputs conflict', 'Review queue, not automatic fail', 'Inspect artifact and product intent'],
          ],
        },
      },
      {
        id: 'review-and-export',
        title: 'Make review and export lossless',
        paragraphs: [
          'Review should append a decision to a finding version: accepted, rejected, needs evidence, duplicate, risk reclassified, scope amended, or recommendation changed. The reviewer needs the claim, affected set, representative examples, gap counts, rule definition, and direct artifact links. A dashboard that shows only the final label forces trust in the pipeline it is supposed to expose.',
          'Exports should preserve stable IDs, not flatten everything into prose. A CSV can carry finding ID, version, rule, affected URL, outcome, confidence class, gap state, artifact reference, review state, owner, and acceptance test. JSON can preserve nested lineage. An executive summary can remain readable while linking back to those records.',
          'A post-fix rerun should generate a new run and new evaluations, then relate them to the accepted finding. Resolution requires both implementation evidence and the affected rule passing across the agreed scope, with new gaps disclosed. Closing a ticket because code merged is a workflow event, not proof that the observed condition changed.',
        ],
        bullets: [
          'Never overwrite the evidence set after a finding enters review.',
          'Store reviewer amendments as new claim versions.',
          'Keep URL-level rows behind every aggregate.',
          'Export gap states and denominators with pass/fail counts.',
          'Link the implementation change and the validating rerun separately.',
          'Mark a finding resolved only against its acceptance contract.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'ai-systems',
    slug: 'replayable-traces-ai-agent-evaluation',
    number: '12',
    category: 'AI EVALUATION',
    title: 'Replayable Traces for Evaluating Tool-Using AI Agents',
    seoTitle: 'Replayable Traces for AI Agent Evaluation',
    subtitle:
      'An evaluation architecture for tasks, trials, observable trajectories, controlled environments, layered graders, repeated runs, and evidence-gated promotion.',
    seoDescription:
      'Evaluate tool-using AI agents with replayable observable traces, controlled environments, layered graders, repeated trials, side-effect checks, and promotion gates.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/replayable-traces-editorial.webp',
      socialSrc: '/images/research/replayable-traces-social.jpg',
      alt: 'A looping monochrome agent trajectory repeatedly crosses tools, observations, records, and graders.',
      label: 'Agent evaluation / replay loop',
      caption: 'Repeated trajectories preserve tools, observations, side effects, and grader evidence as one inspectable loop.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '16 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'An agent score is meaningful only when the task, environment, observable trajectory, side effects, grader versions, and repeated-trial distribution are preserved well enough to inspect and reproduce.',
    evidenceBoundary:
      'A replay can reproduce recorded inputs or simulate an environment boundary; it cannot prove that a stochastic model will emit the same trajectory. Evaluation results apply to the tested agent, tools, models, policies, graders, and environment versions.',
    metrics: [
      { label: 'Unit', value: 'TRIAL' },
      { label: 'Evidence', value: 'OBSERVABLE TRACE' },
      { label: 'Graders', value: 'LAYERED' },
      { label: 'Promotion', value: 'CONTROLLED' },
    ],
    sources: [
      ANTHROPIC_AGENT_EVALS,
      OPENAI_EVALS_API,
      AGENT_REWARD_BENCH,
      TRACE_CONTEXT,
      source(
        'Anthropic: a statistical approach to model evaluations',
        'https://www.anthropic.com/research/statistical-approach-to-model-evals',
      ),
    ],
    content: [
      'A tool-using agent can reach the right final answer through an unsafe path, fail after making a useful partial change, or appear successful because the grader inspected the agent response rather than the external state. Multi-step execution creates more evidence than a prompt and output pair: tool calls, observations, state mutations, retries, costs, policy decisions, and the final environment all matter.',
      'The evaluation system should preserve that observable trajectory as a first-class artifact. Define a task with an initial state and success contract; execute one or more trials in isolated environments; record messages, tool inputs and outputs, state changes, timing, and errors; apply deterministic and model-based graders with versions; and promote changes only when the trial distribution improves without crossing safety, cost, or regression bounds.',
    ],
    sections: [
      {
        id: 'task-trial-trace',
        title: 'Separate the task, trial, and observable trace',
        paragraphs: [
          'A task is the reusable test case: instructions, fixtures, initial environment, permitted actions, success criteria, side-effect limits, budgets, and stop conditions. A trial is one attempt by a specific agent configuration. The trace is the ordered record of observable events produced during that trial. Anthropic uses similar distinctions between task, trial, grader, and transcript in its agent-evaluation guidance.',
          'Give each layer an identifier. A task version changes when fixtures or success criteria change. A trial ID identifies one stochastic attempt with model, prompt, tool, and policy versions. Trace events carry sequence, parent event, time, actor, input reference, output reference, status, and state-delta reference. Correlation IDs can follow calls across services, while trial IDs preserve the evaluation domain.',
          'Capture observable inputs and outputs; do not make hidden chain-of-thought a dependency. Useful evidence includes instructions delivered to the agent, model responses available to the harness, tool schemas, tool calls, tool results, file or database diffs, browser states, policy decisions, errors, tokens, latency, and cost. Sensitive data should be redacted or represented by secure references before traces enter general analytics.',
        ],
        table: {
          caption: 'Agent-evaluation record hierarchy',
          columns: ['Record', 'Stable inputs', 'Variable outputs', 'Version boundary'],
          rows: [
            ['task', 'Fixture, instruction, allowed actions, graders', 'None', 'Change when the test contract changes'],
            ['configuration', 'Model, prompts, tools, policies, budgets', 'None', 'Change for any execution dependency'],
            ['trial', 'Task and configuration IDs, random seed where applicable', 'Outcome, cost, duration, terminal state', 'One attempt only'],
            ['trace event', 'Sequence and parent context', 'Message, tool result, state delta, error', 'Immutable event'],
            ['grade', 'Grader and rubric version', 'Score, labels, evidence references', 'One grader run on one artifact set'],
          ],
        },
      },
      {
        id: 'environment-control',
        title: 'Control the environment or declare what cannot be replayed',
        paragraphs: [
          'A trial depends on more than the agent. APIs change, web pages update, clocks advance, search results move, credentials differ, and shared state leaks between attempts. Isolate each trial in a resettable workspace or account when possible. Seed databases and files from versioned fixtures, freeze or record time inputs, and provide fake external services for deterministic contract tests.',
          'For live dependencies, record the request and response boundary subject to privacy and licensing constraints. A replay can then return the captured response to the same tool call or expose a controlled divergence. This tests harness behavior and downstream decisions, not whether the model will reproduce the same call. Mark live, recorded, simulated, and unavailable dependencies in the trial manifest.',
          'State cleanup is part of correctness. A failed agent may leave a draft, reservation, branch, browser session, or partial database mutation. The harness should snapshot before and after, attribute changes to events, and restore or discard the environment. If cleanup cannot be guaranteed, run in a disposable boundary and treat escape as a critical failure.',
        ],
        bullets: [
          'Create one isolated state namespace per trial.',
          'Pin tool schemas and fixtures with content hashes.',
          'Classify every external dependency as live, recorded, simulated, or blocked.',
          'Capture state before, after, and at consequential actions.',
          'Verify cleanup independently of the agent final message.',
          'Fail the trial if it acts outside the permitted boundary.',
        ],
      },
      {
        id: 'layered-graders',
        title: 'Grade outcomes, process, policy, and side effects separately',
        paragraphs: [
          'A final-answer grader cannot establish that an external action succeeded. Begin with deterministic state graders where the domain permits them: tests pass, expected rows exist, files match a schema, the correct calendar event was created, or no unauthorized message was sent. Add process graders for required or prohibited actions, policy graders for permission boundaries, and resource graders for cost and latency.',
          'Model-based graders are useful when success is semantic or several valid paths exist, but their output is another derived record. Store the grader model, prompt or rubric, evidence supplied, output, and confidence. Calibrate against expert-labeled trajectories and inspect disagreement. AgentRewardBench reports that no single evaluated language-model judge excelled across all included web-agent benchmarks, which is a reason to combine graders rather than appoint one universal judge.',
          'Allow partial and invalid states. A trial can complete the main task but cause an unacceptable side effect; it can fail the outcome because the environment broke; or it can be ungradeable because the trace is incomplete. One scalar score hides those distinctions. Use a result object with outcome, policy, side effects, efficiency, trace integrity, and environment validity.',
        ],
        table: {
          caption: 'Layered agent graders',
          columns: ['Grader', 'Evidence', 'Example result', 'Failure meaning'],
          rows: [
            ['outcome', 'Final environment and artifacts', 'Requested record exists', 'Task not completed'],
            ['process', 'Ordered tool events', 'Required validation ran', 'Success path violated procedure'],
            ['policy', 'Actions and authorization context', 'No external send without approval', 'Boundary breach'],
            ['side effect', 'Before/after state diff', 'Only approved files changed', 'Collateral mutation'],
            ['efficiency', 'Tokens, calls, latency, cost', 'Within declared budget', 'Operational regression'],
            ['trace integrity', 'Event sequence and artifact availability', 'Complete and ordered', 'Result cannot be fully audited'],
          ],
        },
      },
      {
        id: 'repeated-trials',
        title: 'Report distributions across repeated trials',
        paragraphs: [
          'Model outputs and agent paths vary. One passing demonstration is evidence that success is possible, not an estimate of reliability. Run repeated trials for representative tasks, keep the fixture and configuration fixed, and report pass counts with denominators. Stratify by task family and risk so a large set of easy cases does not hide a failure on the consequential path.',
          'Pair baseline and candidate trials when practical by using the same task versions and environment seeds. Report changes in outcome, policy violations, side effects, cost, and latency. Confidence intervals or resampling can communicate uncertainty, but no statistical method repairs a benchmark whose tasks are ambiguous, contaminated, or graded incorrectly.',
          'Inspect traces behind aggregate movement. A candidate can improve a score by exploiting a grader, skipping an expensive safety check, repeating until a flaky state passes, or shifting failure into an unmeasured side effect. Promotion review should sample wins, losses, disagreements, and unusually cheap or expensive trials.',
        ],
        bullets: [
          'Predefine the primary metric and non-negotiable safety metrics.',
          'Use the same task versions for baseline and candidate comparison.',
          'Report numerator, denominator, exclusions, and invalid trials.',
          'Separate task-level variance from repeated attempts on one task.',
          'Review representative traces from every changed outcome class.',
          'Keep benchmark edits out of the comparison window unless rebaselined.',
        ],
      },
      {
        id: 'promotion-gate',
        title: 'Promote the system, not a leaderboard number',
        paragraphs: [
          'An agent configuration includes model, prompts, tool contracts, retrieval, memory, policies, budgets, and harness code. Promote that versioned bundle. A model upgrade can regress because a tool description no longer elicits the intended call; a prompt improvement can increase cost; a stricter policy can reduce nominal success while preventing unsafe completion. The evaluation must preserve those tradeoffs.',
          'Use a staged gate: deterministic contract tests, replay against recorded dependencies, repeated trials in isolated environments, adversarial or policy cases, and a bounded canary where external effects are reversible and observable. Define rollback conditions before the canary. A high average score should never override a critical authorization or destructive-action failure.',
          'The final evidence package should include task manifest, configuration manifest, trial ledger, grade records, aggregate report, selected traces, known gaps, and promotion decision. This makes later debugging possible when production behavior differs. It also keeps the claim narrow: the candidate met the documented gate on the tested distribution at the recorded cutoff.',
        ],
        codeExamples: [
          {
            title: 'A trial manifest that binds configuration to evidence',
            description: 'Every aggregate row can resolve to one task, configuration, trace, and grader set.',
            language: 'json',
            code: [
              '{',
              '  "trial_id": "trial-0184",',
              '  "task": { "id": "publish-draft", "version": "3" },',
              '  "configuration": { "id": "agent-candidate", "version": "7" },',
              '  "environment": { "fixture": "workspace@sha256:...", "network": "recorded" },',
              '  "trace": { "id": "trace-0184", "integrity": "complete" },',
              '  "graders": ["outcome@2", "policy@5", "side-effects@3"],',
              '  "result": { "outcome": "pass", "policy": "pass", "side_effects": "pass" },',
              '  "cost_usd": 0.42,',
              '  "duration_ms": 18420',
              '}',
            ].join('\n'),
          },
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'data-systems',
    slug: 'sqlite-crawl-pipelines',
    number: '13',
    category: 'DATA SYSTEMS',
    title: 'SQLite for Crawl Pipelines: Idempotency, WAL, and Bounded Concurrency',
    seoTitle: 'SQLite Web Crawler Pipelines: Idempotency, WAL, and Concurrency',
    subtitle:
      'A storage architecture for URL identity, append-only attempts, transactional batches, upserts, one-writer discipline, WAL checkpoints, integrity checks, and portable exports.',
    seoDescription:
      'Build reliable SQLite crawl pipelines with stable keys, idempotent writes, append-only attempts, bounded transactions, WAL-aware concurrency, checkpoints, and recovery checks.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/sqlite-pipelines-editorial.webp',
      socialSrc: '/images/research/sqlite-pipelines-social.jpg',
      alt: 'Parallel monochrome data streams converge through a single writer into concentric WAL-like records.',
      label: 'Data systems / single-writer study',
      caption: 'Bounded workers converge on one durable writer while layered records preserve recovery and replay.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '15 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'SQLite works well for bounded crawl and audit systems when the design accepts one-writer semantics, makes every write idempotent, separates immutable attempts from current projections, and operates WAL and checkpoints deliberately.',
    evidenceBoundary:
      'SQLite behavior depends on the linked library version, VFS, filesystem, durability settings, connection pattern, and workload. Official documentation should be rechecked before deployment; WAL is not a shared-database design for independent hosts or a substitute for backups.',
    metrics: [
      { label: 'Writer model', value: 'ONE AT A TIME' },
      { label: 'Write contract', value: 'IDEMPOTENT' },
      { label: 'History', value: 'ATTEMPT-LEVEL' },
      { label: 'Primary artifact', value: 'STABLE DUMP' },
    ],
    sources: [
      SQLITE_TRANSACTIONS,
      SQLITE_UPSERT,
      SQLITE_WAL,
      SQLITE_ATOMIC_COMMIT,
      source('SQLite PRAGMA integrity_check', 'https://www.sqlite.org/pragma.html#pragma_integrity_check'),
    ],
    content: [
      'A crawl workload looks hostile to a small embedded database: many workers finish at unpredictable times, every response creates related rows, retries duplicate logical work, render artifacts arrive later than source artifacts, and reporting queries run while collection continues. The pressure often leads to shared connections, row-by-row commits, replace-style writes, and a current-state table that destroys attempt history.',
      'SQLite can support the workload when the architecture narrows the write boundary. Workers produce immutable result messages. One writer or a small serialized writer service validates those messages, writes bounded transactions, and acknowledges durable commit. Stable uniqueness keys make delivery idempotent. Append-only attempt tables retain what happened; materialized current tables and views make reporting convenient without becoming the only record.',
    ],
    sections: [
      {
        id: 'schema-grain',
        title: 'Define table grain and identity before tuning the database',
        paragraphs: [
          'Each table needs one sentence that defines a row. A crawl_run row is one bounded execution. A url_identity row is one comparison identity under a normalizer version. A discovery_edge row is one observed relation from a source artifact. A fetch_attempt row is one network attempt. A response_artifact row identifies one saved payload. A rule_evaluation row is one rule version applied to one input set. If a table mixes several grains, uniqueness and retries become ambiguous.',
          'Use surrogate IDs for local joins where helpful, but enforce domain uniqueness with explicit constraints. A fetch attempt might be unique on run, URL identity, and attempt number or on a generated attempt ID whose creation is idempotent at the scheduler. An artifact can use a content hash plus storage namespace. A link edge needs source artifact and node identity so repeated template edges remain explainable.',
          'Store normalized fields for queries and immutable raw values for evidence. The normalized canonical target supports grouping; the observed href supports debugging. The parsed status is an integer; response headers can also remain as a hashed raw artifact. Do not rely on a JSON blob for every core relation, and do not discard the JSON when it is the faithful captured form.',
        ],
        table: {
          caption: 'Recommended crawl-storage grains',
          columns: ['Table', 'One row represents', 'Uniqueness anchor'],
          rows: [
            ['crawl_run', 'One bounded execution contract', 'run_id'],
            ['url_identity', 'One comparison key under one normalizer', 'normalizer_version + fetch_key'],
            ['discovery_edge', 'One observed source-to-reference relation', 'run + source artifact + node + observed ref'],
            ['fetch_attempt', 'One request attempt', 'attempt_id or run + URL + sequence'],
            ['artifact', 'One immutable stored payload', 'storage namespace + content hash'],
            ['rule_evaluation', 'One rule version on one input set', 'run + URL + rule + version + input hash'],
          ],
        },
      },
      {
        id: 'transaction-boundary',
        title: 'Make the transaction match the durable unit of work',
        paragraphs: [
          'SQLite automatically starts transactions, but a crawl writer should define them explicitly. One completed fetch commonly creates an attempt update, response metadata, artifact reference, extracted observations, discovered edges, and frontier transitions. If those records describe one durable result, commit them together or design a resumable sequence whose intermediate states are valid.',
          'Avoid one transaction per individual row; it amplifies synchronization overhead. Avoid unbounded transactions for an entire crawl; they hold the writer, grow recovery work, delay visibility, and make failure expensive. Batch by a bounded number of result messages, bytes, or time while retaining a checkpoint that identifies which messages were committed.',
          'Keep database transactions free of network and filesystem work when possible. Store the artifact durably first, then write its immutable reference in a short transaction. If artifact storage fails, the result remains retryable. If the database commit fails, redelivery can safely repeat the message because uniqueness keys prevent duplicate logical records.',
        ],
        bullets: [
          'Begin and end transactions in the writer, not inside unrelated helper functions.',
          'Keep every transaction bounded by records, bytes, and wall time.',
          'Do not wait on HTTP, browser, or remote object storage while holding the writer.',
          'Acknowledge a worker result only after the durable transaction commits.',
          'Record the result-message ID used for deduplication.',
          'Retry SQLITE_BUSY with a bounded policy rather than an infinite loop.',
        ],
      },
      {
        id: 'idempotent-writes',
        title: 'Use upserts to converge, not to erase history',
        paragraphs: [
          'Idempotency means that redelivering the same logical result produces the same durable state. Define a unique key for the message or domain row and use INSERT with ON CONFLICT DO NOTHING when the first committed record must remain immutable. Use DO UPDATE only for a current projection whose update policy is explicit.',
          'Avoid INSERT OR REPLACE for evidence records. Replace behavior can delete and recreate a row, interact with foreign keys, change row identity, and overwrite the first observation. An upsert with a named conflict target and selected columns states which conflict is expected and which values may change.',
          'Guard current-state updates with monotonic conditions. A late attempt should not overwrite a newer terminal attempt merely because its message arrived last. Compare attempt sequence, event time under a documented clock policy, or explicit state version in the update WHERE clause. Keep every attempt row even when the projection rejects it.',
        ],
        codeExamples: [
          {
            title: 'Append the attempt, then advance the current projection conditionally',
            description: 'Duplicate result delivery becomes a no-op, and late attempts cannot move current state backward.',
            language: 'sql',
            code: [
              'BEGIN IMMEDIATE;',
              '',
              'INSERT INTO fetch_attempt (attempt_id, run_id, url_id, sequence, status, artifact_id)',
              'VALUES (:attempt_id, :run_id, :url_id, :sequence, :status, :artifact_id)',
              'ON CONFLICT(attempt_id) DO NOTHING;',
              '',
              'INSERT INTO url_current (run_id, url_id, sequence, status, attempt_id)',
              'VALUES (:run_id, :url_id, :sequence, :status, :attempt_id)',
              'ON CONFLICT(run_id, url_id) DO UPDATE SET',
              '  sequence = excluded.sequence,',
              '  status = excluded.status,',
              '  attempt_id = excluded.attempt_id',
              'WHERE excluded.sequence > url_current.sequence;',
              '',
              'COMMIT;',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'wal-concurrency',
        title: 'Use WAL with an explicit concurrency and checkpoint model',
        paragraphs: [
          'SQLite WAL mode lets readers continue while a writer appends committed changes, but there is still one writer at a time. That is a feature to design around, not a limit to disguise with many competing write connections. Funnel worker results through a writer queue, keep transactions short, set a bounded busy timeout or retry policy, and expose queue age as backpressure.',
          'Readers see a consistent snapshot for their transaction. A long-running report can therefore prevent checkpoint progress and allow the WAL file to grow. Close read transactions promptly, paginate large exports against a deliberate snapshot, and monitor WAL pages plus checkpoint results. The official WAL documentation describes automatic checkpoint behavior and the tradeoff between write latency, read performance, and durability settings.',
          'WAL requires processes sharing a database to operate on the same host because of its shared-memory design; the official documentation warns against using it across a network filesystem. If independent machines need concurrent writes, move the write authority behind a service or use a server database. Copying only the main database while live WAL state exists can also lose committed data, so backup and archive workflows must understand the journal mode.',
        ],
        table: {
          caption: 'SQLite crawl concurrency responsibilities',
          columns: ['Component', 'Responsibility', 'Metric', 'Failure response'],
          rows: [
            ['workers', 'Produce immutable result messages', 'completion and redelivery count', 'Retry delivery, not direct database mutation'],
            ['writer queue', 'Serialize and bound pending work', 'depth and oldest message age', 'Apply collection backpressure'],
            ['writer', 'Validate and commit bounded batches', 'commit latency and busy retries', 'Rollback batch and retry safely'],
            ['readers', 'Use short consistent snapshots', 'transaction duration', 'Cancel or move long export to snapshot copy'],
            ['checkpointer', 'Keep WAL growth controlled', 'WAL pages and checkpoint progress', 'Investigate long readers and write bursts'],
          ],
        },
      },
      {
        id: 'integrity-and-recovery',
        title: 'Operate recovery, integrity, and export as first-class paths',
        paragraphs: [
          'Test interruption at every boundary: before artifact storage, after artifact storage but before database commit, during a batch, after commit but before acknowledgment, and during reporting. The expected result should be either no committed logical change or one complete idempotent result. A recovery test is stronger evidence than assuming atomic commit from ordinary runs.',
          'Run quick or full integrity checks at a cadence appropriate to the workload and before important archives. Verify foreign-key consistency separately when foreign keys are part of the contract. Back up through a supported SQLite backup mechanism or a controlled closed/checkpointed state rather than copying an actively changing file set casually.',
          'Produce stable exports with explicit ordering, schema version, run manifest, row counts, hashes, and gap states. A SQL dump can preserve relational content; CSV and JSON can serve review workflows. Validate that a restored database reproduces the same run counts and key report queries. The archive is complete only when restoration has been exercised.',
        ],
        bullets: [
          'Pin or inventory the actual SQLite library version used in production.',
          'Review current official advisories before relying on WAL behavior.',
          'Exercise crash and duplicate-delivery tests against the writer.',
          'Monitor queue age, commit latency, WAL size, and checkpoint progress.',
          'Run integrity and foreign-key checks before durable archive.',
          'Restore a backup and compare deterministic report hashes.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'technical-seo',
    slug: 'technical-seo-migration-release-gates',
    number: '14',
    category: 'SITE MIGRATIONS',
    title: 'Technical SEO Migrations Need Executable Release Gates',
    seoTitle: 'Technical SEO Migration Checklist: Executable Release Gates',
    subtitle:
      'A fail-closed migration method for URL manifests, redirect graphs, canonical output, internal links, sitemaps, rendered content, launch sequencing, and post-release evidence.',
    seoDescription:
      'Build executable technical SEO migration gates for URL mappings, redirects, canonicals, internal links, sitemaps, rendered content, launch rollout, and monitoring.',
    artwork: {
      kind: 'image',
      heroSrc: '/images/research/migration-gates-editorial.webp',
      socialSrc: '/images/research/migration-gates-social.jpg',
      alt: 'A monochrome corridor of sequential checkpoints governs several converging release paths.',
      label: 'Migration controls / release corridor',
      caption: 'Redirects, canonicals, internal links, and release evidence must pass the same ordered checkpoints.',
    },
    date: PUBLISHED,
    dateModified: PUBLISHED,
    lastVerified: VERIFIED,
    readTime: '16 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'A migration is ready when every important old URL has an approved terminal state, every new canonical route satisfies a page contract, and production evidence proves the mapping after the real edge and application stack.',
    evidenceBoundary:
      'Passing migration gates proves the tested publisher-controlled routing and page signals. It cannot guarantee unchanged rankings, traffic, crawling cadence, index consolidation, or behavior in untested caches, regions, clients, and external systems.',
    metrics: [
      { label: 'Source of truth', value: 'URL MANIFEST' },
      { label: 'Redirect policy', value: 'ONE HOP' },
      { label: 'Launch gate', value: 'FAIL CLOSED' },
      { label: 'Primary artifact', value: 'EVIDENCE LEDGER' },
    ],
    sources: [
      GOOGLE_SITE_MOVES,
      GOOGLE_REDIRECTS,
      GOOGLE_CANONICALS,
      GOOGLE_SITEMAPS,
      GOOGLE_STATUS_CODES,
      HTTP_STANDARD,
    ],
    content: [
      'A site migration changes an address system while users, crawlers, links, analytics, caches, and downstream indexes still refer to the old one. A visual review of the new templates cannot establish that old demand reaches the right destination, that retired URLs stop leaking into navigation, that canonical and sitemap signals agree, or that client-rendered content survived the move.',
      'Treat the migration as a data contract and a release program. Inventory every meaningful old URL, assign one approved outcome, generate routing and metadata from the mapping, test the built site before launch, test the real production stack after launch, and monitor both traffic and coverage gaps. Release only when critical route classes converge; log accepted exceptions with owners and expiry dates.',
    ],
    sections: [
      {
        id: 'url-manifest',
        title: 'Make the URL manifest the migration source of truth',
        paragraphs: [
          'Begin with more than a crawl. Merge canonical sitemaps, internal crawl results, server logs, analytics landing pages, Search Console exports, backlink lists, CMS or database routes, feeds, campaign records, and known files. Each source has blind spots. Record where every old URL was observed and the latest meaningful activity so missing inventory remains visible.',
          'Assign one disposition: keep at the same URL, move to an equivalent new URL, merge into a reviewed parent or successor, remove with a terminal not-found or gone response, retain temporarily with a sunset date, or exclude because it is non-public or invalid. A wildcard redirect to the homepage is not a mapping; it hides unresolved product decisions and produces poor destinations.',
          'The manifest should carry content type, locale, template, indexability, canonical target, redirect status, priority, owner, validation contract, and exception rationale. Unique constraints must prevent one old URL from owning several outcomes and several new pages from accidentally claiming one route. Changes require review because the manifest drives public behavior.',
        ],
        table: {
          caption: 'Migration URL-manifest fields',
          columns: ['Field', 'Purpose', 'Gate'],
          rows: [
            ['old_url', 'Known pre-migration identity', 'Unique and source-attributed'],
            ['disposition', 'Keep, move, merge, remove, temporary, exclude', 'Allowed enum with rationale'],
            ['new_url', 'Approved destination when applicable', 'Canonical route exists'],
            ['response_contract', 'Expected status and hop behavior', 'Matches production'],
            ['page_contract', 'Required title, content, directives, schema', 'Built and rendered checks pass'],
            ['owner_and_expiry', 'Accountability for exception', 'No unowned permanent exception'],
          ],
        },
      },
      {
        id: 'prelaunch-gates',
        title: 'Validate route and page contracts before launch',
        paragraphs: [
          'Generate the application route registry, redirect configuration, canonical metadata, sitemap, internal links, and where possible analytics mappings from the manifest. Static validation should reject duplicate destinations, alias collisions, redirect cycles, non-absolute canonical targets, staging hosts, malformed URLs, noindex pages in the canonical sitemap, and internal links that still target retired routes.',
          'Build every priority template and parse its output. Assert one main heading, expected canonical, intended robots directives, meaningful visible content, status behavior, structured-data agreement, and required navigation. For JavaScript applications, compare raw source with a pinned browser render and enforce page-specific completion conditions. A screenshot is a supplementary review, not the route contract.',
          'Sample size should follow risk and template coverage. Critical and high-traffic URLs deserve complete checks. Long-tail pages can be stratified by template, locale, disposition, depth, query behavior, and data source. Keep the full manifest count as the denominator and identify untested rows explicitly.',
        ],
        bullets: [
          'Fail on unmapped priority URLs and duplicate old-route ownership.',
          'Fail on redirect loops, chains beyond policy, and destinations that do not exist.',
          'Fail on staging, preview, localhost, or alternate-host canonicals.',
          'Fail on canonical sitemap rows that redirect, noindex, or canonicalize elsewhere.',
          'Fail when required visible content or structured data disappears from a template.',
          'Report untested manifest rows as coverage gaps.',
        ],
      },
      {
        id: 'redirect-graph',
        title: 'Compile redirects into a convergent graph',
        paragraphs: [
          'Permanent server-side redirects are the clearest choice for URL moves when the change is intended to persist, and Google documents 301 and 308 as permanent redirect signals. Select the status according to application method semantics and platform support. Test with actual request methods where non-GET traffic matters; do not assume every redirect code preserves behavior identically.',
          'Resolve the complete mapping graph before deployment. Every moved old URL should reach the exact approved new URL in one hop when possible. Existing redirects must be folded into the new map so historical aliases do not chain through an intermediate old route. Cycles, branches with conflicting destinations, and targets that redirect again should fail compilation.',
          'Keep removed content honest. When no equivalent destination exists, a 404 or 410 can communicate removal more accurately than sending every retired article or product to a category or homepage. The product owner should decide equivalence; automated string similarity can identify candidates but should not silently merge user intent.',
        ],
        table: {
          caption: 'Redirect-graph validation',
          columns: ['Check', 'Expected result', 'Failure risk'],
          rows: [
            ['old to new', 'One permanent hop to approved equivalent', 'Slow convergence and fragile chains'],
            ['historical aliases', 'Point directly to current canonical', 'Layered migrations accumulate'],
            ['target status', 'Eligible final response', 'Redirect ends at error, noindex, or another redirect'],
            ['target content', 'Matches intended user purpose', 'Soft, misleading, or irrelevant destination'],
            ['cycle analysis', 'No strongly connected redirect component', 'Infinite or failed navigation'],
            ['method behavior', 'Documented for non-GET routes', 'Unexpected request transformation'],
          ],
        },
      },
      {
        id: 'launch-sequence',
        title: 'Launch in a sequence that keeps evidence attributable',
        paragraphs: [
          'Freeze manifest changes before the launch window and record the exact application, edge, redirect, sitemap, and analytics versions. Capture a prelaunch baseline of old URL responses, top templates, internal graph, sitemap counts, and relevant traffic. The baseline is not a promise that metrics remain constant; it is the reference needed to distinguish expected movement from implementation breakage.',
          'Deploy the routing and new pages as one coordinated change or in an order that never leaves old URLs without their intended outcome. Purge or version caches deliberately. Fetch smoke routes from outside the origin network across the public hostname, because local application checks cannot prove CDN rules, platform redirects, TLS, host normalization, or middleware behavior.',
          'Use a canary when the platform permits bounded route or traffic exposure, but ensure the canary is meaningful for crawlers and public URLs. Define rollback triggers for elevated 5xx responses, redirect loops, missing content, canonical-host corruption, analytics loss, or critical transaction failure. Rollback should restore a coherent route set, not only the visual frontend.',
        ],
        codeExamples: [
          {
            title: 'Check redirect hops and final canonical from the public edge',
            description: 'Run against a reviewed manifest sample and save headers and bodies as launch evidence.',
            language: 'shell',
            code: [
              'curl -sS -D old.headers -o /dev/null https://old.example.com/priority-page',
              'curl -sS -L --max-redirs 5 -D chain.headers \\',
              '  -o final.html https://old.example.com/priority-page',
              '',
              "rg -o '<link[^>]+rel=\"canonical\"[^>]+>' final.html",
              "rg -o '<meta[^>]+name=\"robots\"[^>]+>' final.html",
            ].join('\n'),
          },
        ],
      },
      {
        id: 'postlaunch-evidence',
        title: 'Monitor implementation health and external transition separately',
        paragraphs: [
          'Implementation monitoring starts immediately: response distribution by old and new route class, redirect outcomes, 404 and 410 volume, server errors, latency, canonical mismatches, sitemap fetches, internal links to retired URLs, rendered-content failures, analytics continuity, and conversion-path health. These are publisher-controlled conditions with short feedback loops.',
          'External transition monitoring has different timing and uncertainty: crawler requests, indexed URL examples, submitted versus discovered sitemap states, canonical selection reports, impressions, clicks, and landing-page movement. Google notes that site moves take time and crawl frequency is not fixed. Report changes with dates and denominators; do not convert a temporary traffic move into proof of a technical defect without route evidence.',
          'Keep an incident ledger that links each anomaly to manifest rows, production captures, owner, decision, fix, and validating rerun. Maintain redirects long enough for users and systems that still reference old URLs, subject to current guidance and product constraints. Remove them only through another reviewed change, not because the launch window ended.',
        ],
        table: {
          caption: 'Post-launch evidence lanes',
          columns: ['Lane', 'Examples', 'Decision horizon', 'Claim boundary'],
          rows: [
            ['routing health', 'status, hop, loop, target', 'minutes to hours', 'Public edge behavior'],
            ['page integrity', 'canonical, directives, content, schema', 'minutes to days', 'Tested templates and routes'],
            ['discovery', 'sitemap fetches and crawler logs', 'days to weeks', 'Observed requests only'],
            ['external index', 'reported indexed and selected URLs', 'days to longer', 'Provider-reported samples and states'],
            ['search demand', 'impressions, clicks, landing pages', 'weeks with seasonality context', 'Observed performance, not sole causal proof'],
            ['business path', 'analytics and conversion events', 'immediate and ongoing', 'Measured implementation path'],
          ],
        },
      },
    ],
  },
];
