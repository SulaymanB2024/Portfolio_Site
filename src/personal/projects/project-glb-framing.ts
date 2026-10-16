import { Euler, Matrix4, Quaternion, Vector3 } from 'three'

export interface ProjectShaftBounds {
  points: Float32Array
  pivot: [number, number, number]
  axis: [number, number, number]
  /** Undefined is a complete revolution; hinges have a symmetric angular limit. */
  range?: number
}

/** Fit the idle pose and articulated shafts from the requested camera direction. */
export function projectGLBDistance(points: Float32Array, aspect: number, verticalHalfAngle: number, yaw: number, pitch: number, shafts: ProjectShaftBounds[] = [], cameraRotation?: Quaternion) {
  const vertical = Math.tan(verticalHalfAngle)
  const horizontal = vertical * Math.max(.05, aspect)
  const rotation = new Matrix4()
  const inverse = new Matrix4()
  const view = cameraRotation ?? new Quaternion().setFromEuler(new Euler(-Math.atan(.04), 0, 0))
  const directions = [
    new Vector3(1 / horizontal, 0, 1), new Vector3(-1 / horizontal, 0, 1),
    new Vector3(0, 1 / vertical, 1), new Vector3(0, -1 / vertical, 1),
  ].map(direction => direction.applyQuaternion(view))
  const bob = directions.map(direction => Math.abs(direction.y) * .03)
  const localDirections = directions.map(direction => direction.clone())
  const pivot = new Vector3(), axis = new Vector3(), relative = new Vector3(), parallel = new Vector3(), perpendicular = new Vector3(), cross = new Vector3(), origin = new Vector3()
  let distance = .2
  for (const y of [-.18, 0, .18]) for (const x of [-.055, 0, .055]) for (const z of [-.025, 0, .025]) {
    rotation.makeRotationFromEuler(new Euler(pitch + x, yaw + y, z))
    inverse.copy(rotation).transpose()
    localDirections.forEach((direction, index) => direction.copy(directions[index]).applyMatrix4(inverse))
    for (let i = 0; i < points.length; i += 3) {
      for (let plane = 0; plane < localDirections.length; plane++) {
        const direction = localDirections[plane]
        distance = Math.max(distance, points[i] * direction.x + points[i + 1] * direction.y + points[i + 2] * direction.z + bob[plane])
      }
    }
    // The support of each spinning vertex is analytic. Fit the entire shaft
    // revolution without enlarging an open sculpture to a loose bounding box.
    if (shafts.length) {
      for (const shaft of shafts) {
        pivot.fromArray(shaft.pivot); axis.fromArray(shaft.axis).normalize()
        for (let i = 0; i < shaft.points.length; i += 3) {
          relative.fromArray(shaft.points, i).sub(pivot)
          parallel.copy(axis).multiplyScalar(axis.dot(relative))
          perpendicular.copy(relative).sub(parallel)
          cross.copy(axis).cross(perpendicular)
          origin.copy(pivot).add(parallel)
          for (let plane = 0; plane < localDirections.length; plane++) {
            const direction = localDirections[plane], a = direction.dot(perpendicular), b = direction.dot(cross)
            let sweep = Math.hypot(a, b)
            if (shaft.range !== undefined) {
              const range = shaft.range, peak = Math.atan2(b, a)
              sweep = Math.max(a * Math.cos(range) + b * Math.sin(range), a * Math.cos(range) - b * Math.sin(range))
              if (peak >= -range && peak <= range) sweep = Math.max(sweep, Math.hypot(a, b))
            }
            distance = Math.max(distance, direction.dot(origin) + sweep + bob[plane])
          }
        }
      }
    }
  }
  return distance * 1.045
}
