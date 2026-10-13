"""Chegg historical reconciliation and illustrative quarterly stress test.

All currency inputs are USD millions. Python standard library only.
Run: python3 model.py --output outputs
"""
from __future__ import annotations
import argparse
import csv
import json
from decimal import Decimal, getcontext
from pathlib import Path

getcontext().prec = 28
D = Decimal
ROOT = Path(__file__).resolve().parent


def load_inputs():
    return json.loads((ROOT / "inputs.json").read_text(), parse_float=D)


def historical(inputs):
    actual = inputs["reported"]
    h25, h26 = actual["h1_2025"], actual["h1_2026"]
    f25 = D(h25["operating_cash_flow"]) - D(h25["cash_capex"])
    f26 = D(h26["operating_cash_flow"]) - D(h26["cash_capex"])
    cfo_change = D(h26["operating_cash_flow"]) - D(h25["operating_cash_flow"])
    capex_saving = D(h25["cash_capex"]) - D(h26["cash_capex"])
    assert f25 + cfo_change + capex_saving == f26
    cash = actual["h1_2026_cash_bridge"]
    ending = sum(D(cash[k]) for k in (
        "opening_cash_including_restricted", "operating_cash_flow", "cash_capex",
        "investment_maturities_and_sales", "financing_cash_flow", "fx"
    ))
    assert ending == D(cash["ending_cash_including_restricted"])
    cf = actual["h1_2026_cfo_reconciliation"]
    subtotal = D(cf["net_loss"]) + D(cf["depreciation_amortization"]) + D(cf["stock_compensation"]) + D(cf["other_adjustments"])
    working = sum(D(v) for v in cf["working_capital"].values())
    assert subtotal + working == D(h26["operating_cash_flow"])
    q25, q26 = actual["q2_2025"], actual["q2_2026"]
    academic_loss = D(q25["academic_services"]) - D(q26["academic_services"])
    skilling_gain = D(q26["skilling"]) - D(q25["skilling"])
    return {
        "fcf_h1_2025": f25, "fcf_h1_2026": f26,
        "cfo_change": cfo_change, "capex_saving": capex_saving,
        "fcf_change": f26-f25,
        "fcf_h1_2026_at_h1_2025_capex": D(h26["operating_cash_flow"])-D(h25["cash_capex"]),
        "cfo_before_working_capital": subtotal, "working_capital_change": working,
        "cash_bridge_ending_including_restricted": ending,
        "academic_revenue_loss_q2": academic_loss, "skilling_revenue_gain_q2": skilling_gain,
        "skilling_offset_percent": skilling_gain / academic_loss * 100,
        "skilling_mix_q2_2025_percent": D(q25["skilling"]) / D(q25["total_revenue"]) * 100,
        "skilling_mix_q2_2026_percent": D(q26["skilling"]) / D(q26["total_revenue"]) * 100,
        "skilling_growth_q2_percent": skilling_gain / D(q25["skilling"]) * 100,
        "academic_decline_q2_percent": academic_loss / D(q25["academic_services"]) * 100,
        "capex_reduction_percent": capex_saving/D(h25["cash_capex"])*100,
    }


def replacement(inputs, decline):
    q = inputs["reported"]["q2_2026"]
    m = inputs["stress_test"]
    loss = D(q["academic_services"]) * decline
    revenue_growth = loss / D(q["skilling"])
    contribution_growth = revenue_growth * D(m["academic_contribution_margin"]) / D(m["skilling_contribution_margin"])
    return {"academic_decline_percent": decline*100, "academic_revenue_lost": loss,
            "skilling_growth_for_flat_revenue_percent": revenue_growth*100,
            "skilling_growth_for_flat_contribution_percent": contribution_growth*100}


def run_scenario(inputs, scenario):
    m = inputs["stress_test"]
    academic, skilling = D(m["starting_academic_revenue"]), D(m["starting_skilling_revenue"])
    am, sm = D(m["academic_contribution_margin"]), D(m["skilling_contribution_margin"])
    opex = academic*am + skilling*sm - D(m["starting_earnings_proxy"])
    liquidity = D(m["reference_opening_liquidity"])
    rows = []
    for quarter in range(1,5):
        if quarter > 1:
            academic *= 1 - D(scenario["academic_sequential_decline"])
            skilling *= 1 + D(scenario["skilling_sequential_growth"])
            opex *= 1 - D(scenario["opex_sequential_reduction"])
        contribution = academic*am + skilling*sm
        earnings = contribution-opex
        severance = D(m["first_quarter_severance"]) if quarter == 1 else D(0)
        cash_conversion_drag = D(m["quarterly_cash_conversion_drag"])
        cfo_proxy = earnings - cash_conversion_drag - severance
        capex = D(m["quarterly_cash_capex"])
        fcf_proxy = cfo_proxy-capex
        opening = liquidity
        liquidity += fcf_proxy
        rows.append({"scenario": scenario["name"], "quarter": quarter,
            "academic_revenue": academic, "skilling_revenue": skilling,
            "total_revenue": academic+skilling, "cash_contribution": contribution,
            "cash_opex": opex, "earnings_proxy": earnings,
            "cash_conversion_drag": cash_conversion_drag, "severance": severance,
            "operating_cash_flow_proxy": cfo_proxy, "cash_capex": capex,
            "free_cash_flow_proxy": fcf_proxy, "opening_liquidity": opening,
            "closing_liquidity": liquidity})
        assert opening + earnings-cash_conversion_drag-severance-capex == liquidity
    floor = D(m["illustrative_reserve_floor"])
    minimum = min([D(m["reference_opening_liquidity"])] + [r["closing_liquidity"] for r in rows])
    first_breach = next((r["quarter"] for r in rows if r["closing_liquidity"] < floor), None)
    summary = {"scenario": scenario["name"], "four_quarter_revenue": sum(r["total_revenue"] for r in rows),
        "four_quarter_fcf_proxy": sum(r["free_cash_flow_proxy"] for r in rows),
        "closing_liquidity": liquidity, "minimum_liquidity": minimum,
        "headroom_to_reserve_floor": minimum-floor, "first_reserve_breach_quarter": first_breach,
        "quarter_four_earnings_proxy": rows[-1]["earnings_proxy"]}
    return rows, summary


def serialize(value):
    if isinstance(value, D): return format(value, "f")
    if isinstance(value, dict): return {k:serialize(v) for k,v in value.items()}
    if isinstance(value, list): return [serialize(v) for v in value]
    return value


def write_outputs(destination):
    inputs = load_inputs()
    all_rows, summaries = [], []
    for scenario in inputs["scenarios"]:
        rows, summary = run_scenario(inputs, scenario)
        all_rows.extend(rows); summaries.append(summary)
    result = {"units":"USD millions; growth rates in percent", "historical":historical(inputs),
              "replacement": [replacement(inputs,D(rate)) for rate in ("0.20","0.30","0.40")],
              "scenarios": summaries}
    destination.mkdir(parents=True,exist_ok=True)
    (destination/"results.json").write_text(json.dumps(serialize(result),indent=2)+"\n")
    for name, rows in (("quarterly-stress-test.csv",all_rows),("scenario-summary.csv",summaries),("replacement-growth.csv",result["replacement"])):
        with (destination/name).open("w",newline="") as file:
            writer=csv.DictWriter(file,fieldnames=list(rows[0])); writer.writeheader()
            writer.writerows(serialize(rows))
    return result


if __name__ == "__main__":
    parser=argparse.ArgumentParser(); parser.add_argument("--output",type=Path,default=ROOT/"outputs")
    result=write_outputs(parser.parse_args().output)
    print(json.dumps(serialize(result),indent=2))
