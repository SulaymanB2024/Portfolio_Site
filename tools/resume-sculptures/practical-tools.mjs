/** Familiar physical tools; model details reinforce recognition at page size. */
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'

const smooth = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}
function adjustment(q) {
  if (q < .12 || q > .90) return 0
  if (q < .38) return smooth((q - .12) / .26)
  if (q < .62) return 1
  return 1 - smooth((q - .62) / .28)
}

/** One thick, softly beveled grille rib wraps around an elliptical capsule. */
function grilleRib(api, radiusX, radiusZ, y, weight = 1) {
  const { THREE, TAU } = api
  const section = [[-.016, -.027], [.015, -.027], [.025, -.015], [.025, .015], [.015, .027], [-.016, .027], [-.025, .015], [-.025, -.015]]
  const steps = 40, positions = [], indices = [], count = section.length
  for (let i = 0; i < steps; i++) {
    const angle = i / steps * TAU
    for (const [radial, vertical] of section) positions.push((radiusX + radial * weight) * Math.sin(angle), y + vertical * weight, (radiusZ + radial * weight) * Math.cos(angle))
  }
  for (let i = 0; i < steps; i++) for (let j = 0; j < count; j++) {
    const a = i * count + j, b = ((i + 1) % steps) * count + j, c = ((i + 1) % steps) * count + (j + 1) % count, d = i * count + (j + 1) % count
    indices.push(a, b, c, a, c, d)
  }
  const source = new THREE.BufferGeometry()
  source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
  const rib = toCreasedNormals(source, Math.PI / 3); source.dispose(); return rib
}

/** Shallow flutes provide a real thumb grip without attached ornamental ribs. */
function adjustmentKnob(api, parent, name, position, rotation) {
  const { THREE, mesh } = api
  const profile = [[0, -.054], [.068, -.054], [.090, -.043], [.104, -.025], [.104, .019], [.089, .040], [.064, .051], [0, .051]]
  const source = new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), 48)
  const positions = source.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i), y = positions.getY(i), radius = Math.hypot(x, z)
    if (radius < .0001) continue
    const band = smooth((y + .043) / .018) * (1 - smooth((y - .019) / .021))
    const flute = .0055 * band * (.5 + .5 * Math.cos(12 * Math.atan2(x, z)))
    positions.setXYZ(i, x * (radius - flute) / radius, y, z * (radius - flute) / radius)
  }
  source.computeVertexNormals()
  const geometry = toCreasedNormals(source, Math.PI / 4); source.dispose()
  return mesh(parent, name, geometry, 'pewter', position, rotation)
}

