"""Export four authored manuscripts to the site's actual structured format.

Tables bind to the executable models. Draft markers are authoring controls;
delivered Markdown and JSON contain the rendered tables and figures instead.
"""
from pathlib import Path
import json
import re
import os
from models import results as pitch_results
import sys

HERE = Path(__file__).resolve().parent
LANE = HERE.parent
ROOT = LANE.parents[2]
sys.path.insert(0, str(LANE))
from model import results as strategy_results

P = pitch_results()
S = strategy_results()


def money(v): return f"−${abs(v):,.0f}" if v < 0 else f"${v:,.0f}"
def millions(v): return f"${v / 1e6:,.0f}m"
def billions(v): return f"${v / 1e9:.3f}bn"
def pct(v): return f"{v:.1%}"


def source(id, label, href, publisher, date, note, kind="Primary company disclosure"):
    return {"id":id,"label":label,"href":href,"publisher":publisher,
        "date":date,"type":kind,"lastVerified":"2026-10-12","note":note}


TOAST_SOURCES = [
    source("TO1","Q2 2026 earnings release and reconciliations",
        "https://www.sec.gov/Archives/edgar/data/1650164/000165016426000162/tost-20260630xexhibit991.htm",
        "Toast / SEC","2026-08-04","Q2 segment revenue/cost bridge, locations, GPV, tariff benefit and repurchases. Reported facts; future performance is not established."),
    source("TO2","Q2 2026 Form 10-Q",
        "https://www.sec.gov/Archives/edgar/data/1650164/000165016426000164/tost-20260630.htm",
        "Toast / SEC","2026-08-05","ARR/location definitions, half-year statements, cash and marketable securities, no revolver borrowings, contract costs, inventory and share denominator. Diluted weighted-average shares are not a point-in-time cap table."),
    source("TO3","Full-year 2025 results and reconciliations",
        "https://www.sec.gov/Archives/edgar/data/1650164/000165016426000050/tost-20251231xexhibit991.htm",
        "Toast / SEC","2026-02-12","GAAP recurring gross profit is $672m + $1,146m = $1,818m. FY operating income $292m and FCF $608m support independent trailing-year bridges; earlier guidance is superseded."),
    source("TO4","Quarterly results: payment gross-profit reconciliation",
        "https://investors.toasttab.com/financials/quarterly-results/default.aspx",
        "Toast Investor Relations","2026-08-04","Q2 2026 payment gross profit $302m; non-payment fintech gross profit $57m. The full fintech amount is not a pure payments take-rate."),
    source("TO5","TOST reference quote",
        "https://www.google.com/finance/quote/TOST:NYSE","Google Finance","2026-10-12",
        "$31.29 at 15:03:30 Eastern / 19:03:30 UTC, captured October 12. Quote-only secondary market readout; company financials use primary filings. Other Google financial fields are not used.","Dated market-price readout"),
]
HARVEY_SOURCES = [
    source("HV1","September 2026 financing",
        "https://www.harvey.ai/blog/harvey-raises-dollar550m-at-a-dollar155b-valuation-to-help-legal-teams-own-their-intelligence",
        "Harvey","2026-09-09","Company announces $550m at $15.5bn and use by 80% of Am Law 100. No current ARR, audit, cash balance or security terms in this release. Model treats the valuation as an equivalent equity benchmark, not a purchasable common-share price."),
    source("HV2","Three-year business update",
        "https://www.harvey.ai/blog/harveys-three-year-anniversary","Harvey","2025-08-04",
        "Company reported more than $100m ARR and more than 500 customers at this older checkpoint. Does not establish October 2026 ARR."),
    source("HV3","Law-firm ROI calculator",
        "https://www.harvey.ai/roi-calculator/law-firm","Harvey","Current page",
        "Describes conversion of recovered time into work/profit and explicitly illustrative pricing. Our deployment inputs and ROI are independently authored scenarios, not extracted calculator results."),
    source("HV4","Platform overview","https://www.harvey.ai/platform","Harvey","Current page",
        "Product scope: agents, document analysis, research, workspaces and analytics. Marketing direction does not establish comparative superiority or actual customer profit."),
    source("HV5","Tenet research preview",
        "https://www.harvey.ai/blog/post-training-update-harvey-tenet","Harvey","2026-08-20",
        "Company research on post-training, efficient reasoning and tool use. Does not disclose production delivery margin or the unit cost of accepted customer work."),
    source("HV6","Legal Agent Benchmark",
        "https://www.harvey.ai/blog/introducing-harveys-legal-agent-benchmark","Harvey","2026-05-06",
        "Matter-based work-product evaluation and all-pass criteria. No benchmark result is converted into a claim of live-matter reliability or ROI."),
    source("HV7","CoCounsel Legal 2026 product update",
        "https://legal.thomsonreuters.com/blog/behind-the-build-of-the-next-generation-of-cocounsel-legal/",
        "Thomson Reuters","2026-08-24","Primary competitor description of research, drafting, review and document workflows. Does not establish comparative market share or pricing."),
]
VANTA_SOURCES = [
    source("VA1","Series D announcement","https://www.vanta.com/resources/vanta-announces-series-d",
        "Vanta","2025-07-23","$150m raise, $4.15bn announced valuation and more than 12,000 companies. This older benchmark is not a current transaction or a description of security rights."),
    source("VA2","April 2026 ARR milestone",
        "https://www.vanta.com/resources/vanta-crosses-300m-in-arr-as-growth-accelerates",
        "Vanta","2026-04-29","Company reports ARR crossed $300m and 16,000 customers. Model uses $300m as a dated anchor. $18,750 ARR/customer is a coarse normalization, not list price or verified paid-cohort ACV."),
    source("VA3","Automated test evidence",
        "https://help.vanta.com/en/articles/11345529-automated-test-evidence","Vanta Help Center","Current documentation",
        "Documents data retrieval, test evidence and auditor view. No independent effectiveness or security-outcome claim is inferred."),
    source("VA4","Auditor workflow",
        "https://help.vanta.com/en/articles/11345844-how-will-your-auditor-use-vanta","Vanta Help Center","Current documentation",
        "Independent auditor assessment, customer evidence and engagement workflow. Software is not assumed to replace the auditor or audit fee."),
    source("VA5","Data exports",
        "https://help.vanta.com/en/articles/14998654-exporting-your-data-from-vanta","Vanta Help Center","Current documentation",
        "Section-level exports and specific limitations; no export-everything function. Does not establish either frictionless migration or inescapable lock-in."),
    source("VA6","Drata security-questionnaire automation",
        "https://drata.com/products/assurance/security-questionnaire-automation","Drata","Current product page",
        "Approved content, review control and answer reuse are competing product capabilities, not a verified superiority or pricing comparison."),
    source("VA7","Vanta product update record",
        "https://help.vanta.com/en/articles/11345422-product-updates","Vanta Help Center","March 2026 entry",
        "Automatic renewals for one-to-ten-headcount customers on selected plans. A renewed subscription alone is not taken as evidence of active post-audit use or poor customer value."),
]


