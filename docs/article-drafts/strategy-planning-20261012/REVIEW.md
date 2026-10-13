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
