"""Reconcile factual financial inputs into an inspectable candidate screen."""
from decimal import Decimal as D
import json
from pathlib import Path

BASE=Path(__file__).resolve().parent
inputs=json.loads((BASE/'inputs.json').read_text())
acquisition=json.loads((BASE/'acquisition.json').read_text())

def decimal(value): return D(str(value))
def num(value): return float(value)
def ttm(firm,key):
    return decimal(firm['FY2025'][key])+decimal(firm['YTD2026'][key])-decimal(firm['YTD2025'][key])

rows={}
for ticker in ('ADBE','PYPL','DBX','EXPE'):
    firm=inputs[ticker]
    common=['revenue','net_income','cfo','capex','sbc_cfo','buyback_cash']
    values={key:ttm(firm,key) for key in common}
    values['fcf']=values['cfo']-values['capex']
    values['fcf_less_cfo_added_sbc']=values['fcf']-values['sbc_cfo']
    values['latest_disclosed_shares']=decimal(firm['latest_disclosed_shares']['shares'])
    values['market_cap_at_frozen_price']=values['latest_disclosed_shares']*decimal(inputs['prices'][ticker])
    values['owner_cash_screen']=values['fcf_less_cfo_added_sbc']
    notes=['TTM = FY2025 + comparable YTD2026 − YTD2025. No interim annualization.',
           'Price times latest disclosed shares is a dated approximate capitalization; share count is not known exactly on Oct12.',
           'FCF = CFO − cash capex; owner-cash adjustments are author sensitivities, not GAAP or company metrics.']
    if ticker=='PYPL':
        values['adjusted_fcf']=ttm(firm,'adjusted_fcf')
        values['bnpl_adjustment']=ttm(firm,'bnpl_adjustment')
        values['sbc_capitalized']=ttm(firm,'sbc_capitalized')
        values['retained_loan_originations']=ttm(firm,'retained_loan_originations_investing')
        values['retained_loan_repayments_sales']=ttm(firm,'retained_loan_repayments_sales_investing')
        values['retained_loan_net_cash_investment']=values['retained_loan_originations']-values['retained_loan_repayments_sales']
        values['owner_cash_screen']-=values['sbc_capitalized']+values['retained_loan_net_cash_investment']
        b=firm['balance']
        values['liquid_corporate_cash_investments_ex_strategic']=decimal(b['cash'])+decimal(b['short_term_investments'])+decimal(b['long_term_investments'])-decimal(b['strategic_investments_in_long_term'])
        values['debt_carrying']=decimal(b['debt_current'])+decimal(b['debt_long_term'])
        values['liquid_less_debt_before_operating_regulatory_requirements']=values['liquid_corporate_cash_investments_ex_strategic']-values['debt_carrying']
        values['fy2026_guided_opex_midpoint']=decimal(firm['FY2025']['non_gaap_non_transaction_opex'])*D('1.075')
        values['fy2026_oi_implied_by_guidance_midpoint']=decimal(firm['FY2026_guidance']['transaction_margin_dollars'])-values['fy2026_guided_opex_midpoint']
        notes+=['The stricter screen charges capitalized SBC and net retained-loan cash investment. Loan principal remains an asset; this is a cash-distribution sensitivity, not a claim that lending destroys the principal.',
                'CFO-added SBC excludes amortization of prior capitalized SBC already included in D&A. Charging CFO-added SBC plus current capitalized SBC avoids additionally charging that amortization twice.',
                'Reported and BNPL-adjusted FCF are kept separate. Neither automatically equals cash distributable to shareholders.',
                'The liquidity calculation excludes customer assets and strategic equity investments; the remaining cash supports regulation/operations and receives no valuation bonus here.']
        assert values['fcf']+values['bnpl_adjustment']==values['adjusted_fcf']
        assert values['owner_cash_screen']==D('4804')
    elif ticker=='DBX':
        values['finance_lease_principal']=ttm(firm,'finance_lease_principal')
        values['owner_cash_screen']-=values['finance_lease_principal']
        b=firm['balance']
        values['cash_short_investments']=decimal(b['cash'])+decimal(b['short_term_investments'])
        values['debt_principal']=decimal(b['term_loan_principal'])+decimal(b['convertible_notes_principal'])
        values['net_debt_principal_ex_finance_leases']=values['debt_principal']-values['cash_short_investments']
        notes+=['Lease-principal cash payments and tax-adjusted interest added to unlevered FCF are material. Equity valuation uses levered CFO; never add interest back here.',
                'Latest cover shares include the unvested co-founder award; June balance shares exclude it. Latest cover is conservative for capitalizing at the frozen price.']
        assert D('443.0')-D('4.5')+D('81.4')==D('519.9')
        assert values['owner_cash_screen']==D('513.7')
    elif ticker=='EXPE':
        values['net_income_parent']=ttm(firm,'net_income_parent')
        for key in ('deferred_merchant_bookings_cash_change','merchant_payables_cash_change','accounts_receivable_cash_change','sbc_equity_book','b2c_revenue','b2b_revenue','b2c_adjusted_ebitda','b2b_adjusted_ebitda','adjusted_ebitda'):
            values[key]=ttm(firm,key)
        values['travel_working_capital_source']=values['deferred_merchant_bookings_cash_change']+values['merchant_payables_cash_change']+values['accounts_receivable_cash_change']
        values['owner_cash_screen']-=values['travel_working_capital_source']
        values['owner_cash_screen_with_current_equity_sbc_charge']=values['fcf']-values['travel_working_capital_source']-values['sbc_equity_book']
        values['b2c_ttm_adjusted_ebitda_margin']=values['b2c_adjusted_ebitda']/values['b2c_revenue']
        values['b2b_ttm_adjusted_ebitda_margin']=values['b2b_adjusted_ebitda']/values['b2b_revenue']
        q26,q25=firm['Q2_2026'],firm['Q2_2025']
        for segment in ('b2c','b2b'):
            values[segment+'_q2_revenue_growth']=decimal(q26[segment+'_revenue'])/decimal(q25[segment+'_revenue'])-1
            values[segment+'_q2_ebitda_growth']=decimal(q26[segment+'_adjusted_ebitda'])/decimal(q25[segment+'_adjusted_ebitda'])-1
            values[segment+'_q2_2026_margin']=decimal(q26[segment+'_adjusted_ebitda'])/decimal(q26[segment+'_revenue'])
            values[segment+'_q2_2025_margin']=decimal(q25[segment+'_adjusted_ebitda'])/decimal(q25[segment+'_revenue'])
        notes+=['The no-growth travel-working-capital sensitivity removes only the net of booking deposits, merchant AP and all AR; all AR is an imperfect proxy for the travel operating cycle. This is not exact normalized FCF.',
                'A stricter alternative charges current equity-book SBC rather than the cash-flow addback, showing capitalization sensitivity.',
                'CFO is consolidated including trivago; parent-only distributable CFO is not separately disclosed. Some cash belongs to noncontrolling interests.',
                'No excess-cash bonus is assigned to cash collected before supplier settlement. Levered equity cash is valued without again deducting debt principal.']
        assert values['travel_working_capital_source']==D('1399')
        assert values['owner_cash_screen']==D('2648')
    elif ticker=='ADBE':
        values['operating_income']=ttm(firm,'operating_income')
        b=firm['balance']
        values['net_debt_carrying']=decimal(b['debt_current_carrying'])+decimal(b['debt_long_term_carrying'])-decimal(b['cash'])-decimal(b['short_term_investments'])
        values['net_shares_retired_ytd']=decimal(b['FY2025_balance_shares'])-decimal(b['balance_shares'])
        values['net_share_retirement_fraction_ytd']=values['net_shares_retired_ytd']/decimal(b['FY2025_balance_shares'])
        values['gaap_guidance_midpoint_pe']=decimal(inputs['prices'][ticker])/((decimal(firm['FY2026_guidance']['gaap_eps_low'])+decimal(firm['FY2026_guidance']['gaap_eps_high']))/2)
        values['ai_first_arr_disclosed_floor_ratio']=decimal(firm['operating']['ai_first_arr_disclosed_floor'])/decimal(firm['operating']['arr_q3_fy2026'])
        notes+=['AI ARR ratio is a lower-bound comparison. The disclosure does not give an exact AI revenue share or net monetization margin.',
                'Total ARR growth includes Semrush and cannot be labeled organic.',
                'The 9M current CFO-added SBC differs from income-statement SBC by $2m; the screen explicitly uses the cash-flow addback.']
        assert values['owner_cash_screen']==D('8521')
    values['owner_cash_yield']=values['owner_cash_screen']/values['market_cap_at_frozen_price']
    values['owner_cash_multiple']=values['market_cap_at_frozen_price']/values['owner_cash_screen']
    ni=values.get('net_income_parent',values['net_income'])
    values['gaap_net_income_multiple_current_share_capitalization']=values['market_cap_at_frozen_price']/ni
    r=D('0.10')
    values['perpetuity_growth_required_for_10pct_equity_discount_rate']=(r*values['market_cap_at_frozen_price']-values['owner_cash_screen'])/(values['market_cap_at_frozen_price']+values['owner_cash_screen'])
    notes+=['Perpetuity diagnostic solves market cap = cash_now × (1+g)/(10%−g). It is an author algebraic hurdle, not a DCF target, market consensus or observed market expectation. Infinite-life cash durability is assumed.']
    rows[ticker]={'derived':{k:num(v) for k,v in values.items()},'methodology_notes':notes}

