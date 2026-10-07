/** Familiar planning and creative tools, modeled without external font assets. */

const smooth = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}
const lift = q => q < .16 ? 0 : q < .40 ? smooth((q - .16) / .24) : q < .62 ? 1 : q < .91 ? 1 - smooth((q - .62) / .29) : 0

function digitShape(THREE, digit) {
  const shape = new THREE.Shape()
  if (digit === '0') {
    shape.absellipse(0, 0, .242, .410, 0, Math.PI * 2, false)
    const hole = new THREE.Path()
    hole.absellipse(0, 0, .132, .297, 0, Math.PI * 2, true)
    shape.holes.push(hole)
  } else if (digit === '3') {
    shape.moveTo(-.237, .316)
    shape.bezierCurveTo(-.118, .473, .234, .467, .245, .218)
    shape.bezierCurveTo(.252, .070, .161, .006, .076, -.017)
    shape.bezierCurveTo(.194, -.045, .252, -.132, .243, -.252)
    shape.bezierCurveTo(.225, -.477, -.099, -.472, -.239, -.337)
    shape.lineTo(-.179, -.245)
    shape.bezierCurveTo(-.083, -.359, .119, -.360, .131, -.238)
    shape.bezierCurveTo(.143, -.106, .007, -.065, -.135, -.066)
    shape.lineTo(-.135, .031)
    shape.bezierCurveTo(.009, .028, .135, .087, .132, .211)
    shape.bezierCurveTo(.128, .345, -.088, .347, -.178, .242)
    shape.closePath()
  } else if (digit === '1') {
    shape.moveTo(-.165, .253); shape.lineTo(.018, .413); shape.lineTo(.129, .413)
    shape.lineTo(.129, -.294); shape.lineTo(.256, -.294); shape.lineTo(.256, -.410)
    shape.lineTo(-.13, -.410); shape.lineTo(-.13, -.294); shape.lineTo(.015, -.294)
    shape.lineTo(.015, .244); shape.lineTo(-.105, .142); shape.closePath()
  }
  return shape
}

function dateInk(api, parent, date, z) {
  const { THREE, mesh, extrusion } = api
  for (const [i, digit] of [...date].entries()) {
    mesh(parent, 'printed-date-' + digit + '-' + i, extrusion(digitShape(THREE, digit), .006, .0012, 11, 1), 'ink', [(i - .5) * .60, -.885, z])
  }
  // October is spelled with modeled type, so the large number reads as a date.
  const o = new THREE.Shape(); o.absellipse(0, 0, .055, .075, 0, Math.PI * 2, false)
  const inner = new THREE.Path(); inner.absellipse(0, 0, .029, .047, 0, Math.PI * 2, true); o.holes.push(inner)
  mesh(parent, 'printed-month-o', extrusion(o, .004, .0008, 9, 1), 'ink', [-.166, -.270, z])
  const c = new THREE.Shape()
  c.moveTo(.052, .048); c.bezierCurveTo(-.002, .103, -.070, .065, -.070, -.002)
  c.bezierCurveTo(-.070, -.080, -.002, -.102, .053, -.052); c.lineTo(.034, -.030)
  c.bezierCurveTo(-.004, -.061, -.041, -.042, -.041, -.002)
  c.bezierCurveTo(-.041, .045, -.002, .062, .034, .026); c.closePath()
  mesh(parent, 'printed-month-c', extrusion(c, .004, .0008, 9, 1), 'ink', [0, -.267, z])
  mesh(parent, 'printed-month-t-bar', new THREE.BoxGeometry(.127, .027, .004), 'ink', [.169, -.21, z])
  mesh(parent, 'printed-month-t-stem', new THREE.BoxGeometry(.027, .126, .004), 'ink', [.169, -.274, z])
  mesh(parent, 'calendar-month-rule', new THREE.BoxGeometry(1.215, .014, .004), 'ink', [0, -.417, z])
}

