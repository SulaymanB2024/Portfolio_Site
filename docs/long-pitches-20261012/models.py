"""Deterministic, company-specific cash underwriting. USD millions and millions of shares.

The terminal multiple capitalizes recurring owner cash per share, once. Net retirement
is funded after forecast stock-compensation replacement, dividends and cash commitments.
The economic SBC deduction is a proxy, not a measurement of actual dilution neutralization.
"""
import argparse
import copy
import csv
import json
from decimal import Decimal as D, ROUND_HALF_UP
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_inputs(path=ROOT / "inputs.json"):
    return json.loads(Path(path).read_text())


def d(value):
    return D(str(value))


def serial(value):
    if isinstance(value, D):
        return float(value)
    if isinstance(value, dict):
        return {k: serial(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [serial(v) for v in value]
    return value


def ttm(company):
    periods = company["reported_cash"]
    fields = sorted(set(periods["annual_previous"]) & set(periods["interim_current"]) & set(periods["interim_previous"]))
    values = {
        name: d(periods["annual_previous"][name]) + d(periods["interim_current"][name]) - d(periods["interim_previous"][name])
        for name in fields
    }
    values["fcf"] = values["cfo"] - values["capex"]
    values["reported_cash_less_sbc_proxy"] = values["fcf"] - values["sbc"] - values.get("lease_principal", D(0))
    values["owner_cash_proxy"] = values["reported_cash_less_sbc_proxy"]
    # Each company's additional normalization is explicit and separately labeled.
    for adjustment in company.get("cash_normalizations", []):
        values["owner_cash_proxy"] += d(adjustment["amount"])
    values["estimated_equity_value"] = d(company["entry_close"]) * d(company["latest_disclosed_shares_m"])
    values["owner_cash_yield"] = values["owner_cash_proxy"] / values["estimated_equity_value"]
    values["entry_owner_cash_multiple"] = values["estimated_equity_value"] / values["owner_cash_proxy"]
    if company.get("equity_sbc_sensitivity_extra"):
        values["equity_sbc_sensitivity_owner_cash"] = values["owner_cash_proxy"] - d(company["equity_sbc_sensitivity_extra"])
    return values


def forecast(company, scenario):
    shares = d(company["latest_disclosed_shares_m"])
    initial_shares = shares
    segments = {name: d(value) for name, value in company["revenue_anchors"].items()}
    rows = []
    for year in (0, 1):
        segments = {name: value * (1 + d(scenario["segment_growth"][name][year])) for name, value in segments.items()}
        revenue = sum(segments.values(), D(0))
        owner_cash = revenue * d(scenario["owner_cash_margin"][year])
        sbc_proxy = revenue * d(scenario["sbc_ratio"])
        opening_shares = shares
        dividend_per_share = d(scenario.get("dividend_per_share", [0, 0])[year])
        # Opening shares make the dividend cash budget conservative within each year.
        dividend_cash = opening_shares * dividend_per_share
        cash_commitment = d(scenario.get("cash_commitments", [0, 0])[year])
        available = max(D(0), owner_cash - dividend_cash - cash_commitment)
        avg_price = d(scenario["average_repurchase_price"][year])
        desired_retirement = opening_shares * d(scenario["desired_net_share_retirement"][year])
        net_buyback_spend = min(desired_retirement * avg_price, available)
        net_retired = net_buyback_spend / avg_price
        shares = opening_shares - net_retired
        if shares <= 0:
            raise ValueError("Forecast cannot retire all shares.")
        rows.append({
            "model_year": year + 1, "segments": segments.copy(), "revenue": revenue,
            "owner_cash": owner_cash, "owner_cash_margin": d(scenario["owner_cash_margin"][year]),
            "opening_shares_m": opening_shares, "ending_shares_m": shares,
            "net_share_retirement_percent": net_retired / opening_shares * 100,
            "net_buyback_spend": net_buyback_spend, "sbc_replacement_proxy": sbc_proxy,
            "gross_buyback_and_compensation_budget_proxy": net_buyback_spend + sbc_proxy,
            "dividend_cash_budget": dividend_cash, "cash_commitments": cash_commitment,
            "cash_retained_after_allocations": owner_cash - net_buyback_spend - dividend_cash - cash_commitment,
            "cash_shortfall_before_buybacks": max(D(0), dividend_cash + cash_commitment - owner_cash),
        })
    cash_per_share = rows[-1]["owner_cash"] / shares
    price = cash_per_share * d(scenario["terminal_owner_cash_multiple"])
    central = (price / 5).quantize(D(1), rounding=ROUND_HALF_UP) * 5
    entry = d(company["entry_close"])
    required = entry * d("1.10") ** 2 * shares / d(scenario["terminal_owner_cash_multiple"])
    fixed_multiple_price = cash_per_share * ttm(company)["entry_owner_cash_multiple"]
    return {
        "name": scenario["name"], "years": rows,
        "ending_owner_cash_per_share": cash_per_share, "terminal_price": price,
        "rounded_price_forecast": central, "price_return": price / entry - 1,
        "annualized_price_return": (price / entry).sqrt() - 1,
        "dividends_per_original_entry_share": sum(map(d, scenario.get("dividend_per_share", [0, 0]))),
        "shareholder_cash_return_without_reinvestment": (price + sum(map(d, scenario.get("dividend_per_share", [0, 0])))) / entry - 1,
        "cash_required_for_10_percent_annual_price_return": required,
        "required_cash_change_from_observed_proxy": required / ttm(company)["owner_cash_proxy"] - 1,
        "fixed_entry_multiple_terminal_price": fixed_multiple_price,
        "fixed_entry_multiple_price_return": fixed_multiple_price / entry - 1,
        "total_net_share_retirement_percent": (1 - shares / initial_shares) * 100,
        "terminal_net_margin_crosscheck_eps": rows[-1]["revenue"] * d(scenario["net_margin_crosscheck"]) / shares,
        "implied_pe_on_net_margin_crosscheck": price / (rows[-1]["revenue"] * d(scenario["net_margin_crosscheck"]) / shares),
    }


def results(inputs):
    output = {"cutoff": inputs["cutoff"], "evaluation_date": inputs["evaluation_date"], "companies": {}}
    for company in inputs["companies"]:
        cases = [forecast(company, scenario) for scenario in company["scenarios"]]
        base = next(s for s in company["scenarios"] if s["name"] == "Base")
        # Solve the cash hurdle with share reduction recalculated from available
        # cash, rather than keeping an unaffordable ending share count fixed.
        lower, upper = D(0), D(2)
        hurdle_price = d(company["entry_close"]) * d("1.10") ** 2
        for _ in range(90):
            scale = (lower + upper) / 2
            reverse_case = copy.deepcopy(base)
            reverse_case["owner_cash_margin"] = [str(d(margin) * scale) for margin in base["owner_cash_margin"]]
            reverse_result = forecast(company, reverse_case)
            if reverse_result["terminal_price"] < hurdle_price:
                lower = scale
            else:
                upper = scale
        reverse_case["owner_cash_margin"] = [str(d(margin) * upper) for margin in base["owner_cash_margin"]]
        reverse_result = forecast(company, reverse_case)
        coupled_reverse = {"hurdle_price": hurdle_price, "year2_owner_cash_required": reverse_result["years"][-1]["owner_cash"],
            "ending_shares_m": reverse_result["years"][-1]["ending_shares_m"],
            "cash_change_vs_underwriting_anchor": reverse_result["years"][-1]["owner_cash"] / ttm(company)["owner_cash_proxy"] - 1,
            "condition": "Scale both annual owner-cash margins; retain base revenue growth, repurchase prices, commitments, dividends and terminal multiple. Recalculate affordable net share reduction. This is an author diagnostic, not a market forecast."}
        sensitivity = []
        for growth_delta in (-.02, 0, .02):
            for multiple in company["sensitivity_multiples"]:
                alternative = copy.deepcopy(base)
                alternative["segment_growth"] = {key: [str(d(v) + d(growth_delta)) for v in vals] for key, vals in base["segment_growth"].items()}
                alternative["terminal_owner_cash_multiple"] = str(multiple)
                sensitivity.append({"growth_delta_pp": d(growth_delta) * 100, "multiple": d(multiple), "price": forecast(company, alternative)["terminal_price"]})
        stress = copy.deepcopy(base)
        if company.get("additional_cash_stress"):
            stress["name"] = company["additional_cash_stress"]["name"]
            amounts = company["additional_cash_stress"]["additional_commitments"]
            stress["cash_commitments"] = [str(d(v) + d(extra)) for v, extra in zip(base.get("cash_commitments", [0, 0]), amounts)]
        output["companies"][company["symbol"]] = {"ttm": ttm(company), "scenarios": cases, "coupled_reverse": coupled_reverse, "sensitivity": sensitivity, "cash_stress": forecast(company, stress) if company.get("additional_cash_stress") else None}
    return output


def write_outputs(inputs, directory=ROOT / "outputs"):
    output = serial(results(inputs))
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "model-results.json").write_text(json.dumps(output, indent=2) + "\n")
    with (directory / "scenario-prices.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["symbol", "scenario", "entry_close_usd", "terminal_model_price_usd", "rounded_forecast_usd", "owner_cash_year2_usd_m", "ending_shares_m", "price_return", "dividends_per_original_share_usd"])
        for company in inputs["companies"]:
            for case in output["companies"][company["symbol"]]["scenarios"]:
                writer.writerow([company["symbol"], case["name"], company["entry_close"], case["terminal_price"], case["rounded_price_forecast"], case["years"][-1]["owner_cash"], case["years"][-1]["ending_shares_m"], case["price_return"], case["dividends_per_original_entry_share"]])
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inputs", type=Path, default=ROOT / "inputs.json")
    parser.add_argument("--output", type=Path, default=ROOT / "outputs")
    args = parser.parse_args()
    output = write_outputs(load_inputs(args.inputs), args.output)
    for symbol, company in output["companies"].items():
        print(symbol, {case["name"]: round(case["terminal_price"], 2) for case in company["scenarios"]})
