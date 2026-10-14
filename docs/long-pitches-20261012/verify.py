"""Bind final artifacts to independently reviewed numerical results and frozen inputs."""
import hashlib
import json
import re
from pathlib import Path
from models import load_inputs, serial, results

ROOT=Path(__file__).resolve().parent
SITE=ROOT.parents[1]


def verify():
    inputs=load_inputs(); computed=serial(results(inputs))
    saved=json.loads((ROOT/'outputs/model-results.json').read_text())
    reviewed=json.loads((ROOT/'research/physical/model-review/snapshots/outputs/model-results.json').read_text())
    assert computed==saved==reviewed, 'Final numerical results differ from independent review.'
    assert inputs==json.loads((ROOT/'research/physical/model-review/snapshots/inputs.json').read_text())
    assert (ROOT/'evaluate_forecasts.py').read_bytes()==(ROOT/'research/physical/model-review/snapshots/evaluate_forecasts.py').read_bytes()
    # The post-review model edit only sorts dict field iteration for byte reproducibility.
    before=(ROOT/'research/physical/model-review/snapshots/models.py').read_text()
    after=(ROOT/'models.py').read_text()
    assert after==before.replace('fields = set(periods["annual_previous"]) & set(periods["interim_current"]) & set(periods["interim_previous"])','fields = sorted(set(periods["annual_previous"]) & set(periods["interim_current"]) & set(periods["interim_previous"]))')
    registry=json.loads((ROOT/'forecast-registry.json').read_text())
    assert registry['evaluation_date']=='2028-10-12' and registry['benchmark']['entry_close']==778.1
    assert {p['symbol']:p['central_price_forecast'] for p in registry['predictions']}=={'ADBE':365,'PYPL':85,'CROX':165,'EXPE':360}
    assert all(p['model_inputs_sha256']==hashlib.sha256((ROOT/'inputs.json').read_bytes()).hexdigest() for p in registry['predictions'])
    assert all(p['scenario_outputs_sha256']==hashlib.sha256((ROOT/'outputs/model-results.json').read_bytes()).hexdigest() for p in registry['predictions'])
    checked=[]
    for row in json.loads((ROOT/'article-manifest.json').read_text()):
        article=json.loads((SITE/row['article']).read_text())
        assert article['author']=='Sulayman Bowles'
        assert sum(len(s.get('figures',[])) for s in article['sections'])==3
        assert sum('table' in s for s in article['sections'])>=5
        source_ids={s['id'].lower() for s in article['sources']}
        for s in article['sources']:
            assert s['date'] is not None, 'Missing actual primary-source date.'
            assert s['date']<='2026-10-12', 'Source after information cutoff.'
        assert all(x in source_ids for x in re.findall(r'#source-([a-z0-9]+)',json.dumps(article)))
        assert re.search(r'\[\[(?:table|figure):',json.dumps(article)) is None and '<!--' not in json.dumps(article)
        assert 'I am buying' not in json.dumps(article)
        for section in article['sections']:
            if 'table' in section:
                assert all(len(r)==len(section['table']['columns']) for r in section['table']['rows'])
            for figure in section.get('figures',[]):
                assert (SITE/'public'/figure['src'].lstrip('/')).read_bytes()==(ROOT/'figures'/Path(figure['src']).name).read_bytes()
        checked.append({'symbol':row['symbol'],'article_sha256':hashlib.sha256((SITE/row['article']).read_bytes()).hexdigest(),'tables':sum('table' in s for s in article['sections']),'figures':3})
    report={'status':'passed','independent_review':'93 primary input checks;552 financial checks;17 synthetic evaluator cases; all12 financial scenarios and4 coupled reverse hurdles.36 growth/multiple sensitivity cells not independently recomputed in that review.', 'post_review_change':'Only deterministic sorting of TTM field serialization; parsed outputs exactly equal independently reviewed snapshots.', 'forecast_accuracy':'Future results unobserved. No synthetic fixture is performance evidence.', 'articles':checked}
    (ROOT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
    print('Verified final numbers, registry, source cutoff, native bindings and twelve figures.')
    return report


if __name__=='__main__':verify()