def table(id,title,columns,rows,note):
    return {"id":id,"title":title,"columns":columns,"rows":rows,"note":note}


TABLES = {}
TABLES["strategy-assumptions"] = table("offer-assumptions","Offers and operating assumptions",
    ["Per 30-day period","Self-service","Assisted direct","Agency"],[
        ["Price / store","$99","$399","$399"],
        ["Potential paying starts, periods 1–6","8, 12, 16, 20, 20, 20","3, 4, 5, 5, 5, 5","0, 0, 8, 8, 8, 8"],
        ["Churn of existing stores","4%","2%","2%"],
        ["Setup hours / new store","1.5","4","3"],
        ["Support hours / active store","0.75","0.5","0.75"],
        ["Cash acquisition cost / start","$150","$150","$50"],
        ["Commercial hours / new start","0 plus 6h ad work","3","1 plus recruitment"],
        ["Agency share of gross billings","0%","0%","25%"],
    ],"All commercial inputs assumed. Agency fixed delivery work is 12, 12, 4, 4, 4, 4 hours; fixed commercial work is 24, 24, 6, 6, 6, 6. The model contains these complete inputs. Both founder budgets and existing-customer support bind admission.")
TABLES["strategy-results"] = table("channel-results","Six-period starting results",
    ["Offer","Active stores","Contribution","Period 6 delivery","Ending cash"],[[
        S["base"][key]["inputs"]["name"],f"{S['base'][key]['summary']['active_final']:.2f}",
        money(S["base"][key]["summary"]["contribution"]),
        f"{S['base'][key]['rows'][-1]['delivery_hours']:.2f} / 60h",money(S["base"][key]["summary"]["final_cash"])
    ] for key in ["assisted_direct","agency_referral","self_service"]],
    "Declared scenarios, USD. Contribution precedes fixed outflows. Cash starts at $40,000 and reflects one-period collection lag; final-period net receivables remain uncollected. Fractional store balances are deterministic expected values.")
