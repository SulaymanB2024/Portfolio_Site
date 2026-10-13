# Chegg: cash flow and the skilling transition

Public-source financial case study by Sulayman Bowles. Evidence cutoff: October 12, 2026. USD millions unless indicated.

## Reproduce

From this folder, run `python3 model.py --output outputs`. The model uses only Python's standard library. It writes the historical reconciliation, quarterly stress paths, scenario summaries and replacement-growth calculations. No credentials, network requests or paid APIs are needed.

For the plots and notebook, install the pinned packages in `requirements-figures.txt`, then run `python3 figures.py` or execute `worked-model.ipynb` from this folder.

## What is observed

`inputs.json` separates reported figures from management disclosures and author assumptions. `source-register.json` gives the primary URLs, statement sections and limits. Latest financial statements used are June 30, 2026. September 1 debt repayment is a subsequent event.

The historical model reconciles:

- H1 2025 FCF $3.791m − CFO decline $5.525m + lower capex $11.195m = H1 2026 FCF $9.461m.
- H1 2026 net loss −$2.723m + non-cash/reconciliation adjustments $29.367m − operating asset/liability changes $12.483m = CFO $14.161m.
- Cash including restricted balances: opening $33.411m + CFO $14.161m − capex $4.700m + investment maturities/sales $25.710m − financing $21.877m − FX $0.451m = closing $46.254m.

Cash including restricted balances is different from unrestricted cash plus investments. Investments becoming cash are not new operating cash generation.

## What is assumed

The four-quarter stress test uses management's rounded $38m **June 30 pro forma** cash-and-investments reference after debt repayment. It is not a September or October cash balance. Principal repayment is not subtracted again.

Initial revenue and the earnings proxy are calibrated to the midpoints of August Q3 guidance. The product split, 70%/45% contribution margins, cost reductions, capex, conversion drag, payment timing and $25m reserve floor are author assumptions. Contribution margins are not reported product margins. The earnings proxy is not reported adjusted EBITDA or GAAP income.

Model quarters are hypothetical sequential steps, not estimates of calendar quarters. No seasonality, new borrowing, acquisitions, litigation proceeds, buybacks, equity transactions or investment-value changes are modeled. Management's expectation of positive second-half free cash flow is separate from these deliberately pressured paths. There are no probability weights or stock valuation conclusions.

The replacement-growth table is a separate, comparable-period calculation using Q2 2026 revenue bases. Its 20%–40% decline assumptions are not the stress test's sequential quarterly rates. With equal contribution margins, the revenue and contribution hurdles are equal.

Change the declared assumptions to explore alternatives. Raising quarterly capex by $1m lowers four-quarter ending liquidity by $4m, holding all other inputs fixed. Every dollar spent at the beginning reduces every later balance by one dollar in this simple model. A reserve breach is a policy signal, not proof of insolvency.

## Files

`model.py`, `inputs.json`, `source-register.json`, `outputs/`, `figures.py`, `figures/`, `worked-model.ipynb`, `verify.py`, and `requirements-figures.txt`. Calculation checks retain full Decimal precision; the article rounds outputs for readability.
