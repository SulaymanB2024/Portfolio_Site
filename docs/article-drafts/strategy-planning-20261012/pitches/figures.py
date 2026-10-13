"""Original figures bound to the declared model; SVG + PNG review exports."""
from pathlib import Path
import sys
import json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
try:
    from .models import results
except ImportError:
    from models import results

HERE=Path(__file__).resolve().parent
LANE=HERE.parent
sys.path.append(str(LANE))
from model import results as strategy_results

INK,MUTED,LINE,GRAY="#24221e","#625f56","#d9d4c9","#b0aca3"
plt.rcParams.update({"font.family":"DejaVu Serif","font.size":15,
    "text.color":INK,"axes.labelcolor":INK,"axes.edgecolor":LINE,
    "xtick.color":MUTED,"ytick.color":INK,"svg.fonttype":"none",
    "svg.hashsalt":"strategy-pitches-20261012","axes.spines.top":False,
    "axes.spines.right":False,"axes.spines.left":False,
    "figure.facecolor":"white","axes.facecolor":"white","savefig.facecolor":"white",
    "text.parse_math":False})


def dollars(v):return f"−${abs(v):,.0f}" if v<0 else f"${v:,.0f}"


def canvas(title,subtitle,height=6.5):
    fig=plt.figure(figsize=(11,height),dpi=100)
    fig.text(.035,.95,title,fontsize=24)
    fig.text(.035,.896,subtitle,fontsize=13,color=MUTED)
    return fig


def save(fig,name):
    out=LANE/"figures";out.mkdir(exist_ok=True)
    svg=out/(name+".svg")
    fig.savefig(svg,metadata={"Date":None})
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines())+"\n")
    fig.savefig(out/(name+".png"),dpi=140)
    return fig


def strategy_price(s):
    fig=canvas("The channel ranking depends on the price",
        "Diagnostic counterfactuals · other inputs held fixed within each motion",6.4)
    ax=fig.add_axes([.29,.26,.64,.52])
    records=[s["base"]["self_service"],s["variants"]["direct_at_self_service_price"],
        s["base"]["assisted_direct"],s["variants"]["self_service_at_direct_price"]]
    labels=["Self-service · $99","Direct · $99","Direct · $399","Self-service · $399"]
    vals=[r["summary"]["final_cash"] for r in records]
    for y,(label,val) in enumerate(zip(labels,vals)):
        pos=3-y
        ax.barh(pos,val,height=.48,color=INK if label.startswith("Direct") else GRAY,edgecolor=INK,linewidth=.7)
        ax.text(val+900,pos,dollars(val),va="center",fontsize=14)
    ax.set_yticks([3,2,1,0],labels);ax.tick_params(axis="y",length=0,pad=15)
    ax.set_xlim(0,67000);ax.set_xticks([0,20000,40000,60000])
    ax.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f"${v/1000:.0f}k"))
    ax.set_xlabel("Ending cash after six 30-day periods",labelpad=17)
    fig.text(.035,.105,"At $99, self-service keeps more cash than direct. The $399 demand assumption does the work.",fontsize=14)
    fig.text(.035,.055,"Modeled outcomes. Untested prices do not establish demand; no causal channel effect is identified.",fontsize=12,color=MUTED)
    return save(fig,"strategy-growth-price-counterfactual")


