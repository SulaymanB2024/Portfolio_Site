/**
 * Original cast audience, perpetual calendar and optical-study sculptures.
 * Helpers arrive from the generator so this module has no cyclic imports.
 */

const eased = t => {
  const x = Math.max(0, Math.min(1, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}
const held = (q, a, b, c, d) => q < a ? 0 : q < b ? eased((q - a) / (b - a)) : q < c ? 1 : q < d ? 1 - eased((q - c) / (d - c)) : 0

function surfaceGeometry(THREE, positions, indices) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** Smooth radius interpolation gives these cast forms continuous curvature. */
function profileAt(profile, y) {
  let i = 0
  while (i < profile.length - 2 && profile[i + 1][0] < y) i++
  const a = profile[Math.max(0, i - 1)], b = profile[i], c = profile[i + 1], d = profile[Math.min(profile.length - 1, i + 2)]
  const t = (y - b[0]) / (c[0] - b[0]), h = c[0] - b[0]
  return b.slice(1).map((v, k) => {
    const n = k + 1
    const m0 = (c[n] - a[n]) / (c[0] - a[0]) * h
    const m1 = (d[n] - b[n]) / (d[0] - b[0]) * h
    return Math.max(.001, (2 * t ** 3 - 3 * t ** 2 + 1) * v + (t ** 3 - 2 * t ** 2 + t) * m0 + (-2 * t ** 3 + 3 * t ** 2) * c[n] + (t ** 3 - t ** 2) * m1)
  })
}

/** A capped, non-circular loft; unlike a lathe, its face and occiput differ. */
function organicLoft(api, profile, segments, rows, deform = (x, y, z) => [x, y, z]) {
  const { THREE, TAU } = api, positions = [], indices = [], stride = segments + 1
  const y0 = profile[0][0], y1 = profile.at(-1)[0]
  for (let j = 0; j <= rows; j++) {
    const y = y0 + (y1 - y0) * j / rows, [rx, front, back] = profileAt(profile, y)
    for (let i = 0; i <= segments; i++) {
      const a = i / segments * TAU - Math.PI, cosine = Math.cos(a)
      const x = Math.sin(a) * rx, z = cosine * (cosine >= 0 ? front : back)
      positions.push(...deform(x, y, z, a))
    }
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < segments; i++) {
    const a = j * stride + i, b = a + 1, c = a + stride, d = c + 1
    indices.push(a, b, c, b, d, c)
  }
  const bottom = positions.length / 3; positions.push(0, y0, 0)
  const top = positions.length / 3; positions.push(0, y1, 0)
  for (let i = 0; i < segments; i++) indices.push(bottom, i + 1, i, top, rows * stride + i, rows * stride + i + 1)
  return surfaceGeometry(THREE, positions, indices)
}

/** Relief is integrated into a single head casting, without attached eye dots. */
function castHead(api, character) {
  const { gaussian: g } = api
  const profile = [
    [-.455, .055, .085, .095], [-.385, .156 * character.jaw, .204, .164],
    [-.285, .224 * character.jaw, .235, .217], [-.145, .278, .239, .259],
    [.025, .293, .234, .282], [.19, .279, .240, .292],
    [.345, .267, .231, .282], [.49, .212, .185, .235],
    [.58, .085, .079, .10], [.605, .016, .016, .018],
  ]
  return organicLoft(api, profile, 48, 46, (x, y, z, theta) => {
    const face = Math.exp(-((theta / 1.05) ** 6)), ax = Math.abs(x)
    const forehead = .024 * g((y - .32) / .17)
    const brow = .031 * character.brow * g((y - .201 + .075 * ax) / .034) * g((ax - .105) / .092)
    const sockets = -.036 * g((y - .135) / .046) * g((ax - .115) / .067)
    const upperLids = .013 * g((y - .141 + .035 * ax) / .013) * g((ax - .119) / .054)
    const lowerLids = .008 * g((y - .103) / .016) * g((ax - .119) / .057)
    const bridge = .058 * character.nose * g(x / .041) * g((y - .075) / .151)
    const noseTip = .105 * character.nose * g(x / .046) * g((y + .025) / .052)
    const alae = .038 * character.nose * g((ax - .045) / .024) * g((y + .051) / .034)
    const beneathNose = -.023 * g(x / .053) * g((y + .085) / .017)
    const cheeks = .038 * character.cheek * g((ax - .167) / .075) * g((y + .069) / .107)
    const philtrum = -.012 * g(x / .014) * g((y + .122) / .032)
    const upperLip = .026 * g(x / .104) * g((y + .163 - .12 * ax) / .016)
    const lowerLip = .030 * g(x / .094) * g((y + .202) / .023)
    const mouth = -.015 * g(x / .105) * g((y + .182) / .008)
    const chin = .053 * g(x / .123) * g((y + .341) / .072)
    const jawPlane = -.014 * g((ax - .20) / .067) * g((y + .27) / .069)
    const relief = forehead + brow + sockets + upperLids + lowerLids + bridge + noseTip + alae + beneathNose + cheeks + philtrum + upperLip + lowerLip + mouth + chin + jawPlane
    return [x * character.width, y * character.height, z + face * relief]
  })
}

/** Closed ear shell, with an outer helix, concha bowl and heavier lower lobe. */
function castEar(api, sign) {
  const { THREE, TAU, gaussian: g } = api, positions = [], indices = [], segments = 20, rows = 6, stride = segments + 1
  for (let side = 0; side < 2; side++) for (let j = 0; j <= rows; j++) for (let i = 0; i <= segments; i++) {
    const r = j / rows, a = TAU * i / segments
    const y = .139 * r * Math.cos(a), z = .072 * r * Math.sin(a) + .013 * g((y + .09) / .05)
    const relief = .018 + .035 * g((r - .79) / .17) - .012 * g(r / .42)
    const x = sign * (side ? -.005 : relief)
    positions.push(x, y, z)
  }
  const layer = stride * (rows + 1)
  for (let side = 0; side < 2; side++) for (let j = 0; j < rows; j++) for (let i = 0; i < segments; i++) {
    const a = side * layer + j * stride + i, b = a + 1, c = a + stride, d = c + 1
    const forward = sign > 0 !== Boolean(side)
    indices.push(...(forward ? [a, c, b, b, c, d] : [a, b, c, b, d, c]))
  }
  for (let i = 0; i < segments; i++) {
    const a = rows * stride + i, b = a + 1, c = a + layer, d = b + layer
    indices.push(...(sign > 0 ? [a, c, b, b, c, d] : [a, b, c, b, d, c]))
  }
  return surfaceGeometry(THREE, positions, indices)
}

export function buildSapien(api) {
  const { THREE, structure, mesh, joint, extrusion, ring, animate, gaussian: g } = api
  const model = structure('sapien', 'Audience portraits', 'Three distinct cast portraits rest on a continuous crescent. Brow, cheek, nose and mouth are sculpted into each head. Their neck joints turn inward, pause in attention, and return.', 9.8, [.035, -.16, 0])
  const root = model.root
  const crescent = new THREE.Shape()
  crescent.moveTo(-1.27, -.49); crescent.bezierCurveTo(-1.06, -.82, -.61, -.99, 0, -.995)
  crescent.bezierCurveTo(.61, -.99, 1.06, -.82, 1.27, -.49)
  crescent.quadraticCurveTo(1.235, -.415, 1.125, -.45)
  crescent.bezierCurveTo(.84, -.685, .45, -.75, 0, -.76)
  crescent.bezierCurveTo(-.45, -.75, -.84, -.685, -1.125, -.45)
  crescent.quadraticCurveTo(-1.235, -.415, -1.27, -.49)
  mesh(root, 'continuous-cast-audience-crescent', extrusion(crescent, .53, .045, 18, 3), 'pewter', [0, 0, -.05])
  const characters = [
    { width: 1.02, height: .98, jaw: 1.07, nose: 1.03, brow: 1.08, cheek: .94 },
    { width: .91, height: 1.055, jaw: .86, nose: 1.07, brow: .88, cheek: 1.04 },
    { width: 1.06, height: .965, jaw: 1.05, nose: .83, brow: .98, cheek: 1.09 },
  ]
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * .80, y = i === 1 ? -.72 : -.625, z = i === 1 ? -.13 : .13
    const bust = joint(root, 'audience-bust-' + i, [x, y, z], [0, i === 0 ? .30 : i === 2 ? -.34 : 0, 0])
    const shoulders = [
      [0, .285, .143, .152], [.045, .351, .177, .169], [.16, .397, .19, .177],
      [.265, .385, .172, .158], [.345, .285, .139, .139], [.435, .155, .109, .114],
      [.52, .111, .104, .105], [.62, .10, .095, .10],
    ]
    const torso = organicLoft(api, shoulders, 36, 17, (px, py, pz, a) => {
      const front = Math.max(0, Math.cos(a))
      const clavicle = .014 * g((py - .35) / .043) * g((Math.abs(px) - .18) / .09)
      const sternum = -.012 * g(px / .052) * g((py - .26) / .15)
      return [px, py, pz + front * (clavicle + sternum)]
    })
    mesh(bust, 'sculpted-neck-shoulders-' + i, torso, 'stone')
    ring(bust, 'neck-articulation-seat-' + i, .09, .045, .046, 'pewter', [0, .562, 0], [Math.PI / 2, 0, 0], false, 28)
    const head = joint(bust, 'portrait-neck-attention-' + i, [0, .562, 0])
    mesh(head, 'anatomical-cast-portrait-' + i, castHead(api, characters[i]), 'stone', [0, .371, 0])
    for (const sign of [-1, 1]) mesh(head, 'cast-ear-' + i + '-' + sign, castEar(api, sign), 'stone', [sign * .279 * characters[i].width, .416, -.018])
    if (i === 1) animate(model, head, [0, 1, 0], q => -.13 * held(q, .12, .29, .39, .54) + .13 * held(q, .46, .65, .75, .94))
    else animate(model, head, [0, 1, 0], q => (i === 0 ? .175 : -.175) * held(q, .18 + i * .035, .43 + i * .025, .64, .925))
  }
  return model
}

/** Closed revolved profile along Z, optionally with a genuinely capped cutaway. */
function axialCasting(api, profile, segments = 80, start = 0, span = Math.PI * 2, modulation = () => 0, verticalScale = 1) {
  const { THREE, TAU } = api, positions = [], indices = [], stride = profile.length
  for (let i = 0; i <= segments; i++) {
    const a = start + span * i / segments
    for (let j = 0; j < stride; j++) {
      const [r, z] = profile[j], radius = r + modulation(a, j)
      positions.push(radius * Math.cos(a), radius * Math.sin(a) * verticalScale, z)
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < stride; j++) {
    const a = i * stride + j, b = i * stride + (j + 1) % stride, c = a + stride, d = b + stride
    indices.push(a, c, b, b, c, d)
  }
  if (span < TAU - .001) {
    const shape = new THREE.Shape(profile.map(([r, z]) => new THREE.Vector2(r, z)))
    const triangles = THREE.ShapeUtils.triangulateShape(shape.getPoints(1), [])
    for (const [a, b, c] of triangles) indices.push(a, b, c, segments * stride + c, segments * stride + b, segments * stride + a)
  }
  return surfaceGeometry(THREE, positions, indices)
}

export function buildCreative(api) {
  const { THREE, structure, mesh, joint, extrusion, ring, rod, rounded, animate, TAU } = api
  const model = structure('creative-trace', 'Optical study instrument', 'A deep cutaway optical barrel exposes six overlapping curved aperture leaves and their cam. A grooved focusing collar settles before the iris opens, pauses for inspection, and closes.', 9.6, [.10, -.57, -.115])
  const root = model.root
  const bodyProfile = [[.535, -.80], [.715, -.80], [.785, -.735], [.785, -.515], [.795, -.435], [.795, .345], [.775, .54], [.725, .59], [.666, .545], [.646, .37], [.603, -.02], [.536, -.19], [.49, -.64], [.49, -.765]]
  mesh(root, 'compound-cutaway-lens-barrel', axialCasting(api, bodyProfile, 82, 1.16, TAU - 1.03), 'pewter')
  ring(root, 'rolled-optical-front-rim', .735, .11, .085, 'silver', [0, 0, .582], [0, 0, 0], false, 80)
  ring(root, 'recessed-optical-throat', .611, .052, .42, 'graphite', [0, 0, .20], [0, 0, 0], false, 64)
  ring(root, 'rear-optical-bearing-seat', .557, .115, .08, 'silver', [0, 0, -.797], [0, 0, 0], false, 64)
  const support = new THREE.Shape()
  support.moveTo(-.785, -.335); support.bezierCurveTo(-.945, -.46, -.90, -.78, -.705, -.945)
  support.bezierCurveTo(-.47, -1.065, .04, -1.075, .31, -.995)
  support.quadraticCurveTo(.42, -.935, .355, -.858); support.lineTo(-.38, -.852)
  support.bezierCurveTo(-.59, -.825, -.695, -.61, -.652, -.49)
  support.closePath()
  mesh(root, 'asymmetric-optical-casting-foot', extrusion(support, .50, .044, 12, 3), 'silver', [0, 0, -.145])
  rod(root, 'optical-cradle-bearing', [-.875, -.405, -.18], [-.635, -.405, -.18], .105, 'pewter', 24)
  ring(root, 'cradle-bearing-cap', .079, .035, .027, 'graphite', [-.882, -.405, -.18], [0, Math.PI / 2, 0], false, 28)

  const focus = joint(root, 'grooved-focusing-collar', [0, 0, -.31])
  const focusProfile = [[.792, -.185], [.835, -.185], [.868, -.145], [.868, .135], [.84, .179], [.792, .179], [.783, .128], [.783, -.128]]
  mesh(focus, 'fluted-focus-grip', axialCasting(api, focusProfile, 108, 0, TAU, (a, j) => j === 2 || j === 3 ? .010 * Math.cos(a * 36) : 0), 'pewter')
  ring(focus, 'front-focus-collar-shoulder', .833, .058, .036, 'pewter', [0, 0, .178], [0, 0, 0], false, 64)
  // A single index fin belongs to the moving control, rather than surface decoration.
  rounded(focus, 'focus-control-index-fin', [.065, .105, .21], 'pewter', [.846, -.012, 0], [0, 0, Math.PI / 2], .019, .009)

  const cam = joint(root, 'aperture-drive-cam', [0, 0, .153])
  ring(cam, 'aperture-cam-channel', .591, .089, .067, 'pewter', [0, 0, 0], [0, 0, 0], true, 72)
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU
    rod(root, 'continuous-iris-pivot-spindle-' + i, [.588 * Math.cos(a), .588 * Math.sin(a), .135], [.588 * Math.cos(a), .588 * Math.sin(a), .412], .016, 'graphite', 12)
    rod(cam, 'cam-follower-' + i, [.545 * Math.cos(a), .545 * Math.sin(a), -.006], [.598 * Math.cos(a + .105), .598 * Math.sin(a + .105), .067], .022, 'pewter', 10)
    const blade = joint(root, 'curved-aperture-leaf-' + i, [.588 * Math.cos(a), .588 * Math.sin(a), .241 + i * .028], [0, 0, a])
    const shape = new THREE.Shape()
    shape.moveTo(.096, -.054)
    shape.bezierCurveTo(.118, .163, -.017, .408, -.214, .552)
    shape.bezierCurveTo(-.359, .516, -.499, .378, -.616, .238)
    shape.bezierCurveTo(-.589, .139, -.437, .035, -.351, .043)
    shape.bezierCurveTo(-.203, -.071, -.02, -.092, .096, -.054)
    mesh(blade, 'overlapping-sculpted-iris-leaf-' + i, extrusion(shape, .013, .006, 9, 2), 'silver')
    ring(blade, 'iris-leaf-pivot-bearing-' + i, .024, .022, .037, 'silver', [0, 0, .013], [0, 0, 0], false, 20)
    animate(model, blade, [0, 0, 1], q => -.235 * held(q, .27, .48, .67, .875))
  }
  animate(model, cam, [0, 0, 1], q => -.16 * held(q, .27, .48, .67, .875))
  animate(model, focus, [0, 0, 1], q => -.30 * held(q, .12, .34, .66, .925))
  return model
}

export function buildInternship(api) {
  const { THREE, structure, mesh, joint, extrusion, roundedShape, rounded, ring, rod, solidSheet, animate, TAU, vec } = api
  const model = structure('internship-deadlines', 'Perpetual calendar and planning folio', 'A sculpted perpetual-calendar casting holds a 31-position date ring, a recessed selector and a shared planning transmission. After the date settles, an application folio opens on its long spine bearing.', 10.4, [.065, -.34, -.012])
  const root = model.root, center = [-.395, .105, -.01]
  const bodyProfile = [[.734, -.40], [.875, -.40], [.951, -.316], [.959, -.157], [.924, .092], [.868, .216], [.782, .239], [.715, .192], [.681, .117], [.681, -.157], [.715, -.343]]
  mesh(root, 'sculpted-perpetual-calendar-housing', axialCasting(api, bodyProfile, 88, 0, TAU, () => 0, 1.055), 'silver', center)
  ring(root, 'calendar-inner-recess-lip', .685, .045, .049, 'graphite', [-.395, .105, .188], [0, 0, 0], false, 72)
  const foot = new THREE.Shape()
  foot.moveTo(-1.14, -.945); foot.quadraticCurveTo(-1.14, -1.035, -1.02, -1.065)
  foot.lineTo(1.12, -1.065); foot.quadraticCurveTo(1.26, -1.024, 1.22, -.905)
  foot.bezierCurveTo(.80, -.84, .47, -.864, .30, -.905)
  foot.bezierCurveTo(-.19, -.81, -.73, -.82, -1.14, -.945)
  mesh(root, 'cast-planning-desk-foot', extrusion(foot, .72, .036, 13, 3), 'pewter', [0, 0, -.07])

  const dateRing = joint(root, 'mechanically-indexed-date-ring', [-.395, .105, .105])
  ring(dateRing, 'machined-date-index-carrier', .607, .145, .136, 'pewter', [0, 0, 0], [0, 0, 0], true, 88)
  const dayGeometry = extrusion(roundedShape(.061, .095, .015), .032, .007, 2, 1)
  for (let i = 0; i < 31; i++) {
    const a = i / 31 * TAU
    mesh(dateRing, 'date-index-detent-' + (i + 1), dayGeometry.clone(), 'silver', [.604 * Math.sin(a), .604 * Math.cos(a), .090], [0, 0, -a])
  }
  dayGeometry.dispose()
  for (let i = 0; i < 3; i++) {
    const arm = new THREE.Shape()
    arm.moveTo(.055, -.05); arm.bezierCurveTo(.22, -.035, .42, .14, .567, .278)
    arm.lineTo(.538, .348); arm.bezierCurveTo(.39, .24, .236, .123, .032, .075); arm.closePath()
    mesh(dateRing, 'curved-date-carrier-web-' + i, extrusion(arm, .062, .012, 7, 2), 'pewter', [0, 0, -.018], [0, 0, i / 3 * TAU])
  }
  ring(dateRing, 'calendar-drive-hub', .072, .093, .136, 'pewter', [0, 0, -.013], [0, 0, 0], false, 36)
  rod(root, 'calendar-central-spindle', [-.395, .105, -.37], [-.395, .105, .35], .048, 'graphite', 20)

  const selector = joint(root, 'day-selector-pivot', [-.395, .105, .287])
  const stem = new THREE.Shape()
  stem.moveTo(-.052, -.11); stem.quadraticCurveTo(-.014, -.145, .044, -.106)
  stem.lineTo(.021, .493); stem.quadraticCurveTo(0, .544, -.023, .49); stem.closePath()
  mesh(selector, 'cast-day-selector-arm', extrusion(stem, .027, .009, 7, 2), 'graphite')
  const window = roundedShape(.172, .171, .036)
  const hole = new THREE.Path()
  hole.moveTo(-.046, -.047); hole.lineTo(-.046, .047); hole.lineTo(.046, .047); hole.lineTo(.046, -.047); hole.closePath(); window.holes.push(hole)
  mesh(selector, 'recessed-selected-day-window', extrusion(window, .032, .008, 5, 2), 'graphite', [0, .613, -.016])
  ring(selector, 'day-selector-hub-cap', .069, .055, .046, 'graphite', [0, 0, .018], [0, 0, 0], false, 32)

  // The rear folio is gently curved and returns into a spine, not a pierced slab.
  const sampleFolio = (u, v) => vec(.02 + u * .80, .075 + v * 1.13, .06 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v) - .017 * u)
  const fixedFolio = joint(root, 'stationary-application-folio', [.475, -.875, -.026], [0, -.05, 0])
  mesh(fixedFolio, 'curved-application-folio-back', solidSheet(sampleFolio, 24, 16, .075), 'pewter')
  const folio = joint(root, 'prepared-application-folio-spine', [.475, -.875, .11], [0, -.025, 0])
  mesh(folio, 'compound-curved-planning-folio', solidSheet(sampleFolio, 26, 18, .041), 'silver')
  const leafSample = (u, v) => vec(.055 + u * .701, .11 + v * 1.055, .08 + .047 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v) - .017 * u)
  mesh(folio, 'inset-application-leaf', solidSheet(leafSample, 18, 12, .018), 'pewter')
  // A turned-over upper corner makes the selected record read as a usable folio.
  const foldedCorner = new THREE.Shape()
  foldedCorner.moveTo(.655, 1.155); foldedCorner.quadraticCurveTo(.747, 1.107, .777, 1.005)
  foldedCorner.quadraticCurveTo(.674, 1.013, .646, 1.08); foldedCorner.closePath()
  mesh(folio, 'turned-application-page-corner', extrusion(foldedCorner, .021, .007, 8, 2), 'pewter', [0, 0, .113], [0, -.23, 0])
  rod(root, 'full-height-planning-spine-bearing', [.475, -.854, .11], [.475, .343, .11], .042, 'graphite', 18)
  for (const y of [-.80, .285]) ring(root, 'planning-spine-collar-' + y, .045, .032, .075, 'silver', [.475, y, .11], [Math.PI / 2, 0, 0], false, 24)

  // Date selection and folio preparation are joined by a right-angle transmission.
  rod(root, 'calendar-planning-cross-shaft', [-.66, -.572, -.035], [.479, -.572, -.035], .042, 'pewter', 20)
  ring(root, 'planning-right-angle-bearing', .09, .057, .14, 'graphite', [.474, -.573, .021], [Math.PI / 2, 0, 0], false, 28)
  const lever = joint(root, 'planning-cam-rocker', [.475, -.573, .11])
  ring(lever, 'planning-cam-follower-collar', .091, .060, .076, 'pewter', [0, 0, 0], [Math.PI / 2, 0, 0], false, 36)
  rod(lever, 'planning-cam-rocker-arm', [-.382, 0, -.105], [-.072, 0, -.005], .037, 'pewter', 14)
  ring(root, 'calendar-planning-cam-seat', .099, .068, .068, 'pewter', [-.397, -.572, -.035], [0, Math.PI / 2, 0], false, 32)
  rounded(root, 'calendar-date-setting-knob', [.16, .16, .15], 'pewter', [-1.282, -.25, -.05], [0, 0, Math.PI / 4], .054, .024)

  animate(model, dateRing, [0, 0, 1], q => TAU / 31 * 2 * held(q, .13, .34, .68, .94))
  animate(model, selector, [0, 0, 1], q => TAU / 31 * held(q, .105, .305, .68, .915))
  animate(model, lever, [0, 1, 0], q => -.17 * held(q, .30, .48, .70, .915))
  animate(model, folio, [0, 1, 0], q => -.56 * held(q, .36, .55, .72, .945))
  return model
}
