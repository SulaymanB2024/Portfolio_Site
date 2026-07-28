# Link-Building Authority Playbook

Last updated: 2026-07-23

## Objective

Increase the number and quality of relevant referring domains to `https://sulayman-bowles.dev/` without buying links, using link exchanges, or creating low-quality directory spam.

The primary goal is durable topical authority around technical SEO, AI-search visibility, Atlas, crawl evidence, source graphs, and finance/data research. Ahrefs Domain Rating can move as a side effect, but DR is not the operating target.

## Ground Rules

- Do not buy links, exchange links at scale, use automated placement, or ask for keyword-stuffed anchors.
- Prefer editorial links from real pages that cite a specific asset.
- Ask for branded or descriptive anchors, not manipulative commercial anchors.
- Keep every claim tied to a public source. Do not imply private client outcomes, ranking gains, traffic gains, revenue impact, or AI citation success.
- Treat nofollow links as useful for visibility and referrals, but do not count them as DR-moving evidence.
- Track outreach and outcomes before making any authority claims.

## Measurement Baseline

Use these sources before and after each campaign:

- Ahrefs: DR, referring domains, linked pages, anchor text, lost/new links.
- Google Search Console: Links report, impressions, queries, indexed pages.
- Bing Webmaster Tools: backlinks, crawl/indexation signals, IndexNow status.
- Manual public search: unlinked mentions of `Sulayman Bowles`, `SulaymanB2024`, `Void Agency`, `Atlas SEO Audit Console`, and `sulayman-bowles.dev`.
- Server or analytics data where available: referral sessions, qualified contact form visits, and page-level engagement.

Store working rows in `docs/link-building/prospect-tracker.csv`.

## Deployment Gate

Run the live verifier after deployment and before outreach:

```bash
npm run linkbuilding:scope-check
npm run linkbuilding:export-publish
npm run linkbuilding:live-check
```

The scope checker verifies that only link-building publish files are being staged/deployed from the current worktree. If the current checkout is mixed, the exporter writes `output/link-building-publish/` with only manifest-approved files so the set can be applied to a clean branch/worktree. The live checker verifies that `/research`, the authority asset JSON, `llms.txt`, `sitemap.xml`, the crawler-policy source map, and the Austin benchmark assets are actually live on `https://sulayman-bowles.dev`. If either gate fails, do not send outreach or submit IndexNow yet; the pitch targets would be citing unpublished, stale, or unrelated worktree state.

## Primary Linkable Assets

| Priority | Asset | URL | Why it can earn links |
| --- | --- | --- | --- |
| 1 | Research asset index | `https://sulayman-bowles.dev/research` | Human-readable hub for the citation-ready pages, data files, source maps, and claim boundaries. |
| 1 | AI-search crawler policy note | `https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy` | Timely, source-backed explanation of AI crawler policy, robots, IndexNow, and source-page clarity. |
| 1 | Atlas sample crawl run | `https://sulayman-bowles.dev/atlas/sample-crawl` | Public evidence artifact with CSV, URL rows, indexability, internal links, canonicals, and issue labels. |
| 1 | Atlas project page | `https://sulayman-bowles.dev/atlas` | Canonical project page for the crawl evidence system and related public code. |
| 2 | Technical SEO as public data infrastructure | `https://sulayman-bowles.dev/research/search-console/technical-seo-public-data-infrastructure` | Strong editorial bridge between SEO, source quality, structured data, and data infrastructure. |
| 2 | Canonical identity for personal SEO | `https://sulayman-bowles.dev/research/personal-seo/canonical-identity-personal-seo` | Useful for personal-site/profile cleanup, stale PDFs, sameAs discipline, and source graph consistency. |
| 2 | Technical SEO audit case study | `https://sulayman-bowles.dev/case-studies/technical-seo-audit` | Sanitized case-study logic without private client claims. |
| 3 | Austin technical SEO page | `https://www.void-agency.com/` | Local-service surface for Austin/startup/business-context citations. |
| 3 | Austin crawlability benchmark pilot | `https://sulayman-bowles.dev/research/austin-crawlability-benchmark-pilot.csv` | Local public-data hook for Austin media and startup/web-infrastructure conversations. |
| 3 | AI information source graph | `https://sulayman-bowles.dev/ai-information` | Canonical identity/source page for profile, AI retrieval, and entity reconciliation links. |
| 1 | Texas toll-road ownership guide | `https://sulayman-bowles.dev/markets/who-owns-texas-toll-roads` | Answer-first ownership explainer with public/private distinctions, project-level source records, and preserved investor analysis. |
| 1 | Texas toll-road ownership CSV | `https://sulayman-bowles.dev/research/texas-toll-road-ownership-2026.csv` | Citation-ready facility matrix for physical owner, operator, revenue claimant, concession rights, term, billing, evidence date, and source IDs. |

The human-readable public hub is `https://sulayman-bowles.dev/research`. The machine-readable public asset index is `public/research/authority-assets.json`.

## Campaigns

### Campaign 1: AI Crawler Policy Citation Push

Target page: `/research/ai-crawlers/ai-search-crawler-policy`