export function buildInternship(api) {
  const { THREE, structure, mesh, joint, extrusion, pierced, animate } = api
  const model = structure('internship-deadlines', 'Flip desk calendar', 'A familiar October desk calendar on a folded A-frame, with twin wire bindings and numbered paper leaves. The front leaf lifts on its actual top binding to preview the next date, pauses, and returns.', 9.2, [.055, -.30, -.012])
  const root = model.root

  // A single folded cardstock tent: two inclined faces, a base and open sides.
  const tent = new THREE.Shape()
  tent.moveTo(-.495, -.920); tent.lineTo(.752, -.920); tent.lineTo(.10, .855); tent.closePath()
  const inside = new THREE.Path()
  inside.moveTo(-.404, -.854); inside.lineTo(.102, .702); inside.lineTo(.656, -.854); inside.closePath()
  tent.holes.push(inside)
  const tentGeometry = extrusion(tent, 1.67, .012, 4, 2)
  tentGeometry.rotateY(Math.PI / 2)
  mesh(root, 'folded-a-frame-calendar-support', tentGeometry, 'pewter')

  const binding = [0, .845, -.10], rest = [-.315, 0, 0]
  const holes = [[-.455, .775, .085, .074, .023], [.455, .775, .085, .074, .023]]
  // Separate leaves make the page stack visible at the lower and side edges.
  const stack = joint(root, 'stationary-calendar-leaves', binding, rest)
  for (let i = 0; i < 4; i++) {
    pierced(stack, 'paper-stack-leaf-' + i, [1.51 + i * .007, 1.67 + i * .006, .009], holes, 'sheet', [0, -.855, -.010 + i * .013], [0, 0, 0], .014, .0015)
  }
  dateInk(api, stack, '31', .039)
  // A single boxed date is the planning cue; the other leaf stays unmarked.
  const deadline = new THREE.Shape()
  deadline.moveTo(-.478, -.474); deadline.lineTo(.478, -.474)
  deadline.quadraticCurveTo(.633, -.474, .633, -.319); deadline.lineTo(.633, .319)
  deadline.quadraticCurveTo(.633, .474, .478, .474); deadline.lineTo(-.478, .474)
  deadline.quadraticCurveTo(-.633, .474, -.633, .319); deadline.lineTo(-.633, -.319)
  deadline.quadraticCurveTo(-.633, -.474, -.478, -.474)
  const deadlineInside = new THREE.Path()
  deadlineInside.moveTo(-.478, -.455); deadlineInside.quadraticCurveTo(-.614, -.455, -.614, -.319)
  deadlineInside.lineTo(-.614, .319); deadlineInside.quadraticCurveTo(-.614, .455, -.478, .455)
  deadlineInside.lineTo(.478, .455); deadlineInside.quadraticCurveTo(.614, .455, .614, .319)
  deadlineInside.lineTo(.614, -.319); deadlineInside.quadraticCurveTo(.614, -.455, .478, -.455); deadlineInside.closePath()
  deadline.holes.push(deadlineInside)
  mesh(stack, 'next-leaf-deadline-annotation', extrusion(deadline, .003, 0, 8, 1), 'ink', [0, -.905, .038])

  for (const x of [-.455, .455]) {
    mesh(root, 'wire-calendar-binding-' + x, new THREE.TorusGeometry(.103, .020, 12, 52), 'silver', [x, binding[1], binding[2]], [0, Math.PI / 2, 0])
  }

  const page = joint(root, 'calendar-page-top-binding', binding, rest)
  pierced(page, 'current-date-paper-leaf', [1.525, 1.69, .012], holes, 'sheet', [0, -.865, .070], [0, 0, 0], .017, .002)
  dateInk(api, page, '30', .081)
  // The sheet stays on the circular bindings as it lifts; no floating content.
  animate(model, page, [1, 0, 0], q => -.83 * lift(q))
  return model
}

