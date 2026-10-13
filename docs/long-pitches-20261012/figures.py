"""Original publication figures and notebook exports, from frozen source/model inputs."""
import json
import re
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from models import load_inputs, results, serial

ROOT = Path(__file__).resolve().parent
INK, MUTED, LINE, PAPER = "#24221e", "#625f56", "#d9d4c9", "#f5f2ea"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 16, "text.parse_math": False,
    "text.color": INK, "axes.labelcolor": INK, "xtick.color": MUTED, "ytick.color": MUTED,
    "axes.edgecolor": LINE, "axes.spines.top": False, "axes.spines.right": False,
    "svg.fonttype": "none", "svg.hashsalt": "four-longs-20261012", "savefig.dpi": 180})


def frame(title, subtitle, height=7):
    fig, ax = plt.subplots(figsize=(12, height))
    fig.patch.set_facecolor(PAPER); ax.set_facecolor("none")
    fig.subplots_adjust(left=.105, right=.96, top=.78, bottom=.22)
    fig.text(.105, .94, title, fontsize=23, fontfamily="DejaVu Serif", ha="left", va="top")
    fig.text(.105, .865, subtitle, fontsize=15, color=MUTED, ha="left", va="top")
    ax.set_axisbelow(True); ax.grid(axis="y", color=LINE, linewidth=.8)
    ax.tick_params(axis="both", length=0, pad=9)
    return fig, ax


def save(fig, directory, name, note):
    fig.text(.105, .08, note, fontsize=13, color=MUTED, ha="left", va="top")
    directory.mkdir(parents=True, exist_ok=True)
    fig.savefig(directory / (name + ".png"), facecolor=PAPER)
    fig.savefig(directory / (name + ".svg"), transparent=True, metadata={"Date": None, "Creator": "Sulayman Bowles · four equity long pitches"})
    path = directory / (name + ".svg")
    svg = path.read_text().replace("'DejaVu Sans'", "Arial, sans-serif").replace("'DejaVu Serif'", "Georgia, serif")
    svg = re.sub(r'width="[0-9.]+pt"', 'width="2160"', svg, count=1)
    svg = re.sub(r'height="[0-9.]+pt"', f'height="{round(fig.get_figheight()*180)}"', svg, count=1)
    path.write_text(svg); plt.close(fig)


def movement(directory, name, title, subtitle, labels, values, note):
    fig, ax = frame(title, subtitle)
    ax.spines["left"].set_visible(False)
    for i, value in enumerate(values):
        ax.bar(i, value, .54, facecolor=INK if value >= 0 else "none", edgecolor=INK, hatch="///" if value < 0 else None, linewidth=1)
        ax.text(i, value + (1.0 if value >= 0 else -1.6), f"{value:+.1f}%", ha="center", fontsize=19, va="bottom" if value >= 0 else "top")
    ax.axhline(0, color=INK, lw=.8)
    ax.set_xticks(range(len(labels)), labels)
    ax.set_ylim(min(-2, min(values)-6), max(values)+7)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda y, _: f"{y:g}%"))
    ax.set_ylabel("Year-over-year change", labelpad=15)
    save(fig, directory, name, note)


