/** A reconstructed image as an organic casting assembled from latent fragments. */
export function buildAiVenture(api) {
  const { THREE, TAU, mesh, joint, structure, lathe, ring, rod, animate, vec } = api
  const model = structure('ai-venture', 'Latent bloom', 'Five torqued metal petals unfold around a faceted seed. Each fragment has a continuous curved face, a folded return and a real bearing; the fragments resolve from a compact latent form into one organic image.', 9.8, [.22, -.43, -.055])
  const root = model.root
  const ease = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * t * (t * (t * 6 - 15) + 10) }
  const opening = q => ease(.07, .40, q) * (1 - ease(.62, .96, q))
  const fragmentOpening = (q, index) => ease(.07 + index * .035, .40 + index * .027, q) * (1 - ease(.64 + index * .009, .94, q))

  // The elongated foot and curved stem are one structural gesture beneath the bloom.
  const foot = lathe(root, 'elliptical-cast-foot', [[0, -.085], [.38, -.085], [.50, -.055], [.54, -.010], [.535, .032], [.49, .070], [.31, .080], [0, .080]], 'pewter', [0, -1.43, -.05], [0, 0, 0], 56)
  foot.scale.set(1.40, 1, .65)
  const stemPath = new THREE.CatmullRomCurve3([vec(0, -1.35, -.10), vec(-.10, -1.08, -.15), vec(-.10, -.70, -.17), vec(0, -.35, -.10), vec(0, -.13, 0)])
  mesh(root, 'swept-bloom-stem', new THREE.TubeGeometry(stemPath, 36, .078, 12), 'silver')
  ring(root, 'seed-seat-casting', .255, .09, .15, 'pewter', [0, -.04, -.045], [0, 0, 0], true, 64)

  // A closed swept volume: the front and folded back share rounded edge returns.
  function petalGeometry(index) {
    const rows = 34, columns = 32, positions = [], indices = []
    const length = 1.12 + (index % 2) * .10
    for (let j = 0; j <= rows; j++) {
      const t = j / rows, bell = Math.sin(Math.PI * t), width = .018 + .395 * bell ** .76
      for (let i = 0; i <= columns; i++) {
        const angle = i / columns * TAU, across = Math.sin(angle), face = Math.cos(angle)
        const x = width * across + .055 * Math.sin(Math.PI * t) * Math.sin(index * 1.7)
        const y = .145 + length * t
        const twist = .085 * across * t + .03 * Math.sin(t * Math.PI * 2)
        const cup = .41 * bell - .14 * t + .19 * across * across * bell
        const rib = .028 * Math.exp(-((across / .17) ** 2)) * bell
        const recess = -.012 * Math.exp(-(((Math.abs(across) - .58) / .11) ** 2)) * bell
        const z = cup + twist + face * (.039 + .024 * bell + rib + recess)
        positions.push(x, y, z)
      }
    }
    const stride = columns + 1
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const a = j * stride + i, b = a + 1, c = a + stride, d = c + 1
      indices.push(a, c, d, a, d, b)
    }
    // Small rounded ends, not coincident poles or zero-area triangles.
    for (const [j, reverse] of [[0, false], [rows, true]]) {
      const center = positions.length / 3
      const t = j / rows
      positions.push(.055 * Math.sin(Math.PI * t) * Math.sin(index * 1.7), .145 + length * t, -.14 * t)
      for (let i = 0; i < columns; i++) indices.push(...(reverse ? [center, j * stride + i, j * stride + i + 1] : [center, j * stride + i + 1, j * stride + i]))
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices)
    geometry.computeVertexNormals(); return geometry
  }

  for (let i = 0; i < 5; i++) {
    const angle = i * TAU / 5 + .09, bearing = [.135 * Math.sin(angle), -.04 + .135 * Math.cos(angle), .025]
    const azimuth = joint(root, 'petal-azimuth-' + i, bearing, [0, 0, -angle])
    const petal = joint(azimuth, 'latent-fragment-' + i, [0, 0, 0], [.92 + i * .028, 0, 0])
    mesh(petal, 'torqued-petal-volume-' + i, petalGeometry(i), i === 2 ? 'pewter' : 'silver')
    ring(azimuth, 'petal-trunnion-' + i, .053, .042, .21, 'pewter', [0, .06, .045], [0, Math.PI / 2, 0], false, 24)
    rod(petal, 'integral-petal-neck-' + i, [0, .005, .015], [0, .20, .018], .052, 'silver', 16)
    animate(model, petal, [1, 0, 0], q => -.62 * fragmentOpening(q, i))
  }

  const seed = joint(root, 'latent-image-seed', [0, -.04, .11], [.08, -.12, 0])
  const core = mesh(seed, 'faceted-image-seed', new THREE.IcosahedronGeometry(.245, 0), 'pearl')
  core.scale.set(.94, 1.12, .87)
  ring(seed, 'seed-equatorial-cut', .212, .032, .05, 'graphite', [0, 0, 0], [Math.PI / 2, 0, 0], false, 48)
  animate(model, seed, [0, 1, 0], q => .34 * opening(q))
  return model
}
