"""Rebuild publication figures from the source-registered inputs and model."""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from model import load_inputs, historical, run_scenario

ROOT = Path(__file__).resolve().parent
INK, MUTED, LINE, PAPER = "#24221e", "#625f56", "#d9d4c9", "#f5f2ea"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":16,"text.parse_math":False,
    "text.color":INK,"axes.labelcolor":INK,"xtick.color":MUTED,"ytick.color":MUTED,
    "axes.edgecolor":LINE,"axes.spines.top":False,"axes.spines.right":False,
    "axes.spines.left":False,"svg.fonttype":"none","svg.hashsalt":"chegg-case-study-20261012",
    "axes.titleweight":"normal","savefig.dpi":180})


def new_figure(title, subtitle, height=7):
    fig, ax = plt.subplots(figsize=(12,height))
    fig.patch.set_facecolor(PAPER);ax.set_facecolor("none")
    fig.subplots_adjust(left=.105,right=.96,top=.78,bottom=.22)
    fig.text(.105,.94,title,fontsize=23,fontfamily="DejaVu Serif",ha="left",va="top")
    fig.text(.105,.865,subtitle,fontsize=15,color=MUTED,ha="left",va="top")
    ax.set_axisbelow(True);ax.grid(axis="y",color=LINE,linewidth=.8)
    ax.tick_params(axis="both",length=0,pad=9)
    return fig,ax


def save(fig, directory, name, footer):
    fig.text(.105,.08,footer,fontsize=13,color=MUTED,ha="left",va="top")
    directory.mkdir(parents=True,exist_ok=True)
    fig.savefig(directory/(name+".png"),facecolor=PAPER)
    # Transparent figure background respects the native paper/dark reader.
    fig.savefig(directory/(name+".svg"),transparent=True,metadata={"Date":None,"Creator":"Sulayman Bowles · reproducible Chegg case study"})
    path=directory/(name+".svg")
    svg=path.read_text()
    svg=svg.replace("'DejaVu Sans'", "Arial, sans-serif").replace("'DejaVu Serif'", "Georgia, serif")
    height=round(fig.get_figheight()*180)
    svg=svg.replace('width="864pt"', 'width="2160"').replace(f'height="{fig.get_figheight()*72:g}pt"',f'height="{height}"')
    path.write_text(svg);plt.close(fig)


def build_figures(directory=ROOT/"figures"):
    inputs=load_inputs();actual=inputs["reported"];h=historical(inputs)
    fig,ax=new_figure("Skilling is growing as Chegg’s mix changes", "Reported Q2 revenue · USD millions · matching periods")
    q25,q26=actual["q2_2025"],actual["q2_2026"]
    academic=[float(q25["academic_services"]),float(q26["academic_services"])]
    skill=[float(q25["skilling"]),float(q26["skilling"])]
    x=[0,1];width=.45
    ax.bar(x,academic,width=width,color=INK,label="Academic Services")
    ax.bar(x,skill,bottom=academic,width=width,facecolor=PAPER,edgecolor=INK,hatch="///",label="Chegg Skilling")
    for i,(a,s) in enumerate(zip(academic,skill)):
        ax.text(i,a/2,f"Academic\n{a:.1f}",ha="center",va="center",color=PAPER,fontsize=18)
        ax.text(i,a+s/2,f"{s:.1f}",ha="center",va="center",fontsize=16,bbox={"facecolor":PAPER,"edgecolor":"none","pad":2})
        ax.text(i,a+s+3,f"Total {a+s:.1f}",ha="center",fontsize=16)
    ax.set_xticks(x,["Q2 2025","Q2 2026"]);ax.set_xlim(-.65,1.65);ax.set_ylim(0,125)
    ax.set_ylabel("Revenue · $m",labelpad=15)
    ax.legend(frameon=False,loc="upper center",bbox_to_anchor=(.5,1.11),ncol=2,fontsize=14,handlelength=1.7)
    save(fig,directory,"chegg-revenue-replacement","Skilling +$0.317m  /  Academic −$53.588m  /  Only 0.6% of the loss replaced\nSource: Chegg Q2 2026 Form 10-Q; calculations use unrounded reported amounts.")

    fig,ax=new_figure("The reset has improved free cash flow", "H1 2025 → H1 2026 · USD millions · historical reconciliation")
    f25,cfo,saving,f26=map(float,[h["fcf_h1_2025"],h["cfo_change"],h["capex_saving"],h["fcf_h1_2026"]])
    after=f25+cfo
    ax.bar([0,3],[f25,f26],width=.58,color=INK)
    ax.bar(1,abs(cfo),bottom=after,width=.58,facecolor="none",edgecolor=INK,hatch="///",linewidth=1.2)
    ax.bar(2,saving,bottom=after,width=.58,color="#8f8b82",edgecolor=INK,linewidth=.5)
    for i,y in ((0,f25),(1,after),(2,f26)):ax.plot([i+.29,i+.71],[y,y],color=MUTED,lw=1)
    for x,y,label in ((0,f25,f"{f25:.3f}"),(1,after,f"−{abs(cfo):.3f}"),(2,f26,f"+{saving:.3f}"),(3,f26,f"{f26:.3f}")):
        ax.text(x,y+(.65 if y>=0 else -1.2),label,ha="center",fontsize=18)
    ax.axhline(0,color=INK,lw=.8);ax.set_ylim(-4,13);ax.set_ylabel("Free cash flow · $m",labelpad=15)
    ax.set_xticks(range(4),["H1 2025\nfree cash flow","Operating cash\nflow decline","Lower cash\ncapex","H1 2026\nfree cash flow"])
    save(fig,directory,"chegg-free-cash-flow-bridge","FCF = operating cash flow − cash capex. Lower-capex savings exceeded the CFO decline.\nSource: Chegg H1 cash-flow statements; author’s reconciliation. USD millions.")

    fig,ax=new_figure("Operating discipline preserves room to reinvest", "Illustrative four-quarter stress test · USD millions · not a calendar forecast",height=7.2)
    styles=[("Managed decline",INK,"-","o"),("Faster erosion",MUTED,"--","s"),("Stronger transition",INK,":","^")]
    for scenario,(name,color,ls,marker) in zip(inputs["scenarios"],styles):
        rows,summary=run_scenario(inputs,scenario)
        vals=[38]+[float(r["closing_liquidity"]) for r in rows]
        ax.plot(range(5),vals,color=color,ls=ls,lw=2.2,marker=marker,markersize=7,label=name)
        ax.annotate(f"{vals[-1]:.1f}",xy=(4,vals[-1]),xytext=(12,0),textcoords="offset points",fontsize=18,va="center",color=color)
    ax.axhline(25,color=MUTED,lw=1,ls=(0,(2,3)))
    ax.text(.07,24.1,"$25m assumed reserve floor",fontsize=13,color=MUTED,va="top")
    ax.set_xticks(range(5),["Reference","Quarter 1","Quarter 2","Quarter 3","Quarter 4"])
    ax.set_ylim(10,42);ax.set_xlim(-.15,4.45);ax.set_ylabel("Liquid resources · $m",labelpad=15)
    ax.legend(frameon=False,loc="upper center",bbox_to_anchor=(.5,1.08),ncol=3,fontsize=13,handlelength=2.8,columnspacing=1.2)
    save(fig,directory,"chegg-liquidity-stress-test","Reference $38m: June 30 pro forma for debt repayment, not observed current cash.\nIllustrative paths and reserve floor. Author assumptions; no seasonality.")


if __name__=="__main__": build_figures()
