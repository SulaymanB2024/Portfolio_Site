/** Original kinetic castings for search/dialogue, evidence and commercial analysis. */
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'

const ease = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/** A movement has a clear intention, a held pose, then a quiet return. */
function heldGesture(q, start = .10, arrival = .35, departure = .58, end = .90) {
  if (q <= start || q >= end) return 0
  if (q < arrival) return ease((q - start) / (arrival - start))
  if (q <= departure) return 1
  return 1 - ease((q - departure) / (end - departure))
}

function castingTools(api) {
  const { THREE, TAU, vec, mesh } = api

  function section(width, depth, channel = false) {
    const w = width / 2, d = depth / 2, bevel = Math.min(width, depth) * .20
    const contour = [[-w + bevel, -d], [w - bevel, -d], [w, -d + bevel], [w, d - bevel], [w - bevel, d]]
    if (channel) contour.push([.040, d], [.031, d - .038], [-.031, d - .038], [-.040, d])
    contour.push([-w + bevel, d], [-w, d - bevel], [-w, -d + bevel])
    return contour
  }

  /** Solid beveled cross sections follow a genuine spatial curve. */
  function swept(path, crossSection, steps = 56, closed = false, twist = () => 0) {
    const positions = [], indices = [], rings = closed ? steps : steps + 1
    const first = crossSection(0), count = first.length
    for (let i = 0; i < rings; i++) {
      const t = i / steps, p = path(t)
      const before = path(closed ? t - .0001 : Math.max(0, t - .0001)), after = path(closed ? t + .0001 : Math.min(1, t + .0001))
      const tangent = after.sub(before).normalize()
      const n = tangent.clone().cross(vec(0, 0, 1)).normalize(), b = n.clone().cross(tangent).normalize()
      const angle = twist(t), normal = n.clone().multiplyScalar(Math.cos(angle)).addScaledVector(b, Math.sin(angle))
      const binormal = b.clone().multiplyScalar(Math.cos(angle)).addScaledVector(n, -Math.sin(angle))
      const profile = crossSection(t)
      if (profile.length !== count) throw new Error('Cast section topology must remain constant')
      for (const [x, y] of profile) positions.push(...p.clone().addScaledVector(normal, x).addScaledVector(binormal, y).toArray())
    }
    for (let i = 0; i < steps; i++) for (let j = 0; j < count; j++) {
      const nextRing = (i + 1) % rings, next = (j + 1) % count
      const a = i * count + j, b = nextRing * count + j, c = nextRing * count + next, d = i * count + next
      indices.push(a, b, c, a, c, d)
    }
    if (!closed) {
      const caps = THREE.ShapeUtils.triangulateShape(first.map(([x, y]) => new THREE.Vector2(x, y)), [])
      for (const [a, b, c] of caps) {
        indices.push(a, b, c)
        const base = (rings - 1) * count; indices.push(base + a, base + c, base + b)
      }
    }
    const source = new THREE.BufferGeometry()
    source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
    const casting = toCreasedNormals(source, Math.PI / 3); source.dispose(); return casting
  }

  function curve(parent, name, points, width, depth, finish = 'silver', steps = 36) {
    const path = new THREE.CatmullRomCurve3(points.map(point => vec(...point)), false, 'centripetal')
    return mesh(parent, name, swept(t => path.getPoint(t), t => section(typeof width === 'function' ? width(t) : width, typeof depth === 'function' ? depth(t) : depth), steps), finish)
  }

  /** A hollow compound-curved bowl includes rolled lips and an open throat. */
  function acousticShell(parent, name, breadth, height, depth, finish, position, handedness = 1) {
    const profile = [[.17, -.91], [.31, -.83], [.49, -.67], [.70, -.40], [.91, -.095], [1, .035], [1.035, .03], [1.066, -.065], [1.05, -.18], [.96, -.29], [.75, -.58], [.51, -.84], [.30, -1.015], [.17, -1.075], [.135, -1.045], [.135, -.96]]
    const ringSteps = 64, positions = [], indices = [], count = profile.length
    for (let i = 0; i < ringSteps; i++) {
      const theta = i / ringSteps * TAU, sin = Math.sin(theta), cos = Math.cos(theta)
      for (const [r, z] of profile) {
        const flare = 1 + .12 * sin - .06 * Math.cos(theta * 2)
        // The cowl advances above the throat and twists across its cheek. The
        // lower rim remains on the journal plane, retaining support contact.
        positions.push(breadth * r * cos * flare, height * r * sin, depth * z + .055 * r * r * (sin + 1) + handedness * .060 * r * r * sin * cos)
      }
    }
    for (let i = 0; i < ringSteps; i++) for (let j = 0; j < count; j++) {
      const a = i * count + j, b = ((i + 1) % ringSteps) * count + j, c = ((i + 1) % ringSteps) * count + (j + 1) % count, d = i * count + (j + 1) % count
      indices.push(a, c, b, a, d, c)
    }
    const source = new THREE.BufferGeometry()
    source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
    const shell = toCreasedNormals(source, Math.PI / 3); source.dispose()
    return mesh(parent, name, shell, finish, position)
  }

  function ovalFoot(parent, name, position, scale, finish = 'pewter') {
    const foot = api.lathe(parent, name, [[0, -.075], [.54, -.075], [.59, -.045], [.615, -.005], [.60, .045], [.55, .082], [0, .082]], finish, position, [0, 0, 0], 56)
    foot.scale.fromArray(scale); return foot
  }

  return { section, swept, curve, acousticShell, ovalFoot }
}

