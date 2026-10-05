const clamp = (value: number) => Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value))
const sculptureDirections = [1, 1, .65, -.8, 1.05] as const
const cameraDirections = [1, 1, -.55, -1, .85] as const
const cameraLifts = [.02, .035, .09, -.015, .045] as const

/** Zero velocity and acceleration at both ends preserve the study's reading hold. */
export function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start))
  return clamp(t * t * t * (t * (t * 6 - 15) + 10))
}

export function thresholdMotion(local: number) {
  return {
    travel: pacedTravel((local - .12) / .50),
    departure: easeBetween(local, .10, .54),
    arrival: easeBetween(local, .28, .68),
    outgoingLinks: 1 - easeBetween(local, .10, .16),
    incomingLinks: easeBetween(local, .69, .74),
    outgoingCategory: 1 - easeBetween(local, .20, .34),
    incomingCategory: easeBetween(local, .44, .62),
  }
}

export const MOBILE_TITLE_TIMING = { eraseStart: .26, eraseEnd: .43, switch: .46, revealStart: .50, revealEnd: .68 } as const

export const TITLE_TIMING = { eraseStart: .20, eraseEnd: .35, switch: .38, revealStart: .44, revealEnd: .67 } as const

/** Short acceleration ramps around a steady central expansion. */
export function pacedTravel(value: number): number {
  const t = clamp(value), ramp = .26, normalization = 1 - ramp
  if (t < ramp) return (t / 2 - ramp * Math.sin(Math.PI * t / ramp) / (2 * Math.PI)) / normalization
  if (t > 1 - ramp) return 1 - pacedTravel(1 - t)
  return (t - ramp / 2) / normalization
}

export function sculpturePose(local: number, incoming: boolean, index = 0, mobile = false) {
  const motion = thresholdMotion(local)
  const amount = incoming ? 1 - motion.arrival : motion.departure
  if (amount === 0) return { scale: 1, yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, articulation: 0 }
  const restraint = mobile ? .6 : 1
  return {
    scale: 1 + (incoming ? .025 : .015) * amount * restraint,
    yaw: (incoming ? -.12 : .18) * amount * sculptureDirections[index] * restraint,
    pitch: (incoming ? .018 : -.025) * amount * restraint,
    roll: (incoming ? .006 : -.004) * amount * restraint,
    x: 0,
    y: 0,
    articulation: (incoming ? -.06 : .10) * amount * restraint,
  }
}

/** A shallow, reversible camera move retains stable engraved highlights. */
export function cinematicShot(local: number, incoming: boolean, mobile = false, index = 0) {
  const motion = thresholdMotion(local), amount = incoming ? 1 - motion.arrival : motion.departure
  const restraint = mobile ? .5 : 1
  if (amount === 0) return { x: 0, y: 0, depth: 0, aimX: 0, aimY: 0, lightX: 0, lightY: 0 }
  const direction = cameraDirections[index], lift = cameraLifts[index]
  const x = (incoming ? -.13 : .20) * direction * amount
  const y = (incoming ? -.5 : 1) * lift * amount + .018 * Math.sin(Math.PI * amount)
  return {
    x: x * restraint,
    y: y * restraint,
    depth: (incoming ? -.24 : -.18) * amount * restraint,
    aimX: x * .22 * restraint,
    aimY: y * .26 * restraint,
    lightX: 0,
    lightY: 0,
  }
}

/** A shallow optical turn resolves before the opening passes the screen edges. */
export function portalPose(local: number, leg: number, mobile = false) {
  const turn = 1 - easeBetween(local, .12, .48), restraint = mobile ? .55 : 1
  const rolls = [-.035, .025, -.02, .018], directions = [1, -1, 1, -1]
  return {
    pitch: .06 * turn * restraint,
    yaw: .24 * directions[leg % 4] * turn * restraint,
    roll: rolls[leg % 4] * turn * restraint,
    center: easeBetween(local, .20, .62),
  }
}