/** Only the small set of readable slate labels is needed; all strokes are solid. */
const slateLetters = {
  S: [[[.8, 1], [0, 1], [0, .5], [.8, .5], [.8, 0], [0, 0]]],
  C: [[[.8, 1], [0, 1], [0, 0], [.8, 0]]],
  E: [[[.8, 1], [0, 1], [0, 0], [.8, 0]], [[0, .5], [.67, .5]]],
  N: [[[0, 0], [0, 1], [.8, 0], [.8, 1]]],
  T: [[[0, 1], [.8, 1]], [[.4, 1], [.4, 0]]],
  A: [[[0, 0], [.4, 1], [.8, 0]], [[.17, .42], [.63, .42]]],
  K: [[[0, 0], [0, 1]], [[.8, 1], [0, .45], [.8, 0]]],
}

function slateLabel(api, parent, word, origin, height = .12) {
  const { THREE, mesh } = api, stroke = height * .16
  for (const [i, letter] of [...word].entries()) for (const [j, points] of slateLetters[letter].entries()) {
    for (let k = 1; k < points.length; k++) {
      const a = points[k - 1], b = points[k]
      const dx = (b[0] - a[0]) * height, dy = (b[1] - a[1]) * height
      mesh(parent, 'slate-' + word + '-' + i + '-' + j + '-' + k, new THREE.BoxGeometry(Math.hypot(dx, dy) + stroke * .12, stroke, .005), 'paper', [origin[0] + i * height * 1.11 + (a[0] + b[0]) * height / 2, origin[1] + (a[1] + b[1]) * height / 2, origin[2]], [0, 0, Math.atan2(dy, dx)])
    }
  }
}

/** Clip the diagonal paint to the real edges of the clap bar. */
function stripePolygon(points, x, retainLeft) {
  const output = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length]
    const keepA = retainLeft ? a[0] >= x : a[0] <= x
    const keepB = retainLeft ? b[0] >= x : b[0] <= x
    if (keepA) output.push(a)
    if (keepA !== keepB) {
      const t = (x - a[0]) / (b[0] - a[0])
      output.push([x, a[1] + t * (b[1] - a[1])])
    }
  }
  return output
}

function clapStripes(api, parent, name, width, height, center, depth) {
  const { THREE, mesh, extrusion } = api
  for (let i = -1; i < 6; i++) {
    const x = -width / 2 + i * .37
    let polygon = [[x, -height / 2], [x + .19, -height / 2], [x + .19 + height, height / 2], [x + height, height / 2]]
    polygon = stripePolygon(stripePolygon(polygon, -width / 2 + .016, true), width / 2 - .016, false)
    if (polygon.length < 3) continue
    const shape = new THREE.Shape(polygon.map(p => new THREE.Vector2(...p)))
    mesh(parent, name + '-diagonal-' + i, extrusion(shape, .004, 0, 1, 1), 'paper', [center[0], center[1], center[2] + depth / 2 + .003])
  }
}

