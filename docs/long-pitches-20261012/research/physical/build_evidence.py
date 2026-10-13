"""Reproducible candidate screen. Financial statement inputs are USD millions.

Manual transcription from the preserved primary sources; TTM is annual + new
interim - matched prior interim. Scenario values are author assumptions, never
company guidance or observed future results. No securities transactions.
"""
from pathlib import Path
import json
from math import sqrt

ROOT=Path(__file__).resolve().parent

def p(end,months,source,revenue,ni,cfo,capex,sbc,repurchases,dividends=0,nci_distributions=0,ni_common=None,da=None):
    return dict(period_end=end,months=months,source=source,units='USD million',
                revenue=revenue,net_income_consolidated=ni,net_income_common=ni if ni_common is None else ni_common,
                cfo=cfo,capex_cash_outflow=capex,sbc_cash_flow_addback=sbc,
                repurchase_cash_outflow=repurchases,dividend_cash_outflow=dividends,
                nci_distribution_cash_outflow=nci_distributions,depreciation_amortization=da)

companies={
 'CROX':{
  'name':'Crocs','price_usd':116.90,'price_source':'../../prices-20261012.json',
  'latest_disclosed_shares_million':47.945075,'share_date':'2026-07-23','share_source':'CROX-Q226, cover',
  'periods':{
   'FY2024':p('2024-12-31',12,'CROX-K25',4102.108,950.071,992.486,69.347,33.053,552.451,da=69.840),
   'FY2025':p('2025-12-31',12,'CROX-K25',4040.647,-81.198,710.431,51.231,36.701,582.320,da=79.282),
   'H1_2025':p('2025-06-30',6,'CROX-Q226 and CROX-Q225',2086.706,-332.179,218.565,31.946,20.036,194.137,da=38.011),
   'H1_2026':p('2026-06-30',6,'CROX-Q226',2100.925,342.443,270.768,38.729,24.852,256.157,da=40.286)},
  'latest_balance':{'date':'2026-06-30','source':'CROX-Q226, balance sheet and notes5/8/11',
   'cash_unrestricted':170.276,'cash_restricted_excluded':3.555,'debt_face':1334.0,'debt_book':1307.658,
   'operating_lease_liability':381.544,'long_term_income_taxes_payable':639.580,
   'deferred_tax_asset_net':911.346,'inventories':389.212,'accounts_receivable_net':430.297},
  'shares_million':{'FY2024_end':56.5,'FY2025_end':50.2,'H1_2025_end':54.8,'H1_2026_end':48.1,
   'note':'Balance-sheet amounts rounded to0.1m; do not present derived percentages as exact. Cover provides July23 precise current count.',
   'FY2025_gaap_diluted_average':54.208,'H1_2025_gaap_diluted_average':55.946,'H1_2026_gaap_diluted_average':50.164,
   'Q2_2025_adjusted_diluted_average':56.148,'Q2_2026_adjusted_diluted_average':49.628},
  'guidance':{'source':'CROX-ER226, Financial Outlook / Guidance reconciliation, 2026-07-30','period':'FY2026',
   'revenue_growth_pct':[1,2],'crocs_brand_growth_pct':[2,3],'heydude_growth_pct':[-4,-2],
   'gaap_eps_usd':[12.47,12.77],'adjusted_eps_usd':[13.70,14.00],'gaap_tax_pct':23,'adjusted_tax_pct':18,
   'gaap_op_margin_floor_pct':21.7,'adjusted_op_margin_floor_pct':22.3,'capex':[70,80],
   'adjustment_costs':25,'further_repurchases_excluded':True,'potential_ieepa_refunds_excluded':True},
  'observations':[
   {'fact':'Q2 adjusted net income fell while adjusted EPS grew because shares fell. SBC remains included in adjusted EPS.',
    'source':'CROX-ER226, GAAP-to-non-GAAP reconciliation','numbers':{'adjusted_ni_2025':237.477,'adjusted_ni_2026':225.674,'adjusted_eps_2025':4.23,'adjusted_eps_2026':4.55}},
   {'fact':'H1 adjusted operating profit fell even though consolidated sales rose.', 'source':'CROX-ER226, operating-profit reconciliation',
    'numbers':{'op_2025':532.458,'op_2026':501.315}},
   {'fact':'H1 CFO grew less than the favorable tax-working-capital swing; this is not proof of improved underlying earnings.',
    'source':'CROX-Q226, cash-flow statement','numbers':{'tax_working_capital_2025':-32.026,'tax_working_capital_2026':49.029,
     'cash_income_tax_paid_2025':106.616,'cash_income_tax_paid_2026':51.399}},
   {'fact':'Around$20m IEEPA refund was received after June30, with benefit expected in Q3 cost of sales. Not in June cash/TTM. Earnings guidance explicitly excludes potential refunds.',
    'source':'CROX-Q226, note1 Changes in Laws and Regulations; CROX-ER226 guidance footnote1','numbers':{'subsequent_refund_cash':20}},
   {'fact':'Crocs brand Q2 international growth and DTC strength offset weak wholesale/HEYDUDE; geographic mix shifted.',
    'source':'CROX-Q226 note10; CROX-ER226 brand summary','numbers':{
     'q2_crocs_brand_2025':959.590,'q2_crocs_brand_2026':1000.437,'q2_crocs_na_2025':457.130,'q2_crocs_na_2026':458.733,
     'q2_crocs_international_2025':502.460,'q2_crocs_international_2026':541.704,
     'q2_crocs_dtc_2025':494.911,'q2_crocs_dtc_2026':558.938,'q2_crocs_wholesale_2025':464.679,'q2_crocs_wholesale_2026':441.499,
     'q2_heydude_2025':189.783,'q2_heydude_2026':179.031,'q2_heydude_dtc_2025':90.023,'q2_heydude_dtc_2026':96.467,
     'q2_heydude_wholesale_2025':99.760,'q2_heydude_wholesale_2026':82.564}},
   {'fact':'Q2 revenue bridge is price/mix+FX overcoming net lower footwear volume. H1 volume decline is broader.',
    'source':'CROX-Q226 MD&A Revenues','numbers':{'q2_price_mix':37.9,'q2_volume_effect':-14.1,'q2_fx':6.3,
     'h1_price_mix':72.4,'h1_volume_effect':-86.2,'h1_fx':28.0}},
   {'fact':'Q2 consolidated gross margin eroded; incremental duties and Crocs product/customer mix offset lower product costs.',
    'source':'CROX-Q226 MD&A Gross margin','numbers':{'gaap_gm_pct_2025':61.7,'gaap_gm_pct_2026':59.4,
     'duties_headwind_bps':170,'crocs_mix_headwind_bps':100,'lower_crocs_product_cost_benefit_bps':100}},
   {'fact':'H1 Crocs brand income from operations declined4.2%; HEYDUDE becomes profitable as prior impairment vanishes, not as proof of recovery.',
    'source':'CROX-Q226 note14','numbers':{'crocs_op_2025':632.000,'crocs_op_2026':605.239,'heydude_op_2025':-682.703,
     'heydude_op_2026':38.470,'heydude_prior_impairment':737.0,'heydude_current_leasehold_impairment':3.301}},
   {'fact':'DTC investment expands the fixed-cost footprint; avoid treating all channel-mix revenue growth as margin growth.',
    'source':'CROX-Q226 Store Locations; CROX-K25 Business','numbers':{'crocs_stores_june2025':412,'crocs_stores_june2026':484,
     'heydude_stores_june2025':63,'heydude_stores_june2026':75,'crocs_international_mix_fy2023_pct':41.0,
     'crocs_international_mix_fy2024_pct':44.1,'crocs_international_mix_fy2025_pct':48.6}},
   {'fact':'Tax reserves are a cash-allocation uncertainty distinct from face debt and deferred tax assets. Do not net DTA into cash.',
    'source':'CROX-K25 note13 Income Taxes; CROX-Q226 balance sheet','numbers':{'unrecognized_tax_benefits_fy2025':636.973,
     'long_term_tax_payable_june2026':639.580}},
   {'fact':'Buyback authority is permission, not cash. Q2 purchases occurred below frozen entry; H1 financed additional revolver draw.',
    'source':'CROX-Q226 note8/9; CROX-ER226 return of capital','numbers':{'q2_purchase_shares_million':2.345,
     'q2_cost_including_commissions':250.6,'q2_average_price_usd':106.87,'authorization_after_july27':2000,
     'debt_face_increase_h1':72.0,'revolver_june2026':134.0,'revolver_dec2025':62.0}}],
  'screen_judgment':'Rank1: strongest current-price long of these four. Low multiple, credible recurring owner cash and past net share retirement can create upside without a higher valuation multiple. Underwrite$600m recurring owner cash rather than claiming the$663m TTM is permanently earned; add tax-settlement stress.',
  'scenario_basis':{'basis':'author owner-cash proxy after SBC, unchanged price/normalized cash-per-share multiple',
    'normalized_current_owner_cash':600.0,'current_share_count':47.945075,'dividends_24m_usd':0.0,
    'scenarios':{'bear':{'owner_cash_2028':425.0,'shares_2028':46.0},'base':{'owner_cash_2028':650.0,'shares_2028':40.5},'bull':{'owner_cash_2028':775.0,'shares_2028':39.0}}},
  'gaps':['October12 exact share count and cash are not reported; equity uses July23 last disclosed count.',
   'No independent sell-through or customer-retention dataset acquired; footwear growth is reported revenue and volume commentary.',
   'Tax-settlement amount/timing is not estimable from company disclosure; no legal outcome prediction.',
   'Future cash conversion, buyback average price and net retirement are scenario judgments, not guidance.']},
 'QCOM':{
  'name':'Qualcomm','price_usd':174.43,'price_source':'../../prices-20261012.json',
  'latest_disclosed_shares_million':1050.0,'share_date':'2026-07-27','share_source':'QCOM-Q326 cover',
  'limited_post_modular_share_count_million':1068.0,
  'periods':{
   'FY2024':p('2024-09-29',12,'QCOM-K25',38962,10142,12202,1041,2648,4121,3687,da=1706),
   'FY2025':p('2025-09-28',12,'QCOM-K25',44284,5541,14012,1192,2783,8791,3805,da=1602),
   '9M_2025':p('2025-06-29',9,'QCOM-Q326 and QCOM-Q325',33013,8658,10016,785,2120,6347,2848,da=1231),
   '9M_2026':p('2026-06-28',9,'QCOM-Q326',32798,12377,8405,1578,2579,6806,2868,da=1202)},
  'latest_balance':{'date':'2026-06-28','source':'QCOM-Q326 balance sheet and Liquidity','cash':4533,
   'marketable_securities_current':3771,'cash_restricted':0,'debt_book':15270,'short_term_debt_book':2489,
   'long_term_debt_book':12781,'commercial_paper_face':498,'bonds_face_due_may2027':2000,
   'inventories':8379,'inventory_dec2025':6526,'capacity_prepayments':769,'capacity_prepayments_dec2025':1900},
  'shares_million':{'FY2024_end':1113,'FY2025_end':1074,'9M_2025_end':1084,'9M_2026_end':1057,
   'FY2025_diluted_average':1105,'9M_2025_diluted_average':1112,'9M_2026_diluted_average':1073,
   'note':'Balance-sheet shares include Alphawave Exchangeable Shares. Cover is July27; Modular18m issued July28 after that count. No precise October shares known.'},
  'guidance':{'source':'QCOM-ER326; QCOM-DECK326 pages6/9/11/15/32, July29','period':'Q4 FY2026 and FY2029 targets',
   'q4_revenue':[9700,10500],'q4_gaap_eps':[1.22,1.42],'q4_adjusted_eps':[2.05,2.25],
   'q4_sbc_eps_exclusion':0.72,'q4_other_eps_exclusion':0.11,'q4_diluted_shares_million':1080,
   'q4_qct_ebt_margin_pct':[23,25],'q4_qtl_ebt_margin_pct':[68,72],
   'fy2029_non_handset_revenue_target':40000,'fy2029_auto_revenue_target':10000,
   'fy2029_iot_revenue_target_floor':14000,'fy2029_data_center_revenue_target_floor':15000,
   'fy2029_gaap_eps_target_floor':14.50,'fy2029_adjusted_eps_target_floor':18.00,
   'fy2027_non_handset_growth_target_floor_pct':60,'fy2027_data_center_revenue_target_floor':5000,
   'note':'Long-term targets and roadmap are management aspirations, not contracted sales or author forecasts. Targets after the 24-month horizon must not be substituted for FY2028.'},
  'observations':[
   {'fact':'Q3 diversification is material but does not yet replace the handset revenue loss.', 'source':'QCOM-Q326 note2; QCOM-ER326 segment results',
    'numbers':{'handsets_2025':6328,'handsets_2026':5086,'automotive_2025':984,'automotive_2026':1588,
     'iot_2025':1681,'iot_2026':1830,'qct_ebt_2025':2671,'qct_ebt_2026':2192,
     'qtl_revenue_2025':1318,'qtl_revenue_2026':1278,'qtl_ebt_2025':942,'qtl_ebt_2026':881}},
   {'fact':'GAAP Q3 earnings benefit from investments while adjusted earnings strip SBC; neither headline alone gives recurring owner earnings.',
    'source':'QCOM-ER326 GAAP-to-non-GAAP bridge','numbers':{'gaap_ni':2002,'qsi_ni_removed':607,
     'sbc_ni_added_back':728,'other_ni_added_back':233,'adjusted_ni':2356,'gaap_eps':1.87,'adjusted_eps':2.21,
     'gaap_operating_income':1626,'sbc_opex':827,'gaap_investment_other_income':1014}},
   {'fact':'FY2025 recorded$5.7bn deferred-tax valuation allowance, then Q2 FY2026 reversed it. Nine-month NI is inflated; the TTM spans both opposite entries and roughly cancels their direct impacts.',
    'source':'QCOM-K25 note3 and QCOM-Q326 note3','numbers':{'fy2025_valuation_allowance_charge':5700,'q2_2026_release_benefit':5700}},
   {'fact':'Cash recovery requires working-capital discipline, not only tax-accounting reversal.',
    'source':'QCOM-Q326 cash flows / Liquidity','numbers':{'inventory_cf_9m2025':33,'inventory_cf_9m2026':-1798,
     'other_assets_cf_9m2026':777,'final_repatriation_tax_cash_payment':663}},
   {'fact':'Modular acquisition issues shares after the last cover count. Its$3.1bn valuation is not$3.1bn all-cash acquisition spending.',
    'source':'QCOM-Q326 note8 subsequent event','numbers':{'modular_shares_issued_million':18,
     'modular_exec_shares_service_condition_million':4,'modular_valuation_at_close':3100,'modular_exec_share_fair_value':700},
    'date':'2026-07-28'},
   {'fact':'Alphawave acquisition dilution is already in the June statements; Exchangeable Shares must not be added a second time.',
    'source':'QCOM-Q326 note8','numbers':{'alphawave_accounting_purchase_price':2274,'alphawave_equity_shares_million':11,
     'exchangeable_shares_million':4,'alphawave_cash_consideration':301},'date':'2025-12-18'},
   {'fact':'Apple patent license renewed effective April1,2027; undisclosed terms and duration. This does not undo QCT modem losses.',
    'source':'QCOM-APPLE-PR company-authored release, September24; QCOM-DECK326 page7',
    'numbers':{'prior_apple_modem_share_estimate_pct':20},'note':'Company now expects materially below20% for the upcoming launch; cannot quantify new share from public wording.'},
   {'fact':'Amazon warrants have conditional vesting, allow cashless exercise and are a customer acquisition cost/dilution channel; not guaranteed$60bn backlog.',
    'source':'QCOM-AWS8K Item3.02','numbers':{'max_warrant_shares_million':25,'initially_vested_shares_million':3.75,
     'exercise_price_usd':161.26,'payment_ceiling_for_vesting':60000},'dates':{'issued':'2026-09-03','expires':'2036-09-03'}},
   {'fact':'Customer collaboration confirms demand engagement but does not disclose binding volume, margin or near-term revenue.',
    'source':'QCOM-AWS September8 company announcement','note':'Optical solutions up to1.6T and custom AI inference silicon; no purchase amount promised in release.'},
   {'fact':'Automotive revenue growth does not establish identical handset contribution margin; Data Center is currently a nonreportable segment and ramp costs are unallocated.',
    'source':'QCOM-Q326 note6; QCOM-DECK326 pages14/15','note':'Custom silicon planned Q1FY27, AI accelerators2HFY27, CPU2HFY28; publication dates precede cutoff.'}],
  'screen_judgment':'Rank2, conditional higher-risk long. September Apple renewal reduces licensing-renewal uncertainty while automotive+IoT and hyperscaler custom silicon can replace hardware losses. Do not recommend on non-GAAP P/E alone; actual post-SBC cash yield is low and newly issued shares consume repurchase effort.',
  'scenario_basis':{'basis':'author owner-cash proxy; unchanged price/normalized cash-per-share multiple',
   'normalized_current_owner_cash':8500.0,'current_share_count':1068.0,'dividends_24m_usd':7.36,
   'scenarios':{'bear':{'owner_cash_2028':6500.0,'shares_2028':1090.0},'base':{'owner_cash_2028':11000.0,'shares_2028':1040.0},'bull':{'owner_cash_2028':13500.0,'shares_2028':1020.0}},
   'normalization_note':'$8.5bn is an author judgment near FY2024$8.513bn, above observed TTM$7.174bn and below FY2025$10.037bn. It presumes partial working-capital normalization; do not label it reported FCF.'},
  'gaps':['Exact October shares/cash are not disclosed;1,068m limited pro forma does not capture further compensation, buybacks or warrants.',
   'Apple renewal economics/expiration not public; do not assert a2029 expiration.',
   'Amazon payment ceiling is not forecast backlog; vesting/cashless dilution depends on future orders and stock price.',
   'Data Center standalone margin and cash conversion not disclosed; root must build a segment model before accepting the illustrative base.',
   'FY2029 target is outside the24-month horizon.']},
 'HCA':{
  'name':'HCA Healthcare','price_usd':458.60,'price_source':'../../prices-20261012.json',
  'latest_disclosed_shares_million':216.5015,'share_date':'2026-07-24','share_source':'HCA-Q226 cover',
  'periods':{
   'FY2024':p('2024-12-31',12,'HCA-K25',70603,6657,10514,4875,360,6042,690,711,5760,3312),
   'FY2025':p('2025-12-31',12,'HCA-K25',75600,7782,12636,4944,401,10067,679,827,6784,3523),
   'H1_2025':p('2025-06-30',6,'HCA-Q226 and HCA-Q225',36926,3716,5861,2167,197,5011,351,394,3263,1723),
   'H1_2026':p('2026-06-30',6,'HCA-Q226',39339,3787,4349,2350,171,3635,354,334,3319,1874)},
  'latest_balance':{'date':'2026-06-30','source':'HCA-Q226 balance sheet; HCA-ER226','cash':1013,
   'debt_book':49718,'debt_issuance_costs_discounts':451,'short_term_and_due_within_one_year':6264,
   'note':'Book debt used consistently with company liquidity disclosure; total includes debt issuance discounts. Unused credit availability is borrowing capacity, not cash.'},
  'shares_million':{'FY2024_end':249.9814,'FY2025_end':224.6051,'H1_2025_end':236.1439,'H1_2026_end':217.9633,
   'FY2025_diluted_average':239.495,'H1_2025_diluted_average':245.654,'H1_2026_diluted_average':224.731,
   'Q2_2025_diluted_average':241.911,'Q2_2026_diluted_average':222.828},
  'guidance':{'source':'HCA-ER226 July24, revised July14 guidance','period':'FY2026','revenue':[77000,79500],
   'net_income_common':[6300,6700],'adjusted_ebitda':[15400,16100],'eps':[28.70,30.50],'capex':[5000,5500],
   'exchange_payer_mix_pretax_headwind':[1000,1200],'medicaid_program_incremental_net_benefit':[300,500],
   'previous_exchange_headwind':[600,900],'previous_medicaid_incremental_net_benefit':[-250,-50],
   'future_program_approvals_excluded':True},
  'observations':[
   {'fact':'Q2 headline sales grew8.7%, but Florida recognition includes prior-period revenue and expense.', 'source':'HCA-Q226 MD&A; HCA-ER226',
    'numbers':{'q2_revenue_2025':18605,'q2_revenue_2026':20230,'florida_incremental_revenue_total':1372,
     'florida_incremental_other_op_expense_total':829,'florida_revenue_prior_to_2026':980,'florida_expense_prior_to_2026':557}},
   {'fact':'Q2 company estimated payer-mix pretax harm approximately offset by incremental Medicaid benefit. The administrative/tax-credit loss is not a one-off accounting item.',
    'source':'HCA-ER226 Second Quarter Commentary','numbers':{'payer_mix_pretax_harm':400,'included_q1_estimate_revision':75,'incremental_medicaid_net_benefit':400}},
   {'fact':'Patient need rises but insured reimbursement quality erodes; surgeries decline while uninsured volume grows.',
    'source':'HCA-Q226 Revenue/Volume Trends; HCA-ER226','numbers':{'same_facility_admissions_growth_pct':2.5,
     'same_facility_equivalent_admissions_growth_pct':2.7,'same_facility_inpatient_surgery_growth_pct':-2.3,
     'same_facility_outpatient_surgery_growth_pct':-3.4,'same_facility_uninsured_admissions_growth_pct':23.4,
     'q1_same_facility_uninsured_admissions_growth_pct':15.5,'estimated_uncompensated_care_cost_q2_2025':1116,
     'estimated_uncompensated_care_cost_q2_2026':1445}},
   {'fact':'Headline salaries/revenue ratio partly benefits from retroactive revenue; direct unit labor data is more useful.',
    'source':'HCA-Q226 MD&A Salaries and benefits','numbers':{'salary_revenue_ratio_q2_2025_pct':43.7,
     'salary_revenue_ratio_q2_2026_pct':41.0,'same_facility_salaries_per_fte_q2_growth_pct':2.5,
     'same_facility_salaries_per_fte_h1_growth_pct':3.0}},
   {'fact':'Concentration magnifies state payer-policy sensitivity.', 'source':'HCA-Q226 Revenue/Volume Trends',
    'numbers':{'texas_florida_hospitals':103,'total_hospitals':190,'texas_florida_share_admissions_pct':58,
     'texas_florida_share_revenues_pct':55,'texas_florida_share_uninsured_admissions_pct':73}},
   {'fact':'Cash proxy must remove distributions to minority owners; CFO includes their earnings. 2025 repurchases exceed cash after capex/SBC/NCI.',
    'source':'HCA-K25 and HCA-Q226 cash-flow statements','note':'Do not add repurchase yield on top of EPS growth; new debt funded part of capital return.'},
   {'fact':'Q2 GAAP-to-adjusted EPS subtracts facility gains; adjusted results retain SBC and Medicaid recognition.',
    'source':'HCA-ER226 Supplemental Non-GAAP Disclosures','numbers':{'q2_gaap_eps':7.62,'gain_adjustment_eps':-0.03,'q2_adjusted_eps':7.59}},
   {'fact':'CMS February2 preliminary letter limits state-directed payments and phases down qualifying grandfathered programs for rating periods beginning2028. This is not proof that all HCA programs fall at one date.',
    'source':'CMS-SDP-LETTER pp1–4; HCA-Q226 Revenue/Volume Trends','note':'The CMS letter is preliminary guidance pending rulemaking; company acknowledges uncertain program approval/timing. Keep the policy downside inside the two-year horizon.'}],
  'screen_judgment':'Rank3: reject as one of the four current-price longs. Durable scale does not overcome current payer-mix deterioration, backward-looking Medicaid recognition, debt-funded capital returns and roughly5% owner cash yield at$458.60. A lower entry or demonstrated organic operating recovery would change the decision.',
  'scenario_basis':{'basis':'author shareholder owner-cash proxy after SBC and NCI distributions; unchanged price/normalized cash-per-share multiple',
   'normalized_current_owner_cash':4900.0,'current_share_count':216.5015,'dividends_24m_usd':6.24,
   'scenarios':{'bear':{'owner_cash_2028':3700.0,'shares_2028':207.0},'base':{'owner_cash_2028':5100.0,'shares_2028':200.0},'bull':{'owner_cash_2028':6000.0,'shares_2028':194.0}}},
  'gaps':['Exact October share count unknown; coverJuly24 used for valuation.',
   'Retrospective program accruals cannot be fully mapped to receipt dates from public cash statement.',
   'Payer reforms and2028 state-directed-payment changes require state-by-state cash estimates; no precise company-wide dollars asserted.',
   'Maintenance versus growth capex not separately quantified; proxy subtracts all capex.',
   'Credit/nursing/staffing and payer-regulatory risks remain material.']},
 'WCC':{
  'name':'Wesco International','price_usd':361.34,'price_source':'../../prices-20261012.json',
  'latest_disclosed_shares_million':48.732854,'share_date':'2026-07-29','share_source':'WCC-Q226 cover',
  'periods':{
   'FY2024':p('2024-12-31',12,'WCC-K25',21818.8,719.4,1101.2,94.7,28.9,425.0,81.5,ni_common=660.2,da=183.2),
   'FY2025':p('2025-12-31',12,'WCC-K25',23510.9,642.5,125.0,99.8,40.5,75.0,88.4,ni_common=645.8,da=197.6),
   'H1_2025':p('2025-06-30',6,'WCC-Q226 and WCC-Q225',11243.3,293.1,135.8,42.2,18.6,50.0,44.2,ni_common=293.2,da=96.7),
   'H1_2026':p('2026-06-30',6,'WCC-Q226',12745.2,363.7,275.1,51.6,35.2,39.9,48.8,ni_common=362.8,da=101.8)},
  'latest_balance':{'date':'2026-06-30','source':'WCC-Q226 balance sheet / note8','cash_reported':808.9,
   'debt_face':5985.9,'debt_book_total':5936.1,'long_term_debt_book':5911.1,'debt_issuance_cost_discount':49.8,
   'inventories':4418.0,'inventories_dec2025':4008.8,'note':'Cash is reported gross; FY2025 note says$16.6m restricted from operations at Dec31. June restricted component not separately identified in this package.'},
  'shares_million':{'FY2024_end':48.790595,'FY2025_end':48.658333,'H1_2025_end':48.660000,'H1_2026_end':48.732756,
   'H1_2025_diluted_average':49.5,'H1_2026_diluted_average':49.5,'note':'Common share count rises slightly despite repurchases; no net retirement yield demonstrated.'},
  'guidance':{'source':'WCC-DECK226 slide15 July30','period':'FY2026','revenue':[25900,26300],
   'organic_growth_pct':[9,11],'reported_growth_pct':[10,12],'adjusted_ebitda_margin_pct':[6.9,7.1],
   'adjusted_eps':[16.00,17.50],'company_adjusted_fcf':[300,600],'previous_adjusted_fcf':[500,800],
   'capex':100,'share_count_million':49.5,'sbc_expense':70,'cloud_amortization_expense':50,'interest_expense':[380,390],
   'note':'Adjusted EPS includes SBC and cloud amortization. Adjusted EBITDA excludes them. Company FCF adds back certain actual digital/restructuring cash costs.'},
  'observations':[
   {'fact':'Data center revenue grows rapidly while distributor working capital absorbs cash.', 'source':'WCC-ER226; WCC-DECK226',
    'numbers':{'q2_data_center_sales':1500,'q2_data_center_growth_pct_approx':45,'backlog_growth_pct_approx':60,
     'css_backlog_growth_pct_approx':95,'q2_css_sales':2681.2,'q2_css_adjusted_ebitda':273,
     'q2_css_adjusted_margin_pct':10.2,'q2_css_prior_adjusted_margin_pct':8.8}},
   {'fact':'Growth includes real volume, not only commodity inflation.', 'source':'WCC-Q226 MD&A; WCC-DECK226',
    'numbers':{'h1_organic_growth_pct':12.5,'h1_volume_growth_pct_approx':10,'h1_price_growth_pct_approx':3,
     'q2_css_volume_growth_pct_approx':17,'q2_css_price_growth_pct_approx':1}},
   {'fact':'Company H1 FCF differs from plain cash after capex because actual cash costs are added back.',
    'source':'WCC-ER226 Free cash flow reconciliation','numbers':{'h1_company_fcf':245.7,'h1_cfo':275.1,
     'h1_capex':51.6,'h1_actual_digital_restructuring_cash_added_back':22.2,
     'q2_company_fcf':32.3,'q2_cfo':53.7,'q2_capex':28.2,'q2_cash_addback':6.8}},
   {'fact':'Deferred customer revenue and supplier payables fund receivables/inventory; cash improvements are not all earnings.',
    'source':'WCC-Q226 cash-flow statement / note2','numbers':{'h1_ar_cash_change':-641.0,'h1_inventory_cash_change':-432.4,
     'h1_other_assets_cash_change':-192.5,'h1_accounts_payable_cash_change':726.0,'h1_other_liabilities_cash_change':192.3,
     'current_deferred_revenue_june2026':208.9,'current_deferred_revenue_dec2025':151.4,
     'noncurrent_deferred_revenue_june2026':100.2}},
   {'fact':'Adjusted Q2 net income bridge removes digital costs and debt extinguishment, while keeping SBC.',
    'source':'WCC-ER226 non-GAAP reconciliation','numbers':{'q2_gaap_eps':4.23,'q2_adjusted_eps':4.57,
     'q2_digital_transformation_expense':23.2,'q2_debt_extinguishment_loss':10.0,
     'h1_digital_transformation_expense':40.7}},
   {'fact':'Latest guidance raises sales and EPS but reduces FCF, a critical current-price underwriting signal.',
    'source':'WCC-DECK226 slide15','note':'Do not cite initial February$500–800m guide as latest.'},
   {'fact':'Repurchases are funded with cash and borrowings; shares did not decline in the first half.',
    'source':'WCC-Q226 note6 / balance sheet','numbers':{'h1_shares_repurchased':0.164885,'h1_repurchase_cost_including_excise':50.6,
     'unpaid_repurchase_obligation_june30':10.2}},
   {'fact':'The pending cash cycle should not be treated as permanently lost earnings, but total capital demanded by profitable growth must be modeled.',
    'source':'WCC-K25 and WCC-Q226 cash-flow statements','numbers':{'fy2025_pre_working_capital_cfo':941.7,
     'h1_2025_pre_working_capital_cfo':423.1,'h1_2026_pre_working_capital_cfo':656.5},
    'note':'Derived subtotal before changes in assets/liabilities. Not reported free cash flow; not available for distributions until collection/funding requirements are met.'}],
  'screen_judgment':'Rank4: reject as a current-price long for this batch. Growth and backlog are strong, but$361.34 already values adjusted FY2026 midpoint at21.57x, actual shareholder cash remains thin, the FCF guide has fallen, and net shares increase. A long needs a detailed collection/capital-turn model and margin persistence, not only AI demand.',
  'scenario_basis':{'basis':'author adjusted-EPS growth sensitivity; unchanged price/FY2026 guidance midpoint P/E, SBC remains included in adjusted EPS',
   'current_eps_usd':16.75,'dividends_24m_usd':4.0,
   'scenarios':{'bear':{'eps_2028_usd':14.0},'base':{'eps_2028_usd':20.0},'bull':{'eps_2028_usd':24.0}},
   'note':'This sensitivity is not an accepted forecast. Company-adjusted EPS does not resolve cash funding. Cash normalization$600m and future$800m would remain high29.35x/22.01x implied cash multiples at today equity value.'},
  'gaps':['Backlog absolute value, guaranteed purchases, cancellation terms and conversion duration are not provided by reviewed releases.',
   'Disaggregated data-center margins and working-capital terms are not public here; CSS contains more than data centers.',
   'LatestQ3 investor presentation not acquired;Q2 filing/deck is the quantitative baseline.',
   'Acquisition of Newark Engineering closedJuly1 after balance date; funding/price not quantified here.',
   'Cash restriction at June is not precisely disclosed in reviewed package; use reported gross cash with a limitation.']}
}

