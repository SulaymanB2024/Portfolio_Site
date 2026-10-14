#!/usr/bin/env python3
"""Auditable extension of the October 14 HYPE model, standard library only.

python stress.py [--inputs inputs.json] [--output stress-results.json]
Inputs are the original published inputs.json, not a new historical dataset.
Trading changes below are additive basis-point shocks in every explicit year.
No-shock cases reproduce the original model. For isolated operating shocks,
the unshocked case's growth-fade anchor stays fixed; otherwise changing 2030
cash flow can spuriously change all later years through the growth formula.
The 'delay' test postpones the entire stream, not a modeled business forecast.
"""
from __future__ import annotations
import argparse
import json
import math
from pathlib import Path
from typing import Any


def finite(value: float, name: str) -> float:
    if not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'{name} must be finite')
    return float(value)


def streams(s: dict[str, Any], share: float, crypto_delta: float = 0,
            noncrypto_delta: float = 0, reserve_delta: float = 0) -> list[dict[str, float]]:
    output = []
    for i in range(5):
        rates = (s['cryptoNetBps'][i] + crypto_delta,
                 s['noncryptoNetBps'][i] + noncrypto_delta,
                 s['costAdjustedReserveYield'][i] + reserve_delta)
        if any(not math.isfinite(x) or x < 0 for x in rates):
            raise ValueError('A shock cannot make any annual retained fee or reserve yield negative')
        output.append({
            'crypto': s['cryptoVolumeT'][i] * rates[0] / 10,
            'noncrypto': s['noncryptoVolumeT'][i] * rates[1] / 10,
            'spot': s['spotVolumeT'][i] * s['spotNetBps'][i] / 10,
            'reserves': s['eligibleStablecoinBalanceB'][i] * rates[2] * share,
            'other': s['otherNetFeesB'][i], 'outcomes': s['outcomeNetFeesB'][i],
        })
    return output


def present_value(first: list[float], r: float, g: float, supply: float,
                  anchor: float, diversion: float = 0, delay: float = 0,
                  fade_years: int = 5) -> dict[str, Any]:
    for name, x in [('return', r), ('growth', g), ('supply', supply),
                    ('anchor', anchor), ('diversion', diversion), ('delay', delay)]:
        finite(x, name)
    if not (0 <= g < r < 1 and supply > 0 and 0 <= diversion <= 1 and delay >= 0):
        raise ValueError('Require 0 <= growth < return < 1, positive supply, valid diversion/delay')
    if len(first) != 5 or not all(math.isfinite(x) and x >= 0 for x in first) or anchor <= -1:
        raise ValueError('Need five nonnegative flows and a growth anchor above -100%')
    if fade_years not in (0, 5):
        raise ValueError('Only immediate maturity or five-year fade is supported')
    gross = list(first)
    rates = []
    for j in range(1, fade_years + 1):
        growth = anchor + (g - anchor) * j / fade_years
        rates.append(growth)
        gross.append(gross[-1] * (1 + growth))
    n = len(gross)
    flows = [x * (1 - diversion) for x in gross]
    discounted = [x / (1 + r)**(i + 1 + delay) for i, x in enumerate(flows)]
    terminal = flows[-1] * (1 + g) / (r - g) / (1 + r)**(n + delay)
    value = sum(discounted) + terminal
    parts = {'driverYearsB': sum(discounted[:5]), 'fadeYearsB': sum(discounted[5:]), 'terminalB': terminal}
    return {'flowsB': flows, 'pvFlowsB': discounted, 'fadeRates': rates,
            'valueB': value, 'perToken': value * 1000 / supply, **parts,
            'postDriverShare': (parts['fadeYearsB'] + terminal) / value if value else 0,
            'post2031Share': (sum(x for i, x in enumerate(discounted) if 2027+i+delay>2031) + terminal) / value if value else 0,
            'terminalShare': terminal / value if value else 0}