/** Three crops of one composed scene, drawn as original contact-sheet artwork. */
function storyboardFrame(api, parent, name, center, view) {
  const { THREE, mesh, extrusion } = api, width = .421, height = .265
  mesh(parent, name + '-film-border', new THREE.BoxGeometry(.463, .309, .002), 'ink', [center[0], center[1], .024])
  mesh(parent, name + '-image-ground', new THREE.BoxGeometry(width, height, .002), 'sheet', [center[0], center[1], .027])
  const add = (label, source) => {
    let points = source.map(([x, y]) => [center[0] + (x - view.x) * width / view.width, center[1] + (y - view.y) * height / view.height])
    points = stripePolygon(stripePolygon(points, center[0] - width / 2, true), center[0] + width / 2, false)
    points = stripePolygon(stripePolygon(points.map(([x, y]) => [y, x]), center[1] - height / 2, true), center[1] + height / 2, false).map(([y, x]) => [x, y])
    if (points.length < 3) return
    const area = Math.abs(points.reduce((sum, p, i) => {
      const b = points[(i + 1) % points.length]
      return sum + p[0] * b[1] - b[0] * p[1]
    }, 0)) / 2
    if (area < .000015) return
    const shape = new THREE.Shape(points.map(point => new THREE.Vector2(...point)))
    mesh(parent, name + '-' + label, extrusion(shape, .003, 0, 1, 1), 'ink', [0, 0, .030])
  }
  const stroke = (label, a, b, thickness = .026) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy)
    const nx = -dy / length * thickness / 2, ny = dx / length * thickness / 2
    add(label, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]])
  }
  // Doorway, floor and cast light establish the same spatial scene in each crop.
  stroke('door-left-jamb', [-.69, -.445], [-.69, .175], .040)
  stroke('door-right-jamb', [-.07, -.445], [-.07, .175], .040)
  for (let i = 0; i < 15; i++) {
    const a = Math.PI - i / 15 * Math.PI, b = Math.PI - (i + 1) / 15 * Math.PI
    stroke('arched-door-' + i, [-.38 + .31 * Math.cos(a), .175 + .31 * Math.sin(a)], [-.38 + .31 * Math.cos(b), .175 + .31 * Math.sin(b)], .040)
  }
  stroke('floor-line', [-1.1, -.449], [1.1, -.449], .020)
  add('diagonal-cast-shadow', [[-.64, -.452], [.17, -.458], [.66, -.557], [.13, -.554]])
  add('standing-figure-coat-and-legs', [[.129, .156], [.242, .164], [.314, -.103], [.276, -.160], [.269, -.447], [.204, -.447], [.190, -.163], [.157, -.444], [.098, -.440], [.116, -.126], [.110, .033]])
  add('figure-arm', [[.123, .138], [.155, .070], [.047, -.025], [-.026, -.055], [-.038, -.026], [.058, .030]])
  add('figure-neck', [[.174, .155], [.211, .155], [.211, .200], [.174, .200]])
  const head = Array.from({ length: 20 }, (_, i) => {
    const a = i / 20 * Math.PI * 2
    return [.191 + .063 * Math.cos(a), .254 + .075 * Math.sin(a)]
  })
  add('figure-head', head)
}

