import * as THREE from 'three'

const grain = /* glsl */ `
  float lionHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 43.231))) * 43758.5453); }
  float lionErosion(vec3 p) {
    return (.355 - p.y) * .75 + abs(p.x) * .18
      + lionHash(floor(p * 380.0)) * .09 + sin(p.x * 9.0) * .025;
  }
`

/** Reinterpret the intact scan as an etched form and a field sampled from its surface. */
export function createLionStudy(source: THREE.Object3D) {
  source.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(source)
  const center = bounds.getCenter(new THREE.Vector3())
  const scale = 2 / bounds.getSize(new THREE.Vector3()).x
  const group = new THREE.Group()
  const field = new THREE.Uniform(.42)
  const pixelRatio = new THREE.Uniform(1)
  const time = new THREE.Uniform(0)
  const low = .08, high = .98, cycle = 32
  let phase = Math.acos(1 - 2 * (.42 - low) / (high - low))
  let playing = true
  let target = .42
  let seed = 7183
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }

  source.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld)
    geometry.translate(-center.x, -center.y, -center.z)
    geometry.scale(scale, scale, scale)
    if (!geometry.hasAttribute('normal')) geometry.computeVertexNormals()
    const original = Array.isArray(node.material) ? node.material[0] : node.material
    const material = original instanceof THREE.MeshStandardMaterial ? original.clone() : new THREE.MeshStandardMaterial()
    material.color.multiplyScalar(.48)
    material.metalness = 0
    material.roughness = .92
    material.emissiveIntensity = 0
    material.onBeforeCompile = shader => {
      shader.uniforms.lionField = field
      shader.vertexShader = `varying vec3 vLionPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLionPosition = position;')
      shader.fragmentShader = `uniform float lionField;\nvarying vec3 vLionPosition;\n${grain}\n${shader.fragmentShader}`
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          if (lionField > .005 && lionErosion(vLionPosition) > 1.02 - lionField * .97) discard;
        `)
        .replace('#include <color_fragment>', `#include <color_fragment>
          float hatch = step(.82, fract((vLionPosition.y + vLionPosition.x * .18) * 96.0));
          diffuseColor.rgb *= 1.0 - hatch * .22;
        `)
    }
    material.customProgramCacheKey = () => 'contact-lion-etch-v1'
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
          float threshold = 1.02 - lionField * .97;
          float score = lionErosion(position);
          float exposed = smoothstep(threshold - .018, threshold + .055, score);
          vVisible = exposed * step(.005, lionField);
          float spread = lionField * lionField * exposed;
          vec3 trace = position;
          trace.x += (sin(position.y * 10.0 + position.z * 5.0 + lionTime * .13) * .075 + (seed - .5) * .09) * spread;
          trace.y -= (.025 + seed * .045 + sin(position.x * 5.0 + lionTime * .18) * .012) * spread;
          trace.z += sin(seed * 57.0 + lionTime * .11) * .08 * spread;
          vec3 facing = normalize(normalMatrix * normal);
          float light = max(dot(facing, normalize(vec3(-.4, .8, .5))), 0.0);
          vInk = step(0.0, facing.z) * step(light * .72, seed);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(trace, 1.0);
          gl_PointSize = (1.0 + seed * .65) * pixelRatio;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vVisible;
        varying float vInk;
        void main() {
          if (vVisible < .1 || vInk < .5 || distance(gl_PointCoord, vec2(.5)) > .48) discard;
          gl_FragColor = vec4(vec3(0.0), 1.0);
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
        const next = Math.acos(1 - 2 * THREE.MathUtils.clamp((field.value - low) / (high - low), 0, 1))
        phase = phase > Math.PI ? Math.PI * 2 - next : next
      } else target = field.value
    },
    setPixelRatio(value: number) { pixelRatio.value = value },
    advance(delta: number, reducedMotion: boolean) {
      const step = Math.min(Math.max(delta, 0), .05)
      if (reducedMotion && playing) { playing = false; target = field.value }
      if (playing) {
        // Accumulate visible playback time, so returning to the tab never skips ahead.
        phase = (phase + step * Math.PI * 2 / cycle) % (Math.PI * 2)
        time.value += step
        target = low + (high - low) * (.5 - .5 * Math.cos(phase))
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