export function buildChegg(api) {
  const { THREE, TAU, vec, mesh, joint, ring, lathe, animate, structure } = api
  const { section, swept, curve, acousticShell, ovalFoot } = castingTools(api)
  const model = structure('chegg', 'Question / response', 'Two opposing compound-curved acoustic castings frame a selective search instrument. The selector presents an opportunity; the question shell inclines, holds, and is answered by the second shell. A continuous casting carries the dialogue instead of separate cards or decorative horns.', 9.2, [.06, -.16, -.025])
  const root = model.root
  ovalFoot(root, 'dialogue-instrument-foot', [0, -.92, -.06], [1.60, 1, .78])
  curve(root, 'question-shell-swept-support', [[-.26, -.87, -.04], [-.43, -.76, -.04], [-.59, -.52, -.025], [-.60, -.36, .01]], t => .18 - .055 * t, .15, 'silver', 32)
  curve(root, 'response-shell-swept-support', [[.22, -.87, -.07], [.46, -.72, -.08], [.59, -.50, -.01], [.59, -.36, .03]], t => .18 - .055 * t, .15, 'silver', 32)
  const question = joint(root, 'question-acoustic-casting', [-.60, -.36, .01], [0, .27, -.035])
  const response = joint(root, 'adaptive-response-casting', [.59, -.36, .03], [0, -.29, .035])
  acousticShell(question, 'deep-question-shell', .48, .64, .39, 'silver', [0, .67, 0], -1)
  acousticShell(response, 'deep-response-shell', .47, .65, .41, 'silver', [0, .68, 0], 1)
  for (const [name, pivot] of [['question', [-.60, -.36, .01]], ['response', [.59, -.36, .03]]]) {
    ring(root, name + '-shell-journal', .085, .060, .14, 'graphite', pivot, [0, 0, 0], false, 32)
  }
  // The central selector consists of substantial open channels, with one gate.
  curve(root, 'selector-saddle', [[0, -.87, -.08], [-.045, -.69, -.10], [0, -.49, -.11]], .17, .21, 'pewter', 24)
  for (const [i, radius] of [.235, .335].entries()) {
    const opening = .56, length = TAU - opening * 2
    const path = t => { const theta = opening + t * length; return vec(radius * Math.cos(theta), -.50 + radius * .64 * Math.sin(theta), -.10 - i * .085) }
    mesh(root, 'ranked-search-channel-' + i, swept(path, () => section(.070, .085), 44), 'pewter')
  }
  const selector = joint(root, 'ranked-opportunity-selector', [0, -.50, .015])
  const gatePath = t => { const theta = -.20 + t * Math.PI * 1.58; return vec(.215 * Math.cos(theta), .148 * Math.sin(theta), 0) }
  mesh(selector, 'selective-search-gate', swept(gatePath, () => section(.105, .11), 36), 'silver')
  const hub = lathe(selector, 'selector-indexed-bearing', [[0, -.035], [.066, -.035], [.091, -.018], [.091, .026], [.069, .044], [0, .044]], 'graphite', [0, 0, -.018], [Math.PI / 2, 0, 0], 28)
  hub.scale.set(1, 1, 1)
  animate(model, selector, [0, 0, 1], q => .29 * heldGesture(q, .06, .24, .43, .76))
  animate(model, question, [0, 0, 1], q => -.105 * heldGesture(q, .15, .32, .43, .68))
  animate(model, response, [0, 0, 1], q => .135 * heldGesture(q, .33, .52, .64, .88))
  return model
}

