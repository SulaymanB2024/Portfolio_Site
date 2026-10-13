"""Model-bound static research figures in the existing article's paper/ink palette."""
from pathlib import Path
import json
from decimal import Decimal, ROUND_HALF_UP
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
P=Path(__file__).resolve().parent
OUT=P.parent/'figures'
INK,MUTED,LINE,PAPER='#24221e','#625f56','#d9d4c9','#f5f2ea'
plt.rcParams.update({'font.family':'DejaVu Serif','font.size':14,'text.color':INK,'axes.labelcolor':INK,'xtick.color':MUTED,'ytick.color':INK,'axes.edgecolor':LINE,'figure.facecolor':PAPER,'axes.facecolor':PAPER,'savefig.facecolor':PAPER,'svg.fonttype':'none','svg.hashsalt':'startup-batch-20261013','axes.spines.top':False,'axes.spines.right':False,'text.parse_math':False})
def canvas(title,sub):
 f=plt.figure(figsize=(10.6,6.3),dpi=100)
 f.text(.035,.95,title,fontsize=22)
 f.text(.035,.89,sub,fontsize=12,color=MUTED)
 return f

def save(f,name,notes):
 for i,n in enumerate(notes): f.text(.035,.10-i*.04,n,fontsize=11,color=MUTED)
 OUT.mkdir(exist_ok=True)
 f.savefig(OUT/(name+'.svg'),metadata={'Date':None})
 svg=OUT/(name+'.svg'); svg.write_text('\n'.join(x.rstrip() for x in svg.read_text().splitlines())+'\n')
 f.savefig(OUT/(name+'.png'),dpi=140)
 plt.close(f)

r=json.loads((P/'ramp/model-results.json').read_text())['platform_cases']
f=canvas('The card bridge still drives the account','Hypothetical annual contribution · after delivery, before acquisition and corporate costs')
a=f.add_axes([.23,.25,.70,.52]); labels=['Base','Card pressure','Software expansion']
for y,(k,label) in enumerate(zip(r,labels)):
 q=r[k]; pos=2-y
 a.barh(pos,q['card_contribution'],height=.48,color=INK,edgecolor=INK,linewidth=.7,label='Card' if y==0 else None)
 a.barh(pos,q['software_contribution'],left=q['card_contribution'],height=.48,color=PAPER,edgecolor=INK,hatch='///',linewidth=.7,label='Software' if y==0 else None)
 a.text(q['combined_contribution']+1800,pos,f"${q['combined_contribution']:,.0f}",va='center',fontsize=13)
a.set_yticks([2,1,0],labels); a.tick_params(axis='y',length=0,pad=12)
a.set_xlim(0,93000); a.set_xticks([0,20000,40000,60000,80000]); a.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f'${v/1000:.0f}k'))
a.spines['left'].set_visible(False); a.set_xlabel('Annual modeled contribution',labelpad=14)
a.legend(loc='lower left',bbox_to_anchor=(0,1.03),ncol=2,frameon=False,fontsize=12)
save(f,'ramp-card-software-contribution',['All volume, proceeds, rewards, risk/funding and delivery rates are assumed; no Ramp margin is inferred.','Pressure changes card volume and rates; expansion also changes software fees and delivery cost.'])

r=json.loads((P/'flock-safety/model-results.json').read_text())['scenarios']
f=canvas('Same opening subscriptions, different cash recovery','Hypothetical 100-unit cohort · cumulative cash after deployment and acquisition')
a=f.add_axes([.13,.25,.59,.53]); labels=['Base','Renewal pressure','Service drag']
for (k,label,style) in zip(r,labels,['-','--',':']):
 q=r[k]; ys=[x['cumulative_cash'] for x in q['rows']]
 a.plot(range(1,6),ys,color=INK,linestyle=style,linewidth=2,marker='o',markersize=4)
 a.text(5.2,ys[-1],f"{label}\n${ys[-1]:,.0f}",va='center',fontsize=12)
