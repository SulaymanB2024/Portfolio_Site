"""Offline underwriting models driven by inputs.json.

Canonical inputs preserve dated source anchors and hypothetical assumptions.
Use --inputs FILE --output FILE for alternative scenarios; canonical articles
are not rewritten by that command. Python 3.11+, standard library only.
"""
from pathlib import Path
from hashlib import sha256
import argparse
import json
import math

HERE = Path(__file__).resolve().parent
DEFAULT_INPUTS = HERE / "inputs.json"
NAMES = ("downside", "base", "upside")


def number(value, label, low=0, high=None, positive=False, integer=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"{label} must be a finite number")
    if value < low or (positive and value <= low) or (high is not None and value > high):
        raise ValueError(f"{label} is outside its allowed range")
    if integer and int(value) != value:
        raise ValueError(f"{label} must be an integer")


def series(values, label, length=None, **bounds):
    if not isinstance(values, list) or not values or (length is not None and len(values) != length):
        raise ValueError(f"{label} must be a nonempty list" + (f" of {length} values" if length is not None else ""))
    for value in values:
        number(value, label, **bounds)


def validate_inputs(data):
    try:
        t, h, v = (data[name] for name in ("toast", "harvey", "vanta"))
        ta, ha, va = (row["assumed"] for row in (t, h, v))
        for label, a in [("toast", ta), ("harvey", ha), ("vanta", va)]:
            number(a["years"], label + ".years", positive=True, integer=True)
        for key in ["growth"]:
            series(ta[key], "toast." + key, 3, low=-1, positive=True)
        series(ta["operating_conversion"], "toast.operating_conversion", 3, high=1)
        series(ta["exit_EV_to_after_tax_operating_earnings"], "toast.exit_multiple", 3, positive=True)
        number(ta["tax"], "toast.tax", high=1)
        number(ta["annual_share_growth"], "toast.share_growth", low=-1, positive=True)
        number(ta["entry_return_hurdle"], "toast.entry_return_hurdle", low=-1, positive=True)
        series(ta["entry_prices"], "toast.entry_prices", positive=True)
        for key in ["Q2_subscription_revenue_cost_m", "Q2_fintech_revenue_cost_m", "FY2025_GAAP_subscription_fintech_gp_m", "H12025_GAAP_subscription_fintech_gp_m", "H12026_GAAP_subscription_fintech_gp_m"]:
            series(t["reported"][key], "toast." + key, 2)
        for key in ["FY2025_H12025_H12026_operating_income_m", "FY2025_H12025_H12026_FCF_m"]:
            series(t["reported"][key], "toast." + key, 3, low=-1e15)
        for key in ["eligible_liquidity_m", "revolver_borrowings_m"]:
            number(t["reported"][key], "toast." + key)
        number(t["reported"]["diluted_weighted_average_shares_Q2_m"], "toast.shares", positive=True)
        number(t["dated_quote"]["price"], "toast.reference_price", positive=True)
        for label, a in [("harvey", ha), ("vanta", va)]:
            number(a["future_ownership_dilution"], label + ".dilution", high=1)
            if a["future_ownership_dilution"] == 1:
                raise ValueError(label + ".dilution must leave positive ownership")
            number(a["return_hurdle"], label + ".return_hurdle", low=-1, positive=True)
            series(a["exit_equity_to_ARR"], label + ".exit_multiples", 3, positive=True)
            series(a["hurdle_multiples"], label + ".hurdle_multiples", positive=True)
        series(ha["five_year_growth"], "harvey.annual_growth", 3, low=-1, positive=True)
        series(ha["starting_ARR_normalizations_m"], "harvey.normalizations", positive=True)
        for key in ["starting_ARR_m", "annual_license_per_seat"]:
            number(ha[key], "harvey." + key, positive=True)
        for key in ["customer_adoption", "additional_review", "delivery_active_seat_fraction", "other_delivery_cost_share_ARR"]:
            number(ha[key], "harvey." + key, high=1)
        for key in ["customer_seats", "eligible_hours_saved_week", "weeks", "contribution_per_monetized_hour", "first_year_implementation"]:
            number(ha[key], "harvey." + key)
        for key in ["monetization", "sensitivity_adoption", "sensitivity_review"]:
            series(ha[key], "harvey." + key, high=1)
        series(ha["delivery_cost_active_seat_year"], "harvey.delivery_costs")
        series(va["five_year_gross_ARR_retention"], "vanta.gross_retention", 3, high=1)
        series(va["expansion_of_retained_ARR"], "vanta.expansion", 3)
        for name in NAMES:
            series(va["annual_new_ARR_m"][name], "vanta.new_arr." + name, va["years"])
        for key in ["weekly_saved_hours_excluding_questionnaires", "weeks", "questionnaires_month", "avoidable_labor_cost_hour", "first_year_implementation"]:
            number(va[key], "vanta." + key)
        series(va["hours_per_questionnaire_before_after"], "vanta.questionnaire_hours", 2)
        if va["hours_per_questionnaire_before_after"][1] > va["hours_per_questionnaire_before_after"][0]:
            raise ValueError("vanta questionnaire time after must not exceed time before")
        series(va["cash_capture"], "vanta.cash_capture", high=1)
        series(va["sensitivity_work_weeks"], "vanta.sensitivity_work_weeks")
        number(v["reported"]["ARR_m"], "vanta.ARR", positive=True)
        number(v["reported"]["customers"], "vanta.customers", positive=True)
        for label, row in [("harvey", h), ("vanta", v)]:
            number(row["reported"]["announced_valuation_bn"], label + ".entry_equity", positive=True)
        if ha["central_normalization_is_estimate"] is not False:
            raise ValueError("Harvey ARR normalizations must remain explicitly illustrative")
    except (KeyError, TypeError) as error:
        raise ValueError("Missing or malformed model input field") from error
    return data


