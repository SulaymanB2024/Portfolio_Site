"""Export the three October13 startup manuscripts using native article blocks."""
from pathlib import Path
import hashlib
import json
import re
HERE=Path(__file__).resolve().parent
LANE=HERE.parent
ROOT=LANE.parents[2]
OUT=ROOT/'src/personal/editorial/data/articles'
FIGURES={
 'ramp-contribution':dict(name='ramp-card-software-contribution',alt='Hypothetical account contributions: base $79,000, card pressure $32,500, software expansion $42,700.',caption='Hypothetical annual contribution from one account after card and software delivery, before acquisition and corporate costs. The card-pressure case changes volume and rates; software expansion also changes fees and delivery cost. All platform inputs are assumed; no Ramp margin is inferred.'),
 'flock-cohort':dict(name='flock-installed-cohort-cash',alt='Five-year cohort cash reaches $644,555 in the base, $388,224 under renewal pressure and $83,336 with service drag.',caption='Three hypothetical 100-unit cohorts each begin with $300,000 of annual subscriptions. Retention and deployment/service costs change cumulative cash; payback moves from year two to year four. No corporate costs, tax, financing, early refunds, final shutdown or terminal value is included. This is not Flock company free cash flow.'),
 'elevenlabs-audio':dict(name='elevenlabs-accepted-audio-cost',alt='Loaded cost per accepted minute ranges from $1.49 to $6.18 against a hypothetical $5.00 manual baseline.',caption='Hypothetical 600 accepted minutes per month. Review/rework changes the loaded cost; $45/hour labor, $300 shared coordination and a $0.20 generated-minute invoice are assumed. The invoice is not ElevenLabs pricing. Loaded time value differs from cash savings.'),
 'elevenlabs-agents':dict(name='elevenlabs-agent-cash-capture',alt='Base agent workflow has $18,750 monthly time-value advantage and $6,975 cash benefit; stress has $5,100 time-value advantage and a $1,050 cash deficit.',caption='Hypothetical 10,000 tasks per month. The stress case changes both completion and duration; it is not a causal isolation. Every attempted call, human fallback and oversight remain in the calculation. Cash captures half of positive labor relief, and one-time setup is excluded from the monthly comparison.')
}
CONFIGS=[
 dict(key='ramp',slug='ramp-saving-money-and-retaining-contribution',displayTitle='Ramp and the economics of saving money',title='Ramp: Saving the Customer Money Has to Improve the Business',subtitle='I separate the card bridge from paid workflow value, then test whether the platform and its buyer keep enough of the benefit.',seoTitle='Ramp Startup Analysis: Card Contribution and Paid Workflow Value',searchTerms=['Ramp','startup analysis','fintech','unit economics','card contribution','spend management'],evidenceBoundary='Primary company evidence verified October 13, 2026. Financing and annualized revenue are dated June 2026 checkpoints, not subscription ARR, audited financials or current common-share prices. All platform account economics are hypothetical. Buyer comparison is incremental to the previous/free workflow; seat price is a dated monthly-list analogue and other assumptions are authored.'),
 dict(key='elevenlabs',slug='elevenlabs-cost-of-accepted-work',displayTitle='ElevenLabs: what a finished minute is worth',title='ElevenLabs: What a Finished Minute Is Worth',subtitle='A voice demo is the opening. I model the review, fallback and cash capture needed to turn generated usage into work a customer renews.',seoTitle='ElevenLabs Startup Analysis: Accepted Audio and Verified Agent Tasks',searchTerms=['ElevenLabs','voice AI','startup analysis','accepted audio','agents','unit economics','cash capture'],evidenceBoundary='Primary evidence verified October 13, 2026. May ARR and September employee tender are distinct dated checkpoints; no current multiple or security price is inferred. All audio/agent operating parameters and invoices are hypothetical. Generated minutes are measured audio, not credits converted to accepted minutes. Time value, cash savings and unknown company costs remain distinct.'),
 dict(key='flock-safety',slug='flock-safety-installed-cohort-cash',displayTitle='Flock: the renewal has to pay for the camera',title='Flock Safety: The Renewal Has to Pay for the Camera',subtitle='One annual fee bundles equipment and continuing service. I model the cash a deployment must recover and the renewal risk that can interrupt it.',seoTitle='Flock Safety Startup Analysis: Deployment Cash and Renewal Economics',searchTerms=['Flock Safety','startup analysis','hardware subscription','cohort cash','renewal','public safety'],evidenceBoundary='Primary evidence verified October 13, 2026. Municipal proposal is dated May 2025, the financing checkpoint March 2025, and Ayer cancellation September 2026. All cohort costs, retention, timing, discount rate and price are hypothetical; the public proposal is a dated price analogue. Five-year cohort cash excludes corporate costs, tax, financing, early refunds, final shutdown and terminal value. No crime-reduction causality or company churn rate is inferred.')
]

