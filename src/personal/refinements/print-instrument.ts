export const printForms = ['ribbon', 'orbit', 'bloom'] as const
export type PrintForm = typeof printForms[number]
export type PrintComposition = {
  form: PrintForm; seed: number; tension: number; grain: number
  turn: number; tilt: number; phase: number; tone: 'paper' | 'ink'
}
export type PrintPoint = { x: number; y: number; z: number; weight: number }
export type ProjectedDot = { x: number; y: number; r: number; opacity: number }
const tau = Math.PI * 2
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const finite = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback
export const defaultPrint: PrintComposition = { form: 'ribbon', seed: 173, tension: 55, grain: 38, turn: .45, tilt: -.4, phase: 0, tone: 'paper' }

/** Shared input stays within the same finite domain as the physical controls. */
export function normalizePrint(input: Partial<PrintComposition>): PrintComposition {
  return {
    form: printForms.includes(input.form!) ? input.form! : defaultPrint.form,
    seed: Math.round(clamp(finite(input.seed, defaultPrint.seed), 1, 999999)),
    tension: Math.round(clamp(finite(input.tension, defaultPrint.tension), 0, 100)),
    grain: Math.round(clamp(finite(input.grain, defaultPrint.grain), 0, 100)),
    turn: ((finite(input.turn, defaultPrint.turn) % tau) + tau) % tau,
    tilt: clamp(finite(input.tilt, defaultPrint.tilt), -1.3, 1.3),
    phase: ((finite(input.phase, 0) % tau) + tau) % tau,
    tone: input.tone === 'ink' ? 'ink' : 'paper',
  }
}

export function printPoints(input: PrintComposition): PrintPoint[] {
  const c = normalizePrint(input), tension = c.tension / 100
  let state = c.seed >>> 0
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296 }
  const offset = random() * tau
  const lobes = 4 + Math.floor(random() * 4)
  const points: PrintPoint[] = []
  for (let row = 0; row < 100; row++) for (let column = 0; column < 120; column++) {
    const u = (column + random() * .8) / 120 * tau
    const v = (row + random() * .8) / 100
    let x: number, y: number, z: number
    if (c.form === 'ribbon') {
      const edge = (v - .5) * 1.1
      const fold = u * (1 + tension * 3) + offset
      const radius = .92 + edge * Math.cos(fold)
      x = radius * Math.cos(u); z = radius * Math.sin(u)
      y = edge * Math.sin(fold) + .12 * Math.sin(u * 2 + offset)
    } else if (c.form === 'orbit') {
      const tube = .18 + tension * .25
      const radius = .83 + tube * Math.cos(v * tau)
      x = radius * Math.cos(u); z = radius * Math.sin(u)
      y = tube * Math.sin(v * tau) + tension * .2 * Math.sin(u * 3 + offset)
    } else {
      const latitude = v * Math.PI
      const envelope = Math.sin(latitude)
      const radius = envelope * (.78 + (.14 + tension * .24) * Math.cos(lobes * u + offset) * envelope ** 2)
      x = radius * Math.cos(u); z = radius * Math.sin(u)
      y = Math.cos(latitude) * 1.13 + .14 * tension * Math.sin(u * 3 + offset) * envelope ** 3
    }
    points.push({ x, y, z, weight: .65 + random() * .35 })
  }
  return points
}

/** One projection feeds the moving canvas, vector print, and raster print. */
export function projectPrint(points: PrintPoint[], input: PrintComposition, size = 640): ProjectedDot[] {
  const c = normalizePrint(input)
  const turn = c.turn + c.phase
  const ct = Math.cos(turn), st = Math.sin(turn), cp = Math.cos(c.tilt), sp = Math.sin(c.tilt)
  const scale = size * .265 * (1 + .018 * Math.sin(c.phase * 2))
  return points.map(point => {
    const x = point.x * ct + point.z * st
    const depth = point.z * ct - point.x * st
    const y = point.y * cp - depth * sp
    const z = point.y * sp + depth * cp
    const perspective = 3.8 / (3.8 - z * .32)
    const light = clamp((z + 1.5) / 3, 0, 1)
    return {
      x: size / 2 + x * scale * perspective,
      y: size / 2 - y * scale * perspective,
      r: size / 640 * (.38 + c.grain / 100 * .95) * point.weight,
      opacity: (Math.min(7, Math.floor((.16 + light * .72) * 8)) + .5) / 8,
    }
  })
}