export function buildChegg(api) {
  const { THREE, TAU, mesh, joint, extrusion, rounded, rod, lathe, animate, structure } = api
  const model = structure('chegg', 'Interview microphone', 'A desk microphone has contoured grille ribs, pewter end caps and softly cast yoke arms. Fluted adjustment knobs and seated bearings carry a gentle held head adjustment, referring directly to adaptive interview practice.', 9.0, [.045, -.25, -.015])
  const root = model.root

  // A normal compact microphone stand: low weighted disk and a short pole.
  lathe(root, 'desk-microphone-weighted-base', [[0, -.06], [.39, -.06], [.455, -.045], [.48, -.012], [.48, .010], [.473, .021], [.471, .030], [.448, .057], [.38, .067], [0, .067]], 'pewter', [0, -.96, 0], [0, 0, 0], 48)
  lathe(root, 'microphone-base-rubber-foot', [[0, -.012], [.405, -.012], [.423, -.004], [.423, .008], [0, .008]], 'graphite', [0, -1.025, 0], [0, 0, 0], 32)
  rod(root, 'desk-stand-column', [0, -.897, 0], [0, -.391, 0], .052, 'silver', 24)
  lathe(root, 'stand-threaded-socket', [[0, -.05], [.071, -.05], [.084, -.035], [.084, -.015], [.078, -.010], [.078, -.004], [.084, .001], [.084, .038], [.066, .052], [0, .052]], 'pewter', [0, -.85, 0], [0, 0, 0], 32)
  lathe(root, 'yoke-stand-collar', [[0, -.045], [.068, -.045], [.079, -.026], [.079, .026], [.062, .043], [0, .043]], 'silver', [0, -.395, 0], [0, 0, 0], 28)

  const yoke = new THREE.Shape()
  yoke.moveTo(-.555, .51); yoke.lineTo(-.555, -.085)
  yoke.quadraticCurveTo(-.555, -.395, -.22, -.395); yoke.lineTo(.22, -.395)
  yoke.quadraticCurveTo(.555, -.395, .555, -.085); yoke.lineTo(.555, .51)
  yoke.quadraticCurveTo(.555, .580, .490, .580); yoke.quadraticCurveTo(.425, .580, .425, .51); yoke.lineTo(.425, -.075)
  yoke.quadraticCurveTo(.425, -.258, .22, -.258); yoke.lineTo(-.22, -.258)
  yoke.quadraticCurveTo(-.425, -.258, -.425, -.075); yoke.lineTo(-.425, .51)
  yoke.quadraticCurveTo(-.425, .580, -.490, .580); yoke.quadraticCurveTo(-.555, .580, -.555, .51); yoke.closePath()
  mesh(root, 'solid-microphone-U-yoke', extrusion(yoke, .155, .026, 12), 'silver')

  // The head rotates around the actual side bearing axis, without moving its stand.
  const head = joint(root, 'interview-microphone-head', [0, .43, 0], [-.075, 0, 0])
  const core = mesh(head, 'recessed-acoustic-grille-interior', new THREE.CapsuleGeometry(.344, .57, 4, 24), 'graphite')
  core.scale.set(1, .955, .71)
  for (const sign of [-1, 1]) {
    const cap = mesh(head, sign > 0 ? 'rounded-upper-grille-cap' : 'rounded-lower-grille-cap', new THREE.SphereGeometry(.379, 40, 8, 0, TAU, 0, Math.PI / 2), 'pewter', [0, sign * .338, 0], sign > 0 ? [0, 0, 0] : [Math.PI, 0, 0])
    cap.scale.set(1, .715, .73)
    rounded(head, 'grille-side-spine-' + sign, [.074, .69, .13], 'silver', [sign * .368, 0, 0], [0, 0, 0], .030, .010)
    lathe(head, 'capsule-bearing-boss-' + sign, [[0, -.020], [.064, -.020], [.075, -.010], [.075, .012], [.064, .024], [0, .024]], 'pewter', [sign * .386, 0, 0], [0, 0, sign * Math.PI / 2], 28)
    rod(root, 'microphone-side-bearing-shaft-' + sign, [sign * .355, .43, 0], [sign * .62, .43, 0], .054, 'graphite', 24)
    lathe(root, 'seated-yoke-bearing-washer-' + sign, [[0, -.010], [.075, -.010], [.086, -.005], [.086, .005], [.075, .010], [0, .010]], 'graphite', [sign * .572, .43, 0], [0, 0, sign * Math.PI / 2], 28)
    adjustmentKnob(api, root, 'fluted-side-adjustment-knob-' + sign, [sign * .608, .43, 0], [0, 0, sign * Math.PI / 2])
    mesh(head, 'end-cap-assembly-seam-' + sign, grilleRib(api, .371, .269, sign * .336, .38), 'silver')
  }
  for (const [i, y] of [-.304, -.214, -.127, -.041, .041, .127, .214, .304].entries()) {
    const taper = (Math.abs(y) / .304) ** 2
    mesh(head, 'contoured-grille-rib-' + i, grilleRib(api, .372 - .011 * taper, .273 - .004 * taper, y, 1 - .18 * taper), 'silver')
  }
  rounded(head, 'central-front-grille-spine', [.057, .71, .052], 'silver', [0, 0, .295], [0, 0, 0], .025, .008)
  rounded(head, 'rear-case-seam-spine', [.047, .71, .045], 'pewter', [0, 0, -.290], [0, 0, 0], .019, .007)

  animate(model, head, [1, 0, 0], q => .170 * adjustment(q))
  return model
}

/** Small conventional terminal lettering, modeled with a few flat solid strokes. */
const terminalGlyphs = {
  A: [[[0, 0], [.30, 1], [.60, 0]], [[.12, .38], [.48, .38]]],
  T: [[[0, 1], [.60, 1]], [[.30, 1], [.30, 0]]],
  L: [[[0, 1], [0, 0], [.60, 0]]],
  S: [[[.60, .92], [.45, 1], [.10, 1], [0, .82], [.08, .58], [.51, .43], [.60, .22], [.48, 0], [.10, 0], [0, .08]]],
  O: [[[.12, 0], [0, .17], [0, .82], [.12, 1], [.48, 1], [.60, .82], [.60, .17], [.48, 0], [.12, 0]]],
  U: [[[0, 1], [0, .15], [.13, 0], [.47, 0], [.60, .15], [.60, 1]]],
  R: [[[0, 0], [0, 1], [.45, 1], [.60, .84], [.60, .64], [.45, .51], [0, .51]], [[.27, .51], [.60, 0]]],
  C: [[[.60, .85], [.45, 1], [.12, 1], [0, .82], [0, .17], [.12, 0], [.45, 0], [.60, .15]]],
  E: [[[.60, 1], [0, 1], [0, 0], [.60, 0]], [[0, .51], [.49, .51]]],
  F: [[[0, 0], [0, 1], [.60, 1]], [[0, .53], [.49, .53]]],
  I: [[[.08, 1], [.52, 1]], [[.30, 1], [.30, 0]], [[.08, 0], [.52, 0]]],
  N: [[[0, 0], [0, 1], [.60, 0], [.60, 1]]],
  D: [[[0, 0], [0, 1], [.37, 1], [.60, .80], [.60, .20], [.37, 0], [0, 0]]],
  G: [[[.60, .85], [.45, 1], [.12, 1], [0, .82], [0, .17], [.12, 0], [.45, 0], [.60, .16], [.60, .47], [.36, .47]]],
  V: [[[0, 1], [.30, 0], [.60, 1]]],
  '>': [[[0, .85], [.40, .50], [0, .15]]],
}

