"""Execute two source-bound companions and export the authored manuscripts."""
from pathlib import Path
import json
import sys
import nbformat
from nbclient import NotebookClient
from jupyter_client import KernelManager
from build_articles import CONFIGS, build

HERE=Path(__file__).resolve().parent
LANE=HERE.parent
ROOT=LANE.parents[2]


def md(text):return nbformat.v4.new_markdown_cell(text)
def code(text):return nbformat.v4.new_code_cell(text)


def execute(cells,path,cwd):
    book=nbformat.v4.new_notebook(cells=cells,metadata={"kernelspec":{"name":"python3","display_name":"Python 3","language":"python"}})
    nbformat.validate(book)
    manager=KernelManager(kernel_name="python3")
    manager.kernel_spec.argv[0]=str(Path(sys.executable))
    NotebookClient(book,timeout=60,km=manager,resources={"metadata":{"path":str(cwd)}}).execute()
    nbformat.write(book,path)
    count=sum(c.cell_type=='code' for c in book.cells)
    pngs=sum('image/png' in o.get('data',{}) for c in book.cells for o in c.get('outputs',[]))
    assert not any(o.get('output_type')=='error' for c in book.cells for o in c.get('outputs',[]))
    return {"notebook":path.relative_to(ROOT).as_posix(),"code_cells":count,"errors":0,"embedded_pngs":pngs}


strategy=[
    md("# Sell the Review Before You Scale the App\n\n## tl;dr\n\nAssisted direct preserves the most cash in the starting scenario. At the same $99 price, self-service preserves more cash. The model therefore tests an offer, customer and price combination; it does not identify a causal channel effect.\n\nFull manuscript: [article.md](article.md)."),
    md("## Context & Methods\n\nSix 30-day periods after an approved working app exists. $40,000 starting cash; $6,000 fixed cash outflow including founder draws; $12/store variable cost; 60 delivery and 40 commercial hours. Existing customer support is admitted before new starts. New starts are whole; retained stores are expected values.\n\n### Key Assumptions\n\nCommercial demand, prices, churn, work, acquisition cost, agency commission and one-period collections are authored assumptions. Current Shopify fee terms are sourced in [SOURCES.md](SOURCES.md). Taxes, refunds, nonpayment and pre-launch costs are excluded."),
    md("## Data\n\n### 1. Load the complete operating inputs\n\nLocal calculations require no network or credentials."),
    code("from model import results\nfrom figures import cash_capacity, cash_paths\nfrom pitches.figures import strategy_price\nfrom IPython.display import display, Markdown, Image\nimport matplotlib.pyplot as plt\ndata=results()\nfor key,record in data['base'].items():\n    print(key, record['inputs'])"),
    md("## Results\n\n### 2. Compare the starting offers"),
    code("rows=['| Motion | Contribution | Ending cash | Period 6 delivery |','| --- | ---: | ---: | ---: |']\nfor r in data['base'].values():\n    rows.append(f\"| {r['inputs']['name']} | ${r['summary']['contribution']:,.0f} | ${r['summary']['final_cash']:,.0f} | {r['rows'][-1]['delivery_hours']:.2f}h |\")\ndisplay(Markdown('\\n'.join(rows)))\nfig=cash_capacity(data)\ndisplay(Image(filename='figures/strategy-growth-channel-cash-capacity.png'))\nplt.close(fig)"),
    md("### 3. Hold price constant\n\nThese diagnostic counterfactuals hold each motion's demand and work fixed. They are not evidence of demand at the untested price."),
    code("fig=strategy_price(data)\ndisplay(Image(filename='figures/strategy-growth-price-counterfactual.png'))\nplt.close(fig)\nfor key in ['direct_at_self_service_price','self_service_at_direct_price','direct_three_starts']:\n    r=data['variants'][key]\n    print(key, 'ending cash',round(r['summary']['final_cash'],2),'period 6 funding surplus',round(r['rows'][-1]['operating_result'],2))"),
    md("### 4. Separate capacity and cash timing"),
    code("fig=cash_paths(data)\ndisplay(Image(filename='figures/strategy-growth-channel-cash-paths.png'))\nplt.close(fig)\nfor key in ['agency_ready_at_start','self_service_automated','direct_two_period_collection']:\n    print(key,data['variants'][key]['summary'])"),
    md("### 5. Independently check the direct cohort and cash boundary"),
    code("from decimal import Decimal as D\nfrom math import isclose\nstarts=[3,4,5,5,5,5]\ncounts=[sum(D(starts[i])*D('.98')**(j-i) for i in range(j+1)) for j in range(6)]\nexpected_cash=D(40000-36000-27*150)-sum(counts)*12+sum(counts[:-1])*399*D('.971')\nassert abs(D(str(data['base']['assisted_direct']['summary']['final_cash']))-expected_cash)<D('.000001')\nfor r in [*data['base'].values(),*data['variants'].values()]:\n    s=r['summary']\n    assert isclose(s['final_cash'],40000+s['contribution']-36000-s['receivable_final'],abs_tol=1e-8)\n    assert all(x['delivery_hours']<=60+1e-8 and x['commercial_hours']<=40+1e-8 for x in r['rows'])\nprint('Independent cohort cash and capacity checks pass.')"),
    md("## Takeaways\n\nTest paid merchant value and recurring use before scaling acquisition. Better price, retention and lower support must be earned. A ready agency or different willingness to pay can change the sequence. Fractional balances and deterministic scenarios carry no probability estimate. Integration remains in [HANDOFF.md](HANDOFF.md)."),
]

