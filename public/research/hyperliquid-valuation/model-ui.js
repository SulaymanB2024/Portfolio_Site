'use strict';
const D=globalThis.HypeValuation.inputs,S=globalThis.HypeStress,$=id=>document.getElementById(id),form=$('controls');
const ids=['scenario','rate','growth','supply','reference','maturity','crypto','noncrypto','reserve','diversion','delay'];
const defaults=Object.fromEntries(ids.map(id=>[id,$(id).value]));
function row(values){const tr=document.createElement('tr');for(const v of values){const td=document.createElement('td');td.textContent=v;tr.append(td);}return tr;}
const money=x=>(x<0?'−$':'$')+Math.abs(x).toFixed(2);
function chart(v,delay){
 const svg=$('flow-chart'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();
 const add=(name,attrs={},text)=>{const el=document.createElementNS(ns,name);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;svg.append(el);return el;};
 add('title',{id:'flow-title'},'Annual modeled HYPE-directed flows, USD billions');
 add('desc',{id:'flow-desc'},v.flowsB.map((x,i)=>`${2027+i+delay}: ${x.toFixed(3)} billion dollars`).join('; ')+'. Hatched bars denote the growth-fade phase, not a confidence interval.');
 const defs=add('defs'),pattern=document.createElementNS(ns,'pattern');pattern.setAttribute('id','fade-hatch');pattern.setAttribute('patternUnits','userSpaceOnUse');pattern.setAttribute('width','6');pattern.setAttribute('height','6');const line=document.createElementNS(ns,'path');line.setAttribute('d','M-1 1L1-1M0 6L6 0M5 7L7 5');line.setAttribute('stroke','#68665e');line.setAttribute('stroke-width','1');pattern.append(line);defs.append(pattern);
 const maximum=Math.max(...v.flowsB,1)*1.18,left=48,right=704,top=32,bottom=242,w=(right-left)/v.flowsB.length;
 [0,.5,1].forEach(f=>{const y=bottom-(bottom-top)*f;add('line',{x1:left,x2:right,y1:y,y2:y,stroke:'#d4cfc4'});add('text',{x:39,y:y+5,'text-anchor':'end','font-family':'Arial','font-size':13,fill:'#68665e'},(maximum*f).toFixed(1));});
 v.flowsB.forEach((x,i)=>{const h=x/maximum*(bottom-top),bx=left+i*w+w*.17;add('rect',{x:bx,y:bottom-h,width:w*.66,height:h,fill:i<5?'#24221e':'url(#fade-hatch)'});add('text',{x:bx+w*.33,y:bottom-h-7,'text-anchor':'middle','font-family':'Arial','font-size':13,fill:'#24221e'},x.toFixed(2));add('text',{x:bx+w*.33,y:264,'text-anchor':'middle','font-family':'Arial','font-size':13,fill:'#68665e'},String(2027+i+delay));});
 add('text',{x:48,y:292,'font-family':'Arial','font-size':12,fill:'#68665e'},'Solid: driver forecasts   /   Hatched: aggregate growth fade   /   Periods end October 14');
}
function update(){
 try{
  if(!form.checkValidity())throw new Error('Enter valid numbers within the labeled ranges.');
  const o={r:Number($('rate').value)/100,g:Number($('growth').value)/100,supply:Number($('supply').value),cryptoDelta:Number($('crypto').value),noncryptoDelta:Number($('noncrypto').value),reserveDelta:Number($('reserve').value)/100,diversion:Number($('diversion').value)/100,delay:Number($('delay').value),fadeYears:Number($('maturity').value)};
  const key=$('scenario').value,reference=Number($('reference').value),v=S.calculate(D,key,o);
  $('price').textContent=money(v.perToken);$('reference-display').textContent=money(reference);
  $('explanation').textContent=`${D.cases[key].label}: $${v.valueB.toFixed(2)}bn of aggregate value. ${(v.postDriverShare*100).toFixed(1)}% depends on flows after the first five driver-based years; ${(v.terminalShare*100).toFixed(1)}% is terminal value.`;
  const implied=S.impliedReturn(D,reference,key,o);
  $('implied').textContent=implied===null?'No required return between terminal growth and 99% reconciles this stream with the reference price.':`The selected stream supports ${money(reference)} at a ${(implied*100).toFixed(2)}% required return. This is a model-implied discount rate, not a forecast of realized token returns.`;
  chart(v,o.delay);
  $('flows').replaceChildren(...v.flowsB.map((x,i)=>row([`${2027+i+o.delay}-10-14`,i<5?'Driver forecast':'Growth fade',x.toFixed(3),v.pvFlowsB[i].toFixed(3)])));
  $('streams').replaceChildren(...v.streamsB.map((s,i)=>row([2027+i,...Object.values(s).map(x=>x.toFixed(3))])));
  try {
  const start=D.observed.allProductHolderReceipts30dM/1000*365/30,inverse=S.inverse(start,reference*o.supply/1000,o.r,o.g,o.supply);
  $('inverse').textContent=`At ${money(reference)} and ${o.supply.toLocaleString('en-US',{maximumFractionDigits:2})} million claims, the implied aggregate value is $${(reference*o.supply/1000).toFixed(2)}bn. The separate constant-growth benchmark requires ${(inverse.growth*100).toFixed(1)}% annual growth for five years, then a five-year fade. Annual flow reaches $${inverse.flowsB[4].toFixed(2)}bn in 2031 and $${inverse.flowsB[9].toFixed(2)}bn in 2036.`;
  } catch { $('inverse').textContent='The separate reverse-growth benchmark has no solution within its bounded search range. Your selected operating valuation above remains valid.'; }
  $('headline').hidden=false;$('output').hidden=false;$('error').hidden=true;
  return true;
 }catch(error){$('error').textContent=error.message;$('error').hidden=false;$('headline').hidden=true;$('output').hidden=true;return false;}
}
const tests=[['Unchanged central case',{}],['Crypto retained fees −1 bp',{cryptoDelta:-1}],['Non-crypto retained fees −0.25 bp',{noncryptoDelta:-.25}],['Reserve yield −1 percentage point',{reserveDelta:-.01}],['20% of future receipts redirected',{diversion:.2}],['Entire stream delayed two years',{delay:2}],['Stable growth immediately after 2031',{fadeYears:0}]];
const central=S.calculate(D).perToken;
$('stress-table').replaceChildren(...tests.map(([label,o])=>{const x=S.calculate(D,'base',o).perToken;return row([label,money(x),(x-central>0?'+':'')+money(x-central)]);}));
form.querySelector('fieldset').disabled=false;
try{const state=new URLSearchParams(location.hash.slice(1));for(const id of ids)if(state.has(id))$(id).value=state.get(id);}catch{}
form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('reset',()=>{setTimeout(()=>{for(const id of ids)$(id).value=defaults[id];$('share-status').textContent='';$('share-fallback').hidden=true;history.replaceState(null,'',location.pathname+location.search);update();},0);});
$('share').addEventListener('click',async()=>{
 if(!update())return;
 const state=new URLSearchParams(ids.map(id=>[id,$(id).value])),url=new URL(location.href);url.hash=state.toString();history.replaceState(null,'',url);
 try{if(!navigator.clipboard?.writeText)throw new Error('Unavailable');await navigator.clipboard.writeText(url.href);$('share-status').textContent='Exact assumptions copied in the link.';$('share-fallback').hidden=true;}
 catch{$('share-fallback').value=url.href;$('share-fallback').hidden=false;$('share-fallback').focus();$('share-fallback').select();$('share-status').textContent='Copy the selected link. Its fragment contains your assumptions.';}
});
update();