def toast_entry(t):
    fig=canvas("The return changes with the price you pay",
        "Three-year underwriting · full trailing-year GAAP gross-profit anchor")
    ax=fig.add_axes([.105,.245,.64,.55])
    entries=[20+i*.1 for i in range(251)]
    for name,style,lw in [("downside",(0,(3,3)),1.5),("base","-",2.4),("upside",(0,(8,3)),1.5)]:
        terminal=t["scenarios"][name]["terminal_value_per_share"]
        ys=[(terminal/x)**(1/3)-1 for x in entries]
        ax.plot(entries,ys,color=INK if name=="base" else MUTED,linestyle=style,linewidth=lw)
        ax.text(46,ys[-1],f"{name.title()}\n{ys[-1]:.1%}",va="center",fontsize=13)
    ax.axhline(0,color=LINE,linewidth=.8)
    ax.axhline(.15,color=MUTED,linestyle=(0,(2,3)),linewidth=.8)
    ax.text(46,.18,"15% annual hurdle",fontsize=12,color=MUTED)
    entry=t["scenarios"]["base"]["maximum_entry_for_15_percent"]
    ax.plot(entry,.15,"o",color=INK,markersize=5)
    ax.annotate(f"${entry:.2f} entry\n15% base hurdle",xy=(entry,.15),xytext=(20.8,.045),fontsize=13,
        arrowprops={"arrowstyle":"-","color":INK,"linewidth":.8})
    ref=t["reference_price"];ret=t["scenarios"]["base"]["returns_at_entry"][str(ref)]
    ax.plot(ref,ret,"o",color=INK,markersize=5)
    ax.annotate(f"${ref:.2f} reference\n{ret:.1%} base return",xy=(ref,ret),xytext=(32.5,-.13),fontsize=13,
        arrowprops={"arrowstyle":"-","color":INK,"linewidth":.8})
    ax.set_xlim(20,45);ax.set_ylim(-.30,.49)
    ax.set_xticks([20,25,30,35,40,45]);ax.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f"${v:.0f}"))
    ax.set_yticks([-.2,0,.2,.4]);ax.yaxis.set_major_formatter(FuncFormatter(lambda v,_:f"{v:.0%}"))
    ax.set_xlabel("Entry price per share",labelpad=16);ax.set_ylabel("Annualized price return",labelpad=16)
    fig.text(.035,.105,"Assumed GP growth 10 / 18 / 25%; operating conversion 22 / 30 / 35%; EV / after-tax earnings 22 / 27 / 32×.",fontsize=12)
    fig.text(.035,.055,"25% tax; liquidity constant; shares grow 1%/year. No probability weights. Quote: Oct 12, 2026, 19:03:30 UTC.",fontsize=12,color=MUTED)
    return save(fig,"toast-entry-price-return")


def customer_bars(record,company):
    if company=="harvey":
        cases=list(record["customer_value"]["cases"].values())
        labels=[f"{r['monetization_fraction']:.0%}\nmonetized" for r in cases]
        vals=[r["net_first_year_benefit"] for r in cases]
        fig=canvas("Recovered time has to become contribution",
            "Hypothetical 100-seat deployment · first-year net benefit after $290,000 cost")
        lower,upper=-150000,950000; ticks=[0,200000,400000,600000,800000]
        footer="60% adoption; 6 eligible hours/week; 46 weeks; 20% extra review; $200 contribution/monetized hour."
        note="Assumed $2,400 annual license/seat + $50k implementation. Break-even: 10.9% of 13,248 net released hours."
        name="harvey-time-to-contribution"
    else:
        cases=list(record["customer_value"]["cases"].values())
        labels=[f"{r['cash_capture']:.0%}\ncash capture" for r in cases]
        vals=[r["net_first_year_cash_benefit"] for r in cases]
        fig=canvas("Released capacity is not all cash savings",
            "Hypothetical buyer · first-year net cash benefit after subscription and implementation")
        lower,upper=-22000,23000;ticks=[-20000,-10000,0,10000,20000]
        footer="488 distinct hours released per year; $80 avoidable cost/hour; $18,750 annual license normalization."
        note="Assumed $5,000 implementation; audit fees remain. First-year cash payback needs 60.8% capture."
        name="vanta-cash-capture"
    ax=fig.add_axes([.13,.29,.80,.49])
    for i,val in enumerate(vals):
        ax.bar(i,val,width=.47,color=INK if i==1 else GRAY,edgecolor=INK,linewidth=.8)
        pad=(upper-lower)*.035
        ax.text(i,val+pad if val>=0 else val-pad,dollars(val),ha="center",va="bottom" if val>=0 else "top",fontsize=16)
    ax.axhline(0,color=INK,linewidth=.9)
    ax.set_ylim(lower,upper);ax.set_yticks(ticks)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v,_:f"−${abs(v)/1000:.0f}k" if v<0 else f"${v/1000:.0f}k"))
    ax.set_xticks(range(3),labels);ax.tick_params(axis="x",length=0,pad=12)
    fig.text(.035,.12,footer,fontsize=12)
    fig.text(.035,.065,note,fontsize=12,color=MUTED)
    return save(fig,name)


