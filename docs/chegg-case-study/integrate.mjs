import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { qualityReadingMinutes, qualityProseWords } from '../../tools/article-quality-integrity.mjs'

const read = p => JSON.parse(readFileSync(p, 'utf8'))
const write = (p, x) => writeFileSync(p, JSON.stringify(x, null, 2) + '\n')
const root = 'docs/chegg-case-study'
const path = 'src/personal/editorial/data/articles/chegg-cash-flow-turnaround.json'
const article = read(path)
article.sources = read(`${root}/source-register.json`).sources
article.readTime = `${qualityReadingMinutes(article)} MIN`
write(path, article)
const summaryKeys = ['slug','path','title','displayTitle','seoTitle','seoDescription','category','subtitle','searchTerms','date','dateModified','readTime','image','kind']
const summary = Object.fromEntries(summaryKeys.map(key => [key, article[key]]))
const catalog = read('src/personal/editorial/data/catalog.json')
const index = catalog.findIndex(x => x.slug === article.slug)
if (index >= 0) catalog[index] = summary
else catalog.unshift(summary)
write('src/personal/editorial/data/catalog.json', catalog)

const guidePath = 'src/personal/editorial/data/reader-guides.json'
const guides = read(guidePath)
guides[article.slug] = {
  question: 'Can Chegg’s cash-flow improvement finance its skilling transition?',
  answer: 'Debt retirement and lower investment buy time, but do not by themselves establish a durable recovery. H1 2026 free cash flow improved because a capex reduction exceeded the decline in operating cash flow. The case measures how much new revenue and contribution would need to replace the contracting academic business, then tests liquidity under declared assumptions. June pro forma cash after debt repayment is kept distinct from actual current cash.',
  paths: [
    {label:'Explain the cash improvement', section:'free-cash-flow-bridge', description:'Reconcile operating cash flow, investment and free cash flow across matching periods.'},
    {label:'Measure the replacement hurdle', section:'replacement-growth', description:'Separate growth in revenue share from the dollars of revenue and contribution required.'},
    {label:'Test the transition reserve', section:'stress-test-results', description:'Inspect hypothetical cash paths and the conditions for staged investment.'}
  ],
  sources: [article.sources[1], article.sources[3]].map(({label,href})=>({label,href}))
}
write(guidePath, guides)

const publicationsPath = 'docs/article-publications.json'
let publications
try { publications = read(publicationsPath) } catch { publications = {version:1,purpose:'Bind newly researched initial editions without inventing historical restoration or revision provenance.',records:[]} }
const record = {slug:article.slug,path,canonicalPath:article.path,datePublished:article.date,dateModified:article.dateModified,
  articleSha256:createHash('sha256').update(readFileSync(path)).digest('hex'),proseWords:qualityProseWords(article),readTime:article.readTime,claimsPath:`${root}/source-register.json`}
publications.records = [...publications.records.filter(x => x.slug !== article.slug),record]
write(publicationsPath, publications)

mkdirSync('public/images/research',{recursive:true})
for (const name of ['chegg-revenue-replacement','chegg-free-cash-flow-bridge','chegg-liquidity-stress-test']) copyFileSync(`${root}/figures/${name}.svg`, `public/images/research/${name}.svg`)
mkdirSync('public/images/social',{recursive:true})
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f2ea"/>
<text x="72" y="71" font-family="Arial,sans-serif" font-size="16" letter-spacing="2" fill="#625f56">FINANCIAL CASE STUDY · CHEGG</text>
<text x="72" y="160" font-family="Georgia,serif" font-size="59" fill="#24221e">Can Chegg finance</text>
<text x="72" y="227" font-family="Georgia,serif" font-size="59" fill="#24221e">its own reinvention?</text>
<line x1="72" y1="276" x2="1128" y2="276" stroke="#d9d4c9"/>
<text x="72" y="326" font-family="Arial,sans-serif" font-size="19" fill="#625f56">H1 2025 → H1 2026 FREE CASH FLOW · USD MILLIONS</text>
<g font-family="Georgia,serif" font-size="48" fill="#24221e">
<text x="72" y="405">3.791</text><text x="330" y="405">5.525</text><text x="590" y="405">11.195</text><text x="925" y="405">9.461</text>
</g><g font-family="Arial,sans-serif" font-size="16" fill="#625f56">
<text x="72" y="447">Starting FCF</text><text x="330" y="447">Lower operating cash</text><text x="590" y="447">Lower capex</text><text x="925" y="447">Ending FCF</text>
<text x="252" y="400">−</text><text x="524" y="400">+</text><text x="843" y="400">=</text>
</g><line x1="72" y1="505" x2="1128" y2="505" stroke="#d9d4c9"/>
<text x="72" y="558" font-family="Arial,sans-serif" font-size="19" fill="#24221e">Sulayman Bowles</text>
<text x="1128" y="558" font-family="Arial,sans-serif" font-size="17" fill="#625f56" text-anchor="end">sulayman-bowles.dev</text>
</svg>`
writeFileSync(`${root}/figures/chegg-share-card.svg`,social)
await sharp(Buffer.from(social)).png().toFile('public/images/social/chegg-cash-flow-turnaround.png')
console.log({slug:article.slug,readTime:article.readTime,proseWords:record.proseWords,sha:record.articleSha256})
