const clamp = (value: number) => Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value))

/** Zero velocity and acceleration at both ends preserve the study's reading hold. */
export function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start))
  return clamp(t * t * t * (t * (t * 6 - 15) + 10))
}

export function thresholdMotion(local: number) {
  return {
    travel: easeBetween(local, .20, .80),
    departure: easeBetween(local, .18, .68),
    arrival: easeBetween(local, .34, .82),
    outgoingLinks: 1 - easeBetween(local, .20, .31),
    incomingLinks: easeBetween(local, .82, .90),
    outgoingCategory: 1 - easeBetween(local, .31, .53),
    incomingCategory: easeBetween(local, .59, .79),
  }
}

export function sculpturePose(local: number, incoming: boolean) {
  const motion = thresholdMotion(local)
  const amount = incoming ? 1 - motion.arrival : motion.departure
  if (amount === 0) return { scale: 1, yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, articulation: 0 }
  return {
    scale: incoming ? 1 - .06 * amount : 1 + .12 * amount,
    yaw: (incoming ? -.12 : .16) * amount,
    pitch: (incoming ? .025 : -.035) * amount,
    roll: (incoming ? .02 : -.015) * amount,
    x: (incoming ? .10 : .05) * amount,
    y: (incoming ? -.04 : -.02) * amount,
    articulation: (incoming ? -.06 : .14) * amount,
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
