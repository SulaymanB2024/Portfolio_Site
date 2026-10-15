import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { qualityReadingMinutes, qualityProseWords } from '../../tools/article-quality-integrity.mjs'

const root='docs/long-pitches-20261012'
const read=p=>JSON.parse(readFileSync(p,'utf8'))
const write=(p,x)=>writeFileSync(p,JSON.stringify(x,null,2)+'\n')
const manifest=read(`${root}/article-manifest.json`)
const catalog=read('src/personal/editorial/data/catalog.json')
const guides=read('src/personal/editorial/data/reader-guides.json')
const publications=read('docs/article-publications.json')
let presentations=readFileSync('src/personal/editorial/article-presentation.ts','utf8')
let assignments=readFileSync('src/personal/editorial/generative/manifest.ts','utf8')
const summaryKeys=['slug','path','title','displayTitle','seoTitle','seoDescription','category','subtitle','searchTerms','date','dateModified','readTime','image','kind']
const guideCopy={
 ADBE:{question:'How much paid growth does this entry price need?',answer:'The base-case valuation and capital budget need about $7.38bn of annual cash at the horizon to support a 10% annual price return. That is below the $8.52bn trailing cash-after-compensation proxy, but it depends on durable paid demand, affordable share reduction and a higher cash multiple.',paths:[{label:'Read the paid-demand evidence',section:'the-paid-business-is-still-growing',description:'Compare subscriptions, recurring revenue and contracted obligations.'},{label:'Reconcile the cash anchor',section:'the-cash-bridge-makes-the-entry-attractive',description:'Charge employee equity before valuing distributable cash.'},{label:'Separate growth from revaluation',section:'how-i-get-to-365',description:'Compare the forecast with a constant entry multiple.'}]},
 PYPL:{question:'Which measure would show the recovery is real?',answer:'Watch transaction-margin dollars excluding customer interest alongside the cost budget. In Q2, that contribution grew 2.6% in reported dollars while adjusted non-transaction costs grew 8.8%. The long needs better retained economics as well as affordable share reduction.',paths:[{label:'Follow the transaction-margin bridge',section:'the-quarter-explains-why-the-valuation-stays-demanding',description:'See where additional revenue went after transaction costs and losses.'},{label:'Value cash after credit reinvestment',section:'the-cash-i-am-willing-to-value',description:'Keep the loan-funding and equity-compensation charges visible.'},{label:'Test the capital-return budget',section:'a-modest-recovery-can-fund-meaningful-net-retirement',description:'Fund fewer shares after dividends and liquidity needs.'}]},
 CROX:{question:'Can Crocs fund growth without a HEYDUDE rebound?',answer:'The base case grows Crocs brand sales 4% annually while HEYDUDE falls 2%, and protects $250m annually for debt, tax or liquidity needs before net share purchases. A large early tax payment would interrupt those purchases and change the capital plan.',paths:[{label:'Compare the two brands',section:'the-profitable-brand-is-larger-than-the-failed-acquisition-story',description:'Separate the profitable franchise from the smaller declining business.'},{label:'Reconcile cash quality',section:'the-cash-exists-but-its-recent-increase-is-not-all-operating-progress',description:'Distinguish tax timing from recurring cash earning power.'},{label:'Stress the tax cash claim',section:'the-tax-balance-is-the-strongest-reason-to-keep-a-reserve',description:'See why a cheap multiple still needs a protected cash budget.'}]},
 EXPE:{question:'What cash remains after the travel-deposit cycle?',answer:'Trailing reported FCF of $4.459bn falls to a $2.648bn underwriting sensitivity after removing $1.399bn of net travel working-capital financing and $412m of compensation. Receivables are an imperfect proxy; the long must work from recurring economics after customer obligations.',paths:[{label:'Compare consumer and partner conversion',section:'the-fastest-growing-business-is-not-producing-the-fastest-profit-growth',description:'Keep B2C and B2B margins distinct.'},{label:'Remove the deposit financing',section:'remove-the-deposit-financing-before-deciding-what-to-pay',description:'Reconcile bookings, payables and receivables across a full year.'},{label:'Read the price assumptions',section:'a-360-forecast-with-visible-valuation-dependence',description:'Compare operational upside with the part requiring revaluation.'}]},
}
mkdirSync('public/images/research',{recursive:true});mkdirSync('public/images/social',{recursive:true});mkdirSync('public/downloads/research',{recursive:true})
for(const item of manifest){
 const article=read(item.article)
 article.readTime=`${qualityReadingMinutes(article)} MIN`;write(item.article,article)
 const summary=Object.fromEntries(summaryKeys.map(k=>[k,article[k]]))
 const index=catalog.findIndex(x=>x.slug===article.slug)
 if(index>=0)catalog[index]=summary;else catalog.unshift(summary)
 guides[article.slug]={...guideCopy[item.symbol],sources:article.sources.slice(0,2).map(({label,href})=>({label,href}))}
 const record={slug:article.slug,path:item.article,canonicalPath:article.path,datePublished:article.date,dateModified:article.dateModified,articleSha256:createHash('sha256').update(readFileSync(item.article)).digest('hex'),proseWords:qualityProseWords(article),readTime:article.readTime,claimsPath:`${root}/source-register.json`}
 publications.records=[...publications.records.filter(x=>x.slug!==article.slug),record]
 manifest.find(x=>x.symbol===item.symbol).proseWords=record.proseWords
 manifest.find(x=>x.symbol===item.symbol).readTime=article.readTime
 const pLine=`  '${article.slug}': { form: 'model', lines: ${JSON.stringify(item.lines)} },`
 if(!presentations.includes(`'${article.slug}'`))presentations=presentations.replace('export const articlePresentations: Record<string, ArticlePresentation> = {','export const articlePresentations: Record<string, ArticlePresentation> = {\n'+pLine)
 const aLine=`  '${article.path}': '${item.sketch}',`
 if(!assignments.includes(`'${article.path}'`))assignments=assignments.replace('export const ARTICLE_GENERATIVE_ART_ASSIGNMENTS = {','export const ARTICLE_GENERATIVE_ART_ASSIGNMENTS = {\n'+aLine)
 const figureFiles=new Set(article.sections.flatMap(s=>(s.figures||[]).map(f=>f.src.split('/').at(-1))))
 for(const filename of figureFiles)copyFileSync(`${root}/figures/${filename}`,`public/images/research/${filename}`)
 const prediction=read(`${root}/forecast-registry.json`).predictions.find(p=>p.symbol===item.symbol)
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f2ea"/><text x="72" y="70" font-family="Arial,sans-serif" font-size="17" letter-spacing="2" fill="#625f56">FINANCIAL LONG · ${item.symbol}</text><text x="72" y="164" font-family="Georgia,serif" font-size="55" fill="#24221e">${item.lines[0]}</text><text x="72" y="231" font-family="Georgia,serif" font-size="55" fill="#24221e">${item.lines[1]}</text><line x1="72" y1="284" x2="1128" y2="284" stroke="#d9d4c9"/><text x="72" y="335" font-family="Arial,sans-serif" font-size="19" fill="#625f56">OCTOBER 12, 2026 CLOSE</text><text x="650" y="335" font-family="Arial,sans-serif" font-size="19" fill="#625f56">OCTOBER 12, 2028 FORECAST</text><text x="72" y="409" font-family="Georgia,serif" font-size="54" fill="#24221e">$${prediction.entry_close.toFixed(2)}</text><text x="650" y="409" font-family="Georgia,serif" font-size="54" fill="#24221e">$${prediction.central_price_forecast.toFixed(0)}</text><text x="72" y="456" font-family="Arial,sans-serif" font-size="17" fill="#625f56">Reported entry price · USD</text><text x="650" y="456" font-family="Arial,sans-serif" font-size="17" fill="#625f56">Author price forecast · future result unobserved</text><line x1="72" y1="506" x2="1128" y2="506" stroke="#d9d4c9"/><text x="72" y="558" font-family="Arial,sans-serif" font-size="19" fill="#24221e">Sulayman Bowles</text><text x="1128" y="558" font-family="Arial,sans-serif" font-size="17" fill="#625f56" text-anchor="end">sulayman-bowles.dev</text></svg>`
 writeFileSync(`${root}/figures/${item.figure_name}-share-card.svg`,svg)
 await sharp(Buffer.from(svg)).png().toFile(`public/images/social/${article.slug}.png`)
 console.log({symbol:item.symbol,slug:article.slug,words:record.proseWords,readTime:article.readTime,figures:figureFiles.size,tables:article.sections.filter(s=>s.table).length})
}
write('src/personal/editorial/data/catalog.json',catalog)
write('src/personal/editorial/data/reader-guides.json',guides)
write('docs/article-publications.json',publications)
write(`${root}/article-manifest.json`,manifest)
writeFileSync('src/personal/editorial/article-presentation.ts',presentations)
writeFileSync('src/personal/editorial/generative/manifest.ts',assignments)
copyFileSync(`${root}/forecast-registry.json`,'public/downloads/research/long-pitches-forecast-registry.json')
