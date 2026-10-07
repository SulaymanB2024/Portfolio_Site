import { cabinetGeometry, gesture, castTube, screw } from './cabinet-geometry.mjs'

function incisedStroke(api, parent, name, a, b, width, z, finish = 'porcelain') {
  const { THREE, mesh } = api, dx = b[0] - a[0], dy = b[1] - a[1]
  mesh(parent, name, new THREE.BoxGeometry(Math.hypot(dx, dy), width, .003), finish, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z], [0, 0, Math.atan2(dy, dx)])
}

function romanNumeral(api, parent, value, center, height = .122) {
  const letters = {
    I: [[[.4, 0], [.4, 1]], [[.13, 0], [.67, 0]], [[.13, 1], [.67, 1]]],
    V: [[[0, 1], [.4, 0], [.8, 1]]],
    X: [[[0, 0], [.8, 1]], [[0, 1], [.8, 0]]],
  }
  const advance = height * .63
  for (const [i, letter] of [...value].entries()) for (const [j, points] of letters[letter].entries()) {
    const at = p => [center[0] - value.length * advance / 2 + i * advance + p[0] * height * .62, center[1] + (p[1] - .5) * height]
    for (let k = 1; k < points.length; k++) incisedStroke(api, parent, 'dial-' + value + '-' + i + '-' + j + '-' + k, at(points[k - 1]), at(points[k]), .011, .185)
  }
}

function spadeHand(api, parent, name, length, z, rotation) {
  const { THREE, mesh, extrusion } = api, shape = new THREE.Shape()
  shape.moveTo(-.016, -.083); shape.quadraticCurveTo(-.032, -.074, -.031, -.038)
  shape.lineTo(-.020, length * .53)
  shape.bezierCurveTo(-.061, length * .65, -.041, length * .81, 0, length)
  shape.bezierCurveTo(.041, length * .81, .061, length * .65, .020, length * .53)
  shape.lineTo(.031, -.038); shape.quadraticCurveTo(.032, -.074, .016, -.083); shape.closePath()
  return mesh(parent, name, extrusion(shape, .015, .005, 9, 2), 'silver', [0, 0, z], [0, 0, rotation])
}

export function buildInternship(source) {
  const api = cabinetGeometry(source)
  const { THREE, structure, mesh, joint, lathe, ring, rod, animate, translate, TAU } = api
  const model = structure('internship-deadlines', 'Pocket timekeeper', 'A pewter pocket timepiece with an engraved steel dial, fitted silver bezel, seated spade hands and a true suspension bow. The setting crown draws out, adjusts the minute hand by a small amount, pauses, and settles back.', 9.6, [.045, -.34, -.025])
  const root = model.root
  const bodyProfile = [[0, -.219], [.55, -.219], [.710, -.204], [.794, -.146], [.823, -.065], [.828, .046], [.803, .124], [.752, .179], [.679, .192], [.649, .151], [.647, -.135], [.57, -.162], [0, -.162]]
  lathe(root, 'rounded-pewter-pocket-case', bodyProfile, 'pewter', [0, 0, 0], [Math.PI / 2, 0, 0], 80)
  ring(root, 'fitted-silver-dial-bezel', .716, .094, .045, 'silver', [0, 0, .183], [0, 0, 0], false, 80)
  ring(root, 'dark-dial-recess-return', .660, .029, .025, 'ink', [0, 0, .172], [0, 0, 0], false, 64)
  mesh(root, 'engraved-steel-clock-face', new THREE.CylinderGeometry(.649, .649, .045, 80), 'steel', [0, 0, .161], [Math.PI / 2, 0, 0])
  romanNumeral(api, root, 'XII', [0, .493])
  romanNumeral(api, root, 'III', [.486, 0], .113)
  romanNumeral(api, root, 'VI', [0, -.487], .116)
  romanNumeral(api, root, 'IX', [-.484, 0], .113)
  for (let i = 0; i < 12; i++) {
    if (i % 3 === 0) continue
    const angle = i / 12 * TAU
    mesh(root, 'incised-hour-index-' + i, new THREE.BoxGeometry(.012, .048, .003), 'porcelain', [.557 * Math.sin(angle), .557 * Math.cos(angle), .185], [0, 0, -angle])
  }
  // Both hands are raised metal seated on one through-spindle, never on the dial.
  spadeHand(api, root, 'fixed-hour-spade-hand', .372, .205, .959)
  const minute = joint(root, 'minute-hand-setting-spindle', [0, 0, .229], [0, 0, -1.047])
  spadeHand(api, minute, 'long-minute-spade-hand', .550, 0, 0)
  rod(root, 'through-clock-hand-spindle', [0, 0, .170], [0, 0, .265], .031, 'steel', 20)
  mesh(root, 'fitted-hand-spindle-cap', new THREE.SphereGeometry(.058, 20, 12), 'pewter', [0, 0, .259])
  ring(root, 'case-back-return-seam', .738, .017, .018, 'steel', [0, 0, -.178], [0, 0, 0], false, 64)

  lathe(root, 'crown-neck-casting', [[0, -.045], [.078, -.045], [.072, .018], [.052, .070], [0, .070]], 'pewter', [0, .804, 0], [0, 0, 0], 40)
  const crown = joint(root, 'fluted-setting-crown', [0, .919, .005])
  const crownProfile = [[0, -.052], [.063, -.052], [.079, -.035], [.085, .018], [.075, .050], [.037, .070], [0, .073]]
  const crownGeometry = new THREE.LatheGeometry(crownProfile.map(p => new THREE.Vector2(...p)), 64)
  const crownPositions = crownGeometry.getAttribute('position')
  for (let i = 0; i < crownPositions.count; i++) {
    const x = crownPositions.getX(i), z = crownPositions.getZ(i), radius = Math.hypot(x, z)
    if (radius > .058) {
      const angle = Math.atan2(z, x), fluting = 1 + .038 * Math.cos(angle * 16)
      crownPositions.setXYZ(i, x * fluting, crownPositions.getY(i), z * fluting)
    }
  }
  crownGeometry.computeVertexNormals()
  mesh(crown, 'sculpted-fluted-crown-grip', crownGeometry, 'steel')
  castTube(api, root, 'continuous-pocket-suspension-bow', [[-.132, .859, -.062], [-.223, 1.038, -.053], [-.191, 1.216, -.049], [0, 1.289, -.045], [.191, 1.216, -.049], [.223, 1.038, -.053], [.132, .859, -.062]], .039, 'pewter', 44, 10)
  for (const sign of [-1, 1]) rod(root, 'bow-case-seat-' + sign, [sign * .135, .817, -.062], [sign * .135, .894, -.062], .049, 'pewter', 18)
  translate(model, crown, [0, 1, 0], q => .028 * gesture(q, .11, .23, .79, .93))
  animate(model, crown, [0, 1, 0], q => -.36 * gesture(q, .23, .44, .64, .83))
  animate(model, minute, [0, 0, 1], q => -.14 * gesture(q, .24, .45, .64, .84))
  return model
}

