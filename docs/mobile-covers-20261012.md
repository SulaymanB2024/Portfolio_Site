# Mobile article covers — October 12, 2026

## Working contract

Repair observed article-arrival and Writing-gallery cover defects in the isolated `codex/site-content-20261012` worktree, baseline `0fb80537df3841a367eadff567aeec77b8d86e0d`. This lane owns article opening/cover/player CSS and code, this record, and ignored evidence under `.cache/mobile-covers-20261012/`. Port 4216 is reserved for its preview. Manuscripts, catalogs, metadata, Home, recruiter surfaces, other lanes, push, merge, and publication are outside scope.

Read: launch README; `docs/delegated-work-20261012.md`; project-context and validation policies; browser-routing policy; SULLY-DESIGN and preference rows S01/S03/S04/S08/S10/S11; `docs/article-reader-refinement.md`, `docs/article-distinction.md`, `docs/writing-curation.md`; current article, gallery, and player source. The KnowledgeHQ Personal Site route is a historical pointer: its October 7 phone-autoplay observation is superseded by the current mobile policy and player tests, which explicitly retain autoplay.

Preserve the current ink/paper tokens, original generative artwork and attribution, editorial hierarchy, natural phone headline wrapping, motion on visible mobile artwork, explicit pause, reduced-motion posters, source content, and return navigation. Completion requires rendered before/after evidence, desktop and representative phone inspection of affected openings/gallery, meaningful playback/loading checks, focused validation, and inline visual delivery.

## Current integration state

Root adopted both immutable handoff patches in `codex/mobile-cover-integration-20261012`, based on the actual production `cb70322bb8f46589005c6f655be9044b8d841d58`. The cover/startup repair is locally integrated, built and inspected; it has not been pushed, merged or published. The completed live recruiter release and automatic spreadsheet proof remain intact. The final root integration checkpoint below supersedes the earlier peer-only checkpoints.

## Original lane checkpoint

- Storage/Git ownership verified: linked content worktree; common owner is `sulayman-personal-site-launch`.
- Initial dirty file: dispatch-owned `docs/delegated-work-20261012.md`; untouched.
- No usable installed dependencies in the worktree or launch symlink. Ran `npm ci --no-audit --no-fund` in this lane's worktree: 142 packages installed; tracked manifests unchanged.
- Browser binding: maintained CUA in-app browser ID 3, task-owned tab 1, port 4216. No surface switch or policy bypass.

## Reported defect and repair

The human clarified that the problem is a black mobile background that looks glitchy, not title overflow. Before repair, all 29 article openings fit at 320×568 with square artwork, loaded 400×400 source posters, and no page/headline overflow. The Writing gallery also fit at 320, 375, 430, 680, 700, 844-landscape, and 1280px. These layout findings do not disprove a phone compositor defect.

