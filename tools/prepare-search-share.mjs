import sharp from 'sharp'

await sharp('public/og-personal.svg').png({ compressionLevel: 9 }).toFile('public/og-personal.png')
console.log('Prepared the 1200 × 630 personal-site share card.')
