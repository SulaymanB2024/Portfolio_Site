"""Bind reviewed primary-source facts to explicit, separate author scenario assumptions."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
software = json.loads((ROOT / "research/software/inputs.json").read_text())
physical = json.loads((ROOT / "research/physical/evidence.json").read_text())
price_data = json.loads((ROOT / "prices-20261012.json").read_text())
prices = {x["symbol"]: x["close"] for x in price_data["bars"]}


def cash_period(record):
    return {"revenue": record["revenue"], "net_income": record["net_income"], "cfo": record["cfo"], "capex": record["capex"], "sbc": record["sbc_cfo"], "buybacks": record["buyback_cash"]}


def software_company(symbol, anchors):
    x = software[symbol]
    return {
        "symbol": symbol, "company": x["company"], "entry_close": prices[symbol],
        "latest_disclosed_shares_m": x["latest_disclosed_shares"]["shares"],
        "share_count_date": x["latest_disclosed_shares"]["date"],
        "ttm_period_end": x["balance_date"], "interim_period_description": x["interim_period"],
        "source_ids": [x["annual_source"], x["interim_source"]],
        "reported_cash": {"annual_previous": cash_period(x["FY2025"]), "interim_previous": cash_period(x["YTD2025"]), "interim_current": cash_period(x["YTD2026"])},
        "revenue_anchors": anchors, "cash_normalizations": [],
    }


def scenario(name, growth, margin, retirement, average_price, multiple, sbc_ratio, net_margin, commitments=(0, 0), dividend=0):
    return {"name": name, "segment_growth": {key: [value, value] for key, value in growth.items()},
        "owner_cash_margin": list(margin), "desired_net_share_retirement": list(retirement),
        "average_repurchase_price": list(average_price), "terminal_owner_cash_multiple": multiple,
        "sbc_ratio": sbc_ratio, "net_margin_crosscheck": net_margin,
        "cash_commitments": list(commitments), "dividend_per_share": [dividend, dividend]}


adbe = software_company("ADBE", {"consolidated": 23769 + 19776 - 17575})
adbe["scenarios"] = [
    scenario("Bear", {"consolidated": -.04}, (.25, .25), (0, 0), (250, 250), 9, .085, .20, (1340, 1000)),
    scenario("Base", {"consolidated": .08}, (.31, .31), (.04, .04), (285, 330), 14, .082, .27, (1340, 1000)),
    scenario("Bull", {"consolidated": .12}, (.33, .33), (.06, .06), (330, 420), 17, .082, .29, (1340, 1000)),
]
adbe["sensitivity_multiples"] = [11, 14, 17]
adbe["commitment_note"] = "Author budget: $1bn annual debt/capital flexibility plus $340m first-year acquisition budget, based on announced pending Topaz price. Cash retained receives no terminal bonus."

pypl = software_company("PYPL", {"consolidated": 33172 + 17035 - 16079})
pypl["cash_normalizations"] = [
    {"amount": -128, "label": "TTM capitalized SBC: 134 + 62 − 68; economic-cost sensitivity beyond CFO add-back"},
    {"amount": -653, "label": "TTM retained-loan net investing: (20190−19688) + (8026−7595) − (11490−11210)"},
]
pypl["scenarios"] = [
    scenario("Bear", {"consolidated": -.02}, (.105, .105), (.01, .01), (50, 50), 8, .035, .105, (300, 300), .56),
    scenario("Base", {"consolidated": .04}, (.145, .145), (.05, .05), (65, 75), 12, .033, .14, (300, 300), .56),
    scenario("Bull", {"consolidated": .06}, (.16, .16), (.06, .06), (75, 95), 14, .032, .15, (300, 300), .56),
]
pypl["sensitivity_multiples"] = [9, 12, 15]
pypl["commitment_note"] = "Forward owner-cash margins already include recurring retained-credit reinvestment and economic stock-compensation charge. $300m yearly additional transformation/liquidity budget; no customer-cash bonus. Dividend assumed held at $0.14 quarterly, not guaranteed."

crocs = physical["companies"]["CROX"]
periods = crocs["periods"]
blocks = crocs["revenue_blocks"]["TTM_20260630"]
crox = {"symbol": "CROX", "company": "Crocs, Inc.", "entry_close": prices["CROX"],
    "latest_disclosed_shares_m": crocs["latest_disclosed_shares_million"], "share_count_date": crocs["share_date"],
    "ttm_period_end": "2026-06-30", "interim_period_description": "Six months ended June 30, 2026 versus June 30, 2025",
    "source_ids": ["CROX-K25", "CROX-Q226"], "reported_cash": {},
    "revenue_anchors": {"crocs_brand": blocks["crocs_brand"], "heydude": blocks["heydude"]},
    "cash_normalizations": [{"amount": -63.103, "label": "Author rounded recurring-cash underwriting: $600m versus $663.103m observed proxy; tax/working-capital volatility, not a reported cost"}],
}
for target, source in [("annual_previous", "FY2025"), ("interim_previous", "H1_2025"), ("interim_current", "H1_2026")]:
    p = periods[source]
    crox["reported_cash"][target] = {"revenue": p["revenue"], "net_income": p["net_income_common"], "cfo": p["cfo"], "capex": p["capex_cash_outflow"], "sbc": p["sbc_cash_flow_addback"], "buybacks": p["repurchase_cash_outflow"]}
crox["scenarios"] = [
    scenario("Bear", {"crocs_brand": -.05, "heydude": -.10}, (.11, .11), (0, 0), (110, 110), 8, .014, .10, (150, 150)),
    scenario("Base", {"crocs_brand": .04, "heydude": -.02}, (.15, .15), (.07, .07), (145, 165), 11, .012, .14, (250, 250)),
    scenario("Bull", {"crocs_brand": .06, "heydude": .02}, (.18, .18), (.08, .08), (175, 225), 14, .012, .16, (150, 150)),
]
crox["sensitivity_multiples"] = [8, 11, 14]
crox["additional_cash_stress"] = {"name": "$600m tax-payment stress", "additional_commitments": [500, 0], "note": "Hypothetical $600m payment in model year1 replaces the $100m base protected cash budget, so its incremental allocation is $500m. This is a use of the existing tax-risk category, not a second $600m reported liability. First-year operating cash shortfall must be tested against current usable cash/funding; do not interpret the price output as fully funded."}
crox["commitment_note"] = "Author $150m annual debt-paydown plus $100m annual protected tax/liquidity budget in the base case. Protected cash is unavailable for repurchases and receives no terminal valuation bonus. Gross repurchase permission is not funding. Net share retirement is capped by cash available; the two base-year caps bind. June cash is a historical reference, not October cash. $20m post-June refund is absent from the anchor and not added to recurring projections."

expe = software_company("EXPE", {"b2c": 9474 + 4795 - 4435, "b2b": 4842 + 2676 - 2156, "other": 15700 - (9474 + 4795 - 4435) - (4842 + 2676 - 2156)})
expe["cash_normalizations"] = [{"amount": -1399, "label": "Author no-growth travel-WC sensitivity: TTM deferred bookings(1958) + merchant AP(319) + total AR cash movement(−878). AR is an imperfect merchant/agency proxy."}]
expe["equity_sbc_sensitivity_extra"] = 90
expe["scenarios"] = [
    scenario("Bear", {"b2c": -.03, "b2b": .08, "other": -.03}, (.13, .13), (0, 0), (260, 260), 10, .033, .085, (250, 250), 1.92),
    scenario("Base", {"b2c": .05, "b2b": .15, "other": 0}, (.17, .17), (.03, .03), (290, 325), 13, .032, .115, (250, 250), 1.92),
    scenario("Bull", {"b2c": .08, "b2b": .20, "other": .03}, (.185, .185), (.04, .04), (340, 420), 15, .031, .135, (250, 250), 1.92),
]
expe["sensitivity_multiples"] = [10, 13, 16]
expe["commitment_note"] = "Forward cash margins exclude incremental net travel-WC financing and include economic stock compensation. Author $250m annual additional liquidity/debt budget. No excess-cash bonus. Dividend held at $0.48 quarterly as an assumption."

output = {"version": 1, "cutoff": "2026-10-12", "authored_on": "2026-10-13", "evaluation_date": "2028-10-12", "forecast_basis": "Price at evaluation date based on annual recurring cash run-rate near the latest financial period available then; scenario prices are not probabilities.",
    "units": {"financials": "USD millions", "shares": "millions", "prices": "USD per original share", "rates": "fractions"},
    "share_basis_note": "Latest disclosed shares are dated public proxies, not exact October12 shares. Net retirement and repurchase prices are author assumptions, funded after commitments. Ending cash is not added to terminal value.",
    "benchmark": {"symbol": "SPY", "entry_close": prices["SPY"], "basis": "Price return, same evaluation session; reconcile corporate actions. Cash distributions evaluated separately without reinvestment when complete."},
    "companies": [adbe, pypl, crox, expe]}
(ROOT / "inputs.json").write_text(json.dumps(output, indent=2) + "\n")
print("Bound four reviewed company datasets and explicit author scenarios.")
