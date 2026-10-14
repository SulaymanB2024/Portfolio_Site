export type ProjectPartMotion =
  | { kind: 'continuous'; angularVelocity: number; ratio: number }
  | { kind: 'pendulum'; amplitude: number; period: number }

/** Use the authored shaft records; do not invent independent phases for meshed gears. */
export function projectPartMotion(name: string, extras: unknown): ProjectPartMotion | undefined {
  if (extras && typeof extras === 'object') {
    const motion = extras as Record<string, unknown>
    if (motion.kind === 'continuous' && typeof motion.angularVelocity === 'number' && typeof motion.ratio === 'number'
      && Number.isFinite(motion.angularVelocity) && Number.isFinite(motion.ratio) && motion.ratio !== 0
      && Math.abs(motion.ratio) <= 10 && Math.abs(motion.angularVelocity * motion.ratio) <= 2) {
      return { kind: 'continuous', angularVelocity: motion.angularVelocity, ratio: motion.ratio }
    }
  }
  if (name === 'hover-register-escapement-pendulum') return { kind: 'pendulum', amplitude: .09, period: 2.8 }
}

export function projectPartAngle(motion: ProjectPartMotion, seconds: number, enabled: boolean) {
  if (!enabled || !Number.isFinite(seconds)) return 0
  return motion.kind === 'continuous' ? seconds * motion.angularVelocity * motion.ratio % (2 * Math.PI)
    : Math.sin(seconds * 2 * Math.PI / motion.period) * motion.amplitude
}
