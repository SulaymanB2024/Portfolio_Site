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
    "seoDescription": "Design a reliable web-crawler frontier with explicit URL identity, state transitions, per-origin scheduling, retry policy, crawl-trap controls, and reproducible evidence.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "Reliable crawl frontier design models each URL as a versioned state transition across discovery, admission, scheduling, fetching, retry, suppression, and completion while keeping URL identity, origin politeness, leases, budgets, and evidence records explicit and replayable. A crawl frontier is often introduced as a queue of URLs waiting to be fetched. That description is convenient and incomplete. Before a URL reaches a network client, the crawler has already made decisions about identity, scope, priority, policy, host capacity, and prior attempts. After the request, the address may redirect, retry, fail permanently, produce new links, or remain unresolved. Those decisions form a state machine whether the implementation acknowledges them or not.",
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
    "staticSummary": "Raw HTML is the response body returned by the server, while the rendered DOM is the browser-created document after parsing, scripts, dependent requests, and mutations; a technical SEO audit needs both artifacts plus an explicit render-completeness state. Raw HTML is the response body delivered by the server for a request. The rendered DOM is a browser-created document state after parsing, script execution, network activity, and mutations. They are related artifacts, not competing screenshots of one truth. The source can contain meaningful content that JavaScript removes; the DOM can contain meaningful content that the source never delivered; either state can be incomplete for reasons unrelated to the page template.",
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
    "title": "Robots.txt Is Not Access Control: RFC 9309 Explained",
    "seoTitle": "Robots.txt Is Not Access Control: RFC 9309 & Google Docs",
    "seoDescription": "RFC 9309 says robots.txt rules are not access authorization. Learn what robots.txt controls—and when to use noindex, authentication, authorization, or rate limits.",
    "date": "2026.07.19",
    "dateModified": "2026.09.10",
    "indexable": true,
    "staticSummary": "RFC 9309 states that robots.txt rules are not access authorization. The file is a publicly readable crawler-coordination protocol that cooperative agents may follow; authentication, authorization, network policy, and server-side response controls must protect material that cannot be publicly retrieved. RFC 9309 is explicit: robots.txt rules are not a form of access authorization. A robots.txt file is public text that asks automated clients how they may access paths on one service. It is valuable because cooperating crawlers can retrieve one predictable policy before requesting content. It is not a credential, firewall, authorization decision, encryption layer, or proof of the client behind a User-Agent string. Treating it as any of those creates a security boundary that an ordinary HTTP client can cross by ignoring the file.",
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
    "seoDescription": "Model technical SEO audit findings as derived records with observation lineage, immutable artifacts, versioned rules, explicit gaps, confidence, review, and reproducible exports.",
    "date": "2026.07.19",
    "dateModified": "2026.07.19",
    "indexable": true,
    "staticSummary": "SEO audit provenance means every finding can be regenerated from immutable observations, rule and policy versions, affected URLs, timestamps, confidence, and reviewer decisions while unknown or incomplete evidence remains a named measurement gap instead of becoming a claim. A technical audit often jumps from a crawl table to a sentence: “these pages have missing canonicals,” “this template is orphaned,” or “JavaScript hides the content.” The sentence may be right, but the system has compressed several steps into one label. It observed a response, parsed an artifact, normalized fields, applied a rule, grouped URLs, interpreted impact, and proposed an action. When those layers are not stored separately, the conclusion cannot be reproduced or safely revised.",
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
    "staticSummary": "AI agent evaluation traces should preserve the task, messages, tool calls, tool results, state transitions, artifacts, policy versions, costs, timing, and grader evidence so a failure can be replayed without pretending a frozen test world predicts the live environment. A tool-using agent can reach the right final answer through an unsafe path, fail after making a useful partial change, or appear successful because the grader inspected the agent response rather than the external state. Multi-step execution creates more evidence than a prompt and output pair: tool calls, observations, state mutations, retries, costs, policy decisions, and the final environment all matter.",
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
    "staticSummary": "SQLite can support a bounded web crawler when URL identity is unique, writes use short transactions and idempotent upserts, one process coordinates write pressure, WAL behavior is measured, leases are recoverable, and artifacts remain outside oversized database rows. A crawl workload looks hostile to a small embedded database: many workers finish at unpredictable times, every response creates related rows, retries duplicate logical work, render artifacts arrive later than source artifacts, and reporting queries run while collection continues. The pressure often leads to shared connections, row-by-row commits, replace-style writes, and a current-state table that destroys attempt history.",
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
    "seoTitle": "Who Owns Austin Home-Service Companies? 67 Brands Mapped",
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
    "seoDescription": "A source-led Waymo case study mapping $27.1B+ of equity funding, modeled fleet economics, residual-value risk, and who absorbs downside.",
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
    "title": "Can AI Run a Business? 30 AI Manager Cases",
    "seoTitle": "Can AI Run a Business? 30 AI Manager Cases Reviewed",
    "seoDescription": "30 cases across live operations, pilots, narrow agents, simulations, and exclusions. What AI managers can do, and where humans still run the business.",
    "date": "2026.07.14",
    "dateModified": "2026.09.10",
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
    "seoDescription": "A systems essay by Sulayman Bowles on URL discovery, crawling, rendering, structured records, provenance, crawl evidence, and durable technical SEO exports.",
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
    "path": "/research/financial-systems/who-owns-ntta",
    "aliases": [],
    "title": "Who Owns NTTA? The North Texas Tollway Authority Is Public",
    "seoTitle": "Who Owns NTTA? Public Authority, Not a Private Company",
    "seoDescription": "Who owns NTTA? NTTA is a public regional tollway authority made up of Dallas, Denton, Collin, and Tarrant counties. See what it owns and where toll money goes.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "The North Texas Tollway Authority is public. NTTA describes itself as a political subdivision of the State of Texas authorized to acquire, build, maintain, repair, and operate turnpike projects. Its member counties are Dallas, Denton, Collin, and Tarrant; it also serves Ellis and Johnson counties. There is no stock ledger, private parent company, or foreign shareholder that “owns NTTA.”",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/texas-toll-roads-public-vs-private",
    "aliases": [],
    "title": "Are Texas Toll Roads Privately Owned? A Road-by-Road Answer",
    "seoTitle": "Are Texas Toll Roads Privately Owned? Public vs Private Map",
    "seoDescription": "Are Texas toll roads privately owned? Most are public. See NTTA, HCTRA, TxDOT systems and four major private concessions, with ownership separated from operating rights.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Most Texas toll roads are not privately owned. NTTA, HCTRA, regional mobility authorities, counties, and TxDOT own or control most of the major systems. The important exception is a small group of long-term public-private concessions where Texas keeps title to the corridor but a project company receives contractual rights to operate tolled managed lanes and keep defined toll revenue.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/who-owns-hctra-sam-houston-tollway",
    "aliases": [],
    "title": "Who Owns HCTRA and the Sam Houston Tollway?",
    "seoTitle": "Who Owns HCTRA? Harris County Owns the Toll System",
    "seoDescription": "Who owns HCTRA and the Sam Houston Tollway? HCTRA is a Harris County public enterprise created under Texas law. Learn who governs it and where toll revenue goes.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "HCTRA is public. Harris County Commissioners Court established the Harris County Toll Road Authority in 1983 under Chapter 284 of the Texas Transportation Code. HCTRA operates as a Harris County enterprise fund, with toll revenue supporting the toll system rather than flowing to private shareholders.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/foreign-owned-texas-toll-roads",
    "aliases": [],
    "title": "Are Texas Toll Roads Foreign-Owned? What Cintra and Ferrovial Actually Own",
    "seoTitle": "Are Texas Toll Roads Foreign-Owned? Cintra & Ferrovial Explained",
    "seoDescription": "Are Texas toll roads foreign-owned? Separate state ownership of the road from foreign investor stakes in NTE, LBJ and NTE 35W concession companies.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Yes, foreign infrastructure investors hold equity interests in some Texas toll-road concession companies. No, that does not mean a foreign country or company owns the Texas highway itself. The distinction is easiest to see in Dallas–Fort Worth, where TxDOT keeps title to NTE, LBJ Express, and NTE 35W while private project companies hold long-dated operating and toll-revenue rights.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/texas-private-toll-rate-controls",
    "aliases": [],
    "title": "Who Can Raise Texas Toll Rates? Public Boards, TxDOT, and Private Concessions",
    "seoTitle": "Who Sets Texas Toll Rates? Private Toll Rate Controls Explained",
    "seoDescription": "Who can raise Texas toll rates? See how NTTA, HCTRA, TxDOT and private concession agreements control fixed and dynamically priced tolls.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "No single company or state office sets every Texas toll rate. Public authorities such as NTTA and HCTRA adopt rates through their own public governance. TxDOT sets or administers rates on state toll systems. Private concessionaires on NTE, LBJ, NTE 35W, and SH 130 5–6 operate under project agreements that define the pricing regime and the public counterparty’s enforcement rights.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/who-owns-us-toll-roads",
    "aliases": [],
    "title": "Who Owns Toll Roads in the United States?",
    "seoTitle": "Who Owns U.S. Toll Roads? Public Authorities vs Concessions",
    "seoDescription": "Who owns toll roads in the U.S.? Learn the difference between state and public-authority ownership, municipal toll systems, and private concession rights.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "The federal government does not own one national toll-road system, and no private company owns all U.S. toll roads. Ownership is fragmented across state departments of transportation, turnpike and bridge authorities, counties, regional bodies, and local governments. Private capital enters through specific concessions and long-term leases.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/texas-managed-lanes-ownership-operators",
    "aliases": [],
    "title": "Who Owns Texas Managed Lanes and Express Lanes?",
    "seoTitle": "Who Owns Texas Express Lanes? Owner vs Operator Map",
    "seoDescription": "Who owns Texas managed and express lanes? Compare TxDOT-owned lanes, NTTA billing, and private concession operators on NTE, LBJ, NTE 35W and other corridors.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "“Managed lane” tells you how a lane is operated, not who owns it. Texas uses tolled express or managed lanes to sell a faster, more reliable trip beside general-purpose lanes. Some are operated directly in public systems. Others are publicly owned corridors with long-term private concession companies controlling the managed-lane toll economics.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/texas-private-toll-concession-expiration-dates",
    "aliases": [],
    "title": "When Do Texas Private Toll-Road Concessions Expire?",
    "seoTitle": "Texas Private Toll Road Expiration Dates: 2061 and 2062",
    "seoDescription": "Texas private toll concession expiration dates: NTE, LBJ and NTE 35W end in 2061; SH 130 Segments 5–6 ends in 2062. See what actually expires.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "The three major Dallas–Fort Worth private toll concessions—North Tarrant Express, LBJ Express, and NTE 35W—currently end in 2061. SH 130 Segments 5–6 ends in 2062. Those dates come from TxDOT’s concession reporting and executed project documents, not from the maturity date of any one bond.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/openai-crawlers-oai-searchbot-gptbot-chatgpt-user-adsbot",
    "aliases": [],
    "title": "OAI-SearchBot vs GPTBot vs ChatGPT-User vs OAI-AdsBot",
    "seoTitle": "OAI-SearchBot vs GPTBot vs ChatGPT-User vs OAI-AdsBot",
    "seoDescription": "Compare OAI-SearchBot, GPTBot, ChatGPT-User and OAI-AdsBot: what each does, whether robots.txt applies, and which published IP ranges to verify.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "OpenAI’s crawler names now map to four materially different jobs. OAI-SearchBot is the automatic crawler used to make pages eligible for ChatGPT Search. GPTBot is the crawler associated with content that may be used to improve and train generative foundation models. ChatGPT-User is a user-triggered fetcher used when a ChatGPT or Custom GPT action visits a page. OAI-AdsBot checks landing pages submitted for ChatGPT ads.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/crawler-engineering/verify-ai-crawlers-server-logs",
    "aliases": [],
    "title": "How to Verify an AI Crawler in Server Logs",
    "seoTitle": "How to Verify AI Crawlers in Server Logs: UA + IP Checks",
    "seoDescription": "Verify GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and other AI crawlers in logs using User-Agent parsing, IP-range checks, status codes and request evidence.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Searching access logs for “GPTBot” or “ClaudeBot” is useful, but it is not verification. Any client can send a copied User-Agent string. For crawler analytics, allowlisting, abuse controls, or a public study, the log record should be joined to provider-published network evidence and the actual HTTP response.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/claude-crawlers-claudebot-searchbot-user",
    "aliases": [],
    "title": "ClaudeBot vs Claude-SearchBot vs Claude-User",
    "seoTitle": "ClaudeBot vs Claude-SearchBot vs Claude-User: What Each Does",
    "seoDescription": "Compare ClaudeBot, Claude-SearchBot and Claude-User: training, search, user retrieval, robots.txt controls, crawl-delay support and verification.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Anthropic documents three web robots because “Claude accessed my site” can mean three different things. ClaudeBot collects public web content that may contribute to model development. Claude-SearchBot supports web search. Claude-User fetches content when a person asks Claude to visit or use a page.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/perplexitybot-vs-perplexity-user",
    "aliases": [],
    "title": "PerplexityBot vs Perplexity-User",
    "seoTitle": "PerplexityBot vs Perplexity-User: Search Crawl vs User Fetch",
    "seoDescription": "PerplexityBot vs Perplexity-User: learn which bot supports search indexing, which fetches on user request, how robots.txt differs, and how to verify both.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Perplexity documents two web-access identities. PerplexityBot automatically gathers and indexes information so websites can surface and be linked in Perplexity search results. Perplexity-User fetches pages in response to a person’s question.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/google-extended-search-gemini-ai-overviews",
    "aliases": [],
    "title": "Does Google-Extended Affect Google Search, Gemini, or AI Overviews?",
    "seoTitle": "Google-Extended: Gemini Control, Not Google Search or AI Overviews",
    "seoDescription": "What does Google-Extended block? It controls certain Gemini training and grounding uses, not Google Search inclusion or ranking. Learn how AI Overviews differ.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Google-Extended is easy to misread because its name looks like a crawler. Google says it has no separate HTTP User-Agent string. It is a robots.txt product token that tells Google whether content it crawls may be used for certain Gemini model training and grounding uses.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/ai-crawlers/ai-crawler-registry",
    "aliases": [],
    "title": "AI Crawler Registry: Search, Training, User Fetchers, and Product Bots",
    "seoTitle": "AI Crawler Registry: GPTBot, ClaudeBot, PerplexityBot & More",
    "seoDescription": "AI crawler registry for OpenAI, Anthropic, Perplexity and Google: user agents, search vs training purpose, robots controls, user-triggered fetchers and verification sources.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "“AI crawler” has become too broad to be an operational category. OAI-SearchBot and PerplexityBot exist for search discovery. GPTBot and ClaudeBot are tied to model-development crawling. ChatGPT-User, Claude-User, and Perplexity-User are user-triggered retrieval identities. OAI-AdsBot exists for ad landing-page review. Google-Extended is not even a separate HTTP crawler; it is a robots product token.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/search-console/search-console-query-vs-page-totals",
    "aliases": [],
    "title": "Why Search Console Query Totals Do Not Match Page Totals",
    "seoTitle": "Why Search Console Query Totals Don’t Match Page Totals",
    "seoDescription": "Why do Search Console query totals differ from page totals? Learn anonymized queries, row limits, API truncation and property-vs-page aggregation with a reproducible reconciliation method.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Search Console can show 10,000 impressions in the chart while the visible query rows add to much less. That is expected behavior, not necessarily a data bug. Google documents three major reasons: the query table omits anonymized low-frequency queries, the interface only displays up to 1,000 rows, and grouping by page or Search appearance changes the aggregation compared with the property-level chart.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/search-console/search-console-data-pipeline",
    "aliases": [],
    "title": "How to Build a Search Console Data Pipeline That Preserves Evidence",
    "seoTitle": "Search Console Data Pipeline: API, BigQuery, Evidence & QA",
    "seoDescription": "Build a Search Console data pipeline with raw API or BigQuery exports, partitioned facts, query/page aggregates, evidence snapshots, QA checks and reproducible SEO reports.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "A Search Console pipeline becomes unreliable when the same table mixes Google’s source data, cleaned dimensions, opportunity scores, and human judgments. The fix is a layered model: retain the raw export, normalize it without changing meaning, materialize stable aggregates, and compute SEO decisions in a separate derived layer.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/coreweave-ddtl-5-5",
    "aliases": [],
    "title": "CoreWeave DDTL 5.5: How a $2.6 Billion GPU-Backed Loan Works",
    "seoTitle": "CoreWeave DDTL 5.5: $2.6B GPU Loan Structure Explained",
    "seoDescription": "CoreWeave DDTL 5.5 explained: $2.6B delayed-draw loan, SOFR + 5.50%, 2031 maturity, GPU collateral, customer contracts and asset-level financing structure.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "CoreWeave’s DDTL 5.5 is a $2.6 billion delayed-draw term loan entered into in August 2026 through CoreWeave Financing DDTL V-V, LLC, an indirect subsidiary. CoreWeave’s SEC filing says the facility is primarily intended to finance capital expenditures required to perform customer contracts, including GPU servers and related infrastructure.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/gpu-financing-ai-infrastructure",
    "aliases": [],
    "title": "How AI Companies Finance GPUs Without Putting Everything on the Parent Balance Sheet",
    "seoTitle": "How AI Companies Finance GPUs: Asset-Level Debt & Contract SPVs",
    "seoDescription": "How AI infrastructure companies finance GPUs with delayed-draw loans, asset-level debt, contract-backed SPVs, pledged cash flows and residual-value underwriting.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "The parent-company balance sheet is not the only place to finance GPUs. CoreWeave’s public filings show a repeatable alternative: contribute eligible customer contracts and the associated infrastructure into financing structures, pledge the equipment and contract cash flows, and borrow through dedicated subsidiaries. The result resembles project finance more than a generic venture-backed server purchase.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/who-owns-austin-hvac-companies",
    "aliases": [],
    "title": "Who Owns Austin’s HVAC Companies?",
    "seoTitle": "Who Owns Austin HVAC Companies? PE Platforms & Local Brands",
    "seoDescription": "Who owns Austin HVAC companies? Trace Radiant, Stan’s, Fox, Daniel’s, Precision, Abacus, ARS, Goettl and other brands to current platforms and sponsors.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Austin’s HVAC market contains several different ownership models under customer-facing names that still feel local. Radiant traces through T3 Services Group to The Riverside Company. Stan’s sits inside Master Trades Group, an L Catterton investment. Fox Service Company, Precision Heating & Air, and Daniel’s Plumbing & Air sit inside Southern Home Services, where Gryphon Investors holds a majority investment through the holding-company structure.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/who-owns-austin-plumbing-electrical-companies",
    "aliases": [],
    "title": "Who Owns Austin’s Plumbing and Electrical Companies?",
    "seoTitle": "Who Owns Austin Plumbing & Electrical Companies?",
    "seoDescription": "Who owns Austin plumbing and electrical companies? Trace Abacus, Radiant, Stan’s, Daniel’s, Roger’s and multi-trade brands to their platforms and investors.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Several Austin plumbing and electrical brands now sit inside multi-trade home-services platforms. Radiant, for example, is an Austin brand inside T3 Services Group and Riverside’s portfolio. Stan’s sits inside Master Trades Group under L Catterton. Daniel’s Plumbing & Air is part of Southern Home Services under Gryphon. Abacus is a Wrench Group subsidiary.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/private-equity-home-services-rollups",
    "aliases": [],
    "title": "How Private-Equity Rollups Work in Home Services",
    "seoTitle": "How Private Equity Home-Service Rollups Work: Platform + Add-Ons",
    "seoDescription": "How private-equity home-services rollups work: platform acquisitions, add-ons, founder rollover, retained brands, centralized systems, leverage and sponsor exits.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "A private-equity home-services rollup usually starts with a platform: an operator large enough to acquire additional HVAC, plumbing, electrical, roofing, foundation, or pest-control businesses. The sponsor supplies equity capital and often acquisition capacity; the platform buys or partners with local companies; founders may sell outright, roll equity, or continue managing the local operation.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/airline-loyalty-collateral-valuation",
    "aliases": [],
    "title": "How Airline Loyalty Programs Are Valued as Collateral",
    "seoTitle": "How Airline Loyalty Programs Are Valued as Collateral",
    "seoDescription": "How are airline loyalty programs valued as collateral? Follow partner cash, co-brand contracts, pledged accounts, AAdvantage debt capacity and the gap between debt and equity value.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "Lenders do not value an airline loyalty program by multiplying outstanding miles by a consumer redemption value. The secured asset is the cash-producing commercial system around the program: recurring payments from co-brand banks and other partners, key agreements, controlled deposit accounts, reserves, loyalty intellectual property and data rights, and the intercompany contracts needed to keep the program functioning.",
    "image": "/images/social/og-research.png"
  },
  {
    "kind": "research",
    "path": "/research/financial-systems/humanoid-robot-startup-financing",
    "aliases": [],
    "title": "How Humanoid-Robot Companies Finance Hardware Before Scale",
    "seoTitle": "How Humanoid Robot Startups Finance Hardware Before Scale",
    "seoDescription": "How humanoid robot startups finance hardware: Apptronik’s $935M+ Series A, Figure’s $1B+ Series C, strategic investors, manufacturing capex, GPUs and the path toward asset finance.",
    "date": "2026.09.23",
    "dateModified": "2026.09.23",
    "indexable": true,
    "staticSummary": "A humanoid robot company has to finance much more than the metal body. Before scale, the same capital pool funds hardware iteration, actuators and supply chain, manufacturing tooling, software and controls, GPU training infrastructure, field deployments, safety work, data collection, inventory, and the working capital between buying components and receiving customer cash.",
    "image": "/images/social/og-research.png"
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
    "dateModified": "2026.09.10",
    "indexable": true,
    "staticSummary": "U.S. rare-earth magnet manufacturing capacity is growing, but announced nameplate, installed equipment, qualification, commercial shipments, and sustained saleable output are different maturity states. Bankable supply also depends on product mix, yield, qualified customers, imported inputs, and utilization rather than the sum of every announced project headline. The United States is no longer starting from zero in sintered neodymium-iron-boron magnets. A project-by-project audit produces 37,750 stated units (37,584–38,048 normalized metric tonnes) of disclosed firm-project nameplate. That figure is large enough to resemble published estimates of total U.S. magnet consumption, but the resemblance is misleading. Only 4,000 stated units belong to plants with both disclosed nameplate and commercial shipments. Another 3,600 stated units sit in commissioning, ramp, or customer qualification. The remaining 30,150 stated units are future capacity tied to construction, later phases, or announced production targets.",
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
  }
];
