"""Independent arithmetic and model-boundary checks; no external services."""
import copy
from decimal import Decimal as D
from model import load_inputs, historical, replacement, run_scenario


def verify():
    x=load_inputs();h=historical(x)
    assert h["fcf_h1_2026"] == D("9.461")
    assert h["fcf_h1_2025"] == D("3.791")
    assert D("3.791") - D("5.525") + D("11.195") == D("9.461")
    # Recompute grouped adjustments from the actual cash-flow statement lines.
    other=sum(map(D,["-0.011","1.076","0.053","0.048","-0.523","-0.005","-3.000","-0.298"]))
    assert other == D(x["reported"]["h1_2026_cfo_reconciliation"]["other_adjustments"])
    assert D("-2.723") + D("26.992") + D("5.035") + other - D("12.483") == D("14.161")
    assert D("33.411")+D("14.161")-D("4.700")+D("25.710")-D("21.877")-D("0.451") == D("46.254")
    assert D("44.623")+D("27.691") == D("72.314")
    assert D("72.314")-D("33.860") == D("38.454")
    r=replacement(x,D("0.30"))
    expected=D("34.315")*D("0.30")/D("17.534")*100
    assert abs(r["skilling_growth_for_flat_revenue_percent"]-expected)<D("1e-20")
    equal=copy.deepcopy(x);equal["stress_test"]["skilling_contribution_margin"]="0.70"
    t=replacement(equal,D("0.30"))
    assert t["skilling_growth_for_flat_revenue_percent"]==t["skilling_growth_for_flat_contribution_percent"]
    expected_closes=["25.367727900","15.019756525","30.767496875"]
    for case,ending in zip(x["scenarios"],expected_closes):
        rows,summary=run_scenario(x,case)
        assert rows[0]["total_revenue"]==D("43.5")
        assert rows[0]["earnings_proxy"]==D("1.5")
        assert rows[0]["closing_liquidity"]==D("34.8")
        assert summary["closing_liquidity"]==D(ending)
        assert sum(row["severance"] for row in rows)==D("1.2")
        # A further $1m capex every quarter costs exactly $4m at the end.
        changed=copy.deepcopy(x);changed["stress_test"]["quarterly_cash_capex"]="4.0"
        _,more_capex=run_scenario(changed,case)
        assert summary["closing_liquidity"]-more_capex["closing_liquidity"]==D("4")
        # A one-time initial investment propagates dollar-for-dollar.
        changed=copy.deepcopy(x);changed["stress_test"]["reference_opening_liquidity"]="30.0"
        lower_rows,lower=run_scenario(changed,case)
        assert all(a["closing_liquidity"]-b["closing_liquidity"]==D("8") for a,b in zip(rows,lower_rows))
        assert summary["closing_liquidity"]-lower["closing_liquidity"]==D("8")
    assert run_scenario(x,x["scenarios"][1])[1]["first_reserve_breach_quarter"]==3
    print("Verified: historical FCF/CFO/cash bridges, debt principal distinction, replacement hurdle, equal-margin boundary, all scenario balances, payment timing and investment sensitivities.")


if __name__=="__main__":verify()