def calculate(data: dict[str, Any], case: str = 'base', *, r: float | None = None,
              g: float | None = None, supply: float | None = None,
              crypto_delta: float = 0, noncrypto_delta: float = 0,
              reserve_delta: float = 0, diversion: float = 0,
              delay: float = 0, fade_years: int = 5) -> dict[str, Any]:
    if case not in data['cases']:
        raise ValueError('Unknown scenario')
    for name, x in [('crypto delta', crypto_delta), ('non-crypto delta', noncrypto_delta), ('reserve delta', reserve_delta)]:
        finite(x, name)
    s = data['cases'][case]
    base = [sum(x.values()) for x in streams(s, data['reserveShare'])]
    anchor = base[-1] / base[-2] - 1
    products = streams(s, data['reserveShare'], crypto_delta, noncrypto_delta, reserve_delta)
    answer = present_value([sum(x.values()) for x in products],
        data['discountRate'] if r is None else r,
        data['terminalGrowth'] if g is None else g,
        data['supplyM'] if supply is None else supply, anchor, diversion, delay, fade_years)
    answer['streamsB'] = products
    answer['fixedGrowthAnchor'] = anchor
    return answer


def implied_return(data: dict[str, Any], price: float, case: str = 'base', **options: Any) -> float | None:
    finite(price, 'Reference price')
    if price <= 0:
        raise ValueError('Reference price must be positive')
    options = {k: v for k, v in options.items() if k != 'r'}
    lo, hi = options.get('g', data['terminalGrowth']) + 1e-8, .99
    if calculate(data, case, r=lo, **options)['perToken'] < price or calculate(data, case, r=hi, **options)['perToken'] > price:
        return None
    for _ in range(100):
        mid = (lo+hi)/2
        if calculate(data, case, r=mid, **options)['perToken'] > price:
            lo = mid
        else:
            hi = mid
    return (lo+hi)/2


def build(data: dict[str, Any]) -> dict[str, Any]:
    base = calculate(data)
    shocks = [
        ('Unchanged central case', {}),
        ('Crypto retained fee lower by 1 bp', {'crypto_delta': -1}),
        ('Non-crypto retained fee lower by 0.25 bp', {'noncrypto_delta': -.25}),
        ('Reserve yield lower by 1 percentage point', {'reserve_delta': -.01}),
        ('20% of modeled receipts redirected', {'diversion': .2}),
        ('Entire stream delayed two years', {'delay': 2}),
        ('Stable growth immediately after 2031', {'fade_years': 0}),
    ]
    return {
        'asOf': data['asOf'], 'impliedReturnAt80': implied_return(data, 80), 'method': 'Isolated shocks; unshocked growth-fade anchor held fixed. No scenario probabilities.',
        'cases': {key: calculate(data, key) for key in data['cases']},
        'shocks': [{'label': label, 'parameters': args, **calculate(data, **args)} for label, args in shocks],
        'marketContext': {'cexTop10Volume2025T': 86.2, 'dexTop10Volume2025T': 6.7,
            'coveredVolumeT': 92.9, 'dexShareOfCovered': 6.7/92.9,
            'baseCryptoGlobalShare2031': .2*.3},
        'permanentReductionNeededFor80': 1 - base['perToken']/80,
        'flatReceiptValuePerToken': data['observed']['allProductHolderReceipts30dM']/1000*365/30/data['discountRate']*1000/data['supplyM'],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inputs', type=Path, default=Path(__file__).with_name('inputs.json'))
    parser.add_argument('--output', type=Path, default=Path(__file__).with_name('stress-results.json'))
    args = parser.parse_args()
    result = build(json.loads(args.inputs.read_text()))
    args.output.write_text(json.dumps(result, indent=2) + '\n')
    for row in result['shocks']:
        print(f"{row['label']}: ${row['perToken']:.2f}")
    print(f"Post-2031 value: {result['cases']['base']['post2031Share']:.2%}")

if __name__ == '__main__':
    main()
