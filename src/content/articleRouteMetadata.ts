export type ArticleRouteMetadata = {
  kind: 'research' | 'investment-memo';
  path: string;
  aliases: string[];
  title: string;
  seoTitle: string;
  seoDescription: string;
  date: string;
  dateModified: string;
  indexable: boolean;
  staticSummary: string;
  image: string;
};

// Compact, browser-safe route metadata. The static route generator verifies this
// manifest against the full article registry before a production build completes.
export const ARTICLE_ROUTE_METADATA: ArticleRouteMetadata[] = [
  {
    "kind": "research",
    "path": "/research/ai-systems/the-ai-megawatt",
    "aliases": [],
    "title": "The AI Megawatt Is Not a Megawatt",
    "seoTitle": "What 1 GW of AI Data Center Power Actually Means",
    "seoDescription": "A current GB300 model translating a 1 GW data-center claim across grid interconnection, facility power, PUE, network overhead, rack capacity, installed GPUs, and utilization.",
    "date": "2026.08.16",
    "dateModified": "2026.08.16",
    "indexable": true,
    "staticSummary": "AI data center power claims are not interchangeable: a requested grid interconnection, total-facility nameplate, IT nameplate, installed accelerator fleet, and average utilized load describe different boundaries. A defensible GPU estimate requires the electrical boundary, PUE, network overhead, rack design, accelerator configuration, and utilization assumptions. A one-gigawatt AI data center can mean at least four different things. It may be a requested grid interconnection, a total facility nameplate, an IT nameplate, or an average electrical draw. Those quantities are related, but they are not interchangeable. A bare “1 GW” claim therefore does not identify a GPU fleet.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/crawler-engineering/crawl-frontier-state-machine",
    "aliases": [],
    "title": "The Crawl Frontier Is a State Machine, Not a Queue",
    "seoTitle": "Crawl Frontier Design: URL Identity, States, and Retries",
    "seoDescription": "Design a reliable web-crawler frontier with explicit URL identity, state transitions, per-origin scheduling, retry policy, crawl-trap controls, and reproducible records.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Reliable crawl frontier design models each URL as a versioned state transition across discovery, admission, scheduling, fetching, retry, suppression, and completion while keeping URL identity, origin politeness, leases, budgets, and completion records explicit and replayable. A crawl frontier is often introduced as a queue of URLs waiting to be fetched. That description is convenient and incomplete. Before a URL reaches a network client, the crawler has already made decisions about identity, scope, priority, policy, host capacity, and prior attempts. After the request, the address may redirect, retry, fail permanently, produce new links, or remain unresolved. Those decisions form a state machine whether the implementation acknowledges them or not.",
    "image": "/images/research/crawl-frontier-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/technical-seo/raw-html-rendered-dom-evidence",
    "aliases": [],
    "title": "Raw HTML and Rendered DOM Are Separate Evidence",
    "seoTitle": "Raw HTML vs Rendered DOM: A Technical SEO Evidence Contract",
    "seoDescription": "Build a raw HTML versus rendered DOM evidence contract for JavaScript SEO, including capture fields, completeness states, DOM diffs, runtime failures, and triage.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Raw HTML is the response body returned by the server, while the rendered DOM is the browser-created document after parsing, scripts, dependent requests, and mutations; a technical SEO audit needs both captures plus an explicit render-completeness state. Raw HTML is the response body delivered by the server for a request. The rendered DOM is a browser-created document state after parsing, script execution, network activity, and mutations. They are related records, not competing screenshots of one truth. The source can contain meaningful content that JavaScript removes; the DOM can contain meaningful content that the source never delivered; either state can be incomplete for reasons unrelated to the page template.",
    "image": "/images/research/raw-html-rendered-dom-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/technical-seo/canonicalization-graph-consistency",
    "aliases": [],
    "title": "Canonicalization Is a Graph Consistency Problem",
    "seoTitle": "Canonicalization as a Graph Consistency Problem",
    "seoDescription": "Model canonicalization as a graph across redirects, rel canonical, sitemaps, internal links, and duplicate clusters, then validate consistency with executable gates.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "A canonicalization graph is consistent when redirects, HTML canonicals, sitemap entries, internal links, hreflang references, and structured data converge on the same indexable URL rather than sending search systems through cycles, splits, or contradictory targets. A canonical tag is one edge in a larger URL graph. Redirects move a requester, rel canonical annotations name a preferred representative, sitemaps nominate URLs, internal links reinforce destinations, and duplicate detection groups similar documents. Reviewing any one signal in isolation misses the failures created by their interaction: a sitemap can list a URL that redirects, a canonical can target a page that canonicals elsewhere, and two duplicates can point at each other.",
    "image": "/images/research/canonicalization-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/technical-seo/internal-links-directed-retrieval-graph",
    "aliases": [],
    "title": "Internal Links Are a Directed Retrieval Graph",
    "seoTitle": "Internal Linking as a Directed Retrieval Graph",
    "seoDescription": "Analyze internal links as a directed graph using reachability, depth, components, edge context, orphan states, and executable validation instead of raw link counts.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "An internal linking graph models pages as nodes and crawlable links as directed edges so teams can measure depth, orphan risk, inlink concentration, anchor context, cluster connectivity, and the actual retrieval paths supporting each important page. An internal link is a directed edge from one document to another, observed in a particular source or rendered state with anchor text, placement, and crawlability conditions. Reducing that edge to a destination count discards the information needed to explain architecture. A global navigation link, an editorial citation, a related-product card, a pagination control, and a hidden script route can all point to the same URL while serving different retrieval functions.",
    "image": "/images/research/internal-links-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/robots-txt-courtesy-not-access-control",
    "aliases": [],
    "title": "Robots.txt Is a Courtesy Layer, Not Access Control",
    "seoTitle": "Is Robots.txt Access Control? RFC 9309 Says No",
    "seoDescription": "RFC 9309 says robots.txt rules are not access authorization. Learn what robots.txt controls—and when to use noindex, authentication, authorization, or rate limits.",
    "date": "2026.07.19",
    "dateModified": "2026.07.25",
    "indexable": true,
    "staticSummary": "RFC 9309 states that robots.txt rules are not access authorization. The file is a publicly readable crawler-coordination protocol that cooperative agents may follow; authentication, authorization, network policy, and server-side response controls must protect material that cannot be publicly retrieved. RFC 9309 is explicit: robots.txt rules are not a form of access authorization. A robots.txt file is public text that asks automated clients how they may access paths on one service. It is valuable because cooperating crawlers can retrieve one predictable policy before requesting content. It is not a credential, firewall, authorization decision, encryption layer, or confirmation of the client behind a User-Agent string. Treating it as any of those creates a security boundary that an ordinary HTTP client can cross by ignoring the file.",
    "image": "/images/research/robots-policy-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/technical-seo/structured-data-without-content-drift",
    "aliases": [],
    "title": "Structured Data Without Content Drift",
    "seoTitle": "Structured Data Without Drift: One Source for HTML and JSON-LD",
    "seoDescription": "Prevent structured-data drift by generating HTML, metadata, JSON-LD, sitemaps, and exports from one typed content model with semantic invariants and release checks.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Structured data content drift occurs when JSON-LD describes names, dates, prices, authors, availability, or claims that the visible page no longer supports; generating both surfaces from one typed source and testing their fields prevents silent divergence. Structured data drifts when it is maintained as a second copy of the page. A title changes in the component but not in JSON-LD; a publication date updates in the sitemap but not the article record; an offer expires while a cached schema block still marks it available; a profile page names a current role that the visible biography no longer supports. Every representation can be syntactically valid and collectively contradictory.",
    "image": "/images/research/structured-data-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/data-systems/audit-findings-derived-records",
    "aliases": [],
    "title": "Audit Findings Should Be Derived Records",
    "seoTitle": "Audit Findings as Derived Records: Provenance for Technical SEO",
    "seoDescription": "Model technical SEO audit findings as derived records with observation lineage, immutable inputs, versioned rules, explicit gaps, confidence, review, and reproducible exports.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "SEO audit provenance means every finding can be regenerated from immutable observations, rule and policy versions, affected URLs, timestamps, confidence, and reviewer decisions while unknown or incomplete evidence remains a named measurement gap instead of becoming a claim. A technical audit often jumps from a crawl table to a sentence: “these pages have missing canonicals,” “this template is orphaned,” or “JavaScript hides the content.” The sentence may be right, but the system has compressed several steps into one label. It observed a response, parsed the captured data, normalized fields, applied a rule, grouped URLs, interpreted impact, and proposed an action. When those layers are not stored separately, the conclusion cannot be reproduced or safely revised.",
    "image": "/images/research/audit-findings-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/ai-systems/replayable-traces-ai-agent-evaluation",
    "aliases": [],
    "title": "Replayable Traces for Evaluating Tool-Using AI Agents",
    "seoTitle": "Replayable Traces for AI Agent Evaluation",
    "seoDescription": "Evaluate tool-using AI agents with replayable observable traces, controlled environments, layered graders, repeated trials, side-effect checks, and promotion gates.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "AI agent evaluation traces should preserve the task, messages, tool calls, tool results, state transitions, generated outputs, policy versions, costs, timing, and grader results so a failure can be replayed without pretending a frozen test world predicts the live environment. A tool-using agent can reach the right final answer through an unsafe path, fail after making a useful partial change, or appear successful because the grader inspected the agent response rather than the external state. Multi-step execution creates more evidence than a prompt and output pair: tool calls, observations, state mutations, retries, costs, policy decisions, and the final environment all matter.",
    "image": "/images/research/replayable-traces-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/data-systems/sqlite-crawl-pipelines",
    "aliases": [],
    "title": "SQLite for Crawl Pipelines: Idempotency, WAL, and Bounded Concurrency",
    "seoTitle": "SQLite Web Crawler Pipelines: Idempotency, WAL, and Concurrency",
    "seoDescription": "Build reliable SQLite crawl pipelines with stable keys, idempotent writes, append-only attempts, bounded transactions, WAL-aware concurrency, checkpoints, and recovery checks.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "SQLite can support a bounded web crawler when URL identity is unique, writes use short transactions and idempotent upserts, one process coordinates write pressure, WAL behavior is measured, leases are recoverable, and large payloads remain outside oversized database rows. A crawl workload looks hostile to a small embedded database: many workers finish at unpredictable times, every response creates related rows, retries duplicate logical work, rendered captures arrive later than source captures, and reporting queries run while collection continues. The pressure often leads to shared connections, row-by-row commits, replace-style writes, and a current-state table that destroys attempt history.",
    "image": "/images/research/sqlite-pipelines-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/technical-seo/technical-seo-migration-release-gates",
    "aliases": [],
    "title": "Technical SEO Migrations Need Executable Release Gates",
    "seoTitle": "Technical SEO Migration Checklist: Executable Release Gates",
    "seoDescription": "Build executable technical SEO migration gates for URL mappings, redirects, canonicals, internal links, sitemaps, rendered content, launch rollout, and monitoring.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "A technical SEO migration checklist should be executable: inventory old and new URLs, validate redirect and canonical maps, render templates, compare indexability, preserve internal links and structured data, define rollback thresholds, and rerun the same checks after launch. A site migration changes an address system while users, crawlers, links, analytics, caches, and downstream indexes still refer to the old one. A visual review of the new templates cannot establish that old demand reaches the right destination, that retired URLs stop leaking into navigation, that canonical and sitemap signals agree, or that client-rendered content survived the move.",
    "image": "/images/research/migration-gates-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/who-owns-austin-home-service-companies",
    "aliases": [],
    "title": "Who Owns Austin’s Home-Service Companies?",
    "seoTitle": "Who Owns Austin Home-Service Companies?",
    "seoDescription": "Who owns Austin home-service companies? Explore 67 HVAC, plumbing, roofing, foundation, and pest-control brands by parent, sponsor, franchise, and local owner.",
    "date": "2026.07.26",
    "dateModified": "2026.07.26",
    "indexable": true,
    "staticSummary": "Who owns Austin home-service companies depends on the brand: the 67-brand July 2026 census includes 32 founder, family, or locally owned records, 14 sponsor-backed platform brands, four public-company brands, five local franchise operators, 11 private businesses with unresolved control, and one founder-controlled company with a documented minority investment. Search for an Austin plumber, air-conditioning technician, roofer, foundation specialist, or pest-control company and the result can look intensely local: a familiar name, an Austin phone number, a decades-old founding story, and technicians dispatched from a nearby office. The legal and financial chain behind that name may be much larger. Radiant appears as an Austin brand inside T3 Services Group, which is a Riverside Company investment. Stan’s sits inside Master Trades Group, an L Catterton investment. Fox Service Company, Precision Heating & Air, and Daniel’s Plumbing & Air remain distinct customer-facing names while tracing to Southern Home Services and Gryphon Investors.",
    "image": "/images/research/austin-home-services-ownership-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/what-happens-when-an-index-decides-a-company-matters",
    "aliases": [
      "/markets/what-happens-when-an-index-decides-a-company-matters"
    ],
    "title": "What Happens When an Index Decides a Company Matters?",
    "seoTitle": "What Happens When an Index Decides a Company Matters?",
    "seoDescription": "What happens when an index decides a company matters: follow index rules, fund demand, closing auctions, price effects, and cost-of-capital limits.",
    "date": "2026.07.23",
    "dateModified": "2026.07.23",
    "indexable": true,
    "staticSummary": "When a stock is added to a major index, the provider changes a rulebook rather than buying shares. Tracking funds then acquire the required exposure through early trading, derivatives, internal crosses, or the effective closing auction. The event can change ownership, liquidity, and price, but published evidence does not support a permanent, uniform index-inclusion premium. An index provider does not manage the portfolios that follow its benchmark. It defines the eligible universe, membership, weights, review calendar, and treatment of exceptional events. A fund sponsor promises a form of tracking; a portfolio manager decides how and when to implement it; an exchange processes the orders; and arbitrageurs may accumulate inventory before the effective close.",
    "image": "/images/research/index-company-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/software-buyout-boom-2020-2022-exit-audit",
    "aliases": [],
    "title": "What Happened to the Software Buyout Boom?",
    "seoTitle": "Software Buyout Cohort, 2020–2022: Exit Audit",
    "seoDescription": "Audit 25 large 2020–2022 software buyouts by current control, liquidity events, creditor transfers, and clean sponsor realizations at the 2026 cutoff.",
    "date": "2026.08.17",
    "dateModified": "2026.08.29",
    "indexable": true,
    "staticSummary": "A control-based audit of 25 large 2020–2022 software take-private transactions found no clean sponsor realizations by August 17, 2026 under its stated definition. That is an inventory of control exits, not evidence that every deal lost money or a basis for calculating cohort returns. The public research package audits 25 large sponsor-led software take-private transactions announced from 2020 through 2022. Company-reported headline transaction values sum to $171.2 billion, but those values use mixed definitions and size the cohort rather than measuring sponsor equity or current value.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/how-airlines-borrow-against-loyalty-programs",
    "aliases": [
      "/markets/how-airlines-borrow-against-loyalty-programs"
    ],
    "title": "How Airlines Borrow Against Loyalty Programs",
    "seoTitle": "How Airlines Borrow Against Loyalty Programs",
    "seoDescription": "How airlines borrow against loyalty programs: follow bank cash, deferred revenue, pledged accounts, loyalty-backed debt, and the lender waterfall.",
    "date": "2026.07.23",
    "dateModified": "2026.07.23",
    "indexable": true,
    "staticSummary": "How airlines borrow against loyalty programs: the card issuer pays cash under a commercial agreement; the airline records some consideration as current revenue and some as a contract liability; the member claims an award later; and a separate financing structure can give lenders first claim on designated partner and intercompany collections. How airlines borrow against loyalty programs: the card issuer pays cash under a commercial agreement; the airline records some consideration as current revenue and some as a contract liability; the member claims an award later; and a separate financing structure can give lenders first claim on designated partner and intercompany collections. The collateral is recurring cash, contracts, controlled accounts, loyalty intellectual property, data rights, reserves, and special-purpose-vehicle equity—not the member’s points as a fixed-dollar deposit.",
    "image": "/images/research/airline-loyalty-financing-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/where-online-returns-actually-go",
    "aliases": [
      "/markets/where-online-returns-actually-go"
    ],
    "title": "Where Do Online Returns Go? Inside Reverse Logistics",
    "seoTitle": "Where Do Online Returns Go? Reverse Logistics Model",
    "seoDescription": "Where do online returns go? Follow restocking, refurbishment, liquidation, recycling, or disposal with a nine-product reverse logistics model.",
    "date": "2026.07.22",
    "dateModified": "2026.07.22",
    "indexable": true,
    "staticSummary": "Where do online returns go? An online return can be restocked, sold open-box, refurbished, liquidated, donated, recycled, destroyed, held as fraud evidence, or never retrieved. The route depends on whether expected recovery after reverse freight, inspection, repair, fees, delay, and disposal exceeds the cost of retrieving the item. Where do online returns go after a refund? They can be restocked, sold open-box, refurbished, liquidated, donated, recycled, destroyed, held as fraud evidence, or never retrieved at all. A $100 pair of headphones may be refunded before it reaches a return center, then consolidated, moved, opened, matched to a serial number, tested, cleaned, and routed. That sequence is a wager that inspection will unlock a resale channel worth more than the cost of retrieval.",
    "image": "/images/research/online-returns-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/hidden-financing-hardware-startups",
    "aliases": [
      "/markets/hidden-financing-hardware-startups"
    ],
    "title": "Hardware Startup Financing: Five Capital Stacks",
    "seoTitle": "Hardware Startup Financing: Five Capital Stacks",
    "seoDescription": "Hardware startup financing compared across five capital stacks: equity, equipment finance, asset debt, customer capital, public support, and project debt.",
    "date": "2026.07.22",
    "dateModified": "2026.07.22",
    "indexable": true,
    "staticSummary": "Hardware startup financing usually combines three layers: corporate equity or debt, asset-level debt or leases, and adjacent support such as customer prepayments, supplier terms, public incentives, or parent guarantees. The structure is only asset-light when fixed claims, recourse, and residual-value risk genuinely move away from the operator. Hardware startup financing usually combines corporate equity or debt, asset-level financing, and adjacent support from customers, suppliers, governments, or a parent company. Hardware companies can resemble software companies in a fundraising headline and infrastructure projects in a liquidation. The missing bridge is the financing stack: who paid for the vehicles, robots, accelerators, factories, tooling, inventory, and working capital before those assets produced enough cash to fund the next unit.",
    "image": "/images/research/hidden-hardware-financing-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/west-campus-student-housing",
    "aliases": [],
    "title": "Who Owns West Campus Student Housing?",
    "seoTitle": "West Campus Student Housing: Ownership and Returns",
    "seoDescription": "A six-property West Campus analysis of student lease lock-in, ownership, NOI, basis, refinancing risk, and who absorbs losses.",
    "date": "2026.07.22",
    "dateModified": "2026.07.22",
    "indexable": true,
    "staticSummary": "The six-property evidence sample shows several ownership models around UT Austin: ACC and Landmark platforms, Global Student Accommodation, the UT System, and a SkyLoft special-purpose borrower with mortgage and preferred-capital layers. The evidence supports a location premium and post-signing lease lock-in, but not a market-wide concentration ratio or one return claim for every owner. At The Callaway House, $1,959 is not quite monthly rent. It is one of ten equal installments on a school-year obligation. Furniture, meals, utilities, internet, housekeeping, and amenities sit inside the bundle; parking and required liability coverage sit outside it. Unless a student can show income above three times the installment, a guarantor is required. The entry obligation is therefore $19,590 before parking and insurance, and a parent often signs behind the same number.",
    "image": "/images/research/west-campus-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/waymo-hardware-financing",
    "aliases": [],
    "title": "Who Funds Waymo’s Hardware?",
    "seoTitle": "Waymo Hardware Financing: Who Funds the Assets?",
    "seoDescription": "A Waymo case study mapping $27.1B+ of equity funding, modeled fleet economics, residual-value risk, and who absorbs downside.",
    "date": "2026.07.22",
    "dateModified": "2026.07.22",
    "indexable": true,
    "staticSummary": "The supplied public evidence supports an equity-heavy, parent-funded Waymo financing structure: Alphabet and outside investors fund the platform, while no quantified fleet-debt facility, asset SPV, customer pre-funding program, supplier facility, or government financing instrument is established in the package. Hardware businesses can look like software companies in a fundraising announcement and like infrastructure companies in a liquidation. The missing bridge is the financing stack: who pays for vehicles, sensors, batteries, charging, depots, inventory, maintenance, and working capital before a customer produces enough cash to fund the next unit.",
    "image": "/images/research/waymo-financing-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/ai-systems/the-first-ai-managers",
    "aliases": [
      "/markets/the-first-ai-managers"
    ],
    "title": "The First AI Managers",
    "seoTitle": "AI Managers: When AI Runs a Business",
    "seoDescription": "Inside the first AI-operated shops, cafés, vending machines, and radio stations—and the gap between completing the next task and preserving a coherent business.",
    "date": "2026.07.14",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "AI can run bounded business actions such as scheduling, pricing, customer replies, purchasing, and promotion, but the strongest public cases still depend on humans for legal authority, capital, physical work, supervision, and recovery when state or policy fails. The first public AI-operated shops are not synthetic companies with software owners. They are bounded systems inside human institutions: a boutique, a café, vending machines, radio stations, production agents, and simulated markets.",
    "image": "/images/research/ai-managers-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/ai-search-crawler-policy",
    "aliases": [
      "/markets/ai-search-crawler-policy"
    ],
    "title": "AI Crawler Robots.txt Guide: GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot",
    "seoTitle": "Robots.txt Guide for GPTBot, OAI-SearchBot, and AI Crawlers",
    "seoDescription": "Compare OpenAI, Anthropic, and Perplexity crawlers, then copy robots.txt rules for AI search, training controls, or named-agent blocks.",
    "date": "2026.06.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Robots.txt can express different crawl preferences for GPTBot, OAI-SearchBot, and other named agents, but those directives govern crawler access only; they do not guarantee indexing, rankings, citations, model inclusion, or retrieval by a user-requested tool. /robots.txt is a host-scoped text file. Match the exact case-sensitive product token, then assign Allow: / or Disallow: /. Preserve the correct Sitemap line.",
    "image": "/images/research/ai-crawler-policy-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/search-console/technical-seo-public-data-infrastructure",
    "aliases": [
      "/markets/technical-seo-public-data-infrastructure"
    ],
    "title": "Technical SEO as Public Data Infrastructure",
    "seoTitle": "SEO Data Pipeline as Public Infrastructure",
    "seoDescription": "A systems essay by Sulayman Bowles on URL discovery, crawling, rendering, structured records, provenance, and durable technical SEO exports.",
    "date": "2026.06.19",
    "dateModified": "2026.07.16",
    "indexable": true,
    "staticSummary": "An SEO data pipeline should preserve URL identity, collection time, raw observations, rendered evidence, source provenance, derived findings, and export state so Search Console metrics and crawler records can support reviewable decisions instead of becoming disconnected dashboard totals. A publication system produces addressable records. DNS and routing assign an address; the server emits a source snapshot; browser execution may create another state; extractors normalize fields; and exports carry those fields into review tools. Calling every state “the page” hides where information changed or disappeared.",
    "image": "/images/research/public-data-infrastructure-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/personal-seo/canonical-identity-personal-seo",
    "aliases": [
      "/markets/canonical-identity-personal-seo"
    ],
    "title": "Canonical Identity Beats More Content",
    "seoTitle": "Canonical Identity for Personal SEO",
    "seoDescription": "A personal-identity reconciliation playbook for canonical hosts, ProfilePage schema, sameAs eligibility, resumes, and external profile maintenance.",
    "date": "2026.06.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Personal SEO canonical identity starts with one current person page, consistent names and facts, redirected stale records, selective sameAs links, and controlled profiles that point back to the canonical source instead of multiplying thin biographies across the web. Personal SEO often fails when biographies disagree. A portfolio, resume PDF, university page, GitHub profile, LinkedIn page, competition account, old domain, and copied speaker bio can name different titles, employers, graduation dates, projects, or official websites.",
    "image": "/images/research/canonical-identity-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/why-texas-toll-roads-stay-tolled",
    "aliases": [
      "/markets/why-texas-toll-roads-stay-tolled",
      "/why-texas-toll-roads-stay-tolled"
    ],
    "title": "Why Texas Toll Roads Stay Tolled",
    "seoTitle": "Why Texas Toll Roads Stay Tolled After Construction",
    "seoDescription": "Audited records show where Texas toll revenue goes after construction: operations, debt, reserves, capital work, county transfers, and private distributions.",
    "date": "2026.09.02",
    "dateModified": "2026.09.03",
    "indexable": true,
    "staticSummary": "Build the road, collect tolls, repay the road, remove the toll. That is the model many drivers carry in their heads. It describes a single project, a fixed construction bill, one loan, and a clean ending. Most large Texas toll systems do not work that way.",
    "image": "/images/research/texas-toll-revenue-social.jpg"
  },
  {
    "kind": "research",
    "path": "/research/data-systems/us-rare-earth-magnet-manufacturing-capacity",
    "aliases": [
      "/markets/us-rare-earth-magnet-manufacturing-capacity"
    ],
    "title": "The U.S. Rare-Earth Magnet Buildout Is Larger Than It Looks—and Less Mature",
    "seoTitle": "U.S. Rare-Earth Magnet Capacity: Plant-by-Plant Buildout",
    "seoDescription": "Audit U.S. rare-earth magnet manufacturing capacity by plant maturity, product form, qualification status, upstream inputs, and realistic output scenarios.",
    "date": "2026.08.17",
    "dateModified": "2026.08.17",
    "indexable": true,
    "staticSummary": "U.S. rare-earth magnet manufacturing capacity is growing, but announced nameplate, installed equipment, qualification, commercial shipments, and sustained saleable output are different maturity states. Bankable supply also depends on product mix, yield, qualified customers, imported inputs, and utilization rather than the sum of every announced project headline. The United States is no longer starting from zero in sintered neodymium-iron-boron magnets. A project-by-project audit produces 37,750 metric tonnes of disclosed firm-project nameplate. That figure is large enough to resemble published estimates of total U.S. magnet consumption, but the resemblance is misleading. Only 4,000 tonnes belongs to plants with both disclosed nameplate and commercial shipments. Another 3,600 tonnes sits in commissioning, ramp, or customer qualification. The remaining 30,150 tonnes is future capacity tied to construction, later phases, or announced production targets.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "investment-memo",
    "path": "/markets/archived-research-methodology",
    "aliases": [],
    "title": "Archived Market Research Methodology",
    "seoTitle": "Archived Market Research Methodology",
    "seoDescription": "Noindexed methodology archive by Sulayman Bowles covering evidence requirements for network, compute-infrastructure, and monetary-system research.",
    "date": "2026.04.18",
    "dateModified": "2026.07.16",
    "indexable": false,
    "staticSummary": "These notes began as separate sketches about network effects, distributed compute, and monetary regimes. None matured into a current recommendation, and keeping three nearly identical archive pages overstated the amount of finished research. This page preserves the useful part instead: the evidence contract each question would need before it could support a public conclusion.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "investment-memo",
    "path": "/markets/who-owns-texas-toll-roads",
    "aliases": [],
    "title": "Who Owns the Toll Roads in Texas? Ownership, Operators, and Economics",
    "seoTitle": "Who Owns Texas Toll Roads? Public Owners & 4 Concessions",
    "seoDescription": "Most Texas toll roads are publicly owned. See the four major private concessions, who operates each road, who collects toll revenue, and where ownership ends.",
    "date": "2026.07.11",
    "dateModified": "2026.07.25",
    "indexable": true,
    "staticSummary": "Most Texas toll roads are publicly owned, not privately owned. TxDOT, counties, and public toll authorities own most roadways. Four major concessions—North Tarrant Express, LBJ Express, NTE 35W, and SH 130 Segments 5–6—give private companies time-limited operating and toll-revenue rights while Texas retains title to the pavement. Texas toll roads do not have one owner. Texas, a county, or a public authority usually owns the physical roadway. A public system may keep the toll revenue, or a concession company may hold a finite right to operate the lanes and collect tolls. Sponsors own the company; lenders control senior claims; billing can sit with another public agency; and the state retains or recovers the asset at expiry.",
    "image": "/images/research/texas-toll-roads-social.jpg"
  },
  {
    "kind": "investment-memo",
    "path": "/markets/who-owns-us-toll-roads",
    "aliases": [],
    "title": "Who Owns 25 of America’s Major Toll Roads?",
    "seoTitle": "Who Owns America’s Toll Roads? 25 Major Systems Explained",
    "seoDescription": "A current 25-facility sample separating public title, toll operators, private concessions, equity owners, revenue rights, buybacks, and contract end dates.",
    "date": "2026.09.02",
    "dateModified": "2026.09.02",
    "indexable": true,
    "staticSummary": "In a dated sample of 25 major U.S. toll facilities, public agencies usually retain legal title, while some concessions transfer operations and toll-revenue risk to private project companies for a finite term. Billing providers, lenders, and equity owners remain separate roles. A driver normally encounters one road name and one toll bill. The legal structure can contain half a dozen different parties. A state may own the pavement. A public authority may issue the debt. A private concessionaire may operate the lanes and receive the toll revenue. A separate company may process the payment. Infrastructure funds, pension plans, or public shareholders may own the concessionaire. At the end of the contract, the road may return to government control.",
    "image": "/images/social/og-research.png"
  }
];