companies['CROX']['revenue_blocks']={
 'units':'USD million',
 'sources':{'FY2025':'CROX-K25 note11, source text lines1766–1790',
            'H1_2025':'CROX-Q226 note10, matched prior-period column',
            'H1_2026':'CROX-Q226 note10, current-period column'},
 'FY2025':{'crocs_na':1709.635,'crocs_international':1616.172,'crocs_brand':3325.807,'heydude':714.840,
  'crocs_na_wholesale':584.677,'crocs_na_dtc':1124.958,'crocs_intl_wholesale':1014.697,'crocs_intl_dtc':601.475,
  'crocs_wholesale':1599.374,'crocs_dtc':1726.433,'heydude_wholesale':336.325,'heydude_dtc':378.515},
 'H1_2025':{'crocs_na':825.647,'crocs_international':895.552,'crocs_brand':1721.199,'heydude':365.507,
  'crocs_na_wholesale':337.210,'crocs_na_dtc':488.437,'crocs_intl_wholesale':604.274,'crocs_intl_dtc':291.278,
  'crocs_wholesale':941.484,'crocs_dtc':779.715,'heydude_wholesale':210.453,'heydude_dtc':155.054},
 'H1_2026':{'crocs_na':804.659,'crocs_international':963.194,'crocs_brand':1767.853,'heydude':333.072,
  'crocs_na_wholesale':290.946,'crocs_na_dtc':513.713,'crocs_intl_wholesale':596.375,'crocs_intl_dtc':366.819,
  'crocs_wholesale':887.321,'crocs_dtc':880.532,'heydude_wholesale':165.966,'heydude_dtc':167.106}}
