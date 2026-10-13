"""Independent material arithmetic and delivered-content checks.

Uses Decimal and closed-form cohort sums; does not call model recurrence or
return-hurdle helpers for the independent side of the comparison.
"""
from decimal import Decimal, localcontext
from hashlib import sha256
from math import isclose
from pathlib import Path
import json
import re
import os
import xml.etree.ElementTree as ET
try:
    from .models import results
except ImportError:
    from models import results

HERE=Path(__file__).resolve().parent
LANE=HERE.parent
ROOT=LANE.parents[2]
D=Decimal


def close(actual,expected):
    assert isclose(actual,float(expected),rel_tol=1e-12,abs_tol=1e-5),(actual,expected)


def independent_math():
    p=results();t=p['toast'];h=p['harvey'];v=p['vanta']
    gp=D(672+1146)-D((436-130)+(2358-1823))+D((558-124)+(2893-2222))
    assert gp==2082
    assert (290-64)+(1570-1211)+(48-116)-1==516
    assert 302+57==359
    assert 608-(302-25)+(276-31)==576
    close(t['ttm_gp_anchor'],gp*1_000_000)
    close(t['ttm_operating_conversion'],D(292-123+262)/gp)
    close(t['payments_gp_per_gpv'],D(302)/D(60700))
    toast_prices={}
    with localcontext() as ctx:
        ctx.prec=40
        shares=D(590_000_000)*D('1.01')**3
        for name,growth,conversion,multiple in [('downside','1.10','.22',22),('base','1.18','.30',27),('upside','1.25','.35',32)]:
            operating=gp*1_000_000*D(growth)**3*D(conversion)
            equity=operating*D('.75')*multiple+D(1_713_000_000)
            price=equity/shares
            toast_prices[name]=price
            row=t['scenarios'][name]
            close(row['terminal_value_per_share'],price)
            close(row['maximum_entry_for_15_percent'],price/D('1.15')**3)
            annual=(price/D('31.29'))**(D(1)/3)-1
            close(row['returns_at_entry']['31.29'],annual)

    # Check the reverse valuation by investing $1m and reconstructing its
    # post-dilution proceeds at the required exit, rather than repeating the
    # model's hurdle division formula.
    for record,entry,ownership in [(h,D(15_500_000_000),D('.75')),(v,D(4_150_000_000),D('.80'))]:
        initial_fraction=D(1_000_000)/entry
        target_proceeds=D(1_000_000)*D('1.20')**5
        for m,row in record['hurdles'].items():
            exit_equity=D(str(row['required_exit_equity']))
            assert abs(initial_fraction*ownership*exit_equity-target_proceeds)<D('.000001')
            close(row['required_exit_arr']*int(m),exit_equity)

    hours=D(100)*D('.60')*D(6)*46*D('.80')
    assert hours==13248
    customer_cost=D(100)*2400+50000
    assert customer_cost==290000
    for m in ['0.1','0.25','0.4']:
        expected=hours*D(m)*200-customer_cost
        close(h['customer_value']['cases'][m]['net_first_year_benefit'],expected)
    close(h['customer_value']['break_even_monetization_fraction'],customer_cost/(hours*200))
    for cost in [250,900,1800]:
        licensed=D(400_000_000)/2400
        delivery=D(400_000_000)*D('.15')+licensed*D('.65')*cost
        close(h['delivery'][str(cost)]['modeled_gross_margin'],1-delivery/D(400_000_000))
    for name,growth,multiple in [('downside','1.25',10),('base','1.40',20),('upside','1.55',25)]:
        arr=D(400_000_000)*D(growth)**5
        close(h['scenarios'][name]['terminal_arr'],arr)
        proceeds_fraction=arr*multiple*D('.75')/D(15_500_000_000)
        close(h['scenarios'][name]['annualized_return'],proceeds_fraction**D('.2')-1)

    vanta_ends={}
    for name,grr,exp,new,multiple in [
        ('downside','.85','.05',[50,55,60,65,70],6),
        ('base','.93','.15',[100,115,130,145,160],10),
        ('upside','.95','.22',[110,135,160,185,210],12),
    ]:
        retention=D(grr)*(1+D(exp))
        row=v['scenarios'][name]
        close(row['net_arr_retention'],retention)
        for year in range(1,6):
            # Independent cohort sum; no opening-to-ending recurrence.
            arr=D(300_000_000)*retention**year+sum(D(new[i])*1_000_000*retention**(year-1-i) for i in range(year))
            actual=row['rows'][year-1]
            close(actual['ending_arr'],arr)
            close(actual['ending_arr'],actual['opening_arr']-actual['lost_arr']+actual['retained_expansion_arr']+actual['new_arr'])
        vanta_ends[name]=arr
        multiple_return=arr*multiple*D('.80')/D(4_150_000_000)
        close(row['annualized_return'],multiple_return**D('.2')-1)
    released=D(8)*46+D(10)*12*(D('1.5')-D('.5'))
    assert released==488
    normalized=D(300_000_000)/16000
    assert normalized==18750
    for capture in ['0.25','0.5','1.0']:
        benefit=released*80*D(capture)-normalized-5000
        close(v['customer_value']['cases'][capture]['net_first_year_cash_benefit'],benefit)
    for row in h['customer_sensitivity']:
        stress_hours=D(100)*D(str(row['adoption']))*6*46*(1-D(str(row['review'])))
        close(row['required_monetization'],D(290000)/(stress_hours*200))
    for row in v['customer_sensitivity']:
        stress_hours=D(8)*row['work_weeks']+120
        close(row['net_first_year_benefit'],stress_hours*80*D(str(row['cash_capture']))-D(23750))
    return {'status':'pass','toast_trailing_GP_m':int(gp),
        'toast_base_value_per_share':float(toast_prices['base']),
        'harvey_net_eligible_hours':int(hours),'vanta_base_exit_ARR':float(vanta_ends['base']),
        'methods':'Decimal earnings bridge, inverse investor-proceeds hurdle, closed-form money-cohort sums and customer cost/value recomputations'}


