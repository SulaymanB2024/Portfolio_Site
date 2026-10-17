# Programmatic SEO Growth Sprint

## October 17, 2026 — exposure, technical SEO and motion delivery

The current pass is complete locally on `codex/site-exposure-20261017`, based on merged secondary-page main `e51489166f3d17967ad62c878aacdc9a52a049b4` (MR #105). Root owns integration and this continuation record. The July sprint below is historical. [The current review](reviews/search-exposure-20261017/README.md) contains exact checks, native measurements, preserved-asset evidence and unedited desktop/phone captures; [the exposure plan](reviews/search-exposure-20261017/exposure-opportunities.md) records eleven verified opportunities, venue gates, deduplication and actual public states.

Accepted scope and preservation: improve exposure, structured data, technical SEO, AEO/GEO and measured performance; commission an independent whole-site motion audit. Retain paper/ink/Syne/Newsreader, the original helmet/engraving, all model bytes, Chegg→Sapien→VOID→Experiments and Atlas within VOID, meaningful continuous motion/manual orbit/reset, reduced/offscreen behavior, native/hash/history/focus, the complete résumé/PDF and all 85 dated manuscripts/source cutoffs. No fabricated schema, dates, license, endorsement, financial return, backlink or indexation success; no blanket quality/FPS reductions.

Implemented: 106 user-path BreadcrumbLists, truthful Dataset/DataDownload nodes for three existing CSV tables, a shared visible Texas CSV link, direct canonical initial-HTML destinations, four-family phone-menu suspension, and phase-preserving Print suspension using its exact dialog scrollport and responsive sticky-header exclusion. Root native review caught the first Print observer's tiny intersection behind its opaque header; the final correction holds phase/frames and resumes correctly. Work remains at measured 30 fps on the phone; About, résumé, Contact and Print keep explicit/manual/reduced choices. Dormant flights, parent Print-modal coordination and a new RAF scheduler are not enabled. All 123 GLBs, 85 manuscript JSON files, current PDF and asset manifest match the base; protected public files match the build.

Verified: 756 application tests, 19 bot-observer tests, 28 opening/presentation tests, article-quality/provenance recovery checks, the Texas research library, application/API TypeScript, complete client/SSR/readable build and release/search gates pass. The release validates 107 documents, 82 direct legacy redirects, 3,550 asset references, 85 feed items and 693 source citations. A full current-production crawl found all 107 canonical documents and all 253 linked resources HTTP 200, no orphan documents, valid canonical/metadata/schema and genuine unknown-URL 404/noindex behavior. Final preview has 107 passing documents/248 resources after alias normalization. The dependency audit passes the repository's high-severity threshold with one existing low-severity esbuild Windows-dev-server advisory; dependency versions are unchanged.

Provider work: the site SEO operator remains blocked by an expired September retrospective, so root used the existing authenticated personal Chrome Google/Bing properties without taking over that old cycle. Google's current sitemap was read successfully with 107 discovered URLs, AI inclusion is enabled, and exact featured-URL inspection shows indexing is still incomplete. Chegg passed a live test and received an indexing-request receipt; VOID passed live availability but its request failed because Google's reCAPTCHA service could not connect. Sapien/Experiments were discovered but not indexed. Bing's older sitemap entry was re-submitted once and visibly moved to October 17 / Processing. One IndexNow batch returned HTTP 200 for the verified live inventory. These are receipts/observations, not proof all pages are indexed. Historical mixed URL reports are not divided by 107 to invent a current rate. Private reports and authenticated analytics remain in ignored `.cache/site-exposure-r13/gsc/` and `bing/`; current search/AI evidence prioritizes the existing Texas ownership research. No public analytics payload is committed. CWV has no field data and PageSpeed returned 429; no field-performance score is claimed.

Exposure delivery: [crawler-user-agents PR #472](https://github.com/monperrus/crawler-user-agents/pull/472), commit `05bd13eb3133edc19a6fede05f6fe1475402ad97`, adds one absent official OAI-AdsBot pattern. All 18 upstream Python tests, JSON validation, formatting and collision checks pass. The PR remains open for maintainer review, with no upstream checks reported at the last read. It adds useful contributor-visible work without inserting a promotional site link. Two old directory/feed PRs were confirmed merged October 7; six remain pending. These are prior-work results, not new links today. Full editorial source-note drafts remain in the local research cache. No email/outreach, paid placement, new account, terms acceptance, bulk submission, automatic follow-up or artificial backlink is claimed.

Environment: a near-full Data volume initially caused writes/build failures. Root compressed/hash-verified only its own trace and restarted only its own bounded preview after reclaiming task-generated output; no broad cleanup or other-task takeover. Capacity later recovered externally. Generated test caches are kept out of source delivery. Raw traces/crawl bodies/provider receipts and exact commands remain in `.cache/site-exposure-r13/`. The active preview is task-owned and has a four-hour wall-clock lease, not an indefinite watcher.

Delivery boundary: the source branch is prepared for a new review; this pass has not been merged or deployed. Production last verified remains Vercel deployment `dpl_D1KnNXzTbY7EwuiGE7Lw88U4Kzyy` on main `e51489166f3d17967ad62c878aacdc9a52a049b4`. Next authorized release step requires the new source review and explicit production approval, followed by verification of the deployed head. Indexing, field metrics and external editorial/maintainer acceptance remain external outcomes; do not repeat notifications or old pending directory submissions to manufacture progress.

## Historical July 20 sprint

Prepared July 20, 2026. Google Search Console organic clicks are the KPI. Rankings, indexation, impressions, clicks, leads, and revenue are external outcomes; this release cannot guarantee them.

## Baseline and launch boundary

The supplied pre-release baseline is 1 organic click and 135 impressions in the latest stable seven-day window, with 15 of 16 target articles indexed. This branch preserves that 16-article contract and adds 36 leaf guides plus four collection routes, taking the canonical inventory from 28 to 68 URLs.

The first seven days are an indexation and discovery sprint. The 1,000-click target is a 90-day stretch milestone because 1,000 weekly clicks at a 5% click-through rate requires approximately 20,000 weekly impressions.

## Measurement gates

| Window | Indexation | Weekly non-branded impressions | Weekly organic clicks |
| --- | ---: | ---: | ---: |
| Day 7 | At least 32 of 40 new routes | 1,000 | 25 |
| Day 30 | Monitor useful indexed inventory | 5,000 | 100 |
| Day 60 | Monitor useful indexed inventory | 12,500 | 400 |
| Day 90 | Monitor useful indexed inventory | 20,000 | 1,000 stretch |

Run the read-only report with a stable or fresh-data state:

```bash
npm run report:pseo-growth -- --start YYYY-MM-DD --end YYYY-MM-DD --state final
npm run report:pseo-growth -- --start YYYY-MM-DD --end YYYY-MM-DD --state all
```

The report writes ignored JSON, page CSV, and query CSV files under `output/seo/`. It separates branded and non-branded metrics, rolls up issue/platform/checklist families, compares the previous equal-length period, and records Google-observed URL Inspection state. URL Inspection does not request indexing.

## Release and monitoring sequence

1. Merge and deploy only after explicit production approval.
2. Run all-route HTTP, canonical, metadata, schema, sitemap, and static-head checks against the production host with uncached requests.
3. Run a fresh Firecrawl map and representative leaf/hub scrapes after deployment; do not reuse cached launch evidence.
4. Record URL Inspection state on release day, day 3, and day 7. Inspection observes Google's version and must not be described as an indexing request.
5. Review pages with impressions and average positions 11–30 for snippet clarity and contextual internal-link opportunities before expanding inventory.
6. After 14 days, retain a zero-impression page only when it remains independently useful. Otherwise move its registry state to `noindex` before generating more pages.

## External-action boundary

The authority pack contains eight approval-ready platform drafts and prospect notes. No outreach, community submission, profile edit, IndexNow request, production deployment, or merge is authorized by this document.
