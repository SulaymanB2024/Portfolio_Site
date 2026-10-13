import json
import shutil
from pathlib import Path
import nbformat
from nbclient import NotebookClient

ROOT=Path(__file__).resolve().parent
nb=nbformat.v4.new_notebook()
nb["metadata"]={"kernelspec":{"name":"python3","display_name":"Python 3","language":"python"},"language_info":{"name":"python"}}
md=nbformat.v4.new_markdown_cell;code=nbformat.v4.new_code_cell
nb["cells"]=[
    md("# Can Chegg finance its own reinvention?\n\nPublic-source financial case study by Sulayman Bowles. Evidence cutoff: October 12, 2026. Currency: USD millions. Reported data end June 30; the September debt repayment is a subsequent event. This notebook contains historical calculations and **illustrative scenarios**, not a stock valuation or calendar-quarter forecast."),
    code("from model import load_inputs, historical, replacement, run_scenario, write_outputs, serialize\nfrom verify import verify\nfrom decimal import Decimal\nfrom pathlib import Path\nimport json\ninputs = load_inputs()\nverify()"),
    md("## Sources and periods\n\nThe source register names the actual statement sections and the limits of each primary source. The approximate $38m reference is June 30 liquidity pro forma for repayment, not a reported September or October cash balance."),
    code("register = json.loads(Path('source-register.json').read_text())\nfor source in register['sources']:\n    print(source['id'], source['label'], source['date'])\n    print(source['href'])"),
    md("## The historical cash bridge\n\nFree cash flow improved because lower cash capex exceeded the fall in operating cash flow. Working-capital and restructuring payments are already inside reported CFO; they are not deducted twice."),
    code("print(json.dumps(serialize(historical(inputs)), indent=2))"),
    md("## Replacement-growth hurdle\n\nComparable-period stress using Q2 2026 revenue bases. The 70% academic and 45% skilling contribution margins are **author assumptions**, not disclosed product margins. Equal margins make the revenue and contribution hurdles identical."),
    code("for decline in ('0.20','0.30','0.40'):\n    print(json.dumps(serialize(replacement(inputs, Decimal(decline))), indent=2))"),
    md("## Four-quarter liquidity stress\n\nHypothetical sequential quarters without seasonality. Initial revenue and earnings proxy are calibrated to Q3 guidance midpoints; future rates, capex, conversion drag and the reserve floor are assumptions. This stress test can differ from management's positive second-half cash-flow outlook. Debt payoff is already in the $38m reference; there is no second debt outflow."),
    code("print(json.dumps(inputs['stress_test'], indent=2))\nresults = write_outputs(Path('outputs'))\nprint(json.dumps(serialize(results['scenarios']), indent=2))"),
    md("## Publication figures\n\nFigures retain matching periods, units and their observed-versus-modeled boundaries. The scenario chart is not a trajectory of reported company cash balances."),
    code("from figures import build_figures\nfrom IPython.display import Image, display\nbuild_figures()\nfor name in ('chegg-revenue-replacement','chegg-free-cash-flow-bridge','chegg-liquidity-stress-test'):\n    display(Image(filename='figures/' + name + '.png'))"),
    md("## Use the model\n\nEdit `inputs.json`, then rerun all cells. Each extra $1m of quarterly capex reduces four-quarter ending liquidity by $4m if other assumptions stay fixed. The verification checks this sensitivity and the one-time-spending boundary independently. A model reserve breach is a decision signal, not proof of insolvency.")
]
NotebookClient(nb,timeout=120,kernel_name="python3",resources={"metadata":{"path":str(ROOT)}}).execute()
nbformat.write(nb,ROOT/"worked-model.ipynb")
print("Executed notebook:",sum(c.cell_type=="code" for c in nb.cells),"code cells;",sum(len(c.get("outputs",[])) for c in nb.cells),"outputs")