dates={
 'adbe-fy-2025':'2026-01-15','adbe-q3-2026':'2026-09-22','adbe-q3-2026-release':'2026-09-10','adbe-q3-2026-datasheet':'2026-09-10','adbe-q3-2026-prepared-remarks':'2026-09-10','adbe-ceo-transition-2026':'2026-09-03',
 'pypl-fy-2025':'2026-02-03','pypl-q2-2026':'2026-07-28','pypl-q2-2026-release':'2026-07-28','pypl-q2-2026-presentation':'2026-07-28','pypl-q2-2026-newsletter':'2026-07-28','pypl-fy-2025-release':'2026-02-03','pypl-q1-2026-release':'2026-05-05',
 'dbx-fy-2025':'2026-02-20','dbx-q2-2026':'2026-08-06','dbx-q2-2026-release':'2026-08-06','dbx-q2-2026-supplement':'2026-08-06','dbx-q2-2026-prepared-remarks':'2026-08-06','dbx-q2-2026-presentation':'2026-08-06',
 'expe-fy-2025':'2026-02-12','expe-q2-2026':'2026-08-05','expe-q2-2026-release':'2026-08-05',
}
sources=[{**s,'report_date':dates.get(s['id']),'report_date_basis':'Document/release date; live index pages without dates are discovery-only.'} for s in acquisition['sources']]
evidence={'cutoff':inputs['cutoff'],'units':inputs['units'],'facts':inputs,'screen':rows,'sources':sources,'status':'Primary facts read and arithmetic reconciled; root retains selection and forecast ownership.'}
(BASE/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
for ticker,row in rows.items():
    d=row['derived']
    print(f"{ticker}: TTM revenue={d['revenue']:,.1f}; FCF={d['fcf']:,.1f}; owner sensitivity={d['owner_cash_screen']:,.1f}; equity cap={d['market_cap_at_frozen_price']:,.1f}; cash yield={d['owner_cash_yield']:.2%}")
