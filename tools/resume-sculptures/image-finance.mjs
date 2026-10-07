/** Familiar physical tools for image generation and financial research. */
const smooth = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}
const gesture = (q, a, b, c, d) => q < a ? 0 : q < b ? smooth((q - a) / (b - a)) : q < c ? 1 : q < d ? 1 - smooth((q - c) / (d - c)) : 0

const digitSegments = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' }
function digit(api, parent, name, number, x, y, z, height, finish) {
  const w = height * .54, line = height * .07
  const segments = {
    a: [0, height / 2, w, line], b: [w / 2, height / 4, line, height * .42], c: [w / 2, -height / 4, line, height * .42],
    d: [0, -height / 2, w, line], e: [-w / 2, -height / 4, line, height * .42], f: [-w / 2, height / 4, line, height * .42], g: [0, 0, w, line],
  }
  for (const segment of digitSegments[number]) {
    const [dx, dy, width, h] = segments[segment]
    api.mesh(parent, name + '-' + segment, new api.THREE.BoxGeometry(width, h, .0025), finish, [x + dx, y + dy, z])
  }
}
const glyphs = {
  N: [[[-.5, -.5], [-.5, .5], [.5, -.5], [.5, .5]]], I: [[[0, -.5], [0, .5]]],
  P: [[[-.5, -.5], [-.5, .5], [.35, .5], [.5, .32], [.35, .06], [-.5, .06]]],
  V: [[[-.5, .5], [0, -.5], [.5, .5]]], F: [[[-.5, -.5], [-.5, .5], [.5, .5]], [[-.5, .04], [.35, .04]]],
  M: [[[-.5, -.5], [-.5, .5], [0, -.05], [.5, .5], [.5, -.5]]],
  R: [[[-.5, -.5], [-.5, .5], [.35, .5], [.5, .32], [.35, .06], [-.5, .06]], [[-.08, .06], [.5, -.5]]],
  C: [[[.5, .35], [.28, .5], [-.32, .5], [-.5, .28], [-.5, -.28], [-.32, -.5], [.28, -.5], [.5, -.35]]],
  O: [[[.28, .5], [-.28, .5], [-.5, .28], [-.5, -.28], [-.28, -.5], [.28, -.5], [.5, -.28], [.5, .28], [.28, .5]]],
  '+': [[[-.5, 0], [.5, 0]], [[0, -.5], [0, .5]]],
}
function legend(api, parent, name, text, x, y, z, finish) {
  const height = .053, advance = .043
  for (let k = 0; k < text.length; k++) for (const [pathIndex, path] of glyphs[text[k]].entries()) for (let j = 1; j < path.length; j++) {
    const [a, b] = [path[j - 1], path[j]], dx = (b[0] - a[0]) * height * .63, dy = (b[1] - a[1]) * height
    api.mesh(parent, name + '-' + k + '-' + pathIndex + '-' + j, new api.THREE.BoxGeometry(Math.hypot(dx, dy), .006, .003), finish, [x + (k - (text.length - 1) / 2) * advance + (a[0] + b[0]) * height * .315, y + (a[1] + b[1]) * height / 2, z], [0, 0, Math.atan2(dy, dx)])
  }
}

