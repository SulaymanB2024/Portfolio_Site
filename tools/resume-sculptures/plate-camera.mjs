import { cabinetGeometry, castTube, gesture, screw } from './cabinet-geometry.mjs'

/** Image making as a working optical instrument in the site's metal collection. */
export function buildAiVenture(source) {
  const api = cabinetGeometry(source)
  const { THREE, structure, mesh, joint, rounded, pierced, ring, lathe, rod, extrusion, animate, translate } = api
  const model = structure('ai-venture', 'Plate camera', 'A folding plate camera carries a deep five-leaf optical diaphragm, closed accordion bellows and a glass-plate holder. The lens focuses, the aperture opens for an exposure and the shutter release depresses. Its fitted metal standards and dark folded surfaces belong to the same engraved collection as the opening helmet.', 10.4, [.13, -.36, -.025])
  const root = model.root
  // Broad standards and a low rail establish the silhouette of a plate camera.
  rounded(root, 'rear-plate-standard', [1.70, 1.63, .115], 'pewter', [0, .10, -.48], [0, 0, 0], .08, .022, 5, 2)
  pierced(root, 'rear-plate-border', [1.62, 1.55, .055], [[0, 0, 1.40, 1.33, .032]], 'silver', [0, .10, -.550], [0, 0, 0], .06, .012)
  rounded(root, 'ground-glass-plate', [1.398, 1.328, .018], 'pewter', [0, .10, -.542], [0, 0, 0], .031, .004, 4, 1)
  // Quiet crosshairs are engraved on the actual ground glass, not floating UI.
  for (const direction of [0, 1]) mesh(root, 'ground-glass-centerline-' + direction, new THREE.BoxGeometry(direction ? .006 : 1.30, direction ? 1.24 : .006, .002), 'steel', [0, .10, -.553])
  rounded(root, 'glass-plate-holder-top-grip', [.47, .080, .145], 'steel', [0, .956, -.48], [0, 0, 0], .034, .009, 4, 2)
  // A closed folded rectangular sleeve, with each fold joined at its corners.
  // The material depth comes from the actual accordion, not dots added on top.
  const folds = 12, positions = [], indices = []
  for (let k = 0; k <= folds * 2; k++) {
    const t = k / (folds * 2), ridge = k % 2 === 0 ? .048 : -.018
    const w = 1.48 - t * .29 + ridge, h = 1.37 - t * .23 + ridge, z = -.42 + t * .92
    for (const [x, y] of [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) positions.push(x, y + .10, z)
    if (k > 0) for (let side = 0; side < 4; side++) {
      const a = (k - 1) * 4 + side, b = (k - 1) * 4 + (side + 1) % 4, c = k * 4 + side, d = k * 4 + (side + 1) % 4
      indices.push(a, b, d, a, d, c)
    }
  }
  const sleeve = new THREE.BufferGeometry(); sleeve.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); sleeve.setIndex(indices)
  const folded = sleeve.toNonIndexed(); folded.computeVertexNormals(); sleeve.dispose()
  mesh(root, 'closed-accordion-camera-bellows', folded, 'steel')
  // Front and rear standards cap the sleeve; the front lens opens into a real bore.
  pierced(root, 'front-lens-standard', [1.30, 1.235, .09], [[0, .025, .586, .586, .15]], 'pewter', [0, .10, .51], [0, 0, 0], .050, .016)
  pierced(root, 'front-standard-inlaid-border', [1.23, 1.167, .025], [[0, 0, 1.095, 1.035, .026]], 'silver', [0, .10, .572], [0, 0, 0], .04, .005)
  rounded(root, 'folding-camera-bed', [1.65, .095, 1.48], 'pewter', [0, -.744, .07], [0, 0, 0], .035, .013, 4, 2)
  for (const sign of [-1, 1]) {
    rounded(root, 'parallel-focus-rail-' + sign, [.043, .051, 1.37], 'silver', [sign * .585, -.688, .08], [0, 0, 0], .013, .006, 3, 1)
    // Real curved side struts seat the front standard on the folding bed.
    castTube(api, root, 'curved-front-standard-strut-' + sign, [[sign * .73, -.70, -.02], [sign * .72, -.33, .17], [sign * .669, -.09, .42], [sign * .637, .01, .515]], .028, 'pewter', 18, 8)
    screw(api, root, 'standard-support-fixing-' + sign, [sign * .623, -.034, .575], .027)
    rod(root, 'rear-standard-foot-' + sign, [sign * .756, -.74, -.435], [sign * .756, -.523, -.435], .027, 'steel', 10)
  }
  // A cast rolled lip and optical barrel carry detail where the eye lands.
  lathe(root, 'fixed-lens-barrel', [[.310, 0], [.347, 0], [.367, .029], [.365, .058], [.315, .079], [.304, .21], [.330, .235], [.330, .282], [.304, .305], [.272, .305], [.272, 0]], 'pewter', [0, .125, .572], [Math.PI / 2, 0, 0], 64)
  const lens = joint(root, 'telescoping-camera-focus', [0, .125, .850])
  ring(lens, 'front-optical-collar', .291, .066, .077, 'silver', [0, 0, .006], [0, 0, 0], true, 64)
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * Math.PI * 2
    mesh(lens, 'optical-collar-flute-' + i, new THREE.BoxGeometry(.012, .025, .040), 'steel', [.303 * Math.cos(a), .303 * Math.sin(a), .021], [0, 0, a - Math.PI / 2])
  }
  lathe(lens, 'deep-optical-glass', [[0, 0], [.12, -.002], [.22, -.017], [.245, -.033], [.243, -.045], [0, -.045]], 'steel', [0, 0, -.021], [Math.PI / 2, 0, 0], 48)
  for (let i = 0; i < 5; i++) {
    const theta = i / 5 * Math.PI * 2, pin = .185
    const pivot = joint(lens, 'camera-aperture-leaf-' + i, [pin * Math.cos(theta), pin * Math.sin(theta), .005 + i * .0012], [0, 0, theta])
    const blade = new THREE.Shape(), point = (r, a) => [r * Math.cos(a) - pin, r * Math.sin(a)]
    blade.moveTo(...point(.238, .30))
    for (let j = 1; j <= 10; j++) blade.lineTo(...point(.238, .30 + j * 1.65 / 10))
    blade.lineTo(...point(.105, 1.80)); blade.quadraticCurveTo(...point(.085, 1.10), ...point(.105, .40)); blade.closePath()
    mesh(pivot, 'fitted-camera-diaphragm-' + i, extrusion(blade, .004, .0008, 4, 1), 'silver')
    animate(model, pivot, [0, 0, 1], q => -.48 * gesture(q, .28, .40, .48, .60))
  }
  // The rear barrel overlaps the telescoping front assembly at every pose.
  translate(model, lens, [0, 0, 1], q => .035 * gesture(q, .09, .23, .68, .88))
  ring(root, 'focus-wheel-seat', .076, .021, .032, 'steel', [.838, -.636, .29], [0, Math.PI / 2, 0], false, 28)
  const wheel = joint(root, 'camera-focusing-wheel', [.862, -.636, .29], [0, Math.PI / 2, 0])
  ring(wheel, 'cast-focusing-wheel', .073, .055, .027, 'pewter', [0, 0, 0], [0, 0, 0], true, 32)
  mesh(wheel, 'focus-wheel-inner-boss', new THREE.CylinderGeometry(.033, .033, .023, 24), 'pewter', [0, 0, 0], [Math.PI / 2, 0, 0])
  // A tiny inset witness mark makes the wheel's real rotation visible.
  mesh(wheel, 'focus-wheel-witness', new THREE.BoxGeometry(.010, .025, .003), 'pewter', [0, .065, .017])
  animate(model, wheel, [0, 0, 1], q => .32 * gesture(q, .09, .23, .68, .88))
  const release = joint(root, 'camera-shutter-release', [.442, .51, .580])
  rod(root, 'shutter-linkage', [.34, .37, .567], [.44, .50, .567], .017, 'steel', 10)
  mesh(release, 'shutter-release-cap', new THREE.CylinderGeometry(.041, .044, .032, 24), 'silver', [0, 0, 0], [Math.PI / 2, 0, 0])
  translate(model, release, [0, 0, -1], q => .019 * gesture(q, .37, .40, .43, .46))
  // Subtle case fasteners are seated in the standard, never detached particles.
  for (const x of [-.54, .54]) for (const y of [-.38, .57]) screw(api, root, 'lens-standard-screw-' + x + '-' + y, [x, y, .574], .018)
  return model
}
