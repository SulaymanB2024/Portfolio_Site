# Anduril valuation: revised initial edition

**Anduril Is Building a Prime. The Price Assumes a Platform.**

Evidence cutoff: October 14, 2026. Author: Sulayman Bowles. Native route: `/research/financial-systems/anduril-valuation-capital-productivity`. The revision has 3,218 prose words, an 18-minute reading estimate, 17 claim-specific sources and six original analytical figures. This remains an unpublished initial edition on the existing review branch, not a new historical publication.

## Editorial preparation

The user's brief asks for Anduril valuation and examination of writing on **Kalshi** and other companies. Earlier PR wording incorrectly described Ramp as the named reference; this revision corrects it.

Reviewed references include Contrary's Kalshi memo (https://research.contrary.com/company/kalshi), Sacra's Kalshi research (https://sacra.com/c/kalshi/), Packy McCormick's *Ramp at $1 Billion* (https://www.notboring.co/p/ramp-at-1-billion), and the site's Chegg and hardware-financing essays. The dated Contrary memo is an editorial reference, not current Kalshi financial evidence. These references informed the sequence from product mechanism to monetization and cash. Exchange volume is not exchange revenue; contract ceilings are not funded defense revenue. Neither exchange nor card-platform economics are transplanted into Anduril's valuation. The public article retains only sources supporting its own claims.

## Changes in this revision

The original DCF is preserved. New operating overlays test a two-year margin-ramp delay, phased mature margins, permanently slower collections and Arsenal-2 spending overruns. The reverse solver can now deduct explicitly assumed outside claims. Software margin requirements are translated into dollars of separately monetized revenue. The article examines favorable assumptions inside its own capital conversion and presents the stronger bullish combination rather than treating the base result as certain.

The earlier draft's apparent $7.5bn financing need is corrected. It is the modeled economic FCF deficit after hypothetical liquidity, not a treasury forecast. Noncash employee compensation remains an economic expense. Hypothetical 2% and 4% compensation addbacks affect only cash timing, never valuation. Actual cash, debt service, compensation mix, withholding, customer advances and reserves remain unknown.

The Air Force's June 17 CCA release replaces an unrelated editorial source in the public ledger. Its explicit separation of hardware and autonomy licenses supports both sides of the software argument: a larger accessible market and less captive demand. The announced summer-2027 selection remains a future competition, not a claimed award.

## Reproduce

From the repository root:

```sh
python3 public/research/anduril-valuation/model.py /tmp/anduril-model
python3 public/research/anduril-valuation/stress.py /tmp/anduril-model
(cd public/research/anduril-valuation && python3 -m unittest -v test_model test_stress)
node --experimental-strip-types --test tests/anduril-valuation.test.ts
node tools/verify-article-quality.mjs
npm test
npm run build
npm run verify:release
```

`model.py`, its original output files and its 12 existing tests are unchanged. `stress.py` adds 12 tests and exports `stress-results.json` and `operating-stress.csv`. Five focused Node tests cover packaging, both Python suites, exact output regeneration, browser/Python agreement across 12 input configurations, and the accessible companion's same-origin script contract.

## Interactive companion and visual design

`/research/anduril-valuation/valuation-lab.html` provides a responsive cash-flow chart, explicit number inputs, an inspectable annual table, reverse-valuation controls, CSV export and URL-backed assumptions. Rendering recomputes labels and ticks at mobile widths. Required values do not depend on hover. The model runs locally without accounts, analytics or remote calculation.

The hosted HTML loads `valuation-model.js` and `valuation-ui.js` from the same directory. Executable scripts are not inline, so the existing site Content Security Policy does not need to change. No new dependencies or global styles are introduced. A separate offline copy can embed scripts, but is not the hosted artifact.

The six SVGs show software revenue scale, economic cost versus cash timing, scenario values, discount-rate sensitivity, operating stress and reverse valuation. Each has a title, description, units, accessible native captions and an explicit assumption boundary. Existing attributed site cover art and reader navigation are retained.

## Verification boundaries

Locally executed: 12 operating-stress tests; exact original and stress output regeneration; browser/Python numerical parity; and accessible-script packaging checks. Local Chromium rendering at 1440px and 390px checked layout, overflow, input changes, validation and reverse calculations. Those checks rendered authored HTML directly. Browser navigation to local URLs was administrator-blocked; no browser restriction was bypassed. A hosted URL-state/clipboard round trip was not verified by those local checks.

The repository could not be cloned in the local container, so whole-site build and release claims must be tied to the actual new PR commit's CI receipts. The older successful head is not evidence that this revision passed. No release gate has been weakened. Submission does not authorize merging or production deployment.
