"""Independent input check against undimensioned inline-XBRL source facts."""
from pathlib import Path
import gzip, html, json, re

ROOT=Path(__file__).resolve().parent
e=json.loads((ROOT/'evidence.json').read_text())

def facts(sid):
    raw=gzip.decompress((ROOT/'sources'/f'{sid}.html.gz').read_bytes()).decode('utf-8')
    contexts={}
    for ident,body in re.findall(r'<xbrli:context\b[^>]*id="([^"]+)"[^>]*>(.*?)</xbrli:context>',raw,re.S|re.I):
        if re.search(r'<xbrli:segment|<xbrli:scenario',body,re.I): continue
        start=re.search(r'<xbrli:startDate>(.*?)</xbrli:startDate>',body,re.I)
        end=re.search(r'<xbrli:endDate>(.*?)</xbrli:endDate>',body,re.I)
        if start and end: contexts[ident]=(start.group(1),end.group(1))
    out=[]
    for attrs,body in re.findall(r'<ix:nonFraction\b([^>]*)>(.*?)</ix:nonFraction>',raw,re.S|re.I):
        a={k.lower():v for k,v in re.findall(r'([\w:]+)="([^"]*)"',attrs)}
        if a.get('contextref') not in contexts:continue
        val=html.unescape(re.sub(r'<[^>]+>','',body)).replace(',','').strip()
        try: amount=float(val)*10**int(a.get('scale',0))
        except (ValueError,OverflowError):continue
        if a.get('sign')=='-':amount=-amount
        out.append({'name':a.get('name'),'period':contexts[a['contextref']],'amount_usd':amount,'context':a['contextref']})
    return out

fields={
 'net_income_consolidated':['us-gaap:NetIncomeLoss','us-gaap:ProfitLoss'],
 'cfo':['us-gaap:NetCashProvidedByUsedInOperatingActivities'],
 'capex_cash_outflow':['us-gaap:PaymentsToAcquirePropertyPlantAndEquipment','us-gaap:PaymentsToAcquireProductiveAssets'],
 'sbc_cash_flow_addback':['us-gaap:ShareBasedCompensation'],
 'repurchase_cash_outflow':['us-gaap:PaymentsForRepurchaseOfCommonStock','us-gaap:PaymentsForRepurchaseOfEquity'],
}
checks=[]; gaps=[]
for sym,c in e['companies'].items():
    for period,p in c['periods'].items():
        sid=p['source'].split(' ')[0]
        fs=facts(sid)
        for field,names in fields.items():
            target=p[field]*1e6
            matched=[f for f in fs if f['name'] in names and f['period'][1]==p['period_end'] and abs(f['amount_usd']-target)<1]
            if matched:
                checks.append({'symbol':sym,'period_label':period,'field':field,'source_id':sid,
                    'expected_usd':target,'observed_usd':matched[0]['amount_usd'],'xbrl_name':matched[0]['name'],
                    'source_period':matched[0]['period'],'context':matched[0]['context'],'status':'exact_match'})
            else:
                all_match=[f for f in fs if f['period'][1]==p['period_end'] and abs(abs(f['amount_usd'])-abs(target))<1]
                if all_match:
                    checks.append({'symbol':sym,'period_label':period,'field':field,'source_id':sid,
                        'expected_usd':target,'observed_usd':all_match[0]['amount_usd'],'xbrl_name':all_match[0]['name'],
                        'source_period':all_match[0]['period'],'context':all_match[0]['context'],
                        'status':'value_match_source_label_requires_review'})
                else:gaps.append({'symbol':sym,'period_label':period,'field':field,'source_id':sid,'expected_usd':target})
report={'method':'Independent raw source inline-XBRL parse; exclude dimensioned facts, match report end and expected amount. Review custom concepts and signs using readable cash statements.',
        'exact_matches':sum(c['status']=='exact_match' for c in checks),'value_matches_custom_or_other_label':sum(c['status']!='exact_match' for c in checks),
        'checks':checks,'unmatched':gaps,'limitations':'Source_end+value match alone does not prove duration; source_period is retained for root inspection.'}
(ROOT/'source-readback.json').write_text(json.dumps(report,indent=2)+'\n')
print({k:report[k] for k in ['exact_matches','value_matches_custom_or_other_label','unmatched']})
