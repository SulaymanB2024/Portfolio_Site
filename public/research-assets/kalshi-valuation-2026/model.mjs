export const assumptions = {"as_of":"2026-10-14","tax_rate":0.26,"discount_rate":0.13,"terminal_growth":0.03,"terminal_roic":0.2,"sales_to_capital":4.0,"net_cash_illustration":1.0,"starting_annual_revenue_normalization":4.0,"stub":{"revenue_rate":4.0,"ebit_margin":0.38,"reinvestment_rate":0.06},"fade_growth":[0.12,0.1,0.08,0.06,0.04],"cases":{"Restricted":{"weight":0.25,"start":[75,45,150,0.01,0.0065,0.0002,0.08,-0.3],"end":[150,100,700,0.008,0.0055,0.0002,0.15,0.3]},"Base":{"weight":0.5,"start":[300,70,400,0.0135,0.0075,0.00025,0.15,0.42],"end":[600,200,2000,0.011,0.0065,0.00025,0.45,0.5]},"Breakout":{"weight":0.25,"start":[380,100,700,0.0145,0.009,0.0004,0.2,0.45],"end":[1000,400,4000,0.0125,0.008,0.00035,0.9,0.58]}},"driver_order":["sports_notional","other_event_notional","perps_notional","sports_net_yield","other_event_net_yield","perps_net_yield","data_and_net_interest","ebit_margin"]};

/** USD billions. Public inputs are author assumptions, not company guidance. */
export function valueCase(name, options = {}) {
  const a = assumptions, c = a.cases[name];
  if (!c) throw new Error('Unknown scenario');
  const r = options.discount ?? a.discount_rate;
  const g = options.growth ?? a.terminal_growth;
  const cash = options.cash ?? a.net_cash_illustration;
  const scale = options.scale ?? 1;
  const shock = options.shock ?? 0;
  if (![r,g,cash,scale,shock].every(Number.isFinite) || r <= g || g < 0 || g >= a.terminal_roic || scale <= 0) throw new Error('Require discount > growth, growth below terminal ROIC, and positive scale.');
  const years = year => (Date.UTC(year,11,31)-Date.parse(a.as_of+'T00:00:00Z'))/86400000/365;
  const rows=[]; let prev=a.starting_annual_revenue_normalization;
  for(let year=2027;year<=2036;year++) {
    let revenue, margin;
    if(year<=2031) {
      const f=(year-2027)/4;
      const d=c.start.map((v,i)=>[0,1,2,6].includes(i)?v*(c.end[i]/v)**f:v+(c.end[i]-v)*f);
      d[3]=Math.max(0,d[3]+shock);
      revenue=(d[0]*d[3]+d[1]*d[4]+d[2]*d[5]+d[6])*scale; margin=d[7];
    } else {revenue=prev*(1+a.fade_growth[year-2032]);margin=c.end[7];}
    const ebit=revenue*margin, nopat=ebit-Math.max(ebit,0)*a.tax_rate;
    const reinvestment=Math.max(revenue-prev,0)/a.sales_to_capital;
    const fcf=nopat-reinvestment, pv=fcf/(1+r)**years(year);
    rows.push({year,revenue,margin,ebit,nopat,reinvestment,fcf,pv});prev=revenue;
  }
  const terminalNopat=rows.at(-1).nopat*(1+g);
  const terminalFcf=terminalNopat*(1-g/a.terminal_roic);
  const pvTerminal=terminalFcf/(r-g)/(1+r)**years(2036);
  const s=a.stub, stubRevenue=s.revenue_rate*years(2026);
  const pvStub=stubRevenue*(s.ebit_margin*(1-a.tax_rate)-s.reinvestment_rate)/(1+r)**years(2026);
  const ev=rows.reduce((sum,row)=>sum+row.pv,0)+pvTerminal+pvStub;
  return {name,weight:c.weight,ev,equity:ev+cash,pvTerminal,pvStub,terminalShare:pvTerminal/ev,rows};
}
export function valuation(options={}) {
  const cases=Object.keys(assumptions.cases).map(name=>valueCase(name,options));
  return {cases,weightedEv:cases.reduce((s,c)=>s+c.ev*c.weight,0),weightedEquity:cases.reduce((s,c)=>s+c.equity*c.weight,0)};
}
export function reverseScale(target=40, options={}) {
  let lo=.01,hi=100;
  for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(valueCase('Base',{...options,scale:mid}).equity<target)lo=mid;else hi=mid;}
  return (lo+hi)/2;
}