export function buildAiVenture(api) {
  const { THREE, structure, mesh, joint, rounded, pierced, ring, lathe, extrusion, rod, animate, translate } = api
  const model = structure('ai-venture', 'Instant image camera', 'A machined instant camera opens its five-leaf aperture, presses the shutter and produces a composed architectural photograph. The print advances through its slot, holds for viewing and returns for the next exposure.', 10.8, [.12, -.34, -.035])
  const root = model.root
  // Ordinary camera proportions: a broad shell, finger grip, lens, flash and finder.
  rounded(root, 'rounded-camera-shell', [2.06, 1.49, .64], 'silver', [0, .02, -.03], [0, 0, 0], .22, .06)
  rounded(root, 'rear-camera-cover-seam', [2.04, 1.47, .075], 'pewter', [0, .02, -.375], [0, 0, 0], .22, .024)
  rounded(root, 'camera-leather-face', [1.90, 1.17, .07], 'graphite', [0, -.025, .325], [0, 0, 0], .16, .025)
  rounded(root, 'right-hand-camera-grip', [.28, 1.11, .22], 'pewter', [.845, -.05, .42], [0, 0, 0], .10, .035)
  for (let i = 0; i < 5; i++) rounded(root, 'grip-recess-' + i, [.12, .018, .01], 'graphite', [.865, -.40 + i * .15, .56], [0, 0, 0], .005, .003)
  pierced(root, 'flash-metal-bezel', [.53, .28, .06], [[0, 0, .42, .17, .015]], 'silver', [-.57, .542, .365], [0, 0, 0], .035, .012)
  rounded(root, 'flash-frosted-face', [.415, .165, .025], 'silver', [-.57, .542, .362], [0, 0, 0], .018, .007)
  for (let i = 0; i < 6; i++) mesh(root, 'flash-fresnel-ridge-' + i, new THREE.BoxGeometry(.014, .14, .007), 'pewter', [-.745 + i * .07, .542, .383])
  pierced(root, 'viewfinder-bezel', [.30, .215, .085], [[0, 0, .185, .12, .016]], 'silver', [.44, .53, .40], [0, 0, 0], .04, .016)
  rounded(root, 'viewfinder-dark-glass', [.19, .12, .025], 'graphite', [.44, .53, .413], [0, 0, 0], .018, .005)
  const lensCenter = [-.29, .025, .414]
  ring(root, 'lens-mount', .425, .098, .115, 'silver', lensCenter, [0, 0, 0], true, 72)
  const focus = joint(root, 'fixed-machined-focus-collar', [-.29, .025, .495])
  ring(focus, 'focus-collar', .354, .105, .21, 'pewter', [0, 0, 0], [0, 0, 0], true, 72)
  for (let i = 0; i < 32; i++) {
    const angle = i / 32 * Math.PI * 2
    mesh(focus, 'focus-grip-rib-' + i, new THREE.BoxGeometry(.021, .032, .154), 'silver', [.369 * Math.cos(angle), .369 * Math.sin(angle), 0], [0, 0, angle - Math.PI / 2])
  }
  rounded(focus, 'focus-index', [.028, .069, .013], 'silver', [0, .34, .12], [0, 0, 0], .005, .002)
  ring(root, 'optical-front-rim', .285, .11, .05, 'silver', [-.29, .025, .673], [0, 0, 0], false, 64)
  lathe(root, 'recessed-optical-glass', [[0, 0], [.08, -.004], [.16, -.013], [.21, -.027], [.237, -.04], [.235, -.053], [0, -.053]], 'graphite', [-.29, .025, .590], [Math.PI / 2, 0, 0], 64)
  // The diaphragm really opens about five fixed pins. Each overlapping leaf
  // has a closed thickness and moves on its own joint, inside the front rim.
  for (let i = 0; i < 5; i++) {
    const theta = i / 5 * Math.PI * 2
    const pivot = joint(root, 'aperture-leaf-pin-' + i, [-.29 + .185 * Math.cos(theta), .025 + .185 * Math.sin(theta), .647 + i * .0015], [0, 0, theta])
    const blade = new THREE.Shape()
    const point = (r, a) => [r * Math.cos(a) - .185, r * Math.sin(a)]
    blade.moveTo(...point(.238, .30))
    for (let j = 1; j <= 10; j++) blade.lineTo(...point(.238, .30 + j * 1.65 / 10))
    blade.lineTo(...point(.105, 1.80))
    blade.quadraticCurveTo(...point(.085, 1.10), ...point(.105, .40))
    blade.closePath()
    mesh(pivot, 'overlapping-diaphragm-leaf-' + i, extrusion(blade, .002, 0, 4, 1), 'pewter')
    animate(model, pivot, [0, 0, 1], q => -.48 * gesture(q, .09, .23, .31, .43))
  }
  // A real output slot masks the upper portion of the moving print.
  rounded(root, 'print-output-lip', [1.34, .15, .10], 'pewter', [0, -.633, .37], [0, 0, 0], .025, .018)
  rounded(root, 'print-output-slot', [1.185, .038, .014], 'graphite', [0, -.664, .424], [0, 0, 0], .011, .004)
  const print = joint(root, 'developing-architectural-print', [0, -.55, .293])
  rounded(print, 'instant-photo-paper', [1.12, 1.16, .015], 'sheet', [0, 0, 0], [0, 0, 0], .013, .004)
  rounded(print, 'photo-image-field', [.955, .79, .004], 'ink', [0, .075, .015], [0, 0, 0], .008, .001)
  // An authored photographic composition: an arched doorway, low steps, a
  // long diagonal shadow and a figure for scale. All relief stays in the image.
  const wall = new THREE.Shape()
  wall.moveTo(-.395, -.177); wall.lineTo(.08, -.177); wall.lineTo(.08, .386); wall.lineTo(-.395, .386); wall.closePath()
  const doorway = new THREE.Path()
  doorway.moveTo(-.276, -.177); doorway.lineTo(-.276, .142)
  doorway.absarc(-.174, .142, .102, Math.PI, 0, true)
  doorway.lineTo(-.072, -.177); doorway.closePath(); wall.holes.push(doorway)
  mesh(print, 'photograph-arched-wall', extrusion(wall, .004, 0, 6, 1), 'sheet', [0, 0, .022])
  const side = new THREE.Shape([new THREE.Vector2(.08, -.177), new THREE.Vector2(.164, -.14), new THREE.Vector2(.164, .422), new THREE.Vector2(.08, .386)])
  mesh(print, 'photograph-wall-return', extrusion(side, .003, 0, 2, 1), 'pewter', [0, 0, .021])
  for (let i = 0; i < 3; i++) mesh(print, 'photograph-doorstep-' + i, new THREE.BoxGeometry(.345 + i * .056, .018, .003), 'sheet', [-.174, -.189 - i * .033, .024])
  const shadow = new THREE.Shape([new THREE.Vector2(.164, -.14), new THREE.Vector2(.426, -.287), new THREE.Vector2(.112, -.287), new THREE.Vector2(.08, -.177)])
  mesh(print, 'photograph-diagonal-shadow', extrusion(shadow, .002, 0, 1, 1), 'pewter', [0, 0, .023])
  mesh(print, 'photograph-figure-head', new THREE.CylinderGeometry(.020, .020, .003, 20), 'sheet', [.309, -.055, .025], [Math.PI / 2, 0, 0])
  const figure = new THREE.Shape([new THREE.Vector2(.294, -.080), new THREE.Vector2(.321, -.080), new THREE.Vector2(.330, -.148), new THREE.Vector2(.324, -.158), new THREE.Vector2(.334, -.230), new THREE.Vector2(.317, -.230), new THREE.Vector2(.307, -.177), new THREE.Vector2(.302, -.230), new THREE.Vector2(.286, -.230), new THREE.Vector2(.291, -.159), new THREE.Vector2(.282, -.151)])
  mesh(print, 'photograph-figure-silhouette', extrusion(figure, .003, 0, 1, 1), 'sheet', [0, 0, .025])
  const button = joint(root, 'instant-camera-shutter-button', [.68, .238, .458])
  mesh(button, 'shutter-button-cap', new THREE.CylinderGeometry(.087, .087, .049, 36), 'silver', [0, 0, 0], [Math.PI / 2, 0, 0])
  ring(root, 'shutter-button-seat', .091, .025, .042, 'pewter', [.68, .238, .435], [0, 0, 0], false, 36)
  rod(root, 'camera-strap-pin-left', [-1.043, .23, -.14], [-1.073, .23, -.14], .067, 'pewter', 20)
  rod(root, 'camera-strap-pin-right', [1.043, .23, -.14], [1.073, .23, -.14], .067, 'pewter', 20)
  translate(model, button, [0, 0, -1], q => .026 * gesture(q, .24, .27, .31, .35))
  translate(model, print, [0, -1, 0], q => .74 * gesture(q, .36, .62, .83, .98))
  return model
}

