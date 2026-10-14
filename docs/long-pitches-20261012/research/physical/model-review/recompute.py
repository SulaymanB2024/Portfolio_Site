"""Independent financial/model/evaluator review. No root forecast imports.

Output stays in this review folder. Synthetic evaluator observations are expressly
test fixtures, never measured prices, investment forecasts or future performance.
"""
from pathlib import Path
from datetime import date
import copy, gzip, hashlib, html, json, math, re, runpy, sys

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
sys.dont_write_bytecode=True

def digest(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()

targets=['models.py','build_inputs.py','inputs.json','outputs/model-results.json','evaluate_forecasts.py']
pins={}
for name in targets:
    raw=(ROOT/name).read_bytes(); pins[name]={'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw)}
    dest=HERE/'snapshots'/name; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_bytes(raw)

inp=json.loads((HERE/'snapshots/inputs.json').read_text())
actual=json.loads((HERE/'snapshots/outputs/model-results.json').read_text())
soft=json.loads((ROOT/'research/software/inputs.json').read_text())
phys=json.loads((ROOT/'research/physical/evidence.json').read_text())
checks=[]; failures=[]; concerns=[]

def close(a,b):return math.isclose(float(a),float(b),rel_tol=1e-11,abs_tol=1e-7)
def check(label,got,expected):
    ok=close(got,expected) if isinstance(expected,(int,float)) else got==expected
    rec={'check':label,'observed':got,'independent_expected':expected,'pass':ok}
    checks.append(rec)
    if not ok:failures.append(rec)

fact_cache={}
def source_facts(sid):
    if sid in fact_cache:return fact_cache[sid]
    if sid.startswith('CROX'):
        raw=gzip.decompress((ROOT/'research/physical/sources'/f'{sid}.html.gz').read_bytes()).decode()
    else:raw=(ROOT/'research/software/sources'/f'{sid}.html').read_text()
    contexts={}
    for ident,body in re.findall(r'<xbrli:context\b[^>]*id="([^"]+)"[^>]*>(.*?)</xbrli:context>',raw,re.S|re.I):
        start=re.search(r'<xbrli:startDate>(.*?)</xbrli:startDate>',body,re.I)
        end=re.search(r'<xbrli:endDate>(.*?)</xbrli:endDate>',body,re.I)
        instant=re.search(r'<xbrli:instant>(.*?)</xbrli:instant>',body,re.I)
        if end or instant:contexts[ident]={'start':start.group(1) if start else None,
             'end':end.group(1) if end else instant.group(1),'dimensioned':bool(re.search(r'<xbrli:segment|<xbrli:scenario',body,re.I))}
    fs=[]
    for attrs,body in re.findall(r'<ix:nonFraction\b([^>]*)>(.*?)</ix:nonFraction>',raw,re.S|re.I):
        a={k.lower():v for k,v in re.findall(r'([\w:]+)="([^"]*)"',attrs)}
        if a.get('contextref') not in contexts:continue
        val=html.unescape(re.sub(r'<[^>]+>','',body)).replace(',','').strip()
        try:amount=float(val)*10**int(a.get('scale',0))
        except (ValueError,OverflowError):continue
        if a.get('sign')=='-':amount=-amount
        fs.append({'concept':a.get('name'),'amount':amount,'context':a['contextref'],**contexts[a['contextref']]})
    fact_cache[sid]=fs; return fs

source_checks=[]
price_map={b['symbol']:b['close'] for b in json.loads((ROOT/'prices-20261012.json').read_text())['bars']}
check('Benchmark frozen entry close',inp['benchmark']['entry_close'],price_map['SPY'])
names={
 'revenue':['us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax','us-gaap:Revenues','us-gaap:SalesRevenueNet'],
 'net_income':['us-gaap:NetIncomeLoss','us-gaap:ProfitLoss'],
 'cfo':['us-gaap:NetCashProvidedByUsedInOperatingActivities'],
 'capex':['us-gaap:PaymentsToAcquirePropertyPlantAndEquipment','us-gaap:PaymentsToAcquireProductiveAssets'],
 'sbc':['us-gaap:ShareBasedCompensation'],
 'buybacks':['us-gaap:PaymentsForRepurchaseOfCommonStock','us-gaap:PaymentsForRepurchaseOfEquity'],
}

independent={}
for c in inp['companies']:
    sym=c['symbol']
    check(f'{sym} frozen entry close',c['entry_close'],price_map[sym])
    if sym=='CROX':
        src=phys['companies'][sym]; records=[src['periods'][k] for k in ['FY2025','H1_2025','H1_2026']]
        primitive=[{'revenue':p['revenue'],'net_income':p['net_income_common'],'cfo':p['cfo'],'capex':p['capex_cash_outflow'],
                    'sbc':p['sbc_cash_flow_addback'],'buybacks':p['repurchase_cash_outflow']} for p in records]
        ends=[p['period_end'] for p in records]; ids=['CROX-K25','CROX-Q226','CROX-Q226']
        normalization=600-(primitive[0]['cfo']+primitive[2]['cfo']-primitive[1]['cfo']-primitive[0]['capex']-primitive[2]['capex']+primitive[1]['capex']-primitive[0]['sbc']-primitive[2]['sbc']+primitive[1]['sbc'])
    else:
        src=soft[sym]; records=[src[k] for k in ['FY2025','YTD2025','YTD2026']]
        primitive=[{'revenue':p['revenue'],'net_income':p['net_income'],'cfo':p['cfo'],'capex':p['capex'],
                    'sbc':p['sbc_cfo'],'buybacks':p['buyback_cash']} for p in records]
        annual_end={'ADBE':'2025-11-28','PYPL':'2025-12-31','EXPE':'2025-12-31'}[sym]
        old_end={'ADBE':'2025-08-29','PYPL':'2025-06-30','EXPE':'2025-06-30'}[sym]
        ends=[annual_end,old_end,c['ttm_period_end']]; ids=[src['annual_source'],src['interim_source'],src['interim_source']]
        normalization=0
        if sym=='PYPL':
            capitalized=records[0]['sbc_capitalized']+records[2]['sbc_capitalized']-records[1]['sbc_capitalized']
            net_loans=[p['retained_loan_originations_investing']-p['retained_loan_repayments_sales_investing'] for p in records]
            retained_credit=net_loans[0]+net_loans[2]-net_loans[1]; normalization=-capitalized-retained_credit
            check('PYPL capitalized SBC normalization',-c['cash_normalizations'][0]['amount'],capitalized)
            check('PYPL retained loan investing normalization',-c['cash_normalizations'][1]['amount'],retained_credit)
        if sym=='EXPE':
            cyc=[p['deferred_merchant_bookings_cash_change']+p['merchant_payables_cash_change']+p['accounts_receivable_cash_change'] for p in records]
            normalization=-(cyc[0]+cyc[2]-cyc[1])
            eq=[p['sbc_equity_book']-p['sbc_cfo'] for p in records]
            check('EXPE equity-book SBC extra sensitivity',c['equity_sbc_sensitivity_extra'],eq[0]+eq[2]-eq[1])
    for p,label,end,sid in zip(primitive,['annual_previous','interim_previous','interim_current'],ends,ids):
        for key,expected in p.items():
            check(f'{sym} binding {label} {key}',c['reported_cash'][label][key],expected)
            matched=[f for f in source_facts(sid) if not f['dimensioned'] and f['end']==end and f['concept'] in names[key] and close(f['amount'],expected*1e6)]
            rec={'symbol':sym,'period':label,'field':key,'source':sid,'end':end,'expected_usd':expected*1e6,'pass':bool(matched)}
            if matched:rec.update({'context':matched[0]['context'],'source_start':matched[0]['start'],'concept':matched[0]['concept']})
            source_checks.append(rec)
    if sym in ['PYPL','EXPE']:
        extra_fields=['sbc_capitalized','retained_loan_originations_investing','retained_loan_repayments_sales_investing'] if sym=='PYPL' else ['deferred_merchant_bookings_cash_change','merchant_payables_cash_change','accounts_receivable_cash_change','sbc_equity_book']
        for record,label,end,sid in zip(records,['annual_previous','interim_previous','interim_current'],ends,ids):
            for field in extra_fields:
                expected=record[field]*1e6
                candidates=[f for f in source_facts(sid) if not f['dimensioned'] and f['end']==end and close(abs(f['amount']),abs(expected)) and re.search('compensation|loan|credit|merchant|receivable',f['concept'],re.I)]
                rec={'symbol':sym,'period':label,'field':field,'source':sid,'end':end,'expected_cash_statement_usd':expected,'pass':bool(candidates),
                     'validation':'Magnitude and relevant inline-XBRL concept. Cash-flow orientation follows the readable statement; taxonomy sign can encode increase rather than cash outflow.'}
                if candidates:rec.update({'concept':candidates[0]['concept'],'source_start':candidates[0]['start'],'context':candidates[0]['context'],'xbrl_amount':candidates[0]['amount']})
                source_checks.append(rec)
    calc={k:primitive[0][k]+primitive[2][k]-primitive[1][k] for k in primitive[0]}
    calc['fcf']=calc['cfo']-calc['capex']; calc['reported_cash_less_sbc_proxy']=calc['fcf']-calc['sbc']
    calc['owner_cash_proxy']=calc['reported_cash_less_sbc_proxy']+normalization
    calc['estimated_equity_value']=c['entry_close']*c['latest_disclosed_shares_m']
    calc['owner_cash_yield']=calc['owner_cash_proxy']/calc['estimated_equity_value']
    calc['entry_owner_cash_multiple']=calc['estimated_equity_value']/calc['owner_cash_proxy']
    for k,v in calc.items():check(f'{sym} TTM {k}',actual['companies'][sym]['ttm'][k],v)
    check(f'{sym} segment anchors sum to TTM revenue',sum(c['revenue_anchors'].values()),calc['revenue'])
    fs=source_facts(ids[-1]); cover=[f for f in fs if f['end']==c['share_count_date'] and f['concept']=='dei:EntityCommonStockSharesOutstanding']
    uniq={(f['context'],f['amount']):f for f in cover}; cover_total=sum(f['amount'] for f in uniq.values())/1e6
    check(f'{sym} cover share count/date',c['latest_disclosed_shares_m'],cover_total)
    independent[sym]={'ttm':calc,'scenarios':{},'share_count_date':c['share_count_date'],'balance_period_end':c['ttm_period_end']}
    for s in c['scenarios']:
        state=dict(c['revenue_anchors']); shares=c['latest_disclosed_shares_m']; years=[]
        for i in range(2):
            for seg in state:state[seg]=state[seg]*(1+s['segment_growth'][seg][i])
            revenue=sum(state.values()); owner=revenue*s['owner_cash_margin'][i]
            dividend=shares*s['dividend_per_share'][i]; commitment=s['cash_commitments'][i]
            funds=max(0,owner-dividend-commitment); intended=shares*s['desired_net_share_retirement'][i]*s['average_repurchase_price'][i]
            spend=min(funds,intended); end_shares=shares-spend/s['average_repurchase_price'][i]
            y={'revenue':revenue,'owner_cash':owner,'opening_shares_m':shares,'ending_shares_m':end_shares,
               'net_buyback_spend':spend,'dividend_cash_budget':dividend,'cash_commitments':commitment,
               'sbc_replacement_proxy':revenue*s['sbc_ratio'], 'cash_retained_after_allocations':owner-dividend-commitment-spend,
               'cash_shortfall_before_buybacks':max(0,dividend+commitment-owner)}
            years.append(y); shares=end_shares
        cashps=years[-1]['owner_cash']/shares; price=cashps*s['terminal_owner_cash_multiple']; required=c['entry_close']*1.21*shares/s['terminal_owner_cash_multiple']
        out={'years':years,'ending_owner_cash_per_share':cashps,'terminal_price':price,'rounded_price_forecast':math.floor(price/5+.5)*5,
             'cash_required_for_10_percent_annual_price_return':required,'fixed_entry_multiple_terminal_price':cashps*calc['entry_owner_cash_multiple'],
             'price_return':price/c['entry_close']-1,'annualized_price_return':math.sqrt(price/c['entry_close'])-1,
             'total_net_share_retirement_percent':(1-shares/c['latest_disclosed_shares_m'])*100}
        observed=next(v for v in actual['companies'][sym]['scenarios'] if v['name']==s['name'])
        for i,y in enumerate(years):
            for k,v in y.items():check(f'{sym} {s["name"]} year{i+1} {k}',observed['years'][i][k],v)
            check(f'{sym} {s["name"]} year{i+1} cash-constrained spending',
                  y['net_buyback_spend']<=max(0,y['owner_cash']-y['dividend_cash_budget']-y['cash_commitments'])+1e-7,True)
            if y['cash_shortfall_before_buybacks']==0:
                gross=y['net_buyback_spend']+y['sbc_replacement_proxy']+y['dividend_cash_budget']+y['cash_commitments']
                check(f'{sym} {s["name"]} year{i+1} gross budget fits pre-SBC proxy',gross<=y['owner_cash']+y['sbc_replacement_proxy']+1e-7,True)
        for k,v in out.items():
            if k!='years':check(f'{sym} {s["name"]} {k}',observed[k],v)
        independent[sym]['scenarios'][s['name']]=out

crox=next(c for c in inp['companies'] if c['symbol']=='CROX'); base=next(s for s in crox['scenarios'] if s['name']=='Base')
stress=actual['companies']['CROX']['cash_stress']; yr1=independent['CROX']['scenarios']['Base']['years'][0]
shortfall=150+600-yr1['owner_cash']; june_cash=phys['companies']['CROX']['latest_balance']['cash_unrestricted']
check('CROX base annual debt plus protected tax budget',base['cash_commitments'],[250,250])
check('CROX tax stress replaces protected year1 budget',crox['additional_cash_stress']['additional_commitments'],[500,0])
check('CROX stress additional commitment',stress['years'][0]['cash_commitments'],750)
check('CROX stress first-year shortfall',stress['years'][0]['cash_shortfall_before_buybacks'],shortfall)
check('CROX stress no first-year net buybacks',stress['years'][0]['net_buyback_spend'],0)
check('CROX stress year1 shares unchanged',stress['years'][0]['ending_shares_m'],crox['latest_disclosed_shares_m'])
year2=independent['CROX']['scenarios']['Base']['years'][1]
stress_retired=min(crox['latest_disclosed_shares_m']*base['desired_net_share_retirement'][1],(year2['owner_cash']-base['cash_commitments'][1])/base['average_repurchase_price'][1])
stress_shares=crox['latest_disclosed_shares_m']-stress_retired
check('CROX stress year2 shares',stress['years'][1]['ending_shares_m'],stress_shares)
check('CROX stress terminal price',stress['terminal_price'],year2['owner_cash']/stress_shares*11)
funding={'required_cash_use_million':shortfall,'june_historical_unrestricted_cash_million':june_cash,
         'hypothetical_june_cash_remaining_million':june_cash-shortfall,
         'status':'Not a current cash balance or a fully funded forecast. Conditional historical reference only; no minimum operating cash or interim cash changes asserted.'}

opening2=independent['CROX']['scenarios']['Base']['years'][1]['opening_shares_m']; target=crox['entry_close']*1.21
coupled_cash=target*(opening2+base['cash_commitments'][1]/165)/(11+target/165)
concerns.append({'severity':'interpretation','topic':'reverse cash hurdle','reported_conditional_cash_million':independent['CROX']['scenarios']['Base']['cash_required_for_10_percent_annual_price_return'],
 'cash_million_when_recomputing_second_year_cash_funded_buybacks':coupled_cash,
 'correction':'Legacy conditional field holds terminal shares fixed. Root added a coupled_reverse diagnostic for publication; independently verified below.'})

# Independent closed-form reverse underwriting. ADBE/PYPL/EXPE desired share
# reduction remains fully funded at the hurdle. CROX budgets bind both years,
# permitting a closed-form solution rather than importing root binary search.
for c in inp['companies']:
    sym=c['symbol']; b=next(s for s in c['scenarios'] if s['name']=='Base')
    ib=independent[sym]['scenarios']['Base']; y1,y2=ib['years']; target=c['entry_close']*1.21
    if sym=='CROX':
        s0=c['latest_disclosed_shares_m']; a1,a2=b['average_repurchase_price']; q1,q2=b['cash_commitments']
        c1,c2=y1['owner_cash'],y2['owner_cash']; m=b['terminal_owner_cash_multiple']
        scale=target*(s0+q1/a1+q2/a2)/(m*c2+target*(c1/a1+c2/a2))
    else:scale=ib['cash_required_for_10_percent_annual_price_return']/y2['owner_cash']
    start=c['latest_disclosed_shares_m']; reverse_years=[]
    for i,y in enumerate([y1,y2]):
        cash=y['owner_cash']*scale; available=max(0,cash-start*b['dividend_per_share'][i]-b['cash_commitments'][i])
        desired=start*b['desired_net_share_retirement'][i]*b['average_repurchase_price'][i]
        spend=min(available,desired); end=start-spend/b['average_repurchase_price'][i]
        reverse_years.append({'owner_cash':cash,'shares':end,'funds':available,'desired':desired,'spent':spend});start=end
    reverse_price=reverse_years[-1]['owner_cash']/start*b['terminal_owner_cash_multiple']
    cr=actual['companies'][sym]['coupled_reverse']
    check(f'{sym} coupled reverse hits1.21 entry',reverse_price,target)
    check(f'{sym} coupled reverse cash',cr['year2_owner_cash_required'],reverse_years[-1]['owner_cash'])
    check(f'{sym} coupled reverse shares',cr['ending_shares_m'],start)
    check(f'{sym} coupled reverse anchor change',cr['cash_change_vs_underwriting_anchor'],reverse_years[-1]['owner_cash']/independent[sym]['ttm']['owner_cash_proxy']-1)
    if sym=='CROX':
        check('CROX reverse year1 cash constraint binds',reverse_years[0]['spent'],reverse_years[0]['funds'])
        check('CROX reverse year2 cash constraint binds',reverse_years[1]['spent'],reverse_years[1]['funds'])
    else:
        check(f'{sym} reverse desired shares affordable year1',reverse_years[0]['spent'],reverse_years[0]['desired'])
        check(f'{sym} reverse desired shares affordable year2',reverse_years[1]['spent'],reverse_years[1]['desired'])
    independent[sym]['coupled_reverse_independent']={'scale':scale,'year2_owner_cash_required':reverse_years[-1]['owner_cash'],
        'ending_shares_m':start,'terminal_price':reverse_price,'years':reverse_years,
        'method':'Closed-form from cash-funded share equation for CROX; fixed fully funded desired-share path for other3, then independently checked funding.'}

evaluator=runpy.run_path(str(HERE/'snapshots/evaluate_forecasts.py'),run_name='reviewed_evaluator')['evaluate']
fixture_registry={'version':1,'evaluation_date':'2028-10-12','benchmark':{'symbol':'SPY','entry_close':10},
 'predictions':[{'symbol':'TEST_SPLIT','entry_close':100,'central_price_forecast':150},
                {'symbol':'TEST_DELIST','entry_close':200,'central_price_forecast':240}]}
fixture_observed={'trading_date':'2028-10-12','corporate_actions_reconciled':True,'prices':{
 'TEST_SPLIT':{'close':60,'shares_per_entry_share':2,'cash_distributions_per_entry_share':3},
 'TEST_DELIST':{'close':0,'shares_per_entry_share':1,'cash_distributions_per_entry_share':0},
 'SPY':{'close':11,'shares_per_entry_share':1,'cash_distributions_per_entry_share':.2}}}
(HERE/'synthetic-registry.json').write_text(json.dumps({'TEST_FIXTURE_ONLY':True,**fixture_registry},indent=2)+'\n')
(HERE/'synthetic-observations.json').write_text(json.dumps({'TEST_FIXTURE_ONLY':True,**fixture_observed},indent=2)+'\n')
synthetic=[]
def synth(name,observed=None,registry=None,should_reject=False,predicate=None):
    try:
        value=evaluator(registry or fixture_registry,observed or fixture_observed)
        ok=not should_reject and (predicate(value) if predicate else True)
        rec={'name':name,'status':'returned','pass':ok}
    except Exception as exc:
        ok=should_reject and isinstance(exc,ValueError); rec={'name':name,'status':'rejected','exception':type(exc).__name__,'error':str(exc),'pass':ok}
    synthetic.append(rec)
    if not ok:failures.append({'check':'synthetic evaluator: '+name,**rec})

synth('2-for-1 split uses original-share value',predicate=lambda v:close(v['results'][0]['realized_equivalent_price_original_share_basis'],120) and close(v['results'][0]['realized_price_return'],.2) and close(v['results'][0]['excess_cash_return_vs_spy_without_reinvestment'],.11))
synth('delisting at zero remains in denominator',predicate=lambda v:v['summary']['count']==2 and close(v['results'][1]['realized_price_return'],-1) and not v['results'][1]['long_direction_succeeded'] and close(v['summary']['mean_absolute_price_error_as_fraction_of_entry'],.75))
q=copy.deepcopy(fixture_observed); del q['prices']['TEST_DELIST']; synth('missing company rejected',q,should_reject=True)
q=copy.deepcopy(fixture_observed); del q['prices']['TEST_DELIST']['cash_distributions_per_entry_share']; synth('incomplete dividend data keeps all price results and omits all cash returns',q,predicate=lambda v:v['summary']['count']==2 and not v['cash_distributions_complete'] and all('realized_cash_return_without_reinvestment' not in r for r in v['results']))
for dt in ['2028-10-11','2028-10-13','2030-10-12']:
    q=copy.deepcopy(fixture_observed);q['trading_date']=dt;synth('fixed date rejects '+dt,q,should_reject=True)
for val in [float('nan'),float('inf'),-1,True]:
    q=copy.deepcopy(fixture_observed);q['prices']['TEST_SPLIT']['cash_distributions_per_entry_share']=val;synth('invalid distribution '+str(val),q,should_reject=True)
for val in [0,float('nan'),float('inf'),True]:
    r=copy.deepcopy(fixture_registry);r['predictions'][0]['entry_close']=val;synth('invalid entry '+str(val),registry=r,should_reject=True)
q=copy.deepcopy(fixture_observed);q['corporate_actions_reconciled']=False;synth('unreconciled actions rejected',q,should_reject=True)
r=copy.deepcopy(fixture_registry);r['predictions'].append(copy.deepcopy(r['predictions'][0]));synth('duplicate forecast symbol rejected',registry=r,should_reject=True)

source_failures=[r for r in source_checks if not r['pass']]
report={'review_date':'2026-10-13','coverage':{'root_files_pinned':pins,'source_financial_fields_checked':len(source_checks),
 'source_financial_fields_passed':len(source_checks)-len(source_failures),'company_ttm_coverage':'All4 selected companies',
 'scenario_coverage':'All12 bear/base/bull paths and cash constraints, plus Crocs additional cash stress. Growth/multiple grid not fully recomputed.',
 'evaluator_coverage':'Explicit synthetic split, zero delisting, missing company, incomplete dividend data, horizon and invalid numeric inputs. No actual future outcome claimed.'},
 'primitive_source_checks':source_checks,'financial_arithmetic_checks':checks,'independent_results':independent,
 'crocs_stress_funding':funding,'interpretation_concerns':concerns,'synthetic_evaluator_checks':synthetic,
 'arithmetic_failures':failures,'source_failures':source_failures,
 'status':'passed_with_interpretation_limits' if not failures and not source_failures else 'needs_review',
 'still_matches_root':{name:digest(ROOT/name)==pin['sha256'] for name,pin in pins.items()}}
(HERE/'verification.json').write_text(json.dumps(report,indent=2,allow_nan=False)+'\n')
print(json.dumps({'status':report['status'],'source_checks':len(source_checks),'source_failures':source_failures,
 'arithmetic_checks':len(checks),'arithmetic_failures':failures,'synthetic_checks':len(synthetic),'crocs_stress_funding':funding,
 'reverse_hurdle':concerns,'root_files_still_match':report['still_matches_root']},indent=2,allow_nan=False))
