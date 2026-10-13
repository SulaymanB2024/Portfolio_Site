"""Hypothetical cohort cash, with explicit subscription collection timing."""
from pathlib import Path
import copy
import hashlib
import json
import math

HERE = Path(__file__).resolve().parent

def cohort(config, units=100, years=5, discount=0.12):
    c = copy.deepcopy(config)
    if not isinstance(years, int) or not 1 <= years <= 30:
        raise ValueError("years must be an integer from 1 to 30")
    for k, v in c.items():
        if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v) or v < 0:
            raise ValueError(f"invalid {k}")
    if not 0 <= c['annual_unit_retention'] <= 1 or units < 0 or not math.isfinite(units) or discount < 0 or not math.isfinite(discount):
        raise ValueError("invalid cohort, retention or discount")
    capital = units * (c['deployment_cost'] + c['acquisition_cost'])
    cumulative = -capital
    pv = -capital
    previous = units
    rows = []
    for year in range(1, years + 1):
        active = units * c['annual_unit_retention'] ** (year - 1)
        retired = previous - active
        collections = active * c['annual_price']
        service = active * c['annual_service_cost']
        reserve = active * c['annual_replacement_reserve']
        removal = retired * c['removal_cost']
        annual_cash = collections - service - reserve - removal
        cumulative += annual_cash
        pv += (collections - removal) / (1 + discount) ** (year - 1) - (service + reserve) / (1 + discount) ** year
        rows.append(dict(year=year, active_units=active, annual_run_rate=collections,
                         collections=collections, service=service, replacement_reserve=reserve,
                         removal=removal, cash_before_initial_capital=annual_cash,
                         cumulative_cash=cumulative))
        previous = active
    return dict(initial_capital=capital, opening_arr=units*c['annual_price'],
                first_year_cash=cumulative if years == 1 else rows[0]['cumulative_cash'],
                payback_year=next((r['year'] for r in rows if r['cumulative_cash'] >= 0), None),
                five_year_cash=cumulative, cash_present_value=pv, rows=rows)

def results():
    raw = (HERE/'inputs.json').read_bytes()
    p = json.loads(raw)
    return {'status':p['status'], 'input_sha256':hashlib.sha256(raw).hexdigest(),
            'timing':p['timing'], 'scenarios':{name:cohort(c,p['cohort_units'],p['years'],p['discount_rate']) for name,c in p['scenarios'].items()}}

if __name__ == '__main__':
    output = results()
    (HERE/'model-results.json').write_text(json.dumps(output,indent=2)+'\n')
    for name,r in output['scenarios'].items():
        print(f"{name}: year-one cash {r['first_year_cash']:,.0f}; five-year cash {r['five_year_cash']:,.0f}; PV {r['cash_present_value']:,.0f}; payback year {r['payback_year']}")
