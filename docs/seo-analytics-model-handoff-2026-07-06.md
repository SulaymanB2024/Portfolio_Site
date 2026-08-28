# SEO and Analytics Handoff for Stronger Model Review

Prepared: 2026-07-06

Repo: `/Users/sulaymanbowles/Documents/Codex/Portfolio_Site`

Branch: `codex/link-building-authority-pack`

Remote: `https://github.com/SulaymanB2024/Portfolio_Site.git`

Current HEAD: `1470c6c` (`fix(seo): strengthen article crawl surfaces`)

Live canonical host: `https://sulayman-bowles.dev`

## Purpose

This summary is meant to be sent to a stronger model for strategic review and planning. It summarizes the meaningful SEO, AI-search, link-building, and analytics work that exists in this checkout and on the live site, while keeping claim boundaries explicit.

The core question for review:

> Given the current crawlable architecture, source graph, public proof assets, authority/link-building system, and available analytics artifacts, what should Sulayman prioritize next to improve legitimate search visibility without overclaiming rankings, DR movement, traffic, revenue, or AI citations?

## Current Surface Proof

- `pwd`: `/Users/sulaymanbowles/Documents/Codex/Portfolio_Site`
- Repo root: `/Users/sulaymanbowles/Documents/Codex/Portfolio_Site`
- Git state before writing this file: clean on `codex/link-building-authority-pack`, tracking `origin/codex/link-building-authority-pack`.
- Relevant local safety policy: this checkout is inside `/Users/sulaymanbowles/Documents/Codex`, an iCloud-synced area. Do not run persistent dev servers, install dependencies, or leave large generated artifacts here unless explicitly requested.
- Running server scan: no Portfolio_Site dev server was found. A separate Project Delta Vite server was running under `/Users/sulaymanbowles/Projects/Project Delta`.
- User supplied no attachments for this request; the only pasted file was the AGENTS/local execution policy.

## Executive Summary

The site has moved from a visual portfolio toward a crawlable, source-backed identity and search-visibility system. The strongest work is not generic keyword stuffing. It is the combination of:

- Static route HTML generation for crawlable heads, canonical URLs, meta descriptions, JSON-LD, visible fallback content, and sitemap output.
- A canonical entity/source graph anchored at `/ai-information#sulayman-bowles`.
- `robots.txt`, `llms.txt`, sitemap, AI crawler allowances, and source files aligned around the same public identity.
- Public research assets that create legitimate citation targets: Atlas crawl sample, crawler-policy source map, Austin crawlability pilot, authority asset index, markets/finance research files.
- A link-building authority pack with rules, trackers, launch drafts, external checks, and measured owned-surface links.
- A small public Austin crawlability benchmark that is usable as a public-data hook, but explicitly not a ranking, traffic, AI-citation, or site-health claim.

Current measurable validation from this turn:

- `npm run linkbuilding:live-check`: passed, 7/7 live authority-pack checks on `https://sulayman-bowles.dev`.
- `npm run linkbuilding:external-check`: passed, 24 verified rows checked, 0 failed, 10 pending account/editorial blockers.
- `npm run linkbuilding:scope-check`: passed, 45 publish-manifest files, 0 dirty files.
- `npm run submit:indexnow -- --dry-run`: passed, 25 URLs selected for IndexNow submission payload. No live IndexNow submission was sent in this turn.

Full lint/build/`verify:seo` was not run in this turn because the request was a summary request and this checkout is in the iCloud-synced Documents tree. The repo's intended full verification ladder remains `npm run lint && npm run build && npm run verify:seo && git diff --check`.

## SEO Architecture

### Static Route Generation

Primary files:

- `package.json`
- `scripts/generate-static-routes.ts`
- `src/seo/routes.ts`
- `src/seo/schema.ts`
- `src/seo/site.ts`
- `src/seo/staticContent.ts`
- `scripts/verify-ai-search-seo.mjs`

Meaningful work:

