> Independent review retained from this task. Findings describe the reviewed frozen edition and that lane’s scope. The root’s final dispositions and full-site/browser checks are in [the QA report](../QA.md). Scratch paths in executed-command evidence are local diagnostics, not published source records.

# Valuation content QA — October 14, 2026

Read-only review by the valuation-review lane. **Ready within the calculation and packaging scope, with source-access caveats; Kalshi's invalid-input presentation needs revision.** All three assigned articles/models received a review. Product files were not edited. Native reader/browser inspection, release gates and integration acceptance belong to the root.

## Authoritative versions and retained decisions

- Anduril #98: `475f788b100bc02ef14df9007f427200f1746c95`.
- Kalshi #97: `452d02e093e6e80be8bd3269122ca7b127cbe2df`.
- Hyperliquid #96: `97320828eac67b6f5d9f958df5262fc3acd352b3`.
- Frozen main for the optional Stripe inventory check: `ed0d992825e1a4ee58914fc82f4459b0304034e0`.

Reviewed the consolidation contract, source-specific README/review and source registers, all 36 article sections, both implementations and published inputs/results/CSVs, companion UI scripts and all 15 analytical SVGs' labels/descriptions. Reused the original model conventions rather than revising author assumptions. Retained October 14 source cutoffs, reported versus forecast distinctions, hypothetical cash/NCI bridges, economic compensation costs, Hyperliquid's policy-dependent claims and full-allocation denominator, and Kalshi's subjective scenario probabilities.

Scratch copies are exact relevant files from the frozen refs, under `pr96/`, `pr97/`, `pr98/`. Published-model execution only writes in these copies. The parent owns final product edits.

## Prioritized findings

1. **P2 — Kalshi leaves stale financial results visible after invalid assumptions.** In the frozen `public/research-assets/kalshi-valuation-2026/model-ui.js`, the early return at line 54 and catch at line 74 only change the error message. Clearing discount, or entering HTML-valid discount 5% / growth 6%, leaves `$29.53bn` weighted equity, `$27.41bn` base equity, `$26.41bn` base EV and `$13.25bn in 2031` visible. They describe the previous input set. The result panel is still titled “Value today,” and neither the numeric results nor forecast/reverse surfaces identify themselves as previous-valid output. **Fix (Proposed):** hide or clear all result/forecast/reverse surfaces on invalid inputs, restore them only after successful recomputation, and verify valid→invalid→valid transitions. Root acknowledged and owns the correction. Evidence: `reproduce-kalshi-stale.mjs`, `kalshi-stale-output.json`. This is execution of the actual UI script with a small DOM fixture; it is not a browser-rendering claim. No native Enter-submit failure was established.

2. **Scope reconciliation — no Stripe article located in frozen main or integrated article sources.** `git grep -n -i stripe ed0d992825e1a4ee58914fc82f4459b0304034e0 -- src/personal/editorial public/research public/research-assets` returns no match. The current `src` only identifies Stripe in recruiter/company-profiles.ts; the consolidation note itself says an article is already in main. **Fix (Proposed):** root should locate the intended Stripe manuscript/PR, or correct that completion claim. This is an inventory gap, not a criticism of an uninspected Stripe article. No Stripe QA is claimed.

No demonstrated central-value arithmetic, units, EV/equity bridge, compensation/dilution double count, source-anchor or missing-download defect was found in the three reviewed frozen editions.

## Analytical and artifact coverage

Totals below are scoped component counts, not verification percentages. `0 / N` means no remaining defect observed; it does not imply every external source or browser state passed.

| Category | Observed defects | Assessment |
| --- | --- | --- |
| Usefulness/completeness | 0 / 3 | All three articles expose a thesis, operating drivers, price-implied path, downside and change-of-view criteria, with usable downloadable models. The optional Stripe inventory is separately unresolved. |
| Analytical clarity | 0 / 36 | All sections read. Forecasts, source dates, units, capital and claim boundaries remain explicit. |
| Visual/interaction consistency | 1 / 3 | One demonstrated Kalshi UI invalid-state defect. Anduril explicitly labels retained previous-valid output and blocks export; Hyperliquid hides invalid results. Native rendered/keyboard/phone QA remains root scope. |

