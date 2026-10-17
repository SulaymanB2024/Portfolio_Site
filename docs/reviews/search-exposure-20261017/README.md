# Search, exposure and motion review — October 17, 2026

Branch: `codex/site-exposure-20261017`, based on merged secondary-page main `e51489166f3d17967ad62c878aacdc9a52a049b4`. This report describes verified local changes and the separately audited production baseline. It does not announce a production release or guaranteed indexing.

## Result

- Shared initial-HTML/browser metadata now supplies `BreadcrumbList` for all 106 non-home canonical documents, following the visible Work and Writing reading paths. Existing Person, WebSite, ProfilePage, ContactPage, CollectionPage, Article and image identities remain coherent.
- Three existing CSV tables have truthful Dataset/DataDownload descriptions and visible supporting links: Texas toll-road ownership, the 25-transaction software-buyout cohort, and the Austin home-service ownership table. No reuse license, refreshed research date, company valuation or return is inferred.
- Initial HTML links go directly to known canonical destinations, including historical Research/Markets/Atlas aliases. Queries, source fragments, downloads, external citations, the retained noindex cohort artifact and literal escaped code examples remain intact.
- The four missing 3D families now observe the existing phone-menu motion boundary. Print suspends when its canvas is clipped by the dialog or covered by its sticky header. Both changes retain phase and user playback choices.