- `npm run build` runs `vite build && tsx scripts/generate-static-routes.ts`, so the production build writes route-specific static HTML into `dist`.
- Static generation replaces each route's `<head>` with route-specific title, meta description, canonical URL, robots directive, OG/Twitter tags, `llms.txt` alternate link, and JSON-LD.
- Static generation injects visible fallback HTML under `#seo-static-summary`, then hides that fallback when JS runs. This gives crawlers and no-JS readers meaningful page content instead of only a client shell.
- Static generation writes clean route outputs and `.html` fallback files for deep routes.
- Static generation writes `dist/sitemap.xml` from `getCanonicalRoutes()`.
- `public/sitemap.xml` currently lists 19 canonical public URLs, including core pages and 3 public markets/research articles.
- `robots.txt` allows public crawling, points to `https://sulayman-bowles.dev/sitemap.xml`, and explicitly allows major search plus selected AI/search crawlers.

Important route controls:

- Canonical domain is `https://sulayman-bowles.dev`.
- Canonical person ID is `https://sulayman-bowles.dev/ai-information#sulayman-bowles`.
- `SITE_LASTMOD` is `2026-07-05`.
- Core canonical routes include `/`, `/work`, `/about`, `/simple`, `/atlas`, `/atlas/sample-crawl`, `/resume`, `/ai-information`, `/research`, `/sitemap`, `/method`, `/void-agency`, `/contact`, `/austin-technical-seo`, `/case-studies/technical-seo-audit`, `/markets`, and the public markets articles.
- Legacy/alternate paths are redirected in `vercel.json`: `/projects/atlas`, `/atlas/sample-run`, `/audit-intake`, `/austin-seo`, `/technical-seo-case-study`, `/book`, `/cv`, `/resume.html`, `/official-information`, `/entity-profile`, `/source-information`, `/research-assets`, and old resume/PDF variants.
- The temporary Atlas animation route is generated but `noindex`.
- Archived market notes are generated with `noindex,nofollow` and excluded from the sitemap.

### Verification Contract

`scripts/verify-ai-search-seo.mjs` is the strongest local SEO contract. It checks:

- All major route files under `dist`.
- Canonical Person schema exists and old `/#person` ID does not return.
- Person `sameAs`, `subjectOf`, logo, identifier, WebSite, WebPage, and route-specific schema graph consistency.
- Void Agency Organization schema appears only on intended material routes.
- Atlas SoftwareApplication schema appears on intended routes.
- Title length and meta description length.
- Exactly one static H1 per checked route.
- Visible fallback text for AI-information, research, about, resume, Atlas, work, contact, sample crawl, case study, Austin page, Void Agency, Method, and markets pages.
- Hidden visible-text boundaries so internal artifact labels like `Authority asset JSON`, `llms.txt reference file`, and `Ahrefs Domain Rating` do not leak into visible page copy.
- Public asset existence and file signatures for PDF/CSV assets.
- Research `ItemList`, AI-information source graph, fan-out query map, provider discovery plan, Atlas checks, and method checklist sizes.
- `llms.txt` facts, robots crawler allowances, sitemap parity, legacy redirects, archived noindex pages, and market article schema.

## Canonical Identity and Source Graph

Primary files:

- `src/seo/site.ts`
- `src/content/aiInformation.ts`
- `src/content/evidenceLists.ts`
- `src/seo/schema.ts`
- `public/llms.txt`

Meaningful work:

- The site now has one canonical person/source-graph identity: `https://sulayman-bowles.dev/ai-information#sulayman-bowles`.
- The current identity line is: UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, search visibility, and finance research.
- The AI-information page reconciles older public classical music/composition sources with the current McCombs, Atlas, technical SEO, search visibility, and finance research positioning.
- `personSchema()` includes `sameAs` for LinkedIn, GitHub, Devpost, and the technical ledger at `sulayman-bowles.tech`.
- `personSchema()` includes `subjectOf` references for the profile context page, GitHub, Devpost, Void Agency, technical ledger, historical music sources, and project/service pages.
- `publicSourceGraph` maps what each source proves and what should not be inferred.
- `fanOutQueryMap` maps likely search questions to the best page, missing content, and recommended edits.
- `providerDiscoveryPlan` lists provider-specific next actions for Google, Bing/Copilot, Brave, DuckDuckGo, ChatGPT/OpenAI retrieval, Claude, and Perplexity.

