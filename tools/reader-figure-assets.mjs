import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export const readerFigureNames = ['the-ai-megawatt-power-ladder', 'the-ai-megawatt-utilization', 'the-ai-megawatt-sensitivity']
const series = new Map([
  ['#1f77b4', ''], ['#ff7f0e', '6 3'], ['#2ca02c', '2 3'],
  ['#d62728', '7 3 2 3'], ['#9467bd', '1 2'],
])
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

/** Presentation derivatives only: retain every coordinate, data label and reference. */
export function readerFigureSvg(source, name) {
  if (!readerFigureNames.includes(name)) throw new Error(`Unregistered reader figure: ${name}`)
  let spine = 0
  return source.replace(/<(path|g|use|text)\b[^>]*>/g, tag => {
    if (tag.startsWith('<path') && /stroke="#000"[^>]*stroke-linecap="square"[^>]*stroke-width="\.8"/.test(tag)) {
      // Keep the bottom/left scale, without the plotting software's full box.
      if ([1, 3].includes(spine++)) tag = tag.replace(/\/?>(?=$)/, ' opacity="0"$&')
    }
    const color = tag.match(/stroke="(#[a-f\d]+)"/i)?.[1]?.toLowerCase()
    if (name.endsWith('sensitivity') && tag.startsWith('<path') && color && series.has(color) && tag.includes('stroke-width="1.5"')) {
      // Apply identical dash sequences to each curve and its legend sample.
      const dash = series.get(color)
      if (dash) tag = tag.replace(/\/?>(?=$)/, ` stroke-dasharray="${dash}"$&`)
    }
    tag = tag.replace(/(fill|stroke)="(#[a-f\d]+)"/gi, (_, attribute, value) => {
      const original = value.toLowerCase()
      const ink = series.has(original) ? '#55594e' : ['#000', '#000000'].includes(original) ? '#24221e' : original
      return `${attribute}="${ink}"`
    })
    if (tag.startsWith('<text')) {
      tag = tag.replace(/font-family="[^"]*"/, 'font-family="Arial, Helvetica, sans-serif"')
      tag = tag.replace(/\/?>(?=$)/, ' fill="#24221e"$&')
    }
    return tag
  })
}

/** --verify-only compares in memory; it never creates directories or writes files. */
export async function prepareReaderFigures(root, verifyOnly = false) {
  const records = []
  for (const name of readerFigureNames) {
    const sourcePath = `public/images/research/${name}.svg`
    const outputPath = `public/images/research/reader/${name}.svg`
    const source = await readFile(resolve(root, sourcePath))
    const output = readerFigureSvg(source.toString(), name)
    if (verifyOnly) {
      if (await readFile(resolve(root, outputPath), 'utf8') !== output) throw new Error(`Reader figure differs: ${outputPath}`)
    } else {
      await mkdir(resolve(root, 'public/images/research/reader'), { recursive: true })
      await writeFile(resolve(root, outputPath), output)
    }
    records.push({ sourcePath, outputPath, sourceSha256: hash(source), outputSha256: hash(output) })
  }
  const manifestPath = resolve(root, 'docs/reader-figure-assets.json')
  const manifest = `${JSON.stringify({ version: 1, records }, null, 2)}\n`
  if (verifyOnly) {
    if (await readFile(manifestPath, 'utf8') !== manifest) throw new Error('Reader figure provenance differs')
  } else await writeFile(manifestPath, manifest)
  return records
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const records = await prepareReaderFigures(root, process.argv.includes('--verify-only'))
  console.log(`${process.argv.includes('--verify-only') ? 'Verified' : 'Generated'} ${records.length} ink chart derivatives; originals preserved.`)
}
