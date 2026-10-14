/* DOM rendering is separate from the dependency-free valuation functions. */
'use strict';
const M=globalThis.HypeValuation, el=id=>document.getElementById(id), form=el('controls');
function update(){
 try{
  if(!form.checkValidity())throw new Error('Enter valid numbers within the labeled ranges.');
  const r=Number(el('rate').value)/100,g=Number(el('growth').value)/100,supply=Number(el('supply').value),reference=Number(el('reference').value);
  const streams=M.explicit(M.inputs.cases[el('scenario').value],M.inputs.reserveShare),first=streams.map(s=>Object.values(s).reduce((a,b)=>a+b,0)),v=M.value(first,r,g,supply);
  el('price').textContent='$'+v.perToken.toFixed(2);el('aggregate').textContent='$'+v.total.toFixed(2)+'bn';
  el('explanation').textContent=(v.terminalShare*100).toFixed(1)+'% of value comes from the terminal stream beyond 2036. Explicit annual flows are discounted at '+(r*100).toFixed(1)+'%; the reference price is illustrative, not a live quote.';
  el('flows').replaceChildren(...v.flows.map((f,i)=>{const row=document.createElement('tr');[2027+i,i<5?'Driver forecast':'Growth fade',f.toFixed(3),v.pv[i].toFixed(3)].forEach(t=>{const cell=document.createElement('td');cell.textContent=t;row.append(cell);});return row;}));
  el('streams').replaceChildren(...streams.map((s,i)=>{const row=document.createElement('tr');[2027+i,...Object.values(s).map(x=>x.toFixed(3))].forEach(t=>{const cell=document.createElement('td');cell.textContent=t;row.append(cell);});return row;}));
  const start=M.inputs.observed.allProductHolderReceipts30dM/1000*365/30,c=M.growthNeeded(start,reference*supply/1000,r,g),implied=M.value(Array.from({length:5},(_,i)=>start*(1+c)**(i+1)),r,g,supply);
  el('inverse').textContent='At $'+reference.toFixed(2)+' and '+supply.toLocaleString('en-US',{maximumFractionDigits:2})+' million claims, the reference value is $'+(reference*supply/1000).toFixed(2)+'bn. Starting with $'+start.toFixed(3)+'bn of annualized parent holder receipts, an equivalent first-five-year growth rate is '+(c*100).toFixed(1)+'%, followed by the same five-year fade. Implied annual flow reaches $'+implied.flows[4].toFixed(2)+'bn in 2031 and $'+implied.flows[9].toFixed(2)+'bn in 2036. This is an aggregate path, not a product revenue forecast.';
  el('error').hidden=true;el('output').hidden=false;
 }catch(error){el('error').textContent=error.message;el('error').hidden=false;el('output').hidden=true;}
}
form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('reset',()=>setTimeout(update,0));update();
