import * as THREE from 'three'
import { sampleSurface, type SurfaceBuffer } from './surface-samples.ts'
import { lionWarpGLSL } from './lion-warp.ts'

function surfaceBuffer(attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute): SurfaceBuffer {
  // Keep uncommon normalized/half-float inputs compatible without adding their
  // conversion cost to the ordinary Float32 scan buffers.
  if (attribute.normalized || attribute instanceof THREE.Float16BufferAttribute) {
    const array = new Float64Array(attribute.count * 3)
    for (let i = 0; i < attribute.count; i++) {
      array[i * 3] = attribute.getX(i)
      array[i * 3 + 1] = attribute.getY(i)
      array[i * 3 + 2] = attribute.getZ(i)
    }
    return { array, count: attribute.count }
  }
  if (attribute instanceof THREE.InterleavedBufferAttribute) return { array: attribute.data.array, count: attribute.count, stride: attribute.data.stride, offset: attribute.offset }
  return { array: attribute.array, count: attribute.count, stride: attribute.itemSize }
}

const rest = 0, crest = .88, cycle = 36
const ease = (value: number) => value * value * (3 - 2 * value)
function cycleField(seconds: number) {
  // A readable form, a long release, a suspended field, then a slower return.
  if (seconds < 4) return rest
  if (seconds < 16) return rest + (crest - rest) * ease((seconds - 4) / 12)
  if (seconds < 19) return crest
  if (seconds < 33) return crest - (crest - rest) * ease((seconds - 19) / 14)
  return rest
}
function phaseForField(value: number, returning: boolean) {
  const fraction = THREE.MathUtils.clamp((value - rest) / (crest - rest), 0, 1)
  // Analytic inverse of smoothstep keeps Play continuous after manual scrubbing.
  const progress = .5 - Math.sin(Math.asin(1 - 2 * fraction) / 3)
  return returning ? 33 - progress * 14 : 4 + progress * 12
}

