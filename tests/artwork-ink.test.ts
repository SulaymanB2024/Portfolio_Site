import test from 'node:test'
import assert from 'node:assert/strict'
import { inkArtworkPixels, paintArtworkInk, paintArtworkPoster, inkOffscreenSketch } from '../src/personal/editorial/artwork-ink-pixels.ts'
import { copyArtworkPoster } from '../src/personal/editorial/artwork-continuity.ts'
import type { OffscreenSketchController } from '../src/personal/editorial/generative/canvas-runtime.ts'

test('a poster-only article flight retains native pixels when the DOM clone starts empty', () => {
  const original = { pixels: [36, 34, 30, 255, 0, 0, 0, 0] }
  let copied: unknown
  const canvas = { getContext: () => ({ drawImage(source: unknown) { copied = source } }) }
  const source = { querySelector: () => original } as unknown as HTMLElement
  const clone = { querySelector: (selector: string) => selector.startsWith('canvas.') ? canvas : null } as unknown as HTMLElement
  copyArtworkPoster(source, clone)
  assert.equal(copied, original, 'cloning must retain the visible poster, even without a painted player')
})

test('black buffers become transparent while light, dark, and translucent marks retain palette ink', () => {
  for (const ink of [[36, 34, 30], [239, 239, 232]] as const) {
    const pixels = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255, 128, 128, 128, 255, 255, 255, 255, 128, 255, 255, 255, 0])
    inkArtworkPixels(pixels, ink)
    assert.deepEqual([pixels[3], pixels[7], pixels[11], pixels[15], pixels[19]], [0, 255, 218, 128, 0])
    for (let at = 0; at < pixels.length; at += 4) assert.deepEqual(Array.from(pixels.slice(at, at + 3)), [...ink])
  }
})

test('ink coverage is monotonic and removes the same black threshold as the accepted filter', () => {
  const values = new Uint8ClampedArray(256 * 4)
  for (let gray = 0; gray < 256; gray++) values.set([gray, gray, gray, 255], gray * 4)
  inkArtworkPixels(values, [36, 34, 30])
  for (let gray = 0; gray <= 33; gray++) assert.equal(values[gray * 4 + 3], 0)
  for (let gray = 1; gray < 256; gray++) assert(values[gray * 4 + 3] >= values[(gray - 1) * 4 + 3])
  assert.equal(values[255 * 4 + 3], 255)
})

test('display conversion replaces a previous frame and never recolors the source/trail buffer', () => {
  const source = { pixels: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]) }
  let output = new Uint8ClampedArray(8)
  let scratch = new Uint8ClampedArray(8)
  const context = {
    globalCompositeOperation: 'source-over',
    drawImage(image: typeof source) { assert.equal(this.globalCompositeOperation, 'copy'); scratch = image.pixels.slice() },
    getImageData() { return { data: scratch } },
  }
  const display = {
    drawImage() { assert.fail('opaque source pixels must never enter the visible canvas') },
    putImageData(frame: { data: Uint8ClampedArray }) { output = frame.data },
  }
  const buffer = { width: 2, height: 1, getContext: () => context }
  const canvas = { width: 2, height: 1, getContext: () => display, ownerDocument: { createElement: () => buffer } } as unknown as HTMLCanvasElement
  paintArtworkInk(source as unknown as CanvasImageSource, canvas, [36, 34, 30])
  assert.equal(output[3], 255); assert.equal(output[7], 0)
  source.pixels.set([0, 0, 0, 255, 255, 255, 255, 255])
  paintArtworkInk(source as unknown as CanvasImageSource, canvas, [239, 239, 232])
  assert.equal(output[3], 0, 'old marks must not accumulate ghost trails in the display canvas')
  assert.deepEqual(Array.from(output.slice(4)), [239, 239, 232, 255])
  assert.deepEqual(Array.from(source.pixels), [0, 0, 0, 255, 255, 255, 255, 255])
})

function rasterFixture() {
  const source = { width: 400, height: 400, pixels: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]) }
  const buffers: { width: number; height: number }[] = []
  const ownerDocument = {
    createElement() {
      let pixels = source.pixels.slice()
      const buffer = { width: 0, height: 0, getContext: () => ({
        drawImage(image: typeof source) { pixels = image.pixels.slice() },
        getImageData() { return { data: pixels } },
      }) }
      buffers.push(buffer)
      return buffer
    },
  }
  const canvas = () => {
    let pixels = new Uint8ClampedArray(8)
    const display = { drawImage() { assert.fail('the display must never receive raw black pixels') }, putImageData(frame: { data: Uint8ClampedArray }) { pixels = frame.data.slice() } }
    return { width: 400, height: 400, ownerDocument, getContext: () => display, get pixels() { return pixels } }
  }
  return { source, buffers, canvas }
}

test('a complete 29-cover poster gallery releases temporary rasters without clearing visible ink', () => {
  const f = rasterFixture(), canvases = Array.from({ length: 29 }, f.canvas)
  for (const canvas of canvases) paintArtworkPoster(f.source as unknown as CanvasImageSource, canvas as unknown as HTMLCanvasElement, [36, 34, 30])
  assert.equal(f.buffers.length, 29)
  assert(f.buffers.every(buffer => buffer.width === 0 && buffer.height === 0), 'poster scratch rasters must be released immediately')
  for (const canvas of canvases) {
    assert.deepEqual([canvas.width, canvas.height], [400, 400], 'visible resolution must remain intact')
    assert.deepEqual(Array.from(canvas.pixels), [36, 34, 30, 255, 36, 34, 30, 0])
  }
  paintArtworkPoster(f.source as unknown as CanvasImageSource, canvases[0] as unknown as HTMLCanvasElement, [239, 239, 232])
  assert.deepEqual(Array.from(canvases[0].pixels), [239, 239, 232, 255, 239, 239, 232, 0], 'theme changes still repaint the retained display')
  assert(f.buffers.every(buffer => buffer.width === 0 && buffer.height === 0))
})

test('live fallback reuses its conversion raster across frames and releases it on disposal', () => {
  const f = rasterFixture(), display = f.canvas()
  let phase = 0, removed = 0
  const source = { canvas: f.source, width: 400, height: 400, engine: 'canvas', draw() { phase++; return true }, remove() { removed++ } } as unknown as OffscreenSketchController
  const sketch = inkOffscreenSketch(source, display as unknown as OffscreenCanvas, [36, 34, 30])
  sketch.draw(); sketch.draw()
  assert.equal(f.buffers.length, 1, 'live frames must not allocate a scratch canvas each tick')
  assert.deepEqual([f.buffers[0].width, f.buffers[0].height], [400, 400])
  sketch.setInkColor?.([239, 239, 232])
  assert.equal(phase, 2, 'recoloring must preserve source phase')
  assert.deepEqual(Array.from(display.pixels), [239, 239, 232, 255, 239, 239, 232, 0])
  sketch.remove()
  assert.equal(removed, 1)
  assert.deepEqual([f.buffers[0].width, f.buffers[0].height, display.width, display.height], [0, 0, 0, 0])
})