def load_inputs(path=DEFAULT_INPUTS):
    path = Path(path)
    data = validate_inputs(json.loads(path.read_text()))
    if path.resolve() != DEFAULT_INPUTS.resolve():
        baseline = json.loads(DEFAULT_INPUTS.read_text())
        same_anchors = data.get('cutoff') == baseline['cutoff'] and all(data[name]['reported'] == baseline[name]['reported'] for name in ('toast', 'harvey', 'vanta'))
        if not same_anchors or data['toast']['dated_quote'] != baseline['toast']['dated_quote']:
            raise ValueError('Scenario files may change assumptions only; update sourced anchors through the reviewed baseline workflow')
    return data


def private_return(entry_equity, exit_equity, dilution, years=5):
    multiple = exit_equity * (1 - dilution) / entry_equity
    return {"gross_multiple": multiple, "annualized_return": multiple ** (1 / years) - 1}


def hurdle(entry_equity, annual_return, dilution, exit_multiple, years=5):
    equity = entry_equity * (1 + annual_return) ** years / (1 - dilution)
    return {"required_exit_equity": equity, "required_exit_arr": equity / exit_multiple}


def toast(config=None):
    c = config or load_inputs()["toast"]
    r, a = c["reported"], c["assumed"]
    sub_gp = r["Q2_subscription_revenue_cost_m"][0] - r["Q2_subscription_revenue_cost_m"][1]
    fintech_gp = r["Q2_fintech_revenue_cost_m"][0] - r["Q2_fintech_revenue_cost_m"][1]
    recurring_gp = sub_gp + fintech_gp
    fy25, h125, h126 = (sum(r[key]) for key in ["FY2025_GAAP_subscription_fintech_gp_m", "H12025_GAAP_subscription_fintech_gp_m", "H12026_GAAP_subscription_fintech_gp_m"])
    ttm_gp = fy25 - h125 + h126
    if ttm_gp <= 0:
        raise ValueError("Toast trailing gross-profit anchor must be positive")
    anchor = ttm_gp * 1e6
    years = a["years"]
    cash = (r["eligible_liquidity_m"] - r["revolver_borrowings_m"]) * 1e6
    reference = c["dated_quote"]["price"]
    prices = sorted(set([*a["entry_prices"], reference]))
    scenarios = {}
    for name, growth, conversion, multiple in zip(NAMES, a["growth"], a["operating_conversion"], a["exit_EV_to_after_tax_operating_earnings"]):
        gp = anchor * (1 + growth) ** years
        operating = gp * conversion
        after_tax = operating * (1 - a["tax"])
        enterprise = after_tax * multiple
        equity = enterprise + cash
        if equity < 0:
            raise ValueError("Toast scenario equity value must be nonnegative")
        shares = r["diluted_weighted_average_shares_Q2_m"] * 1e6 * (1 + a["annual_share_growth"]) ** years
        price = equity / shares
        scenarios[name] = {"gp_growth": growth, "operating_conversion": conversion,
            "exit_ev_to_after_tax_operating_earnings": multiple,
            "terminal_recurring_gp": gp, "terminal_operating_income": operating,
            "terminal_after_tax_operating_earnings": after_tax,
            "terminal_enterprise_value": enterprise, "terminal_equity_value": equity,
            "terminal_shares": shares, "terminal_value_per_share": price,
            "maximum_entry_for_15_percent": price / 1.15 ** years,
            "entry_return_hurdle": a["entry_return_hurdle"],
            "returns_at_entry": {str(entry): (price / entry) ** (1 / years) - 1 for entry in prices}}
        if a["entry_return_hurdle"] != .15:
            scenarios[name]["maximum_entry_at_selected_hurdle"] = price / (1 + a["entry_return_hurdle"]) ** years
    operating_bridge = r["FY2025_H12025_H12026_operating_income_m"]
    fcf_bridge = r["FY2025_H12025_H12026_FCF_m"]
    return {"quarter": "Q2 2026", "sub_gp_m": sub_gp, "fintech_gp_m": fintech_gp,
        "recurring_gp_m": recurring_gp, "total_gp_m": 516,
        "hardware_services_gp_m": -68, "intangibles_cost_m": 1,
        "q2_operating_income_m": 152, "q2_operating_conversion": 152 / recurring_gp,
        "ttm_gp_anchor": anchor, "fy25_recurring_gp_m": fy25, "h125_recurring_gp_m": h125, "h126_recurring_gp_m": h126,
        "ttm_operating_income_m": operating_bridge[0] - operating_bridge[1] + operating_bridge[2],
        "ttm_operating_conversion": (operating_bridge[0] - operating_bridge[1] + operating_bridge[2]) / ttm_gp,
        "ttm_fcf_m": fcf_bridge[0] - fcf_bridge[1] + fcf_bridge[2],
        "payments_gp_m": r["Q2_payments_gp_m"], "non_payments_fintech_gp_m": r["Q2_nonpayments_fintech_gp_m"],
        "payments_gp_per_gpv": r["Q2_payments_gp_m"] / 60700,
        "h1_fcf_m": fcf_bridge[2], "h1_prior_fcf_m": fcf_bridge[1],
        "h1_sbc_m": 109, "h1_inventory_cash_use_m": 103,
        "h1_contract_acquisition_cash_m": 93, "h1_contract_cost_amortization_m": 46,
        "eligible_liquidity": r["eligible_liquidity_m"] * 1e6,
        "initial_shares_proxy": r["diluted_weighted_average_shares_Q2_m"] * 1e6,
        "annual_share_growth": a["annual_share_growth"], "reference_price": reference,
        "reference_timestamp": c["dated_quote"]["time_UTC"] + " UTC",
        "scenario_years": years, "tax_rate": a["tax"], "scenarios": scenarios}


