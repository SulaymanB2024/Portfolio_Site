"""Integrate reviewed manuscripts, calculated exhibits and actual primary-source ledgers."""
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parents[1]
inputs = json.loads((ROOT / "inputs.json").read_text())
output = json.loads((ROOT / "outputs/model-results.json").read_text())
software = json.loads((ROOT / "research/software/inputs.json").read_text())
sources = json.loads((ROOT / "research/software/evidence.json").read_text())["sources"]
sources += json.loads((ROOT / "research/physical/source-register.json").read_text())
source_by_id = {x["id"]: x for x in sources}

CONFIG = {
    "ADBE": {"slug": "adobe-paid-workflows", "title": "Adobe: Paid Workflows at a Price I Like", "displayTitle": "Adobe: paid workflows at a price I like.", "lines": ["Adobe: paid workflows", "at a price I like."], "sketch": "yuru-25", "prefix": "A", "figure_name": "adobe", "manuscript": "research/software/manuscript-adobe.md", "subtitle": "A long on recurring creative and document demand, with a cash budget for AI, acquisitions and fewer shares.",
        "source_specs": [("A1", "adbe-fy-2025", "Adobe FY2025 Form 10-K", "Annual cash and earnings; Figma termination payment; product and competitive risks."), ("A2", "adbe-q3-2026", "Adobe Q3FY2026 Form 10-Q", "Comparable nine-month financial statements, share count, acquisition costs, ARR and obligations."), ("A3", "adbe-q3-2026-release", "Adobe Q3FY2026 financial results", "Company results and FY2026 GAAP/non-GAAP guidance; guidance is not a reported result."), ("A4", "adbe-q3-2026-datasheet", "Adobe Q3FY2026 investor datasheet", "Recurring-revenue measures and restated comparisons; acquisitions remain included."), ("A5", "adbe-q3-2026-prepared-remarks", "Adobe Q3FY2026 prepared remarks", "AI-first ARR greater than $650m is a floor; MAU does not mean paid customers."), ("A6", "adbe-ceo-transition-2026", "Adobe announces its scheduled CEO transition", "Anil Chakravarthy's transition is effective December1,2026; no value is added merely for the change.")],
        "extra_sources": [{"id": "A7", "label": "Adobe expands its creative agent", "href": "https://news.adobe.com/news/2026/06/adobe-unveils-major-expansion", "publisher": "Adobe News", "date": "2026-06-18", "type": "Product announcement", "note": "Public-beta assistants and private-beta unified studio; availability does not establish adoption or profitability.", "limitation": "Company product description, not independent evidence of customer outcomes."}],
        "slots": {"the-paid-business-is-still-growing": ("history", "operating"), "the-cash-bridge-makes-the-entry-attractive": ("cash", "cash"), "fewer-shares-need-a-cash-budget": ("budget", None), "how-i-get-to-365": ("reverse", None), "the-alternatives-are-meaningfully-different": ("scenarios", "scenarios"), "what-i-will-judge-before-the-horizon": ("tests", None)},
        "tests": [["By latest available 2028 trailing period", "Revenue above $30bn; cash after CFO-SBC above $9bn; comparable ARR growth at least7%"], ["Capital allocation", "Net shares near359m, with affordable purchases and no reliance on expanding debt"], ["Reconsider", "Two successive ARR readings below5%, GAAP operating margin below30%, or trailing cash after SBC below$7.5bn"]]},
    "PYPL": {"slug": "paypal-margin-dollar-recovery", "title": "PayPal: A Modest Recovery Worth Buying at $56", "displayTitle": "PayPal: a modest recovery at $56.", "lines": ["PayPal: a modest recovery", "at $56."], "sketch": "yuru-26", "prefix": "P", "figure_name": "paypal", "manuscript": "research/software/manuscript-paypal.md", "subtitle": "A long on transaction-margin recovery, valued after employee equity, lending reinvestment and customer obligations.",
        "source_specs": [("P1", "pypl-fy-2025", "PayPal FY2025 Form 10-K", "Annual cash flows, retained-loan investing and compensation; current non-GAAP EPS keeps SBC."), ("P2", "pypl-q2-2026", "PayPal Q2 2026 Form 10-Q", "Comparable H1 cash/earnings, dated shares, corporate/customer cash and Luxembourg credit-funding disclosures."), ("P3", "pypl-q2-2026-release", "PayPal Q2 2026 earnings release", "Transaction contribution, costs, payment volume, cash reconciliation and declared dividend."), ("P4", "pypl-q2-2026-presentation", "PayPal Q2 2026 investor presentation", "Branded/Venmo activity, guidance and capital return; overlapping TPV groups are not added."), ("P5", "pypl-q2-2026-newsletter", "PayPal Q2 2026 IR newsletter", "Investment budget and gross savings; savings do not all become net profit."), ("P6", "pypl-fy-2025-release", "PayPal FY2025 earnings release", "Annual BNPL cash-flow reconciliation; timing adjustments do not remove credit economics."), ("P7", "pypl-q1-2026-release", "PayPal Q1 2026 earnings release", "Comparable interim adjusted cash reconciliation used in TTM bridge.")], "extra_sources": [],
        "slots": {"the-quarter-explains-why-the-valuation-stays-demanding": ("transaction", "operating"), "the-cash-i-am-willing-to-value": ("cash", "cash"), "a-modest-recovery-can-fund-meaningful-net-retirement": ("budget", None), "my-85-forecast-and-the-valuation-it-requires": ("reverse", None), "the-contrary-case-deserves-numbers": ("scenarios", "scenarios"), "what-would-make-me-keep-or-change-the-view": ("tests", None)},
        "tests": [["By Q2 2028", "Trailing TM dollars ex-customer interest above$16bn; strict distribution-cash measure above$5bn"], ["Consumer demand", "Two quarters of branded-checkout TPV growth at least4% currency-neutral; monthly active-account growth above2%"], ["Reconsider", "Two negative checkout-growth quarters, ex-interest TM below$14bn, or strict annual cash below$4bn"]]},
    "CROX": {"slug": "crocs-cash-and-brand-test", "title": "Crocs: A Cash Engine with a Brand Test", "displayTitle": "Crocs: a cash engine with a brand test.", "lines": ["Crocs: a cash engine", "with a brand test."], "sketch": "yuru-27", "prefix": "C", "figure_name": "crocs", "manuscript": "manuscript-crocs.md", "subtitle": "A long on the profitable footwear franchise, with cash-funded repurchases and an explicit tax-payment stress.",
        "source_specs": [("C1", "CROX-K25", "Crocs FY2025 Form 10-K", "Annual/earlier cash and revenue, geographic mix, impairment and uncertain tax positions."), ("C2", "CROX-Q226", "Crocs Q2 2026 Form 10-Q", "H1 cash, segments, price/volume bridge, share count, tax payable and subsequent tariff refund."), ("C3", "CROX-ER226", "Crocs Q2 2026 earnings release", "Adjusted profit and share bridge; GAAP/adjusted guidance excludes potential tariff refunds.")], "extra_sources": [], "slots": {},
        "tests": [["By latest available 2028 trailing period", "Crocs brand revenue above$3.6bn; recurring cash around$645m; fewer than44m outstanding shares"], ["Operating margin", "Consolidated adjusted operating margin above21%; evidence that direct expansion retains profit"], ["Reconsider", "Both Crocs geographies contract twice, margin below20%, cash below$500m with debt-funded purchases, or a material tax payment crowds out repurchases"]]},
    "EXPE": {"slug": "expedia-network-and-cash", "title": "Expedia: The Network Beyond the Booking", "displayTitle": "Expedia: the network beyond the booking.", "lines": ["Expedia: the network", "beyond the booking."], "sketch": "yuru-28", "prefix": "E", "figure_name": "expedia", "manuscript": "manuscript-expedia.md", "subtitle": "A long on consumer efficiency and partner distribution, with advance travel cash removed from the valuation anchor.",
        "source_specs": [("E1", "expe-fy-2025", "Expedia FY2025 Form 10-K", "Annual cash, travel working capital, compensation and segment results."), ("E2", "expe-q2-2026", "Expedia Q2 2026 Form 10-Q", "Comparable H1 statements, dated shares, customer/supplier obligations, investment/tax effects and segment data."), ("E3", "expe-q2-2026-release", "Expedia Q2 2026 earnings release", "Q2 segment conversion, booking definitions, guidance and declared dividend.")], "extra_sources": [], "slots": {},
        "tests": [["By Q2 2028", "Trailing B2B revenue above$7bn; B2B adjusted EBITDA margin at least25%; B2C margin at least31%"], ["Shareholder cash", "Conservative travel-WC/compensation cash sensitivity above$3bn and shares below114m"], ["Reconsider", "B2B margin below23% twice, B2C margin below28%, or annual cash sensitivity below$2.2bn"]]},
}


