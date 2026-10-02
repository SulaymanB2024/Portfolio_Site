import * as THREE from 'three'

// Both materials use source-space coordinates, so ink separates from the actual
// surface without a gap or a change in the travelling release front.
const grain = /* glsl */ `
  float lionHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 43.231))) * 43758.5453); }
  float lionErosion(vec3 p) {
    return (.34 - p.y) * .78 + (p.x + 1.0) * .09
      + sin(p.x * 3.5 + p.z * 4.0) * .055 + sin(p.y * 11.0 + p.z * 7.0) * .018
      - exp(-p.x * p.x * 8.0 - pow((p.y + .1) * 4.0, 2.0)) * .22;
  }
  float lionRelease(vec3 p, float field) {
    float front = .91 - field * .91;
    return smoothstep(front - .055, front + .055, lionErosion(p));
  }
  vec3 lionWarp(vec3 p, float field) {
    float bend = field * field * lionRelease(p, field);
    return p + vec3(sin(p.y * 5.0 + p.z * 3.0) * .13,
      sin(p.x * 3.0 - p.z * 2.0) * .09,
      sin(p.y * 4.0 + p.x * 3.0) * .07) * bend;
  }
  vec3 lionNormal(vec3 p, vec3 n, float field) {
    vec3 tangent = normalize(cross(n, abs(n.y) < .9 ? vec3(0, 1, 0) : vec3(1, 0, 0)));
    vec3 bitangent = cross(n, tangent);
    vec3 origin = lionWarp(p, field);
    return normalize(cross(lionWarp(p + tangent * .001, field) - origin,
      lionWarp(p + bitangent * .001, field) - origin));
  }
`

const rest = .06, crest = .88, cycle = 36
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
export function createLionStudy(source: THREE.Object3D) {
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
    material.color.multiplyScalar(.48)
    material.metalness = 0
    material.roughness = .92
    material.emissiveIntensity = 0
    material.onBeforeCompile = shader => {
      shader.uniforms.lionField = field
      shader.vertexShader = `uniform float lionField;\nvarying vec3 vLionPosition;\n${grain}\n${shader.vertexShader}`
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = lionNormal(position, normal, lionField);')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLionPosition = position;\ntransformed = lionWarp(position, lionField);')
      shader.fragmentShader = `uniform float lionField;\nvarying vec3 vLionPosition;\n${grain}\n${shader.fragmentShader}`
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          float release = lionRelease(vLionPosition, lionField);
          if (lionField > .005 && release > lionHash(floor(vLionPosition * 460.0))) discard;
        `)
        .replace('#include <color_fragment>', `#include <color_fragment>
          float lines = (vLionPosition.y + vLionPosition.x * .18) * 96.0;
          float edge = fwidth(lines);
          float hatch = smoothstep(.79 - edge, .79 + edge, fract(lines));
          diffuseColor.rgb *= 1.0 - hatch * .18;
        `)
    }
    material.customProgramCacheKey = () => 'contact-lion-current-v2'
    group.add(new THREE.Mesh(geometry, material))

    // Area-weighted surface sampling keeps the ink density independent of scan topology.
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const index = geometry.getIndex()
    const triangles = Math.floor((index?.count ?? position.count) / 3)
    const areas = new Float64Array(triangles)
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
    const ab = new THREE.Vector3(), ac = new THREE.Vector3()
    const vertex = (i: number) => index ? index.getX(i) : i
    let area = 0
    for (let i = 0; i < triangles; i++) {
      a.fromBufferAttribute(position, vertex(i * 3))
      b.fromBufferAttribute(position, vertex(i * 3 + 1))
      c.fromBufferAttribute(position, vertex(i * 3 + 2))
      area += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * .5
      areas[i] = area
    }
    const count = 42000
    const samples = new Float32Array(count * 3)
    const normals = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const na = new THREE.Vector3(), nb = new THREE.Vector3(), nc = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const selection = random() * area
      let low = 0, high = triangles - 1
      while (low < high) { const middle = (low + high) >>> 1; if (areas[middle] < selection) low = middle + 1; else high = middle }
      a.fromBufferAttribute(position, vertex(low * 3))
      b.fromBufferAttribute(position, vertex(low * 3 + 1))
      c.fromBufferAttribute(position, vertex(low * 3 + 2))
      const u = Math.sqrt(random()), v = random()
      a.multiplyScalar(1 - u).addScaledVector(b, u * (1 - v)).addScaledVector(c, u * v).toArray(samples, i * 3)
      na.fromBufferAttribute(normal, vertex(low * 3))
      nb.fromBufferAttribute(normal, vertex(low * 3 + 1))
      nc.fromBufferAttribute(normal, vertex(low * 3 + 2))
      na.multiplyScalar(1 - u).addScaledVector(nb, u * (1 - v)).addScaledVector(nc, u * v).normalize().toArray(normals, i * 3)
      seeds[i] = random()
    }
    const dustGeometry = new THREE.BufferGeometry()
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
        ${grain}
        void main() {
          float exposed = lionRelease(position, lionField);
          vVisible = exposed * step(.005, lionField);
          float spread = lionField * lionField * exposed;
          vec3 trace = lionWarp(position, lionField);
          // Neighbouring samples share a current. The small seed term gives the
          // edges a fibrous texture without turning the sculpture into random dust.
          float ribbon = position.y * 8.0 + position.z * 3.0;
          float fibre = .65 + seed * .35;
          trace.x += (sin(ribbon) * .20) * spread * fibre;
          trace.y += (cos(position.x * 4.0 + position.z * 3.0) * .10 + .055) * spread * fibre;
          trace.z += sin(position.x * 3.0 + position.y * 4.0) * .13 * spread * fibre;
          trace += vec3(sin(seed * 57.0 + lionTime * .10),
            cos(seed * 31.0 + lionTime * .12), sin(seed * 19.0)) * .014 * spread;
          vec3 facing = normalize(normalMatrix * lionNormal(position, normal, lionField));
          float light = max(dot(facing, normalize(vec3(-.4, .8, .5))), 0.0);
          vInk = facing.z > -.12 ? .08 + light * .30 : -1.0;
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
  })

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
      return playing || field.value !== target
    },
    get value() { return field.value },
    get playing() { return playing },
    get elapsed() { return time.value },
  }
}
