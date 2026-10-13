"""Independent arithmetic and native-export integrity for the three new articles."""
from pathlib import Path
from fractions import Fraction as F
from decimal import Decimal, ROUND_HALF_UP
import copy
import hashlib
import importlib.util
import json
import re
import xml.etree.ElementTree as ET
P=Path(__file__).resolve().parent
ROOT=P.parent.parents[2]
checks=0

def same(actual, expected):
 global checks
 assert abs(F(str(actual))-expected)<F(1,100000), (actual,float(expected))
 checks+=1

def load_model(company):
 s=importlib.util.spec_from_file_location(company.replace('-','_')+'_model',P/company/'model.py')
 m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

rp=json.loads((P/'ramp/inputs.json').read_text()); rr=json.loads((P/'ramp/model-results.json').read_text())
for name,p in rp['platform_cases'].items():
 r=rr['platform_cases'][name]; v=F(p['annual_card_volume'])
 credit=v*F(str(p['platform_card_proceeds_rate'])); reward=v*F(str(p['customer_reward_cost_rate'])); risk=v*F(str(p['risk_and_funding_rate']))
 retained=credit-reward-risk-F(p['account_delivery_cost']); software=F(p['annual_software_fees'])*(1-F(str(p['software_delivery_cost_rate'])))
 for key,want in [('card_proceeds',credit),('rewards',reward),('risk_and_funding',risk),('card_contribution',retained),('software_contribution',software),('combined_contribution',retained+software)]:same(r[key],want)
b=rp['buyer']; fee=F(b['paid_seats']*b['monthly_seat_price']*12+b['annual_platform_fee']); hours=F(b['weekly_hours_recovered']*b['working_weeks']); cash=hours*F(b['hour_cost'])*F(str(b['cash_capture']))
for name,avoid in b['spend_avoided_cases'].items():
 r=rr['buyer_cases'][name]
 for key,want in [('annual_fee',fee),('recovered_hours',hours),('labor_cash',cash),('recurring_benefit',cash+avoid-fee),('first_year_benefit',cash+avoid-fee-b['implementation']),('first_year_spend_requirement',max(0,fee+b['implementation']-cash))]:same(r[key],want)

fp=json.loads((P/'flock-safety/inputs.json').read_text());fr=json.loads((P/'flock-safety/model-results.json').read_text())
for name,c in fp['scenarios'].items():
 r=fr['scenarios'][name]; capital=F(fp['cohort_units']*(c['deployment_cost']+c['acquisition_cost'])); running=-capital; events=[(0,-capital)]; previous=F(fp['cohort_units']); payback=None
 for y,row in enumerate(r['rows'],1):
  units=F(fp['cohort_units'])*F(str(c['annual_unit_retention']))**(y-1)
  bill=units*c['annual_price']; cost=units*(c['annual_service_cost']+c['annual_replacement_reserve']); remove=(previous-units)*c['removal_cost']
  running+=bill-cost-remove
  events.extend([(y-1,bill-remove),(y,-cost)])
  for key,want in [('active_units',units),('collections',bill),('cash_before_initial_capital',bill-cost-remove),('cumulative_cash',running),('removal',remove)]:same(row[key],want)
  if payback is None and running>=0:payback=y
  previous=units
 pv=sum(amount/(1+F(str(fp['discount_rate'])))**time for time,amount in events)
 same(r['cash_present_value'],pv); same(r['ending_cumulative_cash'],running);assert r['payback_year']==payback

# Zero activity must retain fixed costs rather than manufacture payback.
rm=load_model('ramp');fm=load_model('flock-safety')
rconf=copy.deepcopy(rp['platform_cases']['base']);rconf['annual_card_volume']=0
assert rm.platform(rconf)['card_contribution']==-8000
assert fm.cohort(fp['scenarios']['base'],units=0)['ending_cumulative_cash']==0
assert fm.cohort(fp['scenarios']['base'],units=0)['payback_year'] is None
ret=copy.deepcopy(fp['scenarios']['base']);ret['annual_unit_retention']=0
assert fm.cohort(ret)['ending_cumulative_cash']==-120000
assert fm.cohort(ret)['payback_year'] is None
for kwargs in [{'years':True},{'units':True},{'discount':False}]:
 try:fm.cohort(fp['scenarios']['base'],**kwargs)
 except ValueError:pass
 else:raise AssertionError(f'boolean parameter accepted: {kwargs}')
short=fm.cohort(fp['scenarios']['base'],years=3)
assert short['horizon_years']==3 and len(short['rows'])==3
assert short['ending_cumulative_cash']==296100 and 'five_year_cash' not in short
one=fm.cohort(fp['scenarios']['base'],years=1)
assert one['first_year_cash']==one['ending_cumulative_cash']==-90000
for module,fn,config,key in [(rm,rm.platform,rp['platform_cases']['base'],'annual_card_volume'),(fm,fm.cohort,fp['scenarios']['base'],'annual_service_cost')]:
 for bad in [-1,float('nan'),True]:
  q=copy.deepcopy(config);q[key]=bad
  try:fn(q)
  except ValueError:pass
  else:raise AssertionError(f'accepted invalid {key}')
 original=copy.deepcopy(config);fn(config);assert config==original