pitches=[
    md("# Three Investment Pitches: Operating Mechanisms and Return Hurdles\n\n## tl;dr\n\nToast: the trailing-year model yields $37/share in the base and a $24.33 entry hurdle for a 15% annual return. Harvey: the $15.5bn equivalent entry needs $51.43bn exit equity for a 20% five-year return after 25% dilution. Vanta: the base cohort model gives 17.4% at a $4.15bn equivalent entry, or a $3.71bn maximum entry for the 20% hurdle. These are conditions, not probability-weighted forecasts."),
    md("## Context & Methods\n\nCompany data was verified October 12, 2026. Primary financial and product sources are registered alongside each manuscript. The Toast quote is a separately dated secondary market readout.\n\n### Key Assumptions\n\n[inputs.json](inputs.json) separates reported anchors, derived quantities, missing data and future assumptions. $400m Harvey starting ARR is only an illustrative normalization. Vanta combines an April 2026 ARR checkpoint with an older financing benchmark for hypothetical underwriting; it does not reconstruct the Series D investor's return. Private models exclude security preferences, fees and secondary premiums."),
    md("## Data\n\n### 1. Inspect the source/assumption manifest"),
    code("import json\nfrom pathlib import Path\nfrom models import results\nfrom figures import toast_entry, customer_bars, harvey_hurdle, vanta_growth\nfrom pitches.verify import independent_math\nfrom IPython.display import display, Markdown, Image\nimport matplotlib.pyplot as plt\np=results()\ninputs=json.loads(Path('inputs.json').read_text())\nfor company in ['toast','harvey','vanta']:\n    print(company, json.dumps(inputs[company],indent=2))"),
    md("## Results\n\n### 2. Toast: the trailing-year engine and entry price\n\nUse FY2025 minus H12025 plus H12026; do not annualize strong Q2. Payments GP excludes the non-payment fintech amount."),
    code("t=p['toast']\nprint('TTM recurring GP:', t['ttm_gp_anchor'])\nprint('TTM operating income:',t['ttm_operating_income_m'],'million; TTM FCF:',t['ttm_fcf_m'],'million')\nrows=['| Path | Terminal price | Base/reference return | Entry for 15% |','| --- | ---: | ---: | ---: |']\nfor name,r in t['scenarios'].items():\n    rows.append(f\"| {name} | ${r['terminal_value_per_share']:.2f} | {r['returns_at_entry']['31.29']:.1%} | ${r['maximum_entry_for_15_percent']:.2f} |\")\ndisplay(Markdown('\\n'.join(rows)))\nfig=toast_entry(t)\ndisplay(Image(filename='../figures/toast-entry-price-return.png'))\nplt.close(fig)"),
    md("### 3. Harvey: eligible time, contribution and the return burden\n\nThe customer model excludes removed collectible hourly fees. Time and wages are not automatically incremental profit. Current ARR and actual delivery economics remain unverified."),
    code("h=p['harvey']\nprint('Customer-value model:',h['customer_value'])\nprint('Delivery margin cases:',h['delivery'])\nprint('Hurdles:',h['hurdles'])\nprint('Growth required from ARR normalizations:',h['growth_required_by_starting_arr'])\nfor fn,path in [(customer_bars,'../figures/harvey-time-to-contribution.png'),(harvey_hurdle,'../figures/harvey-return-hurdle.png')]:\n    fig=fn(h,'harvey') if fn is customer_bars else fn(h)\n    display(Image(filename=path))\n    plt.close(fig)"),
    md("### 4. Vanta: cash capture, retained cohorts and new business\n\nAnnual new ARR is added at year-end; retained expansion is applied after losses. Ending ARR is not cash or recognized revenue. Buyer weekly hours exclude the separately modeled questionnaire time."),
    code("v=p['vanta']\nprint('Buyer cash capture:',v['customer_value'])\nrows=['| Year | Opening ARR | Lost | Retained expansion | New ARR | Ending ARR |','| --- | ---: | ---: | ---: | ---: | ---: |']\nfor r in v['scenarios']['base']['rows']:\n    rows.append('| '+str(r['year'])+' | '+' | '.join(f\"${r[k]/1e6:,.1f}m\" for k in ['opening_arr','lost_arr','retained_expansion_arr','new_arr','ending_arr'])+' |')\ndisplay(Markdown('\\n'.join(rows)))\nfor fn,path in [(customer_bars,'../figures/vanta-cash-capture.png'),(vanta_growth,'../figures/vanta-cohort-growth.png')]:\n    fig=fn(v,'vanta') if fn is customer_bars else fn(v)\n    display(Image(filename=path))\n    plt.close(fig)"),
    md("### 5. Independent validation\n\nDecimal earnings bridges, inverse investor-proceeds checks, closed-form cohort sums and separate customer-value recomputations."),
    code("checks=independent_math()\nassert checks['status']=='pass'\nprint(json.dumps(checks,indent=2))"),
    md("## Takeaways\n\nA useful product and a good investment require separate evidence. Toast's cash acquisition and physical deployment matter. Harvey's value must reach customer contribution and durable margins. Vanta's recurring job must survive the first audit. Real private-company underwriting still needs verified financials, cash requirements and security terms. Full manuscripts and integration paths are in [../HANDOFF.md](../HANDOFF.md)."),
]


if __name__=='__main__':
    if '--pitches-only' in sys.argv:
        prior=json.loads((HERE/'notebook-verification.json').read_text())
        receipts=[prior[0],execute(pitches,HERE/'models.ipynb',HERE)]
    else:
        receipts=[execute(strategy,LANE/'model.ipynb',LANE),execute(pitches,HERE/'models.ipynb',HERE)]
    manifest=[build(c) for c in CONFIGS]
    (HERE/'article-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (HERE/'notebook-verification.json').write_text(json.dumps(receipts,indent=2)+'\n')
    print(json.dumps(receipts,indent=2))