export function buildVenture(api) {
  const { THREE, structure, mesh, joint, rounded, pierced, translate } = api
  const model = structure('venture-labs', 'Financial calculator', 'A beveled financial calculator works through a simple addition: 100 plus 25 gives 125. The plus and equals keys depress in sequence and its numeric display changes with the calculation.', 10.4, [.16, -.30, -.065])
  const root = model.root
  rounded(root, 'calculator-casing', [1.44, 2.35, .235], 'pewter', [0, 0, -.035], [0, 0, 0], .13, .035)
  rounded(root, 'calculator-rear-seam', [1.405, 2.31, .08], 'graphite', [0, 0, -.185], [0, 0, 0], .12, .025)
  rounded(root, 'calculator-keyboard-inset', [1.285, 1.62, .024], 'graphite', [0, -.255, .105], [0, 0, 0], .066, .011)
  pierced(root, 'recessed-lcd-bezel', [1.285, .465, .072], [[0, 0, 1.10, .30, .012]], 'silver', [0, .765, .109], [0, 0, 0], .035, .014)
  rounded(root, 'lcd-screen', [1.112, .31, .016], 'ink', [0, .765, .118], [0, 0, 0], .016, .003)
  for (const [i, n] of [0, 0].entries()) digit(api, root, 'financial-decimal-place-' + i, n, .149 + i * .183, .765, .136, .19, 'pearl')
  mesh(root, 'decimal-point', new THREE.SphereGeometry(.014, 10, 6), 'pearl', [.076, .67, .138])
  // Standard glTF translation places inactive LCD segments behind its opaque
  // face. The visible display changes only after the corresponding key press.
  for (const [value, numbers] of [['100', [1, 0, 0]], ['25', [null, 2, 5]], ['125', [1, 2, 5]]]) {
    const display = joint(root, 'lcd-calculation-' + value, [0, 0, value === '100' ? 0 : -.06])
    for (const [i, n] of numbers.entries()) if (n !== null) digit(api, display, 'lcd-' + value + '-' + i, n, -.40 + i * .183, .765, .136, .19, 'pearl')
    if (value === '100') translate(model, display, [0, 0, -1], q => .06 * gesture(q, .205, .22, .875, .89))
    else if (value === '25') translate(model, display, [0, 0, 1], q => .06 * gesture(q, .22, .235, .425, .44))
    else translate(model, display, [0, 0, 1], q => .06 * gesture(q, .44, .455, .855, .875))
  }
  // Financial function rows above a standard ten-key cluster; casing widths and
  // generous key spacing matter more than unreadable invented branding.
  const rows = [.385, .115, -.155, -.425, -.695, -.965], columns = [-.465, -.155, .155, .465]
  const symbols = [['N', 'I', 'PV', 'FV'], ['C', 'MR', 'M+', 'ON'], [7, 8, 9, '/'], [4, 5, 6, '*'], [1, 2, 3, '-'], [0, '.', '+', '=']]
  for (let row = 0; row < rows.length; row++) for (let col = 0; col < columns.length; col++) {
    const calculate = row === 5 && col >= 2
    const parent = calculate ? joint(root, col === 3 ? 'calculate-equals-key' : 'calculate-plus-key', [columns[col], rows[row], .145]) : root
    const x = calculate ? 0 : columns[col], y = calculate ? 0 : rows[row], z = calculate ? 0 : .145
    const finish = row < 2 ? 'graphite' : col === 3 ? 'pewter' : 'silver'
    rounded(parent, 'calculator-key-' + row + '-' + col, [.238, .181, .061], finish, [x, y, z], [0, 0, 0], .03, .012)
    const symbol = symbols[row][col], faceZ = z + .045
    if (typeof symbol === 'number') digit(api, parent, 'key-number-' + row + '-' + col, symbol, x, y, faceZ, .076, 'ink')
    else if (symbol === '-' || symbol === '=') {
      for (const dy of symbol === '=' ? [-.017, .017] : [0]) mesh(parent, 'operator-' + row + '-' + col + '-' + dy, new THREE.BoxGeometry(.09, .012, .004), 'pearl', [x, y + dy, faceZ])
    } else if (symbol === '*') {
      for (const angle of [Math.PI / 4, -Math.PI / 4]) mesh(parent, 'multiply-' + angle, new THREE.BoxGeometry(.09, .012, .004), 'pearl', [x, y, faceZ], [0, 0, angle])
    } else if (symbol === '/') mesh(parent, 'divide-slash', new THREE.BoxGeometry(.095, .012, .004), 'pearl', [x, y, faceZ], [0, 0, Math.PI / 3])
    else if (symbol === '.') mesh(parent, 'decimal-key-dot', new THREE.SphereGeometry(.012, 10, 6), 'ink', [x, y, faceZ])
    else {
      legend(api, parent, 'function-legend-' + row + '-' + col, symbol, x, y, faceZ, row < 2 ? 'pearl' : 'ink')
    }
  }
  // A quiet strip of real case joinery, visible when the calculator is turned.
  for (const sign of [-1, 1]) {
    rounded(root, 'calculator-machined-side-rail-' + sign, [.028, 2.07, .117], 'silver', [sign * .700, -.01, -.050], [0, 0, 0], .012, .006)
    for (let i = 0; i < 3; i++) mesh(root, 'calculator-side-grip-' + sign + '-' + i, new THREE.BoxGeometry(.030, .013, .102), 'graphite', [sign * .716, -.76 + i * .063, -.053])
  }
  translate(model, root.getObjectByName('calculate-plus-key'), [0, 0, -1], q => .027 * gesture(q, .10, .15, .18, .235))
  translate(model, root.getObjectByName('calculate-equals-key'), [0, 0, -1], q => .030 * gesture(q, .35, .40, .445, .49))
  return model
}
