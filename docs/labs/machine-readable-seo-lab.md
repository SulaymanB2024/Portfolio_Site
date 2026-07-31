# Machine-Readable SEO and AI Crawler Lab

Date: 2026-07-30

Branch: `codex/seo-machine-readable-lab`

Base: `cba7d2ddc4c3cfa28cc8b024b170eae5064e67d9`

## Outcome

This lane adds a fail-closed machine-readable authority contract across the route registry, XML sitemap, `llms.txt`, `robots.txt`, generated static heads, and JSON-LD graphs. It does not claim deployment, crawling, indexing, rankings, traffic movement, model inclusion, answer inclusion, or citations.

The contract now rejects:

- duplicate or malformed canonical paths and aliases;
- an indexable route marked `noindex`;
- a route omitted from the sitemap without explicit `noindex` and a generated static head;
- future or malformed `lastmod` values;
- missing or conflicting Person, WebSite, WebPage, and Article identifiers;
- unresolved WebPage `mainEntity` references;
- Article URL, author, publisher, or date drift;
- sitemap URLs without generated static HTML;
- generated canonical, Open Graph, robots-meta, schema, sitemap, `llms.txt`, or crawler-policy divergence;
- stale aliases and retired Person identifiers in machine-readable surfaces.

## Generated-versus-source ownership

| Surface | Source of truth | Materialized output | Enforcement |
| --- | --- | --- | --- |
| Canonical host and entity IDs | `src/seo/site.ts` | JSON-LD and `llms.txt` | Typed route contract plus built-route verifier |
| Route indexability and metadata | `src/seo/routes.ts` | Static route heads and sitemap entries | `assertSeoAuthorityContract` and exhaustive `dist/**/index.html` checks |
| Entity and page schema | `src/seo/schema.ts` | One JSON-LD graph per generated route | Source-graph validation plus post-build graph validation |
| Sitemap and `llms.txt` | `src/seo/generatedPublicFiles.ts` | `public/sitemap.xml`, `public/llms.txt`, and copied `dist` files | Exact-byte generated-file verifier plus post-build checks |
| Crawler policy | `src/seo/machineReadableAuthority.ts` | `public/robots.txt` | Exact-byte verification against `buildRobotsText` |
| Static HTML | `src/seo/routes.ts`, `src/seo/schema.ts`, and existing static generator | `dist/**/index.html` | Exhaustive canonical/indexability/schema verifier |

`scripts/generate-public-files.ts` writes the sitemap and `llms.txt`, but it does not currently write `robots.txt`. That script was outside this lane’s allowed files. `public/robots.txt` is therefore a verified snapshot of the typed renderer: drift fails `verify:generated`, but remediation remains manual unless the generator is extended in a separate scoped change.

## Authority and schema contract

The canonical entity IDs now live together:

- Person: `https://sulayman-bowles.dev/about#sulayman-bowles`
- WebSite: `https://sulayman-bowles.dev/#website`
- Atlas software: `https://sulayman-bowles.dev/atlas#software`
- Void Agency organization: `https://sulayman-bowles.dev/#void-agency`

The Organization logo now uses the site favicon while WebPage `primaryImageOfPage` uses a separate primary-image entity. This avoids treating the social preview image as the organization logo.

For every indexable route, the source contract requires one canonical Person, WebSite, and WebPage node. Article routes additionally require one canonical Article node whose URL and `@id` converge with the route, whose author and publisher resolve to the canonical Person, and whose `dateModified` equals the sitemap `lastmod`.

The contract validates structure and internal consistency. It does not independently prove that time-sensitive biography, employment, education, product status, or performance statements are true. Those facts remain owned by the existing content sources, which this lane did not edit.

## Crawler-policy Q/A

### Which crawlers are permitted?

The existing permissive semantics are preserved. `User-agent: *` allows public crawling generally, and named groups make the intended roles explicit:

- conventional search: Googlebot, Bingbot, DuckDuckBot;
- AI answer search: OAI-SearchBot, Claude-SearchBot, PerplexityBot;
- user-triggered retrieval: ChatGPT-User, Claude-User, Perplexity-User;
- model development: GPTBot, ClaudeBot.

All groups receive `Allow: /`. This is a public-crawl preference, not evidence that any provider has crawled or used a page.

### Does `robots.txt` protect private content or enforce noindex?

