"""Declared planning scenarios, not observations of a real business.

Run with Python 3.11+; uses only the standard library. Each period is 30 days.
The model starts after a reusable public app is approved, with $40,000 cash.
No pre-launch costs, taxes, refunds, or nonpayment are included.
"""

from dataclasses import asdict, dataclass, replace
from math import floor, isfinite
import json
from pathlib import Path

PERIODS = 6
STARTING_CASH = 40_000
FIXED_CASH_COST = 6_000
RESERVE = 10_000
DELIVERY_HOURS = 60
COMMERCIAL_HOURS = 40
PROCESSING_RATE = 0.029  # Shopify primary documentation verified 2026-10-12.
VARIABLE_COST = 12  # Assumed USD per billed store per 30-day period.


@dataclass(frozen=True)
class Motion:
    name: str
    price: float
    demand: tuple[int, ...]
    churn: float
    onboarding_hours: float
    support_hours: float
    cash_acquisition_cost: float
    agency_share: float = 0
    platform_share: float = 0
    delivery_overhead: tuple[float, ...] = (0,) * PERIODS
    sales_hours_per_new: float = 0
    commercial_overhead: tuple[float, ...] = (0,) * PERIODS


BASE = {
    "self_service": Motion(
        "Self-service", 99, (8, 12, 16, 20, 20, 20), .04, 1.5, .75, 150,
        commercial_overhead=(6,) * PERIODS,
    ),
    "assisted_direct": Motion(
        "Assisted direct", 399, (3, 4, 5, 5, 5, 5), .02, 4, .5, 150,
        sales_hours_per_new=3,
    ),
    "agency_referral": Motion(
        "Agency referral", 399, (0, 0, 8, 8, 8, 8), .02, 3, .75, 50,
        agency_share=.25,
        delivery_overhead=(12, 12, 4, 4, 4, 4),
        sales_hours_per_new=1,
        commercial_overhead=(24, 24, 6, 6, 6, 6),
    ),
}


def validate_motion(motion: Motion, collection_lag: int) -> None:
    """Reject malformed scenarios before they can create impossible cohorts."""
    def number(value, label, maximum=None, integer=False):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{label} must be a finite nonnegative number")
        try:
            finite = isfinite(value)
        except OverflowError:
            finite = False
        if not finite or value < 0 or (maximum is not None and value > maximum):
            raise ValueError(f"{label} is outside its allowed range")
        if integer and not isinstance(value, int):
            raise ValueError(f"{label} must be a whole number")

    if not isinstance(motion, Motion):
        raise ValueError("motion must be a Motion scenario")
    number(collection_lag, "collection_lag", integer=True)
    for field in ("price", "onboarding_hours", "support_hours", "cash_acquisition_cost", "sales_hours_per_new"):
        number(getattr(motion, field), field)
    for field in ("churn", "agency_share", "platform_share"):
        number(getattr(motion, field), field, maximum=1)
    if PROCESSING_RATE + motion.agency_share + motion.platform_share > 1:
        raise ValueError("processing, agency and platform shares must not exceed gross billings")
    for field in ("demand", "delivery_overhead", "commercial_overhead"):
        values = getattr(motion, field)
        if not isinstance(values, (tuple, list)) or len(values) != PERIODS:
            raise ValueError(f"{field} must contain {PERIODS} values")
        for value in values:
            number(value, field, integer=field == "demand")


def capacity_limit(available: float, hours_per_start: float, demand: int) -> int:
    """Zero work admits demand only when existing overhead fits the budget."""
    if available < 0:
        return 0
    if hours_per_start == 0 or demand * hours_per_start <= available:
        return demand
    return max(0, floor(available / hours_per_start))


