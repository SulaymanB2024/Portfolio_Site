"""Scenario boundary regressions and preservation of the published plan."""
from dataclasses import replace
import json
from pathlib import Path
import unittest

from model import BASE, FIXED_CASH_COST, PERIODS, STARTING_CASH, results, simulate


class StrategyModelTests(unittest.TestCase):
    def test_default_serialized_results_preserve_the_reviewed_baseline(self):
        canonical = Path(__file__).with_name("model-results.json").read_text()
        self.assertEqual(json.dumps(results(), indent=2, allow_nan=False) + "\n", canonical)

    def test_invalid_scalar_inputs_fail_before_simulation(self):
        for field in ("price", "onboarding_hours", "support_hours", "cash_acquisition_cost", "sales_hours_per_new", "churn", "agency_share", "platform_share"):
            for value in (-1, float("nan"), float("inf"), True, "1", None):
                with self.subTest(field=field, value=value):
                    with self.assertRaisesRegex(ValueError, field):
                        simulate(replace(BASE["assisted_direct"], **{field: value}))
        for field in ("churn", "agency_share", "platform_share"):
            with self.subTest(field=field):
                with self.assertRaisesRegex(ValueError, field):
                    simulate(replace(BASE["assisted_direct"], **{field: 1.1}))
        with self.assertRaisesRegex(ValueError, "gross billings"):
            simulate(replace(BASE["agency_referral"], agency_share=.8, platform_share=.3))

    def test_vector_shape_and_values_are_validated(self):
        for field in ("demand", "delivery_overhead", "commercial_overhead"):
            for values in (None, "123456", (0,) * (PERIODS - 1), (0,) * (PERIODS + 1)):
                with self.subTest(field=field, values=values):
                    with self.assertRaisesRegex(ValueError, field):
                        simulate(replace(BASE["assisted_direct"], **{field: values}))
            for invalid in (-1, float("nan"), float("inf"), True, "1"):
                with self.subTest(field=field, value=invalid):
                    with self.assertRaisesRegex(ValueError, field):
                        simulate(replace(BASE["assisted_direct"], **{field: (invalid,) + (0,) * (PERIODS - 1)}))
        for value in (.5, 1.0):
            with self.subTest(demand=value):
                with self.assertRaisesRegex(ValueError, "whole number"):
                    simulate(replace(BASE["assisted_direct"], demand=(value,) * PERIODS))

    def test_collection_lag_requires_a_nonnegative_integer(self):
        for lag in (-1, .5, 1.0, True, float("nan"), float("inf"), "1", None):
            with self.subTest(lag=lag):
                with self.assertRaisesRegex(ValueError, "collection_lag"):
                    simulate(BASE["assisted_direct"], collection_lag=lag)
        no_collections = simulate(BASE["assisted_direct"], collection_lag=PERIODS + 1)
        self.assertTrue(all(row["collections"] == 0 for row in no_collections["rows"]))
        immediate = simulate(BASE["assisted_direct"], collection_lag=0)
        self.assertTrue(all(row["collections"] == row["net_revenue"] for row in immediate["rows"]))

    def test_zero_delivery_work_still_respects_commercial_capacity(self):
        motion = replace(BASE["assisted_direct"], demand=(20,) * PERIODS, onboarding_hours=0, support_hours=0)
        data = simulate(motion)
        self.assertTrue(all(row["new"] == 13 for row in data["rows"]))
        self.assertTrue(all(row["delivery_hours"] == 0 and row["commercial_hours"] == 39 for row in data["rows"]))

    def test_zero_work_admits_demand_only_if_fixed_overhead_fits(self):
        motion = replace(BASE["assisted_direct"], demand=(20,) * PERIODS, onboarding_hours=0, support_hours=0, sales_hours_per_new=0)
        self.assertTrue(all(row["new"] == 20 for row in simulate(motion)["rows"]))
        at_limit = replace(motion, delivery_overhead=(60,) * PERIODS, commercial_overhead=(40,) * PERIODS)
        self.assertTrue(all(row["new"] == 20 for row in simulate(at_limit)["rows"]))
        for field, overhead in [("delivery_overhead", 61), ("commercial_overhead", 41)]:
            with self.subTest(field=field):
                overbooked = replace(motion, **{field: (overhead,) * PERIODS})
                self.assertTrue(all(row["new"] == 0 for row in simulate(overbooked)["rows"]))

    def test_zero_activity_keeps_fixed_cash_costs(self):
        motion = replace(BASE["assisted_direct"], demand=(0,) * PERIODS, onboarding_hours=0, support_hours=0)
        data = simulate(motion)
        self.assertEqual(data["summary"]["new_starts"], 0)
        self.assertEqual(data["summary"]["gross_billings"], 0)
        self.assertEqual(data["summary"]["final_cash"], STARTING_CASH - PERIODS * FIXED_CASH_COST)
        self.assertTrue(all(row["operating_result"] == -FIXED_CASH_COST for row in data["rows"]))
        json.dumps(data, allow_nan=False)


if __name__ == "__main__":
    unittest.main()