No. The file explicitly says it is advisory rather than access control. Google’s documentation likewise says robots rules manage crawler access and should not be used to keep private content out of search. Sensitive content requires authentication or server-side authorization. Pages must remain crawlable for a robots meta `noindex` directive to be observed. See [Google’s robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro) and [robots meta documentation](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

### Do user-triggered agents always follow `robots.txt`?

No uniform assumption is safe. OpenAI says robots rules may not apply to ChatGPT-User because requests are user initiated. Perplexity says Perplexity-User generally ignores robots rules. Anthropic documents its three named bots and says they honor robots directives. The site records the permission preference, while the verifier prevents that preference from being misrepresented as enforcement. See [OpenAI crawler roles](https://developers.openai.com/api/docs/bots), [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), and [Perplexity crawler guidance](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

### Does allowing a crawler authenticate it?

No. A User-Agent string is self-asserted. The `llms.txt` contract directs operators to combine log User-Agent observations with current provider-published IP ranges where available. Even a verified request proves only a request from the documented infrastructure, not indexing, model use, answer inclusion, or citation.

## `llms.txt` Q/A

### What does `llms.txt` do here?

It is a curated context index. It identifies canonical pages, public evidence files, entity roles, crawler intent, indexability boundaries, and interpretation limits. File-list entries now use descriptive Markdown links, and the document starts with the H1-plus-blockquote shape proposed by [llmstxt.org](https://llmstxt.org/).

### What does it not do?

It is not access control, a formal indexing directive, a ranking signal, a permission grant, or a guarantee that a crawler or model will fetch, use, trust, or cite the file. The proposal remains open for community input and is designed to coexist with established mechanisms such as `robots.txt` and XML sitemaps.

### How are source roles bounded?

The About page owns the Person entity. The site root owns WebSite context. Resume owns the current professional record, Work owns the selected public portfolio, Research owns the article index, GitHub is code evidence, LinkedIn is a corroborating professional profile, and the `.tech` host is a separate technical ledger. Controlled external profiles corroborate identity; they do not prove every claim attached to the person or products.

## Noindex and canonical Q/A

### What is the indexable inventory?

The typed route registry currently yields 35 indexable canonical routes. Every one must appear exactly once in the sitemap and have generated static HTML with:

- a self-referencing canonical;
- `index,follow`;
- a matching `og:url`;
- one schema graph with the canonical Person, WebSite, and WebPage;
- Article identity and date convergence where applicable.

### What stays outside the sitemap?

Two source-defined routes are explicitly `noindex` and statically generated so crawlers can read the directive. The generated 404 is also `noindex`. The post-build verifier requires these routes to stay out of the sitemap and to emit `noindex,nofollow`.

### Is noindex a privacy boundary?

No. It is an indexing instruction for compliant search crawlers. The URL remains publicly fetchable, linkable, and potentially observable. Confidential or access-restricted material requires server-side controls.

## Schema-drift Q/A

### What drift is caught before build?

The typed contract checks route shape, path ownership, alias collisions, sitemap/noindex coherence, date validity, canonical entity IDs, duplicate schema IDs, Person evidence consistency, WebSite publisher, WebPage ownership, resolvable main entities, and Article URL/date/author/publisher alignment.

### What drift is caught after build?

The JavaScript verifier discovers every generated route rather than relying on a hand-maintained sample list. It compares the built canonical, robots meta, description, title, `og:url`, `llms.txt` alternate, schema graph, and Article dates with the public sitemap. It also verifies the crawler roster, exact permissions, `llms.txt` structure and internal links, and byte equality for copied root crawl files.

## Unknowns and residual risks

- This lane did not deploy or inspect production. CDN rewrites, content types, response headers, WAF rules, live redirects, caching, and root-file delivery remain unverified.
- Provider crawler roles and IP ranges can change. The policy was reviewed against current official documentation on 2026-07-30; the published CSV retains its own older row-level verification dates and should be refreshed in its owning lane.
- `User-agent: *` is intentionally broad and allows unlisted crawlers. `robots.txt` cannot compel compliance.
- Public PDFs, CSVs, JSON files, and images are outside the HTML robots-meta contract. If a non-HTML asset needs exclusion, an `X-Robots-Tag` or access-control change belongs in the hosting layer.
- The source contract validates schema consistency, not external truth. Time-sensitive profile facts still require evidence review in their owning content files.
- `scripts/generate-public-files.ts` does not materialize `robots.txt`; exact verification prevents silent drift, but generation is not yet one-command complete.
- Passing repository checks does not establish search-engine selection of canonicals, index coverage, ranking, traffic, or AI citation outcomes.

## Validation

The final lane validation uses:

- `node --check scripts/verify-ai-search-seo.mjs`
- `npm run lint`
- `npm run build`
- `npm run verify:generated`
- `npm run verify:seo`
- `npm run verify:articles`
- `npm run verify:article-ranking`
- `npm run verify:internal-links`
- `git diff --check`

The build is justified because the change alters TypeScript schema sources, generated root crawl files, and the post-build static-route contract. Article and internal-link checks are included because sitemap and Article schema coherence changed. These are local contract checks only; no live provider or production checks are implied.

## Integration recommendation

Cherry-pick the lane commit into the integration owner’s clean worktree, resolve any overlapping `src/seo/**` changes by preserving the canonical IDs and contract assertions, then rerun the validation list above. Before release, separately verify root-file content types and bytes on the intended preview/production host. A follow-up may add `buildRobotsText()` to `scripts/generate-public-files.ts`; that file was intentionally left untouched because it was outside this lane’s ownership.
