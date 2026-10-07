import * as THREE from 'three'

/** Two reusable flat meshes; no geometry allocation for successive search updates. */
export function createChessSearchArrow(geometries: Set<THREE.BufferGeometry>, materials: Set<THREE.Material>) {
  const group = new THREE.Group()
  group.name = 'stockfish-candidate'
  group.visible = false
  const ink = { value: 2 }, motion = { value: 1 }
  let age = .65, pulseKey = ''
  const layers = [
    { material: new THREE.MeshBasicMaterial({ color: 0xf4f0e6, side: THREE.DoubleSide }), width: 1.5, lift: .024 },
    { material: new THREE.MeshBasicMaterial({ color: 0x28271f, side: THREE.DoubleSide }), width: 1, lift: .028 },
  ].map(layer => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(45), 3))
    geometry.setAttribute('searchAlong', new THREE.BufferAttribute(new Float32Array(15), 1))
    geometry.setIndex([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])
    layer.material.transparent = true
    layer.material.forceSinglePass = true
    layer.material.depthWrite = false
    layer.material.onBeforeCompile = shader => {
      shader.uniforms.searchPulse = ink
      shader.uniforms.searchMotion = motion
      shader.vertexShader = `attribute float searchAlong;\nvarying float vSearchAlong;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSearchAlong = searchAlong;')
      shader.fragmentShader = `uniform float searchPulse;\nuniform float searchMotion;\nvarying float vSearchAlong;\n${shader.fragmentShader}`.replace('#include <color_fragment>', '#include <color_fragment>\nfloat searchInk = exp(-pow((vSearchAlong - searchPulse) / 0.22, 2.0));\ndiffuseColor.a *= mix(1.0, 0.62 + 0.38 * searchInk, searchMotion);')
    }
    layer.material.customProgramCacheKey = () => 'stockfish-candidate-ink-v1'
    geometries.add(geometry); materials.add(layer.material)
    const mesh = new THREE.Mesh(geometry, layer.material)
    mesh.name = 'search-arrow'; mesh.frustumCulled = false
    mesh.raycast = () => {} // Analysis annotations never intercept a board pick.
    group.add(mesh)
    return { ...layer, geometry }
  })
  let previous = ''
  function update(candidate: {from:string;to:string;depth?:number} | null | undefined, tiles: Map<string,THREE.Vector3>) {
    const from = candidate && tiles.get(candidate.from), to = candidate && tiles.get(candidate.to)
    group.visible = !!from && !!to && !from.equals(to)
    if (!group.visible || !from || !to) { previous = ''; pulseKey = ''; age = .65; ink.value = 2; return }
    const key = `${candidate!.from}${candidate!.to}`
    const iteration = `${key}:${candidate!.depth ?? ''}`
    if (iteration !== pulseKey) { pulseKey = iteration; age = 0; ink.value = -.25 }
    if (key === previous) return
    previous = key
    const dx = to.x - from.x, dz = to.z - from.z, distance = Math.hypot(dx,dz)
    const ux = dx / distance, uz = dz / distance
    const cell = tiles.get('a1')?.distanceTo(tiles.get('b1') ?? from) || distance
    const start = cell * .14, end = distance - cell * .12, neck = end - cell * .32
    for (const layer of layers) {
      const half = cell * .065 * layer.width, head = cell * .21 * layer.width
      const outline = [[start,-half],[neck,-half],[neck,-head],[end,0],[neck,head],[neck,half],[start,half]]
      const positions = layer.geometry.getAttribute('position') as THREE.BufferAttribute
      const alongAttribute = layer.geometry.getAttribute('searchAlong') as THREE.BufferAttribute
      let vertex = 0
      // Fan triangulation of the arrow's simple concave outline uses the neck center.
      for (const triangle of [[0,1,5],[0,5,6],[2,3,4],[1,2,5],[2,4,5]]) for (const index of triangle) {
        const [along, across] = outline[index]
        positions.setXYZ(vertex++, from.x + ux * along - uz * across, Math.max(from.y,to.y) + layer.lift, from.z + uz * along + ux * across)
        alongAttribute.setX(vertex - 1, (along - start) / (end - start))
      }
      positions.needsUpdate = true
      alongAttribute.needsUpdate = true
    }
  }
  /** A finite ink pass marks an actual candidate/depth update, without a new draw. */
  function tick(dt: number, reduced: boolean) {
    motion.value = reduced ? 0 : 1
    if (!group.visible || reduced) { age = .65; ink.value = 2; return false }
    age = Math.min(.65, age + Math.max(0, dt))
    ink.value = age === .65 ? 2 : -.25 + age / .65 * 1.5
    return age < .65
  }
  return { group, update, tick }
}