Important claim boundaries:

- Do not frame Sulayman as scattered across unrelated interests. The thesis is technical SEO plus Atlas plus finance research judgment.
- Do not describe Atlas as a generic content-writing product.
- Do not describe Void Agency as social media or paid ads.
- Do not infer private clients, private rankings, private traffic movement, revenue impact, or business outcomes without public evidence.
- Treat reference files, metadata, and crawler access as supporting context, not proof of rankings, traffic, revenue, backlinks, or AI citations.

## AI Search and Crawler Readiness

Primary files:

- `public/robots.txt`
- `public/llms.txt`
- `src/content/aiInformation.ts`
- `src/content/evidenceLists.ts`
- `src/content/researchAssets.ts`
- `public/research/ai-search-crawler-policy-sources.csv`

Meaningful work:

- `robots.txt` allows `*`, Googlebot, Bingbot, DuckDuckBot, OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User.
- `llms.txt` gives a compact machine-readable reference: official site, reference page, canonical person ID, sitemap, last updated date, current summary, primary pages, research articles, public reference assets, crawler/indexation signals, provider discovery plan, source roles, and clarifications.
- `public/research/ai-search-crawler-policy-sources.csv` includes 10 source rows, including official docs for OpenAI, Anthropic, Perplexity, Google robots/canonical/link/spam/AI guidance, IndexNow, and Ahrefs DR.
- The AI crawler-policy material is explicitly framed as crawler-access/source-page readiness, not guaranteed AI Overview inclusion, ChatGPT/Claude/Perplexity citation, indexing, ranking, or DR movement.

## Public Content and Quality Hardening

Meaningful work from current files and prior rollout memory:

- Thin public routes were hardened with more substantive proof/process content, not just metadata.
- Static fallback copy was mirrored into `src/seo/staticContent.ts` so crawler/no-JS content stays aligned with visible React pages.
- Internal artifact links and overt SEO-source labels were hidden from visible pages where they made the site feel documentation-like or overly SEO-explicit.
- The live/source/static review path previously included Google high-quality-site guidance, Firecrawl/live-render checks with fresh-cache behavior, and route hardening.
- Archived market memo routes are generated with `noindex,nofollow` and excluded from the sitemap instead of remaining thin indexable pages.
- Recent SEO-related commits show the work progression:
  - `1470c6c fix(seo): strengthen article crawl surfaces`
  - `e84f645 fix(seo): canonicalize person source graph id`
  - `b5c79b3 fix(site): hide SEO source artifacts from visible pages`
  - `b38115b fix(seo): harden crawlable quality surfaces`
  - `44db8c4 chore(site): harden public metadata and intake flow`
  - `60df6dc fix(site): harden public surface and style system`
  - `cfbba5e fix(site): canonicalize urls and transition header tone`
  - `7582df8 feat(portfolio): publish authority pack and polish surfaces`

## Public Linkable Assets

Primary files:

- `src/content/researchAssets.ts`
- `public/research/authority-assets.json`
- `README.md`
- `docs/link-building/authority-playbook.md`

The public authority asset index currently lists 13 assets:

