# Anduril: initial research edition

**Title:** Anduril Is Building a Prime. The Price Assumes a Platform.

**Evidence cutoff:** October 14, 2026. **Author:** Sulayman Bowles.

**Canonical path:** `/research/financial-systems/anduril-valuation-capital-productivity`

## Editorial work

The brief named Anduril as the valuation subject and Ramp as a writing reference. This edition values Anduril. Before drafting, the research examined Packy McCormick's *Ramp at $1 Billion* (https://www.notboring.co/p/ramp-at-1-billion), Contrary's Ramp and Anduril reports (https://research.contrary.com/company/ramp and https://research.contrary.com/company/anduril), Ramp's corporate valuation writing (https://ramp.com/blog/ramp-november-2025-valuation), and this site's Chegg article opening and native evidence presentation.

The useful editorial pattern was to connect product mechanisms to monetization, then test the cash consequences. Promotional company writing is not independent valuation evidence. The Anduril profile was used to orient the business review, not as the source of current financial anchors. The final article's 17-source ledger gives claim-specific limitations.

## The underwriting view

Base consolidated enterprise value is $27.685bn. Adding an assumed $3bn net cash gives $30.685bn gross equity before minority interests and security-specific claims. This already requires $50.704bn revenue and 22% EBIT margin in 2036. The model incorporates a 78-day remaining-2026 stub, explicit 2027–2036 assumptions, a five-year maturity fade, and ROIC-funded terminal reinvestment.

The $61bn completed financing reference and $100bn reported discussions are deliberately different evidence classes. Contract ceilings are not summed into revenue. The Navy contract limit is not deducted from Arsenal-2 capex. A reported government project stake is not treated as 40% of the parent.

## Reproduction

From the repository root:

```sh
python3 public/research/anduril-valuation/model.py /tmp/anduril-model
cd public/research/anduril-valuation
python3 -m unittest -v test_model
```

The model uses only Python's standard library. `value()` exposes discount rate, terminal growth, net cash, available cash, minority-interest value, and revenue scaling. `reverse()` solves the sales path required by a gross equity reference. `forecast.csv` contains all 45 scenario-year cash-flow rows. `model-results.json` contains input arrays, scenario values, the remaining-period stub, sensitivities and reverse-DCF results. It does not duplicate the CSV rows.

The five original SVGs show contribution-margin mix, cumulative funding need, scenario values, required-return sensitivity, and reverse valuation. They carry units, assumption boundaries and accessible titles/descriptions. The existing native reader supplies keyboard-accessible horizontal figure inspection and source navigation. The standard research social card is retained rather than using an unsupported SVG as an Open Graph image.

## Publication and checks

The article is an initial edition, not a retroactive restoration. `docs/article-publications.json` binds its exact manuscript bytes. Existing article content is unchanged. The focused Node test verifies article registration, citations, asset presence, the original catalog records and the Python model tests. Existing repository checks remain unchanged.

Local verification covered all 12 Python tests, full cash-flow reconciliation, reverse-DCF residuals and source/date checks. The self-contained reading edition was rendered at 1440px and 390px: five figures, 17 sources, no body overflow or broken internal links. This was a reading-edition check, not a full native website build. Repository-wide typecheck, build and release verification belong to the PR's actual CI receipts; do not infer they passed from these local checks.