TABLES["strategy-price-test"] = table("price-counterfactual","Change price; hold the other offer inputs fixed",
    ["Motion","Price","Ending cash","Meaning"],[
        ["Self-service","$99",money(S["base"]["self_service"]["summary"]["final_cash"]),"Original offer"],
        ["Assisted direct","$99",money(S["variants"]["direct_at_self_service_price"]["summary"]["final_cash"]),"Loses to self-service at this price"],
        ["Assisted direct","$399",money(S["base"]["assisted_direct"]["summary"]["final_cash"]),"Original offer"],
        ["Self-service","$399",money(S["variants"]["self_service_at_direct_price"]["summary"]["final_cash"]),"Wins if original demand survives this price"],
    ],"Diagnostic counterfactuals, not feasible-demand forecasts. Demand, retention, support and acquisition are held fixed within each motion. A causal price or channel effect is not identified.")
TABLES["strategy-gates"] = table("operating-gates","How I would release the next operating budget",
    ["Decision point","Evidence to collect","Action"],[
        ["Before first paid start","Native-tool baseline; buyer; repeated decision; accepted scope and price","Stop if the existing tools already complete the job"],
        ["After first 3 starts","Merchant decisions and renewals; all setup and support time; cash received","Continue only with a repeatable paid workflow"],
        ["After the next 4 starts","Use without founder interpretation; cost and value by account","Narrow the customer or reprice work that stays bespoke"],
        ["Before more acquisition spending","Capacity admission and collections; forward cash reserve","Pace starts; stop new commitments before breaching $10,000"],
        ["Before agency recruitment","Qualified buyer access, commission and founder work actually removed","Advance only if the partner changes the current constraint"],
    ],"Authored operating gates, not validated thresholds. Replace assumed work and churn with paid-cohort evidence. Preserve support capacity for existing customers before admitting new starts.")

T=P["toast"]; H=P["harvey"]; V=P["vanta"]
TABLES["toast-bridge"] = table("toast-gp-bridge","Q2 2026: revenue to gross profit",
    ["Stream","Revenue","Cost of revenue","Gross profit"],[
        ["Subscription","$290m","$64m","$226m"],
        ["Financial technology","$1,570m","$1,211m","$359m"],
        ["Recurring-stream subtotal","$1,860m","$1,275m","$585m"],
        ["Hardware / professional services","$48m","$116m","−$68m"],
        ["Acquired-intangible amortization","—","$1m","−$1m"],
        ["Company total","$1,908m","$1,392m","$516m"],
    ],"Reported GAAP USD millions, unaudited quarter. Fintech includes $302m of payments and $57m of non-payment gross profit; do not treat all fintech income as payments yield. Source: Q2 release and reconciliation.")
TABLES["toast-scenarios"] = table("toast-underwriting","Three-year underwriting from $2.082bn trailing recurring gross profit",
    ["Assumed path","GP growth / year","Operating conversion","Exit EV / after-tax operating earnings","Year 3 value / share"],[
        [name.title(),pct(r["gp_growth"]),pct(r["operating_conversion"]),f"{r['exit_ev_to_after_tax_operating_earnings']}×",f"${r['terminal_value_per_share']:.2f}"]
        for name,r in T["scenarios"].items()
    ],"Deterministic assumptions, no probabilities. 25% tax; $1.713bn eligible liquidity held constant; 590m diluted-share proxy grows 1% annually. Conversion includes all GAAP operating expenses and deployment losses. No extra future cash accumulation, dividends or buyback credit.")
