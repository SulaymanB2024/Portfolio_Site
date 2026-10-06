import { easeBetween } from './motion-curves.ts'

/** The living opening resolves to the authored pose before the visor starts. */
export function openingMotionWeight(progress: number, reduced = false) {
  if (reduced || !Number.isFinite(progress)) return 0
  return 1 - easeBetween(Math.max(0, progress) * 4, .02, .12)
}

/** A restrained mesh turn; a fixed light keeps the engraved tones consistent. */
export function openingSculpturePose(seconds: number, progress: number, mobile = false, reduced = false) {
  const weight = openingMotionWeight(progress, reduced)
  if (!weight) return { yaw: 0, pitch: 0, roll: 0, lightX: 0, lightY: 0 }
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const amount = weight * (mobile ? .7 : 1)
  return {
    yaw: Math.sin(time * .24) * .10 * amount,
    pitch: Math.sin(time * .18) * .015 * amount,
    roll: Math.sin(time * .15) * .005 * amount,
    lightX: 0,
    lightY: 0,
  }
}
