> Independent review retained from this task. Findings describe the reviewed frozen edition and that lane’s scope. The root’s final dispositions and full-site/browser checks are in [the QA report](../QA.md). Scratch paths in executed-command evidence are local diagnostics, not published source records.

# Four longs and revised Chegg: editorial QA

Reviewed 2026-10-14, beginning 23:04 UTC. Frozen source: PR94 `0fe7d470566d2d55a6dd5dd6df94a2e38293f057`. This pass covers the complete native Adobe, PayPal, Crocs, Expedia and Chegg bodies, rather than only their openings or summaries. It supplements the root's independent financial verification.

## Disposition

One substantive reader-utility defect was found, accepted by the root and repaired: Crocs displayed a $66/$165/$273 scenario chart without explaining the bear/bull assumptions. The source manuscript's scenario table was being overwritten by the reverse-valuation table in the same native section. The new Crocs section preserves both exhibits and exposes the frozen operating, cash-allocation and valuation assumptions.

No additional material writing, source-status, period, cutoff or prose/table/figure inconsistency was found in these five bodies. The explicit positive Chegg stance is preserved. Future price accuracy, paid conversion, recurring profitability and actual post-repayment liquidity remain unobserved; the articles do not present those outcomes as established facts.

Root inspected and accepted the actual three-file Crocs diff. Product writes stopped following that acceptance. Reading-time metadata, catalog/publication receipts, archive policy and rendered verification belong to the root.

## Finding repaired

**[P2] Crocs' operating downside was visible but unexplained.** Originally, `src/personal/editorial/data/articles/crocs-cash-and-brand-test.json` explained the base forecast and a separate approximately $156 tax-only cash stress. Its figure also showed a much lower approximately $66 bear case and a $273 bull case, without the growth, cash-margin, capital-budget or multiple assumptions that produced them. A reader could see the wider range but could not assess it from the article.

Reproduction: the original `manuscript-crocs.md` contains `[[table:scenarios]]`, then `[[table:reverse]]` inside one section. `build_articles.py` assigns both to `section['table']`, so the later reverse table replaces the earlier scenario table. This is a binding/presentation defect, not a wrong scenario calculation.

Repair in the authorized files:

- Native Crocs JSON, new section beginning at line 254: a separate four-column, eleven-row table binds the original Bear/Base/Bull brand growth, cash margins, protected commitments, desired net share reduction, purchase-price assumptions, ending cash/shares, multiples, modeled prices and price returns. A short paragraph distinguishes those operating scenarios from the tax-only stress. The table explicitly says that cash caps reduce base/bull purchases below their desired rates and that scenarios have no probability weights.
- `docs/long-pitches-20261012/build_articles.py`, functions beginning at lines 138 and 167 and the CROX-only call at line 200: insertion is reproducible and idempotent. Other companies' bindings are unchanged. The original reverse table and existing figure remain intact.
- `docs/long-pitches-20261012/articles/crocs-cash-and-brand-test.md`, new section beginning at line 219: exported through the existing author Markdown loop narrowed to Crocs.

All original article sections and fields are preserved except the authorized additional section and `dateModified: 2026-10-14`. Publication remains October 13; entry, central $165 forecast, all model numbers, original source IDs and figure are unchanged. The new table reads the existing frozen `inputs.json` and `outputs/model-results.json`; it does not introduce a new model or reinterpret their numerical results.

## Coverage and conclusions

| Native article | Sections | Body paragraphs | Tables | Figures | Sources |
| --- | ---: | ---: | ---: | ---: | ---: |
| Adobe | 8 | 32 | 6 | 3 | 8 |
| PayPal | 8 | 34 | 6 | 3 | 8 |
| Crocs, after clarification | 8 | 28 | 6 | 3 | 4 |
| Expedia | 8 | 30 | 5 | 3 | 4 |
| Chegg | 11 | 49 | 8 | 3 | 9 |
| Total | 43 | 173 | 31 | 15 | 33 |

Ledes, theses, evidence boundaries, assumptions, conclusions, all table cells/notes, all figure captions/alt text and the fifteen SVGs' actual labels/values were read as well. The static coverage receipt confirms valid citation targets and rectangular tables. All reader-facing fields match the frozen source after removing only the authorized Crocs addition; date/read-time metadata is recorded separately.