1. Research Asset Index: `https://sulayman-bowles.dev/research`
2. Project Work Index: `https://sulayman-bowles.dev/work`
3. AI Crawler Robots.txt Guide: GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot: `https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy`
4. Atlas Sample Crawl Run: `https://sulayman-bowles.dev/atlas/sample-crawl`
5. Atlas SEO Audit Console: `https://sulayman-bowles.dev/atlas`
6. Technical SEO as Public Data Infrastructure: `https://sulayman-bowles.dev/research/search-console/technical-seo-public-data-infrastructure`
7. Canonical Identity for Personal SEO: `https://sulayman-bowles.dev/research/personal-seo/canonical-identity-personal-seo`
8. Technical SEO Audit Case Study: `https://sulayman-bowles.dev/case-studies/technical-seo-audit`
9. Austin Technical SEO: `https://sulayman-bowles.dev/austin-technical-seo`
10. Austin Crawlability Benchmark Pilot: `https://sulayman-bowles.dev/research/austin-crawlability-benchmark-pilot.csv`
11. AI Information Source Record: `https://sulayman-bowles.dev/ai-information`
12. Markets Research: `https://sulayman-bowles.dev/markets`
13. HTML Resume: `https://sulayman-bowles.dev/resume`

Public downloadable/supporting assets:

- `public/research/authority-assets.json`
- `public/research/ai-search-crawler-policy-sources.csv`
- `public/research/austin-crawlability-benchmark-pilot.csv`
- `public/research/austin-crawlability-benchmark-summary.json`
- `public/research/atlas-sanitized-crawl-sample.csv`
- `public/research/appian-enterprise-software-durability-memo.pdf`
- `public/research/appian-assumptions-table.csv`
- `public/Sulayman_Bowles_Resume.pdf`

Claim boundaries on these assets:

- They do not claim rankings, indexing, traffic movement, revenue impact, AI citations, backlinks, Ahrefs DR movement, or private client outcomes.
- They are meant to support source clarity, outreach, and citation-worthiness.
- Links should be earned editorially. Paid/exchanged/automated/low-quality links should not count as wins.

## Link-Building and Authority Work

Primary files:

- `docs/link-building/authority-playbook.md`
- `docs/link-building/prospect-tracker.csv`
- `docs/link-building/live-prospect-evidence.csv`
- `docs/link-building/outreach-outcome-log.csv`
- `docs/link-building/launch-queue.csv`
- `docs/link-building/generated-launch-drafts.md`
- `docs/link-building/generated-outreach-packets.md`
- `docs/link-building/owned-profile-updates.md`
- `docs/link-building/github-owned-repo-opportunities.csv`
- `docs/link-building/completion-audit.md`
- `docs/link-building/publish-readiness.md`
- `scripts/check-link-building-live.mjs`
- `scripts/check-link-building-external.mjs`
- `scripts/check-link-building-publish-scope.mjs`
- `scripts/export-link-building-publish.mjs`
- `scripts/prepare-link-building.mjs`

Operating objective:

- Increase number and quality of relevant referring domains to `https://sulayman-bowles.dev/` without buying links, exchanging links at scale, automated placement, or directory spam.
- DR may move as a side effect, but DR is not the operating target.
- Track outreach/outcomes before making authority claims.

Measurement baseline intended by the playbook:

- Ahrefs: DR, referring domains, linked pages, anchor text, lost/new links.
- Google Search Console: links report, impressions, queries, indexed pages.
- Bing Webmaster Tools: backlinks, crawl/indexation signals, IndexNow status.
- Manual search: unlinked mentions for Sulayman Bowles, SulaymanB2024, Void Agency, Atlas SEO Audit Console, and `sulayman-bowles.dev`.
- Server/analytics data where available: referral sessions, qualified contact form visits, page-level engagement.

Campaigns defined:

1. AI crawler policy citation push.
2. Atlas evidence pack.
3. Austin crawlability benchmark.
4. Entity/profile reconciliation.

Repo tracker state:

- `docs/link-building/prospect-tracker.csv`: 68 data rows.
- `docs/link-building/live-prospect-evidence.csv`: 42 data rows.
- `docs/link-building/outreach-outcome-log.csv`: 34 data rows.
- `docs/link-building/completion-audit.md`: repo work includes playbook, templates, trackers, authority asset index, crawler-policy source map, Austin benchmark, publish manifest, validators, and launch drafts.

