/** Exact maximum vertex radius for a normalized shaft axis, including a full turn. */
export function shaftVertexRadius(vertex, pivot, axis, continuous = false) {
  const parallel = axis.clone().multiplyScalar(axis.dot(vertex))
  const perpendicular = vertex.clone().sub(parallel), cross = axis.clone().cross(vertex)
  const a = pivot.dot(perpendicular), b = pivot.dot(cross)
  const base = pivot.lengthSq() + vertex.lengthSq() + 2 * pivot.dot(parallel)
  if (continuous) return Math.sqrt(Math.max(0, base + 2 * Math.hypot(a, b)))
  const peak = Math.atan2(b, a), angles = [-.18, .18]
  if (peak >= -.18 && peak <= .18) angles.push(peak)
  return Math.sqrt(Math.max(0, ...angles.map(angle => base + 2 * (a * Math.cos(angle) + b * Math.sin(angle)))))
}