export function printColors(tone: PrintComposition['tone']) {
  return tone === 'ink' ? { paper: '#111210', ink: '#efefe8', muted: '#a5a89c', line: '#373a32' }
    : { paper: '#f3f3f0', ink: '#191a17', muted: '#696c64', line: '#d8d9d1' }
}

export function instrumentSvg(input: PrintComposition) {
  const c = normalizePrint(input), colors = printColors(c.tone)
  const dots = projectPrint(printPoints(c), c)
  // Group opacity applies after the dots overlap, matching each canvas path fill.
  const groups: string[][] = Array.from({ length: 8 }, () => [])
  for (const dot of dots) groups[Math.min(7, Math.floor(dot.opacity * 8))].push(`<circle cx="${dot.x.toFixed(4)}" cy="${dot.y.toFixed(4)}" r="${dot.r.toFixed(4)}"/>`)
  const circles = groups.map((group, index) => `<g opacity="${((index + .5) / 8).toFixed(4)}">${group.join('')}</g>`).join('')
  const edition = String(c.seed).padStart(6, '0')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1980" viewBox="0 0 640 704"><title>Print room — ${c.form}, variation ${edition}</title><rect width="640" height="704" fill="${colors.paper}"/><g fill="${colors.ink}">${circles}</g><path d="M32 646h576" stroke="${colors.line}"/><g fill="${colors.muted}" font-family="monospace" font-size="9" letter-spacing=".6"><text x="32" y="676">SULAYMAN BOWLES / PRINT ROOM</text><text x="608" y="676" text-anchor="end">${c.form.toUpperCase()} / ${edition}</text></g></svg>`
}

const compositionKeys = ['form', 'seed', 'tension', 'grain', 'turn', 'tilt', 'phase', 'tone'] as const
/** The shared studio always lives inside Experiments, independent of its entry point. */
export function printCompositionUrl(base: string, input: PrintComposition): string {
  const url = new URL(base), c = normalizePrint(input)
  const current = url.hash.startsWith('#/work/miscellaneous?') ? url.hash.split('?')[1] : url.pathname.replace(/\/$/, '') === '/work/miscellaneous' ? url.search.slice(1) : ''
  const query = new URLSearchParams(current)
  query.set('print', '1')
  for (const key of compositionKeys) query.set(key, String(c[key]))
  url.search = ''
  url.hash = `/work/miscellaneous?${query}`
  return url.href
}

export function readPrintComposition(address: string): PrintComposition | null {
  const url = new URL(address)
  const [route, query] = url.hash.startsWith('#/') ? url.hash.slice(1).split('?') : [url.pathname, url.search.slice(1)]
  const params = new URLSearchParams(query || '')
  if (route.replace(/\/$/, '') !== '/work/miscellaneous' || params.get('print') !== '1') return null
  const input: Record<string, unknown> = {}
  for (const key of compositionKeys) {
    const value = params.get(key)
    if (value === null || value.trim() === '') continue
    input[key] = ['form', 'tone'].includes(key) ? value : Number(value)
  }
  return normalizePrint(input as Partial<PrintComposition>)
}

export function closePrintUrl(address: string) {
  const url = new URL(address)
  const hash = url.hash.startsWith('#/')
  const [route, query] = hash ? url.hash.slice(1).split('?') : [url.pathname, url.search.slice(1)]
  if (route.replace(/\/$/, '') !== '/work/miscellaneous') return url.href
  const params = new URLSearchParams(query || '')
  if (params.get('print') !== '1') return url.href
  params.delete('print'); for (const key of compositionKeys) params.delete(key)
  if (hash) url.hash = `${route}${params.size ? `?${params}` : ''}`
  else url.search = params.toString()
  return url.href
}
