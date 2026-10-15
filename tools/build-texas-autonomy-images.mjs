import { readFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const cards = [
  ['texas-robotaxi-business-service-map', 'yuru-24', ['Texas robotaxis.', 'Who can ride?'], 'Usable trips, rider access and the fallback plan'],
  ['texas-waymo-business-travel', 'yuru-02', ['Waymo for', 'the actual trip.'], 'Texas access, airports and employee travel costs'],
  ['texas-zoox-market-entry-business', 'yuru-11', ['Zoox: from arrival', 'to service.'], 'Texas fleet stages and the commercial commitment'],
  ['texas-autonomous-trucking-operators', 'yuru-16', ['Texas freight.', 'What is operating?'], 'Driverless work, supervised service and future launches'],
  ['texas-driverless-freight-route-economics', 'yuru-21', ['Price the whole', 'freight route.'], 'Accepted loads, handoffs, recovery and backup'],
  ['texas-automated-vehicle-authorization', 'yuru-27', ['The permit', 'behind the ride.'], 'Texas authorization and operating responsibilities'],
]
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
await mkdir('public/images/social', { recursive: true })
for (const [slug, sketch, lines, deck] of cards) {
  const article = JSON.parse(await readFile(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))
  const art = await sharp(`public/images/generative-art/${sketch}.webp`).resize(360, 360).png().toBuffer()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f5f2ea"/>
    <text x="58" y="60" fill="#68665e" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">TEXAS / AUTONOMY RESEARCH</text>
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
console.log(`Built ${cards.length} autonomy share images (1200×630); existing studies retain attribution.`)
