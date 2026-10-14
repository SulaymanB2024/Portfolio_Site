"""Kalshi valuation, 14 October 2026. USD billions unless a rate.
All operating drivers are author assumptions, not company guidance.
Run: python model.py. Standard library only; no network or credentials.
"""
from datetime import date
import json, math, csv
from pathlib import Path
AS_OF=date(2026,10,14)
OUT=Path(__file__).resolve().parent
ASSUMPTIONS={
 'as_of':AS_OF.isoformat(),'tax_rate':.26,'discount_rate':.13,'terminal_growth':.03,
 'terminal_roic':.20,'sales_to_capital':4.0,'net_cash_illustration':1.0,
 'starting_annual_revenue_normalization':4.,
 'stub':{'revenue_rate':4.,'ebit_margin':.38,'reinvestment_rate':.06},
 'fade_growth':[.12,.10,.08,.06,.04],
 'cases':{
 'Restricted':{'weight':.25,'start':[75,45,150,.010,.0065,.0002,.08,-.30], 'end':[150,100,700,.008,.0055,.0002,.15,.30]},
 'Base':{'weight':.50,'start':[300,70,400,.0135,.0075,.00025,.15,.42], 'end':[600,200,2000,.011,.0065,.00025,.45,.50]},
 'Breakout':{'weight':.25,'start':[380,100,700,.0145,.009,.0004,.20,.45], 'end':[1000,400,4000,.0125,.008,.00035,.90,.58]}
 },
 'driver_order':['sports_notional','other_event_notional','perps_notional','sports_net_yield','other_event_net_yield','perps_net_yield','data_and_net_interest','ebit_margin']
}
def discount_years(year): return (date(year,12,31)-AS_OF).days/365

def value_case(name, discount=None, growth=None, scale=1., sports_yield_shock=0.):
    a=ASSUMPTIONS;c=a['cases'][name];r=a['discount_rate'] if discount is None else discount;g=a['terminal_growth'] if growth is None else growth
    assert r>g and 0<=g<a['terminal_roic'] and scale>0
    rows=[];prev=a['starting_annual_revenue_normalization']
    for year in range(2027,2037):
        if year<=2031:
            f=(year-2027)/4
            # Volumes and ancillary income follow CAGR; yields/margins interpolate linearly.
            d=[c['start'][i]*(c['end'][i]/c['start'][i])**f if i in [0,1,2,6] else c['start'][i]+(c['end'][i]-c['start'][i])*f for i in range(8)]
            d[3]=max(0,d[3]+sports_yield_shock)
            revs=[d[0]*d[3],d[1]*d[4],d[2]*d[5],d[6]]
            revenue=sum(revs)*scale; margin=d[7]
        else:
            rate=a['fade_growth'][year-2032]
            revenue=prev*(1+rate);margin=c['end'][7]
            revs=[v*(1+rate) for v in rows[-1]['segment_revenues']]
            d=None
        ebit=revenue*margin;nopat=ebit-max(ebit,0)*a['tax_rate']
        reinvest=max(revenue-prev,0)/a['sales_to_capital']
        fcf=nopat-reinvest;t=discount_years(year);pv=fcf/(1+r)**t
        rows.append(dict(year=year,drivers=d,revenue=revenue,ebit_margin=margin,ebit=ebit,nopat=nopat,reinvestment=reinvest,fcf=fcf,discount_years=t,pv=pv,segment_revenues=[v*scale for v in revs] if year<=2031 else revs))
        prev=revenue
    terminal_nopat=rows[-1]['nopat']*(1+g)
    terminal_reinvestment=terminal_nopat*g/a['terminal_roic']
    terminal_fcf=terminal_nopat-terminal_reinvestment
    tv=terminal_fcf/(r-g);pvtv=tv/(1+r)**rows[-1]['discount_years']
    stub_years=discount_years(2026);s=a['stub']
    stub_rev=s['revenue_rate']*stub_years
    stub_fcf=stub_rev*(s['ebit_margin']*(1-a['tax_rate'])-s['reinvestment_rate'])
    pvstub=stub_fcf/(1+r)**stub_years
    ev=sum(z['pv'] for z in rows)+pvtv+pvstub
    return dict(case=name,weight=c['weight'],rows=rows,terminal_fcf=terminal_fcf,terminal_value=tv,pv_terminal=pvtv,pv_forecast=sum(z['pv'] for z in rows),pv_stub=pvstub,ev=ev,equity_illustration=ev+a['net_cash_illustration'],terminal_share=pvtv/ev)

def reverse_scale(target_equity=40.):
    low,high=.05,10.
    for _ in range(100):
        mid=(low+high)/2
        if value_case('Base',scale=mid)['equity_illustration']<target_equity:low=mid
        else:high=mid
    return (low+high)/2

def outputs():
    result={k:value_case(k) for k in ASSUMPTIONS['cases']}
    weighted=sum(z['weight']*z['ev'] for z in result.values())
    scale=reverse_scale()
    return dict(assumptions=ASSUMPTIONS,cases=result,weighted_ev=weighted,weighted_equity=weighted+1.,reverse_scale=scale,reverse_2031_revenue=value_case('Base',scale=scale)['rows'][4]['revenue'],sensitivity=[{'discount':r,'growth':g,'equity':value_case('Base',discount=r,growth=g)['equity_illustration']} for r in [.11,.12,.13,.14,.15] for g in [.02,.03,.04]],fee_shock_25bp=value_case('Base',sports_yield_shock=-.0025))

def validate(result):
    assert math.isclose(sum(c['weight'] for c in ASSUMPTIONS['cases'].values()),1)
    assert result['cases']['Restricted']['ev']<result['cases']['Base']['ev']<result['cases']['Breakout']['ev']
    for case in result['cases'].values():
        for row in case['rows']:
            assert math.isclose(sum(row['segment_revenues']),row['revenue'],rel_tol=1e-12)
            assert math.isclose(row['fcf'],row['nopat']-row['reinvestment'],rel_tol=1e-12)
        assert math.isclose(case['ev'],case['pv_forecast']+case['pv_terminal']+case['pv_stub'],rel_tol=1e-12)
        assert 0<case['terminal_share']<1
    assert abs(value_case('Base',scale=result['reverse_scale'])['equity_illustration']-40)<1e-8
    assert value_case('Base',discount=.14)['ev']<value_case('Base',discount=.12)['ev']
    assert result['fee_shock_25bp']['ev']<result['cases']['Base']['ev']
    assert math.isclose(.07*100*.5*(1-.5),1.75)
    return True
if __name__=='__main__':
    result=outputs();validate(result)
    (OUT/'model-output.json').write_text(json.dumps(result,indent=2)+'\n')
    (OUT/'assumptions.json').write_text(json.dumps(ASSUMPTIONS,indent=2)+'\n')
    fields=['case','year','revenue','ebit_margin','ebit','nopat','reinvestment','fcf','discount_years','pv']
    with (OUT/'forecast.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
        for name,c in result['cases'].items():
            for row in c['rows']:w.writerow({key:(name if key=='case' else row[key]) for key in fields})
    print(json.dumps({k:{'ev':v['ev'],'eq':v['equity_illustration'],'2027rev':v['rows'][0]['revenue'],'2031rev':v['rows'][4]['revenue'],'tv_share':v['terminal_share']} for k,v in result['cases'].items()},indent=2))
    print('Weighted EV/equity',result['weighted_ev'],result['weighted_equity'])
    print('Reverse scale/revenue',result['reverse_scale'],result['reverse_2031_revenue'])
    print('25bp fee shock equity',result['fee_shock_25bp']['equity_illustration'])
