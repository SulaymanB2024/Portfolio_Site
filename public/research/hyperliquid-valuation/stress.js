/* Pure stress engine; USD bn flows, USD tn turnover, bp fees, million claims.
   Isolated shocks HOLD the original scenario growth anchor fixed. */
(function(root){
'use strict';
const finite=(x,name)=>{if(typeof x!=='number'||!Number.isFinite(x))throw new Error(name+' must be finite.');return x;};
function streams(s,share,cryptoDelta=0,noncryptoDelta=0,reserveDelta=0){
 [share,cryptoDelta,noncryptoDelta,reserveDelta].forEach(x=>finite(x,'Assumption'));
 return Array.from({length:5},(_,i)=>{
  const cr=s.cryptoNetBps[i]+cryptoDelta,nr=s.noncryptoNetBps[i]+noncryptoDelta,yr=s.costAdjustedReserveYield[i]+reserveDelta;
  if([cr,nr,yr].some(x=>!Number.isFinite(x)||x<0))throw new Error('A shock makes an annual retained fee or reserve yield negative.');
  return {crypto:s.cryptoVolumeT[i]*cr/10,noncrypto:s.noncryptoVolumeT[i]*nr/10,spot:s.spotVolumeT[i]*s.spotNetBps[i]/10,reserves:s.eligibleStablecoinBalanceB[i]*yr*share,other:s.otherNetFeesB[i],outcomes:s.outcomeNetFeesB[i]};
 });
}
function value(first,r,g,supply,anchor,diversion=0,delay=0,fadeYears=5){
 [r,g,supply,anchor,diversion,delay].forEach(x=>finite(x,'Assumption'));
 if(!(0<=g&&g<r&&r<1&&supply>0&&diversion>=0&&diversion<=1&&delay>=0&&anchor>-1))throw new Error('Use 0 ≤ terminal growth < required return < 100%, positive claims and valid retention/timing.');
 if(first.length!==5||first.some(x=>!Number.isFinite(x)||x<0)||![0,5].includes(fadeYears))throw new Error('Use five nonnegative flows and a zero- or five-year fade.');
 const gross=first.slice(),fadeRates=[];
 for(let j=1;j<=fadeYears;j++){const x=anchor+(g-anchor)*j/fadeYears;fadeRates.push(x);gross.push(gross.at(-1)*(1+x));}
 const flowsB=gross.map(x=>x*(1-diversion)),pvFlowsB=flowsB.map((x,i)=>x/(1+r)**(i+1+delay));
 const terminalB=flowsB.at(-1)*(1+g)/(r-g)/(1+r)**(flowsB.length+delay),sum=xs=>xs.reduce((a,b)=>a+b,0);
 const driverYearsB=sum(pvFlowsB.slice(0,5)),fadeYearsB=sum(pvFlowsB.slice(5)),valueB=driverYearsB+fadeYearsB+terminalB;
 if(!Number.isFinite(valueB))throw new Error('Assumptions exceed the finite model range.');
 return {flowsB,pvFlowsB,fadeRates,valueB,perToken:valueB*1000/supply,driverYearsB,fadeYearsB,terminalB,postDriverShare:valueB?(fadeYearsB+terminalB)/valueB:0,post2031Share:valueB?(sum(pvFlowsB.filter((_,i)=>2027+i+delay>2031))+terminalB)/valueB:0,terminalShare:valueB?terminalB/valueB:0};
}
function calculate(data,key='base',o={}){
 const s=data.cases[key];if(!s)throw new Error('Unknown operating scenario.');
 const total=x=>Object.values(x).reduce((a,b)=>a+b,0),base=streams(s,data.reserveShare).map(total),anchor=base[4]/base[3]-1;
 const products=streams(s,data.reserveShare,o.cryptoDelta??0,o.noncryptoDelta??0,o.reserveDelta??0);
 return {...value(products.map(total),o.r??data.discountRate,o.g??data.terminalGrowth,o.supply??data.supplyM,anchor,o.diversion??0,o.delay??0,o.fadeYears??5),streamsB:products,fixedGrowthAnchor:anchor};
}
function inverse(start,target,r,g,supply){
 [start,target,r,g,supply].forEach(x=>finite(x,'Inverse assumption'));
 if(!(start>0&&target>0))throw new Error('Inverse valuation needs positive receipts and reference value.');
 const f=c=>value(Array.from({length:5},(_,i)=>start*(1+c)**(i+1)),r,g,supply,c).valueB;
 let lo=-.5,hi=3;if(f(lo)>target||f(hi)<target)throw new Error('Reference is outside the inverse-model bracket.');
 for(let n=0;n<100;n++){const m=(lo+hi)/2;if(f(m)>target)hi=m;else lo=m;}
 const growth=(lo+hi)/2;
 return {growth,...value(Array.from({length:5},(_,i)=>start*(1+growth)**(i+1)),r,g,supply,growth)};
}
function impliedReturn(data,price,key='base',o={}){
 finite(price,'Reference price');if(price<=0)throw new Error('Reference price must be positive.');
 const opts={...o};delete opts.r;
 let lo=(opts.g??data.terminalGrowth)+1e-8,hi=.99;
 if(calculate(data,key,{...opts,r:lo}).perToken<price||calculate(data,key,{...opts,r:hi}).perToken>price)return null;
 for(let n=0;n<100;n++){const m=(lo+hi)/2;if(calculate(data,key,{...opts,r:m}).perToken>price)lo=m;else hi=m;}
 return (lo+hi)/2;
}
root.HypeStress={streams,value,calculate,inverse,impliedReturn};
})(globalThis);