def harvey_customer(a, adoption=None, review=None):
    adoption = a["customer_adoption"] if adoption is None else adoption
    review = a["additional_review"] if review is None else review
    seats = a["customer_seats"]
    gross = seats * adoption * a["eligible_hours_saved_week"] * a["weeks"]
    hours = gross * (1 - review)
    cost = seats * a["annual_license_per_seat"] + a["first_year_implementation"]
    contribution = hours * a["contribution_per_monetized_hour"]
    return {"seats": seats, "adoption": adoption, "eligible_hours_saved_week": a["eligible_hours_saved_week"],
        "weeks": a["weeks"], "additional_review_fraction": review,
        "gross_hours": gross, "net_freed_hours": hours,
        "assumed_annual_license_per_seat": a["annual_license_per_seat"],
        "implementation_first_year": a["first_year_implementation"], "first_year_total_cost": cost,
        "contribution_per_monetized_hour": a["contribution_per_monetized_hour"],
        "break_even_monetization_fraction": cost / contribution if contribution else None,
        "cases": {str(m): {"monetization_fraction": m, "incremental_contribution": contribution * m,
            "net_first_year_benefit": contribution * m - cost} for m in a["monetization"]}}


def harvey(config=None):
    c = config or load_inputs()["harvey"]
    a = c["assumed"]
    entry, years, dilution = c["reported"]["announced_valuation_bn"] * 1e9, a["years"], a["future_ownership_dilution"]
    start = a["starting_ARR_m"] * 1e6  # illustrative, never verified current ARR
    scenarios = {}
    for name, growth, multiple in zip(NAMES, a["five_year_growth"], a["exit_equity_to_ARR"]):
        arr = start * (1 + growth) ** years
        equity = arr * multiple
        scenarios[name] = {"starting_arr_assumption": start, "arr_growth": growth,
            "exit_equity_to_arr": multiple, "terminal_arr": arr, "terminal_equity": equity,
            **private_return(entry, equity, dilution, years)}
    hurdles = {str(m): hurdle(entry, a["return_hurdle"], dilution, m, years) for m in a["hurdle_multiples"]}
    required = hurdle(entry, a["return_hurdle"], dilution, a["exit_equity_to_ARR"][1], years)["required_exit_arr"]
    growth = {str(int(n * 1e6)): (required / (n * 1e6)) ** (1 / years) - 1 for n in a["starting_ARR_normalizations_m"]}
    active_seats = start / a["annual_license_per_seat"] * a["delivery_active_seat_fraction"]
    other_cost = start * a["other_delivery_cost_share_ARR"]
    delivery = {str(cost): {"cost_per_active_seat_year": cost, "active_seats_assumed": active_seats,
        "non_inference_delivery_cost": other_cost, "inference_and_workflow_cost": active_seats * cost,
        "modeled_gross_profit": start - other_cost - active_seats * cost,
        "modeled_gross_margin": (start - other_cost - active_seats * cost) / start} for cost in a["delivery_cost_active_seat_year"]}
    sensitivity = [{"adoption": adoption, "review": review,
        "required_monetization": harvey_customer(a, adoption, review)["break_even_monetization_fraction"]}
        for adoption in a["sensitivity_adoption"] for review in a["sensitivity_review"]]
    return {"entry_equity_benchmark": entry, "future_dilution": dilution, "years": years,
        "hurdle_return": a["return_hurdle"], "starting_arr_status": "illustrative, not observed",
        "scenarios": scenarios, "hurdles": hurdles, "growth_required_by_starting_arr": growth,
        "customer_value": harvey_customer(a), "delivery": delivery, "customer_sensitivity": sensitivity}


