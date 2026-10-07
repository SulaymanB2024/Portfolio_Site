import { cabinetGeometry } from './cabinet-geometry.mjs'

/** A literal weighing instrument for the financial judgments made at TVL. */
export function buildVenture(source) {
  const api = cabinetGeometry(source)
  const { THREE, structure, mesh, joint, lathe, ring, rod, extrusion, animate } = api
  const model = structure('venture-labs', 'Merchant’s balance', 'Two shallow metal pans hang from a cast balance beam above a fluted pedestal. The beam gently weighs both sides and settles at equilibrium; the suspended pans remain upright. An instrument for comparing the economics of a young business.', 9.8, [.10, -.24, -.025])
  const root = model.root
  lathe(root, 'profiled-oval-balance-foot', [[0, 0], [.56, 0], [.61, .038], [.60, .074], [.53, .102], [.49, .132], [.18, .132], [.17, .18], [0, .18]], 'pewter', [0, -1.02, 0], [0, 0, 0], 56).scale.z = .72
  lathe(root, 'moulded-balance-column', [[0, 0], [.155, 0], [.162, .04], [.147, .09], [.10, .12], [.075, .25], [.067, 1.25], [.10, 1.31], [.116, 1.35], [.107, 1.40], [.072, 1.43], [0, 1.43]], 'silver', [0, -.86, 0], [0, 0, 0], 48)
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2
    rod(root, 'column-flute-' + i, [.067 * Math.cos(a), -.48, .067 * Math.sin(a)], [.062 * Math.cos(a), .26, .062 * Math.sin(a)], .005, 'steel', 5)
  }
  const pivot = [0, .72, 0]
  // The fork straddles the moving beam. Its shoulders carry the real axle.
  for (const z of [-.083, .083]) {
    const fork = new THREE.Shape()
    fork.moveTo(-.075, .005); fork.bezierCurveTo(-.12, .0, -.11, -.16, -.062, -.23)
    fork.lineTo(.062, -.23); fork.bezierCurveTo(.11, -.16, .12, 0, .075, .005)
    fork.absarc(0, .005, .075, 0, Math.PI, false)
    const bore = new THREE.Path(); bore.absarc(0, 0, .027, 0, Math.PI * 2, true); fork.holes.push(bore)
    mesh(root, 'cast-knife-bearing-fork-' + z, extrusion(fork, .042, .010, 10, 2), 'pewter', [0, pivot[1], z])
  }
  rod(root, 'balance-axle', [0, pivot[1], -.13], [0, pivot[1], .13], .025, 'steel', 20)
  ring(root, 'front-bearing-washer', .042, .022, .018, 'silver', [0, pivot[1], .129], [0, 0, 0], false, 28)
  const beam = joint(root, 'balance-beam-knife-edge', pivot)
  const shape = new THREE.Shape()
  shape.moveTo(-1.025, -.035)
  shape.bezierCurveTo(-1.10, .075, -.96, .15, -.84, .13)
  shape.bezierCurveTo(-.54, .06, -.26, .09, -.14, .17)
  shape.quadraticCurveTo(0, .27, .14, .17)
  shape.bezierCurveTo(.26, .09, .54, .06, .84, .13)
  shape.bezierCurveTo(.96, .15, 1.10, .075, 1.025, -.035)
  shape.bezierCurveTo(.65, -.005, .34, -.075, .13, -.09)
  shape.quadraticCurveTo(0, -.14, -.13, -.09)
  shape.bezierCurveTo(-.34, -.075, -.65, -.005, -1.025, -.035); shape.closePath()
  mesh(beam, 'continuous-cast-balance-beam', extrusion(shape, .072, .010, 12, 2), 'pewter')
  // A few seated incisions follow the shoulder of the casting.
  for (const sign of [-1, 1]) for (let i = 0; i < 3; i++) {
    const x = sign * (.23 + i * .15)
    rod(beam, 'beam-shoulder-cut-' + sign + '-' + i, [x, .018, .047], [x + sign * .062, .04, .047], .006, 'steel', 6)
  }
  const motion = q => .060 * Math.sin(Math.PI * 2 * q) ** 3
  animate(model, beam, [0, 0, 1], motion)
  for (const sign of [-1, 1]) {
    const pan = joint(beam, 'upright-suspended-pan-' + sign, [sign * .954, .06, 0])
    ring(pan, 'suspension-eye-' + sign, .042, .015, .035, 'steel', [0, -.038, 0], [0, 0, 0], false, 24)
    // Three slender rods are each seated on a real rim attachment.
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * Math.PI * 2 + Math.PI / 6
      rod(pan, 'pan-suspension-' + sign + '-' + i, [0, -.065, 0], [.285 * Math.cos(a), -.71, .285 * Math.sin(a)], .009, 'steel', 8)
    }
    lathe(pan, 'shallow-weighing-pan-' + sign, [[0, 0], [.09, .008], [.19, .040], [.29, .102], [.314, .116], [.318, .105], [.301, .084], [.19, .024], [.09, -.011], [0, -.014]], 'pewter', [0, -.815, 0], [0, 0, 0], 48)
    ring(pan, 'rolled-pan-lip-' + sign, .312, .018, .018, 'silver', [0, -.709, 0], [Math.PI / 2, 0, 0], false, 48)
    // One calibrated weight per side keeps the economic comparison legible.
    lathe(pan, 'calibrated-pan-weight-' + sign, [[0, 0], [.08, 0], [.089, .016], [.086, .09], [.055, .105], [.037, .12], [.037, .158], [.05, .17], [.043, .195], [0, .198]], 'silver', [0, -.811, 0], [0, 0, 0], 32)
    animate(model, pan, [0, 0, 1], q => -motion(q))
  }
  return model
}
