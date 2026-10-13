# Submission review — strategy and investment articles

The user requested further improvements and a merge request after the completed first-person writing batch. This revision adds editable scenario inputs, two startup sensitivity arguments, portable artifacts and native table placement. Delivery consists of four manuscripts and four article JSONs, 10,752 words, 17 tables, eight figures and two executed notebooks.

## Material results

| Manuscript | Words / reading estimate | Judgment and evidence boundary |
| --- | --- | --- |
| Strategy | 2,735 / 12 minutes | Assisted direct is a testable offer/price/workload combination. Holding price constant reverses the apparent channel advantage. |
| Toast | 2,363 / 11 minutes | $2.082bn trailing recurring gross profit underpins a $37.00 modeled base value and $24.33 entry for a 15% annual return. The $31.29 quote is dated October 12, 2026, 19:03:30 UTC. Future economics are assumptions. |
| Harvey | 2,709 / 12 minutes | Time must become contribution, renewal and delivery margin. With 30 active seats instead of 60, the same hypothetical 25% monetization yields $41,200 first-year benefit instead of $372,400. $400m ARR is illustrative; actual current ARR and security terms are unknown. |
| Vanta | 2,945 / 13 minutes | A recurring budget requires work after the audit. Limiting the weekly savings to sixteen weeks yields a $13,830 first-year deficit and $8,830 recurring deficit at 50% cash capture. April's $300m ARR and older $4.15bn valuation are separate dated checkpoints. |

Each article develops a buyer/operating mechanism, price or budget discipline, strongest countercase and evidence that would change the judgment. Assumptions are labeled beside the modeled results. No probabilities, holdings or invented client experience are supplied.

## Further improvements and corrections

`pitches/inputs.json` drives future and customer assumptions. Custom scenario files protect reported anchors and the cutoff; explicit output files preserve canonical results. Zero capacity returns a null payback requirement rather than division by zero. Ten tests cover financial stress, retention, malformed inputs, reported-anchor changes and CLI overwrite boundaries.

The generator preserves table placement with `markdownSections[].blocks`. A final integration review caught that global table references were not supplied by the site's ordinary `sections` branch. The exported data now follows the supported branch, and the temporary preview exposes and renders the actual native Section component. Shared application source is unchanged.

Manuscript images and review links now resolve from GitHub or a fresh checkout. Receipt paths are repository-relative. The earlier rejected snapshot remains local and is ignored in this submission. A shadowed validation variable that misstated the receipt's Harvey hours was corrected; a regression test preserves the independently checked 13,248 hours.

## Checks actually performed

| Command or check | Result |
| --- | --- |
| `python3 .../pitches/test_models.py` | 10 tests passed |
| `python3 .../verify.py` | Strategy cohort/cash/capacity arithmetic, counts, sources and figure checks passed |
| `python3 .../pitches/verify.py` | Decimal earnings, customer value, sensitivity, investor hurdle and cohort recomputations passed; four articles and exact table placement checked |
| `tsc --noEmit -p .../tsconfig.json` | All four native JSONs type-checked |
| Two notebook executions | Five code cells each, zero errors; all eight embedded PNGs match final exports |
| `npm test` | 664 tests passed |
| `npm run test:bot-observer` | 19 tests passed |
| `node tools/test-article-opening.mjs` | 28 tests passed |
| `node tools/verify-article-quality.mjs` | Existing 29 article bodies passed |
| `node tools/verify-restored-articles.mjs` | Existing manuscript provenance and assets passed |
| `npm run build` | Passed; generated 46 current-main canonical pages |
| `NODE_OPTIONS=--experimental-strip-types npm run verify:release` | Search and release gates passed |
| `npm audit --audit-level=high` | Local endpoint request failed; no successful advisory check claimed |
| Baseline preservation | Existing 29 article files and catalog match main `cb70322`; other lanes excluded |