**Adobe:** The paid-workflow mechanism gives the positive thesis a reader-facing business reason. The article distinguishes revenue, ARR, AI-first ARR and free-product reach. The $650m AI-first ARR disclosure is treated as a floor and its 2.36% ratio as a lower-bound ARR comparison, without turning it into revenue share or paid-user proof. Acquisition-inclusive growth is labeled. EPS growth is separated from net-income growth and net share reduction. The cash-after-compensation measure is an economic sensitivity; compensation replacement is not deducted twice. The $365 central forecast is visibly rounded from $366.52, and the approximately $285 constant-multiple result makes the revaluation dependency clear. Reported, guidance and hypothetical future operating conditions remain distinct; a scheduled future CEO transition is not presented as accomplished performance.

**PayPal:** The distinction between payment volume and retained transaction-margin dollars is useful and consistently carried through the prose, bridge and first figure. Reported-dollar growth is not mixed with currency-neutral branded-checkout/Venmo measures. Transaction margin excluding customer interest is kept separate from total margin and adjusted non-transaction costs. The BNPL timing adjustment is not presented as removing credit/funding risk; retained-loan investment is called a reinvestment rather than a credit loss. Customer balances are excluded from corporate excess cash. The lower $4.804bn anchor, cash-funded share reduction and dividend assumptions support an inspectable $83.19 model/$85 rounded forecast; future dividends remain separate from the primary price-return benchmark.

**Crocs:** The positive core-brand thesis does not require HEYDUDE recovery. Geographic/channel changes are not added to brand totals, and higher direct sales are not assumed to create free margin. Adjusted EPS improvement is distinguished from lower business profit and share-count effects; SBC remains in Crocs' adjusted earnings. The $663.1m observed cash proxy and lower $600m author anchor have different status. The tariff refund is placed after June and excluded from recurring cash/guidance treatment consistently. Repurchase authorization is not treated as funded purchases. Related tax disclosures are not added into a duplicate liability, historical June cash is not called current, and the $156 tax-only sensitivity expressly omits restoration/funding/disruption costs. The new table makes the separate operational bear/bull range inspectable and retains the $165 central forecast.

**Expedia:** The network hypothesis is connected to separate B2C/B2B demand and profit conversion. Faster B2B revenue growth does not become a claim of faster EBITDA or improved margin. Booked and stayed activity are distinguished. The $1.399bn travel-working-capital sensitivity is a conservative author adjustment, with total receivables acknowledged as an imperfect proxy; the $2.648bn anchor is not called a precisely identified maintenance-cash measure. The alternative $2.558bn compensation sensitivity is disclosed without claiming a complete reconciliation. Customer/supplier obligations prevent an excess-cash bonus. Investment/tax effects are not extrapolated from quarterly EPS. The $360 forecast/$360.82 model, dividend convention and same-date SPY comparison are consistent; the constant-multiple result around $338 separates operating progress from revaluation.

**Chegg:** The opening, thesis and conclusion retain “I believe in Chegg.” Debt retirement and operating cash through restructuring give that conviction an explicit financial basis. Lower capex, rather than higher CFO, explains the full FCF improvement; the counterfactual is labeled. Restructuring payments and debt repayment are not deducted twice. The approximately $38m reference is consistently June pro forma liquidity, never reported September/October cash; zero-coupon retirement creates no invented recurring interest saving. Revenue replacement is separated from contribution replacement and its margins are hypothetical. Four stress steps are explicitly nonseasonal model quarters, not a calendar cash forecast; the $25m floor is an author policy sensitivity, not insolvency or a covenant. New beta/partner activity is separated from subscribers, recognized revenue, collections and renewals. Survey findings are graduate self-reports with selection/causality limits. The new July NYSE notice supersedes the earlier compliance announcement without implying an implemented reverse split.

## Source spot checks for the changed Chegg narrative

The following primary sources were opened live during this pass. These checks concern the added commercial and listing narrative; they are not a new full Chegg financial audit.

