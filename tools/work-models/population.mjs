import * as THREE from 'three'
import { TAU, vec, group, put, rod, machinedRing, bolt } from './geometry.mjs'

// Two paired bands trace the same continuous population, offset around one shaft.
// Broad chamfered surfaces carry tone; narrow indexed inlays survive the dot screen.
const turns = 1.22,
  radius = 0.52,
  height = 1.94
function frame(t, phase) {
  const angle = t * TAU * turns + phase
  const center = vec(radius * Math.cos(angle), (t - 0.5) * height, radius * Math.sin(angle))
  const width = vec(Math.cos(angle), 0, Math.sin(angle))
  const tangent = vec(-radius * TAU * turns * Math.sin(angle), height, radius * TAU * turns * Math.cos(angle)).normalize()
  const normal = tangent.clone().cross(width).normalize()
  return { center, width, normal, tangent }
}
function section(part, phase, start, end, width, depth, offset = 0, lift = 0, segments = 160) {
  const bevel = Math.min(depth * 0.28, width * 0.12)
  const profile = [
    [-width / 2 + bevel, -depth / 2],
    [width / 2 - bevel, -depth / 2],
    [width / 2, -depth / 2 + bevel],
    [width / 2, depth / 2 - bevel],
    [width / 2 - bevel, depth / 2],
    [-width / 2 + bevel, depth / 2],
    [-width / 2, depth / 2 - bevel],
    [-width / 2, -depth / 2 + bevel]
  ]
  const positions = [],
    normals = [],
    indices = []
  const position = (f, p) =>
    f.center
      .clone()
      .addScaledVector(f.width, p[0] + offset)
      .addScaledVector(f.normal, p[1] + lift)
  for (let edge = 0; edge < profile.length; edge++) {
    const a = profile[edge],
      b = profile[(edge + 1) % profile.length]
    const outward = new THREE.Vector2(b[1] - a[1], a[0] - b[0]).normalize()
    const base = positions.length / 3
    for (let i = 0; i <= segments; i++) {
      const f = frame(start + ((end - start) * i) / segments, phase)
      const n = f.width.clone().multiplyScalar(outward.x).addScaledVector(f.normal, outward.y)
      for (const p of [a, b]) {
        positions.push(...position(f, p).toArray())
        normals.push(...n.toArray())
      }
      if (i < segments) {
        const k = base + i * 2
        indices.push(k, k + 3, k + 2, k, k + 1, k + 3)
      }
    }
  }
  const caps = THREE.ShapeUtils.triangulateShape(
    profile.map((p) => new THREE.Vector2(...p)),
    []
  )
  for (const endcap of [0, 1]) {
    const f = frame(endcap ? end : start, phase),
      base = positions.length / 3
    const n = f.tangent.clone().multiplyScalar(endcap ? 1 : -1)
    for (const p of profile) {
      positions.push(...position(f, p).toArray())
      normals.push(...n.toArray())
    }
    for (const [a, b, c] of caps) indices.push(...(endcap ? [base + a, base + b, base + c] : [base + c, base + b, base + a]))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  g.setIndex(indices)
  put(part, g)
}
export function pairedPopulation() {
  const shaft = group('Continuous comparator spindle', 'steel')
  const fittings = group('Machined bearing collars and terminal fittings', 'silver')
  const bands = []
  for (const [i, phase] of [0, Math.PI].entries()) {
    const band = group(`hover-paired-population-band-${i + 1}`, 'silver', vec(0, 0, 0), vec(0, 1, 0))
    const index = group(`hover-population-index-inlays-${i + 1}`, 'ink', vec(0, 0, 0), vec(0, 1, 0))
    const samples = group(`hover-population-sample-inserts-${i + 1}`, 'porcelain', vec(0, 0, 0), vec(0, 1, 0))
    section(band, phase, 0, 1, 0.38, 0.044, 0, 0, 224)
    // A continuous recessed tracer and a raised return lip describe the winding.
    section(index, phase, 0.025, 0.975, 0.009, 0.004, 0.135, 0.024, 160)
    section(band, phase, 0.008, 0.992, 0.018, 0.018, -0.174, 0.026, 160)
    for (let j = 0; j < 18; j++) {
      const t = 0.055 + (j * 0.89) / 17
      // Each small insert is flush with the broad face, supported by the ribbon.
      section(samples, phase, t - 0.009, t + 0.009, 0.072, 0.009, 0.048, 0.027, 4)
      section(index, phase, t - 0.003, t + 0.003, 0.034, 0.005, -0.072, 0.025, 3)
    }
    for (const t of [0, 1]) {
      const f = frame(t, phase)
      rod(band, vec(0, f.center.y, 0), f.center, 0.029, 12)
      const p = f.center.clone().addScaledVector(f.normal, 0.025)
      const q = new THREE.Quaternion().setFromUnitVectors(vec(0, 0, 1), f.normal)
      const e = new THREE.Euler().setFromQuaternion(q)
      bolt(band, index, p, 0.034, [e.x, e.y, e.z])
    }
    bands.push(band, index, samples)
  }
  rod(shaft, vec(0, -1.07, 0), vec(0, 1.07, 0), 0.036, 24)
  for (const y of [-0.99, -0.92, 0.92, 0.99]) {
    machinedRing(fittings, 0.076, 0.025, 0.045, 0, TAU, vec(0, y, 0), [Math.PI / 2, 0, 0], 40)
    machinedRing(shaft, 0.056, 0.008, 0.052, 0, TAU, vec(0, y, 0), [Math.PI / 2, 0, 0], 32)
  }
  for (const y of [-1.065, 1.065]) put(fittings, new THREE.SphereGeometry(0.052, 20, 10), vec(0, y, 0), [0, 0, 0], [1, 0.45, 1])
  return [shaft, fittings, ...bands]
}
