import { Color } from 'three'

/** CSS colors enter Three in sRGB and are converted once to its linear working space. */
export function printPalette(paper: string, ink: string) {
  return { paper: new Color(paper), ink: new Color(ink) }
}

/** Match display pixels, or an integer subdivision of them, within the GPU budget. */
export function printPixelRatio(width: number, height: number, deviceRatio: number) {
  const area = Math.max(1, width*height)
  const budget = 2_200_000
  const native = Math.max(.1, deviceRatio)
  const subdivision = Math.max(1, Math.ceil(Math.sqrt(area*native*native/budget)))
  return native/subdivision
}

export function readPrintPalette(surface: Element, dark: boolean) {
  const style = getComputedStyle(surface)
  return printPalette(
    style.getPropertyValue('--paper').trim() || (dark ? '#111210' : '#f3f3f0'),
    style.getPropertyValue('--ink').trim() || (dark ? '#efefe8' : '#191a17'),
  )
}