TABLES["toast-entry"] = table("toast-entry-hurdle","The same base business outcome at different entry prices",
    ["Entry / share","Year 3 base value","Annualized price return"],[
        [f"${entry:.2f}",f"${T['scenarios']['base']['terminal_value_per_share']:.2f}",pct((T['scenarios']['base']['terminal_value_per_share']/entry)**(1/3)-1)]
        for entry in [T['scenarios']['base']['maximum_entry_for_15_percent'],25,31.29,35,40]
    ],"Three-year holding period, no dividends. The unrounded entry hurdle is used before display rounding. $31.29 is the dated October 12, 2026 reference quote, not a future live price.")

HC=H["customer_value"]
TABLES["harvey-customer"] = table("harvey-customer-value","What fraction of released time earns incremental contribution?",
    ["Assumed monetization","Incremental contribution","First-year total cost","Net first-year benefit"],[
        [pct(r["monetization_fraction"]),money(r["incremental_contribution"]),money(HC["first_year_total_cost"]),money(r["net_first_year_benefit"])]
        for r in HC["cases"].values()
    ],"Entirely hypothetical 100-seat deployment. 60% adoption; 6 eligible hours/week × 46 weeks; 20% additional review; $200 contribution/monetized hour. $2,400 license/seat/year and $50,000 implementation are assumed, not Harvey pricing. Collectible hourly fees and unchanged payroll are not counted as savings.")
TABLES["harvey-delivery"] = table("harvey-delivery-margin","The same illustrative ARR with different costs of active use",
    ["Model/workflow cost / active seat / year","Modeled delivery gross profit","Modeled gross margin"],[
        [money(r["cost_per_active_seat_year"]),millions(r["modeled_gross_profit"]),pct(r["modeled_gross_margin"])] for r in H["delivery"].values()
    ],"$400m ARR is an illustrative normalization, not verified current Harvey ARR. Assumed $2,400 annual seat price, 65% active licenses and other delivery costs of 15% ARR. Selling, R&D and administration remain below gross profit. No actual Harvey margin or inference cost is inferred.")
TABLES["harvey-adoption-review"] = table("harvey-adoption-review", "Required monetization changes with adoption and review",
    ["Active share of 100 purchased seats", "20% added review", "40% added review", "60% added review"], [
        [pct(adoption), *[pct(next(r['required_monetization'] for r in H['customer_sensitivity'] if r['adoption']==adoption and r['review']==review)) for review in [.20,.40,.60]]]
        for adoption in [.30,.60,.90]
    ], "Hypothetical share of net released hours that must produce contribution to cover $290,000 first-year cost. The six-hour weekly saving and $200 contribution/hour remain fixed. These are payback requirements, not observed adoption or probabilities.")
TABLES["harvey-hurdles"] = table("harvey-return-hurdle","ARR required for a 20% annualized five-year return",
    ["Assumed exit equity / ARR","Required exit equity","Required exit ARR"],[
        [f"{m}×",billions(r["required_exit_equity"]),billions(r["required_exit_arr"])] for m,r in H["hurdles"].items()
    ],"Hypothetical entry at $15.5bn equivalent equity value; 25% future ownership dilution; no fees, distributions or preference waterfall. Multiples are assumptions. Headline funding valuation does not establish an actual security's entry price or rights.")
TABLES["harvey-paths"] = table("harvey-illustrative-paths","Conditional paths from an illustrative $400m starting ARR",
    ["Path","ARR growth / year","Exit ARR","Exit equity / ARR","Investor annual return"],[
        [name.title(),pct(r["arr_growth"]),billions(r["terminal_arr"]),f"{r['exit_equity_to_arr']}×",pct(r["annualized_return"])] for name,r in H["scenarios"].items()
    ],"The $400m starting ARR is not a company disclosure or an estimate. Five-year scenarios; 25% ownership dilution; entry benchmark $15.5bn. No probability weights, security preferences, fees, dividends or secondary premiums. These are underwriting conditions, not forecasts.")

VC=V["customer_value"]
TABLES["vanta-customer"] = table("vanta-customer-cash","Does released time turn into avoided spending?",
    ["Assumed cash capture","Avoided cash / year","First-year net benefit","Recurring net benefit"],[
        [pct(r["cash_capture"]),money(r["cash_avoidance"]),money(r["net_first_year_cash_benefit"]),money(r["net_recurring_cash_benefit"])] for r in VC["cases"].values()
    ],"Hypothetical customer, not Vanta ROI evidence. $18,750 ARR/customer normalization plus assumed $5,000 first-year implementation; 488 distinct hours/year at $80 avoidable cost/hour. Auditor fees remain and are excluded from both alternatives. Capacity value and incremental deal outcomes are not credited as cash savings.")
