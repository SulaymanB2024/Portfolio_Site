import { readFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const cards = [
  ['texas-water-facility-site-diligence', 'yuru-22', ['Water at the', 'point of use.'], 'The supply, delivery and drought case behind a site'],
  ['texas-property-tax-business-underwriting', 'yuru-26', ['Price the tax', 'after the deal.'], 'Texas values, exemptions and the expense after closing'],
  ['texas-data-center-sales-tax-project-economics', 'yuru-28', ['The tax break', 'is conditional.'], 'Certification, eligible purchases and repayment exposure'],
  ['texas-jeti-incentives-project-underwriting', 'yuru-29', ['The incentive.', 'The obligations.'], 'Price the school-tax benefit with the operating commitment'],
  ['texas-franchise-tax-reporting-business-decisions', 'yuru-30', ['No tax due.', 'Still an owner.'], 'Texas filing, method choice and the supporting record'],
  ['texas-hiring-labor-cost-planning', 'yuru-31', ['Price the role.', 'Fund the ramp.'], 'Texas labor evidence, recruiting and the cost of waiting'],
  ['texas-cross-border-logistics-business-planning', 'yuru-18', ['Beyond the', 'freight quote.'], 'Customs, inventory and usable receipt from Mexico'],
  ['texas-manufacturing-capacity-procurement', 'yuru-09', ['From opening', 'to usable output.'], 'Texas factory evidence and the buyer’s actual allocation'],
  ['texas-commercial-property-insurance-diligence', 'yuru-19', ['What will the', 'policy pay?'], 'The commercial loss, retained cash and recovery plan'],
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
    <text x="58" y="397" fill="#68665e" font-family="Arial,sans-serif" font-size="20">${escape(deck)}</text>
    <image x="776" y="126" width="360" height="360" href="data:image/png;base64,${art.toString('base64')}"/>
    <text x="1136" y="515" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="13">Original study: @yuruyurau</text>
    <path d="M58 554H1142" stroke="#b7b1a4"/>
    <text x="58" y="594" fill="#24221e" font-family="Arial,sans-serif" font-size="20">Sulayman Bowles</text>
    <text x="1142" y="594" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="17">${escape(article.date)} / sulayman-bowles.dev</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(`public/images/social/${slug}.png`)
}
console.log(`Built ${cards.length} Texas library share images (1200×630); original studies retain attribution.`)