export function buildVoid(api) {
  const { THREE, TAU, gaussian, vec, mesh, joint, ring, animate, structure } = api
  const { section, swept, curve, ovalFoot } = castingTools(api)
  const model = structure('void', 'Atlas alignment instrument', 'Two asymmetric torqued ribbons cross over and under one another. Broad leaning crowns descend through recessed guide channels into narrow machined journals. Their kidney-shaped apertures counter-articulate into a shared evidence opening, expressing source records aligned with an operating system.', 9.6, [.055, -.17, -.025])
  const root = model.root
  ovalFoot(root, 'atlas-shared-cast-saddle', [0, -.99, .025], [1.62, 1, .86])
  curve(root, 'source-journal-rise', [[-.25, -.94, -.18], [-.36, -.90, -.21], [-.36, -.82, -.22]], .21, .25, 'pewter', 20)
  curve(root, 'system-journal-rise', [[.22, -.94, .18], [.35, -.90, .21], [.35, -.82, .22]], .21, .25, 'pewter', 20)
  for (const [i, handedness] of [1, -1].entries()) {
    const x = i ? .35 : -.36, z = i ? .22 : -.22
    const casting = joint(root, i ? 'operating-system-registration-loop' : 'source-evidence-registration-loop', [x, -.82, z], [0, i ? -.085 : .085, 0])
    // The leaning shoulder and tight return carve an irregular, generous void.
    // Opposed depth at the two crossings creates a real over/under linkage.
    const outline = [[0, 0, 0], [.52, .23, .12], [.67, .68, .39], [.43, 1.26, .65], [-.15, 1.62, .51], [-.53, 1.39, .29], [-.58, .72, .05], [-.28, .19, -.025]]
    const spine = new THREE.CatmullRomCurve3(outline.map(([x, y, z]) => vec(handedness * x, y, handedness * z)), true, 'centripetal')
    const path = t => spine.getPoint(((t % 1) + 1) % 1)
    const shoulder = (t, center, width) => gaussian(Math.sin(Math.PI * (t - center)) / Math.sin(Math.PI * width))
    const castSection = t => {
      const breadth = .15 + .28 * shoulder(t, .42, .17) + .09 * shoulder(t, .68, .14)
      const depth = .17 + .23 * shoulder(t, .44, .23)
      return section(breadth, depth, true)
    }
    mesh(casting, i ? 'torqued-operating-ribbon' : 'torqued-evidence-ribbon', swept(path, castSection, 96, true, t => handedness * (.42 * Math.sin(t * TAU + .28) + .16 * Math.sin(t * TAU * 2))), i ? 'pewter' : 'silver')
    ring(root, (i ? 'system' : 'evidence') + '-registration-journal', .103, .063, .22, 'silver', [x, -.82, z], [0, 0, 0], true, 36)
    ring(casting, (i ? 'system' : 'evidence') + '-journal-recess', .068, .028, .13, 'graphite', [0, 0, .065], [0, 0, 0], false, 28)
    animate(model, casting, [0, 1, 0], q => (i ? .145 : -.145) * heldGesture(q, .12, .38, .62, .90))
  }
  return model
}