export function buildCreative(api) {
  const { THREE, structure, mesh, joint, rounded, ring, rod, extrusion, animate, translate } = api
  const model = structure('creative-trace', 'Director’s source slate', 'A familiar director’s slate reveals a captured storyboard strip. Three authored crops follow the same figure and arched doorway from wide scene to medium framing to close portrait. The clap opens, the strip emerges in its guides, both hold for comparison, and the slate closes and stows the strip.', 10.2, [.055, -.27, -.012])
  const root = model.root
  // A thin face and back enclose a real cassette cavity rather than a solid block.
  rounded(root, 'matte-directors-slate-face', [1.90, 1.17, .024], 'ink', [0, -.115, .074], [0, 0, 0], .034, .006)
  rounded(root, 'slate-rear-panel', [1.88, 1.15, .024], 'ink', [0, -.115, -.065], [0, 0, 0], .032, .006)
  for (const side of [-1, 1]) {
    rounded(root, 'slate-case-return-' + side, [.035, 1.13, .158], 'pewter', [side * .935, -.115, .003], [0, 0, 0], .009, .003)
    // Front, back and outer lips retain the moving strip's edges below the face.
    mesh(root, 'storyboard-guide-front-' + side, new THREE.BoxGeometry(.056, .244, .010), 'pewter', [side * .808, -.641, .042])
    mesh(root, 'storyboard-guide-back-' + side, new THREE.BoxGeometry(.056, .244, .010), 'pewter', [side * .808, -.641, -.015])
    mesh(root, 'storyboard-guide-return-' + side, new THREE.BoxGeometry(.012, .244, .064), 'pewter', [side * .833, -.641, .013])
  }
  mesh(root, 'cassette-mouth-front-lip', new THREE.BoxGeometry(1.735, .027, .028), 'ink', [0, -.688, .074])
  mesh(root, 'cassette-mouth-back-lip', new THREE.BoxGeometry(1.735, .027, .028), 'ink', [0, -.688, -.065])
  rounded(root, 'fixed-striped-clap-rail', [1.89, .145, .156], 'ink', [0, .504, 0], [0, 0, 0], .025, .009)
  clapStripes(api, root, 'fixed-rail', 1.87, .128, [0, .504, 0], .174)
  slateLabel(api, root, 'SCENE', [-.756, .248, .099], .112)
  slateLabel(api, root, 'TAKE', [.335, .248, .099], .112)
  mesh(root, 'slate-scene-take-rule', new THREE.BoxGeometry(1.635, .014, .005), 'paper', [0, .148, .099])
  mesh(root, 'slate-field-divider', new THREE.BoxGeometry(.013, .49, .005), 'paper', [.218, -.098, .099])
  // Sparse, genuine slate fields: scene 01 and take 1, without filler prose.
  for (const [i, digit] of ['0', '1'].entries()) {
    const geometry = extrusion(digitShape(THREE, digit), .005, .0008, 9, 1)
    geometry.scale(.48, .48, 1)
    mesh(root, 'slate-scene-number-' + digit, geometry, 'paper', [-.490 + i * .330, -.087, .099])
  }
  const take = extrusion(digitShape(THREE, '1'), .005, .0008, 9, 1); take.scale(.48, .48, 1)
  mesh(root, 'slate-take-number-one', take, 'paper', [.530, -.087, .099])
  mesh(root, 'slate-lower-writing-rule', new THREE.BoxGeometry(1.635, .013, .005), 'paper', [0, -.343, .099])

  const strip = joint(root, 'source-storyboard-sliding-cassette', [0, -.455, .005])
  rounded(strip, 'three-frame-contact-strip', [1.624, .536, .023], 'sheet', [0, 0, 0], [0, 0, 0], .017, .004)
  rounded(strip, 'storyboard-thumb-tab', [.256, .045, .035], 'pewter', [0, -.265, -.002], [0, 0, 0], .017, .004)
  storyboardFrame(api, strip, 'source-wide-scene', [-.516, -.057], { x: -.1, y: 0, width: 1.725, height: 1.15 })
  storyboardFrame(api, strip, 'source-medium-scene', [0, -.057], { x: .160, y: .05, width: .990, height: .660 })
  storyboardFrame(api, strip, 'source-close-scene', [.516, -.057], { x: .191, y: .245, width: .495, height: .330 })

  const hinge = [-.842, .701, 0]
  rod(root, 'clap-bar-through-hinge-pin', [hinge[0], hinge[1], -.118], [hinge[0], hinge[1], .132], .034, 'silver', 20)
  ring(root, 'clap-bar-front-hinge-washer', .041, .036, .025, 'pewter', [hinge[0], hinge[1], .129], [0, 0, 0], false, 24)
  rounded(root, 'slate-hinge-support-cheek', [.148, .250, .028], 'pewter', [-.842, .610, -.101], [0, 0, 0], .034, .007)
  ring(root, 'clap-bar-rear-hinge-washer', .041, .031, .022, 'pewter', [hinge[0], hinge[1], -.116], [0, 0, 0], false, 24)
  const clap = joint(root, 'striped-clap-bar-left-hinge', hinge)
  rounded(clap, 'moving-striped-clap-bar', [1.89, .205, .170], 'ink', [.813, 0, 0], [0, 0, 0], .026, .009)
  clapStripes(api, clap, 'moving-clap', 1.866, .186, [.813, 0, 0], .188)
  animate(model, clap, [0, 0, 1], q => .265 * (q < .12 ? 0 : q < .31 ? smooth((q - .12) / .19) : q < .64 ? 1 : q < .83 ? 1 - smooth((q - .64) / .19) : 0))
  translate(model, strip, [0, -1, 0], q => .410 * (q < .29 ? 0 : q < .47 ? smooth((q - .29) / .18) : q < .76 ? 1 : q < .94 ? 1 - smooth((q - .76) / .18) : 0))
  return model
}