- [Q2 release and prepared remarks, August 6](https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Reports-Second-Quarter-2026-Earnings/default.aspx): supports the employability-beta scale, named new skilling partners and planned second-half launches. The article appropriately treats those as starting evidence rather than paid adoption.
- [Filed Q1 prepared remarks, May 6](https://www.sec.gov/Archives/edgar/data/1364954/000136495426000045/a9901-financialresultsq120.htm): supports the 43% efficiency and 41% work-quality graduate survey statements. Their use as selected self-reports is faithful to the source.
- [New NYSE notice, July 24](https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Receives-Continued-Listing-Standard-Notice-from-NYSE/default.aspx): supports a separate new minimum-price deficiency and the six-month cure period.
- [Annual meeting/compliance announcement, June 17](https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Announces-Annual-Stockholder-Meeting-Results-and-Regains-NYSE-Compliance/default.aspx): supports shareholder approval, the board's then-current choice not to implement a split, and retained flexibility. It does not supersede the later July notice.

All four source dates precede the frozen October 12 cutoff. The four longs' source binding and statement accuracy rely additionally on the root's completed primary-source checks; this editorial pass did not independently reopen every long filing/PDF.

## Actual verification

Commands below ran from the integration repository and passed:

```sh
python3 .cache/content-qa/longs-editorial-review/verify_crocs_clarification.py > .cache/content-qa/longs-editorial-review/crocs-clarification-verification.log
python3 .cache/content-qa/longs-editorial-review/editorial_coverage.py > .cache/content-qa/longs-editorial-review/editorial-coverage.log
git diff --check -- docs/long-pitches-20261012/build_articles.py docs/long-pitches-20261012/articles/crocs-cash-and-brand-test.md src/personal/editorial/data/articles/crocs-cash-and-brand-test.json
```

The first script ran the complete author builder against **only Crocs in an isolated cache mirror**, compared the regenerated section/date, verified idempotent insertion, and ran only the existing author Markdown-export prefix with its manifest filtered to CROX. It did not execute the archive/receipt portion. The builder's old fixed console message says “four” even in that narrowed mirror; only the Crocs native file was generated there. Thirteen protected file hashes remained unchanged: the other four native bodies, three other long Markdown files, inputs, model output, forecast registry, source register, article manifest and existing Crocs price figure. No live all-batch generator ran.

The second script records all five native bodies and all fifteen SVGs, confirms local source-anchor bindings, table column counts and frozen reader-field identity except the authorized addition. It performs no financial recomputation.

The existing `qualityProseWords`/`qualityReadingMinutes` functions were also called read-only with Node: Crocs is now **2,045 prose words / 13 MIN**, compared with the native's previous 12 MIN at handoff. Root was notified and owns the metadata/manifest/receipt update.

The root reported its separate fresh `recompute.py` run passing **93 source checks, 552 arithmetic checks and 17 synthetic evaluator cases**, with snapshot identity matched. Those checks were deliberately not rerun or claimed as this agent's independent testing. New table cells are formatted directly from those frozen inputs/results. Future realized forecasting performance is not testable now.

Evidence: `crocs-clarification-verification.json`, corresponding log and reproducible scoped harness; `editorial-coverage.json`, corresponding log and coverage script. Native/source/output hashes are captured in those receipts. Initial frozen inputs remain SHA-256 `11ca6cc7ed5db6a858aa6b2a9b1218f23464a1bd69fc3edc616236b1ca04beec`; scenario output remains `8c002f1185e5e4537f242834b17427ffadfae5d3a4fed000d451644bd08bcb7e`.

## Limits and remaining boundary

No browser rendering, screenshot or accessibility-tree QA was performed here; root owns those checks, including the newly added table. No numerical model, frozen price/forecast registry, public ZIP, source author record, shared catalog or publication receipt was changed by this pass. The Crocs reading-time integration was explicitly handed back to root. A minor pre-existing spacing blemish remains in the Crocs operating-test table (`fewer than44m`, native line 356); it does not change the forecast and was left outside the accepted clarification.

This closes the bounded five-body editorial review and the accepted Crocs binding repair. No additional material defect remains identified within this scope.
