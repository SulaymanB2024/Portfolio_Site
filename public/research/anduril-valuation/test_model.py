"""Reproducible arithmetic and boundary checks; python -m unittest -v test_model."""
import math
import unittest
from model import A2, CASES, STUB, value, reverse

class ValuationTests(unittest.TestCase):
    def test_announced_capital_is_not_netted_against_contract_ceiling(self):
        self.assertAlmostEqual(sum(A2),3.7)
        self.assertAlmostEqual(sum(r['arsenal2_capex'] for r in value()['rows']),3.7)
    def test_remaining_period_only(self):
        self.assertAlmostEqual(STUB,78/365)
        self.assertAlmostEqual(value()['stub_fcf'],-2.492*78/365)
    def test_cash_flow_tieout_all_scenarios(self):
        for name in CASES:
            result=value(name)
            self.assertEqual(len(result['rows']),15)
            running=result['stub_fcf']
            for r in result['rows']:
                expected=r['nopat']+r['depreciation']-r['ordinary_capex']-r['arsenal2_capex']-r['change_nwc']-r['fade_reinvestment']
                self.assertAlmostEqual(r['fcf'],expected,places=10)
                self.assertEqual(r['cash_tax'],max(r['ebit'],0)*.24)
                running+=r['fcf']
                self.assertAlmostEqual(running,r['cumulative_fcf'])
            self.assertAlmostEqual(result['enterprise_value'],result['pv_explicit']+result['pv_terminal'])
    def test_cash_and_nci_affect_bridge_not_operating_value(self):
        a=value();b=value(net_cash=8,minority_value=2)
        self.assertEqual(a['enterprise_value'],b['enterprise_value'])
        self.assertAlmostEqual(b['equity_after_assumed_nci']-a['gross_equity_value'],3)
    def test_available_cash_is_not_net_cash(self):
        a=value();b=value(available_cash=5)
        self.assertEqual(a['gross_equity_value'],b['gross_equity_value'])
        self.assertAlmostEqual(a['incremental_funding_proxy']-b['incremental_funding_proxy'],2)
    def test_terminal_growth_pays_for_reinvestment(self):
        for name in CASES:
            v=value(name);r=v['rows'][-1]
            self.assertAlmostEqual(r['total_reinvestment'],r['nopat']*.03/CASES[name]['roic'])
            self.assertAlmostEqual(v['terminal_fcf'],r['nopat']*1.03*(1-.03/CASES[name]['roic']))
    def test_base_snapshot(self):
        v=value()
        self.assertAlmostEqual(v['enterprise_value'],27.685,places=3)
        self.assertAlmostEqual(v['gross_equity_value'],30.685,places=3)
        self.assertAlmostEqual(v['peak_cumulative_funding'],10.478,places=3)
        self.assertEqual(v['first_positive_fcf'],2032)
    def test_reverse_targets_reconcile(self):
        for target in [61,100]:
            v=reverse(target)
            self.assertLess(abs(v['residual']),1e-8)
            self.assertAlmostEqual(value(scale=v['scale'])['rows'][9]['revenue'],v['revenue_2036'])
    def test_scaling_applies_to_the_full_growth_path(self):
        self.assertAlmostEqual(value(scale=2)['rows'][9]['revenue'],2*value()['rows'][9]['revenue'])
        self.assertNotEqual(value(scale=2)['rows'][0]['fcf'],value()['rows'][0]['fcf'])
    def test_discount_rate_ordering(self):
        values=[value(discount=r)['gross_equity_value'] for r in [.10,.12,.14]]
        self.assertGreater(values[0],values[1]);self.assertGreater(values[1],values[2])
    def test_invalid_inputs_are_rejected(self):
        for kwargs in [dict(terminal_growth=.12),dict(discount=math.nan),dict(minority_value=-1),dict(available_cash=-1),dict(scale=0),dict(case='Other')]:
            with self.assertRaises(ValueError):value(**kwargs)
    def test_investor_return_test_is_separate(self):
        self.assertAlmostEqual(61*1.15**10/.8,308.4737773477279,places=7)

if __name__=='__main__':unittest.main()
