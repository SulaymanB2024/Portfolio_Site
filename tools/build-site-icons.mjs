import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

// Raster fallbacks share the authored lettermark, with opaque corners for iOS.
const directory = resolve(import.meta.dirname, '../public')
const source = (await readFile(resolve(directory, 'favicon.svg'), 'utf8')).replace(/<style>[\s\S]*?<\/style>/, '')
const render = (size, alpha = false) => {
  const image = sharp(Buffer.from(source)).resize(size, size).flatten({ background: '#eeeadd' })
  return (alpha ? image.ensureAlpha() : image).png().toBuffer()
}
const sizes = [16, 32, 48]
const images = []
for (const size of sizes) images.push(await render(size, true))
const header = Buffer.alloc(6 + sizes.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
for (let index = 0; index < sizes.length; index++) {
  const entry = 6 + index * 16
  header[entry] = header[entry + 1] = sizes[index]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(images[index].length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += images[index].length
}
await writeFile(resolve(directory, 'favicon.ico'), Buffer.concat([header, ...images]))
await writeFile(resolve(directory, 'favicon-32x32.png'), await render(32))
await writeFile(resolve(directory, 'apple-touch-icon.png'), await render(180))
console.log('Built SB icons: SVG, 16/32/48 px ICO, 32 px PNG, 180 px Apple touch icon.')