def verify_delivery():
    math=independent_math()
    manifest=json.loads((HERE/'article-manifest.json').read_text())
    assert len(manifest)==4
    source_rows=json.loads((HERE/'source-verification.json').read_text())
    assert len(source_rows)==19
    assert not any(r['status']==404 for r in source_rows)
    fallbacks=json.loads((HERE/'web-readbacks.json').read_text())
    assert all(r['status']==200 or (r['status']==403 and r['id'] in fallbacks and r['url']==fallbacks[r['id']]['url']) for r in source_rows)
    input_manifest=json.loads((HERE/'inputs.json').read_text())
    assert not input_manifest['harvey']['assumed']['central_normalization_is_estimate']
    receipts=[]
    for entry in manifest:
        path=ROOT/entry['json'];article=json.loads(path.read_text())
        assert path.parent==ROOT/'src/personal/editorial/data/articles'
        assert article['slug']==entry['slug'] and article['path']==entry['path']
        assert article['author']=='SULAYMAN BOWLES' and article['openingPresentation']=='integrated'
        assert article['content'] and article['sources'] and article['evidenceBoundary']
        ids=[s['id'] for s in article['markdownSections']]
        assert len(ids)==len(set(ids))
        assert all(len(r)==len(t['columns']) for t in article['tables'] for r in t['rows'])
        tables={t['id']:t for t in article['tables']}
        refs=[b['tableId'] for s in article['markdownSections'] for b in s['blocks'] if b['kind']=='table']
        assert len(refs)==len(set(refs)) and set(refs)==set(tables)
        assert entry['model_input_sha256']==results()['input_sha256']
        native_text=json.dumps(article,ensure_ascii=False)
        assert '[TABLE:' not in native_text and '[FIGURE:' not in native_text
        assert not re.search(r'\b(TODO|TBD|lorem ipsum)\b',native_text,re.I)
        source_ids=[s['id'] for s in article['sources']]
        assert len(source_ids)==len(set(source_ids))
        main=[article['title'],article['subtitle'],*article['content']]
        fig_hashes={}
        for sec in article['markdownSections']:
            main.append(sec['title'])
            for block in sec['blocks']:
                if block['kind']=='markdown':main.append(block['markdown'])
                else:
                    table=tables[block['tableId']]
                    main += [table['title'],*table['columns'],*sum(table['rows'],[]),table['note']]
            for fig in sec.get('figures',[]):
                file=LANE/'figures'/Path(fig['src']).name
                svg=ET.parse(file).getroot()
                viewbox=[float(n) for n in svg.attrib['viewBox'].split()]
                assert isclose(viewbox[2]/viewbox[3],fig['width']/fig['height'],rel_tol=1e-5)
                assert file.with_suffix('.png').is_file()
                assert len(fig['alt'])>50 and fig['caption']
                fig_hashes[file.name]=sha256(file.read_bytes()).hexdigest()
                main.append(fig['caption'])
        words=len(re.findall(r"\b[\w’'-]+\b",re.sub(r'\]\([^)]*\)',']',' '.join(main))))
        assert article['readTime']==f'{round(words/220)} MIN'
        assert words==entry['words']
        manuscript_path=ROOT/entry['manuscript']
        manuscript=manuscript_path.read_text()
        assert article['title'] in manuscript and article['content'][0] in manuscript
        assert '[TABLE:' not in manuscript and '[FIGURE:' not in manuscript
        for f in [f for s in article['markdownSections'] for f in s.get('figures',[])]:
            image=Path(os.path.relpath(LANE/'figures'/Path(f['src']).with_suffix('.png').name,manuscript_path.parent)).as_posix()
            assert f']({image})' in manuscript
            assert (manuscript_path.parent/image).is_file()
        # Reader integration contract: expose the numbers before explaining
        # the result, rather than moving every exhibit to the section's end.
        for table_id, followup in [('offer-assumptions','The new-start rows'),('harvey-customer-value','At 10% monetization'),('vanta-customer-cash','With half the released capacity')]:
            if table_id not in tables:continue
            section=next(s for s in article['markdownSections'] if any(b.get('tableId')==table_id for b in s['blocks']))
            exhibit=next(i for i,b in enumerate(section['blocks']) if b.get('tableId')==table_id)
            explanation=next(i for i,b in enumerate(section['blocks']) if b.get('markdown','').startswith(followup))
            assert exhibit<explanation
        receipts.append({'key':entry['key'],'words':words,'tables':entry['tables'],'figures':len(fig_hashes),
            'article_sha256':sha256(path.read_bytes()).hexdigest(),'manuscript_sha256':sha256(manuscript_path.read_bytes()).hexdigest(),'figure_sha256':fig_hashes})

    # Independently computed consequential quantities must be visible in the
    # actual final plots, catching stale exports and missing currency glyphs.
    expected_plot_text={
        'strategy-growth-price-counterfactual.svg':['$4,649','$56,048'],
        'toast-entry-price-return.svg':['$24.33','5.8%'],
        'harvey-time-to-contribution.svg':['−$25,040','$372,400'],
        'harvey-return-hurdle.svg':['$2.57bn','$51.43bn'],
        'vanta-cash-capture.svg':['−$4,230','$15,290'],
        'vanta-cohort-growth.svg':['$1.291bn','$1.155bn','$420m'],
    }
    for name,values in expected_plot_text.items():
        text=' '.join(ET.parse(LANE/'figures'/name).getroot().itertext())
        for value in values:assert value in text,(name,value)
    receipt={'status':'pass','math':math,'articles':receipts,'model_input_sha256':results()['input_sha256'],
        'source_readback_count':len(source_rows),'source_readback_boundary':'HTTP links plus separately read web text; SEC may deny this HTTP client',
        'scope':'Local manuscript, model, table/figure and schema preparation. Full route/catalog/artwork integration and publication excluded.'}
    (HERE/'verification.json').write_text(json.dumps(receipt,indent=2)+'\n')
    return receipt


if __name__=='__main__':
    r=verify_delivery()
    print(json.dumps({'status':r['status'],'math':r['math'],'articles':[{k:x[k] for k in ['key','words','tables','figures']} for x in r['articles']]},indent=2))
