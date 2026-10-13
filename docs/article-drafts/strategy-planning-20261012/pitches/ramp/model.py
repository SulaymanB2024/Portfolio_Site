"""Declared account and buyer bridges; no network or company margin inference."""
from pathlib import Path
import copy
import hashlib
import json
import math
HERE=Path(__file__).resolve().parent

def platform(config):
    p=copy.deepcopy(config)
    for k,v in p.items():
        if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or v<0:
            raise ValueError(f'invalid {k}')
        if k.endswith('_rate') and v>1: raise ValueError(f'invalid {k}')
    gross=p['annual_card_volume']*p['platform_card_proceeds_rate']
    rewards=p['annual_card_volume']*p['customer_reward_cost_rate']
    risk=p['annual_card_volume']*p['risk_and_funding_rate']
    retained=gross-rewards-risk
    software=p['annual_software_fees']*(1-p['software_delivery_cost_rate'])
    return dict(card_proceeds=gross,rewards=rewards,risk_and_funding=risk,retained_before_account_delivery=retained,
                card_contribution=retained-p['account_delivery_cost'],software_contribution=software,
                combined_contribution=retained-p['account_delivery_cost']+software,
                retained_card_rate=p['platform_card_proceeds_rate']-p['customer_reward_cost_rate']-p['risk_and_funding_rate'])

def buyer(config, avoided):
    p=copy.deepcopy(config)
    numeric={k:v for k,v in p.items() if k!='spend_avoided_cases'}
    if any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or v<0 for v in [*numeric.values(),avoided]) or p['cash_capture']>1:
        raise ValueError('invalid buyer inputs')
    seat_cost=p['paid_seats']*p['monthly_seat_price']*12
    fee=seat_cost+p['annual_platform_fee']
    hours=p['weekly_hours_recovered']*p['working_weeks']
    labor=hours*p['hour_cost']*p['cash_capture']
    return dict(seat_cost=seat_cost,annual_fee=fee,recovered_hours=hours,labor_cash=labor,avoided_spend=avoided,
                recurring_benefit=labor+avoided-fee,first_year_benefit=labor+avoided-fee-p['implementation'],
                first_year_spend_requirement=max(0,fee+p['implementation']-labor),
                recurring_spend_requirement=max(0,fee-labor))

def results():
    raw=(HERE/'inputs.json').read_bytes(); p=json.loads(raw)
    return dict(status=p['status'],input_sha256=hashlib.sha256(raw).hexdigest(),boundary=p['boundary'],
                platform_cases={k:platform(v) for k,v in p['platform_cases'].items()},
                buyer_cases={k:buyer(p['buyer'],v) for k,v in p['buyer']['spend_avoided_cases'].items()})

if __name__=='__main__':
    r=results(); (HERE/'model-results.json').write_text(json.dumps(r,indent=2)+'\n')
    print(json.dumps({'platform':{k:v['combined_contribution'] for k,v in r['platform_cases'].items()},'buyer':{k:v['first_year_benefit'] for k,v in r['buyer_cases'].items()}},indent=2))
