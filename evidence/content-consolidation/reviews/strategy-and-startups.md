> Independent review retained from this task. Findings describe the reviewed frozen edition and that lane’s scope. The root’s final dispositions and full-site/browser checks are in [the QA report](../QA.md). Scratch paths in executed-command evidence are local diagnostics, not published source records.

# Startup/strategy independent QA — October 14, 2026

**Ready within reviewed model scope** after the authorized repairs below. Findings 1–3 are fixed and verified. Finding 4, model-download regeneration and final rendering remain root-owned. Overall coverage is **Partial** because rendered acceptance is outside this worker's lane and the historical Toast quote was not independently recreated.

## Current model repair checkpoint — October 14, 23:02 UTC

Root accepted findings 1–4 and assigned an exclusive implementation lane. Changed only `model.py`, `pitches/models.py`, `pitches/test_models.py` and new `test_strategy_model.py` under `docs/article-drafts/strategy-planning-20261012/`. No author record, native article, input file, canonical model-result file, shared registry or public download was edited; no commit was made.

- **CLI overwrite fixed:** explicit output is rejected when its resolved path or existing inode matches the input. The same path, output symlink, input symlink, output hardlink and input hardlink all return argparse status 2 with unchanged input bytes.
- **Strategy boundary fixed:** finite non-boolean values, nonnegative costs/work, bounded rates, six-value vectors, whole starts and whole nonnegative lag are checked explicitly. Fees cannot exceed gross billings. Zero per-start work admits demand only if fixed overhead fits both founder budgets; commercial work can still cap starts. Zero activity keeps fixed cash costs. Existing overbooked overhead remains visible and admits no new starts.
- **Toast label fixed:** `maximum_entry_for_15_percent` always computes a 15% hurdle. `maximum_entry_at_selected_hurdle` appears only for a nondefault selected rate; the 20% regression verifies both fields. Default output keys, ordering and values are unchanged.