The rendered covers depended on `filter: contrast(1.35) url(#artwork-ink)` to remove opaque black source buffers. [WebKit bug 314999](https://bugs.webkit.org/show_bug.cgi?id=314999) documents spurious black rectangles on iOS when CSS SVG filters target below-viewport elements. That is a plausible match to the report, not a reproduced diagnosis of the user's exact phone. The available in-app browser did not reproduce that iOS-specific tile.

Repair implemented: embedded covers now deliver actual transparent ink pixels, retaining the accepted 1.35 contrast, 1.7 ink density, current `--ink` palette, original source formulas, trails, and poster assets. The worker GPU converts only its final display pass; Canvas2D fallback and reduced-motion posters convert in detached buffers, so visible canvases never receive the opaque raw frame. Embedded artwork has no CSS reference filter. Palette changes recolor a retained surface without resetting its source phase. Native poster pixels are copied into article-flight clones, including a pending image-load fallback. Mobile autoplay, resolution, 24fps cap, pause, visibility gating, and reduced motion remain intact. No geometry changes were needed.

## Runtime and verification checkpoint

The default Vite resolver picked up a second React copy from sibling `sulayman-site-outreach-20261008`, causing a blank page/invalid hook call in both dev and an initial isolated client build. Dependency re-optimization did not fix it. No tracked package or config changes were made. The ignored `.cache/mobile-covers-20261012/preview.config.ts` extends the repository config with local React/React DOM deduplication and its own cache; this is the exact inspection runtime. Root integration must distinguish that environmental resolver issue from the cover patch.

- `npm run typecheck` after native-ink implementation: passed (both application and API TypeScript checks).
- First rendered repair: 390×844 Writing gallery; native GPU ink, `filter: none` for every embedded placement, original composition retained. Scroll inspection showed sustained ~24.4fps and ~2.22ms average drawing cost for the lead artwork. This is desktop hardware at a phone viewport, not an iPhone performance claim.
- Before evidence: `.cache/mobile-covers-20261012/before-320.json`, `before-gallery.json`, and per-article/viewport JPEG captures.
- After evidence so far: `.cache/mobile-covers-20261012/after-writing-art-390.jpg`.
- A capture batch hit the browser tool's execution timeout. The same in-app browser and existing task tab were reconciled through documented browser inventory; no alternative browser was used. The desktop gap was subsequently resolved, and all final captures were refreshed after the detached-buffer and poster-flight corrections.

## Native-transparency baseline and evidence

The final client build uses `main-DcjOE8A8.js`. The complete local patch is `.cache/mobile-covers-20261012/mobile-covers.patch`; its source hashes and evidence receipt are in `receipt.json`. It contains only this lane's ten modified cover/player/runtime files, new native-ink helper, three focused test files, and this record. Project, article-draft, QA, and dispatch changes remain separately owned and untouched.

| Check | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/artwork-ink.test.ts tests/artwork-player.test.ts tests/artwork-worker.test.ts tests/artwork-handoff.test.ts tests/canvas-runtime.test.ts tests/gpu-runtime.test.ts tests/mobile-render-policy.test.ts` | 47 passed; zero failures. Black-to-alpha conversion, detached display painting, native poster clones, palette changes without phase reset, worker transport, source adapters, cleanup, pause/visibility, and mobile budgets. |
| `npm run typecheck` | Passed for application and API. |
| `node_modules/.bin/vite build --config .cache/mobile-covers-20261012/preview.config.ts --outDir .cache/mobile-covers-20261012/site-final` | Passed in 7.51 seconds; existing chunk-size/config-loader warnings. |
| Production-built article openings | All 29 checked and visually reviewed at 390×844 and 1280×900. No page/headline overflow, distorted artwork, missing source posters, or CSS reference filters. |
| Writing gallery | Final 320×568, 390×844, and 1280×900 views: zero page overflow, distorted artwork, or reference filters. Before-repair breakpoint matrix also checked 375, 430, 680, 700, and 844-landscape. |
| Motion and readiness | Normal GPU animation visibly sustained; 32 captured screen frames over 2.86 seconds, delivered as a ~3.07-second GIF. Capture cadence is lower than the artwork's cadence. Gallery → article transferred the same player ID 60 with `live-canvas` continuity. Pause/Play retained player ID 1 and paused frame 6 in the earlier repair inspection. |
| Reduced motion and palette | Final light/dark reduced-motion posters visually reviewed; state `poster`, 400×400 source assets loaded, `filter: none`. Motion emulation restored and preview appearance returned to light. |
| Console | Final production-built inspection: no captured errors. |
| Protected sources | SHA-256 comparison against HEAD: all 29 original article JSONs unchanged. Package/lockfile, Vite config, catalog, artwork manifest, mobile policy, public assets, and Home files unchanged. |
| Scoped whitespace check | `git diff --check -- src/personal/editorial tests/artwork-ink.test.ts tests/artwork-worker.test.ts tests/gpu-runtime.test.ts` passed. |

Visual proof: `mobile-cover-overview-1.png` and `mobile-cover-overview-2.png` represent all 29 phone covers; `inspection-390-1.png` through `inspection-390-5.png` and corresponding `inspection-1280-*` sheets show complete openings. Every sheet was visually reviewed. `after-writing-390.jpg`, `after-writing-art-390.jpg`, `after-writing-1280.jpg`, and `repaired-cover-motion.gif` show the gallery and sustained motion. Per-route geometry/source readiness is in `after-390.json` and `after-1280.json`.

## Remaining boundaries and integration

- The user's exact phone/iOS version was not accessible; the WebKit diagnosis remains an inference. Native output removes the implicated CSS-filter dependency regardless of that diagnosis.
- Browser worker-failure injection could not be completed: two supported network-block commands did not interrupt worker creation, and the current browser capability rejected the new-document script method. No workaround or surface switch was used. Worker failure/lifecycle and Canvas2D conversion are verified by the focused tests; there is no browser screenshot claiming a forced native recovery.
- The initial public-document SVG-filter boundary recorded here is resolved by the public-cover continuation below. Shared public-document rendering, routing and metadata remain separately owned.
- Root integration should inspect this lane's patch only, retain the other writers' changes, and resolve the independent default Vite/React identity issue against its runtime. No full release gate, actual iPhone run, commit, push, merge, or publication was performed.
- Next authorized boundary: root reviews and integrates the local cover patch. An actual phone readback after its separately authorized deployment would confirm the originally reported compositor symptom.

## SULLY-DESIGN check record

| Area | Status | Evidence |
| --- | --- | --- |
| Composition/brand | Pass | Current paper/ink tokens and all accepted opening/gallery compositions retained; complete phone/desktop sheets. |
| Subject/craft | Pass | Original formula and poster artwork retained; fine detail visible without opaque black buffers. |
| Typography | Pass | Authored headlines, natural phone wrapping, bylines, controls, and credits retained; no clipped headings. |
| Mobile | Pass | Final 29 phone openings and narrow gallery fit; native transparent output has no reference filter. Actual user-phone confirmation remains unavailable. |
| Interaction/loading | Pass within tested scope | Visible sustained GPU motion, same-player handoff, pause/resume, light/dark native posters, focused fallback tests. Browser fault injection unsupported as above. |
| Content readiness | Pass | All 29 original manuscript hashes and accepted artwork/source assets preserved. |

## Per-cover visual readback

| Cover | Phone | Desktop |
| --- | --- | --- |
| Building Atlas | [Capture](../.cache/mobile-covers-20261012/after-atlas-building-an-evidence-console-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-atlas-building-an-evidence-console-1280.jpg) |
| Verifying a 54-move exact search. | [Capture](../.cache/mobile-covers-20261012/after-jane-street-exact-search-solver-verification-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-jane-street-exact-search-solver-verification-1280.jpg) |
| Why Texas toll roads stay tolled. | [Capture](../.cache/mobile-covers-20261012/after-why-texas-toll-roads-stay-tolled-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-why-texas-toll-roads-stay-tolled-1280.jpg) |
| What happened to the software buyout boom? | [Capture](../.cache/mobile-covers-20261012/after-software-buyout-boom-2020-2022-exit-audit-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-software-buyout-boom-2020-2022-exit-audit-1280.jpg) |
| The U.S. rare-earth magnet buildout. | [Capture](../.cache/mobile-covers-20261012/after-us-rare-earth-magnet-manufacturing-capacity-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-us-rare-earth-magnet-manufacturing-capacity-1280.jpg) |
| An AI megawatt is not a megawatt. | [Capture](../.cache/mobile-covers-20261012/after-the-ai-megawatt-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-the-ai-megawatt-1280.jpg) |
| Who owns Austin’s home-service companies? | [Capture](../.cache/mobile-covers-20261012/after-who-owns-austin-home-service-companies-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-who-owns-austin-home-service-companies-1280.jpg) |
| When an index decides a company matters. | [Capture](../.cache/mobile-covers-20261012/after-what-happens-when-an-index-decides-a-company-matters-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-what-happens-when-an-index-decides-a-company-matters-1280.jpg) |
| How airlines borrow against loyalty programs. | [Capture](../.cache/mobile-covers-20261012/after-how-airlines-borrow-against-loyalty-programs-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-how-airlines-borrow-against-loyalty-programs-1280.jpg) |
| Where do online returns go? | [Capture](../.cache/mobile-covers-20261012/after-where-online-returns-actually-go-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-where-online-returns-actually-go-1280.jpg) |
| Five capital stacks for hardware startups. | [Capture](../.cache/mobile-covers-20261012/after-hidden-financing-hardware-startups-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-hidden-financing-hardware-startups-1280.jpg) |
| Who owns West Campus student housing? | [Capture](../.cache/mobile-covers-20261012/after-west-campus-student-housing-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-west-campus-student-housing-1280.jpg) |
| Who funds Waymo’s hardware? | [Capture](../.cache/mobile-covers-20261012/after-waymo-hardware-financing-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-waymo-hardware-financing-1280.jpg) |
| The crawl frontier is a state machine. | [Capture](../.cache/mobile-covers-20261012/after-crawl-frontier-state-machine-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-crawl-frontier-state-machine-1280.jpg) |
| Raw HTML and rendered DOM are separate evidence. | [Capture](../.cache/mobile-covers-20261012/after-raw-html-rendered-dom-evidence-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-raw-html-rendered-dom-evidence-1280.jpg) |
| Replayable traces for AI agents. | [Capture](../.cache/mobile-covers-20261012/after-replayable-traces-ai-agent-evaluation-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-replayable-traces-ai-agent-evaluation-1280.jpg) |
| SQLite for crawl pipelines. | [Capture](../.cache/mobile-covers-20261012/after-sqlite-crawl-pipelines-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-sqlite-crawl-pipelines-1280.jpg) |
| Executable gates for SEO migrations. | [Capture](../.cache/mobile-covers-20261012/after-technical-seo-migration-release-gates-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-technical-seo-migration-release-gates-1280.jpg) |
| The Shopkeeper in the Machine | [Capture](../.cache/mobile-covers-20261012/after-the-first-ai-managers-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-the-first-ai-managers-1280.jpg) |
| The state owns the pavement. Who owns the cash flow? | [Capture](../.cache/mobile-covers-20261012/after-who-owns-texas-toll-roads-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-who-owns-texas-toll-roads-1280.jpg) |
| Beyond the Leaderboard | [Capture](../.cache/mobile-covers-20261012/after-viralbench-codex-agent-harness-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-viralbench-codex-agent-harness-1280.jpg) |
| AI crawlers: search, training, and access. | [Capture](../.cache/mobile-covers-20261012/after-ai-search-crawler-policy-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-ai-search-crawler-policy-1280.jpg) |
| Technical SEO as public data infrastructure. | [Capture](../.cache/mobile-covers-20261012/after-technical-seo-public-data-infrastructure-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-technical-seo-public-data-infrastructure-1280.jpg) |
| Canonical identity beats more content. | [Capture](../.cache/mobile-covers-20261012/after-canonical-identity-personal-seo-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-canonical-identity-personal-seo-1280.jpg) |
| Canonicalization is a graph problem. | [Capture](../.cache/mobile-covers-20261012/after-canonicalization-graph-consistency-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-canonicalization-graph-consistency-1280.jpg) |
| Internal links are a retrieval graph. | [Capture](../.cache/mobile-covers-20261012/after-internal-links-directed-retrieval-graph-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-internal-links-directed-retrieval-graph-1280.jpg) |
| Robots.txt is not access control. | [Capture](../.cache/mobile-covers-20261012/after-robots-txt-courtesy-not-access-control-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-robots-txt-courtesy-not-access-control-1280.jpg) |
| Structured data without content drift. | [Capture](../.cache/mobile-covers-20261012/after-structured-data-without-content-drift-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-structured-data-without-content-drift-1280.jpg) |
| Audit findings are derived records. | [Capture](../.cache/mobile-covers-20261012/after-audit-findings-derived-records-390.jpg) | [Capture](../.cache/mobile-covers-20261012/after-audit-findings-derived-records-1280.jpg) |

## Runtime closeout

The task-owned browser tab was closed, its viewport override was reset, and the owned port 4216 preview was stopped. No listener remained on 4216; `lsof +D` found no open files in either generated site directory. Removed only this task’s reproducible `site/` and `site-final/` builds (about 406 MiB each); source, dependencies shared by the other active lanes, preview config, test/build logs, unique captures, GIF, receipt, and scoped patch remain. Rebuild with the command above before restarting this preview.

## Raster-lifetime checkpoint

The engineering continuation preserves the broader goal and the exclusive cover/player lane. The preceding turn only rechecked an unchanged patch, so it was classified as no progress. Source inspection found a concrete memory cost: every painted static poster retained its detached 400×400 conversion canvas in addition to its visible canvas. The current repair releases that scratch raster immediately after copying native ink pixels. Live Canvas2D fallbacks still reuse one scratch raster across frames and now release it explicitly on disposal. The pixel formula, visible resolution, source art, layout, palette, autoplay, and motion budgets are unchanged.

For 29 loaded covers, the removed extra rasters contain 29 × 400 × 400 × 4 bytes, about 17.7 MiB of raw pixel storage. This is a source-derived allocation estimate, not a measurement of total iPhone memory. New regression checks exercise all 29 poster releases, retained visible pixels and resolution, theme repaint, live-buffer reuse, phase preservation, and disposal.

Current client: `main-Bd_RHirl.js`, built using the same isolated React deduplication config in `site-memory/`. The refreshed `mobile-covers.patch` and `receipt.json` supersede the baseline package above. Verification:

- Focused cover/player/worker/handoff/Canvas2D/GPU/mobile suite: **49 passed, zero failures** (`focused-tests-memory.log`).
- Application and API typechecks passed (`typecheck-memory.log`); isolated client build passed in **1.95 seconds** (`client-build-memory.log`). Existing config-loader and chunk-size warnings remain separate from this change.
- Production-built Shopkeeper opening: cold reduced-motion poster inspected at 390×844 in light/dark and at 1280×900 in light; native poster remains 400×400, no reference filter or page overflow. Complete light/dark/desktop proof is `memory-poster-proof.png`.
- Production-built Writing gallery: phone poster/loading state and sustained live motion inspected. Current 20-frame capture spans 2.90 seconds; `memory-cover-motion.gif` plays for 3.11 seconds including its final hold. Capture sampling does not measure renderer frame rate, and production intentionally disables numeric draw telemetry. No captured console errors.
- Gallery → article retained player ID **2** with `live-canvas`; Pause/Play retained that player and changed the visible state correctly (`memory-playback.json`). Earlier complete 29-reader phone/desktop baseline inspection still documents the unchanged cover compositions; this memory-only change was rechecked on the shared loading/theme/transition paths rather than repeating every manuscript inspection.
- SULLY-DESIGN: composition/brand, subject/craft, typography, mobile viewport, interaction/loading, and content readiness remain **Pass within the locally tested scope**, with current native poster and live-capture evidence. Exact iPhone confirmation, initial public-document SVG-filter removal, root integration, and publication remain unverified boundaries.

The temporary browser tab 2 was closed, the viewport and media overrides restored, and the owned 4216 preview stopped. `lsof` confirmed no listener and no process holding the generated `site-memory/` build before routine removal. Unique proof, motion frames/GIF, logs, source, dependencies, patch and receipt remain. No other lane, shared renderer/config/catalog, public asset, source manuscript, or top-level chat was modified. The broad engineering goal remains active; root integration and the separate default React identity issue still require owner review.

## Current handoff — public-document covers

The remaining CSS reference filter was isolated to `ArtPoster.tsx` and `public-covers.css`. This continuation replaces that public-cover dependency with 44 precomputed, lossless WebP posters carrying the same native palette/alpha treatment. `tools/prepare-artwork-ink-posters.ts` reads the current light ink token and original posters, writes only new content-versioned derivatives under `public/images/generative-art/ink/`, and generates the owned cover-source map. Original posters, generative assignments, formulas, credits and manuscript files remain preserved. Only the corresponding cover assertions in `tools/verify-search.mjs` change; the shared public-page renderer, routes and metadata remain separately owned.

The assets total 527,436 bytes versus 493,884 bytes for all 44 originals: 33,552 additional bytes (6.8%) buys real alpha without runtime CSS-filter composition. This is a measured file-size tradeoff, not a claimed network or iPhone timing improvement. The native alpha transformation matches every visible source pixel in the new asset checks; each URL contains a digest of its delivered bytes.

Before interruption: 51 focused tests, typechecks, isolated client/SSR builds, public rendering and the search gate passed. JavaScript-disabled readback succeeded on the actual canonical Shopkeeper document (`/research/ai-systems/the-first-ai-managers`): native image loaded at 400×400, `filter: none`, no overflow, original credit retained. `public-shopkeeper-390.jpg` records that state. The initial `/writing/the-first-ai-managers` inspection was an interactive alias served by Vite's SPA fallback; it is not used as public-cover evidence.

On resumption, the old preview handle was missing and port 4216 was free, so no live runtime was duplicated. The recorded browser tab was also missing; the same in-app browser ID 3 was retained and one new owned tab 2 was used. Current client `main-D0z-9LVD.js` and all public documents were rebuilt from the current source in the owned staging runtime. The current scoped patch and receipt include this public-cover repair and supersede the memory-only package.

| Current check | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/artwork-posters.test.ts tests/artwork-ink.test.ts tests/artwork-player.test.ts tests/artwork-worker.test.ts tests/artwork-handoff.test.ts tests/canvas-runtime.test.ts tests/gpu-runtime.test.ts tests/mobile-render-policy.test.ts` | **51 passed**, zero failures; normal repository runner, including scoped TSX rendering and every visible pixel of all 44 native assets (`focused-tests-public-final.log`). |
| `npm run typecheck` | Application and API passed (`typecheck-public-final.log`). |
| Isolated client / SSR builds | Passed in **2.22 / 1.03 seconds** (`client-build-public-final.log`, `ssr-build-public-final.log`), using the same React deduplication inspection config. |
| Public rendering and `tools/verify-search.mjs` | Passed: **46 canonical pages, 29 dated feed entries, 292 citations**, complete source sections and coherent discovery/metadata (`render-public-final.log`, `verify-search-public-final.log`). The shared renderer's peer changes were read as current build inputs, not edited or included in this lane's patch. |
| JavaScript-disabled public openings | All **29 at 390×844 and 29 at 1280×900** captured and visually reviewed. Native images loaded at 400×400, square display geometry, no reference filter, headline overflow or page overflow (`public-after-390.json`, `public-after-1280.json`). |
| Public Writing gallery | All **29** covers loaded after scrolling below the fold at 390px; no reference filters, distortion or overflow. Desktop 1280px and narrow 320px checks also passed (`public-gallery-390.json`, `public-gallery-320.json`, `public-writing-*`). |
| Restored interactive experience | JavaScript restored; 29 placements present, lead GPU artwork running, `filter: none`, no page overflow and no captured errors (`public-repair-interactive-390.jpg`). Interactive draw/player code is unchanged from the tested raster-lifetime checkpoint. |

`public-cover-overview-1.png` / `public-cover-overview-2.png` represent every new public cover. All ten full-opening `public-inspection-390-*` / `public-inspection-1280-*` sheets were visually reviewed. The original public layout and typography are retained; this repair targets native cover composition. The covers pass composition/brand, subject/craft, affected typography, mobile viewport and loading checks; source content/attribution pass through preservation and the public gate. Current viewport checks are not an actual iPhone test. No claim is made about iPhone timing or overall site completion.

JavaScript was restored, the viewport reset, the owned tab closed and the 4216 preview stopped. `lsof` confirmed no listener or open staging files before routine removal of the generated client/SSR runtime. Source, new native assets/map, tests, generator, logs, unique captures, patch and receipt remain. No source article, original poster, shared catalog, renderer/config, peer work or top-level chat was edited. Next authorized boundary: root reviews/integrates the full cover package, including the cover assertions and 44 derived assets, resolves the independent default React identity issue, and obtains a readback on the user's phone after any separately authorized deployment. The broad engineering goal remains active.

## Current checkpoint — authorized React startup repair

The user explicitly authorized the previously prepared shared-config change: **“Yes, fix startup here.”** The only additional product edit is `resolve: { dedupe: ['react', 'react-dom'] }` in `vite.config.ts`. It is delivered separately as `.cache/mobile-covers-20261012/react-startup.patch`; the mobile-cover patch retains its original file scope. The shared lane document was not edited.

A fresh build with the original default configuration emitted two React cores with independent hook dispatchers: the app and artwork imported `react-2TDLRVrO.js`, while React DOM imported `react-DP1ra5FT.js`. The fixed default build emits one core, `react-IDFlRUvQ.js`, shared by `main-Ca5rJrVs.js`, React DOM and the artwork. `react-startup-bundle-report.json` records the references and hashes of retained before/after bundle excerpts. This verifies removal of the conflicting runtime; no timing claim is based on the different build durations.

| Current startup check | Result |
| --- | --- |
| `npm run typecheck` | Application and API passed (`typecheck-react-startup.log`). |
| Default-config client and SSR builds | Passed in **1.59 / 1.79 seconds** (`fixed-react-build.log`, `fixed-react-ssr-build.log`), without the isolated deduplication override. Existing config-loader and large-chunk warnings remain. |
| Existing startup regression suite | **10 passed**, zero failures (`tests-react-startup.log`). The unchanged cover implementation retains the preceding **51-test** validation. |
| Public generation and search gate | Generated **46 canonical pages plus 404/discovery**; gate passed **29 feed entries and 292 citations** (`render-react-startup.log`, `verify-search-react-startup.log`). Run the gate with `node --experimental-strip-types tools/verify-search.mjs` on the available Node 22.14 runtime; a plain-Node attempt could not load its existing TypeScript imports. |
| Default-built interactive readback | Home, Writing and article mount with `siteBoot: ready`, no captured browser errors or page overflow. Phone Writing has 29 article placements; the lead native GPU cover runs with `filter: none` and a transparent background. The Shopkeeper opening at **390×844** also renders native transparent artwork. Gallery → article, Pause and Play retain player **1** (`react-startup-browser-report.json`). |
| Default-built public opening | With JavaScript disabled, the canonical Shopkeeper document shows its loaded **400×400** native WebP, original source URL, `filter: none` and no overflow (`react-startup-public-report.json`, `react-startup-public-390.jpg`). JavaScript and viewport overrides were restored afterward. |

The browser initially exposed only its saved internal error page, so the tool's protocol block was respected. After the user manually restored a normal HTTP page, the existing user tab showed the fixed bundle. A separate task-owned tab was used for responsive/navigation checks. `react-startup-article-390.jpg` and `react-startup-article-desktop.jpg` show the actual default-built openings; `react-startup-writing-390.jpg` shows the gallery. The user's tab and its article were preserved.

The optional separate development-server probe was deferred when load reached 22.19 on the eight-core machine. The default production build, SSR/public generation and browser startup checks above are the current evidence. Exact iPhone compositor behavior remains untested. No dependency install, peer source edit, commit, push, merge or publication occurred.

The owned static preview on **4216** serves `.cache/mobile-covers-20261012/fixed-react-probe` using the tracked default configuration (exec session **28190**) for user review. The startup receipt and scoped patches identify the delivered source. Next unresolved boundary: root reviews/integrates the cover package and the separately authorized startup patch, then obtains actual-phone readback after any separately authorized deployment. The broader engineering goal remains active.

Review handoff: task-owned tab **3** was closed; the existing user tab **1** remains on its Atlas article. Script execution and viewport overrides were restored. The pre-fix preview session **49853** ended, and `lsof +D` found no open files in its generated directory before removal of only `default-react-probe/`. The hashed before/after runtime excerpts, captures, logs, source, fixed review runtime, receipts and two scoped patches remain. No other preview, lane or top-level chat was stopped or changed.


## Root integration checkpoint — October 12

The human-authorized review handoff is adopted from the immutable `review-handoff-20261012-d2da168` package. Root independently verified both hashes: cover `64801a6a5cfb53c800821593ac9680a0bd399bce58028f06a8bdca7e25f0c65c`, startup `e780d6f3ed725bec132651c0619b7ac49fe69ca3db6d894179a58d4e2b8c0b33`. Only the66 explicitly scoped cover/source/test/tool/record/derived-asset files and the separate Vite React deduplication were applied to this actual production tree. The recruiter closeout record was updated separately. Peer article/project/catalog changes and the original two untracked evidence directories are preserved.

Independent read-only review found no blocking defect and verified all29 manuscripts and44 original poster hashes against the preservation receipt. GPU conversion affects final presentation only; source textures, trails and formulas remain. Canvas2D converts in detached buffers, static scratch rasters are released, paused theme changes preserve the player, and transition clones copy poster pixels. Production's extra recruiter/search assertions remain in the combined search gate; only native-poster assertions changed in that tool.

Root validation on the integrated source:

- `node --experimental-strip-types --test tests/artwork-posters.test.ts tests/artwork-ink.test.ts tests/artwork-player.test.ts tests/artwork-worker.test.ts tests/artwork-handoff.test.ts tests/canvas-runtime.test.ts tests/gpu-runtime.test.ts tests/mobile-render-policy.test.ts tests/site-startup.test.ts`:61 passed, zero failures (`focused-tests.log`).
- `npm run build`: application/API typechecks, default client and SSR builds and46 canonical public documents plus404/discovery passed (`build.log`). Client `main-B8X86EKX.js` has one React core, `react-Cvdyeg_0.js`; no inspection-only Vite override was used.
- `node --experimental-strip-types tools/verify-release.mjs`: passed46 canonical documents,82 direct redirects,1668 asset references, worker CSP,404/discovery/lockfile and the search gate's29 feed entries/292 citations (`release.log`).
- The85 recruiter HTTP compatibility checks pass with exact reviewed copy and identical normalized standard continuation (`recruiter-http.log`). Its first attempt failed only on the ignored local gallery, which the normal build removes; root rebuilt that review artifact using the final live desktop/phone captures and public links, replacing its obsolete Draft/pending text. No product assertion was weakened.
- The actual root-built phone Writing gallery runs native GPU ink with transparent background, `filter: none`, ready startup and no overflow. Gallery to Shopkeeper transfers player1. Pause and light/dark theme changes retain player1; reduced motion shows a400×400 native poster. Returning from reduced motion legitimately acquires a new player2 under the existing lifecycle. This is not a phase-preservation claim across reduced-motion disposal.
- JavaScript-disabled canonical Shopkeeper serves the loaded400×400 native WebP `/images/generative-art/ink/yuru-08-4d4f62b0c863.webp`, retains its original source/credit, has no reference filter and fits390px. JavaScript was restored. The integrated named recruiter opening at390×844 preserves all four rows, loaded helmet, original geometry and44px canonical actions. The Shopkeeper desktop at1280×900 is visibly intact. No captured browser errors.

Root evidence is `.cache/mobile-cover-integration-20261012/`: logs above, `root-rendered-verification.json`, `root-writing-phone.jpg`, `root-article-phone.jpg`, `root-paused-dark-phone.jpg`, `root-reduced-dark-phone.jpg`, `root-js-disabled-public-phone.jpg`, `root-recruiter-phone.jpg` and `root-article-desktop.jpg`. Motion/JavaScript emulation and temporary viewport overrides were restored, local appearance returned to light, and the owned inspection tab was closed. The actual public recruiter deliverable remains open. Root's existing4193 preview is retained for the prepared local integration; the peer's4216 runtime was untouched.

This handoff's authorized local integration is complete. Push/production publication of these separate cover/startup changes was not requested by this handoff and has not occurred. Exact iPhone compositor behavior remains untested; viewport and source evidence do not claim an actual-phone result. Recruiter production remains the verified `cb70322` release with five Ready/Live spreadsheet rows. The next boundary for these cover changes is a separately authorized release and actual-phone readback.