def slugify(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def f(value, decimals=1):
    return f"{value:,.{decimals}f}"


def table(caption, columns, rows, note):
    return {"caption": caption, "columns": columns, "rows": [[str(v) for v in row] for row in rows], "note": note}


def tables(company, conf):
    data = output["companies"][company["symbol"]]; t = data["ttm"]
    base = next(x for x in data["scenarios"] if x["name"] == "Base"); years = base["years"]
    prefix = conf["prefix"]; cite = f"[{prefix}1](#source-{prefix.lower()}1) [{prefix}2](#source-{prefix.lower()}2)"
    cash_rows = [["Operating cash flow", f(t["cfo"],3)], ["Cash capital expenditure", "−"+f(t["capex"],3)], ["Reported free cash flow", f(t["fcf"],3)], ["CFO-added stock compensation", "−"+f(t["sbc"],3)]]
    cash_rows += [[a["label"].split(":")[0], f(a["amount"],3)] for a in company["cash_normalizations"]]
    cash_rows += [["Cash underwriting anchor", f(t["owner_cash_proxy"],3)]]
    if company.get("equity_sbc_sensitivity_extra"):
        cash_rows.append(["Alternative equity-credit SBC sensitivity", f(t["equity_sbc_sensitivity_owner_cash"],3)])
    budget_rows = []
    for label, key in [("Revenue · $m", "revenue"), ("Cash after compensation/reinvestment · $m", "owner_cash"), ("Additional protected cash/debt budget · $m", "cash_commitments"), ("Dividend cash budget · $m", "dividend_cash_budget"), ("Net share-purchase funding · $m", "net_buyback_spend"), ("Compensation-replacement proxy · $m", "sbc_replacement_proxy"), ("Cash left after allocations · $m", "cash_retained_after_allocations"), ("Ending shares · millions", "ending_shares_m")]:
        budget_rows.append([label, f(years[0][key],2), f(years[1][key],2)])
    reverse = data["coupled_reverse"]
    answer = {
        "cash": table(f"Trailing cash bridge · USD millions · ending {company['ttm_period_end']}", ["Measure", "Amount · $m"], cash_rows, "FY2025 + current comparable interim − prior interim. Compensation/normalizations are author sensitivities, not additional reported cash expenses. " + cite),
        "budget": table("Base-case cash allocation and affordable net share reduction", ["Author model", "Year1", "Year2"], budget_rows, "Forward cash margins already charge economic compensation and company-specific reinvestment. Net purchases do not receive a second return credit. " + company["commitment_note"]),
        "scenarios": table("Operating and valuation cases · October12,2028", ["Author case", "Year2 cash · $m", "Cash multiple", "Model price", "Price return"], [[s["name"], f(s["years"][-1]["owner_cash"],1), str(next(a for a in company["scenarios"] if a["name"]==s["name"])["terminal_owner_cash_multiple"])+"×", "$"+f(s["terminal_price"],2), f(s["price_return"]*100,1)+"%"] for s in data["scenarios"]], "Scenarios have no probability weights. Central forecast rounds the base model to $5. Dividend estimates are separate from price returns."),
        "reverse": table("The cash hurdle for a 10% annual price return", ["Conditional author diagnostic", "Value"], [["Required horizon share price", "$"+f(reverse["hurdle_price"],2)], ["Year2 recurring cash required", "$"+f(reverse["year2_owner_cash_required"],1)+"m"], ["Cash change vs current underwriting anchor", f(reverse["cash_change_vs_underwriting_anchor"]*100,1)+"%"], ["Recalculated ending shares", f(reverse["ending_shares_m"],3)+"m"]], reverse["condition"]+" The10% hurdle is a choice, not a forecast for SPY."),
        "tests": table("Dated operating predictions and conditions that change the long", ["Observation", "Author test"], conf["tests"], "Use full comparable periods and the same cash definitions. These thresholds are author forecasts, not company guidance. Preserve the original price forecast when revising the thesis."),
    }
    if company["symbol"] == "ADBE":
        prior = company["reported_cash"]["annual_previous"]
        answer["history"] = table("Reported annual and reconstructed trailing scale", ["USD millions", "FY2025", "Latest TTM"], [[label,f(prior[key],0),f(t[key],0)] for label,key in [("Revenue","revenue"),("GAAP net income","net_income"),("Operating cash","cfo"),("Cash capex","capex")]], "TTM ends August28,2026. Nine-month figures are matched; FY2024 included the $1bn Figma termination payment. "+cite)
    if company["symbol"] == "PYPL":
        answer["transaction"] = table("Where the additional Q2 revenue went", ["Q2 year-over-year · $m", "Change"], [["Revenue","+394"],["Transaction expense","+417"],["Transaction/credit losses","−79"],["Transaction-margin dollars","+56"],["Adjusted non-transaction opex","+193"],["Adjusted operating income","−137"]], "The company's non-GAAP contribution/expense definitions reconcile the bridge. Arithmetic contributions do not establish product-level causality. [P3](#source-p3)")
    if company["symbol"] in ("CROX","EXPE"):
        answer["segments"] = table("Reconstructed trailing revenue by business", ["Business", "Revenue · $m"], [[name.replace("_"," ").upper(),f(value,3)] for name,value in company["revenue_anchors"].items()], "FY2025 + H1 2026 − H1 2025; overlapping geographic/channel cuts are not added to business totals. "+cite)
    return answer


def figures(conf):
    root=conf["figure_name"]; prefix=conf["prefix"].lower()
    operating_name={"adobe":"growth-quality","paypal":"transaction-economics","crocs":"profit-and-shares","expedia":"segment-conversion"}[root]
    captions={"adobe":"Revenue and EPS grew at different rates; fewer diluted shares amplified modest GAAP net-income growth. Matching first nine months of FY2025/FY2026, including acquisitions.","paypal":"Q2 reported-dollar payment volume and revenue grew faster than contribution excluding customer interest, while adjusted non-transaction costs grew faster still.","crocs":"Q2 adjusted earnings per share rose while adjusted net income fell. SBC remains inside Crocs' adjusted earnings; diluted share reduction explains the difference.","expedia":"Q2 B2C converted revenue growth into faster EBITDA growth; B2B's faster sales growth came with a lower segment margin."}
    result={}
    for key,name,caption in [("operating",root+"-"+operating_name,captions[root]+f" [{conf['prefix']}2](#source-{prefix}2) [{conf['prefix']}3](#source-{prefix}3)"),("cash",root+"-cash-underwriting","Reported operating cash becomes a lower underwriting anchor after cash capex, compensation and labeled company-specific sensitivities. Matching trailing periods; USD billions."+f" [{conf['prefix']}1](#source-{prefix}1) [{conf['prefix']}2](#source-{prefix}2)"),("scenarios",root+"-price-scenarios","Bear, base and bull operating paths use affordable share reduction and explicit terminal cash multiples. Prices are author scenarios for October12,2028, without probabilities; dividends are separate.")]:
        result[key]={"src":"/images/research/"+name+".svg","label":{"operating":"01 · Operating evidence","cash":"02 · Cash underwriting","scenarios":"03 · Prospective price cases"}[key],"alt":caption,"caption":caption,"width":2160,"height":1260}
    return result


def ledger(conf):
    result=[]
    for local_id, source_id, label, note in conf["source_specs"]:
        s=source_by_id[source_id]
        result.append({"id":local_id,"label":label,"href":s["url"],"publisher":"Company / SEC EDGAR" if "sec.gov" in s["url"] else "Company Investor Relations", "date":s.get("report_date",s.get("publication_date")), "type":"Annual filing" if "Form10-K" in label.replace(" ","") else "Primary company disclosure", "note":note,"limitation":"Reported facts, management guidance and author projections have different status; current share/cash dates remain explicit.","lastVerified":"2026-10-13"})
    result+=conf["extra_sources"]
    for s in result:s.setdefault("lastVerified","2026-10-13")
    result.append({"id":conf["prefix"]+"0","label":"Alpaca SIP daily close · October12,2026","href":"https://docs.alpaca.markets/reference/stockbars","publisher":"Alpaca Markets","date":"2026-10-12","type":"Connected market-data snapshot","note":"Actual SIP daily bars and request parameters are frozen in the downloadable model bundle. This documentation link explains the bar schema; it is not a public display of the quoted close.","limitation":"Daily close is the entry convention; no historical total-return adjustment is inferred. Corporate actions and distributions must be reconciled for evaluation.","lastVerified":"2026-10-13"})
    return result


def parse_manuscript(path, conf, source_ledger):
    text=path.read_text()
    text=re.sub(r'<!--.*?-->','',text,flags=re.S)
    text='\n'.join(line for line in text.splitlines() if not line.startswith('|') and not line.startswith('*Written '))
    for source in source_ledger:
        text=text.replace(']('+source["href"]+')','](#source-'+source["id"].lower()+')')
    text=text.replace('I am buying at a valuation','I would buy at a valuation')
    text=text.replace('I want to own a recovery','I want a recovery')
    intro=[];sections=[];current=None
    for block in re.split(r'\n\s*\n',text.strip()):
        block=block.strip()
        if not block or block.startswith('# '):continue
        if block.startswith('## '):
            title=block[3:]; current={"id":slugify(title),"title":title,"paragraphs":[]};sections.append(current);continue
        if current is None:intro.append(block)
        else:current["paragraphs"].append(block)
    if conf["figure_name"] in ("crocs","expedia"):
        conclusion=sections.pop()
        conclusion={"title":conclusion["title"],"content":"\n\n".join(conclusion["paragraphs"])}
    else:
        conclusion={"title":"My long thesis and dated forecast","content":sections[-1]["paragraphs"].pop()}
    return intro,sections,conclusion


def polish_visible(value, key=""):
    if isinstance(value, dict):
        return {k: polish_visible(v,k) for k,v in value.items()}
    if isinstance(value, list):
        return [polish_visible(v,key) for v in value]
    if not isinstance(value,str) or key in {"id","slug","path","src","href","image","date","dateModified","lastVerified"}:
        return value
    value=re.sub(r'\b(October|August|December|June|September|July)(\d)',r'\1 \2',value)
    value=re.sub(r'\b(Year|year)([12])\b',r'\1 \2',value)
    value=re.sub(r'(?<=[A-Za-z])(?=\$)', ' ', value)
    value=re.sub(r'\b(least|above|below|near|the)(\d)',r'\1 \2',value,flags=re.I)
    value=re.sub(r',(202[68])\b',r', \1',value)
    return value


def build():
    manifest=[]; registry={"version":1,"authored_on":"2026-10-13","information_cutoff":"2026-10-12","evaluation_date":"2028-10-12","benchmark":inputs["benchmark"],"basis":"Price-return comparison, corporate actions reconciled; dividends reported separately without reinvestment when complete. Preserve original forecasts. No probabilities or portfolio weights.","predictions":[]}
    for company in inputs["companies"]:
        conf=CONFIG[company["symbol"]]; source_ledger=ledger(conf)
        intro,sections,conclusion=parse_manuscript(ROOT/conf["manuscript"],conf,source_ledger)
        exhibits=tables(company,conf); images=figures(conf)
        for section in sections:
            paragraphs=[]
            for paragraph in section["paragraphs"]:
                slot=re.fullmatch(r'\[\[(table|figure):([a-z]+)\]\]',paragraph)
                if slot:
                    if slot[1]=='table':section["table"]=exhibits[slot[2]]
                    else:section.setdefault("figures",[]).append(images[slot[2]])
                else:paragraphs.append(paragraph)
            section["paragraphs"]=paragraphs
            if section["id"] in conf["slots"]:
                t,g=conf["slots"][section["id"]]
                if t:section["table"]=exhibits[t]
                if g:section["figures"]=[images[g]]
        data=output["companies"][company["symbol"]];base=next(x for x in data["scenarios"] if x["name"]=='Base')
        article={"slug":conf["slug"],"path":"/research/financial-systems/"+conf["slug"],"title":conf["title"],"displayTitle":conf["displayTitle"],"seoTitle":conf["title"]+" | Long Thesis and 2028 Forecast","seoDescription":conf["subtitle"]+f" Entry ${company['entry_close']:.2f}; author forecast ${base['rounded_price_forecast']:.0f} for October12,2028.","category":"FINANCIAL SYSTEMS","subtitle":conf["subtitle"],"searchTerms":[company["symbol"],company["company"],"long pitch","financial analysis","cash flow","valuation","2028 forecast"],"date":"2026-10-13","dateModified":"2026-10-13","readTime":"1 MIN","kind":"research","image":"/images/social/"+conf["slug"]+".png","author":"Sulayman Bowles","openingPresentation":"integrated","ledeMarkdown":"\n\n".join(intro),"thesis":f"Positive long thesis at the October12 close of ${company['entry_close']:.2f}; central price forecast ${base['rounded_price_forecast']:.0f} for October12,2028.","evidenceBoundary":f"Public-source equity pitch written October13,2026, with information/entry-price cutoff October12. Latest financial period: {company['ttm_period_end']}. Latest disclosed shares: {company['share_count_date']}; exact October shares/cash are not asserted. Author cash sensitivities, operating paths, purchase prices, valuation multiples and disconfirmation thresholds are labeled. Future accuracy is unobserved; no holdings or company work are implied.","assumptions":["USD millions and millions of shares unless stated; prices are USD per original share.","TTM = annual result + current comparable interim − prior interim. Forward cash margins include economic compensation and company-specific recurring reinvestment.","Net share reduction is cash-budget constrained. Retained/protected cash has no terminal bonus; gross buybacks are not added to price returns. Cases are not probabilities."],"sections":sections,"conclusion":conclusion,"sources":source_ledger,"resources":[{"label":"Reproduce all four long pitches","href":"/downloads/research/four-long-pitches-model.zip","description":"Frozen quotes, primary inputs, cash-budget models, scenario CSV, original figures and executed notebook.","format":"ZIP"},{"label":"Inspect the dated forecast registry","href":"/downloads/research/long-pitches-forecast-registry.json","description":"Original price and operating forecasts, entry dates, benchmark basis and model identity.","format":"JSON"}]}
        article=polish_visible(article)
        p=SITE/'src/personal/editorial/data/articles'/(conf["slug"]+'.json');p.write_text(json.dumps(article,ensure_ascii=False,indent=2)+'\n')
        registry["predictions"].append({"symbol":company["symbol"],"slug":conf["slug"],"entry_close":company["entry_close"],"central_price_forecast":base["rounded_price_forecast"],"unrounded_base_model_price":base["terminal_price"],"price_return_forecast":base["rounded_price_forecast"]/company["entry_close"]-1,"assumed_cash_dividends_per_original_share":base["dividends_per_original_entry_share"],"latest_disclosed_share_date":company["share_count_date"],"operating_predictions":conf["tests"],"model_inputs_sha256":hashlib.sha256((ROOT/'inputs.json').read_bytes()).hexdigest(),"scenario_outputs_sha256":hashlib.sha256((ROOT/'outputs/model-results.json').read_bytes()).hexdigest()})
        manifest.append({"symbol":company["symbol"],"article":str(p.relative_to(SITE)),"source_ledger":source_ledger,"lines":conf["lines"],"sketch":conf["sketch"],"figure_name":conf["figure_name"],"question":"What makes "+company["symbol"]+" a long at this entry price?","guide_paths":[{"label":s["title"],"section":s["id"],"description":"Inspect the evidence and author assumptions."} for s in sections if s.get('table')][:3]})
    (ROOT/'article-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'forecast-registry.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'source-register.json').write_text(json.dumps({"cutoff":"2026-10-12","articles":{m["symbol"]:m["source_ledger"] for m in manifest}},ensure_ascii=False,indent=2)+'\n')
    print("Built four native manuscripts, ledgers and frozen forecast registry.")


if __name__=='__main__':build()