The local runtime is Node 22.14.0. Release verification needed explicit type stripping; the repository CI uses Node 24, where that support is enabled by default. The ordinary Node 22 command failed before validation on the imported `.ts` file. No package or runtime configuration was changed to conceal either limitation.

The full-site gates validate the current registered site. These four new files remain unregistered, so those gates alone do not verify their publication. Their calculations, schema and native bodies were checked separately.

## Rendered inspection

All four actual native bodies were inspected at 1280 × 900 desktop and 390 × 844 phone dimensions. The 17 tables render in their authored order. Both new sensitivity matrices were visually reviewed on desktop and phone, including keyboard panning. Every phone body had zero document overflow. Table and figure frames remain 350px wide; all eight 760px figures loaded and panned between 373px and their 410px maximum.

The paper/ink design, typography and original charts follow the existing reader authority. The preview uses actual native sections without assigning temporary covers or editing the catalog. Earlier authoring-reload errors came from the stopped preview configuration; the restarted preview is the inspection target. Notebook HTML readbacks preserve native Markdown styling and relative-resource anchors. The investment readback initially exposed 96px of phone overflow because its table-wrapper selector was stale; correcting the selector restored zero page overflow with five loaded figures and contained table frames. Both notebook phone readbacks now have zero page overflow.

## Ownership and next boundary

This submission is isolated on `codex/strategy-investment-articles-20261012` from main `cb70322bb8f46589005c6f655be9044b8d841d58`. Only the strategy/investment draft lane and four new native JSONs belong in its diff. The original content worktree, its index, shared files and other writers' changes are preserved.

The coordinating lane still owns catalog registration, eight public SVG copies, artwork assignments, curation and generated-route metadata. [HANDOFF.md](HANDOFF.md) gives the exact integration contract. Merging and website publication are not part of this request. The original content lane records the pull request URL, exact remote head and CI readback after submission.

## Current continuation — interactive startup economics

The user asked to keep improving and developing after PR 90. That PR is merged and its exact head passed CI. Current baseline is origin/main `2e865c3`, which also includes the separate Chegg study. The four strategy/investment records are unchanged and remain unregistered; the public SVG copies are absent. Shared catalog/artwork/route integration remains with the coordinating lane.

This continuation develops a usable, portable buyer-economics companion for the Harvey and Vanta articles inside this owned draft directory. Preserve dated company anchors, the distinction between recovered time and captured profit/cash, first-year versus recurring economics, manuscript wording, native table order and existing figure assets. Use the current site's paper/ink tokens and Georgia hierarchy. No shared renderer, catalog, route, cover, package or unrelated article changes.

Acceptance: meaningful scenario presets and keyboard-operable inputs; live contribution/cash bridges and break-even requirements; zero-capacity handling; browser/Python parity over reviewed base and stress cases; source/assumption context visible beside the controls; actual desktop/phone inspection and inline visual delivery; scoped follow-up PR under the existing submission authorization. A portable external-script bundle respects the site's script CSP. Public integration and merge remain separate actions.

Current branch: `codex/startup-model-companion-20261012` in the existing isolated worktree. Record implementation, rendered corrections and exact test/submission evidence here. The earlier notebooks and ten CLI tests remain the calculation baseline, not a substitute for validating the new browser calculations.

### Expanded continuation — three more startup articles

Latest human direction on October 13: keep working and write on more startups; the earlier reply permits choosing the companies and modeling startup data. Add Ramp, ElevenLabs and Flock Safety as distinct first-person analyses with primary evidence, dated source registers, executable hypothetical economics and native article JSONs. Preserve all four accepted manuscripts/JSONs and the completed Harvey/Vanta companion. The root owns integration, shared generator, records, figures and delivery; independent helpers may own only their assigned new company directories, with no nested helpers. No shared catalogs, routes, artwork assignments or public asset copies.

