/* Pure model: mirrors stress.py; all values are nominal USD billions. */
const AndurilModel = (() => {
  const defaults={case:'Base',discount:.12,terminal_growth:.03,scale:1,margin_shift:0,margin_delay:0,extra_collection_days:0,arsenal2_multiplier:1,net_cash:3,minority_value:0,available_cash:3,noncash_comp_ratio:0};
  const cases={"Downside":{"growth":[0.3,0.25,0.22,0.18,0.15,0.12,0.1,0.08,0.06,0.05],"margins":[-0.2,-0.12,-0.06,0,0.05,0.09,0.12,0.14,0.15,0.15],"nwc":[0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2],"capex":[0.06,0.06,0.06,0.055,0.05,0.045,0.04,0.04,0.04,0.04],"da":[0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02],"roic":0.1,"fade":[0.045,0.04,0.035,0.03,0.03]},"Base":{"growth":[0.6,0.45,0.35,0.3,0.27,0.24,0.21,0.18,0.15,0.12],"margins":[-0.2,-0.1,-0.03,0.03,0.09,0.14,0.18,0.2,0.21,0.22],"nwc":[0.18,0.18,0.18,0.18,0.17,0.16,0.15,0.14,0.14,0.14],"capex":[0.06,0.06,0.06,0.055,0.05,0.045,0.04,0.04,0.035,0.035],"da":[0.02,0.02,0.02,0.02,0.025,0.025,0.025,0.025,0.025,0.025],"roic":0.15,"fade":[0.09,0.07,0.05,0.04,0.03]},"Upside":{"growth":[0.75,0.6,0.5,0.4,0.3,0.25,0.2,0.18,0.15,0.12],"margins":[-0.15,-0.05,0.02,0.08,0.14,0.2,0.24,0.26,0.27,0.28],"nwc":[0.16,0.16,0.15,0.14,0.13,0.12,0.11,0.1,0.1,0.1],"capex":[0.06,0.06,0.06,0.055,0.05,0.045,0.04,0.035,0.03,0.03],"da":[0.02,0.02,0.02,0.02,0.025,0.025,0.025,0.025,0.025,0.025],"roic":0.2,"fade":[0.09,0.07,0.05,0.04,0.03]}};
  const a2=[.6,.85,.9,.85,.5,0,0,0,0,0], stub=78/365;
  const years=y=>(Date.UTC(y,11,31)-Date.UTC(2026,9,14))/86400000/365;
  function value(overrides={}) {
    const p={...defaults,...overrides}, c=cases[p.case];
    if(!c)throw Error('Choose a valid operating case.');
    for(const [k,v] of Object.entries(p))if(k!=='case'&&(typeof v!=='number'||!Number.isFinite(v)))throw Error('Every numerical assumption must be finite.');
    if(p.terminal_growth<0||p.terminal_growth>=Math.min(p.discount,c.roic)||p.scale<=0||p.minority_value<0||p.available_cash<0)throw Error('Growth must be below the discount rate and return on new capital. Scale must be positive; outside claims and liquidity cannot be negative.');
    if(!Number.isInteger(p.margin_delay)||p.margin_delay<0||p.margin_delay>2||Math.abs(p.margin_shift)>.10000000001||p.arsenal2_multiplier<0||p.extra_collection_days<0||p.extra_collection_days>120||p.noncash_comp_ratio<0||p.noncash_comp_ratio>.15)throw Error('An operating assumption is outside its supported range.');
    if(c.margins[9]+p.margin_shift<=0)throw Error('Mature operating margin must remain positive.');
    let revenue=4.3,nwc=.18*revenue,previousAR=0;
    const stub_fcf=(-1.2+.02*4.3-1-.18*(4.3-2.2))*stub;
    let pv=stub_fcf/(1+p.discount)**stub, economic=stub_fcf, timing=stub_fcf+4.3*stub*p.noncash_comp_ratio;
    let economicMin=Math.min(0,economic),timingMin=Math.min(0,timing); const rows=[];
    for(let i=0;i<15;i++){
      const year=2027+i,idx=Math.min(i,9);
      const growth=i<10?(1+c.growth[i])*p.scale**.1-1:c.fade[i-10]+(p.terminal_growth-.03)*(i-9)/5;
      revenue*=1+growth;
      const margin=c.margins[Math.min(9,Math.max(0,i-p.margin_delay))]+p.margin_shift*Math.min((i+1)/10,1);
      const ebit=revenue*margin,tax=Math.max(0,ebit)*.24,nopat=ebit-tax,da=revenue*c.da[idx];
      const nextNwc=revenue*c.nwc[idx],changeNwc=nextNwc-nwc,capex=revenue*c.capex[idx],arsenal2=(a2[i]||0)*p.arsenal2_multiplier;
      const raw=capex+arsenal2-da+changeNwc,fade=i>=10?(i-9)/5*(nopat*growth/c.roic-raw):0;
      const ar=revenue*p.extra_collection_days/365,changeAr=ar-previousAR,reinvestment=raw+fade+changeAr;
      const fcf=nopat-reinvestment,t=years(year),pvFcf=fcf/(1+p.discount)**t,addback=revenue*p.noncash_comp_ratio;
      economic+=fcf;timing+=fcf+addback;economicMin=Math.min(economicMin,economic);timingMin=Math.min(timingMin,timing);pv+=pvFcf;
      rows.push({year,revenue,growth,ebit_margin:margin,ebit,cash_tax:tax,nopat,depreciation:da,ordinary_capex:capex,arsenal2_capex:arsenal2,nwc:nextNwc,change_nwc:changeNwc,fade_reinvestment:fade,extra_receivables:ar,change_extra_receivables:changeAr,total_reinvestment:reinvestment,fcf,pv_fcf:pvFcf,cumulative_fcf:economic,discount_years:t,hypothetical_noncash_addback:addback,cash_timing_proxy:fcf+addback,cumulative_cash_timing_proxy:timing});
      nwc=nextNwc;previousAR=ar;
    }
    const terminalNopat=revenue*(1+p.terminal_growth)*(c.margins[9]+p.margin_shift)*.76;
    const terminalExtra=revenue*p.terminal_growth*p.extra_collection_days/365;
    const terminalFcf=terminalNopat*(1-p.terminal_growth/c.roic)-terminalExtra;
    const pvTerminal=terminalFcf/(p.discount-p.terminal_growth)/(1+p.discount)**years(2041),ev=pv+pvTerminal;
    return {parameters:p,enterprise_value:ev,gross_equity_value:ev+p.net_cash,equity_after_assumed_nci:ev+p.net_cash-p.minority_value,pv_explicit:pv,pv_terminal:pvTerminal,terminal_fcf:terminalFcf,terminal_extra_ar_investment:terminalExtra,revenue_2036:rows[9].revenue,ebit_margin_2036:rows[9].ebit_margin,peak_economic_fcf_deficit:-economicMin,economic_deficit_less_assumed_liquidity:Math.max(0,-economicMin-p.available_cash),peak_cash_timing_proxy_deficit:-timingMin,cash_timing_proxy_gap:Math.max(0,-timingMin-p.available_cash),first_positive_economic_fcf:rows.find(r=>r.fcf>0)?.year??null,first_positive_cash_timing_proxy:rows.find(r=>r.cash_timing_proxy>0)?.year??null,stub_fcf,rows};
  }
  function reverse(target,overrides={}){
    if(!Number.isFinite(target)||target<=0)throw Error('A positive finite equity target is required.');
    const p={...overrides};delete p.scale;let lo=.01,hi=10;
    if(!(value({...p,scale:lo}).equity_after_assumed_nci<target&&target<value({...p,scale:hi}).equity_after_assumed_nci))throw Error('Target is outside the supported revenue range.');
    for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(value({...p,scale:mid}).equity_after_assumed_nci<target)lo=mid;else hi=mid;}
    const scale=(lo+hi)/2,v=value({...p,scale});return{target,scale,revenue_2036:v.revenue_2036,revenue_cagr:(v.revenue_2036/4.3)**.1-1,residual:v.equity_after_assumed_nci-target};
  }
  return {value,reverse,defaults,cases};
})();
if(typeof globalThis!=='undefined')globalThis.AndurilModel=AndurilModel;
