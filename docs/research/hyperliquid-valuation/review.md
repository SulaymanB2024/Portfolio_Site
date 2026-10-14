# Hyperliquid valuation: revised research and review record

Research cutoff: 2026-10-14. This is the Hyperliquid article in PR #96, not a Kalshi valuation. The PR remains a proposed initial publication; no production merge is authorized by this revision.

## What changed

The opening now describes third-party distribution and distinguishes network success from token returns. The bullish counterargument is stronger: distributors might compete away their own margins while shared liquidity protects protocol pricing. The article explains all-in execution costs, not only headline fees.

New analytical work measures the present value after the driver forecast, isolates fee/yield/policy/timing stresses, and solves the return requirement implied by $80 on the unchanged central business and supply assumptions. That rate is 10.0379%, not a forecast of realized return. The central $29.9649 estimate remains unchanged at an 18% hurdle.

Present-value decomposition: $6.9632bn during the first five driver years, $9.9386bn during the five-year fade, and $11.7240bn terminal. Thus 75.6751% depends on flows beyond 2031 even though the named terminal value is 40.9560%.

New isolated stresses: crypto net fee -1bp yields $21.5928; non-crypto fee -0.25bp $28.6140; reserve yield -1 percentage point $28.6819; 20% additional future receipt diversion $23.9719; whole-stream two-year delay $21.5203; immediate stable growth after 2031 $20.6106. No probability weights, elastic-volume responses or liquidation floors are implied.

CoinGecko's 2025 report adds a scale reference: its top-ten centralized and decentralized perpetual samples total $92.9tn. DEX share of the combined sample is 7.2%, distinct from the DEX/CEX ratio of 7.8%. This is not a complete world census or a synchronized 2026 baseline. The model's $200tn market remains an author assumption.

The HIP-4 passage is corrected: zero material central-case contribution is a forecast choice, not a claim that no outcome fees exist. Current fee documentation describes charges and the provider displays small receipts, while older proposal language still discusses zero-fee testing.

## Model design and independent calculations

The original model.py, model.js, inputs.json, results.json and annual CSV remain unchanged. New stress.py and stress.js implement the extension separately. No-shock outputs reproduce the original scenarios. Isolated product shocks retain the original case's final-year growth anchor. Recalculating that anchor after a shock can perversely make an earlier-year improvement reduce the terminal value; an explicit monotonicity regression test protects this distinction.

A diversion is an ADDITIONAL hypothetical future policy change, not another deduction for recipient shares already excluded. A delay postpones the whole stream and terminal value, not a realistic no-revenue operating forecast. Supply represents economic participation, not merely tokens available for sale. A smaller denominator requires evidence; no precise unobserved annual issuance path is invented.

## Visual and interface review

Five paper/ink SVG figures have labeled units, source/assumption boundaries, accessible titles and descriptions. The new duration figure separates driver, fade and terminal present values. All five were rasterized and visually inspected. The model puts the result before controls, exposes economic stresses, shows annual values in a chart and tables, and shares state through URL fragments. No external runtime dependencies were added.

Local Chromium checks at 390px and 1440px exercised central and bull results, fee changes, maturity, delay, invalid-state hiding, 707m/12% sensitivity, zero allocation, reset, and serialized-state restoration. There were no JavaScript errors or horizontal page overflow in those checks. These used the actual authored markup, styles and scripts in an offline DOM, with the original numerical input fixture and a stub for history.replaceState. They are NOT deployed-browser or network end-to-end tests. Desktop and mobile screenshots were inspected.

## Validation boundary

Eight new focused Node tests passed locally, including execution of the independent Python implementation against full-precision frozen results. The original baseline focused tests are retained. Final repository-wide CI and deployment status should be read from the exact PR head; this document does not predeclare a later run successful.

The previously reported final run on ac8ea6f failed 1 of 696 unit tests because the publication fingerprint did not match its article bytes. This revision binds the record to the exact uploaded article blob. No integrity check is disabled or relaxed. The manuscript is 3485 prose words with a computed 19-minute reading estimate. The catalog and existing artwork assignment are unchanged.

Outstanding evidence: the $4.84m dashboard reconciliation gap, unisolated matched 30-day reserve component, non-audited token allocation register, and policy-dependent claim all remain visible. Holdings and commercial relationships were not supplied; no statement of zero interests is invented. This is a single-assistant self-review with independent calculation implementations, not an independent investment-committee approval.

## Reproduce

`python public/research/hyperliquid-valuation/model.py`

`python public/research/hyperliquid-valuation/stress.py`

`node --experimental-strip-types --test tests/hyperliquid-valuation.test.ts tests/hyperliquid-stress.test.ts`

Use the PR's exact-head CI for the full suite, article integrity, site build and release checks. Production remains unchanged until a separately authorized merge.