function terminalWord(api, parent, text, x, y, height, finish, z = .047) {
  const { THREE, mesh } = api
  const thickness = height * .11, depth = .0025
  for (let i = 0; i < text.length; i++) {
    const glyph = terminalGlyphs[text[i]]
    if (!glyph) throw new Error('Unknown terminal glyph: ' + text[i])
    for (let p = 0; p < glyph.length; p++) for (let j = 1; j < glyph[p].length; j++) {
      const a = glyph[p][j - 1], b = glyph[p][j]
      const ax = x + i * height * .84 + a[0] * height, ay = y + a[1] * height
      const bx = x + i * height * .84 + b[0] * height, by = y + b[1] * height
      const length = Math.hypot(bx - ax, by - ay)
      mesh(parent, 'terminal-' + text + '-' + i + '-' + p + '-' + j, new THREE.BoxGeometry(length + thickness * .25, thickness, depth), finish, [(ax + bx) / 2, (ay + by) / 2, z], [0, 0, Math.atan2(by - ay, bx - ax)])
    }
  }
}

function reviewSelection(q) {
  if (q < .215) return 0
  if (q < .31) return -.16 * smooth((q - .215) / .095)
  if (q < .475) return -.16
  if (q < .57) return -.16 - .16 * smooth((q - .475) / .095)
  if (q < .78) return -.32
  if (q < .915) return -.32 * (1 - smooth((q - .78) / .135))
  return 0
}
function reviewKey(q) {
  let depression = 0
  for (const start of [.18, .44]) {
    const t = q - start
    if (t > 0 && t < .018) depression += smooth(t / .018)
    else if (t >= .018 && t < .034) depression += 1
    else if (t >= .034 && t < .065) depression += 1 - smooth((t - .034) / .031)
  }
  return -.014 * depression
}
function reviewScreen(q) {
  if (q < .07 || q > .94) return 0
  if (q < .18) return smooth((q - .07) / .11)
  if (q < .80) return 1
  return 1 - smooth((q - .80) / .14)
}

