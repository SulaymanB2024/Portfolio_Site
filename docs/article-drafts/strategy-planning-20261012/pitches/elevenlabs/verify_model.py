#!/usr/bin/env python3
"""Independent canonical-model arithmetic and evidence checks.

Reads emitted JSON and recomputes monetary bridges with exact rational arithmetic;
does not call the model's calculation functions. Boundary checks import the model
only to inspect its behavior on zero workload and invalid assumptions.
"""

import copy
import importlib.util
import json
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).resolve().parent
inputs = json.loads((HERE / "inputs.json").read_text())
results = json.loads((HERE / "model-results.json").read_text())
checks = 0


def f(value):
    return Fraction(str(value))


def check(actual, expected):
    global checks
    assert abs(f(actual) - expected) <= Fraction(1, 1000000), (actual, expected)
    checks += 1


assert results["observedCompanyFacts"] == inputs["observedCompanyFacts"]
assert results["researchCutoff"] == "2026-10-13"
source_ids = {s["id"] for s in json.loads((HERE / "sources.json").read_text())}
assert all(x["sourceId"] in source_ids for x in inputs["observedCompanyFacts"])

a = inputs["audio"]
n = f(a["acceptedMinutesPerMonth"])
manual = n * f(a["manualWorkMinutesPerAcceptedMinute"]) * f(a["hourlyLaborCost"]) / 60
for scenario, actual in zip(a["scenarios"], results["audio"], strict=True):
    assert scenario["id"] == actual["id"]
    bill = n * f(scenario["generatedMinutesPerAcceptedMinute"]) * f(a["effectiveInvoicePerGeneratedMinute"])
    human = n * f(scenario["humanWorkMinutesPerAcceptedMinute"]) * f(a["hourlyLaborCost"]) / 60
    relief = manual - human
    cash_relief = relief * f(a["cashCaptureOfPositiveLaborRelief"]) if relief >= 0 else relief
    monthly_cash = cash_relief - bill
    total = human + bill + f(a["sharedCoordinationCostPerMonth"])
    check(actual["monthlySoftwareInvoice"], bill)
    check(actual["monthlyBaselineLoadedCost"], manual + f(a["sharedCoordinationCostPerMonth"]))
    check(actual["monthlyWorkflowLoadedCost"], total)
    check(actual["loadedCostPerAcceptedMinute"], total / n)
    check(actual["monthlyTimeValueAdvantage"], relief - bill)
    check(actual["monthlyNetCashBenefit"], monthly_cash)
    check(actual["renewalYearNetCashBenefit"], monthly_cash * f(a["monthsPerYear"]))
    check(actual["firstYearNetCashBenefit"], monthly_cash * f(a["monthsPerYear"]) - f(a["firstYearSetupCost"]))

g = inputs["agents"]
n = f(g["eligibleUniqueTasksPerMonth"])
unit_human_cost = f(g["manualMinutesPerTask"]) * f(g["hourlyLaborCost"]) / 60
baseline = n * unit_human_cost
oversight = f(g["ongoingOversightHoursPerMonth"]) * f(g["hourlyLaborCost"])
capture = f(g["cashCaptureOfPositiveLaborRelief"])
for scenario, actual in zip(g["scenarios"], results["agents"], strict=True):
    assert scenario["id"] == actual["id"]
    completed = n * f(scenario["verifiedCompletionRate"])
    fallback_cost = (n - completed) * unit_human_cost
    bill = n * f(scenario["averageAgentMinutesPerAttempt"]) * f(g["allInAgentInvoicePerCallMinute"])
    relief = completed * unit_human_cost - oversight
    cash = (relief * capture if relief >= 0 else relief) - bill
    check(actual["verifiedCompletedTasksPerMonth"], completed)
    check(actual["humanFallbackTasksPerMonth"], n - completed)
    check(actual["monthlyHumanFallbackCost"], fallback_cost)
    check(actual["monthlyOversightLaborCost"], oversight)
    check(actual["monthlyAgentInvoice"], bill)
    check(actual["monthlyWorkflowLoadedCost"], fallback_cost + oversight + bill)
    check(actual["monthlyTimeValueAdvantage"], relief - bill)
    check(actual["monthlyNetCashBenefit"], cash)
    check(actual["renewalYearNetCashBenefit"], cash * f(g["monthsPerYear"]))
    check(actual["firstYearNetCashBenefit"], cash * f(g["monthsPerYear"]) - f(g["firstYearSetupCost"]))
    threshold = (bill / capture + oversight) / baseline
    check(actual["renewalBreakEvenVerifiedCompletionRate"], threshold)
    check(actual["firstYearBreakEvenVerifiedCompletionRate"], threshold + f(g["firstYearSetupCost"]) / f(g["monthsPerYear"]) / capture / baseline)

# Independent hand-calculated anchors used by the manuscript.
base_audio = next(x for x in results["audio"] if x["id"] == "base")
base_agents = next(x for x in results["agents"] if x["id"] == "base")
check(base_audio["firstYearNetCashBenefit"], Fraction(7584))
check(base_agents["firstYearNetCashBenefit"], Fraction(71700))
check(base_agents["renewalBreakEvenVerifiedCompletionRate"], Fraction(328, 1000))

spec = importlib.util.spec_from_file_location("elevenlabs_model", HERE / "model.py")
model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model)
original = copy.deepcopy(inputs)
model.run(inputs)
assert inputs == original, "run must preserve the input record"
zero = copy.deepcopy(inputs)
zero["audio"]["acceptedMinutesPerMonth"] = 0
zero["agents"]["eligibleUniqueTasksPerMonth"] = 0
z = model.run(zero)
assert all(x["loadedCostPerAcceptedMinute"] is None for x in z["audio"])
assert all(x["renewalBreakEvenVerifiedCompletionRate"] is None for x in z["agents"])
assert all(x["monthlySoftwareInvoice"] == 0 and x["firstYearNetCashBenefit"] == -1200 for x in z["audio"])
assert all(x["monthlyNetCashBenefit"] == -2700 and x["firstYearNetCashBenefit"] == -44400 for x in z["agents"])
uncaptured = copy.deepcopy(inputs)
uncaptured["agents"]["cashCaptureOfPositiveLaborRelief"] = 0
u = model.run(uncaptured)
assert all(x["renewalBreakEvenVerifiedCompletionRate"] is None for x in u["agents"])
assert u["agents"][1]["monthlyNetCashBenefit"] == -4800
for section, key, value in (
    ("audio", "acceptedMinutesPerMonth", -1),
    ("audio", "hourlyLaborCost", True),
    ("agents", "cashCaptureOfPositiveLaborRelief", 1.1),
    ("agents", "allInAgentInvoicePerCallMinute", float("nan")),
):
    invalid = copy.deepcopy(inputs)
    invalid[section][key] = value
    try:
        model.run(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError(f"invalid {section}.{key} accepted")

print(f"{checks} independent arithmetic checks passed; source IDs, immutability, zero workloads, zero capture and four invalid-input cases passed")
