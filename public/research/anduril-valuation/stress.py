"""Operating stress tests for the Anduril expectations model (2026-10-14).

The original model is preserved. These overlays isolate operating assumptions,
not statistical confidence or measured cash needs. Run: python3 stress.py [dir]
Only standard-library imports. Every default ties to model.value().
"""
from __future__ import annotations
from pathlib import Path
import csv
import json
import math
import sys
from model import value as original_value, CASES, REVENUE_2026, STUB, TAX


def value(case='Base', discount=.12, terminal_growth=.03, scale=1.,
          margin_shift=0., margin_delay=0, extra_collection_days=0.,
          arsenal2_multiplier=1., net_cash=3., minority_value=0.,
          available_cash=3., noncash_comp_ratio=0.):
    """All money in nominal USD billions.

    margin_shift phases linearly through 2036, then persists. margin_delay
    postpones the margin ramp only: revenue, ordinary investment and A2 timing
    remain unchanged; the mature margin is reached no later than 2038.
    Additional receivables equal sales * days / 365, start from zero in 2027,
    and persist beyond 2041. Their terminal investment is added to (not hidden
    inside) the original ROIC-funded reinvestment, holding other efficiency fixed.
    A2 overrun changes spending, not depreciation or tax shields: cost-risk stress,
    not a new fixed-asset ledger. The hypothetical noncash compensation addback
    affects ONLY the cash-timing proxy; economic FCF and valuation are unchanged.
    """
    inputs=[discount,terminal_growth,scale,margin_shift,extra_collection_days,
            arsenal2_multiplier,net_cash,minority_value,available_cash,noncash_comp_ratio]
    if not all(isinstance(x,(int,float)) and math.isfinite(x) for x in inputs):
        raise ValueError('Inputs must be finite numbers')
    if not isinstance(margin_delay,int) or not 0 <= margin_delay <= 2:
        raise ValueError('Margin delay must be 0, 1 or 2 years')
    if not 0 <= extra_collection_days <= 120 or not 0 <= noncash_comp_ratio <= .15:
        raise ValueError('Collection days or noncash compensation outside supported range')
    if arsenal2_multiplier < 0 or abs(margin_shift) > .10:
        raise ValueError('Invalid cost multiplier or margin change')
    base=original_value(case,discount,terminal_growth,net_cash,minority_value,scale,available_cash)
    c=CASES[case]
    if c['margins'][-1]+margin_shift <= 0:
        raise ValueError('Terminal EBIT margin must remain positive')
    pv_stub=base['stub_fcf']/(1+discount)**STUB
    pv=pv_stub
    economic_cumulative=base['stub_fcf']
    timing_cumulative=base['stub_fcf']+REVENUE_2026*STUB*noncash_comp_ratio
    economic_min=min(0.,economic_cumulative)
    timing_min=min(0.,timing_cumulative)
    previous_extra_receivables=0.
    rows=[]
    for i, old in enumerate(base['rows']):
        row=dict(old)
        progress=min((i+1)/10,1.)
        margin=c['margins'][min(9,max(0,i-margin_delay))]+margin_shift*progress
        ebit=row['revenue']*margin
        cash_tax=max(0.,ebit)*TAX
        nopat=ebit-cash_tax
        a2=row['arsenal2_capex']*arsenal2_multiplier
        raw=row['ordinary_capex']+a2-row['depreciation']+row['change_nwc']
        fade=(i-9)/5*(nopat*row['growth']/c['roic']-raw) if i>=10 else 0.
        extra_ar=row['revenue']*extra_collection_days/365
        delta_ar=extra_ar-previous_extra_receivables
        reinvestment=raw+fade+delta_ar
        fcf=nopat-reinvestment
        pv_fcf=fcf/(1+discount)**row['discount_years']
        noncash_addback=row['revenue']*noncash_comp_ratio
        economic_cumulative+=fcf
        timing_cumulative+=fcf+noncash_addback
        economic_min=min(economic_min,economic_cumulative)
        timing_min=min(timing_min,timing_cumulative)
        row.update(ebit_margin=margin,ebit=ebit,cash_tax=cash_tax,nopat=nopat,
            arsenal2_capex=a2,fade_reinvestment=fade,extra_receivables=extra_ar,
            change_extra_receivables=delta_ar,total_reinvestment=reinvestment,
            fcf=fcf,pv_fcf=pv_fcf,cumulative_fcf=economic_cumulative,
            hypothetical_noncash_addback=noncash_addback,
            cash_timing_proxy=fcf+noncash_addback,cumulative_cash_timing_proxy=timing_cumulative)
        rows.append(row)
        pv+=pv_fcf
        previous_extra_receivables=extra_ar
    terminal_nopat=rows[-1]['revenue']*(1+terminal_growth)*(c['margins'][-1]+margin_shift)*(1-TAX)
    terminal_extra_ar_investment=rows[-1]['revenue']*terminal_growth*extra_collection_days/365
    terminal_fcf=terminal_nopat*(1-terminal_growth/c['roic'])-terminal_extra_ar_investment
    pv_terminal=terminal_fcf/(discount-terminal_growth)/(1+discount)**rows[-1]['discount_years']
    ev=pv+pv_terminal
    return dict(enterprise_value=ev,gross_equity_value=ev+net_cash,
        equity_after_assumed_nci=ev+net_cash-minority_value,pv_explicit=pv,
        pv_terminal=pv_terminal,terminal_fcf=terminal_fcf,terminal_extra_ar_investment=terminal_extra_ar_investment,
        revenue_2036=rows[9]['revenue'],ebit_margin_2036=rows[9]['ebit_margin'],
        peak_economic_fcf_deficit=-economic_min,
        economic_deficit_less_assumed_liquidity=max(0.,-economic_min-available_cash),
        peak_cash_timing_proxy_deficit=-timing_min,
        cash_timing_proxy_gap=max(0.,-timing_min-available_cash),
        first_positive_economic_fcf=next((r['year'] for r in rows if r['fcf']>0),None),
        first_positive_cash_timing_proxy=next((r['year'] for r in rows if r['cash_timing_proxy']>0),None),
        stub_fcf=base['stub_fcf'],rows=rows)


