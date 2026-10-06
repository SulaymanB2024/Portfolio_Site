# Original article restoration

Restored 25 missing or delisted articles; Writing now contains 29 published essays. At recovery, the 24 structured manuscripts preserved every original source field, with the standalone Texas toll-finance article retaining its complete article body. Four reviewed current manuscripts remain byte-identical. Original paths, aliases, section targets, source references, figures and supporting files are retained.

The subsequent authorized [reader and prose refinement](article-reader-refinement.md) revised five manuscripts. Their frozen originals remain in `article-originals/`; [article-revisions.json](article-revisions.json) records the exact revised readbacks and separately guards unchanged research evidence. Original recovery hashes have not been replaced with edited hashes.

Presentation uses the current reader, serif headlines, ink artwork, restrained tables, source previews and responsive chapter navigation. Editorial display headlines are separate from the original manuscript titles. Figures load lazily with intrinsic dimensions; article bodies remain separate deferred chunks. The three monochrome Texas diagrams follow the page appearance without changing source files.

Recovered from Git commit `dbf20b13ce818df171c04c03820ae7db02722c83`. The machine-readable provenance and integrity contract is [article-restoration.json](article-restoration.json). It records original-field hashes, source-module hashes, and 130 retained asset hashes. Six complete records found on an unmerged branch remain separate because prior publication is unverified. The explicitly noindexed historical methodology record remains excluded from public discovery.

## Verification

Passed:

- `node --experimental-strip-types --test tests/article-restoration.test.ts tests/content-curation.test.ts tests/editorial-links.test.ts tests/search-metadata.test.ts tests/search-feed.test.ts tests/route-scroll.test.ts tests/route-preparation.test.ts tests/route-warmup.test.ts` — 40 tests.
- `npm run build` — production client and public-document builds.
- `npm run verify:release` — 42 readable canonical documents, 29 dated feed entries, canonical routes, citation targets, local assets and discovery.
- `node tools/verify-restored-articles.mjs` — 25 source-faithful restorations, four preserved manuscripts, 130 unchanged assets; read-only.
- `git diff --check` — passed.
- Browser: all 29 Writing cards rendered, all seven formerly broken articles opened, no duplicate prose IDs or page overflow. Desktop and 390px phone layouts reviewed in light/dark appearance. Citation S8 opened its native source preview; original clean URL and native chapter fragment arrived at 96px on mobile; long tables remain keyboard-focusable scroll regions.

No new dependencies or publication. Shared ongoing Home/Work/About/Contact/Resume/Writing UI changes remain with their owners.

## Restored originals

- [How I Verified a 54-Move Exact Search Solver](http://127.0.0.1:5196/research/data-systems/jane-street-exact-search-solver-verification)
- [Why Texas Toll Roads Stay Tolled: Where the Money Goes After Construction](http://127.0.0.1:5196/research/financial-systems/why-texas-toll-roads-stay-tolled)
- [What Happened to the Software Buyout Boom?](http://127.0.0.1:5196/research/financial-systems/software-buyout-boom-2020-2022-exit-audit)
- [The U.S. Rare-Earth Magnet Buildout Is Larger Than It Looks—and Less Mature](http://127.0.0.1:5196/research/data-systems/us-rare-earth-magnet-manufacturing-capacity)
- [The AI Megawatt Is Not a Megawatt](http://127.0.0.1:5196/research/ai-systems/the-ai-megawatt)
- [Who Owns Austin’s Home-Service Companies?](http://127.0.0.1:5196/research/financial-systems/who-owns-austin-home-service-companies)
- [What Happens When an Index Decides a Company Matters?](http://127.0.0.1:5196/research/financial-systems/what-happens-when-an-index-decides-a-company-matters)
- [How Airlines Borrow Against Loyalty Programs](http://127.0.0.1:5196/research/financial-systems/how-airlines-borrow-against-loyalty-programs)
- [Where Do Online Returns Go? Inside Reverse Logistics](http://127.0.0.1:5196/research/financial-systems/where-online-returns-actually-go)
- [Hardware Startup Financing: Five Capital Stacks](http://127.0.0.1:5196/research/financial-systems/hidden-financing-hardware-startups)
- [Who Owns West Campus Student Housing?](http://127.0.0.1:5196/research/financial-systems/west-campus-student-housing)
- [Who Funds Waymo’s Hardware?](http://127.0.0.1:5196/research/financial-systems/waymo-hardware-financing)
- [The Crawl Frontier Is a State Machine, Not a Queue](http://127.0.0.1:5196/research/crawler-engineering/crawl-frontier-state-machine)
- [Raw HTML and Rendered DOM Are Separate Evidence](http://127.0.0.1:5196/research/technical-seo/raw-html-rendered-dom-evidence)
- [Canonicalization Is a Graph Consistency Problem](http://127.0.0.1:5196/research/technical-seo/canonicalization-graph-consistency)
- [Internal Links Are a Directed Retrieval Graph](http://127.0.0.1:5196/research/technical-seo/internal-links-directed-retrieval-graph)
- [Robots.txt Is Not Access Control: RFC 9309 Explained](http://127.0.0.1:5196/research/ai-crawlers/robots-txt-courtesy-not-access-control)
- [Structured Data Without Content Drift](http://127.0.0.1:5196/research/technical-seo/structured-data-without-content-drift)
- [Audit Findings Should Be Derived Records](http://127.0.0.1:5196/research/data-systems/audit-findings-derived-records)
- [Replayable Traces for Evaluating Tool-Using AI Agents](http://127.0.0.1:5196/research/ai-systems/replayable-traces-ai-agent-evaluation)
- [SQLite for Crawl Pipelines: Idempotency, WAL, and Bounded Concurrency](http://127.0.0.1:5196/research/data-systems/sqlite-crawl-pipelines)
- [Technical SEO Migrations Need Executable Release Gates](http://127.0.0.1:5196/research/technical-seo/technical-seo-migration-release-gates)
- [AI Crawler Robots.txt Guide: GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot](http://127.0.0.1:5196/research/ai-crawlers/ai-search-crawler-policy)
- [Technical SEO as Public Data Infrastructure](http://127.0.0.1:5196/research/search-console/technical-seo-public-data-infrastructure)
- [Canonical Identity Beats More Content](http://127.0.0.1:5196/research/personal-seo/canonical-identity-personal-seo)