def harvey_hurdle(h):
    fig=canvas("What $15.5 billion must become",
        "20% annual return · five years · 25% future ownership dilution")
    ax=fig.add_axes([.18,.25,.74,.53])
    multiples=[10,15,20,25];vals=[h["hurdles"][str(m)]["required_exit_arr"]/1e9 for m in multiples]
    for i,(m,val) in enumerate(zip(multiples,vals)):
        y=3-i
        ax.barh(y,val,height=.46,color=INK if m==20 else GRAY,edgecolor=INK,linewidth=.7)
        ax.text(val+.09,y,f"${val:.2f}bn",va="center",fontsize=15)
    ax.set_xlim(0,6.4);ax.set_xticks([0,2,4,6]);ax.xaxis.set_major_formatter(FuncFormatter(lambda v,_:f"${v:.0f}bn"))
    ax.set_yticks([3,2,1,0],[f"{m}× exit ARR" for m in multiples]);ax.tick_params(axis="y",length=0,pad=14)
    ax.set_xlabel("Required exit ARR",labelpad=17)
    fig.text(.035,.105,"Required exit equity value: $51.43bn. Changing the multiple changes the revenue burden.",fontsize=14)
    fig.text(.035,.055,"Assumed equity / ARR multiples. No current ARR estimate, fees, preference waterfall or secondary premium.",fontsize=12,color=MUTED)
    return save(fig,"harvey-return-hurdle")


def vanta_growth(v):
    fig=canvas("New business does most of the growth work",
        "Declared base cohorts · April 2026 reported $300m ARR starting point")
    ax=fig.add_axes([.105,.25,.64,.54])
    rows=v["scenarios"]["base"]["rows"]
    years=list(range(6));total=[.3]+[r["ending_arr"]/1e9 for r in rows]
    opening=[.3]+[r["cohorts"][0]/1e9 for r in rows]
    ax.fill_between(years,0,opening,color=GRAY,alpha=.9)
    ax.fill_between(years,opening,total,color="#e7e3da",alpha=1)
    ax.plot(years,total,color=INK,linewidth=2.3,marker="o",markersize=4)
    ax.plot(years,opening,color=MUTED,linewidth=1.2,linestyle=(0,(4,3)))
    hurdle=v["hurdles"]["10"]["required_exit_arr"]/1e9
    ax.axhline(hurdle,color=MUTED,linewidth=.8,linestyle=(0,(2,3)))
    ax.text(5.15,hurdle,"$1.291bn hurdle",va="center",fontsize=13,color=MUTED)
    ax.text(5.15,total[-1],"$1.155bn base",va="center",fontsize=13)
    ax.text(5.15,opening[-1],"$420m opening cohort",va="center",fontsize=13,color=MUTED)
    ax.text(2.6,.20,"Opening cohort",fontsize=14)
    ax.text(3.7,.74,"Later cohorts",fontsize=14)
    ax.set_xlim(0,5);ax.set_ylim(0,1.48)
    ax.set_xticks(years);ax.set_xlabel("Modeled year",labelpad=16)
    ax.set_yticks([0,.3,.6,.9,1.2]);ax.yaxis.set_major_formatter(FuncFormatter(lambda n,_:f"${n:.1f}bn"))
    fig.text(.035,.105,"93% gross ARR retention; 15% expansion after retention; new ARR of $100m, $115m, $130m, $145m, $160m.",fontsize=12)
    fig.text(.035,.055,"Ending run-rate, not recognized revenue. Hurdle: $4.15bn entry, 20% dilution, 10× exit ARR. No probabilities.",fontsize=12,color=MUTED)
    return save(fig,"vanta-cohort-growth")


def all_figures():
    p=results();s=strategy_results()
    return [strategy_price(s),toast_entry(p["toast"]),customer_bars(p["harvey"],"harvey"),
        harvey_hurdle(p["harvey"]),customer_bars(p["vanta"],"vanta"),vanta_growth(p["vanta"])]


if __name__=="__main__":
    for fig in all_figures():plt.close(fig)
    print("Saved six model-bound SVG/PNG figures")
