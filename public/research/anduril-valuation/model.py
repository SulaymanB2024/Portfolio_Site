"""Anduril valuation, public evidence cutoff 2026-10-14. USD billions.

This is an expectations model, not management guidance or audited financials.
No external dependencies. Run: python model.py [output_directory]
Gross equity = consolidated enterprise value + assumed net cash; subtract the
FAIR VALUE of non-controlling interests and other senior claims separately.
"""
from __future__ import annotations
from datetime import date
from pathlib import Path
import csv
import json
import math
import sys

AS_OF = date(2026, 10, 14)
TAX = 0.24
REVENUE_2025 = 2.2  # Company-reported; see source S1 in the article.
REVENUE_2026 = 4.3  # Reported investor projection, NOT actual revenue; S4.
EBIT_2026 = -1.2  # Reported projected operating loss; not audited; S3.
STUB = (date(2026, 12, 31) - AS_OF).days / 365
A2 = [0.6, 0.85, 0.9, 0.85, 0.5, 0, 0, 0, 0, 0]
# Author timing of the announced $3.7bn private investment, not a company schedule.
CASES = {
    'Downside': dict(
        growth=[.30,.25,.22,.18,.15,.12,.10,.08,.06,.05],
        margins=[-.20,-.12,-.06,0,.05,.09,.12,.14,.15,.15],
        nwc=[.20]*10, capex=[.06,.06,.06,.055,.05,.045,.04,.04,.04,.04],
        da=[.02]*10, roic=.10, fade=[.045,.04,.035,.03,.03]),
    'Base': dict(
        growth=[.60,.45,.35,.30,.27,.24,.21,.18,.15,.12],
        margins=[-.20,-.10,-.03,.03,.09,.14,.18,.20,.21,.22],
        nwc=[.18,.18,.18,.18,.17,.16,.15,.14,.14,.14],
        capex=[.06,.06,.06,.055,.05,.045,.04,.04,.035,.035],
        da=[.02,.02,.02,.02,.025,.025,.025,.025,.025,.025],
        roic=.15, fade=[.09,.07,.05,.04,.03]),
    'Upside': dict(
        growth=[.75,.60,.50,.40,.30,.25,.20,.18,.15,.12],
        margins=[-.15,-.05,.02,.08,.14,.20,.24,.26,.27,.28],
        nwc=[.16,.16,.15,.14,.13,.12,.11,.10,.10,.10],
        capex=[.06,.06,.06,.055,.05,.045,.04,.035,.03,.03],
        da=[.02,.02,.02,.02,.025,.025,.025,.025,.025,.025],
        roic=.20, fade=[.09,.07,.05,.04,.03]),
}