rb=companies['CROX']['revenue_blocks']; rb['TTM_20260630']={k:round(rb['FY2025'][k]+rb['H1_2026'][k]-rb['H1_2025'][k],6) for k in rb['FY2025']}
companies['CROX']['cash_blocks']={
 'source':'CROX-Q226 cash-flow statement, H1 2026, source text lines247–283', 'units':'USD million',
 'ni':342.443,'da':40.286,'operating_lease_cost_addback':56.581,'sbc':24.852,'impairment':3.301,
 'deferred_taxes':-0.053,'other_noncash':8.531,'ar_cash_change':-154.913,'inventory_cash_change':-22.832,
 'prepaid_other_asset_change':-21.297,'payable_accrued_other_liability_change':1.604,
 'lease_rou_liability_cash_change':-56.764,'income_tax_cash_change':49.029,
 'cfo':270.768,'capex_cash':-38.729,'proceeds_borrowings':295.000,'repay_borrowings':-223.000,
 'common_repurchases_including_excise_cash':-256.157,'tax_withholding_repurchases_cash':-3.238,
 'cash_financing':-187.395,'fx_cash':-4.724,'cash_including_restricted_beginning':133.911,
 'cash_including_restricted_ending':173.831,
 'note':'CFO − cash capex = 232.039. Subtract SBC as economic reserve gives207.187 H1 owner proxy. Cash movements include restricted cash; balance-sheet unrestricted cash is170.276.'}