function clipHalfPlane(points, axis, boundary, greater) {
  const output = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length]
    const insideA = greater ? a[axis] >= boundary : a[axis] <= boundary
    const insideB = greater ? b[axis] >= boundary : b[axis] <= boundary
    if (insideA) output.push(a)
    if (insideA !== insideB) {
      const t = (boundary - a[axis]) / (b[axis] - a[axis])
      output.push(a.map((v, j) => j === axis ? boundary : v + t * (b[j] - v)))
    }
  }
  return output
}

/** Original doorway, figure and cast-shadow motif, composed as contact crops. */
function contactCrop(api, parent, name, center, view) {
  const { THREE, mesh, extrusion } = api, width = .433, height = .525
  mesh(parent, name + '-engraved-contact-border', new THREE.BoxGeometry(.461, .553, .002), 'ink', [center[0], center[1], .064])
  mesh(parent, name + '-contact-ground', new THREE.BoxGeometry(width, height, .002), 'porcelain', [center[0], center[1], .067])
  const add = (label, source) => {
    let points = source.map(([x, y]) => [center[0] + (x - view.x) * width / view.width, center[1] + (y - view.y) * height / view.height])
    points = clipHalfPlane(clipHalfPlane(points, 0, center[0] - width / 2, true), 0, center[0] + width / 2, false)
    points = clipHalfPlane(clipHalfPlane(points, 1, center[1] - height / 2, true), 1, center[1] + height / 2, false)
    if (points.length < 3) return
    const area = Math.abs(points.reduce((sum, p, i) => { const b = points[(i + 1) % points.length]; return sum + p[0] * b[1] - b[0] * p[1] }, 0)) / 2
    if (area < .000016) return
    mesh(parent, name + '-' + label, extrusion(new THREE.Shape(points.map(p => new THREE.Vector2(...p))), .002, 0, 1, 1), 'ink', [0, 0, .070])
  }
  const stroke = (label, a, b, thickness) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy)
    const x = -dy / length * thickness / 2, y = dx / length * thickness / 2
    add(label, [[a[0] + x, a[1] + y], [b[0] + x, b[1] + y], [b[0] - x, b[1] - y], [a[0] - x, a[1] - y]])
  }
  stroke('left-door-jamb', [-.69, -.447], [-.69, .175], .034)
  stroke('right-door-jamb', [-.07, -.447], [-.07, .175], .034)
  for (let i = 0; i < 17; i++) {
    const a = Math.PI - i / 17 * Math.PI, b = Math.PI - (i + 1) / 17 * Math.PI
    stroke('door-arch-' + i, [-.38 + .31 * Math.cos(a), .175 + .31 * Math.sin(a)], [-.38 + .31 * Math.cos(b), .175 + .31 * Math.sin(b)], .034)
  }
  stroke('floor-line', [-1.1, -.449], [1.1, -.449], .017)
  add('cast-diagonal-shadow', [[-.64, -.452], [.17, -.458], [.66, -.557], [.13, -.554]])
  add('figure-coat-legs', [[.129, .156], [.242, .164], [.314, -.103], [.276, -.160], [.269, -.447], [.204, -.447], [.190, -.163], [.157, -.444], [.098, -.440], [.116, -.126], [.110, .033]])
  add('figure-arm', [[.123, .138], [.155, .070], [.047, -.025], [-.026, -.055], [-.038, -.026], [.058, .030]])
  add('figure-neck', [[.174, .155], [.211, .155], [.211, .200], [.174, .200]])
  add('figure-head', Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return [.191 + .063 * Math.cos(a), .254 + .075 * Math.sin(a)] }))
}