export function buildVenture(api) {
  const { THREE, vec, mesh, joint, ring, lathe, rounded, extrusion, animate, structure } = api
  const { curve, ovalFoot } = castingTools(api)
  const model = structure('venture-labs', 'Commercial balance', 'An asymmetric cantilever weighs a broad market vessel against a compact unit-economics vessel. Curved cast forks carry both pans from the beam, while a stepped cost body and thinner price cap leave a visible margin in the smaller pan. The pans counter-articulate to remain upright as the model weighs the alternatives.', 9.2, [.055, -.20, -.015])
  const root = model.root
  ovalFoot(root, 'commercial-balance-foot', [.08, -.97, -.035], [1.38, 1, .87])
  curve(root, 'sculpted-commercial-cantilever', [[.20, -.90, -.09], [.32, -.72, -.12], [.30, -.44, -.14], [.11, -.08, -.10], [0, .39, -.045]], t => .25 - .065 * t, t => .26 - .055 * t, 'silver', 44)
  ring(root, 'analytical-beam-trunnion', .125, .075, .27, 'silver', [0, .39, 0], [0, 0, 0], true, 40)
  ring(root, 'trunnion-bored-recess', .075, .034, .17, 'graphite', [0, .39, .125], [0, 0, 0], false, 32)
  const beamAngle = .022, beam = joint(root, 'analytical-market-beam', [0, .39, 0], [0, 0, beamAngle])
  curve(beam, 'continuous-tapered-weighing-arm', [[-1.04, .17, 0], [-.82, .25, -.01], [-.38, .15, -.015], [0, 0, 0], [.38, .02, .015], [.84, -.04, .018]], t => .13 + .08 * Math.sin(t * Math.PI), .19, 'silver', 48)
  const market = joint(beam, 'upright-market-vessel', [-1.04, .17, 0], [0, 0, -beamAngle])
  const economics = joint(beam, 'upright-unit-economics-vessel', [.84, -.04, .018], [0, 0, -beamAngle])
  const buildFork = (pan, name, breadth, height, z) => {
    for (const sign of [-1, 1]) {
      curve(pan, name + '-cast-suspension-' + sign, [[0, 0, 0], [sign * breadth * .48, -.12, z], [sign * breadth * .84, -height * .57, z], [sign * breadth, -height, z * .52]], .066, .088, 'silver', 28)
    }
    ring(pan, name + '-hanging-journal', .055, .040, .15, 'graphite', [0, 0, .02], [0, 0, 0], false, 24)
  }
  buildFork(market, 'market', .35, .58, -.055)
  buildFork(economics, 'unit', .255, .51, -.045)
  const marketBowl = lathe(market, 'broad-market-vessel', [[.075, -.655], [.20, -.645], [.34, -.615], [.435, -.57], [.46, -.535], [.455, -.505], [.425, -.493], [.405, -.526], [.31, -.577], [.18, -.607], [.06, -.61], [0, -.610], [0, -.652]], 'pewter', [0, 0, 0], [0, 0, 0], 64)
  marketBowl.scale.set(1.08, 1, .88)
  // The wider market pan has one shaped opportunity field, rather than beads.
  const sector = new THREE.Shape()
  sector.moveTo(-.29, -.05); sector.quadraticCurveTo(-.37, .04, -.24, .16)
  sector.bezierCurveTo(-.12, .24, .16, .24, .29, .12); sector.quadraticCurveTo(.34, .02, .26, -.05)
  sector.quadraticCurveTo(0, .07, -.29, -.05); sector.closePath()
  mesh(market, 'market-opportunity-crescent', extrusion(sector, .075, .023, 14), 'silver', [0, -.56, -.01], [-Math.PI / 2, 0, -.12])
  lathe(economics, 'deep-unit-economics-vessel', [[0, -.67], [.12, -.67], [.245, -.60], [.292, -.52], [.305, -.47], [.298, -.435], [.27, -.435], [.245, -.49], [.20, -.57], [.10, -.616], [0, -.616]], 'pewter', [0, 0, 0], [0, 0, 0], 56)
  const cost = new THREE.Shape()
  cost.moveTo(-.175, -.615); cost.lineTo(.175, -.615); cost.lineTo(.175, -.49)
  cost.lineTo(.105, -.49); cost.lineTo(.105, -.435); cost.lineTo(-.12, -.435); cost.lineTo(-.12, -.48); cost.lineTo(-.175, -.48); cost.closePath()
  mesh(economics, 'weighted-stepped-cost-body', extrusion(cost, .28, .019, 5), 'graphite', [0, 0, 0])
  rounded(economics, 'unit-price-cap', [.39, .07, .31], 'silver', [0, -.315, 0], [0, 0, 0], .055, .020)
  curve(economics, 'rear-margin-casting-web', [[0, -.58, -.13], [0, -.44, -.155], [0, -.335, -.13]], .055, .065, 'silver', 20)
  const weighing = q => .108 * heldGesture(q, .14, .40, .63, .90)
  animate(model, beam, [0, 0, 1], weighing)
  animate(model, market, [0, 0, 1], q => -weighing(q))
  animate(model, economics, [0, 0, 1], q => -weighing(q))
  return model
}
