import { normalizePrint, printColors, printPoints, projectPrint, type PrintComposition, type PrintPoint } from './print-instrument.ts'

export function drawPrint(ctx: CanvasRenderingContext2D, points: PrintPoint[], composition: PrintComposition, size: number, caption = false) {
  const colors = printColors(composition.tone)
  ctx.fillStyle = colors.paper; ctx.fillRect(0, 0, size, caption ? size * 1.1 : size)
  const groups = Array.from({ length: 8 }, () => new Path2D())
  for (const dot of projectPrint(points, composition, size)) {
    const group = Math.min(7, Math.floor(dot.opacity * 8))
    groups[group].moveTo(dot.x + dot.r, dot.y)
    groups[group].arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
  }
  ctx.fillStyle = colors.ink
  groups.forEach((path, index) => { ctx.globalAlpha = (index + .5) / 8; ctx.fill(path) })
  ctx.globalAlpha = 1
  if (caption) {
    const ratio = size / 640
    ctx.strokeStyle = colors.line; ctx.lineWidth = ratio
    ctx.beginPath(); ctx.moveTo(32 * ratio, 646 * ratio); ctx.lineTo(608 * ratio, 646 * ratio); ctx.stroke()
    ctx.fillStyle = colors.muted; ctx.font = `${9 * ratio}px monospace`
    ctx.fillText('SULAYMAN BOWLES / PRINT ROOM', 32 * ratio, 676 * ratio)
    ctx.textAlign = 'right'; ctx.fillText(`${composition.form.toUpperCase()} / ${String(composition.seed).padStart(6, '0')}`, 608 * ratio, 676 * ratio); ctx.textAlign = 'left'
  }
}

export function mountPrintInstrument(canvas: HTMLCanvasElement, initial: PrintComposition) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  let composition = normalizePrint(initial), points = printPoints(composition)
  let held = false, frame = 0, previous = 0, disposed = false
  let frames = 0, drawTotal = 0, observationStarted = 0, observationFrames = 0
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  const eligible = () => !disposed && !held && !document.hidden && !query.matches
  function draw() {
    const started = performance.now()
    drawPrint(ctx!, points, composition, canvas.width)
    drawTotal += performance.now() - started
    canvas.dataset.frames = String(++frames)
    canvas.dataset.averageMs = (drawTotal / frames).toFixed(2)
    canvas.dataset.phase = String(composition.phase)
  }
  function cancel() { cancelAnimationFrame(frame); frame = 0; previous = 0; observationStarted = 0; observationFrames = 0 }
  function tick(now: number) {
    frame = 0
    if (!eligible()) return
    if (!previous || now - previous >= 1000 / 30 - .5) {
      const delta = previous ? Math.min((now - previous) / 1000, .1) : 0
      composition.phase = (composition.phase + delta * .11) % (Math.PI * 2)
      previous = now; draw()
      if (!observationStarted) observationStarted = now
      else {
        observationFrames++
        if (now - observationStarted >= 2000) {
          canvas.dataset.observedFps = (observationFrames * 1000 / (now - observationStarted)).toFixed(1)
          observationStarted = now; observationFrames = 0
        }
      }
    }
    frame = requestAnimationFrame(tick)
  }
  function sync() {
    cancel()
    canvas.dataset.state = eligible() ? 'running' : 'held'
    draw()
    if (eligible()) frame = requestAnimationFrame(tick)
  }
  function resize() {
    const box = canvas.getBoundingClientRect()
    const size = Math.max(1, Math.round(Math.min(900, box.width * Math.min(2, devicePixelRatio || 1))))
    if (canvas.width !== size || canvas.height !== size) { canvas.width = size; canvas.height = size; draw() }
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  document.addEventListener('visibilitychange', sync)
  query.addEventListener('change', sync)
  resize(); sync()
  return {
    snapshot: () => ({ ...composition }),
    setHeld(value: boolean) { held = value; sync() },
    update(input: PrintComposition) {
      const next = normalizePrint(input)
      if (next.form !== composition.form || next.seed !== composition.seed || next.tension !== composition.tension) points = printPoints(next)
      // Parameter edits retain the live phase; a held composition uses its exact pose.
      next.phase = composition.phase
      composition = next; draw()
    },
    dispose() { disposed = true; cancel(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); query.removeEventListener('change', sync); canvas.dataset.state = 'closed' },
  }
}