manifest=json.loads((P/'startups-manifest.json').read_text());native=[]
for item in manifest:
 d=P/item['key'];a=json.loads((ROOT/item['json']).read_text());s=json.loads((d/'sources.json').read_text())
 assert item['input_sha256']==hashlib.sha256((d/'inputs.json').read_bytes()).hexdigest()
 ids=[x['id'] for x in s];assert len(ids)==len(set(ids))
 assert all(x['lastVerified']=='2026-10-13' and x['href'].startswith('https://') for x in s)
 assert all(all(k in x for k in ['id','label','href','publisher','type','lastVerified','note']) for x in s)
 urls=set(re.findall(r'\]\((https://[^)]+)\)',(d/'article-draft.md').read_text()));assert urls<={x['href'] for x in s},urls-{x['href'] for x in s}
 assert not any('[FIGURE:' in x.get('markdown','') for sec in a['markdownSections'] for x in sec['blocks'])
 table_ids=[t['id'] for t in a['tables']];block_ids=[b['tableId'] for sec in a['markdownSections'] for b in sec['blocks'] if b['kind']=='table'];assert table_ids==block_ids
 assert len(table_ids)==item['tables'];assert sum(len(sec.get('figures',[])) for sec in a['markdownSections'])==item['figures']
 assert 'Scope' in (d/'article.md').read_text();assert len(re.findall(r'\bI\b',(d/'article-draft.md').read_text()))>=10
 for sec in a['markdownSections']:
  for f in sec.get('figures',[]):
   path=P.parent/'figures'/Path(f['src']).name; ET.parse(path)
   assert path.with_suffix('.png').exists()
   assert (d/('../../figures/'+path.with_suffix('.png').name)).resolve().exists()
 native.append({'slug':a['slug'],'tables':len(table_ids),'figures':item['figures'],'sources':len(s)})
# Monetary display ties round consistently between manuscript and figure.
el=json.loads((P/'elevenlabs/model-results.json').read_text());poor=next(x for x in el['audio'] if x['id']=='bad-fit')
assert Decimal(str(poor['loadedCostPerAcceptedMinute'])).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)==Decimal('6.18')
# The authored native tables must match regenerated model results.
def money(value, places=0):
 v=Decimal(str(value)); step=Decimal('1') if places==0 else Decimal('0.01')
 v=v.quantize(step,rounding=ROUND_HALF_UP)
 return ('−' if v<0 else '')+'$'+format(abs(v),f',.{places}f')
def table(company,index):
 item=next(x for x in manifest if x['key']==company)
 return json.loads((ROOT/item['json']).read_text())['tables'][index]['rows']
def row_values(rows,label):return next(x[1:] for x in rows if x[0]==label)
rt=table('ramp',0)
assert row_values(rt,'Retained card contribution after account delivery')==[money(r['card_contribution']) for r in rr['platform_cases'].values()]
assert row_values(rt,'Software contribution after modeled delivery')==[money(r['software_contribution']) for r in rr['platform_cases'].values()]
assert row_values(rt,'Combined contribution before acquisition/corporate costs')==[money(r['combined_contribution']) for r in rr['platform_cases'].values()]
rt=table('ramp',1)
for label,key in [('Annual software bill','annual_fee'),('Captured labor cash','labor_cash'),('Incremental avoided purchases','avoided_spend'),('First-year net benefit','first_year_benefit'),('Recurring net benefit','recurring_benefit')]:
 assert row_values(rt,label)==[money(r[key]) for r in rr['buyer_cases'].values()]
ft=table('flock-safety',1)
for label,key in [('Opening annual subscription run-rate','opening_arr'),('First-year cumulative cash','first_year_cash'),('Five-year cumulative cash','ending_cumulative_cash'),('Cash present value at assumed 12% discount rate','cash_present_value')]:
 assert row_values(ft,label)==[money(r[key]) for r in fr['scenarios'].values()]
assert row_values(ft,'Cumulative payback year')==[str(r['payback_year']) for r in fr['scenarios'].values()]
et=table('elevenlabs',1)
for row,r in zip(et,el['audio'],strict=True):
 assert row[3:]==[money(r['loadedCostPerAcceptedMinute'],2),money(r['monthlyTimeValueAdvantage']),money(r['firstYearNetCashBenefit'])]
et=table('elevenlabs',2)
for row,r in zip(et,el['agents'],strict=True):
 assert row[3:]==[money(r['monthlyTimeValueAdvantage']),money(r['monthlyNetCashBenefit']),money(r['firstYearNetCashBenefit'])]
assert '$6.18' in (P.parent/'figures/elevenlabs-accepted-audio-cost.svg').read_text()

report={'verified':'2026-10-13','independent_ramp_flock_arithmetic_checks':checks,'edge_cases':'zero activity/retention, invalid inputs including boolean API parameters, one/three-year horizons and preserved inputs passed','native_exports':native,'table_model_parity':'All principal monetary outputs and payback years match regenerated results','table_total':sum(x['tables'] for x in native),'figure_total':sum(x['figures'] for x in native),'elevenlabs_verifier':'Run verify_model.py separately; this receipt does not claim its execution.'}
(P/'startups-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{checks} independent Ramp/Flock arithmetic checks; edge cases; three exports; seven tables; four figures; sources and portable references passed')
