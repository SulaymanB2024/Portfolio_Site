import { textFlowFront } from './flow-timing'

const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const band = 64
const cells: string[] = []
for (let y = 0; y < band; y++) for (let x = 0; x < 4; x++) {
  if (y / band >= (bayer[(y % 4) * 4 + x] + .5) / 16) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="white"/>`)
}
const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="4" height="${band}">${cells.join('')}</svg>`)}")`
const hash = (n: number) => { const value = Math.sin(n * 12.9898) * 43758.5453; return value - Math.floor(value) }

/** The semantic HTML stays in place. Only a cached decorative image falls away. */
export function createTextFlow(copy: HTMLElement) {
  const parts = Array.from(copy.querySelectorAll<HTMLElement>('.hero-intro,h1,.hero-description'))
  const canvas = document.createElement('canvas')
  const snapshot = document.createElement('canvas')
  const context = canvas.getContext('2d', { alpha: true })
  const image = snapshot.getContext('2d', { alpha: true })
  const noop = { setProgress(_progress: number, _drift: number) {}, setEnabled(_enabled: boolean) {}, render(_time: number) {}, refresh() {}, dispose() {} }
  if (!parts.length || !context || !image || !CSS.supports('mask-image', 'linear-gradient(black,transparent)')) return noop
  const ctx = context
  const source = image
  canvas.className = 'text-flow-streams'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.dataset.textFlowCanvas = 'true'
  copy.append(canvas)
  copy.style.setProperty('--text-flow-mask', mask)
  const previousParts = parts.map(part => ({ part, attribute: part.getAttribute('data-text-flow-part') }))
  let disposed = false
  let ready = false
  let enabled = false
  let progress = 0
  let drift = 0
  let width = 0
  let height = 0
  let outputHeight = 0
  let scale = 1
  let offsets: number[] = []
  let lastDraw = -Infinity
  let dirty = true
  let drawn = 0
  let snapshots = 0
  let refreshFrame = 0

  function queueRefresh() {
    if (!disposed && !refreshFrame) refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; refresh() })
  }
  function refresh() {
    if (disposed) return
    const started = performance.now()
    const box = copy.getBoundingClientRect()
    const boxes = parts.map(part => part.getBoundingClientRect())
    width = Math.ceil(box.width)
    height = Math.ceil(Math.max(...boxes.map(rect => rect.bottom - box.top)))
    if (!width || !height || !Number.isFinite(height)) return
    scale = Math.min(devicePixelRatio || 1, 1.5)
    outputHeight = Math.ceil(height * 1.65 + band)
    snapshot.width = Math.ceil(width * scale)
    snapshot.height = Math.ceil(height * scale)
    canvas.width = Math.ceil(width * scale)
    canvas.height = Math.ceil(outputHeight * scale)
    canvas.style.width = `${width}px`
    canvas.style.height = `${outputHeight}px`
    source.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    offsets = boxes.map(rect => rect.top - box.top)
    // Read layout only on resize/font/theme changes, never on animation frames.
    for (const part of parts) {
      const walker = document.createTreeWalker(part, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        const text = node.textContent || ''
        if (!text.trim() || !node.parentElement) continue
        const style = getComputedStyle(node.parentElement)
        source.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        source.fillStyle = style.color
        source.textBaseline = 'alphabetic'
        source.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
        const metrics = source.measureText('Hg')
        const ascent = metrics.fontBoundingBoxAscent || Number.parseFloat(style.fontSize) * .8
        const descent = metrics.fontBoundingBoxDescent || Number.parseFloat(style.fontSize) * .2
        const range = document.createRange()
        let run = ''
        let line: DOMRect | null = null
        function flush() {
          if (!line || !run) return
          const baseline = line.top - box.top + (line.height - ascent - descent) / 2 + ascent
          source.fillText(run, line.left - box.left, baseline)
          run = ''
        }
        for (let i = 0; i < text.length; i++) {
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          const rect = range.getBoundingClientRect()
          if (!rect.width && !rect.height) continue
          if (line && Math.abs(rect.top - line.top) > 1) { flush(); line = null }
          line ||= rect
          run += text[i]
        }
        flush()
      }
    }
    ready = true
    canvas.dataset.snapshots = String(++snapshots)
    canvas.dataset.snapshotCpuMs = (performance.now() - started).toFixed(3)
    for (const part of parts) part.dataset.textFlowPart = 'true'
    setProgress(progress, drift)
    dirty = true
  }
  function setProgress(value: number, nextDrift: number) {
    progress = Math.max(0, Math.min(1, value))
    drift = Math.max(0, Math.min(1, nextDrift))
    if (!ready || disposed) return
    const front = progress >= .9999 ? height + band * 2 : textFlowFront(progress, height)
    for (let i = 0; i < parts.length; i++) {
      parts[i].style.setProperty('--text-flow-cutoff', `${(front - offsets[i] - band / 2).toFixed(2)}px`)
      parts[i].dataset.textFlowActive = String(enabled && progress > .0001)
    }
    canvas.dataset.progress = progress.toFixed(4)
    dirty = true
  }
  function render(time: number) {
    if (!ready || disposed || document.hidden) return
    const falling = enabled && progress > .0001 && progress < .9999 && !copy.matches(':focus-within')
    if (!falling && !dirty) return
    // Share the helmet's cadence; no second RAF loop or idle text capture.
    if (!dirty && time - lastDraw < 1000 / 24 - 1) return
    lastDraw = time
    dirty = false
    ctx.clearRect(0, 0, width, outputHeight)
    if (!falling) return
    const started = performance.now()
    const front = Math.max(0, Math.min(height, textFlowFront(progress, height) + band / 2))
    if (!front) return
    const fade = Math.min(1, progress / .10) * Math.max(0, Math.min(1, (1 - progress) / .20))
    const columns = Math.min(112, Math.ceil(width / 3))
    const lane = width / columns
    for (let i = 0; i < columns; i++) {
      const seed = hash(i + 4.9)
      const fall = progress * progress * height * (.40 + seed * .48) + drift * height * (.025 + seed * .045)
      const sway = Math.sin(time * .0002 + i * .87) * 1.2 * progress
      const drop = .38 + .62 * hash(i * 3.1 + Math.floor(time / 140))
      ctx.globalAlpha = fade * drop * (.34 + seed * .24)
      const slice = Math.max(1, lane * .57)
      ctx.drawImage(snapshot, i * lane * scale, 0, slice * scale, front * scale,
        i * lane + sway, fall, slice * .82, front * (1 + seed * .20))
    }
    ctx.globalAlpha = 1
    canvas.dataset.frames = String(++drawn)
    canvas.dataset.drawCpuMs = (performance.now() - started).toFixed(3)
  }
  const observer = new ResizeObserver(queueRefresh)
  observer.observe(copy)
  document.fonts.addEventListener('loadingdone', queueRefresh)
  void document.fonts.ready.then(queueRefresh)
  refresh()
  return {
    setProgress,
    setEnabled(value: boolean) { enabled = value; setProgress(progress, drift); if (!value) ctx.clearRect(0, 0, width, outputHeight) },
    render,
    refresh: queueRefresh,
    dispose() {
      disposed = true
      cancelAnimationFrame(refreshFrame)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', queueRefresh)
      for (const { part, attribute } of previousParts) {
        if (attribute === null) part.removeAttribute('data-text-flow-part')
        else part.setAttribute('data-text-flow-part', attribute)
        part.removeAttribute('data-text-flow-active')
        part.style.removeProperty('--text-flow-cutoff')
      }
      copy.style.removeProperty('--text-flow-mask')
      canvas.remove()
      snapshot.width = snapshot.height = canvas.width = canvas.height = 0
    },
  }
}
