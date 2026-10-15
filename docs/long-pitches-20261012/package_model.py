"""Build portable public reports/model files with fixed archive timestamps."""
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import csv
import hashlib
import json

ROOT=Path(__file__).resolve().parent
SITE=ROOT.parents[1]
manifest=json.loads((ROOT/'article-manifest.json').read_text())
(ROOT/'articles').mkdir(exist_ok=True)
for item in manifest:
    a=json.loads((SITE/item['article']).read_text())
    lines=['# '+a['title'],'','Written October 13, 2026; information/entry cutoff October 12, 2026.','',a['ledeMarkdown']]
    for section in a['sections']:
        lines+=['','## '+section['title'],'']+section['paragraphs']
        if 'table' in section:
            t=section['table'];lines+=['','**'+t['caption']+'**','','| '+' | '.join(t['columns'])+' |','| '+' | '.join('---' for _ in t['columns'])+' |']
            lines+=['| '+' | '.join(row)+' |' for row in t['rows']]
            lines+=['',t['note']]
        for figure in section.get('figures',[]):
            lines+=['',f"![{figure['alt']}](../figures/{Path(figure['src']).name})",'',figure['caption']]
    lines+=['','## '+a['conclusion']['title'],'',a['conclusion']['content'],'','## Evidence boundary','',a['evidenceBoundary'],'','## Sources']
    for source in a['sources']:
        lines+=['',f'<a id="source-{source["id"].lower()}"></a>',f"**{source['id']} · [{source['label']}]({source['href']})** · {source['date']}",source['note'],source['limitation']]
    (ROOT/'articles'/(a['slug']+'.md')).write_text('\n\n'.join(lines)+'\n')
files=['models.py','build_inputs.py','figures.py','inputs.json','source-register.json','prices-20261012.json','forecast-registry.json','evaluate_forecasts.py','worked-model.ipynb','requirements-figures.txt','METHODOLOGY.md','verification.json','research/software/inputs.json','research/physical/evidence.json']
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/'outputs').glob('*'))
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/'articles').glob('*.md'))
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/'figures').glob('*.svg') if 'share-card' not in p.name)
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/'figures').glob('*.png'))
dest=SITE/'public/downloads/research/four-long-pitches-model.zip'
with ZipFile(dest,'w',compression=ZIP_DEFLATED,compresslevel=9) as archive:
    for name in ['README.md',*files]:
        original=ROOT/('MODEL_README.md' if name=='README.md' else name)
        info=ZipInfo(name,date_time=(2026,10,13,12,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
        archive.writestr(info,original.read_bytes())
receipt={'files':len(files)+1,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'scope':'Public primary facts, author models, completed reports and figures. No raw filings, credentials or private operational records.'}
(ROOT/'bundle-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('Packaged',receipt)