TABLES["vanta-cohorts"] = table("vanta-base-cohorts","Base ARR bridge by modeled year",
    ["Year","Opening ARR","Lost ARR","Expansion after retention","New ARR","Ending ARR"],[
        [str(r["year"]),millions(r["opening_arr"]),millions(r["lost_arr"]),millions(r["retained_expansion_arr"]),millions(r["new_arr"]),millions(r["ending_arr"])] for r in V["scenarios"]["base"]["rows"]
    ],"USD millions; rounded only for display, so displayed rows may not sum exactly. $300m anchor disclosed April 29, 2026. Assumed gross retention 93%, expansion 15% of retained ARR, NRR 106.95%. New cohorts added at year-end. Ending ARR is not recognized revenue or cash receipts.")
TABLES["vanta-workload"] = table("vanta-workload", "First-year cash benefit depends on a year-round job",
    ["Weeks of control/evidence savings", "25% cash capture", "50% cash capture", "100% cash capture"], [
        [str(weeks), *[money(next(r['net_first_year_benefit'] for r in V['customer_sensitivity'] if r['work_weeks']==weeks and r['cash_capture']==capture)) for capture in [.25,.50,1.0]]]
        for weeks in [16,32,46]
    ], "Hypothetical first-year benefit after the $18,750 license normalization and $5,000 implementation. Questionnaires continue throughout the year and are counted separately. All workload and cash-capture rates are assumptions.")
TABLES["vanta-hurdles"] = table("vanta-return-hurdle","What the $4.15bn entry benchmark must become",
    ["Assumed exit equity / ARR","Required exit equity","Required exit ARR"],[
        [f"{m}×",billions(r["required_exit_equity"]),billions(r["required_exit_arr"])] for m,r in V["hurdles"].items()
    ],"20% annualized five-year hurdle, 20% future ownership dilution. July 2025 financing value is only a hypothetical entry benchmark paired with the April 2026 ARR starting state. No current share price, actual Series D return, security terms or probability claim.")
TABLES["vanta-paths"] = table("vanta-illustrative-paths","Different retention and acquisition paths",
    ["Path","Gross retention","Retained expansion","Annual new ARR, years 1–5","Exit ARR / multiple","Investor annual return"],[
        [name.title(),pct(r["gross_arr_retention"]),pct(r["retained_arr_expansion"]),", ".join(str(round(x['new_arr']/1e6)) for x in r['rows']) + " ($m)",f"{billions(r['terminal_arr'])} / {r['exit_equity_to_arr']}×",pct(r["annualized_return"])] for name,r in V["scenarios"].items()
    ],"Declared five-year scenarios from $300m reported ARR; no actual cohort rates inferred. 20% future dilution; no fees, distributions, net-cash addition or preference waterfall. Entry benchmark $4.15bn. Retention, growth and financing requirements should be connected in real diligence.")


def figure(name,alt,caption,height=650):
    return {"src":f"/images/research/{name}.svg","alt":alt,"caption":caption,"width":1100,"height":height}


