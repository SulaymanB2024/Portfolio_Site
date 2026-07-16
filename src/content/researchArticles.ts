import type { ResearchArticle } from './articleModels';
import {
  AI_MANAGER_SOURCES,
  AI_MANAGERS_ARTICLE_DESCRIPTION,
  AI_MANAGERS_ARTICLE_READ_TIME,
  AI_MANAGERS_ARTICLE_SEO_TITLE,
  AI_MANAGERS_ARTICLE_SLUG,
  AI_MANAGERS_ARTICLE_TITLE,
} from './aiManagersArticle';

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    kind: 'research',
    cluster: 'ai-systems',
    slug: AI_MANAGERS_ARTICLE_SLUG,
    number: '04',
    category: 'AI SYSTEMS',
    title: AI_MANAGERS_ARTICLE_TITLE,
    seoTitle: AI_MANAGERS_ARTICLE_SEO_TITLE,
    subtitle: AI_MANAGERS_ARTICLE_DESCRIPTION,
    seoDescription: AI_MANAGERS_ARTICLE_DESCRIPTION,
    image: '/images/articles/ai-managers-operator-workflow.jpg',
    date: '2026.07.14',
    dateModified: '2026.07.14',
    lastVerified: '2026.07.14',
    readTime: AI_MANAGERS_ARTICLE_READ_TIME,
    author: 'SULAYMAN BOWLES',
    thesis:
      'When a general-purpose assistant gets operational authority, its conversational habits stop being style and start becoming business policy.',
    evidenceBoundary:
      'Operator dashboards and financial reconstructions are unaudited. Simulations are controlled behavior evidence, not commercial businesses. Human legal, financial, physical, and supervisory work remains part of every live case.',
    metrics: [
      { label: 'Cases reviewed', value: '30' },
      { label: 'Published sources', value: String(AI_MANAGER_SOURCES.length) },
      { label: 'Grade A live cases', value: '4' },
      { label: 'Audited autonomy proofs', value: '0' },
    ],
    sources: AI_MANAGER_SOURCES.filter((source) => source.href.startsWith('http')).map((source) => ({
      label: source.label,
      href: source.href,
      lastVerified: '2026.07.14',
    })),
    content: [
      'The first public AI-operated shops are not synthetic companies with software owners. They are bounded systems inside human institutions: a boutique, a café, vending machines, radio stations, production agents, and simulated markets.',
      'Across the strongest cases, models can complete the next action but struggle to preserve a coherent operating policy. The article separates real operations from pilots and simulations, makes the human layer visible, and keeps revenue, margin, and fully burdened profit distinct.',
    ],
  },
  {
    kind: 'research',
    cluster: 'ai-crawlers',
    slug: 'ai-search-crawler-policy',
    number: '01',
    category: 'CRAWLER POLICY',
    title: 'AI Crawler Robots.txt Guide: GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot',
    seoTitle: 'AI Crawler Robots.txt Guide: GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot',
    subtitle: 'Allow: / and Disallow: / for eight named tokens; copy, publish, curl, and zgrep.',
    seoDescription:
      'Compare OpenAI, Anthropic, and Perplexity crawler user agents, then copy robots.txt policies for allowing AI search, blocking training, or blocking named AI agents.',
    image: '/images/articles/ai-crawler-compute-landscape.jpg',
    date: '2026.06.19',
    dateModified: '2026.07.14',
    lastVerified: '2026.07.14',
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'One host, one product token, one explicit directive.',
    evidenceBoundary:
      'This guide documents published crawler controls as verified on July 14, 2026. A robots.txt rule expresses policy; it does not secure private content, authenticate a bot, or prove indexing, ranking, training exclusion, or answer-system citation.',
    metrics: [
      { label: 'Agents compared', value: '8 USER AGENTS' },
      { label: 'Policies', value: '2 COPY-READY' },
      { label: 'Last verified', value: '2026.07.14' },
      { label: 'Primary artifact', value: 'ROBOTS POLICY' },
    ],
    sources: [
      { label: 'OpenAI crawler documentation', href: 'https://developers.openai.com/api/docs/bots', lastVerified: '2026.07.14' },
      {
        label: 'Anthropic crawler guidance',
        href: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
        lastVerified: '2026.07.14',
      },
      { label: 'Perplexity crawler documentation', href: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers', lastVerified: '2026.07.14' },
      { label: 'Google robots.txt introduction and limitations', href: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro', lastVerified: '2026.07.14' },
      { label: 'OpenAI OAI-SearchBot IP ranges', href: 'https://openai.com/searchbot.json', lastVerified: '2026.07.14' },
      { label: 'OpenAI GPTBot IP ranges', href: 'https://openai.com/gptbot.json', lastVerified: '2026.07.14' },
      { label: 'OpenAI ChatGPT-User IP ranges', href: 'https://openai.com/chatgpt-user.json', lastVerified: '2026.07.14' },
      { label: 'Anthropic bot IP ranges', href: 'https://claude.com/crawling/bots.json', lastVerified: '2026.07.14' },
      { label: 'PerplexityBot IP ranges', href: 'https://www.perplexity.ai/perplexitybot.json', lastVerified: '2026.07.14' },
      { label: 'Perplexity-User IP ranges', href: 'https://www.perplexity.ai/perplexity-user.json', lastVerified: '2026.07.14' },
    ],
    content: [
      '/robots.txt is a host-scoped text file. Match the exact case-sensitive product token, then assign Allow: / or Disallow: /. Preserve the correct Sitemap line.',
      'Release sequence: outcome → token → group → file merge → production fetch → access-log check.',
    ],
    sections: [
      {
        id: 'outcome-matrix',
        title: 'Choose the policy outcome before choosing a user-agent',
        paragraphs: [
          'Choose one row before editing the file.',
        ],
        table: {
          caption: 'Outcome-to-user-agent decision matrix',
          columns: ['Operator outcome', 'Token group', 'Rule', 'Release check'],
          rows: [
            ['AI answer discovery', 'OAI-SearchBot, Claude-SearchBot, PerplexityBot', 'Allow: /', '/robots.txt returns the intended groups'],
            ['Model-development opt-out', 'GPTBot, ClaudeBot', 'Disallow: /', 'Release time and provider guidance saved'],
            ['User-opened URLs', 'ChatGPT-User, Claude-User, Perplexity-User', 'Provider-specific choice', 'Request type classified correctly'],
            ['Private files', 'Every client', 'Authentication or edge authorization', 'Unauthenticated request denied'],
          ],
        },
      },
      {
        id: 'crawler-comparison',
        title: 'AI crawler comparison table',
        paragraphs: [
          'Target the stable token, not a versioned HTTP header.',
        ],
        table: {
          caption: 'Published AI crawler roles and robots.txt behavior, last verified July 14, 2026',
          columns: ['Provider', 'Exact token', 'Mode', 'robots.txt', 'Operator note', 'Verified'],
          rows: [
            ['OpenAI', 'OAI-SearchBot', 'Search', 'Supported', 'Answer-discovery token', '2026-07-14'],
            ['OpenAI', 'GPTBot', 'Model development', 'Supported', 'Training opt-out token', '2026-07-14'],
            ['OpenAI', 'ChatGPT-User', 'User request', 'May not apply', 'Not an automatic-index token', '2026-07-14'],
            ['Anthropic', 'Claude-SearchBot', 'Search', 'Honored', 'Claude search token', '2026-07-14'],
            ['Anthropic', 'ClaudeBot', 'Model development', 'Honored', 'Training token', '2026-07-14'],
            ['Anthropic', 'Claude-User', 'User request', 'Honored', 'User-opened URL token', '2026-07-14'],
            ['Perplexity', 'PerplexityBot', 'Search', 'Supported', 'Search token; not training', '2026-07-14'],
            ['Perplexity', 'Perplexity-User', 'User request', 'Generally ignored', 'User-requested fetch token', '2026-07-14'],
          ],
        },
      },
      {
        id: 'robots-configurations',
        title: 'Copy-and-paste robots.txt configurations',
        paragraphs: [
          'Merge one template with the host’s existing search-engine, media, private-path, and sitemap groups. Replace the example sitemap hostname before release.',
        ],
        codeExamples: [
          {
            title: 'Allow AI search but block training',
            description: 'Allows search-oriented and user-triggered access while blocking the two published training/model-development agents in this guide.',
            language: 'robots.txt',
            code: [
              'User-agent: OAI-SearchBot',
              'Allow: /',
              '',
              'User-agent: GPTBot',
              'Disallow: /',
              '',
              'User-agent: ChatGPT-User',
              'Allow: /',
              '',
              'User-agent: Claude-SearchBot',
              'Allow: /',
              '',
              'User-agent: ClaudeBot',
              'Disallow: /',
              '',
              'User-agent: Claude-User',
              'Allow: /',
              '',
              'User-agent: PerplexityBot',
              'Allow: /',
              '',
              'User-agent: Perplexity-User',
              'Allow: /',
              '',
              'Sitemap: https://example.com/sitemap.xml',
            ].join('\n'),
          },
          {
            title: 'Block all AI crawlers',
            description: 'Blocks every AI-related agent named in this guide. No static list can cover every crawler, ChatGPT-User rules may not apply, and Perplexity-User generally ignores robots.txt, so enforce sensitive-content controls at authentication or the server edge.',
            language: 'robots.txt',
            code: [
              'User-agent: OAI-SearchBot',
              'Disallow: /',
              '',
              'User-agent: GPTBot',
              'Disallow: /',
              '',
              'User-agent: ChatGPT-User',
              'Disallow: /',
              '',
              'User-agent: Claude-SearchBot',
              'Disallow: /',
              '',
              'User-agent: ClaudeBot',
              'Disallow: /',
              '',
              'User-agent: Claude-User',
              'Disallow: /',
              '',
              'User-agent: PerplexityBot',
              'Disallow: /',
              '',
              'User-agent: Perplexity-User',
              'Disallow: /',
            ].join('\n'),
          },
        ],
      },
      {
        id: 'server-log-verification',
        title: 'Verify deployment with server logs',
        paragraphs: [
          'Fetch each production /robots.txt endpoint and compare the returned group with the committed file. Then run the log filter below against current and rotated NGINX files. A matching token is only a claim, so check the address against the provider’s linked JSON range before attributing the request.',
        ],
        bullets: [
          'Expected response: HTTP 200, text/plain, intended group, correct sitemap hostname.',
          'Useful fields: timestamp, host, path, status, source address, complete User-Agent.',
          'Interpretation rule: absence from the log does not prove a block succeeded.',
        ],
        codeExamples: [
          {
            title: 'Find the named agents in NGINX logs',
            description: 'Adjust the log path for your server or CDN export. This reads current and rotated gzip logs without changing them.',
            language: 'shell',
            code: [
              "zgrep -hEi 'OAI-SearchBot|GPTBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User' /var/log/nginx/access.log*",
              '',
              "curl -sS -D - https://example.com/robots.txt -o /dev/null",
            ].join('\n'),
          },
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'search-console',
    slug: 'technical-seo-public-data-infrastructure',
    number: '02',
    category: 'DATA INFRASTRUCTURE',
    title: 'Technical SEO as Public Data Infrastructure',
    seoTitle: 'Technical SEO as Data Infrastructure',
    subtitle: 'A systems essay on how URLs become crawlable, renderable, attributable, and exportable public records.',
    seoDescription:
      'A systems essay by Sulayman Bowles on URL discovery, crawling, rendering, structured records, provenance, crawl evidence, and durable technical SEO exports.',
    image: '/images/articles/public-data-record-layers.jpg',
    date: '2026.06.19',
    dateModified: '2026.07.16',
    lastVerified: '2026.07.16',
    readTime: '14 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'Technical SEO becomes infrastructure when every important URL can move through a traceable pipeline from discovery to rendered evidence and reusable output.',
    evidenceBoundary:
      'The data-infrastructure comparison describes operating discipline. It does not make a website equivalent to a regulated filing system or guarantee crawling, indexing, ranking, citation, or traffic.',
    metrics: [
      { label: 'Pipeline stages', value: '05' },
      { label: 'Observed states', value: 'RAW + RENDERED' },
      { label: 'Primary artifact', value: 'DATA CONTRACT' },
    ],
    sources: [
      { label: 'Google crawling and indexing overview', href: 'https://developers.google.com/search/docs/crawling-indexing', lastVerified: '2026.07.16' },
      { label: 'Google JavaScript SEO basics', href: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics', lastVerified: '2026.07.16' },
      { label: 'Google structured data introduction', href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data', lastVerified: '2026.07.16' },
      { label: 'Google sitemap construction guidance', href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap', lastVerified: '2026.07.16' },
      { label: 'SEC EDGAR public data APIs', href: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces', lastVerified: '2026.07.16' },
      { label: 'Atlas open-corpus demonstration', href: '/atlas/sample-crawl', lastVerified: '2026.07.16' },
    ],
    content: [
      'A publication system produces addressable records. DNS and routing assign an address; the server emits a source snapshot; browser execution may create another state; extractors normalize fields; and exports carry those fields into review tools. Calling every state “the page” hides where information changed or disappeared.',
      'Technical SEO becomes a data-infrastructure problem when each transformation has an input, output, timestamp, identifier, and owner. The useful question is whether a public claim can move from nominated address to captured artifact without losing its lineage. That frame turns an ambiguous visibility complaint into a diagnosable record-flow failure.',
    ],
    sections: [
      {
        id: 'public-record-pipeline',
        title: 'The public-record pipeline has five distinct stages',
        paragraphs: [
          'Nomination is the entry condition. An internal relation, sitemap row, external reference, feed item, redirect target, or earlier run can place an address into scope. Store that origin as data. It explains why one route entered the inventory and another did not; a sitemap declaration alone does not establish architectural reachability.',
          'Capture creates a transport artifact containing the requested and resolved addresses, status, headers, body, timing, and failure state. Browser execution creates a related artifact rather than silently replacing the first one. Assets, APIs, consent layers, and runtime capabilities can all change the second state.',
          'Normalization and export come last. Directives, links, headings, typed metadata, and visible claims must retain the artifact and rule from which they were derived. A review table is trustworthy only when a reader can move from a labeled row back to the captured input.',
        ],
        table: {
          caption: 'URL-to-evidence pipeline',
          columns: ['Stage', 'Minimum record', 'Failure question'],
          rows: [
            ['URL', 'Normalized address and discovery source', 'Was the intended route ever nominated or linked?'],
            ['Crawl', 'Status, headers, source body, timestamp, fetch state', 'Did the server return a usable public document?'],
            ['Render', 'Rendered DOM, discovered links, asset and console state', 'Did client execution materially change the record?'],
            ['Structure', 'Directives, metadata, headings, schema, content fields', 'Do machine-readable claims match visible content?'],
            ['Evidence export', 'Observation, derivation, confidence, route, run, artifact', 'Can another reviewer reproduce the finding?'],
          ],
        },
      },
      {
        id: 'raw-rendered-states',
        title: 'Raw source and rendered output answer different questions',
        paragraphs: [
          'The source snapshot is the transport ledger: status, headers, redirects, markup, and server-provided content at a recorded time. It is the correct artifact for diagnosing delivery failures and fields that existed before any client execution.',
          'The executed snapshot records the document after scripts and dependent requests settle in a named environment. Google describes rendering as a separate processing stage for JavaScript pages. The useful measurement is therefore the delta between snapshots: added and removed links, headings, claims, directives, fields, and errors.',
          'A screenshot is not that delta. The execution record also needs browser version, timeout, console state, failed dependencies, and completeness status. Otherwise a partial render can be mistaken for a complete public record.',
        ],
      },
      {
        id: 'structured-records',
        title: 'Structured data is a typed view of visible evidence',
        paragraphs: [
          'Structured data serializes selected page fields into a predictable shape. A Dataset record can expose distribution formats, measurement dates, and licensing; a SoftwareApplication record can declare operating context and category. The serialization should be generated from the same fields that produce the visible table or product description.',
          'Typed output also forces decisions about units, enumerations, identifiers, and missing values. SEC data APIs offer a useful analogy because extracted XBRL facts remain tied to a filing period and unit. A website has no comparable regulatory status, but its exports still benefit from explicit grain and machine-checkable field definitions.',
          'Mismatch is more dangerous than omission. If the JSON-LD, visible table, CSV, and route metadata disagree on a date, count, unit, or identifier, downstream consumers receive competing values. Repair the shared source field and regenerate every representation rather than patching each output independently.',
        ],
      },
      {
        id: 'atlas-case-study',
        title: 'Atlas demonstrates the pipeline on an open corpus',
        paragraphs: [
          'The Atlas open-corpus demonstration uses run ID quotes-to-scrape-2026-07-16 and two declared seeds: the static Quotes to Scrape route and its JavaScript variant. The JSON manifest records the capture time, bounded direct-HTTPS method, claim limit, and row payload. The CSV repeats the address-level fields in a form that can be filtered without discarding the manifest.',
          'Both responses returned status 200, but they exposed different source states. The static route contained ten quote cards in its captured markup. The JavaScript route contained zero source quote cards and ten embedded runtime data records used by a client-side loop. Each row also retains the next-page address, canonical state, confidence, and a note explaining the count.',
          'Those values support a narrow comparison of delivery states; they do not establish search performance or a defect in the corpus. The row can be reproduced from its seed, capture time, and method, while any later label remains a separate interpretation. This is the practical value of lineage: a reviewer can disagree with the finding without losing the underlying artifact.',
        ],
        table: {
          caption: 'Atlas open-corpus record: observation versus derivation',
          columns: ['Layer', 'Example field', 'Allowed conclusion'],
          rows: [
            ['Captured source', 'HTTP status, source body, response time', 'What the fetch returned at the recorded time'],
            ['Rendered state', 'DOM delta, discovered paths, browser errors', 'What changed in the tested browser environment'],
            ['Derived review', 'Finding label, confidence, affected route', 'A versioned interpretation of captured fields'],
            ['Artifact', 'Run ID, CSV row, JSON manifest, capture method', 'How the reviewer can locate and reproduce the record'],
            ['Gap state', 'Skipped provider, challenge page, failed render', 'Coverage is incomplete; no normal health claim follows'],
          ],
        },
      },
      {
        id: 'data-quality-contract',
        title: 'A technical audit needs a data-quality contract',
        paragraphs: [
          'Before scoring a site, the audit should define its grain and completeness rules. One row might represent a requested URL, a final response, a rendered page, or a normalized canonical document. Mixing those grains creates duplicate counts, broken joins, and misleading percentages. Required fields should be named, and absent values should distinguish not observed, not applicable, blocked, failed, and truly empty.',
          'Freshness also belongs in the contract. A sitemap captured today and a rendered page from last month should not silently appear in one current-state table. Timestamps, run identifiers, model or renderer versions, and source hashes make drift visible. Reproducible output is less about freezing the web than about declaring exactly which version of the web the report describes.',
        ],
        table: {
          caption: 'Minimum quality checks before a finding is publishable',
          columns: ['Quality dimension', 'Check', 'Unsafe shortcut'],
          rows: [
            ['Completeness', 'Required capture fields and explicit gap states', 'Treating null as proof that a feature is absent'],
            ['Uniqueness', 'One declared row grain with duplicate-key checks', 'Counting requested, redirected, and canonical URLs as peers'],
            ['Consistency', 'Visible content, metadata, schema, and exports agree', 'Validating each representation in isolation'],
            ['Freshness', 'Capture time, run ID, hashes, and tool version retained', 'Combining observations from different collection windows'],
            ['Integrity', 'Every finding links back to supporting observations', 'Publishing labels without reproducible source rows'],
          ],
        },
      },
      {
        id: 'publication-standard',
        title: 'The deliverable is a reviewable public record',
        paragraphs: [
          'The strongest technical SEO output is not the largest issue list. It is a compact system in which priority pages are reachable, raw and rendered states are inspectable, machine-readable fields agree with visible content, and every recommendation can be traced to a captured observation. That operating standard supports engineering handoff because developers can verify the same conditions after a repair ships.',
          'Distribution remains downstream. A clean pipeline can make information eligible to be processed and easier to audit; it cannot force an index, ranking system, or answer product to use the page. The value of the infrastructure frame is narrower and more practical: it makes the site less ambiguous to operate and makes claims about its state easier to defend.',
        ],
        bullets: [
          'Nominate important routes through crawlable internal links and a canonical sitemap.',
          'Capture transport and rendered states separately, with timestamps and failure reasons.',
          'Generate metadata and structured records from the same visible source fields.',
          'Keep observations, derived findings, confidence, and measurement gaps in separate columns.',
          'Ship CSV or JSON artifacts that retain route, run, source, and calculation lineage.',
          'Rerun the same checks after implementation before declaring the repair complete.',
        ],
      },
    ],
  },
  {
    kind: 'research',
    cluster: 'personal-seo',
    slug: 'canonical-identity-personal-seo',
    number: '03',
    category: 'ENTITY CONSISTENCY',
    title: 'Canonical Identity Beats More Content',
    seoTitle: 'Canonical Identity for Personal SEO',
    subtitle: 'An operational playbook for reconciling domains, profile pages, resumes, sameAs links, and external biographies.',
    seoDescription:
      'A practical personal-identity reconciliation playbook covering canonical hosts, ProfilePage schema, sameAs eligibility, resume PDFs, and external profile maintenance.',
    image: '/images/articles/canonical-identity-graph.jpg',
    date: '2026.06.19',
    dateModified: '2026.07.16',
    lastVerified: '2026.07.16',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    thesis:
      'A personal identity graph becomes trustworthy when one profile record owns each fact and every external reference either agrees with it or clearly represents history.',
    evidenceBoundary:
      'This playbook improves consistency among controlled and observable profiles. It cannot force third-party platforms to update, remain public, or be interpreted as identity evidence by a search system.',
    metrics: [
      { label: 'Primary artifact', value: 'RECONCILIATION LOG' },
      { label: 'Decision layers', value: '06' },
      { label: 'Review cadence', value: 'QUARTERLY' },
    ],
    sources: [
      { label: 'Google canonical URL guidance', href: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls', lastVerified: '2026.07.16' },
      { label: 'Google redirects guidance', href: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects', lastVerified: '2026.07.16' },
      { label: 'Google ProfilePage structured data', href: 'https://developers.google.com/search/docs/appearance/structured-data/profile-page', lastVerified: '2026.07.16' },
      { label: 'Schema.org Person', href: 'https://schema.org/Person', lastVerified: '2026.07.16' },
      { label: 'Schema.org sameAs', href: 'https://schema.org/sameAs', lastVerified: '2026.07.16' },
      { label: 'Schema.org ProfilePage', href: 'https://schema.org/ProfilePage', lastVerified: '2026.07.16' },
    ],
    content: [
      'Personal SEO often fails when biographies disagree. A portfolio, resume PDF, university page, GitHub profile, LinkedIn page, competition account, old domain, and copied speaker bio can name different titles, employers, graduation dates, projects, or official websites.',
      'The remedy is reconciliation. Designate which controlled profile owns the current biography, experience, and education; classify outside profiles by role; and decide what should happen to stale URLs. Publish more only after the identity surface has one clear authority.',
    ],
    sections: [
      {
        id: 'profile-inventory',
        title: 'Map the biographies before writing another one',
        paragraphs: [
          'Collect the preferred website, HTML resume, public PDF, GitHub, LinkedIn, portfolio accounts, institutional biographies, event programs, press mentions, and abandoned domains. Compare the displayed name, headline, employer, education date, project ownership, and preferred homepage.',
          'Label each item by purpose. The canonical biography states the present; supporting profiles corroborate it; historical pages document dated events; and stale controlled pages need repair. Private, deleted, or weakly matching profiles stay unresolved.',
        ],
        table: {
          caption: 'Profile inventory fields',
          columns: ['Field', 'Decision it supports', 'Example state'],
          rows: [
            ['URL and owner', 'Can this record be edited or redirected?', 'Controlled / third party'],
            ['Profile role', 'What is the page allowed to establish?', 'Canonical / supporting / historical'],
            ['Visible identity', 'Does the name and headline match the intended person?', 'Match / partial / conflict'],
            ['Freshness', 'Is the content expected to describe the present?', 'Current / dated history / unknown'],
            ['Action', 'What should happen next?', 'Keep / update / redirect / omit / monitor'],
          ],
        },
      },
      {
        id: 'canonical-host',
        title: 'Select one host and one current profile thesis',
        paragraphs: [
          'The preferred domain should resolve consistently across protocol and hostname variants. Permanently redirect duplicate hosts and retired controlled routes when they have one destination. Align redirects, canonical annotations, sitemaps, and internal links instead of asking one signal to overrule a contradictory site.',
          'The canonical thesis is the approved set of current facts from which the homepage, about page, resume, and metadata draw: what the person does, which projects or institutions matter, and where proof can be inspected. It need not be copied word for word.',
        ],
        table: {
          caption: 'Canonical-host decision tree',
          columns: ['Observed state', 'Action', 'Expected result'],
          rows: [
            ['Alternate host contains the same site', 'Permanently redirect to the preferred host', 'One hostname receives internal and external references'],
            ['Old controlled route has a direct replacement', 'Permanently redirect to the closest current page', 'Existing links reach the maintained record'],
            ['Duplicate page must remain available', 'Declare the preferred URL and link internally to it', 'Signals consistently favor one version'],
            ['Historical page documents a real past event', 'Keep dated context; do not rewrite it as a current profile', 'History remains legible without competing with the present'],
          ],
        },
      },
      {
        id: 'sameas-rubric',
        title: 'Use sameAs only for unambiguous identity matches',
        paragraphs: [
          'Treat sameAs as an identity-equivalence assertion: the destination represents this person, functions as that person’s profile or homepage, is publicly inspectable, and contains no material contradiction. All four conditions should be true before the URL enters Person markup.',
          'A page that merely mentions the person fails the profile-function test. Articles, programs, employer pages, repositories, and schedules belong in visible citations, subjectOf relationships, project markup, or editorial context instead.',
        ],
        table: {
          caption: 'sameAs eligibility rubric',
          columns: ['Test', 'Include when', 'Exclude when'],
          rows: [
            ['Identity', 'The destination unambiguously represents the same person', 'The name is shared or the connection is inferred'],
            ['Access', 'A reviewer can inspect the profile without privileged access', 'The page is private, deleted, blocked, or empty'],
            ['Agreement', 'Core current facts do not materially conflict', 'Employer, role, location, or ownership is misleading'],
            ['Profile function', 'The destination is a profile or official homepage', 'The destination merely mentions the person'],
            ['Maintenance', 'The link is reviewed and still expected to persist', 'The account was abandoned or transferred'],
          ],
        },
      },
      {
        id: 'resume-policy',
        title: 'Make HTML the maintained resume and PDF the portable copy',
        paragraphs: [
          'An HTML resume is easier to update, link, and connect to the site. Semantic headings, current project links, profile information, and a modification date make it the maintained record for website readers.',
          'The PDF remains useful for applications and offline sharing. Give the current file one stable URL, redirect obsolete controlled filenames, and avoid leaving dated PDFs public with incompatible facts.',
        ],
        bullets: [
          'Treat the HTML route as the current, maintainable experience and education record.',
          'Publish one stable PDF URL rather than creating a new public filename for each revision.',
          'Check that the visible PDF facts match the HTML record before release.',
          'Redirect known retired filenames instead of allowing silent duplicate copies.',
          'Keep private application variants outside the public web surface.',
        ],
      },
      {
        id: 'external-reconciliation',
        title: 'Reconcile external profiles by priority and controllability',
        paragraphs: [
          'Update controlled profiles in the order reviewers are likely to encounter them: preferred website, LinkedIn, GitHub, then major portfolio accounts. Institutional and event pages may require another owner; record the request date, and preserve accurate historical context.',
          'When a platform cannot be changed, log the discrepancy. A stale third-party title is a maintenance dependency; the same title on the canonical site is a controlled inconsistency. They are not equally actionable.',
        ],
        table: {
          caption: 'External-profile reconciliation queue',
          columns: ['Priority', 'Profile class', 'Required check', 'Owner response'],
          rows: [
            ['1', 'Preferred site and HTML resume', 'Name, headline, dates, links, canonical identifiers', 'Edit immediately'],
            ['2', 'LinkedIn, GitHub, portfolio accounts', 'Current role, canonical website, project ownership', 'Update controlled fields'],
            ['3', 'Employer or university biographies', 'Material current-fact conflicts', 'Request correction when appropriate'],
            ['4', 'Programs, press, and event archives', 'Whether the page is accurate for its historical date', 'Preserve accurate history'],
            ['5', 'Private, deleted, or inaccessible profiles', 'Whether identity can still be verified', 'Omit from structured identity claims'],
          ],
        },
      },
      {
        id: 'maintenance-cadence',
        title: 'Maintain a small identity surface on a fixed cadence',
        paragraphs: [
          'Reconcile after role or graduation changes, major launches, domain migrations, and public resume revisions. A quarterly review catches expired links, copied biographies, changed usernames, and newly indexed files. Record the observation and action instead of marking a profile “done.”',
          'Success is the share of important, controllable records that agree on the current identity and point to the same maintained source. Historical evidence can remain diverse because it documents a specific time.',
        ],
        bullets: [
          'Review controlled profile pages and the public PDF every quarter.',
          'Recheck redirects and canonical host behavior after deployments or domain changes.',
          'Validate sameAs destinations before adding them and after username changes.',
          'Record third-party correction requests separately from edits you directly control.',
          'Keep dated historical sources when they are accurate for their original context.',
        ],
      },
    ],
  },
];

export function getResearchArticleBySlug(slug: string) {
  return RESEARCH_ARTICLES.find((article) => article.slug === slug);
}