def vanta_cohorts(grr, retained_expansion, new_arr, starting_arr=300_000_000):
    """Ending ARR money cohorts; new ARR gets expansion only in later years."""
    cohorts = [starting_arr]
    rows = []
    for year, new in enumerate(new_arr, 1):
        opening = sum(cohorts)
        lost = opening * (1 - grr)
        expansion = opening * grr * retained_expansion
        cohorts = [cohort * grr * (1 + retained_expansion) for cohort in cohorts] + [new]
        rows.append({"year": year, "opening_arr": opening, "lost_arr": lost,
            "retained_expansion_arr": expansion, "new_arr": new,
            "ending_arr": sum(cohorts), "cohorts": cohorts.copy()})
    return rows


def vanta_customer(c, weeks=None):
    a = c["assumed"]
    weeks = a["weeks"] if weeks is None else weeks
    price = c["reported"]["ARR_m"] * 1e6 / c["reported"]["customers"]
    before, after = a["hours_per_questionnaire_before_after"]
    hours = a["weekly_saved_hours_excluding_questionnaires"] * weeks + a["questionnaires_month"] * 12 * (before - after)
    value = hours * a["avoidable_labor_cost_hour"]
    implementation = a["first_year_implementation"]
    return {"normalized_annual_license": price, "status": "ARR/customer normalization, not disclosed price or verified paid-cohort ACV",
        "first_year_implementation": implementation, "control_hours_week": a["weekly_saved_hours_excluding_questionnaires"],
        "weeks": weeks, "questionnaires_month": a["questionnaires_month"],
        "hours_each_before": before, "hours_each_after": after, "annual_freed_hours": hours,
        "avoidable_cost_per_hour": a["avoidable_labor_cost_hour"],
        "cases": {str(capture): {"cash_capture": capture, "cash_avoidance": value * capture,
            "net_first_year_cash_benefit": value * capture - price - implementation,
            "net_recurring_cash_benefit": value * capture - price} for capture in a["cash_capture"]},
        "break_even_first_year_capture": (price + implementation) / value if value else None}


