import { easeBetween } from './motion-curves.ts'
import { textSequence } from './sequence.ts'
import { openingSculpturePose } from './opening-motion.ts'

/** Each GLB retains its living pose on both sides of the optical passage. */
export function sculptureLivingPose(seconds: number, index: number, mobile = false, reduced = false) {
  const neutral = { yaw: 0, pitch: 0, roll: 0, x: 0, y: 0 }
  if (reduced || !Number.isFinite(seconds) || !Number.isInteger(index) || index < 0 || index > 4) return neutral
  if (index === 0) {
    const { yaw, pitch, roll, x, y } = openingSculpturePose(seconds, 0, mobile)
    return { yaw, pitch, roll, x, y }
  }
  const time = Math.max(0, seconds), restraint = mobile ? .65 : 1
  const direction = index === 3 ? -1 : 1
  return {
    yaw: Math.sin(time * (index === 3 ? .16 : .22)) * (index === 3 ? .09 : .065) * direction * restraint,
    pitch: Math.sin(time * .17) * (index === 2 ? .018 : .012) * restraint,
    roll: Math.sin(time * .13) * .004 * direction * restraint,
    x: 0,
    y: 0,
  }
}

/** Both actors share a retained clock; viewport and interaction pauses own suspension. */
export function sculptureAnimationActive(reduced: boolean, visible: boolean, menuOpen: boolean, manipulating: boolean, keyboardFocus: boolean, playing = true, ready = true) {
  return ready && playing && visible && !reduced && !menuOpen && !manipulating && !keyboardFocus
}

/** Manipulation belongs to the reading hold, before the authored portal move. */
export function sculptureRestWeight(progress: number, index: number, reduced = false) {
  if (!Number.isFinite(progress) || !Number.isInteger(index) || index < 0 || index > 4) return 0
  if (reduced) return Number(textSequence(progress, 'threshold', true).active === index)
  const local = Math.max(0, Math.min(1, progress)) * 4 - index
  return (index ? easeBetween(local, -.26, -.16) : 1) * (index === 4 ? 1 : 1 - easeBetween(local, .02, .12))
}

export type MechanicalMotion = { angularVelocity: number; ratio: number }

/** Authored ratios keep meshed gears synchronized; malformed extras stay still. */
export function mechanicalMotion(value: unknown): MechanicalMotion | undefined {
  if (!value || typeof value !== 'object') return
  const motion = value as Record<string, unknown>
  if (motion.kind !== 'continuous' || typeof motion.angularVelocity !== 'number' || !Number.isFinite(motion.angularVelocity) || Math.abs(motion.angularVelocity) > 4) return
  const ratio = motion.ratio ?? 1
  if (typeof ratio !== 'number' || !Number.isFinite(ratio) || Math.abs(ratio) > 8) return
  return { angularVelocity: motion.angularVelocity, ratio }
}

export function mechanicalAngle(motion: MechanicalMotion, seconds: number, reduced = false) {
  if (reduced || !Number.isFinite(seconds)) return 0
  const angle = Math.max(0, seconds) * motion.angularVelocity * motion.ratio
  return Number.isFinite(angle) ? angle % (Math.PI * 2) : 0
}
