import { createCanvasSketch, type CanvasSketchController, type CanvasSketchOptions, type OffscreenSketchController } from './generative/canvas-runtime.ts'
import type { P5SketchFactory } from './generative/types'

export type ArtworkInkColor = readonly [number, number, number]
const inkBuffers = new WeakMap<HTMLCanvasElement | OffscreenCanvas, HTMLCanvasElement | OffscreenCanvas>()

function releaseInkBuffer(target: HTMLCanvasElement | OffscreenCanvas) {
  const buffer = inkBuffers.get(target)
  if (buffer) { buffer.width = buffer.height = 0; inkBuffers.delete(target) }
}

/** The existing contrast(1.35), luminance-to-alpha, and 1.7 ink density. */
export function inkArtworkPixels(data: Uint8ClampedArray, ink: ArtworkInkColor) {
  for (let at = 0; at < data.length; at += 4) {
    const luminance = (data[at] * .2125 + data[at + 1] * .7154 + data[at + 2] * .0721) / 255
    const coverage = Math.max(0, Math.min(1, (1.35 * luminance - .175) * 1.7))
    data[at + 3] *= coverage
    data[at] = ink[0]; data[at + 1] = ink[1]; data[at + 2] = ink[2]
  }
}

export function readArtworkInkColor(element: Element): ArtworkInkColor {
  const value = getComputedStyle(element).getPropertyValue('--ink').trim()
  if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    const hex = value.length === 4 ? value.slice(1).split('').map(channel => channel + channel).join('') : value.slice(1)
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  }
  if (value === 'black') return [0, 0, 0]
  if (value === 'white') return [255, 255, 255]
  throw new Error('Artwork ink must use the site palette.')
}

/** Paint into real alpha: no CSS/SVG reference filter or opaque black display. */
export function paintArtworkInk(source: CanvasImageSource, target: HTMLCanvasElement | OffscreenCanvas, ink: ArtworkInkColor) {
  let buffer = inkBuffers.get(target)
  if (!buffer) {
    buffer = 'ownerDocument' in target ? target.ownerDocument.createElement('canvas') : new OffscreenCanvas(target.width, target.height)
    inkBuffers.set(target, buffer)
  }
  if (buffer.width !== target.width) buffer.width = target.width
  if (buffer.height !== target.height) buffer.height = target.height
  const context = buffer.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  const display = target.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  if (!context || !display) throw new Error('Artwork ink canvas is unavailable.')
  context.globalCompositeOperation = 'copy'
  context.drawImage(source, 0, 0, buffer.width, buffer.height)
  const frame = context.getImageData(0, 0, buffer.width, buffer.height)
  inkArtworkPixels(frame.data, ink)
  // A compositor must never see the opaque raw frame during a readback.
  display.putImageData(frame, 0, 0)
}

/** Static posters retain only their visible pixels, not a second raster. */
export function paintArtworkPoster(source: CanvasImageSource, target: HTMLCanvasElement, ink: ArtworkInkColor) {
  try { paintArtworkInk(source, target, ink) }
  finally { releaseInkBuffer(target) }
}

// Source canvases stay untouched, including their accumulated trails/snapshots.
export function createInkCanvasSketch(factory: P5SketchFactory, host: HTMLElement, options: CanvasSketchOptions, initialInk: ArtworkInkColor): CanvasSketchController {
  const sourceHost = host.ownerDocument.createElement('div')
  const source = createCanvasSketch(factory, sourceHost, options)
  const canvas = host.ownerDocument.createElement('canvas')
  canvas.width = source.canvas.width; canvas.height = source.canvas.height
  canvas.style.width = canvas.style.height = '100%'
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  let ink = initialInk, painted = false
  return {
    canvas,
    get width() { return source.width }, get height() { return source.height },
    draw() { if (!source.draw()) return false; paintArtworkInk(source.canvas, canvas, ink); painted = true; return true },
    setInkColor(next) { if (next) { ink = next; if (painted) paintArtworkInk(source.canvas, canvas, ink) } },
    remove() { source.remove(); releaseInkBuffer(canvas); canvas.remove(); canvas.width = canvas.height = 0 },
  }
}

export function inkOffscreenSketch(source: OffscreenSketchController, canvas: OffscreenCanvas, initialInk: ArtworkInkColor): OffscreenSketchController {
  canvas.width = source.canvas.width; canvas.height = source.canvas.height
  let ink = initialInk, painted = false
  return {
    canvas, engine: source.engine,
    get width() { return source.width }, get height() { return source.height },
    draw() { if (!source.draw()) return false; paintArtworkInk(source.canvas, canvas, ink); painted = true; return true },
    setInkColor(next) { if (next) { ink = next; if (painted) paintArtworkInk(source.canvas, canvas, ink) } },
    remove() { source.remove(); releaseInkBuffer(canvas); canvas.width = canvas.height = 0 },
    getRenderStats: source.getRenderStats?.bind(source),
  }
}