a.axhline(0,color=MUTED,linewidth=.8); a.set_xlim(1,7.0); a.set_ylim(-300000,720000); a.set_xticks(range(1,6))
a.set_yticks([-200000,0,200000,400000,600000]); a.yaxis.set_major_formatter(FuncFormatter(lambda v,_:f"{'−' if v<0 else ''}${abs(v)/1000:.0f}k")); a.set_xlabel('Year-end',labelpad=14); a.spines['left'].set_visible(False)
save(f,'flock-installed-cohort-cash',['Opening annual subscriptions are $300,000 in every case. Costs and retention are assumptions.','No corporate costs, tax, financing, early refunds, final shutdown or terminal value; not company FCF.'])

r=json.loads((P/'elevenlabs/model-results.json').read_text())
f=canvas('Review effort changes the price of accepted audio','Hypothetical 600 accepted minutes/month · loaded labor, coordination and software cost')
a=f.add_axes([.23,.25,.68,.53])
for i,q in enumerate(r['audio']):
 pos=3-i; val=q['loadedCostPerAcceptedMinute']
 a.barh(pos,val,height=.48,color=INK if q['id']=='base' else '#b0aca3',edgecolor=INK,linewidth=.7)
 rounded=Decimal(str(val)).quantize(Decimal('0.01'),rounding=ROUND_HALF_UP)
 a.text(val+.23,pos,f'${rounded:.2f}',va='center',fontsize=13)
a.axvline(5,color=MUTED,linestyle='--',linewidth=1)
a.set_yticks([3,2,1,0],[q['label'] for q in r['audio']]); a.tick_params(axis='y',length=0,pad=12)
a.set_xlim(0,7.2); a.set_xticks([0,2,4,6]); a.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f'${v:.0f}')); a.spines['left'].set_visible(False)
a.set_xlabel('Loaded cost per accepted minute · manual baseline $5.00 (dashed)',labelpad=14,fontsize=12)
save(f,'elevenlabs-accepted-audio-cost',['$45/hour labor, $300 shared coordination and $0.20/generated-minute invoice are assumed.','Loaded time value differs from cash; cash capture is modeled separately in the article.'])

f=canvas('A useful conversation still has to repay the bill','Hypothetical agent tasks · monthly advantage before one-time setup')
a=f.add_axes([.26,.25,.65,.53]); selected=[q for q in r['agents'] if q['id'] in ['base','stress']]
for i,q in enumerate(selected):
 y=1-i
 a.barh(y+.14,q['monthlyTimeValueAdvantage'],height=.25,color='#b0aca3',edgecolor=INK,linewidth=.7,label='Loaded time value' if i==0 else None)
 a.barh(y-.14,q['monthlyNetCashBenefit'],height=.25,color=INK,edgecolor=INK,linewidth=.7,label='Cash at 50% capture' if i==0 else None)
 for dy,key in [(.14,'monthlyTimeValueAdvantage'),(-.14,'monthlyNetCashBenefit')]:
  v=q[key]; a.text(v+(500 if v>=0 else -400),y+dy,f"{'−' if v<0 else ''}${abs(v):,.0f}",ha='left' if v>=0 else 'right',va='center',fontsize=12)
a.axvline(0,color=MUTED,linewidth=.9); a.set_xlim(-4200,23000); a.set_xticks([0,5000,10000,15000,20000]); a.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f'${v/1000:.0f}k')); a.set_yticks([1,0],['Base workflow','Long calls,\nweak completion']); a.tick_params(axis='y',length=0,pad=12); a.spines['left'].set_visible(False); a.set_xlabel('Monthly modeled advantage',labelpad=14)
a.legend(loc='lower left',bbox_to_anchor=(0,1.03),ncol=2,frameon=False,fontsize=11)
save(f,'elevenlabs-agent-cash-capture',['10,000 tasks/month; all costs, completion and cash capture are hypothetical; fallback remains.','Stress changes both completion (70%→40%) and duration (4→6 minutes); no causal isolation.'])
print('Wrote four model-bound SVG and PNG figures')