export function buildCreative(source) {
  const api = cabinetGeometry(source)
  const { THREE, structure, mesh, joint, rounded, ring, lathe, extrusion, solidSheet, vec, animate } = api
  const model = structure('creative-trace', 'Editor’s loupe and contact folio', 'A shallow pewter print folio holds three engraved source crops of the same doorway and figure. A substantial handled metal loupe stays seated on the close crop and makes a quiet inspection sweep around its resting grip.', 9.4, [.52, -.24, -.038])
  const root = model.root
  const traySample = (u, v) => {
    const x = (u - .5) * 1.80, y = (v - .5) * 1.235
    return vec(x, y, -.021 + .032 * ((x / .90) ** 4 + (y / .618) ** 4))
  }
  mesh(root, 'shallow-curved-cast-print-tray', solidSheet(traySample, 24, 16, .047), 'pewter')
  const rim = new THREE.Shape()
  rim.moveTo(-.835, -.640); rim.lineTo(.835, -.640); rim.quadraticCurveTo(.933, -.640, .933, -.537)
  rim.lineTo(.933, .537); rim.quadraticCurveTo(.933, .640, .835, .640); rim.lineTo(-.835, .640)
  rim.quadraticCurveTo(-.933, .640, -.933, .537); rim.lineTo(-.933, -.537); rim.quadraticCurveTo(-.933, -.640, -.835, -.640)
  const aperture = new THREE.Path()
  aperture.moveTo(-.807, -.563); aperture.quadraticCurveTo(-.854, -.563, -.854, -.510)
  aperture.lineTo(-.854, .510); aperture.quadraticCurveTo(-.854, .563, -.807, .563)
  aperture.lineTo(.807, .563); aperture.quadraticCurveTo(.854, .563, .854, .510)
  aperture.lineTo(.854, -.510); aperture.quadraticCurveTo(.854, -.563, .807, -.563); aperture.closePath(); rim.holes.push(aperture)
  mesh(root, 'rounded-cast-folio-return-lip', extrusion(rim, .095, .018, 8, 3), 'pewter', [0, 0, .016])
  rounded(root, 'held-contact-sheet', [1.628, 1.038, .014], 'porcelain', [0, .016, .047], [0, 0, 0], .018, .003)
  contactCrop(api, root, 'source-wide-contact', [-.504, .063], { x: -.085, y: -.035, width: 1.235, height: 1.50 })
  contactCrop(api, root, 'source-medium-contact', [0, .063], { x: .16, y: .035, width: .735, height: .89 })
  contactCrop(api, root, 'source-close-contact', [.504, .063], { x: .185, y: .205, width: .405, height: .49 })
  // Actual paper clips, integrated with the rim, retain the sheet at two corners.
  for (const side of [-1, 1]) {
    castTube(api, root, 'contact-folio-retaining-clip-' + side, [[side * .730, .588, .046], [side * .748, .523, .083], [side * .702, .452, .087], [side * .650, .426, .074]], .016, 'silver', 18, 8)
    screw(api, root, 'contact-clip-seat-' + side, [side * .730, .577, .068], .023, 'steel')
  }

  const loupe = joint(root, 'seated-editor-loupe-inspection', [.717, -.572, .151])
  const lensCenter = [-.277, .654, 0]
  const collar = [[.222, -.074], [.268, -.074], [.307, -.045], [.320, .010], [.316, .089], [.287, .134], [.236, .143], [.221, .121], [.209, .054], [.209, -.030], [.222, -.074]]
  lathe(loupe, 'deep-sculpted-loupe-barrel', collar, 'pewter', lensCenter, [Math.PI / 2, 0, 0], 72)
  ring(loupe, 'fitted-loupe-optical-lip', .251, .051, .028, 'silver', [lensCenter[0], lensCenter[1], .142], [0, 0, 0], false, 64)
  ring(loupe, 'loupe-lower-print-contact-seat', .251, .044, .028, 'steel', [lensCenter[0], lensCenter[1], -.068], [0, 0, 0], false, 56)
  castTube(api, loupe, 'curved-loupe-hand-grip', [[-.125, .389, .004], [-.055, .247, -.001], [.018, .104, -.033], [0, 0, -.054]], .046, 'pewter', 30, 12)
  mesh(loupe, 'closed-rounded-loupe-grip-end', new THREE.SphereGeometry(.047, 18, 12), 'pewter', [0, 0, -.054])
  ring(loupe, 'loupe-handle-neck-band', .051, .022, .027, 'silver', [-.106, .351, .003], [.35, -.12, -.48], false, 24)
  animate(model, loupe, [0, 0, 1], q => .095 * gesture(q, .17, .41, .63, .90))
  return model
}
