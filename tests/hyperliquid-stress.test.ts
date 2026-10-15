import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import vm from 'node:vm'
const base='public/research/hyperliquid-valuation/'
const inputs=JSON.parse(readFileSync(base+'inputs.json','utf8'))
const frozen=JSON.parse(readFileSync(base+'stress-results.json','utf8'))
const scope: any={};vm.runInNewContext(readFileSync(base+'stress.js','utf8'),scope)
const S=scope.HypeStress
const close=(a:number,b:number)=>assert(Math.abs(a-b)<Math.max(1e-9,Math.abs(b)*1e-10),`${a} != ${b}`)
const mapping:Record<string,string>={crypto_delta:'cryptoDelta',noncrypto_delta:'noncryptoDelta',reserve_delta:'reserveDelta',fade_years:'fadeYears'}
test('all isolated stresses agree with independent Python output',()=>{
 for(const row of frozen.shocks){
  const args=Object.fromEntries(Object.entries(row.parameters).map(([k,v])=>[mapping[k]||k,v]))
  const result=S.calculate(inputs,'base',args)
  for(const key of ['perToken','valueB','driverYearsB','fadeYearsB','terminalB','postDriverShare','post2031Share'])close(result[key],row[key])
  result.flowsB.forEach((x:number,i:number)=>close(x,row.flowsB[i]))
 }
})
test('Python stress implementation executes and reproduces the committed outputs',()=>{
 const code=`import json,sys;sys.path.insert(0,${JSON.stringify(base)});import stress;print(json.dumps(stress.build(json.load(open(${JSON.stringify(base+'inputs.json')})))))`
 const actual=JSON.parse(execFileSync('python3',['-c',code],{encoding:'utf8'}))
 assert.deepEqual(actual,frozen)
})
test('the central scenario preserves its baseline and exposes long-duration dependence',()=>{
 const r=S.calculate(inputs)
 close(r.perToken,29.964894021693823)
 close(r.driverYearsB+r.fadeYearsB+r.terminalB,r.valueB)
 close(r.post2031Share,.7567507066780108)
 assert(r.post2031Share>r.terminalShare)
})
test('one basis point has correct units; timing and policy tests do not double count',()=>{
 const s=inputs.cases.base,p=S.streams(s,.9),q=S.streams(s,.9,-1)
 close(p[4].crypto-q[4].crypto,1.2)
 const v=S.calculate(inputs).perToken
 close(S.calculate(inputs,'base',{diversion:.2}).perToken,v*.8)
 close(S.calculate(inputs,'base',{delay:2}).perToken,v/1.18**2)
 close(S.calculate(inputs,'base',{supply:707}).perToken,v*955.31/707)
})
test('an isolated earlier-year improvement cannot reduce terminal value',()=>{
 const original=S.calculate(inputs),first=original.flowsB.slice(0,5),changed=first.slice();changed[3]+=1
 const v=S.value(changed,.18,.03,955.31,original.fixedGrowthAnchor)
 close(v.valueB-original.valueB,1/1.18**4)
 close(v.terminalB,original.terminalB)
 assert(v.perToken>original.perToken)
})
test('immediate maturity and implied return independently match closed-form checks',()=>{
 const r=S.calculate(inputs,'base',{fadeYears:0}),first=S.calculate(inputs).flowsB.slice(0,5)
 const direct=first.reduce((s:number,x:number,i:number)=>s+x/1.18**(i+1),0)+first[4]*1.03/(.18-.03)/1.18**5
 close(r.valueB,direct)
 const rate=S.impliedReturn(inputs,80);close(rate,frozen.impliedReturnAt80)
 close(S.calculate(inputs,'base',{r:rate}).perToken,80)
})
test('invalid, negative and zero-flow states do not leak stale valuations',()=>{
 assert.throws(()=>S.calculate(inputs,'base',{r:.03,g:.03}))
 assert.throws(()=>S.calculate(inputs,'base',{cryptoDelta:-10}))
 assert.throws(()=>S.calculate(inputs,'base',{reserveDelta:NaN}))
 assert.throws(()=>S.calculate(inputs,'base',{supply:0}))
 assert.throws(()=>S.calculate(inputs,'base',{diversion:1.1}))
 assert.throws(()=>S.calculate(inputs,'unknown'))
 close(S.calculate(inputs,'base',{diversion:1}).perToken,0)
 assert.equal(S.impliedReturn(inputs,80,'base',{diversion:1}),null)
})
test('source coverage and prose distinguish DEX share from the DEX/CEX ratio',()=>{
 close(frozen.marketContext.dexShareOfCovered,6.7/(86.2+6.7))
 const article=JSON.parse(readFileSync('src/personal/editorial/data/articles/hyperliquid-valuation.json','utf8'))
 assert(article.sources.some((s:any)=>s.id==='S19'&&s.href.includes('coingecko.com/research/')))
 const text=JSON.stringify(article)
 assert(text.includes('75.7%'));assert(text.includes('10.04%'));assert(text.includes('coverage sample'))
 assert(text.includes('not a claim that no fees exist'))
})
