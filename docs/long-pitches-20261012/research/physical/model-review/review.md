# Independent model review, October 13, 2026

**The current four-company model passes the numerical review.** No material arithmetic errors remain in the reviewed version. Future investment accuracy is unobserved. This review establishes source binding, cash-budget consistency and evaluator behavior; it does not establish that the forecasts will occur.

`verification.json` records **93 primary inline-XBRL input checks**, **552 independent financial checks** and **17 synthetic evaluator cases**, with no failed checks. The five root files were copied into `snapshots/` and hashed before review; all still matched their root versions at completion. `recompute.py` reproduces the review without importing the root forecast function. The evaluator itself was executed from the pinned snapshot against explicitly marked test fixtures.

Coverage includes all four TTM datasets, all twelve bear/base/bull paths, both annual cash budgets and resulting share counts, rounded forecasts, frozen entry prices, dated cover shares, Crocs’s additional cash stress and all four coupled reverse hurdles. The 36 growth/multiple sensitivity-grid cells were not independently recomputed. Source checks cover the 72 core revenue/NI/CFO/capex/SBC/repurchase inputs plus 21 supplemental PayPal lending/SBC and Expedia working-capital/equity-SBC inputs. For supplemental cash lines, XBRL magnitudes and relevant concepts match; cash-flow direction follows the readable statement because taxonomy “increase” signs can differ from cash outflow signs.

| Company | Plain TTM CFO less capex | Cash less CFO SBC | Underwriting cash anchor | Base model price | Rounded forecast |
| --- | ---: | ---: | ---: | ---: | ---: |
| Adobe | $10,592m | $8,521m | $8,521m | $366.5168 | $365 |
| PayPal | $6,586m | $5,585m | $4,804m | $83.1916 | $85 |
| Crocs | $704.620m | $663.103m | $600m | $165.2995 | $165 |
| Expedia | $4,459m | $4,047m | $2,648m | $360.8222 | $360 |

PayPal’s additional economic charges reconcile independently to **$128m capitalized SBC** and **$653m retained-loan net investing**. The model does not add customer-funds financing or company BNPL-adjusted FCF to equity cash. Expedia’s **$1,399m** travel-working-capital sensitivity includes deferred bookings, merchant payables and total receivables; the additional **$90m** equity-book SBC charge is separately shown as a sensitivity. Total receivables are an imperfect merchant/agency proxy, so the normalization must retain its author-judgment label. Crocs’s reduction from $663.103m to $600m is a chosen recurring-cash anchor, not an observed expense.

No separate buyback yield is added on top of modeled per-share growth. Net share reduction is funded from owner cash after dividends and allocations. Forward cash margins already include the economic stock-compensation reserve; the displayed SBC replacement amount reconstructs the pre-SBC gross budget rather than deducting compensation twice. It remains an approximation to actual future dilution replacement. Adobe, PayPal and Expedia achieve their desired base share reductions within the budgets. Both Crocs base budgets bind, producing less reduction than a mechanically compounded 7% assumption.

The cover share dates are **September 18 for Adobe, July 22 for PayPal, July 23 for Crocs and July 24 for Expedia**. Expedia includes both common and Class B shares. These are dated disclosed proxies, not exact October 12 outstanding shares. The price forecasts are on the original-entry-share basis for October 12, 2028, capitalizing the recurring annual cash run-rate near the financial period then available. They are not quarter-end price claims or calibrated probabilities.

The root added a coupled reverse diagnostic after the initial review. It scales both annual owner-cash margins and recomputes affordable share reduction. Independent results match:

| Company | Year-two cash for 10% annual price return | Ending shares |
| --- | ---: | ---: |
| Adobe | $7,382.52594m | 358.68672m |
| PayPal | $4,363.42085m | 772.05344m |
| Crocs | $565.44633m | 43.97281m |
| Expedia | $2,821.84071m | 112.92620m |

For Crocs, both cash caps bind at the hurdle. I solved it in closed form from the cash-funded share equation, independently of the root’s binary search. For the other three, their desired reductions remain affordable at the hurdle, so the fixed-share solution is valid. Use `coupled_reverse` in public exhibits. The legacy conditional hurdle holds terminal shares fixed and is only a conditional sensitivity, not the minimum cash requirement of a newly recalculated cash path.

Crocs’s revised base allocates **$150m annual debt paydown plus $100m protected tax/liquidity budget**. The protected amount is unavailable for buybacks and receives no terminal valuation bonus; it need not be all spent. The hypothetical **$600m tax payment replaces the first-year $100m protected budget**, so the incremental allocation is $500m and total first-year allocation becomes $750m. Against $626.417451m owner cash, the shortfall is **$123.582549m** and first-year net buybacks are zero. June’s historical unrestricted cash of **$170.276m** would hypothetically leave **$46.693451m** after that shortfall. This does not prove current liquidity or sufficient minimum operating cash. The stress price **$155.878416** remains conditional on available funding; do not describe it as a fully funded outcome.

The evaluator’s initial arbitrary-later-date acceptance and missing distribution-number validation were corrected by the root and retested. The fixed date rejects observations before or after the frozen session. Synthetic cases confirm a 2-for-1 split is converted to original-share value, a zero-price delisting stays in the scoring denominator, an omitted company is rejected, and incomplete distribution data preserves every price result while withholding cash-return comparisons for the whole group. Invalid entry/distribution values, duplicate symbols and unreconciled corporate actions are rejected. The SPY cash-excess formula and flat-price error baseline reconcile. These fixtures have invented `TEST_` symbols and are explicitly **not future observations or performance evidence**.

The remaining limits are economic assumptions and source interpretation, not unresolved numerical defects: cash margins and average repurchase prices are author forecasts; Expedia’s working-capital attribution is incomplete; tax-settlement timing is unknown; protected cash is a budget allocation; and SBC replacement is a proxy. The base price targets include stated terminal multiples, so writing must preserve the fixed-entry-multiple comparison before claiming returns do not need a rerating.

All review writes are inside `research/physical/model-review/`. Root remains responsible for the final manuscript, integration, visual inspection and delivery. No root model, article, other agent surface or external account was changed by this reviewer.
