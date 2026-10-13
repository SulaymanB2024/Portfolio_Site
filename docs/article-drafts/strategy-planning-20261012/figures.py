"""Render the two editorial figures from model-results.json.

Requires matplotlib. Exports standalone SVG and PNG; no remote assets.
"""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

HERE = Path(__file__).resolve().parent
PAPER, INK, MUTED, LINE = "#f5f2ea", "#24221e", "#625f56", "#d9d4c9"
plt.rcParams.update({
    "font.family": "DejaVu Serif", "font.size": 15,
    "text.color": INK, "axes.labelcolor": INK, "axes.edgecolor": LINE,
    "xtick.color": MUTED, "ytick.color": INK,
    "svg.fonttype": "none", "svg.hashsalt": "strategy-planning-20261012",
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.spines.left": False, "axes.spines.bottom": True,
    "figure.facecolor": "white", "axes.facecolor": "white",
    "savefig.facecolor": "white", "axes.titleweight": "normal",
})


def save(fig, name):
    directory = HERE / "figures"
    directory.mkdir(exist_ok=True)
    svg = directory / f"{name}.svg"
    fig.savefig(svg, metadata={"Date": None})
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
    fig.savefig(directory / f"{name}.png", dpi=140)
    return fig


def cash_capacity(data):
    fig = plt.figure(figsize=(11, 6.3), dpi=100)
    fig.text(.035, .947, "More stores can leave less cash", fontsize=26)
    fig.text(.035, .897, "Declared scenarios · six 30-day periods · $40,000 starting cash", fontsize=14, color=MUTED)
    cash_ax = fig.add_axes([.26, .27, .30, .43])
    hours_ax = fig.add_axes([.68, .27, .26, .43])
    keys = ["assisted_direct", "agency_referral", "self_service"]
    y = [2, 1, 0]
    for index, key in enumerate(keys):
        record = data["base"][key]
        cash = record["summary"]["final_cash"]
        hours = record["rows"][-1]["delivery_hours"]
        cash_ax.barh(y[index], cash, height=.48, facecolor=INK if index == 0 else "#b0aca3", edgecolor=INK, linewidth=.8)
        hours_ax.barh(y[index], hours, height=.48, facecolor=INK if index == 0 else "#b0aca3", edgecolor=INK, linewidth=.8)
        text_color = "white" if index == 0 else INK
        cash_ax.text(cash - 500, y[index], f"${cash:,.0f}", va="center", ha="right", fontsize=14, color=text_color)
        hours_ax.text(hours - 1.5, y[index], f"{hours:.1f}", va="center", ha="right", fontsize=14, color=text_color)
    cash_ax.set_yticks(y, [f"{data['base'][key]['inputs']['name']}\n{data['base'][key]['summary']['active_final']:.1f} active stores" for key in keys])
    cash_ax.tick_params(axis="y", length=0, pad=12, labelsize=15)
    cash_ax.set_xlim(0, 29_000)
    cash_ax.set_xticks([0, 10_000, 20_000])
    cash_ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: "$0" if v == 0 else f"${v/1000:.0f}k"))
    cash_ax.axvline(data["reserve"], color=MUTED, linestyle=(0, (3, 3)), linewidth=1, zorder=0)
    cash_ax.text(data["reserve"] + 700, 2.62, "$10k reserve", fontsize=13, color=MUTED)
    cash_ax.set_ylim(-.55, 2.8)
    cash_ax.set_xlabel("Ending cash (USD)", labelpad=16)
    cash_ax.set_title("Cash after period 6", loc="left", fontsize=17, pad=37)
    hours_ax.set_yticks([])
    hours_ax.set_xlim(0, 70)
    hours_ax.set_xticks([0, 20, 40, 60])
    hours_ax.set_ylim(-.55, 2.8)
    hours_ax.axvline(60, color=MUTED, linestyle=(0, (3, 3)), linewidth=1)
    hours_ax.text(60, 2.62, "60h limit", ha="right", fontsize=13, color=MUTED)
    hours_ax.set_xlabel("Delivery hours", labelpad=16)
    hours_ax.set_title("Period 6 work", loc="left", fontsize=17, pad=37)
    fig.text(.035, .115, "The direct offer preserves cash while leaving delivery capacity for product improvement.", fontsize=15)
    fig.text(.035, .065, "Modeled outcomes. Includes one-period collection lag; period 6 receivables are uncollected.", fontsize=13, color=MUTED)
    return save(fig, "strategy-growth-channel-cash-capacity")


def cash_paths(data):
    fig = plt.figure(figsize=(11, 6.5), dpi=100)
    fig.text(.035, .948, "Changing the constraint changes the cash path", fontsize=24)
    fig.text(.035, .897, "Declared scenarios · end-of-period cash · six 30-day periods", fontsize=14, color=MUTED)
    ax = fig.add_axes([.09, .255, .64, .55])
    series = [
        ("Assisted direct", data["base"]["assisted_direct"], "-", "o", INK),
        ("Direct: longer collections", data["variants"]["direct_two_period_collection"], (0, (6, 3)), "o", MUTED),
        ("Self-service", data["base"]["self_service"], (0, (2, 2)), "s", INK),
        ("Self-service: automated", data["variants"]["self_service_automated"], (0, (8, 3, 2, 3)), "s", MUTED),
    ]
    for label, record, style, marker, color in series:
        values = [data["starting_cash"]] + [row["cash"] for row in record["rows"]]
        ax.plot(range(7), values, label=label, linestyle=style, marker=marker, markersize=5, color=color, linewidth=1.8, markerfacecolor="white" if color == MUTED else color)
        # Right-side exact labels share the chart's quantitative y coordinate.
        label_y = values[-1] + (400 if label == "Self-service" else -400 if label.endswith("automated") else 0)
        short_label = {"Assisted direct": "Direct", "Direct: longer collections": "Direct: 2-period lag", "Self-service": "Self-service", "Self-service: automated": "Automated self-service"}[label]
        ax.plot([6, 6.16], [values[-1], label_y], color=color, linewidth=.7, clip_on=False)
        ax.text(6.2, label_y, f"{short_label}  ${values[-1]:,.0f}", fontsize=12.5, color=INK, va="center")
    ax.axhline(data["reserve"], color=MUTED, linestyle=(0, (3, 3)), linewidth=.9)
    ax.text(.10, data["reserve"] + 700, "$10,000 reserve", fontsize=12.5, color=MUTED)
    ax.set_xlim(0, 6.15)
    ax.set_ylim(0, 45_000)
    ax.set_xticks(range(7))
    ax.set_yticks([0, 10_000, 20_000, 30_000, 40_000])
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: "$0" if v == 0 else f"${v/1000:.0f}k"))
    ax.set_xlabel("Planning period (30 days)", labelpad=13)
    ax.tick_params(axis="both", labelsize=13)
    ax.grid(axis="y", color=LINE, linewidth=.6, alpha=.65)
    ax.set_axisbelow(True)
    fig.text(.035, .12, "Faster self-service setup admits more customers and advances acquisition spending.", fontsize=15)
    fig.text(.035, .072, "The longer direct collection lag changes cash, while contribution stays the same.", fontsize=15)
    fig.text(.035, .032, "Modeled balances, not observed results. Discrete periods are joined for comparison.", fontsize=12.5, color=MUTED)
    return save(fig, "strategy-growth-channel-cash-paths")


if __name__ == "__main__":
    data = json.loads((HERE / "model-results.json").read_text())
    cash_capacity(data)
    cash_paths(data)
    plt.close("all")
    print("Rendered 2 figures in SVG and PNG")