| Exact command | Actual result |
| --- | --- |
| `env PYTHONDONTWRITEBYTECODE=1 python3 docs/article-drafts/strategy-planning-20261012/test_strategy_model.py` | 7 tests passed, including malformed values/vectors/lag, zero work, fixed overhead and zero activity. [Log](strategy-regressions.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/test_models.py` | 13 tests passed, including all five file-alias overwrite paths, selected hurdle and full default serialized output. [Log](investment-regressions.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/companion/prepare_companion.py --check` | Snapshot and all 40 Python/browser fixtures match. [Log](companion-parity-after-repairs.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/verify_repair_parity.py` | Actual pre-fix and repaired default dictionaries compare equal; complete serialized output compares byte-for-byte equal; stored result files and inputs remain unchanged. [Evidence](after-repairs-parity.json), [log](repair-parity.log). |
| `git diff --check -- docs/article-drafts/strategy-planning-20261012/model.py docs/article-drafts/strategy-planning-20261012/pitches/models.py docs/article-drafts/strategy-planning-20261012/pitches/test_models.py docs/article-drafts/strategy-planning-20261012/test_strategy_model.py` | Passed. Root should include the new untracked strategy test in delivery. |

The direct parity check executes the original model source from Git only after verifying its hash against the pre-edit snapshot, then compares actual dictionaries with the repaired functions. This avoids confusing original tuples with JSON-decoded lists. The full outputs retain SHA-256 `786a7051de29e117b36e916759381aab3cacae32f196695335e912f05e11999e` (strategy) and `b972e29e910cc2987f119a63debefe690e920656b4bb21296f7b1701f5d4e56a` (investment); the input fingerprint remains `abc61904b6a4f98de9666337422ef4359928975c75e6ae9a6f377ce9d639f3bf`.

Root's next step is to inspect/adopt these four files, regenerate downloads from the repaired source and finish its remaining integration/release checks. The original read-only findings and evidence follow as historical context; their reproductions describe the pre-repair model.

Inspected surface: `codex/content-consolidation-20261014` at `/Users/sulaymanbowles/Projects/CodexWork/sulayman-site-content-qa-20261014`, common Git owner `sulayman-personal-site-launch`; startup source #95 frozen head `1a7a83775d54fdf784ae47904ac7453869b4a3f9` and the already-main #90 bodies. These findings record the **pre-repair** source observation; any root repair needs its affected checks rerun.

Read current consolidation contract, HANDOFF, REVIEW, model/scenario instructions, source registers/readbacks, all seven full manuscripts, executable models, native JSON bodies and model-bound table definitions. Preserved the author’s first-person judgments, dates, hypothetical status, unknown private-security terms and the distinctions between revenue, ARR, contribution, time value, cash capture and company cash flow. Root owns catalog/assets/routes/downloads/CI and final rendered inspection.

## Original prioritized problems and proposed fixes — pre-repair

### 1. P1 — Output can destroy the editable scenario

[Shared scenario CLI](../../../docs/article-drafts/strategy-planning-20261012/pitches/models.py:305) writes the selected output without rejecting the input path. The existing test covers safe default behavior, but not identical explicit input/output paths.

Reproduction: `python3 .../pitches/models.py --inputs scratch.json --output scratch.json`, using only this review's disposable copy. Exit was 0; `toast.assumed` and the other editable assumptions were replaced by result records. The scenario cannot be rerun without restoring its inputs. [Exact command and output](model-probes.json) and the deliberately overwritten [disposable file](overwrite-probe-input.json) are retained.

**Fix (Proposed):** reject resolved output/input equality before writing, including canonical inputs and symlink aliases. Add one regression check proving nonzero exit and unchanged input bytes. ElevenLabs already has this protection in its CLI.

### 2. P2 — Strategy simulation accepts impossible inputs and crashes on a valid zero-work boundary

[Strategy `simulate()`](../../../docs/article-drafts/strategy-planning-20261012/model.py:68) checks only vector lengths and a nonnegative lag. Negative demand creates negative new and active stores; churn above one creates a negative survivor balance; negative price creates negative billings. A fractional lag fails later with a list-index `TypeError`, and a boolean lag is accepted. These are independently reproduced, not inferred from missing tests.

Zero onboarding and support cause `ZeroDivisionError` at [the admission calculation](../../../docs/article-drafts/strategy-planning-20261012/model.py:79). A fully automated hypothetical workflow needs a deliberate zero-cost admission result, or a clear documented invalid-input error.

**Fix (Proposed):** validate finite non-boolean values, rates, vector shapes, whole nonnegative starts and whole nonnegative lag up front. Handle zero per-start delivery work deliberately. Retain fixed costs and existing-customer obligations in zero-activity cases. The published base's arithmetic is unchanged; this affects reuse of the downloadable model.

### 3. P2 — Changed Toast hurdle keeps a 15% field label

[Toast output binding](../../../docs/article-drafts/strategy-planning-20261012/pitches/models.py:149) calculates from editable `entry_return_hurdle` but stores it under `maximum_entry_for_15_percent`. Selecting a 20% hurdle emits $21.4147448883 under that 15% label; the actual 15% base hurdle remains $24.3311772283.

**Fix (Proposed):** add/use a neutral selected-hurdle field with the selected rate, and keep a legacy 15% field only if it actually calculates 15%. Update any selected-hurdle consumers or verifiers together. Do not change the reviewed baseline's 15% article judgment.

### 4. P2 — Harvey rounding

The [native table](../../../src/personal/editorial/data/articles/harvey-who-keeps-the-value-of-legal-ai.json:412) displays 36.2%; the [nearby prose](../../../src/personal/editorial/data/articles/harvey-who-keeps-the-value-of-legal-ai.json:225) says 36.3%. The exact $145m/$400m margin is 36.25%, so this is inconsistent rounding at a tie, not a different model outcome. The same mismatch is in `pitches/harvey/article.md` lines 87/91 and `harvey-draft.md` line 63.

**Fix (Proposed):** choose one display convention and reconcile the table/generator with prose. Half-up would show 36.3%; ties-to-even shows 36.2%. No business conclusion changes.

## Analytical acceptance

All seven model baselines recompute to their stored results. The shared underwriting model passes independent Decimal operating-income/gross-profit bridges, investor-proceeds hurdle checks, Harvey buyer/delivery economics and closed-form Vanta cohort calculations. Independent strategy cohort sums give $27,992.6562 contribution and $21,993.4256 ending cash; all 13 published cases reconcile receivables/cash and stay within delivery/commercial capacity. Ramp/Flock and ElevenLabs use exact-rational independent checks.

All 258 native opening/body paragraphs and 24 tables retain the authored text, order and values; all 46 native source bindings appear in the manuscripts. [Model evidence](model-probes.json), [body/table evidence](content-consistency.json), and [targeted primary-source readbacks](source-readbacks.md) are retained.

The seven articles are useful within their declared scope: strategy exposes price/channel confounding and reserve timing; Toast separates recurring gross profit from revenue and cash; Harvey and Vanta test buyer capture and investor hurdles independently; Ramp separates platform contribution from incremental buyer payback; ElevenLabs prices accepted work and verified tasks; Flock explicitly models cohort timing, retention and service/removal costs. The central recommendations remain conditional rather than presented as observed company/customer outcomes.

## Original scope scorecards — pre-repair

Totals below are scoped inventory counts, not complete-verification rates. A zero numerator means no observed remaining defect. The [coverage record](coverage.json) and helper output preserve incomplete states.

### Article quality

| Category | Observed defects | Assessment |
|---|---|---|
| Article usefulness/completeness | 0 / 7 | All seven authored bodies were read. Each offers a commercial mechanism, countercase and decision evidence; no Stripe article was present. |
| Analytical clarity | 1 / 7 | The hypothetical/observed and time/contribution/cash distinctions remain explicit. Harvey has one rounding mismatch. |
| Visual/interaction consistency | N/A | Rendered browser QA is the root's independent lane; this worker makes no rendered acceptance claim. Not applicable: Rendered browser QA is the root's independent lane; this worker makes no rendered acceptance claim. |

### Analytical correctness and robustness

| Category | Observed defects | Assessment |
|---|---|---|
| Source authority/confidence | 0 / 46 | Primary material claims match targeted live passages. The historical Toast quote remains author-captured and was not independently recreated. Partial review: 1 scoped item has incomplete or stale evidence (TOST reference quote). |
| SQL/value accuracy | 0 / 24 | Model baseline parity and independent arithmetic support the 24 native tables; displayed rounding conventions can differ at ties. |
| Within-chart agreement | 0 / 12 | Twelve figure bindings/captions were traced to the unchanged model baseline. Full rendered chart inspection remains root-owned. Partial review: 12 scoped items have incomplete or stale evidence (strategy-growth-channel-cash-capacity.svg; strategy-growth-price-counterfactual.svg; strategy-growth-channel-cash-paths.svg; and 9 more (see review notes)). |
| Complete source details | 0 / 46 | All 46 source entries retain identity, URL, dates/type and caveats; primary material facts were traced through the relevant passages. |
| Cross-artifact consistency | 1 / 7 | All 258 native paragraphs and 24 table bindings/order match manuscripts. Harvey's table and prose round 36.25% differently. |
| Data-quality controls | 2 / 7 | Seven calculation surfaces were checked through focused tests/probes. Strategy input validation and the shared scenario CLI/output label need repair. |
| Conclusion support | 0 / 7 | All seven judgments are explicitly conditional. Price/channel comparisons and multi-input stresses are not represented as causal estimates or confidence intervals. |

## Exact checks and actual results

From repository root, with Node v22.14.0 and Python 3.14.6:

| Command | Actual result |
| --- | --- |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/test_models.py` | 10 tests passed. [Log](models-unit-corrected.log). The initial isolation wrapper found 0 tests; its unittest module binding was corrected and this successful run followed. |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/verify_startups.py` | 111 independent Ramp/Flock arithmetic checks; zero activity/retention, boolean/invalid inputs, short horizons, all three native exports, seven tables and four figures passed. [Log](startup-independent.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/elevenlabs/verify_model.py` | 71 independent arithmetic checks, source IDs, immutability, zero workload/capture and four invalid-input cases passed. [Log](elevenlabs-independent.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/run_readonly_checks.py docs/article-drafts/strategy-planning-20261012/pitches/companion/prepare_companion.py --check` | Snapshot plus 40 Python/browser parity cases verified. [Log](companion-python-parity.log). |
| `node --test docs/article-drafts/strategy-planning-20261012/pitches/companion/scenario-math.test.mjs` | 42 tests passed, 0 failed. [Log](companion-node-tests.log). |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/model_probes.py` | All seven canonical model baselines, shared independent math, strategy closed-form/cash/capacity checks passed; API/overwrite/label findings reproduced. |
| `env PYTHONDONTWRITEBYTECODE=1 python3 .cache/content-qa/startup-review/content_consistency.py` | Seven bodies; 258 native paragraphs; 24 table bindings/order; 46 source bindings passed. Excludes root-owned read-time/catalog/assets/resources metadata. |
| `./node_modules/.bin/tsc --noEmit -p docs/article-drafts/strategy-planning-20261012/tsconfig.json` | Passed, exit 0. |
| `node --check docs/article-drafts/strategy-planning-20261012/pitches/companion/startup-models.mjs` | Passed, exit 0. |
| `node <validate-data>/scripts/summarize-coverage.mjs .cache/content-qa/startup-review/coverage.json --scorecard` | Passed after correcting scratch-only inventory/revision metadata; generated the accounting above. |

The [read-only harness](run_readonly_checks.py) redirects author receipt writes into this worker's cache. For `test_models.py`, it also redirects the two temporary-fixture cache declarations. It changes no model logic, input validation or test assertion. No author generator was executed. The four-body delivery verifier's author reading-time assertions were not run because root is updating metadata to the site's separate reading-time policy.

## Remaining boundary

Findings 1–3 are repaired and rechecked as recorded at the current checkpoint. Root retains finding 4, download regeneration, public integration and final desktop/phone route, figure, companion-control and release validation on the combined head. This report certifies neither source-PR CI nor the submitted head, merge, deployment or publication.

No Stripe startup article, native body or draft was found in the scoped repository sources. The only repository Stripe material located was recruiter-profile/outreach context. Root separately confirmed no Stripe content PR/remote branch; do not report a Stripe article as included without resolving that scope.