def vanta(config=None):
    c = config or load_inputs()["vanta"]
    r, a = c["reported"], c["assumed"]
    entry, years, dilution = r["announced_valuation_bn"] * 1e9, a["years"], a["future_ownership_dilution"]
    start = r["ARR_m"] * 1e6
    scenarios = {}
    for name, grr, expansion, multiple in zip(NAMES, a["five_year_gross_ARR_retention"], a["expansion_of_retained_ARR"], a["exit_equity_to_ARR"]):
        rows = vanta_cohorts(grr, expansion, [n * 1e6 for n in a["annual_new_ARR_m"][name]], start)
        arr = rows[-1]["ending_arr"]
        equity = arr * multiple
        scenarios[name] = {"gross_arr_retention": grr, "retained_arr_expansion": expansion,
            "net_arr_retention": grr * (1 + expansion), "rows": rows,
            "exit_equity_to_arr": multiple, "terminal_arr": arr, "terminal_equity": equity,
            **private_return(entry, equity, dilution, years)}
    sensitivity = [{"work_weeks": weeks, "cash_capture": capture,
        "net_first_year_benefit": vanta_customer(c, weeks)["cases"][str(capture)]["net_first_year_cash_benefit"]}
        for weeks in a["sensitivity_work_weeks"] for capture in a["cash_capture"]]
    return {"entry_equity_benchmark": entry, "reported_arr_anchor": start,
        "reported_customers_anchor": r["customers"], "arr_anchor_date": r["ARR_checkpoint_date"],
        "future_dilution": dilution, "years": years, "hurdle_return": a["return_hurdle"],
        "scenarios": scenarios, "hurdles": {str(m): hurdle(entry, a["return_hurdle"], dilution, m, years) for m in a["hurdle_multiples"]},
        "customer_value": vanta_customer(c), "customer_sensitivity": sensitivity}


def results(inputs=None):
    data = load_inputs() if inputs is None else validate_inputs(inputs)
    fingerprint = sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return {"status": "dated anchors plus declared scenarios; no probabilities; user changes are not independently verified",
        "input_sha256": fingerprint, "toast": toast(data["toast"]),
        "harvey": harvey(data["harvey"]), "vanta": vanta(data["vanta"])}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inputs", type=Path, default=DEFAULT_INPUTS, help="Scenario JSON; copied alternatives do not rewrite articles")
    parser.add_argument("--output", type=Path, help="Explicit JSON output; a custom scenario otherwise prints to stdout")
    args = parser.parse_args()
    try:
        if args.output is not None and (
            args.output.resolve() == args.inputs.resolve()
            or (args.output.exists() and args.output.samefile(args.inputs))
        ):
            parser.error("output must not overwrite inputs")
        data = results(load_inputs(args.inputs))
    except (ValueError, OSError, json.JSONDecodeError) as error:
        parser.error(str(error))
    output = args.output
    if output is None and args.inputs.resolve() == DEFAULT_INPUTS.resolve():
        output = HERE / "model-results.json"
    encoded = json.dumps(data, indent=2, allow_nan=False) + "\n"
    if output is None:
        print(encoded, end="")
    else:
        output.write_text(encoded)
        for company in ("toast", "harvey", "vanta"):
            for name, row in data[company]["scenarios"].items():
                value = row.get("terminal_value_per_share", row.get("terminal_arr"))
                print(f"{company} {name}: terminal {value:,.3f}")


if __name__ == "__main__":
    main()
