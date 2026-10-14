import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const catalog = JSON.parse(readFileSync('src/personal/editorial/data/catalog.json', 'utf8'))
const cards = [
  ['choosing-a-growth-channel-under-a-capacity-limit', 'yuru-30', ['Sell the review before', 'you scale the app']],
  ['toast-gross-profit-engine', 'yuru-31', ["Toast's gross-profit", 'engine']],
  ['harvey-who-keeps-the-value-of-legal-ai', 'yuru-32', ['Who keeps the value of', 'legal AI?']],
  ['vanta-after-the-audit', 'yuru-33', ['Vanta after the audit']],
  ['ramp-saving-money-and-retaining-contribution', 'yuru-34', ['Ramp and the', 'economics of', 'saving money']],
  ['elevenlabs-cost-of-accepted-work', 'yuru-35', ['ElevenLabs: what a', 'finished minute is', 'worth']],
  ['flock-safety-installed-cohort-cash', 'yuru-36', ['Flock: the renewal has', 'to pay for the camera']],
]
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

for (const [slug, artwork, lines] of cards) {
  const article = catalog.find(article => article.slug === slug)
  assert(article, `${slug}: missing public article`)
  // Explicit reviewed line breaks keep wide words clear of the artwork column.
  assert.equal(lines.join(' '), article.displayTitle || article.title, `${slug}: refresh reviewed title lines`)
  const image = await sharp(`public/images/generative-art/${artwork}.webp`).resize(360).png().toBuffer()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f2ea"/><text x="58" y="60" fill="#68665e" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">BUSINESS / ECONOMICS</text><path d="M58 88H1142" stroke="#b7b1a4"/>${lines.map((line, index) => `<text x="58" y="${190 + index * 78}" fill="#24221e" font-family="Georgia,serif" font-size="66">${escape(line)}</text>`).join('')}<image x="776" y="126" width="360" height="360" href="data:image/png;base64,${image.toString('base64')}"/><text x="1136" y="515" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="13">Original study: @yuruyurau</text><path d="M58 554H1142" stroke="#b7b1a4"/><text x="58" y="594" fill="#24221e" font-family="Arial,sans-serif" font-size="20">Sulayman Bowles</text><text x="1142" y="594" text-anchor="end" fill="#68665e" font-family="Arial,sans-serif" font-size="17">${article.date} / sulayman-bowles.dev</text></svg>`
  await sharp(Buffer.from(svg)).png().toFile(`public/images/social/${slug}.png`)
}

console.log('Built seven reviewed business-model share cards with attributed artwork.')
