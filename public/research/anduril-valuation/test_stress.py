import unittest
import math
from model import value as original_value, A2, CASES, REVENUE_2026
from stress import value, reverse, software_share, snapshot

class OperatingStressTests(unittest.TestCase):
    def test_all_defaults_preserve_original_scenarios(self):
        for case in CASES:
            a,b=value(case),original_value(case)
            for key in ['enterprise_value','gross_equity_value','pv_explicit','pv_terminal','terminal_fcf']:
                self.assertAlmostEqual(a[key],b[key],places=10)
            for x,y in zip(a['rows'],b['rows']):self.assertAlmostEqual(x['fcf'],y['fcf'],places=10)
    def test_delay_postpones_margin_without_delaying_spending(self):
        a,b=value(),value(margin_delay=2)
        self.assertLess(b['enterprise_value'],a['enterprise_value'])
        for i,row in enumerate(b['rows']):
            self.assertEqual(row['revenue'],a['rows'][i]['revenue'])
            self.assertEqual(row['ordinary_capex'],a['rows'][i]['ordinary_capex'])
            self.assertEqual(row['arsenal2_capex'],a['rows'][i]['arsenal2_capex'])
        self.assertEqual(b['rows'][11]['ebit_margin'],.22)
    def test_overrun_ties_to_discounted_extra_spending(self):
        a,b=value(),value(arsenal2_multiplier=1.5)
        expected=sum(.5*cost/1.12**row['discount_years'] for cost,row in zip(A2,a['rows']))
        self.assertAlmostEqual(a['enterprise_value']-b['enterprise_value'],expected,places=10)
    def test_receivables_shock_funds_terminal_growth(self):
        a,b=value(),value(extra_collection_days=30)
        last=b['rows'][-1]
        self.assertAlmostEqual(b['terminal_extra_ar_investment'],last['revenue']*.03*30/365,places=10)
        self.assertAlmostEqual(b['rows'][0]['change_extra_receivables'],b['rows'][0]['revenue']*30/365)
        self.assertAlmostEqual(a['terminal_fcf']-b['terminal_fcf'],b['terminal_extra_ar_investment'])
    def test_noncash_pay_never_raises_economic_value(self):
        a,b=value(),value(noncash_comp_ratio=.04)
        self.assertEqual(a['enterprise_value'],b['enterprise_value'])
        self.assertEqual(a['peak_economic_fcf_deficit'],b['peak_economic_fcf_deficit'])
        self.assertLess(b['cash_timing_proxy_gap'],a['cash_timing_proxy_gap'])
    def test_liquidity_is_not_valuation_cash(self):
        a,b=value(),value(available_cash=5)
        self.assertEqual(a['enterprise_value'],b['enterprise_value'])
        self.assertEqual(a['gross_equity_value'],b['gross_equity_value'])
        self.assertAlmostEqual(a['cash_timing_proxy_gap']-b['cash_timing_proxy_gap'],2)
    def test_minority_deduction_is_dollar_for_dollar(self):
        a,b=value(),value(minority_value=3)
        self.assertEqual(a['enterprise_value'],b['enterprise_value'])
        self.assertAlmostEqual(a['equity_after_assumed_nci']-b['equity_after_assumed_nci'],3)
    def test_reverse_solver_accounts_for_outside_claim(self):
        a,b=reverse(61),reverse(61,minority_value=3)
        self.assertGreater(b['revenue_2036'],a['revenue_2036'])
        self.assertLess(abs(b['residual']),1e-8)
    def test_software_mix_reconstructs_margin(self):
        for hardware in [.15,.20]:
            s=software_share(.22,hardware)
            self.assertAlmostEqual(hardware*(1-s)+.5*s-.05,.22)
    def test_cash_bridge_reconciles_each_stress(self):
        for s in snapshot()['stress']:
            result=value(**s['parameters'])
            for row in result['rows']:
                self.assertAlmostEqual(row['fcf'],row['nopat']+row['depreciation']-row['ordinary_capex']-row['arsenal2_capex']-row['change_nwc']-row['change_extra_receivables']-row['fade_reinvestment'],places=10)
    def test_claims_equity_is_not_a_probability(self):
        s=snapshot()
        self.assertTrue(all('probability' not in row for row in s['stress']))
        self.assertAlmostEqual(s['stress'][-1]['enterprise_value'],7.541180080437808,places=9)
    def test_invalid_inputs_fail(self):
        for args in [dict(discount=float('nan')),dict(terminal_growth=.15),dict(scale=0),dict(margin_delay=3),dict(margin_delay=1.5),dict(extra_collection_days=-1),dict(arsenal2_multiplier=-1),dict(noncash_comp_ratio=.2),dict(minority_value=-1)]:
            with self.assertRaises(ValueError):value(**args)
        with self.assertRaises(ValueError):reverse(float('inf'))
        with self.assertRaises(ValueError):software_share(.9)

if __name__=='__main__': unittest.main()