def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def figure(key):
 f=FIGURES[key]
 return dict(src='/images/research/'+f['name']+'.svg',alt=f['alt'],caption=f['caption'],width=760,height=452)
def cells(line):return [c.strip().replace('\\|','|') for c in re.split(r'(?<!\\)\|',line.strip().strip('|'))]
def build(c):
 d=HERE/c['key']; text=(d/'article-draft.md').read_text()
 chunks=re.split(r'^## (.+)$',text,flags=re.M)
 opening=re.sub(r'^# .+\n+','',chunks[0]).strip().split('\n\n')
 assert all(not x.startswith('|') for x in opening),'opening table needs a section'
 sections=[]; tables=[]
 for i in range(1,len(chunks),2):
  title,body=chunks[i],chunks[i+1].strip()
  sec=dict(id=slug(title),title=title,blocks=[])
  for para in body.split('\n\n'):
   if para.startswith('|'):
    lines=para.splitlines(); assert len(lines)>=3 and all(re.fullmatch(r':?-{3,}:?',x) for x in cells(lines[1]))
    cols=cells(lines[0]); rows=[cells(x) for x in lines[2:]]; assert all(len(x)==len(cols) for x in rows)
    tid=f"{c['key']}-table-{len(tables)+1}"
    prev=sec['blocks'][-1] if sec['blocks'] else {}
    if prev.get('kind')=='markdown' and re.fullmatch(r'\*\*.+\*\*',prev.get('markdown','')):
     table_title=sec['blocks'].pop()['markdown'][2:-2]
    else:table_title={'elevenlabs':['Dated company checkpoints','Hypothetical accepted-audio economics','Hypothetical verified-agent economics']}[c['key']][len(tables)]
    t=dict(id=tid,title=table_title,columns=cols,rows=rows); tables.append(t); sec['blocks'].append(dict(kind='table',tableId=tid))
   elif para.startswith('[FIGURE:'):
    key=re.fullmatch(r'\[FIGURE:([^]]+)\]',para)[1]; sec.setdefault('figures',[]).append(figure(key))
   else:sec['blocks'].append(dict(kind='markdown',markdown=para))
  sections.append(sec)
 sources=[{k:v for k,v in x.items() if v is not None} for x in json.loads((d/'sources.json').read_text())]
 article={k:c[k] for k in ['slug','displayTitle','title','subtitle','seoTitle','searchTerms','evidenceBoundary']}
 article.update(path='/research/financial-systems/'+c['slug'],aliases=[],category='FINANCIAL SYSTEMS',date='2026-10-13',dateModified='2026-10-13',kind='research',author='SULAYMAN BOWLES',openingPresentation='integrated',content=opening,markdownSections=sections,tables=tables,sources=sources,seoDescription=c['subtitle'])
 plain=re.sub(r'\]\([^)]*\)',']',text)
 words=len(re.findall(r"\b[\w’'-]+\b",plain)); article['readTime']=f'{round(words/220)} MIN'
 (OUT/(c['slug']+'.json')).write_text(json.dumps(article,indent=2,ensure_ascii=False)+'\n')
 rendered=text
 for key,f in FIGURES.items():rendered=rendered.replace(f'[FIGURE:{key}]',f"![{f['alt']}](../../figures/{f['name']}.png)\n\n{f['caption']}")
 rendered=rendered.replace('\n\n','\n\n'+c['subtitle']+'\n\n',1)
 rendered+='\n## Scope\n\n'+c['evidenceBoundary']+'\n\n## Sources\n\n'+'\n'.join(f"- [{s['label']}]({s['href']}) — {s['publisher']}, {s.get('date','Current documentation')}; verified {s['lastVerified']}. {s['note']}" for s in sources)+'\n'
 (d/'article.md').write_text(rendered)
 summary={k:v for k,v in article.items() if k in ['slug','path','title','displayTitle','category','subtitle','date','dateModified','kind','readTime','seoTitle','seoDescription','searchTerms','aliases']}
 (d/'catalog-entry.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n')
 return dict(key=c['key'],slug=c['slug'],title=c['title'],words=words,readTime=article['readTime'],tables=len(tables),figures=sum(len(s.get('figures',[])) for s in sections),json=f'src/personal/editorial/data/articles/{c["slug"]}.json',manuscript=f'docs/article-drafts/strategy-planning-20261012/pitches/{c["key"]}/article.md',input_sha256=hashlib.sha256((d/'inputs.json').read_bytes()).hexdigest())
if __name__=='__main__':
 m=[build(c) for c in CONFIGS]; (HERE/'startups-manifest.json').write_text(json.dumps(m,indent=2)+'\n')
 for x in m:print(f"{x['key']}: {x['words']} words, {x['tables']} tables, {x['figures']} figures")
