"""Focused manuscript, schema-shape, figure and independent arithmetic checks."""
from decimal import Decimal
from math import isclose
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from model import results

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ARTICLE = ROOT / "src/personal/editorial/data/articles/choosing-a-growth-channel-under-a-capacity-limit.json"
article = json.loads(ARTICLE.read_text())
data = results()
receipts = json.loads((HERE / "source-verification.json").read_text())
assert len(receipts) == 8 and all(r.get("status") == 200 and r.get("fragment_present") for r in receipts)
assert article["openingPresentation"] == "integrated"
assert len(article["markdownSections"]) >= 8
ids = [s["id"] for s in article["markdownSections"]]
assert len(ids) == len(set(ids))
assert all(len(row) == len(t["columns"]) for t in article["tables"] for row in t["rows"])
assert len(article["sources"]) == 7

# Independent decimal cohort sums: no call to the simulator's recurrence.
starts = [3, 4, 5, 5, 5, 5]
retention = Decimal("0.98")
counts = [sum(Decimal(starts[i]) * retention ** (period-i) for i in range(period+1)) for period in range(6)]
billings = sum(counts) * Decimal(399)
contribution = sum(counts) * (Decimal(399) * Decimal("0.971") - Decimal(12)) - Decimal(27 * 150)
cash = Decimal(40_000 - 36_000 - 27 * 150) - sum(counts) * Decimal(12) + sum(counts[:-1]) * Decimal(399) * Decimal("0.971")
direct = data["base"]["assisted_direct"]
assert abs(Decimal(str(direct["summary"]["active_final"])) - counts[-1]) < Decimal("0.00000001")
assert abs(Decimal(str(direct["summary"]["gross_billings"])) - billings) < Decimal("0.00000001")
assert abs(Decimal(str(direct["summary"]["contribution"])) - contribution) < Decimal("0.00000001")
assert abs(Decimal(str(direct["summary"]["final_cash"])) - cash) < Decimal("0.00000001")

for record in [*data["base"].values(), *data["variants"].values()]:
    s = record["summary"]
    assert isclose(s["final_cash"], 40_000 + s["contribution"] - 36_000 - s["receivable_final"], abs_tol=1e-8)
    assert all(r["delivery_hours"] <= 60+1e-8 and r["commercial_hours"] <= 40+1e-8 for r in record["rows"])

assert [r["new"] for r in data["base"]["self_service"]["rows"]] == [8,12,16,15,11,8]
# Independent boundary: period-four existing support plus a sixteenth start
# consumes 61.12 hours; fifteen starts fit. It catches first-period support omission.
retained_self = (Decimal(8)*Decimal(".96")**2 + Decimal(12)*Decimal(".96") + 16) * Decimal(".96")
assert retained_self * Decimal(".75") + 15 * Decimal("2.25") <= 60
assert retained_self * Decimal(".75") + 16 * Decimal("2.25") > 60

table = next(t for t in article["tables"] if t['id'] == "channel-results")
for row, key in zip(table["rows"], ["assisted_direct", "agency_referral", "self_service"]):
    r = data["base"][key]
    assert row[1] == f"{r['summary']['active_final']:.2f}"
    assert row[2] == f"${r['summary']['contribution']:,.0f}"
    assert row[3] == f"{r['rows'][-1]['delivery_hours']:.2f} / 60h"
    assert row[4] == f"${r['summary']['final_cash']:,.0f}"

assert isclose(data["base"]["assisted_direct"]["summary"]["contribution"], data["variants"]["direct_two_period_collection"]["summary"]["contribution"])
assert round(data["variants"]["direct_price_299"]["rows"][-1]["operating_result"]) == 433
assert round(data["variants"]["direct_price_249"]["rows"][-1]["operating_result"]) == -820
assert round(sum(r["variable_cost"]+r["acquisition_cost"]+6000 for r in direct["rows"][:2])) == 13_169

figures = [f for section in article["markdownSections"] for f in section.get("figures", [])]
assert len(figures) == 3
for figure in figures:
    path = HERE / "figures" / Path(figure["src"]).name
    svg = ET.parse(path).getroot()
    viewbox = [float(v) for v in svg.attrib["viewBox"].split()]
    assert isclose(viewbox[2] / viewbox[3], figure["width"] / figure["height"], rel_tol=1e-5)
    assert path.with_suffix(".png").is_file()
    assert len(figure["alt"]) > 50

values = [article["title"], article["subtitle"], *article["content"]]
for section in article["markdownSections"]:
    values.append(section["title"])
    for block in section['blocks']:
        if block['kind']=='markdown':values.append(block['markdown'])
        else:
            t=next(t for t in article['tables'] if t['id']==block['tableId'])
            values += [t.get("title", ""), *t["columns"], *sum(t["rows"], []), t.get("note", "")]
    values += [f["caption"] for f in section.get("figures", [])]
text = re.sub(r"\]\([^)]*\)", "]", " ".join(values))
words = len(re.findall(r"\b[\w’'-]+\b", text))
assert article["readTime"] == f"{round(words/220)} MIN"
assert json.loads((HERE / "catalog-entry.json").read_text())["slug"] == article["slug"]

record = {"status":"pass", "main_manuscript_words":words, "reading_minutes":round(words/220), "sources_resolving":len(article['sources']), "sections":len(article['markdownSections']), "tables":len(article['tables']), "figures":len(figures),
          "independent_math":"Decimal cohort-sum recomputation and capacity boundary pass", "article_sha256":hashlib.sha256(ARTICLE.read_bytes()).hexdigest(),
          "figure_sha256":{Path(f['src']).name:hashlib.sha256((HERE/'figures'/Path(f['src']).name).read_bytes()).hexdigest() for f in figures},
          "publication":"unperformed; shared catalog and artwork/route integration owned by parent"}
(HERE / "verification.json").write_text(json.dumps(record,indent=2)+"\n")
print(json.dumps(record,indent=2))
