import { readFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const cards = [
  ['texas-power-large-load-business-diligence', 'yuru-23', ['Power before', 'property.'], 'ERCOT, SB6 & the evidence behind a site decision'],
  ['texas-ai-law-business-compliance', 'yuru-25', ['Texas AI law:', 'before deployment.'], 'The duties that change an AI procurement decision'],
  ['texas-business-court-contract-decisions', 'yuru-27', ['The bargain.', 'The claim.', 'The forum.'], 'Texas Business Court & the commercial downside'],
]
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
await mkdir('public/images/social', { recursive: true })
for (const [slug, sketch, lines, deck] of cards) {
  const article = JSON.parse(await readFile(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))
  const art = await sharp(`public/images/generative-art/${sketch}.webp`).resize(360, 360).png().toBuffer()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f5f2ea"/>
    <text x="58" y="60" fill="#68665e" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">TEXAS / BUSINESS RESEARCH</text>
    <path d="M58 88H1142" stroke="#b7b1a4"/>
    ${lines.map((line, index) => `<text x="58" y="${198 + index * 87}" fill="#24221e" font-family="Georgia,serif" font-size="73">${escape(line)}</text>`).join('')}
    <text x="58" y="${lines.length === 3 ? 468 : 397}" fill="#68665e" font-family="Arial,sans-serif" font-size="20">${escape(deck)}</text>
    <image x="776" y="126" width="360" height="360" href="data:image/png;base64,${art.toString('base64')}"/>
    <text x="1136" y="515" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="13">Original study: @yuruyurau</text>
    <path d="M58 554H1142" stroke="#b7b1a4"/>
    <text x="58" y="594" fill="#24221e" font-family="Arial,sans-serif" font-size="20">Sulayman Bowles</text>
    <text x="1142" y="594" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="17">${escape(article.date)} / sulayman-bowles.dev</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(`public/images/social/${slug}.png`)
}
console.log(`Built ${cards.length} Texas research share images (1200×630).`)