| Category | Observed defects | Assessment |
| --- | --- | --- |
| Source authority/confidence | 0 / 52 | All source ledgers reviewed; material primary disclosures and original research sampled below. Exact Reuters discussion pages were inaccessible; several smaller company announcements were not independently re-fetched. No blanket live-source pass is claimed. |
| Value accuracy | 0 / 3 | Independent baseline recomputation from drivers/CSV accounting plus Python/JS focused checks agree. 45 Anduril annual accounting rows, 30 Kalshi annual forecasts and 30 Hyperliquid discounted flows checked; Hyperliquid's 15 explicit product rows recomputed. |
| Within-chart agreement | 0 / 15 | Every SVG title, description, numeric text and unit label inspected against model values. Pixel geometry/readability and native figure interaction remain root scope. |
| Complete source details | 0 / 3 | Ledgers, assumptions and model downloads present; inaccessible source internals and unresolved private-company accounting remain honestly bounded. No paid/private underlying books or allocation agreements inspected. |
| Cross-artifact consistency | 0 / 3 | Article tables, prose headline rounding, source IDs, companion default values, inputs/results and CSVs agree in the reviewed editions. |
| Data-quality controls | 0 / 3 | Historical data are separated from forecast assumptions; no shared denominator is manufactured for Kalshi events/perps, no duplicated Hyperliquid reserve income, no Anduril ceiling/backlog addition. |
| Conclusion support | 0 / 3 | Judgments remain conditional on the modeled economics, securities and uncertainty. No forecast is presented as audited revenue or guaranteed return. |

## Recomputed results and accounting review

`independent-audit.py` does not import the product model helpers. `independent-audit-results.json` and `independent-audit.log` retain the checks.

| Model | Independently reproduced baseline |
| --- | --- |
| Anduril | EV: downside `-0.127258553bn`, base `27.684556277bn`, upside `67.367368924bn`; base gross bridge `30.684556277bn` with assumed `3bn` cash. |
| Kalshi | EV: restricted `2.613160498bn`, base `26.406006237bn`, breakout `58.706539007bn`; weighted EV `28.532927995bn`, equity `29.532927995bn`. |
| Hyperliquid | Per token: erosion `4.237572811`, central `29.964894022`, dominant `126.356364564`; `75.675070668%` of central PV follows 2031. |

Anduril: the 78/365 remaining-year stub, actual-day annual discount periods, cash tax on positive EBIT, NWC changes, capex/depreciation/fade accounting, $3.7bn A2 schedule, terminal reinvestment and EV/cash/NCI bridge reconcile. Margin-delay and receivables overlays retain the stated investment timing. Terminal receivable growth is funded. Hypothetical compensation addbacks affect cash timing only. The negative downside EV is explicitly not a negative limited-liability share price or a recovery floor. Software mix arithmetic gives `34.2857%` at the stated 15% hardware / 50% software / 5% corporate assumptions. The article discloses the favorable cash-conversion assumptions instead of representing them as verified industrial productivity.

Kalshi: event maximum-payout notional is distinct from perpetual exposure. The default taker example gives $1.75 for 100 contracts at 50 cents, and $0.63 at 10/90 cents. Net revenues, economic stock compensation, positive-profit tax, sales-to-capital reinvestment, stub and terminal reinvestment are consistent. The price-consistent path scales all forecast years and pays additional reinvestment. Holding the restricted weight at 25% requires `57.405261175%` breakout weight to reach $40bn equity; the article's 57.4% rounds correctly. Net cash, regulatory capital, customer collateral and preferences are separated. Python and module JS parity also covers all 30 published forecast rows.

Hyperliquid: $1tn turnover at 1bp is $0.1bn; crypto/noncrypto/spot/reserve streams and token-million conversion reconcile. Parent receipts annualize to `0.871741667bn`; the mixed perps receipts ratio is `3.340888508bp`, not a pure trading fee. The unreconciled quarterly gap is `4.84m` and stays disclosed. The net forecast does not apply 99% twice or add reserve yield to already-inclusive observed receipts. Full-allocation and alternate denominators are framed as competing economic claims rather than circulation predictions. Stress implementations preserve the original growth anchor, two-year stream discounting and additional policy diversion. No-shock/default cases and implied-return checks agree.

## Source checks and limits

The following checks support the important source boundaries; they do not assert that all 52 links were reverified.

