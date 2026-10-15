"""Stress and invalid-input checks for the editable scenario boundary."""
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from models import DEFAULT_INPUTS, load_inputs, results


class ScenarioTests(unittest.TestCase):
    def setUp(self):
        self.inputs = load_inputs()

    def test_default_underwriting_keeps_verified_anchor(self):
        data = results(self.inputs)
        self.assertEqual(data['toast']['ttm_gp_anchor'], 2_082_000_000)
        self.assertAlmostEqual(data['toast']['scenarios']['base']['terminal_value_per_share'], 37.00467916706717)
        self.assertNotIn('maximum_entry_at_selected_hurdle', data['toast']['scenarios']['base'])

    def test_default_serialized_results_preserve_the_reviewed_baseline(self):
        canonical = Path(__file__).with_name('model-results.json').read_text()
        self.assertEqual(json.dumps(results(self.inputs), indent=2, allow_nan=False) + '\n', canonical)

    def test_selected_toast_hurdle_keeps_the_15_percent_field_truthful(self):
        self.inputs['toast']['assumed']['entry_return_hurdle'] = .20
        for row in results(self.inputs)['toast']['scenarios'].values():
            terminal = row['terminal_value_per_share']
            self.assertAlmostEqual(row['maximum_entry_for_15_percent'], terminal / 1.15 ** 3)
            self.assertAlmostEqual(row['maximum_entry_at_selected_hurdle'], terminal / 1.20 ** 3)
            self.assertEqual(row['entry_return_hurdle'], .20)

    def test_validation_receipt_keeps_company_units_distinct(self):
        from verify import independent_math
        self.assertEqual(independent_math()['harvey_net_eligible_hours'], 13248)

    def test_lower_adoption_changes_profit_without_changing_license_bill(self):
        original = copy.deepcopy(self.inputs)
        self.inputs['harvey']['assumed']['customer_adoption'] = .30
        row = results(self.inputs)['harvey']['customer_value']
        self.assertEqual(row['net_freed_hours'], 6624)
        self.assertEqual(row['first_year_total_cost'], 290000)
        self.assertEqual(row['cases']['0.25']['net_first_year_benefit'], 41200)
        self.assertEqual(load_inputs(), original)

    def test_audit_window_shortens_recurring_value(self):
        self.inputs['vanta']['assumed']['weeks'] = 16
        row = results(self.inputs)['vanta']['customer_value']
        self.assertEqual(row['annual_freed_hours'], 248)
        self.assertEqual(row['cases']['0.5']['net_first_year_cash_benefit'], -13830)
        self.assertEqual(row['cases']['0.5']['net_recurring_cash_benefit'], -8830)

    def test_weak_retention_reduces_terminal_arr(self):
        original = results(self.inputs)['vanta']['scenarios']['base']['terminal_arr']
        self.inputs['vanta']['assumed']['five_year_gross_ARR_retention'][1] = .50
        changed = results(self.inputs)['vanta']['scenarios']['base']['terminal_arr']
        self.assertLess(changed, original)

    def test_zero_usable_capacity_has_no_finite_payback(self):
        self.inputs['harvey']['assumed']['customer_adoption'] = 0
        self.inputs['vanta']['assumed']['weekly_saved_hours_excluding_questionnaires'] = 0
        self.inputs['vanta']['assumed']['questionnaires_month'] = 0
        data = results(self.inputs)
        self.assertIsNone(data['harvey']['customer_value']['break_even_monetization_fraction'])
        self.assertIsNone(data['vanta']['customer_value']['break_even_first_year_capture'])
        self.assertEqual(data['harvey']['customer_value']['cases']['0.25']['net_first_year_benefit'], -290000)
        json.dumps(data, allow_nan=False)

    def test_invalid_financing_retention_and_horizon_fail_clearly(self):
        changes = [('harvey', 'future_ownership_dilution', 1), ('vanta', 'five_year_gross_ARR_retention', [.85, 1.5, .95]), ('toast', 'years', 0), ('harvey', 'customer_adoption', float('nan'))]
        for company, field, value in changes:
            with self.subTest(field=field):
                data = copy.deepcopy(self.inputs)
                data[company]['assumed'][field] = value
                with self.assertRaises(ValueError):
                    results(data)

    def test_acquisition_horizon_must_cover_all_years(self):
        self.inputs['vanta']['assumed']['annual_new_ARR_m']['base'].pop()
        with self.assertRaisesRegex(ValueError, '5 values'):
            results(self.inputs)

    def test_custom_scenario_cannot_relabel_changed_disclosures(self):
        self.inputs['vanta']['reported']['ARR_m'] = 500
        cache = Path(__file__).resolve().parent.parent / '.cache'
        cache.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=cache) as folder:
            source = Path(folder) / 'scenario.json'
            source.write_text(json.dumps(self.inputs))
            with self.assertRaisesRegex(ValueError, 'assumptions only'):
                load_inputs(source)

    def test_custom_cli_does_not_overwrite_canonical_artifacts(self):
        here = Path(__file__).resolve().parent
        canonical = here / 'model-results.json'
        before = hashlib.sha256(canonical.read_bytes()).hexdigest()
        self.inputs['harvey']['assumed']['customer_adoption'] = .30
        cache = here.parent / '.cache'
        cache.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=cache) as folder:
            source = Path(folder) / 'scenario.json'
            output = Path(folder) / 'results.json'
            source.write_text(json.dumps(self.inputs))
            command = [sys.executable, str(here/'models.py'), '--inputs', str(source)]
            printed = subprocess.run(command, text=True, capture_output=True, check=True)
            self.assertEqual(json.loads(printed.stdout)['harvey']['customer_value']['cases']['0.25']['net_first_year_benefit'], 41200)
            subprocess.run([*command, '--output', str(output)], text=True, capture_output=True, check=True)
            self.assertEqual(json.loads(output.read_text())['harvey']['customer_value']['net_freed_hours'], 6624)
        self.assertEqual(hashlib.sha256(canonical.read_bytes()).hexdigest(), before)

    def test_cli_rejects_input_output_equality_and_file_aliases(self):
        here = Path(__file__).resolve().parent
        cache = here.parent / '.cache'
        cache.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=cache) as folder:
            source = Path(folder) / 'scenario.json'
            source.write_text(json.dumps(self.inputs))
            symlink = Path(folder) / 'symlink.json'
            symlink.symlink_to(source)
            hardlink = Path(folder) / 'hardlink.json'
            hardlink.hardlink_to(source)
            before = source.read_bytes()
            for input_path, output_path in [(source, source), (source, symlink), (symlink, source), (source, hardlink), (hardlink, source)]:
                with self.subTest(input=input_path.name, output=output_path.name):
                    command = [sys.executable, str(here/'models.py'), '--inputs', str(input_path), '--output', str(output_path)]
                    run = subprocess.run(command, text=True, capture_output=True)
                    self.assertEqual(run.returncode, 2, run.stdout + run.stderr)
                    self.assertIn('output must not overwrite inputs', run.stderr)
                    self.assertEqual(source.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