def value(case: str = 'Base', discount: float = .12, terminal_growth: float = .03,
          net_cash: float = 3., minority_value: float = 0., scale: float = 1.,
          available_cash: float = 3.) -> dict:
    """Value consolidated operating cash flows; bridge equity with explicit claims.

    scale increases each 2027-36 growth factor by scale**0.1; 2036 sales therefore
    scale exactly. The reverse DCF retains margins and reinvestment assumptions.
    2037-41 growth and reinvestment fade into a sustainable ROIC-based perpetuity.
    The zero minority default is an UNADJUSTED bridge, not an assertion of no NCI.
    """
    if case not in CASES:
        raise ValueError('Unknown scenario')
    c = CASES[case]
    vals = [discount, terminal_growth, net_cash, minority_value, scale, available_cash]
    if not all(math.isfinite(x) for x in vals):
        raise ValueError('All inputs must be finite')
    if not 0 <= terminal_growth < min(discount, c['roic']) or scale <= 0 or minority_value < 0 or available_cash < 0:
        raise ValueError('Require 0 <= g < discount and ROIC; positive scale; nonnegative NCI')
    rev = REVENUE_2026
    nwc = .18 * rev
    annual_2026_fcf = EBIT_2026 + .02 * rev - 1.0 - .18*(rev-REVENUE_2025)
    stub_cf = annual_2026_fcf * STUB
    pv = stub_cf / (1+discount)**STUB
    cumulative = stub_cf
    minimum = cumulative
    rows = []
    for i, year in enumerate(range(2027, 2042)):
        previous = rev
        if i < 10:
            growth = (1+c['growth'][i]) * scale**.1 - 1
            margin = c['margins'][i]
        else:
            # At the final fade year the explicit growth equals terminal growth.
            j = i - 10
            growth = c['fade'][j] + (terminal_growth-.03)*(j+1)/5
            margin = c['margins'][-1]
        rev *= 1+growth
        ebit = rev*margin
        tax = max(0., ebit)*TAX
        nopat = ebit-tax
        idx = min(i, 9)
        da = rev*c['da'][idx]
        next_nwc = rev*c['nwc'][idx]
        delta_nwc = next_nwc-nwc
        ordinary_capex = rev*c['capex'][idx]
        arsenal2 = A2[i] if i < 10 else 0.
        raw_reinvestment = ordinary_capex + arsenal2 - da + delta_nwc
        adjustment = 0.
        if i >= 10:
            blend = (i-9)/5
            target = nopat*growth/c['roic']
            # Explicit additional capital required to converge to mature ROIC.
            adjustment = blend*(target-raw_reinvestment)
        reinvestment = raw_reinvestment+adjustment
        fcf = nopat-reinvestment
        t = (date(year, 12, 31)-AS_OF).days/365
        pv_fcf = fcf/(1+discount)**t
        pv += pv_fcf
        cumulative += fcf
        minimum = min(minimum, cumulative)
        rows.append(dict(year=year, revenue=rev, growth=growth, ebit_margin=margin,
            ebit=ebit, cash_tax=tax, nopat=nopat, depreciation=da,
            ordinary_capex=ordinary_capex, arsenal2_capex=arsenal2,
            nwc=next_nwc, change_nwc=delta_nwc, fade_reinvestment=adjustment,
            total_reinvestment=reinvestment, fcf=fcf, pv_fcf=pv_fcf,
            cumulative_fcf=cumulative, discount_years=t))
        nwc = next_nwc
    terminal_nopat = rev*(1+terminal_growth)*c['margins'][-1]*(1-TAX)
    terminal_fcf = terminal_nopat*(1-terminal_growth/c['roic'])
    terminal_value = terminal_fcf/(discount-terminal_growth)
    pv_terminal = terminal_value/(1+discount)**rows[-1]['discount_years']
    ev = pv+pv_terminal
    return dict(case=case, valuation_date=AS_OF.isoformat(), units='USD billions',
        discount=discount, terminal_growth=terminal_growth, terminal_roic=c['roic'],
        net_cash_assumption=net_cash, available_cash_assumption=available_cash,
        minority_value_assumption=minority_value,
        stub_year_fraction=STUB, stub_fcf=stub_cf, rows=rows, pv_explicit=pv,
        terminal_fcf=terminal_fcf, pv_terminal=pv_terminal, enterprise_value=ev,
        gross_equity_value=ev+net_cash, equity_after_assumed_nci=ev+net_cash-minority_value,
        terminal_share=pv_terminal/ev if ev > 0 else None,
        peak_cumulative_funding=-minimum,
        incremental_funding_proxy=max(0.,-minimum-available_cash),
        first_positive_fcf=next((r['year'] for r in rows if r['fcf']>0),None))

def reverse(target: float, **kwargs) -> dict:
    """Solve the 2036 revenue scaling needed to support a gross equity reference."""
    lo, hi = .01, 10.
    if not value(scale=lo, **kwargs)['gross_equity_value'] < target < value(scale=hi, **kwargs)['gross_equity_value']:
        raise ValueError('Target is outside the reverse-DCF bracket')
    for _ in range(90):
        mid = (lo+hi)/2
        if value(scale=mid, **kwargs)['gross_equity_value'] < target:
            lo = mid
        else:
            hi = mid
    result = value(scale=(lo+hi)/2, **kwargs)
    return dict(target=target, scale=(lo+hi)/2,
                revenue_2036=result['rows'][9]['revenue'],
                revenue_2041=result['rows'][-1]['revenue'],
                revenue_cagr=(result['rows'][9]['revenue']/REVENUE_2026)**.1-1,
                residual=result['gross_equity_value']-target)

def export(destination: Path) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    results = {name:value(name) for name in CASES}
    payload = dict(as_of=AS_OF.isoformat(), unit='USD billions',
        warning='Author scenarios; gross equity before minority/senior claims. Cash is assumed, not disclosed.',
        cases={name:{key:item for key,item in result.items() if key != 'rows'} for name,result in results.items()}, assumptions=CASES, arsenal2_schedule=A2,
        reverse={str(t):reverse(t) for t in [61.,100.]},
        sensitivity=[dict(discount=r,terminal_growth=g,gross_equity=value(discount=r,terminal_growth=g)['gross_equity_value'])
                     for r in [.10,.11,.12,.13,.14,.15,.16] for g in [.02,.03,.04]])
    (destination/'model-results.json').write_text(json.dumps(payload,indent=2)+'\n')
    with (destination/'forecast.csv').open('w',newline='') as f:
        writer = csv.DictWriter(f,fieldnames=['case']+list(results['Base']['rows'][0]))
        writer.writeheader()
        for name, result in results.items():
            for row in result['rows']:
                writer.writerow({'case':name,**row})
    print(json.dumps({k:{f:round(v[f],3) if isinstance(v[f],float) else v[f]
        for f in ['enterprise_value','gross_equity_value','peak_cumulative_funding','incremental_funding_proxy','first_positive_fcf','terminal_share']}
        for k,v in results.items()},indent=2))
    print('Reverse DCF:',payload['reverse'])

if __name__ == '__main__':
    export(Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parent)