FIGURES = {
    "strategy-capacity":figure("strategy-growth-channel-cash-capacity",
        "Direct ends with $21,993 and 32.90 delivery hours; agency $15,084 and 51.29 hours; self-service $6,927 and 59.44 hours against a 60-hour limit.",
        "Starting scenarios: the higher-priced direct offer preserves more cash and delivery capacity. This comparison includes differences in price, support, retention and demand; it does not isolate the effect of the channel.",630),
    "strategy-price":figure("strategy-growth-price-counterfactual",
        "At $99, modeled self-service cash exceeds direct; at $399 with unchanged demand, self-service exceeds the original direct offer. Price changes reverse the apparent ranking.",
        "Price counterfactuals hold each motion's other assumptions fixed. They diagnose dependence on price, without establishing demand at an untested price.",640),
    "strategy-cash":figure("strategy-growth-channel-cash-paths",
        "The direct base ends with $21,993, two-period collections with $13,767, self-service with $6,927, and automated self-service with $4,306.",
        "Faster admission and slower collections change cash timing. The automated self-service scenario spends acquisition cash sooner. The longer direct collection lag changes cash without changing contribution."),
    "toast-value":figure("toast-entry-price-return",
        "Three-year returns decline as entry price rises. The base crosses the 15% annual hurdle at $24.33 and returns 5.8% from the $31.29 reference quote.",
        "Underwriting curves derived from a $2.082bn trailing GAAP recurring-gross-profit anchor. All future growth, conversion, taxes, multiples and dilution are assumed. The curves have no probability weights or confidence-interval interpretation."),
    "harvey-customer-value":figure("harvey-time-to-contribution",
        "At 10% monetization the hypothetical deployment loses $25,040 in year one; 25% gains $372,400 and 40% gains $769,840 after $290,000 of assumed costs.",
        "A hypothetical deployment turns eligible recovered time into incremental contribution only when the firm monetizes it. These are authored inputs, not Harvey prices, measured time savings, or reported ROI."),
    "harvey-hurdle":figure("harvey-return-hurdle",
        "A 20% five-year return after 25% ownership dilution needs $51.43bn exit equity value, equivalent to $5.14bn ARR at 10 times or $2.57bn at 20 times.",
        "Reverse underwriting at the $15.5bn financing benchmark. Exit equity/ARR multiples are assumed; security rights, fees and a preference waterfall are not modeled. The calculation does not require a claim about current Harvey ARR."),
    "vanta-customer-value":figure("vanta-cash-capture",
        "Capturing 25%, 50% or 100% of hypothetical labor savings produces first-year net benefits of minus $13,990, minus $4,230 or plus $15,290.",
        "Hypothetical buyer economics at a coarse $18,750 annual license normalization. Released capacity is credited as cash only to the assumed extent that it avoids spending. First-year implementation is $5,000; audit fees remain."),
    "vanta-cohort-growth":figure("vanta-cohort-growth",
        "The base model grows from the April 2026 $300m ARR checkpoint to $1.155bn; the opening cohort contributes about $420m. The 20% return hurdle at ten times ARR requires $1.291bn.",
        "Declared five-year money-cohort scenario: 93% gross retention, 15% expansion after retention and annual new ARR of $100m to $160m. The opening $300m is a dated company disclosure; all subsequent values are modeled ending run-rates."),
}