Current external verification from this turn:

- `npm run linkbuilding:external-check` passed.
- Verified rows: 24.
- Failed verified rows: 0.
- Pending rows: 10.
- Verified surfaces include GitHub profile, Portfolio_Site repo, Thick-Scraper-VOID- repo, multiple owned GitHub repos pointing to canonical work/markets/Atlas pages, Void Agency `llms.txt`, a legacy Vercel deployment, GitHub Topics SEO status surface, and Devpost.

Important link-building interpretation:

- Most verified GitHub/profile links are nofollow metadata/README links. They are legitimate owned-surface cleanup and source-graph signals, but they do not prove DR movement.
- External editorial work still requires account access, approval, moderation, or legitimate editor relationships.
- Pending blockers include LinkedIn access, old GitHub/domain reclamation, Kaggle access, SEOFOMO login/moderation, Search Engine Land approval, SEJ gated contributor/source pitch, OpenAI community non-promotional review, Austin Business Journal pitch review, Austin Chamber membership access, and an existing-mention relationship path.

## Austin Crawlability Analytics Pilot

Primary files:

- `scripts/build-austin-crawlability-benchmark.mjs`
- `docs/link-building/austin-benchmark-targets.csv`
- `docs/link-building/austin-crawlability-benchmark.md`
- `public/research/austin-crawlability-benchmark-pilot.csv`
- `public/research/austin-crawlability-benchmark-summary.json`

Generated: `2026-06-25`

Sample size: 12 Austin-area technology/business websites:

- BigCommerce
- WP Engine
- NinjaOne
- AlertMedia
- DISCO
- Shipwell
- data.world
- Kasasa
- ZenBusiness
- Self Financial
- Workrise
- Everlywell

Method:

- One public homepage fetch per company.
- One `robots.txt` fetch per final origin.
- One sitemap fetch using the first robots sitemap URL when available, otherwise `/sitemap.xml`.
- Presence/availability checks only, not quality scores or SEO diagnoses.

Aggregate results:

- Homepage fetch OK: 12/12.
- Homepage 2xx or 3xx: 12/12.
- HTTPS final URL: 12/12.
- Title present: 12/12.
- Meta description present: 12/12.
- Canonical present: 12/12.
- H1 present: 11/12.
- JSON-LD present: 12/12.
- Robots request completed: 12/12.
- Robots 2xx or 3xx: 12/12.
- Robots declared sitemap: 10/12.
- Sitemap request completed: 12/12.
- Sitemap 2xx or 3xx: 10/12.
- Measurement gaps: 6/12.

Interpretation boundary:

- This pilot is not representative of all Austin companies.
- Rows do not claim rankings, traffic movement, revenue impact, AI citations, or site health.
- Access-limited, timed-out, or challenged fetches are measurement gaps, not negative findings.
- Use it as aggregate public-web infrastructure evidence, not as a name-and-shame list.

Recommended model review angle:

- Decide whether this pilot should become a stronger public article, repeatable benchmark, or outreach hook.
- Decide whether the sample should be rerun and expanded with Atlas Engine artifacts before pitching local media.
- Decide whether the Austin page should target service-intent conversion, public-data authority, or both.

## Search Console, GA4, Bing, Ahrefs, and Other Analytics

What exists in repo:

- The site and docs repeatedly define GSC/GA4/Ahrefs/Bing as intended measurement surfaces.
- The method/contact/static content describes analytics review as part of the service flow.
- The link-building playbook defines Ahrefs, GSC, Bing Webmaster Tools, manual public search, and server/analytics data as measurement baselines.
- Prior memory says Search Console observations showed strong branded visibility but weak broader query coverage; that drove canonical identity clarity and non-branded discoverability work. Treat that as historical context unless current Search Console is pulled again.

What does not currently exist in this repo:

