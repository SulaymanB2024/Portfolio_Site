import { easeBetween } from './motion-curves.ts'

/** Ink arrives over enough visible paints to read as an entrance, with fixed lighting. */
export function openingInkReveal(elapsed: number, reduced = false) {
  return reduced ? 1 : easeBetween(Number.isFinite(elapsed) ? elapsed : 0, 0, 640)
}

/** The living opening resolves to the authored pose before the visor starts. */
export function openingMotionWeight(progress: number, reduced = false) {
  if (reduced || !Number.isFinite(progress)) return 0
  return 1 - easeBetween(Math.max(0, progress) * 4, .02, .12)
}

/** A slow turn and float; fixed lighting keeps the engraved tones consistent. */
export function openingSculpturePose(seconds: number, progress: number, mobile = false, reduced = false) {
  const weight = openingMotionWeight(progress, reduced)
  if (!weight) return { yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, lightX: 0, lightY: 0 }
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const amount = weight * (mobile ? .7 : 1)
  return {
    yaw: Math.sin(time * .42) * .16 * amount,
    pitch: Math.sin(time * .36) * .027 * amount,
    roll: Math.sin(time * .30) * .008 * amount,
    x: Math.sin(time * .32) * .025 * amount,
    y: Math.sin(time * .58) * .055 * amount,
    lightX: 0,
    lightY: 0,
  }
}