export function buildVoid(api) {
  const { THREE, mesh, joint, roundedShape, extrusion, rounded, rod, animate, translate, structure } = api
  const screenFinish = api.finishes.ink ? 'ink' : 'graphite'
  const textFinish = api.finishes.paper ? 'paper' : 'pearl'
  const model = structure('void', 'Atlas laptop', 'An open laptop shows a quiet Atlas evidence-review sequence. Two real Enter-key presses move one terminal selection from source to finding to evidence. The tapered case, inset connector, keyboard and segmented barrel hinge retain the proportions of a conventional laptop.', 9.4, [.25, -.31, -.025])
  const root = model.root

  const base = extrusion(roundedShape(1.85, 1.13, .065), .070, .011, 5, 2)
  const positions = base.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    // Keep the deck level while thinning the underside toward the front edge.
    if (positions.getZ(i) < 0) {
      const back = Math.max(0, Math.min(1, (positions.getY(i) + .565) / 1.13))
      positions.setZ(i, positions.getZ(i) * (.62 + .38 * back))
    }
  }
  base.computeVertexNormals()
  const taperedCase = toCreasedNormals(base, Math.PI / 4); base.dispose()
  mesh(root, 'thin-tapered-laptop-case', taperedCase, 'silver', [0, -.405, 0], [-Math.PI / 2, 0, 0])

  // A shallow USB-C bushing has a real open lip and a seated contact tongue.
  const port = roundedShape(.168, .036, .012)
  port.holes.push(roundedShape(.134, .018, .007))
  mesh(root, 'inset-USB-C-port-lip', extrusion(port, .018, .001, 4, 1), 'pewter', [.936, -.401, -.066], [0, Math.PI / 2, 0])
  rounded(root, 'dark-USB-C-port-well', [.133, .017, .001], screenFinish, [.938, -.401, -.066], [0, Math.PI / 2, 0], .006, .0005, 3, 1)
  mesh(root, 'USB-C-contact-tongue', new THREE.BoxGeometry(.002, .003, .101), 'silver', [.942, -.401, -.066])
  rounded(root, 'keyboard-recess', [1.56, .62, .009], screenFinish, [0, -.359, -.055], [-Math.PI / 2, 0, 0], .040, .003, 3, 1)

  const key = (name, x, z, width = .095, depth = .076) => mesh(root, name, new THREE.BoxGeometry(width, .012, depth), 'graphite', [x, -.346, z])
  for (let row = 0; row < 4; row++) {
    const stagger = row === 0 ? 0 : row === 1 ? .010 : row === 2 ? .025 : .040
    for (let column = 0; column < 13; column++) {
      if (row === 2 && column === 12) continue
      key('keyboard-row-' + row + '-key-' + column, -.699 + column * .112 + stagger, -.304 + row * .112)
    }
  }
  const enter = joint(root, 'Atlas-review-Enter-key', [.670, -.344, -.080])
  rounded(enter, 'review-Enter-keycap', [.120, .076, .014], 'graphite', [0, 0, 0], [-Math.PI / 2, 0, 0], .008, .0015, 2, 1)
  mesh(enter, 'Enter-return-arrow-shaft', new THREE.BoxGeometry(.034, .002, .004), textFinish, [-.006, .010, .008])
  mesh(enter, 'Enter-return-arrow-stem', new THREE.BoxGeometry(.004, .002, .023), textFinish, [.009, .010, -.002])
  for (const sign of [-1, 1]) mesh(enter, 'Enter-return-arrow-head-' + sign, new THREE.BoxGeometry(.011, .002, .0035), textFinish, [-.020, .010, .008 + sign * .0035], [0, sign * Math.PI / 4, 0])
  translate(model, enter, [0, 1, 0], reviewKey)
  for (const [i, x] of [-.665, -.54, -.41, .41, .535, .66].entries()) key('keyboard-modifier-' + i, x, .147, .105, .078)
  key('keyboard-spacebar', 0, .147, .575, .078)
  rounded(root, 'trackpad-recess-outline', [.535, .250, .004], 'graphite', [0, -.361, .405], [-Math.PI / 2, 0, 0], .035, .001, 3, 1)
  rounded(root, 'inset-trackpad', [.506, .220, .004], 'silver', [0, -.356, .405], [-Math.PI / 2, 0, 0], .031, .001, 3, 1)

  // The barrel is fixed to the base; all lid geometry belongs to its moving hinge.
  const lid = joint(root, 'Atlas-laptop-screen-hinge', [0, -.372, -.515], [-.22, 0, 0])
  for (const sign of [-1, 1]) {
    rod(root, 'fixed-outer-hinge-knuckle-' + sign, [sign * .710, -.372, -.515], [sign * .624, -.372, -.515], .036, 'silver', 24)
    rod(root, 'fixed-inner-hinge-knuckle-' + sign, [sign * .476, -.372, -.515], [sign * .400, -.372, -.515], .036, 'silver', 24)
    rod(lid, 'rotating-screen-hinge-knuckle-' + sign, [sign * .622, 0, 0], [sign * .478, 0, 0], .034, 'pewter', 24)
    rod(root, 'dark-hinge-bearing-shaft-' + sign, [sign * .704, -.372, -.515], [sign * .406, -.372, -.515], .027, 'graphite', 20)
  }
  rounded(lid, 'laptop-screen-back-case', [1.81, 1.115, .060], 'pewter', [0, .576, -.004], [0, 0, 0], .050, .008, 5, 2)
  rounded(lid, 'screen-bezel', [1.714, 1.007, .011], 'graphite', [0, .585, .030], [0, 0, 0], .034, .003, 4, 1)
  rounded(lid, 'dark-Atlas-terminal-screen', [1.568, .861, .006], screenFinish, [0, .612, .041], [0, 0, 0], .017, .0015, 3, 1)
  mesh(lid, 'screen-webcam', new THREE.CylinderGeometry(.014, .014, .003, 12), screenFinish, [0, 1.067, .040], [Math.PI / 2, 0, 0])

  terminalWord(api, lid, 'ATLAS', -.672, .900, .074, textFinish)
  for (const [i, word] of ['SOURCE', 'FINDING', 'EVIDENCE'].entries()) {
    const y = .718 - i * .160
    terminalWord(api, lid, word, -.583, y, .062, textFinish)
  }
  // The single selection is part of the inset display, not a floating graphic.
  const selection = joint(lid, 'Atlas-evidence-review-cursor', [0, .718, 0])
  terminalWord(api, selection, '>', -.670, 0, .066, textFinish)
  translate(model, selection, [0, 1, 0], reviewSelection)
  animate(model, lid, [1, 0, 0], q => -.070 * reviewScreen(q))
  return model
}