- No current GSC export.
- No current GA4 export.
- No current Ahrefs DR/referring-domain export.
- No current Bing Webmaster Tools export.
- No current PageSpeed/CrUX export for this site in the checked files.
- No verified traffic, ranking, conversion, AI-citation, or DR movement data.

Suggested data to pull before a serious next plan:

- GSC Performance: queries, pages, countries, devices, search appearance, date range comparison, branded vs non-branded split.
- GSC Pages/Indexing and Sitemap reports.
- URL Inspection for core pages: `/`, `/about`, `/resume`, `/atlas`, `/method`, `/research`, `/ai-information`, `/austin-technical-seo`, `/research/ai-crawlers/ai-search-crawler-policy`.
- GSC Links report.
- Bing Webmaster Tools: sitemap, URL submission/IndexNow status, backlinks, crawl/indexation issues.
- Ahrefs or similar: DR, referring domains, linked pages, anchors, new/lost links.
- GA4: organic sessions, referral sessions from owned surfaces, contact-form events, engagement by page.
- Server/Vercel logs if available: crawler hits, asset requests, redirect behavior.
- Live SERP/manual checks: branded, project, non-branded service, local Austin, and article-title queries.

## IndexNow and Discovery Operations

Primary files:

- `scripts/submit-indexnow.mjs`
- `public/robots.txt`
- `public/sitemap.xml`
- `vercel.json`

Meaningful work:

- Root-hosted IndexNow key file exists in `public/`.
- The script validates that submitted URLs belong to `sulayman-bowles.dev`.
- The default URL list is generated from sitemap URLs plus current PDF resume, `llms.txt`, research hub, authority JSON, crawler-policy source CSV, and Austin benchmark files.
- `docs/link-building/publish-readiness.md` records an earlier successful live IndexNow submission on 2026-06-25 after authority-pack publish.
- Current dry run on 2026-07-06 selected 25 URLs. No live submission was sent in this turn.

## Current Live Validation Results

Run on 2026-07-06:

```bash
npm run linkbuilding:live-check
```

Result:

- OK: true.
- Passed: 7.
- Failed: 0.
- Checked live:
  - `/research`
  - `/research/authority-assets.json`
  - `/llms.txt`
  - `/sitemap.xml`
  - `/research/ai-search-crawler-policy-sources.csv`
  - `/research/austin-crawlability-benchmark-pilot.csv`
  - `/research/austin-crawlability-benchmark-summary.json`

Run on 2026-07-06:

```bash
npm run linkbuilding:external-check
```

Result:

- OK: true.
- Verified rows: 24.
- Checked verified rows: 24.
- Failed verified rows: 0.
- Pending rows: 10.

Run on 2026-07-06:

```bash
npm run linkbuilding:scope-check
```

Result:

- OK: true.
- Publish-file count: 45.
- Dirty-file count: 0.
- Missing publish files: none.
- Dirty outside publish scope: none.

Run on 2026-07-06:

```bash
npm run submit:indexnow -- --dry-run
```

Result:

- Dry run only.
- Endpoint: IndexNow API.
- Submitted URL count in payload: 25.
- No live submission performed.

## Strategic Gaps and Risks

1. Measurement gap: current plan lacks fresh GSC, GA4, Ahrefs, Bing, CrUX/PageSpeed, and SERP evidence.
2. Authority gap: many verified owned-surface links are nofollow and should not be counted as DR movement.
3. Content gap: the site has strong source/identity pages, but the next model should verify whether non-branded pages have enough search intent, proof, and conversion clarity without becoming spammy.
4. Local-data gap: Austin pilot is small and old enough to rerun before any serious pitch.
5. Public tone risk: prior work deliberately hid overly explicit SEO/source-artifact labels from visible pages. Do not reverse that by making the site feel like an SEO dump.
6. Claim-safety risk: reference files, static fallbacks, robots access, IndexNow, and `llms.txt` are discovery/support surfaces. They do not prove indexing, rankings, citations, traffic, or revenue.
7. Branch/live risk: current checkout is on `codex/link-building-authority-pack`, not necessarily `main`. Live public checks passed, but any model planning implementation should verify deployment branch/state before assuming all local files are live.

