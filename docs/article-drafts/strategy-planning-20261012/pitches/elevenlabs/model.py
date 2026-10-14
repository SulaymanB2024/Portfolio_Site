#!/usr/bin/env python3
"""Executable hypothetical buyer economics. Standard library; no network or secrets.

Usage: python3 model.py [--inputs PATH] [--output PATH]
Company observations are carried through as provenance, never used as operating
model parameters. Recovered labor becomes cash only through the stated capture
assumption. Additional labor cost receives no savings haircut.
"""

import argparse
import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

HERE = Path(__file__).resolve().parent
MINUTES_PER_HOUR = Decimal(60)


def number(config, key, lower=Decimal(0), upper=None):
    value = config[key]
    if isinstance(value, bool) or not isinstance(value, (int, float, Decimal)):
        raise ValueError(f"{key} must be a finite number")
    result = Decimal(str(value))
    if not result.is_finite() or result < lower or (upper is not None and result > upper):
        raise ValueError(f"{key} outside allowed range")
    return result


def ratio(config, key):
    return number(config, key, upper=Decimal(1))


def captured_relief(relief, capture):
    """Haircut available savings; fully charge additional labor in a worse workflow."""
    return relief * capture if relief >= 0 else relief


def audio_model(config, scenario):
    accepted = number(config, "acceptedMinutesPerMonth")
    manual_minutes = number(config, "manualWorkMinutesPerAcceptedMinute")
    labor_rate = number(config, "hourlyLaborCost")
    coordination = number(config, "sharedCoordinationCostPerMonth")
    invoice_rate = number(config, "effectiveInvoicePerGeneratedMinute")
    capture = ratio(config, "cashCaptureOfPositiveLaborRelief")
    setup = number(config, "firstYearSetupCost")
    months = number(config, "monthsPerYear", lower=Decimal("0.000001"))
    generation = number(scenario, "generatedMinutesPerAcceptedMinute", lower=Decimal(1))
    review = number(scenario, "humanWorkMinutesPerAcceptedMinute")
    manual_hours = accepted * manual_minutes / MINUTES_PER_HOUR
    review_hours = accepted * review / MINUTES_PER_HOUR
    generated = accepted * generation
    invoice = generated * invoice_rate
    baseline = manual_hours * labor_rate + coordination
    loaded = review_hours * labor_rate + coordination + invoice
    labor_relief = (manual_hours - review_hours) * labor_rate
    net_cash = captured_relief(labor_relief, capture) - invoice
    return {
        "id": scenario["id"], "label": scenario["label"],
        "acceptedMinutesPerMonth": accepted,
        "generatedMinutesPerMonth": generated,
        "generatedMinutesPerAcceptedMinute": generation,
        "humanWorkMinutesPerAcceptedMinute": review,
        "baselineLaborHoursPerMonth": manual_hours,
        "workflowLaborHoursPerMonth": review_hours,
        "recoveredLaborHoursPerMonth": manual_hours - review_hours,
        "monthlySoftwareInvoice": invoice,
        "monthlyBaselineLoadedCost": baseline,
        "monthlyWorkflowLoadedCost": loaded,
        "loadedCostPerAcceptedMinute": loaded / accepted if accepted else None,
        "monthlyTimeValueAdvantage": baseline - loaded,
        "monthlyNetCashBenefit": net_cash,
        "firstYearNetCashBenefit": net_cash * months - setup,
        "renewalYearNetCashBenefit": net_cash * months,
        "firstYearSetupCost": setup,
        "cashCaptureOfPositiveLaborRelief": capture,
    }


