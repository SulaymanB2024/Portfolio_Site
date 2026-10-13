import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { tsImport } from 'tsx/esm/api'
import { ARTWORK_INK_POSTERS, ARTWORK_POSTER_INK } from '../src/personal/editorial/artwork-ink-posters.generated.ts'
import { inkArtworkPixels } from '../src/personal/editorial/artwork-ink-pixels.ts'
import type { GenerativeArtwork } from '../src/personal/editorial/generative/types.ts'

test('all native poster assets preserve original coverage, palette, geometry, and content versions', async () => {
  const directory = new URL('../public/images/generative-art/', import.meta.url)
  const originals = (await readdir(directory)).filter(name => /^yuru-\d+\.webp$/.test(name)).sort()
  assert.deepEqual(Object.keys(ARTWORK_INK_POSTERS).sort(), originals.map(name => name.slice(0, -5)))
  const css = await readFile(new URL('../src/personal/personal.css', import.meta.url), 'utf8')
  const token = css.match(/--ink:\s*#([\da-f]{6})/i)?.[1]
  assert(token)
  assert.deepEqual(ARTWORK_POSTER_INK, [0, 2, 4].map(at => parseInt(token.slice(at, at + 2), 16)))
  for (const filename of originals) {
    const id = filename.slice(0, -5)
    const url = ARTWORK_INK_POSTERS[id]
    const encoded = await readFile(new URL('../public' + url, import.meta.url))
    const version = createHash('sha256').update(encoded).digest('hex').slice(0, 12)
    assert(url.endsWith(`${id}-${version}.webp`), `${id}: asset URLs must change with their bytes`)
    const expected = await sharp(new URL(filename, directory).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const pixels = new Uint8ClampedArray(expected.data.buffer, expected.data.byteOffset, expected.data.byteLength)
    inkArtworkPixels(pixels, ARTWORK_POSTER_INK)
    const actual = await sharp(encoded).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    assert.deepEqual([actual.info.width, actual.info.height, actual.info.channels], [400, 400, 4], id)
    let mismatch = -1, empty = 0, marks = 0
    for (let at = 0; at < pixels.length; at += 4) {
      const alpha = pixels[at + 3]
      if (alpha === 0) empty++; else marks++
      if (actual.data[at + 3] !== alpha || alpha !== 0 && (actual.data[at] !== pixels[at] || actual.data[at + 1] !== pixels[at + 1] || actual.data[at + 2] !== pixels[at + 2])) { mismatch = at; break }
    }
    assert.equal(mismatch, -1, `${id}: native poster must retain every visible source pixel and its alpha`)
    assert(empty > 0 && marks > 0, `${id}: artwork must retain both transparent paper and visible marks`)
    assert.equal((await sharp(encoded).metadata()).hasAlpha, true, id)
  }
})

test('public covers render native alpha with preserved source identity, accessibility, and loading priority', async () => {
  const { ArtPoster } = await tsImport('../src/personal/editorial/ArtPoster.tsx', import.meta.url)
  const artwork = { sketchId: 'yuru-08', posterSrc: '/images/generative-art/yuru-08.webp', alt: 'Original Pulsing Medusa point study' } as GenerativeArtwork
  const featured = renderToStaticMarkup(createElement(ArtPoster, { artwork, baseURL: '/portfolio/', eager: true }))
  assert(featured.includes(`src="/portfolio/${ARTWORK_INK_POSTERS['yuru-08'].slice(1)}"`))
  assert(featured.includes('data-source-poster="/portfolio/images/generative-art/yuru-08.webp"'))
  assert(featured.includes('alt="Original Pulsing Medusa point study"'))
  assert(featured.includes('width="400" height="400" loading="eager"'))
  const decorative = renderToStaticMarkup(createElement(ArtPoster, { artwork, baseURL: '/', decorative: true }))
  assert(decorative.includes('alt=""'))
  assert(decorative.includes('loading="lazy"'))
})