## Recommended Questions for the Stronger Model

1. What should be the next 30-day SEO plan, split into measurement, content, technical, and authority work?
2. Which current pages are most likely to earn non-branded impressions: `/method`, `/austin-technical-seo`, `/atlas`, `/atlas/sample-crawl`, `/research/ai-crawlers/ai-search-crawler-policy`, `/research`, or `/case-studies/technical-seo-audit`?
3. Which assets should be strengthened before outreach so they can earn legitimate editorial links?
4. Should the Austin crawlability pilot be expanded into a proper public report, and if so, what sample size, methodology, and claim boundaries should it use?
5. What data exports should be pulled from GSC, GA4, Bing, Ahrefs, and server logs before deciding content priorities?
6. How should the site balance personal identity, Atlas product proof, Void Agency service conversion, and finance/markets research without diluting topical clarity?
7. Which link-building opportunities are highest quality and lowest risk, given that no paid/exchanged/spam placements are allowed?
8. What should be removed, softened, or consolidated because it reads as over-optimized or too explicit?
9. Which verifiers or tests should be added before future SEO changes ship?
10. What claims can be made publicly right now, and what claims require more evidence?

## Copy-Paste Prompt for Stronger Model

You are reviewing the SEO, AI-search readiness, public authority, and analytics state of `https://sulayman-bowles.dev`. Use the summary below as evidence, not as a guarantee of performance.

Goals:

- Produce a practical next plan for legitimate search visibility growth.
- Separate technical/crawl readiness from ranking, traffic, DR, and AI-citation evidence.
- Do not recommend paid links, link exchanges, spam directories, unsupported claims, or public claims about private clients/performance.
- Prioritize actions that can be verified with GSC, GA4, Bing Webmaster Tools, Ahrefs, live crawl/render checks, or repo verifiers.
- Preserve the public tone: portfolio/source-backed and human-readable, not an obvious SEO artifact dump.

Current state:

- Site has route-specific static HTML, sitemap, robots, JSON-LD, canonical URLs, visible fallback content, `llms.txt`, `/ai-information`, public source graph, public research assets, and authority/link-building docs.
- Canonical identity is `https://sulayman-bowles.dev/ai-information#sulayman-bowles`.
- Current thesis is UT Austin McCombs, Atlas, technical SEO/search visibility, Void Agency, and finance research.
- Authority assets include `/research`, `/atlas`, `/atlas/sample-crawl`, `/research/ai-crawlers/ai-search-crawler-policy`, `/research/search-console/technical-seo-public-data-infrastructure`, `/research/personal-seo/canonical-identity-personal-seo`, `/case-studies/technical-seo-audit`, `/austin-technical-seo`, `/ai-information`, `/markets`, and `/resume`.
- Current live validation passed for research hub, authority JSON, `llms.txt`, sitemap, crawler-policy source CSV, Austin benchmark CSV, and Austin benchmark summary JSON.
- Current external-link verification passed for 24 verified rows with 0 failures; most are owned GitHub/profile surfaces and many are nofollow.
- Austin crawlability pilot has 12 companies, 100% homepage fetch/title/meta/canonical/JSON-LD/robots availability, 11/12 H1 present, 10/12 robots-declared sitemap, 10/12 sitemap 2xx/3xx, and 6/12 measurement gaps.
- No current GSC, GA4, Ahrefs, Bing Webmaster Tools, PageSpeed/CrUX, traffic, ranking, conversion, AI-citation, or DR movement export is included here.

Task:

Create a prioritized plan with:

1. Measurement/data to pull first.
2. Highest-impact technical cleanup or verification.
3. Content/page improvements by route.
4. Authority/link-building next actions with risk boundaries.
5. Austin benchmark next step.
6. What not to do.
7. Evidence required before making any public claim.