export function cinematicPhase(local: number) {
  return local <= .10 || local >= .74 ? 'held' : local < .28 ? 'approach' : local < .62 ? 'passage' : 'settle'
}

/** Let the optical rim disappear before it becomes a pair of screen-wide rails. */
export function portalFrameOpacity(local: number) {
  return .65 * (1 - easeBetween(local, .24, .42))
}

/** Re-time the authored GLB path by visible aperture area, avoiding its microscopic lead-in. */
export function createApertureSampler(sample: ReturnType<typeof createScaleSampler>, duration: number, ratioX: number, ratioY: number) {
  const extent = new Float64Array(257), scratch = new Float64Array(3)
  // Smooth saturation avoids a speed kink when the wide aperture leaves one edge first.
  const visible = (extent: number) => 1.8 * extent / (1.8 + extent)
  const measure = () => Math.sqrt(visible(scratch[0] * ratioX) * visible(scratch[1] * ratioY))
  for (let i = 0; i < extent.length; i++) { sample(duration * i / 256, scratch); extent[i] = measure() }
  const start = extent[0], range = extent[256] - start
  return <T extends ScaleValues>(progress: number, result: T): T => {
    const p = clamp(progress)
    if (p === 0 || p === 1 || range <= 0) return sample(p * duration, result)
    const target = start + p * range
    let low = 0, high = 256
    while (high - low > 1) { const middle = (low + high) >> 1; if (extent[middle] < target) low = middle; else high = middle }
    // Refine the inverse rather than approximating the GLB scale itself.
    let left = low / 256, right = high / 256
    for (let i = 0; i < 14; i++) { const middle = (left + right) / 2; sample(middle * duration, scratch); if (measure() < target) left = middle; else right = middle }
    return sample((left + right) / 2 * duration, result)
  }
}

export type ScaleValues = Float32Array | Float64Array | number[]

/** Monotone Hermite interpolation in log scale retains the GLB's authored keys. */
export function createScaleSampler(times: ArrayLike<number>, values: ArrayLike<number>) {
  const count = times.length
  if (count < 2 || values.length !== count * 3) throw Error('Invalid scale track')
  for (let i = 0; i < count; i++) {
    if (!Number.isFinite(times[i]) || (i && times[i] <= times[i - 1])) throw Error('Invalid scale times')
    for (let axis = 0; axis < 3; axis++) if (!(values[i * 3 + axis] > 0) || !Number.isFinite(values[i * 3 + axis])) throw Error('Invalid scale key')
  }
  const keys = new Float64Array(values.length), tangents = new Float64Array(values.length)
  for (let i = 0; i < values.length; i++) keys[i] = Math.log(values[i])
  for (let axis = 0; axis < 3; axis++) {
    for (let i = 1; i < count - 1; i++) {
      const before = times[i] - times[i - 1], after = times[i + 1] - times[i]
      const left = (keys[i * 3 + axis] - keys[(i - 1) * 3 + axis]) / before
      const right = (keys[(i + 1) * 3 + axis] - keys[i * 3 + axis]) / after
      if (left * right > 0) {
        const a = 2 * after + before, b = after + 2 * before
        tangents[i * 3 + axis] = (a + b) / (a / left + b / right)
      }
    }
  }
  return <T extends ScaleValues>(time: number, result: T): T => {
    const t = Number.isNaN(time) ? times[0] : Math.max(times[0], Math.min(times[count - 1], time))
    let index = 0
    while (index < count - 2 && t > times[index + 1]) index++
    const span = times[index + 1] - times[index], x = (t - times[index]) / span
    const x2 = x * x, x3 = x2 * x
    for (let axis = 0; axis < 3; axis++) {
      const from = index * 3 + axis, to = from + 3
      result[axis] = x === 0 ? values[from] : x === 1 ? values[to] : Math.exp(
        (2 * x3 - 3 * x2 + 1) * keys[from] + (x3 - 2 * x2 + x) * span * tangents[from]
        + (-2 * x3 + 3 * x2) * keys[to] + (x3 - x2) * span * tangents[to],
      )
    }
    return result
  }
}
