#!/usr/bin/env python3
"""Reproduce the Hyperliquid article. Python 3.10+, standard library only.

Run: python model.py [--inputs inputs.json] [--output results.json]
This is a conditional token-directed-flow valuation, not an audited-company DCF.
All operating scenarios are author assumptions. Headline historical receipts
already contain reserve yield; no historical 'pure trading take rate' is inferred.
"""
from __future__ import annotations
import argparse
import csv
import json
import math
from pathlib import Path
from typing import Any


def validate(data: dict[str, Any]) -> None:
    assert 0 <= data['terminalGrowth'] < data['discountRate'] < 1
    assert data['supplyM'] > 0 and 0 <= data['reserveShare'] <= 1
    assert data['explicitYears'] == 5 and data['fadeYears'] == 5
    for name, scenario in data['cases'].items():
        for key, values in scenario.items():
            if isinstance(values, list):
                assert len(values) == 5, (name, key)
                assert all(isinstance(v, (int, float)) and math.isfinite(v) and v >= 0 for v in values)
        terminal_volume = scenario['cryptoMarket2031T'] * scenario['onchainShare2031'] * scenario['hyperliquidShare2031']
        assert math.isclose(terminal_volume, scenario['cryptoVolumeT'][-1], rel_tol=1e-12)


def explicit_flows(s: dict[str, Any], reserve_share: float) -> list[dict[str, float]]:
    """T * basis points / 10 = USD billions. All trading rates already net to HYPE."""
    result = []
    for i in range(5):
        streams = {
            'cryptoB': s['cryptoVolumeT'][i] * s['cryptoNetBps'][i] / 10,
            'noncryptoB': s['noncryptoVolumeT'][i] * s['noncryptoNetBps'][i] / 10,
            'spotB': s['spotVolumeT'][i] * s['spotNetBps'][i] / 10,
            'reservesB': s['eligibleStablecoinBalanceB'][i] * s['costAdjustedReserveYield'][i] * reserve_share,
            'otherB': s['otherNetFeesB'][i],
            'outcomesB': s['outcomeNetFeesB'][i],
        }
        result.append({'year': 2027 + i, **streams, 'totalB': sum(streams.values())})
    return result


def value(flows5: list[float], r: float = .18, g: float = .03, supply_m: float = 955.31) -> dict[str, Any]:
    if len(flows5) != 5 or not all(math.isfinite(x) and x > 0 for x in flows5) or not (0 <= g < r < 1) or not math.isfinite(supply_m) or supply_m <= 0:
        raise ValueError('Need five positive flows, positive supply, and 0 <= g < r < 1.')
    flows = list(flows5)
    last_growth = flows[-1] / flows[-2] - 1
    fade_rates = [last_growth + (g-last_growth)*j/5 for j in range(1, 6)]
    for growth in fade_rates:
        flows.append(flows[-1] * (1 + growth))
    pv_flows = [flow / (1+r)**t for t, flow in enumerate(flows, 1)]
    terminal_at_10 = flows[-1] * (1+g) / (r-g)
    pv_terminal = terminal_at_10 / (1+r)**10
    pv_explicit = sum(pv_flows)
    total = pv_explicit + pv_terminal
    return {
        'flowsB': flows, 'fadeGrowthRates': fade_rates, 'pvFlowsB': pv_flows,
        'pvExplicitB': pv_explicit, 'terminalAt2036B': terminal_at_10,
        'pvTerminalB': pv_terminal, 'valueB': total,
        'perToken': total * 1000 / supply_m, 'terminalShare': pv_terminal / total,
    }


def solve_growth(start_b: float, target_b: float, r: float, g: float, supply_m: float = 955.31) -> dict[str, Any]:
    """Inverse valuation: five equal-growth years, then the same five-year fade."""
    if not all(math.isfinite(x) and x > 0 for x in (start_b, target_b)):
        raise ValueError('Positive starting flow and target value required.')
    lo, hi = -.5, 3.
    def objective(c: float) -> float:
        return value([start_b*(1+c)**t for t in range(1, 6)], r, g, supply_m)['valueB'] - target_b
    if objective(lo) > 0 or objective(hi) < 0:
        raise ValueError('Target outside inverse-model bracket.')
    for _ in range(100):
        mid = (lo+hi)/2
        if objective(mid) > 0: hi = mid
        else: lo = mid
    c = (lo+hi)/2
    return {'growth': c, **value([start_b*(1+c)**t for t in range(1, 6)], r, g, supply_m)}


def build(data: dict[str, Any]) -> dict[str, Any]:
    validate(data)
    r, g, supply = data['discountRate'], data['terminalGrowth'], data['supplyM']
    cases = {}
    for key, scenario in data['cases'].items():
        periods = explicit_flows(scenario, data['reserveShare'])
        cases[key] = {'periods': periods, **value([x['totalB'] for x in periods], r, g, supply)}
    obs = data['observed']
    annualization = 365/30
    start_b = obs['allProductHolderReceipts30dM']/1000 * annualization
    reference_b = data['referencePrice'] * supply/1000
    base5 = [p['totalB'] for p in cases['base']['periods']]
    inverse = solve_growth(start_b, reference_b, r, g, supply)
    result = {
        'asOf': data['asOf'], 'cases': cases,
        'diagnostics': {
            'annualizedPerpVolumeT': obs['perpVolume30dB']/1000*annualization,
            'annualizedAllProductReceiptsB': start_b,
            'mixedProductReceiptRatioBps': obs['perpProductHolderReceipts30dM']/obs['perpVolume30dB']*10,
            'notAPureTradingTakeRate': True,
            'reportedFeeToHolderDifferenceM': obs['perpProductFees30dM']-obs['perpProductHolderReceipts30dM'],
            'q3UnreconciledDifferenceM': obs['q3ParentGrossM']-obs['q3ParentCostM']-obs['q3ParentReportedProfitM'],
            'referenceValueB': reference_b,
            'baseVolumeMultiple': sum((data['cases']['base'][x][-1] for x in ('cryptoVolumeT','noncryptoVolumeT')))/(obs['perpVolume30dB']/1000*annualization),
        },
        'inverse': inverse,
        'sensitivity': [
            {'r': rate, 'g': growth, 'perToken': value(base5, rate, growth, supply)['perToken']}
            for rate in (.12,.15,.18,.21,.24) for growth in (.02,.03,.04)
        ],
        'supplySensitivity': [
            {'supplyM': n, 'perToken': cases['base']['valueB']*1000/n}
            for n in (222.45,501.850666,707,955.31,1000)
        ],
        'baseAt12PercentAnd707M': value(base5,.12,.03,707)['perToken'],
    }
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inputs', type=Path, default=Path(__file__).with_name('inputs.json'))
    parser.add_argument('--output', type=Path, default=Path(__file__).with_name('results.json'))
    args = parser.parse_args()
    data = json.loads(args.inputs.read_text())
    result = build(data)
    args.output.write_text(json.dumps(result, indent=2)+'\n')
    with args.output.with_name('cash-flows.csv').open('w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['scenario','period_end','phase','token_directed_flow_usd_b','pv_usd_b'])
        for name, case in result['cases'].items():
            for i, flow in enumerate(case['flowsB']):
                writer.writerow([name,f'{2027+i}-10-14','driver_forecast' if i<5 else 'aggregate_growth_fade',flow,case['pvFlowsB'][i]])
    print(json.dumps({k: {'valueB': v['valueB'], 'perToken': v['perToken']} for k,v in result['cases'].items()},indent=2))

if __name__ == '__main__': main()