for symbol,c in companies.items():
    periods=c['periods']; annual=periods['FY2025']; keys=[k for k in periods if k.endswith('_2025') and k!='FY2025']; old=periods[keys[0]]; new=periods[keys[0].replace('_2025','_2026')]
    metrics=['revenue','net_income_consolidated','net_income_common','cfo','capex_cash_outflow','sbc_cash_flow_addback','repurchase_cash_outflow','dividend_cash_outflow','nci_distribution_cash_outflow','depreciation_amortization']
    ttm={k:round(annual[k]+new[k]-old[k],6) for k in metrics if all(x[k] is not None for x in [annual,new,old])}
    ttm['method']='FY2025 + matched interim2026 - matched interim2025; no seasonal annualization.'
    ttm['period_end']=new['period_end']; ttm['units']='USD million'
    ttm['plain_fcf']=round(ttm['cfo']-ttm['capex_cash_outflow'],6)
    ttm['owner_cash_proxy_after_sbc']=round(ttm['plain_fcf']-ttm['sbc_cash_flow_addback'],6)
    ttm['owner_cash_proxy_after_sbc_and_nci']=round(ttm['owner_cash_proxy_after_sbc']-ttm['nci_distribution_cash_outflow'],6)
    shares=c.get('limited_post_modular_share_count_million',c['latest_disclosed_shares_million'])
    mc=c['price_usd']*shares; ttm['equity_value_with_stated_share_basis']=round(mc,6)
    ttm['owner_cash_yield_pct']=round(ttm['owner_cash_proxy_after_sbc_and_nci']/mc*100,6)
    c['derived_ttm']=ttm
    c['derived_share_change']={'fy2025_end_vs_fy2024_end_pct':round((c['shares_million']['FY2025_end']/c['shares_million']['FY2024_end']-1)*100,6),
     'interim2026_end_vs_interim2025_end_pct':round((c['shares_million'].get('H1_2026_end',c['shares_million'].get('9M_2026_end'))/c['shares_million'].get('H1_2025_end',c['shares_million'].get('9M_2025_end'))-1)*100,6),
     'note':c['shares_million'].get('note','Exact balance-sheet outstanding counts, not weighted-average dilution.')}
    b=c['scenario_basis']; results={}
    for name,sc in b['scenarios'].items():
        if 'normalized_current_owner_cash' in b:
            current_cash_per_share=b['normalized_current_owner_cash']/b['current_share_count']; multiple=c['price_usd']/current_cash_per_share
            price=multiple*sc['owner_cash_2028']/sc['shares_2028']
        else:
            multiple=c['price_usd']/b['current_eps_usd']; price=multiple*sc['eps_2028_usd']
        total=price+b['dividends_24m_usd']; results[name]={'unchanged_multiple':round(multiple,6),'price_target_usd':round(price,6),
            'price_return_pct':round((price/c['price_usd']-1)*100,6),'total_return_sensitivity_pct':round((total/c['price_usd']-1)*100,6),
            'annualized_total_return_sensitivity_pct':round((sqrt(total/c['price_usd'])-1)*100,6)}
    c['scenario_arithmetic']=results
    c['reverse_12pct_total_return_hurdle']={'required_terminal_price_usd_after_assumed_dividends':round(c['price_usd']*1.12**2-b['dividends_24m_usd'],6),
       'note':'12% annual total-return hurdle is an author choice, not a SPY forecast.'}
    c['evidence_status']='Primary financial statement data reconciled; root must adopt or reject scenario judgments before any pitch.'