def reverse(target, **kwargs):
    """Solve the bridge AFTER the explicitly assumed outside claim. Not per-share."""
    if not isinstance(target,(int,float)) or not math.isfinite(target) or target <= 0:
        raise ValueError('Positive finite target required')
    if 'scale' in kwargs:
        raise ValueError('The solver owns the revenue scale')
    lo,hi=.01,10.
    if not value(scale=lo,**kwargs)['equity_after_assumed_nci'] < target < value(scale=hi,**kwargs)['equity_after_assumed_nci']:
        raise ValueError('Target outside supported bracket')
    for _ in range(80):
        mid=(lo+hi)/2
        if value(scale=mid,**kwargs)['equity_after_assumed_nci'] < target: lo=mid
        else: hi=mid
    result=value(scale=(lo+hi)/2,**kwargs)
    return dict(target=target,scale=(lo+hi)/2,revenue_2036=result['revenue_2036'],
        revenue_cagr=(result['revenue_2036']/REVENUE_2026)**.1-1,
        residual=result['equity_after_assumed_nci']-target)


def software_share(ebit_margin, hardware_contribution=.15, software_contribution=.50, corporate_cost=.05):
    if software_contribution <= hardware_contribution:
        raise ValueError('Software contribution must exceed hardware contribution')
    share=(ebit_margin+corporate_cost-hardware_contribution)/(software_contribution-hardware_contribution)
    if not 0 <= share <= 1: raise ValueError('Requested margin is infeasible at these contributions')
    return share


def snapshot():
    base=value()
    definitions=[
        ('Base',{}),
        ('Margin ramp two years later',dict(margin_delay=2)),
        ('2036 EBIT margin 18%, phased',dict(margin_shift=-.04)),
        ('Collections 30 days slower',dict(extra_collection_days=30)),
        ('Arsenal-2 private spending +50%',dict(arsenal2_multiplier=1.5)),
        ('Combined operating stress',dict(margin_delay=2,margin_shift=-.04,extra_collection_days=30,arsenal2_multiplier=1.5)),
    ]
    stress=[]
    for name,kwargs in definitions:
        result=value(**kwargs)
        stress.append(dict(name=name,parameters=kwargs,**{k:v for k,v in result.items() if k!='rows'},
            change_enterprise_value=result['enterprise_value']-base['enterprise_value']))
    mix=[]
    for label,revenue in [('Base',base['revenue_2036']),('$61B bridge',reverse(61)['revenue_2036']),('$100B bridge',reverse(100)['revenue_2036'])]:
        for hardware in [.15,.20]:
            share=software_share(.22,hardware)
            mix.append(dict(reference=label,total_revenue=revenue,hardware_contribution=hardware,
                software_contribution=.50,corporate_cost=.05,required_software_share=share,
                required_software_revenue=revenue*share,hardware_revenue=revenue*(1-share)))
    return dict(as_of='2026-10-14',units='USD billions, nominal',
        warning='Deterministic author sensitivities, not probabilities, disclosed segment data or a liquidity forecast.',
        stress=stress,software_scale=mix,
        cash_timing=[dict(noncash_comp_ratio=p,**{k:v for k,v in value(noncash_comp_ratio=p).items() if k not in ['rows']}) for p in [0.,.02,.04]],
        net_cash_nci=[dict(net_cash=c,minority_value=n,equity=base['enterprise_value']+c-n) for c in [0.,3.,5.] for n in [0.,1.,3.]],
        reverse=[dict(margin=m,**reverse(price,margin_shift=m-.22)) for price in [61.,100.] for m in [.18,.22,.26]],
        revenue_arithmetic=dict(base_cagr=(base['revenue_2036']/REVENUE_2026)**.1-1,
            volume_cagr_with_five_percent_price_decline=((base['revenue_2036']/REVENUE_2026)**.1)/.95-1,
            growth_with_twenty_percent_more_units_and_seven_percent_lower_prices=1.20*.93-1))


def export(path):
    path=Path(path); path.mkdir(parents=True,exist_ok=True)
    data=snapshot()
    (path/'stress-results.json').write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    with (path/'operating-stress.csv').open('w',newline='',encoding='utf-8') as f:
        keys=['name','enterprise_value','gross_equity_value','change_enterprise_value','peak_economic_fcf_deficit','economic_deficit_less_assumed_liquidity']
        writer=csv.DictWriter(f,fieldnames=keys); writer.writeheader()
        writer.writerows({k:row[k] for k in keys} for row in data['stress'])
    print(json.dumps({row['name']:round(row['enterprise_value'],3) for row in data['stress']},indent=2))

if __name__=='__main__':
    export(sys.argv[1] if len(sys.argv)>1 else Path(__file__).resolve().parent)