/** Reinterpret the intact scan as an etched form and a field sampled from its surface. */
export function createLionStudy(source: THREE.Object3D, sampleCount = 42000) {
  const count = Number.isFinite(sampleCount) ? Math.max(1, Math.min(42000, Math.floor(sampleCount))) : 42000
  source.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(source)
  const center = bounds.getCenter(new THREE.Vector3())
  const scale = 2 / bounds.getSize(new THREE.Vector3()).x
  const group = new THREE.Group()
  const field = new THREE.Uniform(rest)
  const pixelRatio = new THREE.Uniform(1)
  const time = new THREE.Uniform(0)
  let phase = 0
  let playing = true
  let target = rest
  let seed = 7183
  const dustGeometries: THREE.BufferGeometry[] = []
  const dustBounds: { points: THREE.Points; erosionCeiling: number }[] = []
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }

  source.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld)
    geometry.translate(-center.x, -center.y, -center.z)
    geometry.scale(scale, scale, scale)
    if (!geometry.hasAttribute('normal')) geometry.computeVertexNormals()
    // Let the normal map derive its tangent frame from the warped surface.
    geometry.deleteAttribute('tangent')
    const original = Array.isArray(node.material) ? node.material[0] : node.material
    const material = original instanceof THREE.MeshStandardMaterial ? original.clone() : new THREE.MeshStandardMaterial()
    material.color.multiplyScalar(.40)
    material.metalness = 0
    material.roughness = .92
    material.emissiveIntensity = 0
    material.onBeforeCompile = shader => {
      shader.uniforms.lionField = field
      // Both materials use source-space coordinates. Share the release and warp
      // evaluation between position and its analytic tangent-plane normal.
      shader.vertexShader = `uniform float lionField;\nvarying vec3 vLionPosition;\n${lionWarpGLSL}\n${shader.vertexShader}`
        .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
          vec3 lionWarpedPosition;
          float lionReleased;
          lionDeform(position, normal, lionField, lionWarpedPosition, objectNormal, lionReleased);
        `)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLionPosition = position;\ntransformed = lionWarpedPosition;')
      shader.fragmentShader = `uniform float lionField;\nvarying vec3 vLionPosition;\n${lionWarpGLSL}\n${shader.fragmentShader}`
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          float release = lionRelease(vLionPosition, lionField);
          // A sparse etched remainder keeps the source silhouette legible
          // while the released ink moves away from it.
          if (lionField > .005 && release * .88 > lionHash(floor(vLionPosition * 460.0))) discard;
        `)
        .replace('#include <color_fragment>', `#include <color_fragment>
          float lines = (vLionPosition.y + vLionPosition.x * .18) * 96.0;
          float edge = fwidth(lines);
          float hatch = smoothstep(.79 - edge, .79 + edge, fract(lines));
          diffuseColor.rgb *= 1.0 - hatch * .18;
        `)
    }
    material.customProgramCacheKey = () => 'contact-lion-current-v3-jacobian'
    group.add(new THREE.Mesh(geometry, material))

    // Area-weighted surface sampling keeps the ink density independent of scan topology.
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const index = geometry.getIndex()
    const { positions: samples, normals, seeds } = sampleSurface(surfaceBuffer(position), surfaceBuffer(normal), index?.array ?? null, count, random)
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometries.push(dustGeometry)
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(samples, 3))
    dustGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    dustGeometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: { lionField: field, pixelRatio, lionTime: time },
      vertexShader: /* glsl */ `
        uniform float lionField;
        uniform float pixelRatio;
        uniform float lionTime;
        attribute float seed;
        varying float vVisible;
        varying float vInk;
        ${lionWarpGLSL}
        void main() {
          float exposed;
          vec3 trace;
          vec3 surfaceNormal;
          lionDeform(position, normal, lionField, trace, surfaceNormal, exposed);
          vVisible = exposed * step(.005, lionField);
          float spread = lionField * lionField * exposed;
          // Neighbouring samples share a current. The small seed term gives the
          // edges a fibrous texture without turning the sculpture into random dust.
          float ribbon = position.y * 8.0 + position.z * 3.0;
          float fibre = .65 + seed * .35;
          trace.x += (sin(ribbon) * .20) * spread * fibre;
          trace.y += (cos(position.x * 4.0 + position.z * 3.0) * .10 + .055) * spread * fibre;
          trace.z += sin(position.x * 3.0 + position.y * 4.0) * .13 * spread * fibre;
          trace += vec3(sin(seed * 57.0 + lionTime * .10),
            cos(seed * 31.0 + lionTime * .12), sin(seed * 19.0)) * .014 * spread;
          vec3 facing = normalize(normalMatrix * surfaceNormal);
          float light = max(dot(facing, normalize(vec3(-.4, .8, .5))), 0.0);
          vInk = facing.z > -.12 ? .06 + light * .26 : -1.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(trace, 1.0);
          gl_PointSize = (1.55 + seed * .95) * pixelRatio;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vVisible;
        varying float vInk;
        void main() {
          if (vVisible < .04 || vInk < 0.0 || distance(gl_PointCoord, vec2(.5)) > .48) discard;
          gl_FragColor = vec4(vec3(vInk), 1.0);
        }
      `,
    })
    const dust = new THREE.Points(dustGeometry, dustMaterial)
    // The vertex shader moves ink beyond the source bounding sphere.
    dust.frustumCulled = false
    group.add(dust)
    let erosionCeiling = -Infinity
    for (let i = 0; i < samples.length; i += 3) {
      const x = samples[i], y = samples[i + 1], z = samples[i + 2]
      // Static sample coordinates give a tighter ceiling than a whole-model
      // box. Omitting the subtracted Gaussian keeps this bound conservative.
      erosionCeiling = Math.max(erosionCeiling, (.34 - y) * .78 + (x + 1) * .09
        + Math.sin(x * 3.5 + z * 4) * .055 + Math.sin(y * 11 + z * 7) * .018)
    }
    dustBounds.push({ points: dust, erosionCeiling })
  })

  function updateDustVisibility() {
    const lower = .91 - field.value * .91 - .055
    for (const { points, erosionCeiling } of dustBounds) {
      // Only skip a complete draw when every sample is provably invisible.
      // Margin retains boundary samples despite CPU/GPU float differences.
      points.visible = field.value > .005 && erosionCeiling >= lower - .0001
    }
  }
  updateDustVisibility()

  return {
    group,
    setField(value: number) { playing = false; target = Math.min(1, Math.max(0, value)) },
    setPlaying(value: boolean) {
      if (value === playing) return
      playing = value
      if (playing) {
        // Preserve the direction and pause position, including the two rests.
        if (Math.abs(cycleField(phase) - field.value) > .002) phase = phaseForField(field.value, phase >= 19)
      } else target = field.value
    },
    setPixelRatio(value: number) { pixelRatio.value = value },
    setDetail(narrow: boolean, quality = 1) {
      const scale = Number.isFinite(quality) ? THREE.MathUtils.clamp(quality, .5, 1) : 1
      for (const geometry of dustGeometries) geometry.setDrawRange(0, Math.min(count, Math.floor((narrow ? 24000 : 42000) * scale * scale)))
    },
    advance(delta: number, reducedMotion: boolean) {
      const step = Math.min(Math.max(delta, 0), .05)
      if (reducedMotion && playing) { playing = false; target = field.value }
      if (playing) {
        // Accumulate visible playback time, so returning to the tab never skips ahead.
        phase = (phase + step) % cycle
        time.value += step
        target = cycleField(phase)
      }
      field.value = reducedMotion ? target : THREE.MathUtils.damp(field.value, target, 12, step)
      if (Math.abs(field.value - target) < .001) field.value = target
      updateDustVisibility()
      return playing || field.value !== target
    },
    get value() { return field.value },
    get playing() { return playing },
    get elapsed() { return time.value },
  }
}