def build_figures(directory=ROOT / "figures"):
    inputs = load_inputs(); output = serial(results(inputs))
    software = json.loads((ROOT / "research/software/inputs.json").read_text())
    physical = json.loads((ROOT / "research/physical/evidence.json").read_text())
    adobe = software["ADBE"]
    movement(directory, "adobe-growth-quality", "Paid growth and per-share growth have different drivers",
        "Adobe · matching first nine months · FY2025 → FY2026", ["Revenue", "GAAP net\nincome", "Diluted average\nshares", "GAAP diluted\nEPS"],
        [(19776/17575-1)*100, (5428/5274-1)*100, (403/430-1)*100, (13.47/12.26-1)*100],
        "Reported results, including acquisitions. Share reduction amplifies modest net-income growth.\nSource: Adobe Q3FY2026 Form 10-Q. EPS growth uses reported rounded EPS.")
    movement(directory, "paypal-transaction-economics", "Payment volume is growing faster than margin dollars",
        "PayPal · reported Q2 2026 vs Q2 2025 · matching USD measures", ["Payment\nvolume", "Net\nrevenue", "Transaction margin\nex-customer interest", "Non-transaction\nopex · adjusted"],
        [(486448/443547-1)*100, (8682/8288-1)*100, (3619/3526-1)*100, (2393/2200-1)*100],
        "All changes use reported dollars; transaction margin and adjusted opex are non-GAAP.\nSource: PayPal Q2 2026 earnings release. Growth rates are not currency-neutral rates.")
    movement(directory, "crocs-profit-and-shares", "A smaller share count lifted EPS as profit fell",
        "Crocs · adjusted Q2 2026 vs Q2 2025 · SBC remains in adjusted earnings", ["Adjusted net\nincome", "Adjusted diluted\naverage shares", "Adjusted diluted\nEPS"],
        [(225.674/237.477-1)*100, (49.628/56.148-1)*100, (4.55/4.23-1)*100],
        "EPS growth is real per share; the business-profit decline still needs attention.\nSource: Crocs Q2 2026 earnings reconciliation. EPS uses reported rounded values.")
    fig, ax = frame("Consumer and partner growth convert differently", "Expedia · matching Q2 2026 vs Q2 2025 · reported segment results")
    values = [(2677/2479-1)*100, (889/728-1)*100, (1493/1209-1)*100, (369/331-1)*100]
    for i, value in enumerate(values):
        ax.bar(i, value, .55, facecolor=INK if i % 2 == 0 else "none", edgecolor=INK, hatch=None if i % 2 == 0 else "///")
        ax.text(i, value+1, f"+{value:.1f}%", ha="center", fontsize=19)
    ax.set_xticks(range(4), ["B2C\nrevenue", "B2C\nadjusted EBITDA", "B2B\nrevenue", "B2B\nadjusted EBITDA"])
    ax.set_ylim(0, 32); ax.spines["left"].set_visible(False)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda y, _: f"{y:g}%")); ax.set_ylabel("Year-over-year change", labelpad=15)
    save(fig, directory, "expedia-segment-conversion", "B2C EBITDA margin: 29.4% → 33.2%  /  B2B: 27.4% → 24.7%\nSource: Expedia Q2 2026 segment data. Segment EBITDA is company-adjusted.")

    names = {"ADBE": "adobe", "PYPL": "paypal", "CROX": "crocs", "EXPE": "expedia"}
    for company in inputs["companies"]:
        symbol = company["symbol"]; root = names[symbol]; data = output["companies"][symbol]; t = data["ttm"]
        labels = ["Operating\ncash", "Cash\ncapex", "CFO-added\nSBC"]
        deltas = [t["cfo"], -t["capex"], -t["sbc"]]
        for adjustment in company["cash_normalizations"]:
            labels.append({"PYPL": "Capitalized\nSBC" if len(labels) == 3 else "Retained-loan\nreinvestment", "CROX": "Author recurring\ncash adjustment", "EXPE": "Net travel-WC\nsensitivity"}[symbol])
            deltas.append(adjustment["amount"])
        labels.append("Underwriting\ncash anchor"); values = deltas + [t["owner_cash_proxy"]]
        fig, ax = frame("From reported operating cash to the cash I underwrite", f"{company['company']} · trailing period ending {company['ttm_period_end']} · USD billions")
        current = 0
        for i, value in enumerate(values):
            amount = value / 1000
            if i == 0 or i == len(values)-1:
                ax.bar(i, amount, .54, color=INK); top = amount
            else:
                ax.bar(i, -amount, bottom=(current+amount), width=.54, facecolor="none", edgecolor=INK, hatch="///", lw=1)
                top = current
            ax.text(i, top + max(values)/1000*.045, f"{amount:+.3f}" if i not in (0, len(values)-1) else f"{amount:.3f}", ha="center", fontsize=16)
            if i != len(values)-1: current += amount
        ax.set_xticks(range(len(labels)), labels, fontsize=14)
        ax.set_ylim(0, max(values)/1000*1.22); ax.spines["left"].set_visible(False)
        ax.set_ylabel("Annual cash · $bn", labelpad=15)
        notes = {
            "ADBE": "SBC charge is an economic-cost proxy. No cash bonus for debt or customer balances.\nSources: FY2025 + current nine months − prior nine months. Author calculation.",
            "PYPL": "Retained loan investment is cash reinvestment, not a credit loss. No BNPL timing uplift.\nSources: FY2025 + current H1 − prior H1. Author economic-cost sensitivity.",
            "CROX": "Reported CFO − capex − SBC = $0.663bn; $0.600bn is a lower author cash assumption.\nSources: FY2025 + current H1 − prior H1. Refund received after June is excluded.",
            "EXPE": "Travel-WC removes deferred bookings + merchant AP + total AR cash change; AR is a proxy.\nSources: FY2025 + current H1 − prior H1. Extra equity-SBC sensitivity: $2.558bn.",
        }
        save(fig, directory, root+"-cash-underwriting", notes[symbol])

        fig, ax = frame("What the operating cases imply for the share price", f"{symbol} · October 12, 2028 price scenarios · USD per original share")
        ax.grid(axis="y", visible=False); ax.grid(axis="x", color=LINE, linewidth=.8)
        for i, case in enumerate(data["scenarios"]):
            price = case["terminal_price"]
            ax.plot([0, price], [i, i], color=LINE, lw=2)
            ax.scatter(price, i, s=100, facecolor=INK if i == 1 else PAPER, edgecolor=INK, marker="o", zorder=3)
            ax.text(price+max(s["terminal_price"] for s in data["scenarios"])*.035, i, f"${price:,.0f}", fontsize=20, va="center")
        ax.axvline(company["entry_close"], color=MUTED, ls=(0, (3, 4)), lw=1.2)
        ax.text(company["entry_close"], -.6, f"Entry ${company['entry_close']:.2f}", ha="center", fontsize=14, color=MUTED)
        ax.set_yticks(range(3), [case["name"] for case in data["scenarios"]]); ax.invert_yaxis()
        ax.set_ylim(2.5, -.85); ax.set_xlim(0, max(s["terminal_price"] for s in data["scenarios"])*1.2)
        ax.set_xlabel("Modeled share price · $", labelpad=12)
        ax.spines["left"].set_visible(False); ax.tick_params(axis="y", pad=15)
        save(fig, directory, root+"-price-scenarios", "Author operating paths, cash-funded net share reduction and terminal cash multiples.\nScenarios are not probabilities or confidence intervals. Dividends shown separately in the article.")
    print("Built twelve source/model-backed SVGs and PNG exports.")


if __name__ == "__main__":
    build_figures()
