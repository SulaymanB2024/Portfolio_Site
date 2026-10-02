export type PrintShape = 'orbit' | 'field' | 'drift'
export type PrintDot = { x: number; y: number; r: number; opacity: number }

/** The same impression stays reproducible on screen and in the exported vector. */
export function printDots(shape: PrintShape, impression: number): PrintDot[] {
  const phase = (Number.isFinite(impression) ? Math.max(0, Math.floor(impression)) : 0) * .73
  return Array.from({ length: 256 }, (_, i) => {
    const column = i % 16
    const row = Math.floor(i / 16)
    let x: number, y: number
    if (shape === 'orbit') {
      const angle = i * 2.39996323 + phase
      const radius = Math.sqrt((i + .5) / 256) * 145
      x = 200 + Math.cos(angle) * radius
      y = 200 + Math.sin(angle) * radius
    } else {
      x = 57.5 + column * 19
      y = 57.5 + row * 19
      if (shape === 'drift') {
        x += Math.sin(row * .34 + column * .12 + phase) * 13
        y += Math.cos(column * .28 + row * .17 + phase) * 13
      }
    }
    const distance = Math.hypot(x - 200, y - 200) / 170
    const interference = Math.sin(column * .48 + row * .32 + phase) * Math.cos(row * .39 - phase)
    const density = Math.max(.08, Math.min(1, .58 + interference * .34 - distance * .12))
    return { x, y, r: 1 + density * 3.7, opacity: .38 + density * .62 }
  })
}

export function printSvg(shape: PrintShape, impression: number): string {
  const number = Math.max(0, Math.floor(Number.isFinite(impression) ? impression : 0)) + 1
  const circles = printDots(shape, impression).map(dot => `<circle cx="${dot.x.toFixed(3)}" cy="${dot.y.toFixed(3)}" r="${dot.r.toFixed(3)}" opacity="${dot.opacity.toFixed(3)}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440"><title>Print room — ${shape}, impression ${number}</title><rect width="400" height="440" fill="#f3f3f0"/><g fill="#191a17">${circles}</g><path d="M28 403h344" stroke="#d8d9d1"/><g fill="#696c64" font-family="monospace" font-size="7" letter-spacing="1"><text x="28" y="423">SULAYMAN BOWLES / PRINT ROOM</text><text x="372" y="423" text-anchor="end">${String(number).padStart(3, '0')}</text></g></svg>`
}

export type HiddenWord = 'curious' | 'stargaze'
export function advanceHiddenWord(buffer: string, key: string): { buffer: string; found?: HiddenWord } {
  if (key.length !== 1 || !/^[a-z]$/i.test(key)) return { buffer: '' }
  const next = (buffer + key.toLowerCase()).slice(-8)
  const found = (['curious', 'stargaze'] as const).find(word => next.endsWith(word))
  return found ? { buffer: '', found } : { buffer: next }
}