old=json.loads((ROOT/"src/personal/editorial/data/articles/choosing-a-growth-channel-under-a-capacity-limit.json").read_text())
CONFIGS = [
    {"key":"strategy","draft":LANE/"strategy-draft.md","out":LANE,
     "slug":old["slug"],"path":old["path"],"title":"Sell the Review Before You Scale the App",
     "displayTitle":"Sell the review before you scale the app","category":"STRATEGY & OPERATIONS",
     "subtitle":"A growth channel commits you to a price, a customer and a workload. I model an assisted launch, then test the assumptions that make it win.",
     "seoTitle":"Pricing, Growth Channels and the Product You Build",
     "seoDescription":"A worked Shopify app strategy connects paid value, delivery capacity and cash. Holding price constant exposes the assumptions behind the channel recommendation.",
     "searchTerms":["strategy planning","pricing","growth channels","capacity","operating plan","Shopify"],
     "evidenceBoundary":"Hypothetical company and operating choices, not client history. Six 30-day periods begin after an approved working app exists, with $40,000 cash. Commercial inputs are assumed; current Shopify fee terms are sourced. Deterministic scenarios have no probability weights. No tax, refund, nonpayment or pre-launch cost is modeled.","sources":[s for s in old["sources"] if s["id"] != "ad-measurement"]},
    {"key":"toast","draft":HERE/"toast-draft.md","out":HERE/"toast",
     "slug":"toast-gross-profit-engine","path":"/research/financial-systems/toast-gross-profit-engine",
     "title":"Toast: I Want the Gross-Profit Engine at a Better Price","displayTitle":"Toast's gross-profit engine",
     "category":"FINANCIAL SYSTEMS","subtitle":"I like the workflow and the operating leverage. A full seasonal-year model puts the entry hurdle well below the dated market quote.",
     "seoTitle":"Toast Stock Pitch: Gross Profit, Cash and Entry Price",
     "seoDescription":"A Toast investment thesis rebuilds trailing GAAP gross profit, tests cash conversion and models the entry price required for a 15% annualized return.",
     "searchTerms":["Toast","TOST","stock pitch","payments","gross profit","valuation","cash flow"],
     "evidenceBoundary":"Company evidence through Q2 2026, verified October 12. Reference quote $31.29 at 19:03:30 UTC October 12, 2026. Full trailing-year GAAP gross profit anchors three-year scenarios; future drivers are assumed. Share count is a diluted weighted-average proxy. No holdings, trade, probability estimate or publication is claimed.","sources":TOAST_SOURCES},
    {"key":"harvey","draft":HERE/"harvey-draft.md","out":HERE/"harvey",
     "slug":"harvey-who-keeps-the-value-of-legal-ai","path":"/research/financial-systems/harvey-who-keeps-the-value-of-legal-ai",
     "title":"Harvey: Who Keeps the Value of Faster Legal Work?","displayTitle":"Who keeps the value of legal AI?",
     "category":"FINANCIAL SYSTEMS","subtitle":"Harvey could own more of the legal workflow. I test how recovered time becomes customer profit and what the $15.5 billion financing benchmark requires.",
     "seoTitle":"Harvey Startup Pitch: Customer Value and the Return Hurdle",
     "seoDescription":"A Harvey thesis models customer contribution, delivery costs and five-year return requirements. Private-company ARR normalizations remain explicit assumptions.",
     "searchTerms":["Harvey","legal AI","startup pitch","value capture","ARR","private valuation","unit economics"],
     "evidenceBoundary":"September 9, 2026 financing is the entry benchmark, not an observable common-share price. $200m/$400m/$600m starting ARR, prices, adoption, costs, future growth and margins are illustrative, not verified current Harvey data. Customer value and return models are separate. No security rights, fees or preference waterfall is inferred.","sources":HARVEY_SOURCES},
    {"key":"vanta","draft":HERE/"vanta-draft.md","out":HERE/"vanta",
     "slug":"vanta-after-the-audit","path":"/research/financial-systems/vanta-after-the-audit",
     "title":"Vanta: The Business After the Audit","displayTitle":"Vanta after the audit",
     "category":"FINANCIAL SYSTEMS","subtitle":"The recurring job is keeping evidence useful. I model post-audit retention, new ARR and the investment return at the last disclosed financing benchmark.",
     "seoTitle":"Vanta Startup Pitch: Retention, Growth and Valuation",
     "seoDescription":"A Vanta investment thesis models buyer cash payback, ARR cohorts and private-investment return hurdles, with dated disclosures separated from assumptions.",
     "searchTerms":["Vanta","compliance","startup pitch","retention","ARR","private valuation","trust"],
     "evidenceBoundary":"$300m ARR and 16,000 customers are April 29, 2026 company disclosures; $4.15bn is the July 2025 financing benchmark. Their ratio is not the Series D entry multiple or a current share price. Future cohort rates, acquisition, costs and valuation multiples are assumed. The $18,750 customer normalization is not disclosed pricing. Security rights, audited margins and cash needs remain unverified.","sources":VANTA_SOURCES},
]


def slugify(s): return re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")


def markdown_table(t):
    rows=[t["columns"],["---"]*len(t["columns"]),*t["rows"]]
    return "**"+t["title"]+"**\n\n"+"\n".join("| "+" | ".join(c.replace("|","\\|") for c in r)+" |" for r in rows)+"\n\n"+t["note"]