Acceptance: useful commercial judgments and strongest countercases; sourced facts distinguished from assumptions at the point of use; independently checked model arithmetic; native table and figure placement; desktop and phone inspection of every new article; scoped follow-up PR and exact remote/CI readback. The existing REVIEW, READING_INDEX and HANDOFF remain the source-owned records. No publication or merge authorization is inferred.

### Completed local work and acceptance evidence

The three additional manuscripts contain 7,178 words: Ramp 2,311, ElevenLabs 2,487 and Flock Safety 2,380, with seven native tables and four original model-bound SVG/PNG figures. Ramp separates retained card proceeds, paid workflow contribution and incremental buyer payback. ElevenLabs prices accepted audio and verified unique tasks rather than assuming credits or conversations equal completed work. Flock models a five-year installed cohort with collection timing, deployment/service cash and renewal/removal costs. Current primary readbacks preserve June Ramp statistics, April ElevenLabs ARR versus September tender, and March 2025 Flock financing versus its later template date. Unknown company costs and security terms remain unknown.

A bounded ElevenLabs helper wrote only its new company directory; the root inspected its actual manuscript, source register, model and independent verifier before accepting and integrating it. Ramp's helper could not complete at inherited-model capacity; the root authored that company directly without changing the user's model. No nested helpers or other top-level chats were used.

| Current check | Actual result |
| --- | --- |
| `python3 pitches/verify_startups.py` | 111 independent Ramp/Flock arithmetic checks, zero-activity/retention and invalid-input checks, all three exports, sources, table/model parity, four figure/reference checks passed |
| `python3 pitches/elevenlabs/verify_model.py` | 71 exact-Fraction arithmetic checks plus source IDs, input preservation, zero workload/capture and invalid inputs passed; root reran after inspection |
| `python3 pitches/companion/prepare_companion.py --check` | Snapshot and all 40 Python/browser parity fixtures match the unchanged source inputs |
| `node --test pitches/companion/scenario-math.test.mjs` | 42 passed, 0 failed; final continuation run |
| `node --check pitches/companion/startup-models.mjs` | Passed |
| `tsc --noEmit -p tsconfig.json` | All seven native article JSONs passed the owned schema check |

The companion distinguishes recovered hours, captured value, first-year and renewal costs. Zero work retains fixed costs and yields null capture requirements. Meaningful presets and keyboard slider input were inspected, including Harvey low adoption/zero adoption and Vanta audit-window/full capture/no work. Source details now sit below the result to improve phone reading; print keeps selected values, and short live statuses avoid repeated region announcements. Renewal explicitly holds workload/capture fixed.

All three new native articles were inspected at 1280×900 and 390×844: openings, seven tables, all four figures, long body text and desktop endings. Phone document overflow is zero and table/figure regions stay350px wide. Figures retain760px detail, have a visible horizontal-scroll cue, and pan by keyboard through410px; the final second ElevenLabs readback was408.5px while scroll animation finished. Source and cost qualifications stay beside results. Latest inspected console warnings/errors were empty. Actual desktop/phone JPEGs are retained in this task's ignored cache for inline delivery.

Rendered corrections: moved Ramp and agent-bridge legends above the plotting area to remove collisions; matched half-up audio-cost rounding at$6.18 between table and figure; named companies in the new openings; corrected source-note spacing; and made the task-only preview tab title and byline follow the selected article. Shared application source remains unchanged.

SULLY-DESIGN check record: composition/brand **Pass** (existing paper/ink authority); subject/craft **Pass** (model-specific bars and cohort curves); typography **Pass** (native hierarchy and readable table/figure detail); mobile **Pass** (zero document overflow, contained panning); interaction/loading **Pass** (keyboard panning and companion scenarios, loaded figures); content readiness **Pass for review**, with public registration, cover/artwork assignment and route integration still owned by the coordinating lane.

Final submission evidence and temporary-runtime closeout follow below. Full-site gates are not rerun locally for this isolated article/doc bundle; PR CI provides repository gates, while the scoped checks above verify these unregistered artifacts directly.