def agent_model(config, scenario):
    tasks = number(config, "eligibleUniqueTasksPerMonth")
    manual_minutes = number(config, "manualMinutesPerTask")
    labor_rate = number(config, "hourlyLaborCost")
    oversight_hours = number(config, "ongoingOversightHoursPerMonth")
    invoice_rate = number(config, "allInAgentInvoicePerCallMinute")
    capture = ratio(config, "cashCaptureOfPositiveLaborRelief")
    setup = number(config, "firstYearSetupCost")
    months = number(config, "monthsPerYear", lower=Decimal("0.000001"))
    completion = ratio(scenario, "verifiedCompletionRate")
    call_minutes = number(scenario, "averageAgentMinutesPerAttempt")
    complete_tasks = tasks * completion
    fallback_tasks = tasks - complete_tasks
    baseline_hours = tasks * manual_minutes / MINUTES_PER_HOUR
    fallback_hours = fallback_tasks * manual_minutes / MINUTES_PER_HOUR
    oversight = oversight_hours * labor_rate
    baseline = baseline_hours * labor_rate
    human = fallback_hours * labor_rate + oversight
    total_minutes = tasks * call_minutes
    invoice = total_minutes * invoice_rate
    labor_relief = baseline - human
    net_cash = captured_relief(labor_relief, capture) - invoice
    denominator = baseline * capture
    # Thresholds exist only where positive relief can be monetized. Requirements
    # may exceed 100%; retain them so an unreachable case is not hidden.
    recurring_requirement = (invoice + oversight * capture) / denominator if denominator else None
    first_requirement = (invoice + oversight * capture + setup / months) / denominator if denominator else None
    return {
        "id": scenario["id"], "label": scenario["label"],
        "eligibleUniqueTasksPerMonth": tasks,
        "verifiedCompletionRate": completion,
        "averageAgentMinutesPerAttempt": call_minutes,
        "verifiedCompletedTasksPerMonth": complete_tasks,
        "humanFallbackTasksPerMonth": fallback_tasks,
        "totalAgentMinutesPerMonth": total_minutes,
        "baselineLaborHoursPerMonth": baseline_hours,
        "humanFallbackHoursPerMonth": fallback_hours,
        "ongoingOversightHoursPerMonth": oversight_hours,
        "recoveredLaborHoursPerMonth": baseline_hours - fallback_hours - oversight_hours,
        "monthlyBaselineLoadedCost": baseline,
        "monthlyHumanFallbackCost": fallback_hours * labor_rate,
        "monthlyOversightLaborCost": oversight,
        "monthlyAgentInvoice": invoice,
        "monthlyWorkflowLoadedCost": human + invoice,
        "monthlyTimeValueAdvantage": baseline - human - invoice,
        "monthlyNetCashBenefit": net_cash,
        "firstYearNetCashBenefit": net_cash * months - setup,
        "renewalYearNetCashBenefit": net_cash * months,
        "renewalBreakEvenVerifiedCompletionRate": recurring_requirement,
        "firstYearBreakEvenVerifiedCompletionRate": first_requirement,
        "firstYearSetupCost": setup,
        "cashCaptureOfPositiveLaborRelief": capture,
    }


def run(inputs):
    if inputs.get("schemaVersion") != 1:
        raise ValueError("unsupported schemaVersion")
    return {
        "schemaVersion": 1,
        "researchCutoff": inputs["researchCutoff"],
        "modelStatus": inputs["modelStatus"],
        "currency": inputs["currency"],
        "observedCompanyFacts": inputs["observedCompanyFacts"],
        "audio": [audio_model(inputs["audio"], s) for s in inputs["audio"]["scenarios"]],
        "agents": [agent_model(inputs["agents"], s) for s in inputs["agents"]["scenarios"]],
        "interpretation": {
            "timeValue": "Loaded labor value and invoice costs, not observed cash savings or company margins.",
            "cash": "Positive labor relief is captured at the assumed rate; additional labor cost is charged in full. Setup is deducted only in year one. Renewal holds workload, quality and capture fixed.",
            "excluded": "No revenue uplift, customer waiting cost, error losses, tax, financing, company inference COGS, royalties or security valuation. Unknown company costs are not zero.",
            "thresholds": "A completion requirement above one is unreachable under the selected assumptions; null means no positive monetizable baseline denominator.",
        },
    }


def encode(value):
    if isinstance(value, Decimal):
        # Six decimals keep ratio/hour evidence; all displayed currency rounding
        # is downstream of the unrounded calculations.
        return float(value.quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP))
    raise TypeError(type(value).__name__)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inputs", type=Path, default=HERE / "inputs.json")
    parser.add_argument("--output", type=Path, default=HERE / "model-results.json")
    args = parser.parse_args()
    if args.output.resolve() == args.inputs.resolve():
        parser.error("output must not overwrite inputs")
    with args.inputs.open(encoding="utf-8") as source:
        inputs = json.load(source, parse_float=Decimal)
    result = run(inputs)
    with args.output.open("w", encoding="utf-8") as destination:
        json.dump(result, destination, indent=2, default=encode, allow_nan=False)
        destination.write("\n")
    print(f"Wrote {args.output}: {len(result['audio'])} audio + {len(result['agents'])} agent scenarios")


if __name__ == "__main__":
    main()