The [current Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) supports crawlable, indexable, useful original content and its existing AI inclusion control; it does not call for a separate AI markup layer. This pass retains source-backed answer passages, author identity, citation links, readable initial HTML and the established crawl policy. Breadcrumbs follow [navigation paths](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), and Dataset metadata follows the [actual downloadable research](https://developers.google.com/search/docs/appearance/structured-data/dataset). No FAQ rich-result or AI-citation claim is added.

## Technical verification

| Check | Actual result |
| --- | --- |
| Production sitemap crawl | All 107 canonical documents HTTP 200, matching canonical/title/description/readable content and valid JSON-LD; no orphan documents. |
| Production linked resources | All 253 distinct referenced resources HTTP 200. Five initial noncanonical-link warnings were known aliases/a retained source artifact, not broken documents. |
| Built preview crawl | All 107 canonical documents pass; all 248 referenced resources HTTP 200; no orphans or missing local fragments. Direct canonical links remove the alias-only resource entries. |
| Structured data | 106 breadcrumb trails, 85 Article nodes, three Dataset nodes, coherent person/site/page/image references. Every dataset description and CSV target is visible and resolves to a built file. |
| Application suite | `npm test`: 756/756 pass on final code. |
| Build | `npm run build`: application/API TypeScript checks, client bundle, SSR and 107 readable public documents pass. |
| Release/search | `node tools/verify-release.mjs`: 107 documents, 82 direct legacy redirects, 3,550 asset references, 85 feed entries and 693 source citations pass. |
| Focused Print lifecycle | `node --experimental-strip-types --test tests/print-instrument-lifecycle.test.ts`: 1/1 pass, including sticky-header resize, stale callbacks, partial visibility, explicit hold, reduced/hidden state and disposal. |
| Other repository release checks | `npm run test:bot-observer`: 19/19; `node tools/test-article-opening.mjs`: 28/28; `node tools/verify-article-quality.mjs`, `node tools/verify-restored-articles.mjs`, and `npm run texas:check` pass. `npm audit --audit-level=high` passes, reporting one existing low-severity esbuild Windows-development-server advisory. No dependency change is included. |
| Protected source and build bytes | All 123 GLBs, all 85 manuscript JSON files, the current résumé PDF and portfolio asset manifest match the base; all public protected files also match the built output. |
| Diff | `git diff --check` passes. |

Raw provider reports, logs, crawl bodies, traces and protected-file hashes remain in ignored `.cache/site-exposure-r13/`. Authenticated search analytics and account screenshots are not published in this review. A local SSR-only verification attempt incorrectly reused generated HTML; the release gate rejected it, and the normal complete build passed after restoring the supported command sequence.

Production returned a real noindex 404 for an unknown URL and valid crawler/discovery files. Vite preview's arbitrary-path fallback is not evidence of production HTTP behavior. Google's coverage examples include retired URLs, so they are not divided by the current sitemap size to claim an indexation rate. The historical 404 is unreferenced in the current site and has no verified equivalent destination; it is not redirected to an unrelated page.

## Native motion evidence

Checked at 390×844 and the normal 1280×720 desktop viewport. Measurements use actual paints/phase or visible DOM/canvas output, not a configured target-FPS value. Production-only diagnostic zeros are not treated as frozen-renderer proof.

| Scene | Before / after evidence |
| --- | --- |
| Chegg Menu | Before: 115 additional paints during 3.6 seconds with Menu open. After: frame count 764→764 during three seconds; closing resumes at 788. Same multisampling, geometry and render pixels. |
| Chegg normal motion | 299 paints over 10.102 seconds, rolling 30 fps on the phone; distinct native poses retained. This is a local cadence observation, not mobile field performance. |
| About Menu | Retained ready models and menu suspension flag; two canvas-region images three seconds apart are byte-identical. Escape dismisses the menu and returns its focus. |
| Résumé Menu and Pause | Menu holds renderFrames at 281→281. Closing resumes; explicit Pause survives a later open/close, with one demand paint and no recurring animation. |
| Résumé reduced motion | Switching to Sapien settles at progress 1 and rest; renderFrames 3→3 over 1.5 seconds. Arrow/Home inspection remains usable. |
| Contact Menu and manual control | At a moving field, the visible form control stays at 43% for three seconds with Menu open, then advances to 29% after resuming. Reduced motion disables autoplay while retaining Form, Arrow/Home and Reset; Reset returns 0%. |
| Print clipping | Before: 86 extra paints over three seconds while its figure was entirely behind the phone dialog header. Final: frames 152→152 and phase 0.5701487000000002 unchanged. Arrow return resumes at exactly that phase. Hold retains frames 157→157 and its exact pose; SVG export succeeds. |

Native review caught a real weakness in the first Print intersection implementation: the canvas bottom still geometrically intersected by 8 px behind an opaque 51 px sticky header. The final observer uses the exact dialog root and measured header exclusion, reconnecting only when header height changes and rejecting stale callbacks. This fixes the actual occlusion without raising a visibility threshold or pausing a small genuinely visible sliver.

The dedicated motion audit covered landing, contextual/work GLBs, mechanical project heroes, About/music/chess, résumé, Contact, reader/gallery continuity, navigation arrivals and Print. The bounded accepted changes are menu suspension and Print clipping. Dormant Work flights remain dormant. No model, shader, engraving, material, art formula, sample count, DPR policy, target FPS, text timing or layout was redesigned. Parent-page suppression behind the Print modal and a different RAF scheduler were not justified by a matched measurement in this pass.

## Search-provider and exposure state

Existing authenticated Google and Bing properties were reviewed. Google's sitemap was successfully read with all 107 current URLs, its AI inclusion setting is enabled, and priority URL inspection still identifies indexing gaps. Chegg passed the live test and received an indexing-request receipt. VOID passed the live test, but its request failed when the provider could not connect to reCAPTCHA; no request receipt is claimed. Sapien and Experiments were observed as discovered, currently not indexed. A single IndexNow notification batch for the verified live inventory returned HTTP 200. None of these receipts establishes indexing.

Bing's existing sitemap had an older 82-URL discovery snapshot; its existing entry was re-submitted once and visibly changed to October 17 / Processing. Search/AI and backlink reports were used to prioritize the source-backed Texas ownership research for editorial discovery. Their differing dated inventories and citations are not a current-site indexation percentage, referral traffic or an effect of this patch. Core Web Vitals has no field data; the PageSpeed API returned 429, so no performance score is claimed.

Eleven primary-source exposure opportunities, current accepted/pending placement reconciliation, exact venue gates and the new functional contribution are recorded in [the exposure plan](exposure-opportunities.md). [Crawler-user-agents PR #472](https://github.com/monperrus/crawler-user-agents/pull/472) adds one missing official OAI-AdsBot detection record. Its 18 Python tests, upstream JSON validator, formatting and collision checks pass. It is open for maintainer review; it does not insert a portfolio link, establish a new referring domain or prove ranking/traffic gains. No checks were reported by that upstream PR at the last read.

## Visual review

These are unedited native captures; [the manifest](capture-manifest.json) records their hashes. The first desktop Print capture was taken during its opening fade; it was rejected as delivery evidence and replaced with the settled view below.

- [Desktop Chegg](work-final-desktop.png) and phone [pose A](work-final-phone-a.png) / [pose B](work-final-phone-b.png).
- [Desktop About](about-final-desktop.png) and [phone résumé](resume-final-phone.png).
- [Desktop Contact](contact-final-desktop.png) and [phone manual/reduced state](contact-final-phone.png).
- [Desktop Print](print-final-desktop.png) and [phone Print](print-final-phone.png).
- [Desktop visible dataset download](dataset-final-desktop.png).

SULLY-DESIGN root review: composition/brand, subject/engraving, typography, mobile layout, controls/loading and content readiness pass for the bounded changes. Continuous work motion, menu focus/Escape, native role→résumé→Back, reduced-motion controls, Print phase/hold/export and protected content are inspected. Captures show appearance; the measured intervals above establish the checked runtime behavior.

Next boundary: source review and an explicitly authorized production release, followed by the current public HTTP/search checks on the deployed head. Google/Bing crawl/index queues and external editorial/maintainer decisions remain external outcomes. No unattended watcher or new account is created.