Audience:

- Technical SEO newsletters.
- AI-search and answer-engine writers.
- Web developers writing about robots, crawlers, or `llms.txt`.
- Search consultants maintaining AI visibility resources.

Offer:

- A concise, source-backed explainer.
- A public source CSV at `/research/ai-search-crawler-policy-sources.csv`.
- A claim boundary: crawler access is a discovery condition, not a guarantee of ranking, indexing, AI citation, or model inclusion.

Success criteria:

- 5 relevant mentions.
- 2 editorial links from SEO/web/AI publications or communities.
- 1 update to an existing AI crawler resources page, if legitimate.

### Campaign 2: Atlas Evidence Pack

Target pages: `/atlas`, `/atlas/sample-crawl`, GitHub repo.

Audience:

- Technical SEO practitioners.
- Open-source SEO/tooling lists.
- Web performance and crawlability writers.
- Student founder and builder communities.

Offer:

- Sanitized crawl sample CSV.
- Project page explaining Atlas as a crawl and evidence system.
- Public code repo as evidence for implementation work.

Success criteria:

- GitHub profile and repository descriptions point to the correct canonical pages.
- 3 to 5 relevant community/resource links.
- 1 detailed write-up or demo shared with a technical audience.

### Campaign 3: Austin Crawlability Benchmark

Target pages: `https://www.void-agency.com/` for commercial/local intent, `/method` for personal methodology, and `/research/austin-crawlability-benchmark-pilot.csv` for the bounded public-data asset.

Audience:

- Austin startup/business publications.
- UT/McCombs entrepreneurship groups.
- Local founder communities.
- Web agencies that serve Austin B2B teams.

Offer:

- Aggregate crawlability study of Austin B2B/startup sites.
- No private shaming, no client claims, no unsupported traffic/ranking claims.
- Practical checklist for crawler access, sitemap hygiene, internal links, structured data, and source clarity.

Success criteria:

- 1 benchmark page published.
- 5 local/editorial outreach attempts.
- 2 local or university-related links.

### Campaign 4: Entity and Profile Reconciliation

Target pages: `/ai-information`, `/resume`, `/about`.

Audience:

- Owned profiles and existing public sources.
- UT/student org pages where a legitimate profile or source link can be added.
- GitHub, LinkedIn, Devpost, Medium/Substack, Kaggle, and other public profiles already tied to the person or work.

Offer:

- One consistent identity line.
- One canonical source page.
- Clean links to current work instead of stale PDFs or old positioning.

Success criteria:

- All owned profiles use one current identity line.
- Old resume or project links point to `/resume`, `/ai-information`, `/atlas`, or `/method`.
- Existing unlinked mentions have been checked and logged.

### Campaign 5: Texas Toll-Road Ownership Citation Asset

Target pages: `/markets/who-owns-texas-toll-roads` and `/research/texas-toll-road-ownership-2026.csv`.

Audience:

- Texas transportation and public-accountability reporters.
- Road, tolling, P3, municipal-finance, and infrastructure-investment publications.
- University transportation centers, research libraries, and legitimate public resource pages.
- Existing toll-road explainers or reporting that would benefit from a current facility-level ownership and billing reference.

Offer:

- A nine-row ownership lookup separating pavement title, operator, toll-revenue claimant, concessionaire, term, private-rights status, and billing agency.
- A downloadable CSV generated from the same typed source as the visible and static article.
- A 26-source ledger, explicit evidence dates, corrections invitation, and a clear non-official/non-peer-reviewed boundary.

Prohibited:

- Paid links, exchanges, private blog networks, mass submissions, fabricated affiliations, and forced exact-match anchors.
- Claims that publication, outreach, reindexing, impressions, or a new referring domain proves a ranking outcome.
- Sending any draft without exact recipient and batch approval.

Working files:

- `docs/link-building/texas-toll-road-prospects.csv`
- `docs/link-building/texas-toll-road-outreach-drafts.md`

Success criteria:

- 30 qualified prospects researched.
- 15 exact pitches prepared and batch-approval gated.
- 5 relevant new referring domains within 90 days.
- At least 2 placements from transport, academic, government-adjacent, or established editorial sources.
- Outcomes verified in the tracker before any referring-domain or ranking claim is made.

## Outreach Workflow

1. Pick one campaign and one target page.
2. Add prospects to `docs/link-building/prospect-tracker.csv`.
3. Confirm each prospect is real, relevant, and not a paid/spam placement.
4. Personalize one concise email from `docs/link-building/outreach-templates.md`.
5. Send manually from an approved account.
6. Log date sent, outcome, linked URL, anchor text, and whether the link is followed.
7. Recheck Ahrefs, GSC, and Bing after 2 to 6 weeks.

## Completion Definition

This repository can prepare the link-building system, assets, and tracker. External completion requires human/account actions:

- profile edits in external accounts,
- outreach sends,
- publication approvals,
- link placements,
- Ahrefs/GSC/Bing measurement after crawling.

Do not mark an external campaign complete until the tracker has real sent dates and verified link outcomes.