def build(c):
    draft=c["draft"].read_text()
    chunks=re.split(r"^## (.+)$",draft,flags=re.M)
    opening=re.sub(r"^# .+\n+","",chunks[0]).strip()
    content=opening.split("\n\n")
    sections=[]
    article_tables=[]
    for i in range(1,len(chunks),2):
        title,body=chunks[i],chunks[i+1].strip()
        section={"id":slugify(title),"title":title,"blocks":[]}
        for para in body.split("\n\n"):
            if para.startswith("[TABLE:"):
                key=re.fullmatch(r"\[TABLE:([^]]+)\]",para)[1]
                article_tables.append(TABLES[key])
                section["blocks"].append({"kind":"table","tableId":TABLES[key]["id"]})
            elif para.startswith("[FIGURE:"):
                key=re.fullmatch(r"\[FIGURE:([^]]+)\]",para)[1]
                section.setdefault("figures",[]).append(FIGURES[key])
            else: section["blocks"].append({"kind":"markdown","markdown":para})
        sections.append(section)
    keys=["slug","path","title","displayTitle","category","subtitle","seoTitle","seoDescription","searchTerms","evidenceBoundary","sources"]
    article={k:c[k] for k in keys}
    article.update({"aliases":[],"date":"2026-10-12","dateModified":"2026-10-12","kind":"research","author":"SULAYMAN BOWLES","openingPresentation":"integrated","content":content,"markdownSections":sections,"tables":article_tables})
    values=[article["title"],article["subtitle"],*content]
    for sec in sections:
        values.append(sec["title"])
        for block in sec['blocks']:
            if block['kind']=='markdown':values.append(block['markdown'])
            else:
                t=next(t for t in article_tables if t['id']==block['tableId'])
                values += [t["title"],*t["columns"],*sum(t["rows"],[]),t["note"]]
        values += [f["caption"] for f in sec.get("figures",[])]
    plain=re.sub(r"\]\([^)]*\)","]"," ".join(values))
    words=len(re.findall(r"\b[\w’'-]+\b",plain))
    article["readTime"]=f"{round(words/220)} MIN"
    c["out"].mkdir(parents=True,exist_ok=True)
    target=ROOT/"src/personal/editorial/data/articles"/(c["slug"]+".json")
    target.write_text(json.dumps(article,indent=2,ensure_ascii=False)+"\n")
    rendered=draft
    for key,t in TABLES.items():rendered=rendered.replace(f"[TABLE:{key}]",markdown_table(t))
    for key,f in FIGURES.items():
        image=Path(os.path.relpath(LANE/"figures"/Path(f["src"]).with_suffix(".png").name,c["out"])).as_posix()
        rendered=rendered.replace(f"[FIGURE:{key}]",f"![{f['alt']}]({image})\n\n{f['caption']}")
    rendered=rendered.replace("\n\n",f"\n\n{c['subtitle']}\n\n",1)
    rendered += "\n## Scope\n\n"+c["evidenceBoundary"]+"\n\n## Sources\n\n"+"\n".join(f"- [{s['label']}]({s['href']}) — {s['publisher']}, {s.get('date','Current documentation')}; verified {s['lastVerified']}. {s['note']}" for s in c['sources'])+"\n"
    (c["out"]/"article.md").write_text(rendered)
    summary={k:v for k,v in article.items() if k in ["slug","path","aliases","title","displayTitle","category","subtitle","searchTerms","date","dateModified","kind","readTime","seoTitle","seoDescription"]}
    (c["out"]/"catalog-entry.json").write_text(json.dumps(summary,indent=2,ensure_ascii=False)+"\n")
    register="# Source and assumption register\n\nVerified October 12, 2026. Publication dates and verification dates are distinct.\n\n"
    for s in c["sources"]:register += f"## {s['id']} — {s['label']}\n\n[{s['publisher']}]({s['href']}) · {s.get('date','Current documentation')} · {s['type']}\n\n{s['note']}\n\n"
    register += "## Model boundary\n\n"+c["evidenceBoundary"]+"\n\nModels are local, deterministic and require no network or credentials. Their future inputs carry no observed-data or probability status.\n"
    (c["out"]/"SOURCES.md").write_text(register)
    return {"key":c["key"],"slug":c["slug"],"path":c["path"],"title":c["title"],"json":target.relative_to(ROOT).as_posix(),"manuscript":(c["out"]/"article.md").relative_to(ROOT).as_posix(),"words":words,"readTime":article["readTime"],"sections":len(sections),"tables":len(article_tables),"figures":sum(len(s.get("figures",[])) for s in sections),"model_input_sha256":P['input_sha256']}


if __name__=="__main__":
    manifest=[build(c) for c in CONFIGS]
    (HERE/"article-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
    for r in manifest:print(f"{r['key']}: {r['words']} words, {r['readTime']}, {r['tables']} tables, {r['figures']} figures")