w=companies['WCC']; w['derived_ttm']['pre_working_capital_cfo']=1175.1
w['derived_ttm']['pre_working_capital_owner_cash_proxy']=1008.8
w['derived_ttm']['pre_working_capital_owner_cash_yield_pct']=round(1008.8/w['derived_ttm']['equity_value_with_stated_share_basis']*100,6)

c=companies['CROX']; b=c['scenario_basis']; multiple=c['scenario_arithmetic']['base']['unchanged_multiple']
stress_shares=b['scenarios']['base']['shares_2028']+600/132
c['additional_settlement_stress']={'cash_outflow':600.0,'timing':'inside modeled24 months, purely hypothetical',
 'status':'Author stress, not predicted tax settlement and not a new reported liability.',
 'illustrative_average_avoided_net_share_buyback_price_usd':132.0,
 'illustrative_terminal_shares_million':round(stress_shares,6),
 'illustrative_terminal_price_usd':round(multiple*b['scenarios']['base']['owner_cash_2028']/stress_shares,6),
 'note':'Root should use its cash-budget model. This static sensitivity only shows reduced share reduction; no new borrowing assumed. Do not add600 to the reported639.580 liability as if two separate observed obligations.'}

out={'schema_version':1,'cutoff':'2026-10-12','forecast_horizon':'2028-10-12','currency':'USD',
 'authorization':'Read-only research and scoped local evidence writes. No trades, publication, external messaging or monitoring.',
 'proxy_definition':'CFO minus cash capex minus stock compensation addback minus distributions to noncontrolling owners when applicable. An author screen, not GAAP, company FCF or a complete valuation.',
 'proxy_limits':['Working-capital and tax timing can distort TTM; subtract all capex conservatively and distinguish transitory from recurring cash.',
  'SBC deduction is an economic dilution reserve approximation; do not also deduct it from EPS that already includes SBC.',
  'Retirement of shares belongs in future per-share earnings/cash, not as an additional yield on top of already modeled share reduction.',
  'Company acquisitions, debt principal and material deferred obligations can compete with cash distributions.',
  'Quoted prices are observed October12 closes; reported shares/balances have earlier stated dates.'],
 'ranking':['CROX','QCOM','HCA','WCC'],'companies':companies}
(ROOT/'evidence.json').write_text(json.dumps(out,indent=2)+'\n')
for symbol,c in companies.items():
    print(symbol,'TTM owner cash',c['derived_ttm']['owner_cash_proxy_after_sbc_and_nci'],'yield%',c['derived_ttm']['owner_cash_yield_pct'],'base sensitivity',c['scenario_arithmetic']['base'])