- [Army enterprise contract](https://www.army.mil/article/291074): the $20bn ceiling is explicitly not obligated value; existing actions, discounts and continuing competition support the article's treatment.
- [Army open-architecture discussion](https://www.army.mil/article/295204/accelerating_multi_domain_interoperability_through_open_software_architectures): supports modular interfaces and Lattice integration, without establishing software monopoly economics.
- [Air Force CCA release](https://www.usafe.af.mil/News/Article-Display/Article/4520575/air-force-advances-future-of-air-superiority-with-cca-contracts/): read the complete retained official capture `94b523f47e6c4ecdb353984d363b0782`. Its Markdown SHA256 `fd072a36357fc5304abd7635a7503895ef6342f547ed0476284c05daf4893151` matches the article's source register. Separate hardware/software awards, three competitive software options, future summer-2027 selection, performance-linked licensing and portability are supported. Direct native-web fetch returned 403; retained capture access succeeded.
- [Anduril Arsenal-2 announcement](https://www.anduril.com/news/anduril-u-s-navy-invest-usd6-6-billion-to-expand-america-s-submarine-industrial-base): indexed primary text supports $3.7bn private investment, outcome-linked up-to-$2.9bn Navy purchases and expected 2030 operations. Direct fetch said enable JavaScript; the retained capture `55ac36da4f204eab906334d1c2efe319` contains only title/metadata and an empty article body, so that capture alone was not counted as substantive verification.
- [Columbus first Fury release](https://columbusregion.com/it/press-release/first-ohio-built-fury-rolls-off-andurils-arsenal-1-production-line/): supports the July 27 first aircraft; its potential annual capacity is a company claim, as the article correctly distinguishes.
- [Lockheed Q2](https://investors.lockheedmartin.com/news-releases/news-release-details/lockheed-martin-reports-second-quarter-2026-financial-results): first-half MFC margin is 14.1%, distinct from quarterly 14.5% and consolidated results.
- [The Information planning report](https://www.theinformation.com/articles/anduril-forecasts-4-billion-sales-1-billion-losses): indexed excerpt supports $4.3bn projected sales and $1.2bn operating loss. Underlying investor materials remain unread.
- [Kalshi financing announcement](https://news.kalshi.com/p/kalshi-raises-1-billion-22-billion-valuation-institutional-demand-surges): May 7 completed announcement and annualized activity pace match the article's definitions.
- [Kalshi fee PDF](https://kalshi.com/docs/kalshi-fee-schedule.pdf): the July coefficient, default multipliers, formula and numeric examples support the text. Nonstandard maker/series terms and perpetual tiers are real exceptions, not a universal permanent take rate.
- [Sacra operating estimates](https://sacra.com/c/kalshi/): July annualized revenue and initially zero-fee June perpetual activity are correctly described as estimates with incompatible timing/definitions, not audited annual net revenue.
- [Robinhood routing disclosure](https://robinhood.com/newsroom/the-world-cup-is-now-trading-on-robinhood-and-rothera/): named Rothera routing, selected contracts and continued multiple-venue disclosures support the distribution argument; no undisclosed Kalshi partner economics are inferred.
- [CFTC proposal](https://www.cftc.gov/PressRoom/PressReleases/9310-26) and [its text](https://www.cftc.gov/media/14731/NRPM_EventContractsSwapInclusions100926/download): proposal timing/status and the divided appellate descriptions agree. The article attributes the agency's interpretation and does not claim a final legal resolution.
- [ICE Q2](https://ir.theice.com/press/news-details/2026/Intercontinental-Exchange-Reports-Second-Quarter-2026/default.aspx) and [CME Q2](https://www.cmegroup.com/media-room/press-releases/2026/7/22/cme_group_inc_reportsstrongfinancialresultsforq22026.html): segment/consolidated margin distinctions and the CME income/data figures match; corporate margins are not substituted for protocol holder receipts.
- [Hyperliquid parent](https://defillama.com/protocol/hyperliquid) and [perps](https://defillama.com/protocol/hyperliquid-perps) dashboards: material rolling receipts/fees/volume fields agree with the retained inputs. Quarterly parent accounting fields were not exposed in this text retrieval; the supplied reconciliation was recomputed, not independently indexer-audited.
- [Pinned DeFiLlama adapter](https://github.com/DefiLlama/dimension-adapters/blob/e02384e92cbfb8c058e4de8440644aa8d8b0fc58/dexs/hyperliquid-perp/index.ts): reserve yield appears in fees, revenue and holder-revenue definitions; builder/HLP/deployer distinctions support avoiding double counting. No independent indexer rerun is claimed.
- [AQAv2](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/aligned-quote-assets), [fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees), [HIP-3](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals) and [staking](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking): support cost-adjusted reserve yield, timing, growth-mode multiplier, deployer stake/burn treatment and emissions-funded staking rewards.
- [CoinGecko annual report](https://www.coingecko.com/research/publications/2025-annual-crypto-report): top-ten CEX/DEX samples support $86.2tn/$6.7tn; `6.7 / 92.9 = 7.2121%` differs from `6.7 / 86.2`. The forecast's $200tn remains an assumption.
- [CoinShares framework](https://coinshares.com/us/insights/research-data/hyperliquid-primer-and-5-year-valuation-framework/), [Multicoin PDF](https://assets.ctfassets.net/qtbqvna1l0yq/2Ww5QUmNhe8q0OhTlkRzjJ/7d82ee41b8c59e1e68c32813de8d757b/Hyperliquid__HYPE__Analysis_and_Valuation_English.pdf) and [Artemis](https://about.artemis.ai/resources/hyperliquid-a-valuation-model-and-bull-case): quoted framework/outcome distinctions are supported. CoinShares' 707m convention explicitly avoids a second buyback supply reduction; Multicoin's future outcome, fee assumption and substantial investment disclosure are present; Artemis separates exchange and HyperEVM.

Unresolved external access: the exact Reuters Anduril ~$100bn and Kalshi ~$40bn discussion pages did not open via native web; targeted saved-corpus searches did not retrieve the originals. Their status remains reported discussions, never verified closings. Smaller ancillary company announcements, the full PitchBook paid report, corporate financial statements, NCI rights and reconciled token allocation schedules were not newly audited. Private financial/ownership assumptions must remain visibly hypothetical.

## Exact checks run

- In `pr98`: `node --experimental-strip-types --test tests/anduril-valuation.test.ts` — **5/5 passed**. This executes **24/24 Python tests**, exact JSON/CSV regeneration, 12 Python/browser-model input configurations, reverse valuation with assumed claims and accessible script/packaging assertions. `anduril-tests.log` contains the final run.
- In `pr97`: `node tools/test-kalshi-valuation.mjs` — **all assertions passed**, including 30 annual Python/JS rows, source anchors, assets/catalog/publication identity, reverse and fee/discount sensitivity. `kalshi-tests.log`.
- In `pr97`: `python3 public/research-assets/kalshi-valuation-2026/model.py` — **executed successfully**, regenerated scratch assumptions/CSV/results and passed its arithmetic assertions. `kalshi-python.log`.
- In `pr96`: `node --experimental-strip-types --test tests/hyperliquid-valuation.test.ts tests/hyperliquid-stress.test.ts tests/hyperliquid-publication.test.ts` — **16/16 passed**, including independent Python execution, original/stress results, custom inverse supply, source/asset checks, boundary inputs and manuscript read-time/fingerprint diagnostics. `hyperliquid-tests.log`.
- `python3 .cache/content-qa/valuation-review/independent-audit.py` — **passed**, independent recomputation described above. `independent-audit.log` and `independent-audit-results.json`.
- `node .cache/content-qa/valuation-review/reproduce-kalshi-stale.mjs` — reproduced the UI issue; `kalshi-stale-output.json`.
- XML parsed every analytical SVG and inspected all title/description/text labels: **15/15 readable, units and rounded values consistent**. No screenshot-rendered acceptance claimed.
- Frozen-main Stripe content search: no article/reference match in editorial/research surfaces. Current whole-source search only found recruiter profile context.

Initial scratch-test failures were missing extracted catalog/helper dependencies, not product regressions. They were resolved by extracting the relevant immutable support files before the final passing runs. The independent audit's scratch assertion for the breakout probability was corrected to compare with the article's actual rounded 57.4% claim, not an invented full-precision constant. No production code or published numerical values changed.

## Next boundary

Root: verify the Kalshi invalid-state fix on actual native/browser surfaces; reconcile Stripe scope; accept this report against the retained logs and scratch recomputation; complete integration/browser/build/release checks and submit the inclusive PR. These findings do not authorize merging or publishing.