def simulate(motion: Motion, collection_lag: int = 1) -> dict:
    """Expected cohort balances; new starts are whole stores, survivors fractional.

    Existing subscribers churn before a period begins. New paid starts then
    receive a full period of billing and support. Spend is paced to admitted
    starts, not unconstrained demand. Net revenue after platform and agency
    shares is collected after collection_lag periods. Current variable,
    acquisition and fixed costs are paid now. A channel commission is settled
    when revenue is received. Existing support takes priority over new starts.
    """
    validate_motion(motion, collection_lag)
    active = 0.0
    cash = float(STARTING_CASH)
    rows = []
    net_revenues = []
    for index, demand in enumerate(motion.demand):
        retained = active * (1 - motion.churn)
        available = DELIVERY_HOURS - motion.delivery_overhead[index] - retained * motion.support_hours
        delivery_limit = capacity_limit(available, motion.onboarding_hours + motion.support_hours, demand)
        commercial_limit = capacity_limit(
            COMMERCIAL_HOURS - motion.commercial_overhead[index], motion.sales_hours_per_new, demand,
        )
        new = min(demand, delivery_limit, commercial_limit)
        active = retained + new
        revenue = active * motion.price
        processing_fee = revenue * PROCESSING_RATE
        platform_fee = revenue * motion.platform_share
        commission = revenue * motion.agency_share
        net_revenue = revenue - processing_fee - platform_fee - commission
        net_revenues.append(net_revenue)
        collection = net_revenues[index - collection_lag] if index >= collection_lag else 0
        variable_cost = active * VARIABLE_COST
        acquisition_cost = new * motion.cash_acquisition_cost
        contribution = net_revenue - variable_cost - acquisition_cost
        operating_result = contribution - FIXED_CASH_COST
        cash += collection - variable_cost - acquisition_cost - FIXED_CASH_COST
        delivery_used = motion.delivery_overhead[index] + new * motion.onboarding_hours + active * motion.support_hours
        commercial_used = motion.commercial_overhead[index] + new * motion.sales_hours_per_new
        rows.append({
            "period": index + 1, "demand": demand, "new": new,
            "retained": retained, "active": active, "gross_billings": revenue,
            "processing_fee": processing_fee, "platform_fee": platform_fee,
            "agency_commission": commission, "net_revenue": net_revenue,
            "collections": collection, "variable_cost": variable_cost,
            "acquisition_cost": acquisition_cost, "contribution": contribution,
            "operating_result": operating_result, "cash": cash,
            "delivery_hours": delivery_used, "commercial_hours": commercial_used,
            "delivery_overbooked": delivery_used > DELIVERY_HOURS,
        })
    return {
        "inputs": asdict(motion), "collection_lag": collection_lag, "rows": rows,
        "summary": {
            "new_starts": sum(row["new"] for row in rows),
            "active_final": active,
            "gross_billings": sum(row["gross_billings"] for row in rows),
            "contribution": sum(row["contribution"] for row in rows),
            "operating_result": sum(row["operating_result"] for row in rows),
            "final_cash": cash,
            "minimum_cash": min(STARTING_CASH, *(row["cash"] for row in rows)),
            "receivable_final": sum(net_revenues[max(0, PERIODS - collection_lag):]) if collection_lag else 0,
            "reserve_breached": any(row["cash"] < RESERVE for row in rows),
        },
    }


def results() -> dict:
    base = {key: simulate(motion) for key, motion in BASE.items()}
    variants = {
        "direct_at_self_service_price": simulate(replace(BASE["assisted_direct"], price=99)),
        "self_service_at_direct_price": simulate(replace(BASE["self_service"], price=399)),
        "direct_three_starts": simulate(replace(BASE["assisted_direct"], demand=(3,) * PERIODS)),
        "direct_price_299": simulate(replace(BASE["assisted_direct"], price=299)),
        "direct_price_249": simulate(replace(BASE["assisted_direct"], price=249)),
        "direct_downside": simulate(replace(BASE["assisted_direct"], price=299, demand=(3,) * PERIODS, churn=.04, onboarding_hours=6, support_hours=1)),
        "agency_ready_at_start": simulate(replace(BASE["agency_referral"], demand=(4, 8, 8, 8, 8, 8), delivery_overhead=(4,) * PERIODS, commercial_overhead=(6,) * PERIODS)),
        "self_service_automated": simulate(replace(BASE["self_service"], onboarding_hours=.5, support_hours=.25)),
        "direct_platform_share_15": simulate(replace(BASE["assisted_direct"], platform_share=.15)),
        "direct_two_period_collection": simulate(BASE["assisted_direct"], collection_lag=2),
    }
    n = base["assisted_direct"]["rows"][-1]["active"]
    return {
        "status": "hypothetical planning scenarios; all commercial inputs assumed except the sourced processing fee and conditional platform fee treatment",
        "period_days": 30, "periods": PERIODS, "starting_cash": STARTING_CASH,
        "fixed_cash_cost": FIXED_CASH_COST, "reserve": RESERVE,
        "delivery_hours": DELIVERY_HOURS, "commercial_hours": COMMERCIAL_HOURS,
        "variable_cost": VARIABLE_COST, "processing_rate": PROCESSING_RATE,
        "base": base, "variants": variants,
        "direct_period_6_break_even_price": (FIXED_CASH_COST + 5 * 150 + n * VARIABLE_COST) / (n * (1 - PROCESSING_RATE)),
    }


if __name__ == "__main__":
    target = Path(__file__).with_name("model-results.json")
    target.write_text(json.dumps(results(), indent=2) + "\n")
    print(f"Saved {target.name}")
    for key, result in results()["base"].items():
        s = result["summary"]
        print(f"{key}: active {s['active_final']:.2f}; contribution ${s['contribution']:,.0f}; ending cash ${s['final_cash']:,.0f}; minimum cash ${s['minimum_cash']:,.0f}")
