import * as THREE from 'three'
import { TAU, Y, vec, group, shaftAxis, put, rod, box, bevelBox, gear, machinedRing, channelRing, bolt, bevelFrame, finishBevel } from './geometry.mjs'

const ringPoint = (radius, angle, center, rotation, z = 0) => vec(radius * Math.cos(angle), radius * Math.sin(angle), z)
  .applyEuler(new THREE.Euler(...rotation)).add(center)

/** Flat, cut lettering: the serif dates are strokes in a single enamel face. */
function inlayStroke(part, points, width, position, rotation = [0, 0, 0], depth = .0022, surface = null) {
  const p = points.map(([x, y]) => new THREE.Vector2(x, y))
  const closed = p[0].distanceTo(p[p.length - 1]) < 1e-8
  if (closed) p.pop()
  const edges = p.map((point, i) => {
    const before = p[i ? i - 1 : closed ? p.length - 1 : 0]
    const after = p[i < p.length - 1 ? i + 1 : closed ? 0 : i]
    const tangent = after.clone().sub(before).normalize()
    return new THREE.Vector2(-tangent.y, tangent.x).multiplyScalar(width / 2)
  })
  const left = p.map((point, i) => point.clone().add(edges[i]))
  const right = p.map((point, i) => point.clone().sub(edges[i]))
  const clockwise = closed && THREE.ShapeUtils.isClockWise(p)
  const shape = new THREE.Shape(closed ? (clockwise ? left : right) : [...left, ...right.reverse()])
  if (closed) shape.holes.push(new THREE.Path((clockwise ? right : left).slice().reverse()))
  shape.closePath()
  let geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1, steps: 1 })
  // Curved serif joints can triangulate into microscopic cap slivers. Keep
  // only meaningful cut faces, with room above the exporter area threshold.
  const attributes=geometry.getAttribute('position'),indices=[],a=vec(0,0,0),b=vec(0,0,0),c=vec(0,0,0)
  for(let i=0;i<attributes.count;i+=3){
    a.fromBufferAttribute(attributes,i);b.fromBufferAttribute(attributes,i+1);c.fromBufferAttribute(attributes,i+2)
    if(b.sub(a).cross(c.sub(a)).lengthSq()>=2e-14)indices.push(i,i+1,i+2)
  }
  geometry.setIndex(indices)
  if(indices.length<attributes.count){const cut=geometry.toNonIndexed();geometry.dispose();geometry=cut}
  if (surface) {
    const positions = geometry.getAttribute('position')
    for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + surface(positions.getX(i) + position.x, positions.getY(i) + position.y) - position.z)
    geometry.computeVertexNormals()
  }
  put(part, geometry, position, rotation)
}

const cubic = (a, b, c, d, count = 10) => Array.from({ length: count + 1 }, (_, i) => {
  const t = i / count, u = 1 - t
  return [u ** 3 * a[0] + 3 * u ** 2 * t * b[0] + 3 * u * t ** 2 * c[0] + t ** 3 * d[0],
    u ** 3 * a[1] + 3 * u ** 2 * t * b[1] + 3 * u * t ** 2 * c[1] + t ** 3 * d[1]]
})
const joinCurves = (...curves) => curves.flatMap((curve, i) => i ? curve.slice(1) : curve)
const serifDigits = [
  [joinCurves(cubic([.28, .5], [-.08, .5], [-.08, -.5], [.28, -.5]), cubic([.28, -.5], [.64, -.5], [.64, .5], [.28, .5]))],
  [[[.055, .31], [.27, .5], [.27, -.5]], [[.04, -.5], [.5, -.5]]],
  [joinCurves(cubic([.015, .28], [.035, .57], [.59, .59], [.55, .22]), cubic([.55, .22], [.54, .03], [.14, -.19], [.03, -.5])), [[.03, -.5], [.56, -.5], [.56, -.34]]],
  [joinCurves(cubic([.045, .37], [.24, .62], [.61, .5], [.52, .19]), cubic([.52, .19], [.47, .04], [.24, -.035], [.20, -.02])), joinCurves(cubic([.20, -.02], [.62, .08], [.66, -.46], [.27, -.5]), cubic([.27, -.5], [.17, -.5], [.07, -.45], [.025, -.36]))],
  [[[.45, .5], [.035, -.15], [.59, -.15]], [[.45, .5], [.45, -.5]], [[.28, -.5], [.59, -.5]]],
  [[[.55, .5], [.095, .5], [.065, .04]], joinCurves(cubic([.065, .04], [.25, .20], [.64, .02], [.55, -.29]), cubic([.55, -.29], [.49, -.57], [.11, -.58], [.025, -.34]))],
  [joinCurves(cubic([.52, .42], [.20, .65], [-.02, .19], [.05, -.26]), cubic([.05, -.26], [.11, -.61], [.56, -.58], [.56, -.20]), cubic([.56, -.20], [.56, .15], [.22, .18], [.05, -.12]))],
  [[[.03, .35], [.03, .5], [.59, .5], [.20, -.5]], [[.07, -.5], [.37, -.5]]],
  [joinCurves(cubic([.28, .005], [-.025, .14], [.005, .50], [.28, .5]), cubic([.28, .5], [.565, .50], [.575, .18], [.28, .005])), joinCurves(cubic([.28, .005], [-.09, -.095], [-.025, -.50], [.28, -.5]), cubic([.28, -.5], [.60, -.50], [.64, -.12], [.28, .005]))],
  [joinCurves(cubic([.055, -.43], [.36, -.66], [.60, -.10], [.53, .25]), cubic([.53, .25], [.44, .63], [.00, .57], [.005, .22]), cubic([.005, .22], [.005, -.08], [.32, -.14], [.53, .12]))],
]

function dateInlay(part, value, height, center, surface = null, rotation = [0,0,0]) {
  const digits = String(value), advance = height * .69, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  for (const [index, digit] of [...digits].entries()) {
    const left = center.clone().add(vec((index - (digits.length - 1) / 2) * advance - height * .28, 0, 0).applyQuaternion(q))
    for (const stroke of serifDigits[Number(digit)]) inlayStroke(part, stroke.map(([x, y]) => [x * height, y * height]), height * .078, left, rotation, .0022, surface)
  }
}

function romanInlay(part, value, height, center, rotation = [0, 0, 0]) {
  const letters = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][value]
  const advance = height * .53, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  for (const [i, letter] of [...letters].entries()) {
    const p = center.clone().add(vec((i - (letters.length - 1) / 2) * advance, 0, 0).applyQuaternion(q))
    const paths = letter === 'I' ? [[[0, -.5], [0, .5]], [[-.19, -.5], [.19, -.5]], [[-.19, .5], [.19, .5]]]
      : letter === 'V' ? [[[-.23, .5], [0, -.5], [.23, .5]], [[-.34, .5], [-.10, .5]], [[.10, .5], [.34, .5]]]
        : [[[-.24, .5], [.24, -.5]], [[.24, .5], [-.24, -.5]], [[-.33, .5], [.33, .5]], [[-.33, -.5], [.33, -.5]]]
    for (const path of paths) inlayStroke(part, path.map(([x, y]) => [x * height, y * height]), height * .085, p, rotation)
  }
}

/** A shouldered, cast calendar face with an integral header cartouche. */
function calendarPlaque(part, width, height, depth, position, bevel = .012) {
  const shape = new THREE.Shape(), x = width / 2, y = height / 2
  const rx=Math.min(.066,width*.11,height*.36),ry=Math.min(.060,height*.34),crest=height*.12
  // The fitted insert has positive straight side walls at both sizes. Fixed
  // large corner radii reversed those walls on the shorter enamel pocket.
  shape.moveTo(-x + rx, -y)
  shape.lineTo(x - rx, -y); shape.quadraticCurveTo(x, -y, x, -y + ry)
  shape.lineTo(x, y - ry); shape.quadraticCurveTo(x, y, x - rx, y)
  shape.lineTo(.108, y); shape.bezierCurveTo(.09, y + crest, -.09, y + crest, -.108, y)
  shape.lineTo(-x + rx, y); shape.quadraticCurveTo(-x, y, -x, y - ry)
  shape.lineTo(-x, -y + ry); shape.quadraticCurveTo(-x, -y, -x + rx, -y)
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel * .72, bevelSegments: 3, curveSegments: 8, steps: 1 })
  geometry.translate(0, 0, -depth / 2)
  put(part, finishBevel(geometry), position)
}

function turned(part, profile, position, scale = [1, 1, 1], segments = 40) {
  put(part, new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), segments), position, [0, 0, 0], scale)
}

function drum(part, profile, position, rotation = [0, 0, 0], segments = 96) {
  const geometry = new THREE.LatheGeometry(profile.map(([radius, z]) => new THREE.Vector2(radius, z)), segments)
  geometry.rotateX(Math.PI / 2)
  put(part, finishBevel(geometry), position, rotation)
}

function piercedPlate(part, radius, depth, position, openings = [], rotation = [0, 0, 0]) {
  const shape = new THREE.Shape(); shape.absarc(0, 0, radius, 0, TAU, false)
  for (const [x, y, rx, ry] of openings) {
    const hole = new THREE.Path(); hole.absellipse(x, y, rx, ry, 0, TAU, true); shape.holes.push(hole)
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: .006, bevelThickness: .007, bevelSegments: 3, curveSegments: 32, steps: 1 })
  geometry.translate(0, 0, -depth / 2)
  put(part, finishBevel(geometry), position, rotation)
}

const chapterHeight = radius => .143 + .020 * Math.sin(Math.PI * THREE.MathUtils.clamp((radius - .612) / .184, 0, 1))

/** One three-foot casting carries the register and bored central arbor. */
function calendarBridge(part, position) {
  const angles = [.37, Math.PI - .37, -Math.PI / 2]
  const shape = new THREE.Shape()
  for (let i = 0; i < 144; i++) {
    const a = i / 144 * TAU
    const shoulder = Math.max(...angles.map(angle => {
      const d = Math.atan2(Math.sin(a - angle), Math.cos(a - angle))
      return Math.exp(-((d / .185) ** 2))
    }))
    const radius = .125 + .491 * shoulder, x = radius * Math.cos(a), y = radius * Math.sin(a)
    if (i) shape.lineTo(x, y); else shape.moveTo(x, y)
  }
  shape.closePath()
  for (const angle of angles) {
    const hole = new THREE.Path(); hole.absarc(.466 * Math.cos(angle), .466 * Math.sin(angle), .021, 0, TAU, true)
    shape.holes.push(hole)
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .073, bevelEnabled: true, bevelSize: .013, bevelThickness: .017, bevelSegments: 4, curveSegments: 12, steps: 1 })
  geometry.translate(0, 0, -.0365)
  put(part, finishBevel(geometry), position)
}

function opportunityInstrument() {
  const center = vec(0, .045, -.15), clockRotation = [.055, -.10, -.085], caseRotation = [0,0,0]
  const clock = group('hover-clock-machined-crescent', 'silver', center, shaftAxis(clockRotation))
  const orbitalCenter = vec(0, .045, -.31), orbitalRotation = [.28, -.31, .14]
  const orbital = group('hover-register-rear-crescent', 'pewter', orbitalCenter, shaftAxis(orbitalRotation))
  const dialCenter = vec(.015, .045, -.035), dialRotation = [-.06, .10, .02]
  const dial = group('hover-register-inner-index', 'steel', dialCenter, shaftAxis(dialRotation))
  const face = group('Fitted enamel perpetual-calendar dial and weekday register', 'porcelain')
  const recess = group('Cut serif calendar dates, chapter graduations and dark apertures', 'ink')
  const chassis = group('Pierced cast movement bridge, dial retainers and fitted crowns', 'pewter')
  const backing = group('Rear movement drum, bearing blocks and escapement service bridge', 'steel')
  const pendulumPivot = vec(.39, -.40, .29)
  const pendulum = group('hover-register-escapement-pendulum', 'pewter', pendulumPivot, vec(0, 0, 1))
  const primaryPosition = vec(-.48, -.65, -.19), driveRotation = [.08, -.10, 0]
  const secondaryPosition = primaryPosition.clone().add(vec(.318 * Math.cos(-.37), .318 * Math.sin(-.37), 0).applyEuler(new THREE.Euler(...driveRotation)))
  const primary = group('hover-register-primary-gear', 'silver', primaryPosition, shaftAxis(driveRotation))
  const secondary = group('hover-register-transfer-gear', 'silver', secondaryPosition, shaftAxis(driveRotation))
  const caseMarks = group('Incised Roman month chapter, shoulder scale and winding cuts', 'ink', center, shaftAxis(clockRotation))
  caseMarks.parent = clock.name
  const handMarks = group('Incised index blade and arbor retention slot', 'ink', dialCenter, shaftAxis(dialRotation))
  handMarks.parent = dial.name
  // A polished case, pale enamel, dark steel index and quieter rear movement
  // establish the working face before its smaller cuts and wheels are read.
  clock.surfaceTone=.96
  orbital.surfaceTone=.90
  backing.surfaceTone=.80

  // The case is a single deep, rounded clockmaker's barrel, with a fitted dial
  // seat. Its broad curved wall and back rebate replace the floating wire hoops.
  drum(clock, [
    [.768,-.182],[.837,-.182],[.865,-.164],[.904,-.121],[.928,.020],
    [.938,.130],[.934,.200],[.923,.244],[.903,.271],[.873,.285],
    [.803,.285],[.784,.277],[.773,.260],[.768,.224],[.768,-.182],
  ], center, caseRotation, 144)
  // The whole Roman ordinal fits the flat machined seat. Its rear face meets
  // the barrel's front shoulder, rather than floating above a narrow trim.
  machinedRing(clock, .890, .078, .034, 0, TAU, center.clone().add(vec(0, 0, .302)), caseRotation, 144)
  channelRing(clock, .808, .026, .040, 0, TAU, center.clone().add(vec(0, 0, .302)), caseRotation, 144)
  // Twelve restrained Roman month ordinals are cut into the fitted bezel face.
  for (let month = 1; month <= 12; month++) {
    const angle = Math.PI / 2 - (month - 1) / 12 * TAU
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...caseRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), angle - Math.PI / 2))
    const e = new THREE.Euler().setFromQuaternion(q)
    romanInlay(caseMarks, month, .047, ringPoint(.889, angle, center, caseRotation, .318), [e.x,e.y,e.z])
  }
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue
    const a = i / 60 * TAU
    box(caseMarks, [.012, .0025, .002], ringPoint(.914, a, center, caseRotation, .3198), [0, 0, a])
  }
  // A proper rear drum has three pierced movement windows, bored bearing seats
  // and a recessed perimeter seam. The opening edges have actual depth.
  drum(orbital, [[.755,-.051],[.815,-.051],[.838,-.036],[.842,.006],[.827,.032],[.757,.032],[.749,.020],[.749,-.042],[.755,-.051]], vec(0,.045,-.299), caseRotation, 112)
  piercedPlate(backing, .752, .055, vec(0,.045,-.322), [[-.32,-.37,.240,.190],[.29,-.24,.197,.257],[0,.32,.285,.194]], caseRotation)
  machinedRing(orbital, .733, .012, .030, 0, TAU, vec(0,.045,-.355), caseRotation, 112)
  for (const angle of [.22, 2.26, 4.31]) {
    const p = ringPoint(.758,angle,vec(0,.045,-.347),caseRotation,-.015)
    bolt(orbital,recess,p,.023,[0,Math.PI,0])
  }

  // One pale annular date dial fits the case shoulder directly. Thirty-one
  // widely spaced serif dates form a perpetual calendar chapter, rather than
  // reproducing a rectangular calculator in the centre of a circular frame.
  drum(face, [[.613,.094],[.795,.094],[.800,.111],[.798,.133],
    ...Array.from({length:25},(_,i)=>{const r=.796-i/24*.184;return[r,chapterHeight(r)]}),
    [.609,.130],[.609,.105],[.613,.094]], vec(0,.045,0), [0,0,0], 160)
  drum(chassis, [[.788,.108],[.809,.108],[.811,.136],[.804,.157],[.794,.165],[.788,.158],[.788,.108]], vec(0,.045,0), [0,0,0], 144)
  drum(chassis, [[.596,.101],[.617,.101],[.621,.128],[.614,.147],[.605,.151],[.596,.143],[.596,.101]], vec(0,.045,0), [0,0,0], 128)
  const chapterSurface = (x,y) => chapterHeight(Math.hypot(x,y-.045)) + .0007
  for (let date = 1; date <= 31; date++) {
    const a = Math.PI / 2 - (date - 1) / 31 * TAU
    dateInlay(recess,date,.064,vec(.699*Math.cos(a),.045+.699*Math.sin(a),chapterHeight(.699)),chapterSurface)
    const q = new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),a), e = new THREE.Euler().setFromQuaternion(q)
    box(recess,[date%5===0?.025:.014,.0030,.0025],vec(.765*Math.cos(a),.045+.765*Math.sin(a),chapterHeight(.765)+.0008),[e.x,e.y,e.z])
  }
  // A few genuinely recessed fine subdivisions sit between the dates. Their
  // larger major marks and the clear type spacing dominate the fine scale.
  for(let i=0;i<124;i++){
    if(i%4===0)continue
    const a=Math.PI/2-i/124*TAU
    box(recess,[.007,.0018,.002],vec(.758*Math.cos(a),.045+.758*Math.sin(a),chapterHeight(.758)+.0008),[0,0,a])
  }

  // A three-foot movement bridge meets the inner dial seat. Its broad rounded
  // arms carry the bored arbor, leaving deep service openings between them.
  calendarBridge(chassis, vec(0,.045,.111))
  drum(chassis, [[.026,.118],[.090,.118],[.103,.135],[.101,.165],[.079,.185],[.038,.191],[.026,.178],[.026,.118]], vec(.015,.045,0), [0,0,0], 64)
  for(const a of[.37,Math.PI-.37,-Math.PI/2]){
    const p=vec(.571*Math.cos(a),.045+.571*Math.sin(a),.165)
    machinedRing(chassis,.039,.012,.016,0,TAU,p,[0,0,0],32)
    bolt(chassis,recess,p.clone().add(vec(0,0,.010)),.024)
  }
  // The open casting exposes two fitted movement wheels behind it. Their
  // shafts disappear into the drum rather than ending in decorative discs.
  for (const [x,y,radius,teeth] of [[-.224,-.177,.151,20],[.194,-.165,.128,17]]) {
    const p=vec(x,y,.034)
    gear(backing,radius,teeth,.039,p)
    rod(backing,p.clone().add(vec(0,0,-.13)),p.clone().add(vec(0,0,.067)),.019,16)
    bolt(chassis,recess,p.clone().add(vec(0,0,.074)),.019)
  }
  // Seven serif weekday initials remain a calm, straight register inside the
  // round calendar, on a shallow enamel insert with its own fitted bezel.
  calendarPlaque(chassis,.608,.167,.048,vec(0,.317,.151),.014)
  calendarPlaque(face,.552,.114,.024,vec(0,.318,.185),.009)
  for (const side of [-1,1]) {
    bevelBox(chassis,.070,.128,.053,vec(side*.250,.247,.122),[0,0,side*-.34],.012)
  }
  const weekdays = [
    [[[-.35,-.5],[-.35,.5],[0,-.12],[.35,.5],[.35,-.5]]],
    [[[0,-.5],[0,.5]],[[-.35,.5],[.35,.5]]],
    [[[-.4,.5],[-.2,-.5],[0,.04],[.2,-.5],[.4,.5]]],
    [[[0,-.5],[0,.5]],[[-.35,.5],[.35,.5]]],
    [[[-.25,-.5],[-.25,.5],[.28,.5]],[[-.25,.04],[.16,.04]]],
    [joinCurves(cubic([.27,.36],[-.28,.75],[-.53,-.02],[0,-.02],7),cubic([0,-.02],[.55,-.02],[.32,-.68],[-.32,-.36],7))],
    [joinCurves(cubic([.27,.36],[-.28,.75],[-.53,-.02],[0,-.02],7),cubic([0,-.02],[.55,-.02],[.32,-.68],[-.32,-.36],7))],
  ]
  for(const[i,paths]of weekdays.entries())for(const path of paths)inlayStroke(recess,path.map(([x,y])=>[x*.045,y*.045]),.0036,vec((i-3)*.074,.315,.2048))
  for(const x of[-.273,.273])bolt(chassis,recess,vec(x,.315,.189),.014)

  // An index hand has a tapered blade, a leaf tip and a stepped bored hub. It
  // rotates about the preserved index shaft instead of another floating arc.
  const pointerAngle=-1.16, q=new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),pointerAngle)
  const e=new THREE.Euler().setFromQuaternion(q)
  const pointer=new THREE.Shape([
    new THREE.Vector2(-.134,-.018),new THREE.Vector2(-.092,-.032),new THREE.Vector2(.032,-.026),new THREE.Vector2(.464,-.013),
    new THREE.Vector2(.559,-.037),new THREE.Vector2(.666,0),new THREE.Vector2(.559,.037),new THREE.Vector2(.464,.013),
    new THREE.Vector2(.032,.026),new THREE.Vector2(-.092,.032),new THREE.Vector2(-.134,.018),
  ])
  const opening=new THREE.Path([new THREE.Vector2(.509,0),new THREE.Vector2(.558,.015),new THREE.Vector2(.610,0),new THREE.Vector2(.558,-.015)])
  opening.closePath();pointer.holes.push(opening)
  const hand=new THREE.ExtrudeGeometry(pointer,{depth:.020,bevelEnabled:true,bevelSize:.004,bevelThickness:.005,bevelSegments:3,steps:1})
  put(dial,finishBevel(hand),vec(.015,.045,.231),[e.x,e.y,e.z])
  drum(dial, [[.018,.175],[.048,.175],[.060,.184],[.063,.211],[.055,.237],[.076,.242],[.077,.253],[.066,.264],[.035,.270],[.031,.293],[.018,.293],[.018,.175]], vec(.015,.045,0), [0,0,0], 64)
  bolt(dial,handMarks,vec(.015,.045,.294),.024)
  inlayStroke(handMarks,[[.088,0],[.446,0]],.0034,vec(.015,.045,.257),[e.x,e.y,e.z])

  // Top winding crowns are joined to fitted case bosses; the cast wall carries
  // both their bored shafts and the shallow axial knurling.
  for(const side of[-1,1]){
    const p=vec(side*.196,.974,-.104)
    bevelBox(chassis,.090,.074,.146,p.clone().add(vec(0,-.044,-.036)),[0,0,side*-.055],.012)
    turned(clock,[[.019,-.024],[.037,-.016],[.043,-.004],[.043,.021],[.034,.032],[.025,.039]],p,[1,1,1],36)
    for(let i=0;i<16;i++){
      const a=i/16*TAU
      rod(caseMarks,p.clone().add(vec(.043*Math.cos(a),-.002,.043*Math.sin(a))),p.clone().add(vec(.043*Math.cos(a),.019,.043*Math.sin(a))),.0022,4)
    }
  }
  // Existing gear shafts stay in their real positions. A pierced rear service
  // saddle and separate bored bearings let their construction read when turned.
  gear(primary,.215,24,.055,primaryPosition,driveRotation)
  gear(secondary,.125,14,.055,secondaryPosition,driveRotation)
  for(const[position,radius]of[[primaryPosition,.215],[secondaryPosition,.125]]){
    rod(backing,position.clone().add(vec(0,0,-.112)),position.clone().add(vec(0,0,.070)),.022,16)
    machinedRing(chassis,.047,.018,.029,0,TAU,position.clone().add(vec(0,0,-.097)),driveRotation,32)
    machinedRing(backing,radius+.024,.024,.038,.12,Math.PI*1.34,position.clone().add(vec(0,0,-.080)),driveRotation,64)
    bolt(clock,recess,position.clone().addScaledVector(shaftAxis(driveRotation),-.108),.024,[driveRotation[0],Math.PI+driveRotation[1],driveRotation[2]])
  }
  bevelFrame(backing,.47,.095,.049,.34,.035,vec(-.333,-.712,-.330),[0,0,-.33],.008)
  bevelFrame(chassis,.136,.274,.096,.064,.139,vec(.386,-.452,.022),[0,0,-.09],.009)
  // The pear bob, long stem and fitted hinge remain one articulation. Small
  // turned shoulders produce broad specular changes instead of added ornament.
  rod(pendulum,pendulumPivot,vec(.39,-.848,.29),.014,16)
  turned(pendulum,[[.009,-.090],[.028,-.080],[.057,-.054],[.074,-.015],[.067,.027],[.047,.061],[.018,.086],[.010,.092]],vec(.39,-.906,.29),[1,1,.76],48)
  machinedRing(pendulum,.031,.009,.017,0,TAU,vec(.39,-.919,.347),[0,0,0],36)
  machinedRing(pendulum,.026,.013,.030,0,TAU,pendulumPivot,[0,0,0],32)
  bolt(chassis,recess,pendulumPivot.clone().add(vec(0,0,-.035)),.031)
  return [clock,orbital,dial,face,recess,chassis,backing,pendulum,primary,secondary,caseMarks,handMarks]
}

// Hand-authored generalized coastlines: geography is geometry, not texture masks.
// Eurasia is one connected plate, so the observer never sees an invented seam
// across the continental interior. Islands retain generous shapes at phone size.
const continents = [
  // Africa: Atlantic bulge, Gulf of Guinea, Horn, Mozambique and the Cape.
  [[-17,37],[-10,36],[-6,36],[0,36],[9,37],[11,35],[13,33],[19,31],[25,32],[31,31],[33,30],[34,27],[36,22],[38,18],[41,15],[43,13],[46,12],[51,12],[50,10],[47,7],[44,3],[42,0],[41,-3],[39,-6],[40,-10],[38,-15],[35,-18],[35,-23],[32,-28],[29,-31],[25,-34],[20,-35],[18,-34],[17,-30],[16,-27],[14,-23],[12,-18],[12,-14],[13,-10],[12,-6],[10,-3],[9,1],[9,4],[7,4],[5,5],[1,5],[-4,5],[-8,5],[-11,7],[-14,10],[-16,14],[-17,20],[-16,24],[-13,28],[-10,32]],
  // Connected Eurasia, including the peninsulas which make its outline readable.
  [[-10,36],[-9,43],[-3,44],[-2,47],[-5,48],[-1,49],[4,51],[8,54],[10,57],[8,58],[6,58],[6,61],[10,64],[14,67],[18,69],[24,71],[29,70],[31,69],[28,64],[32,63],[40,64],[44,68],[53,71],[70,73],[86,74],[102,77],[118,74],[131,70],[146,72],[163,69],[179,66],[179,63],[172,60],[166,60],[161,55],[157,51],[153,46],[147,46],[142,49],[140,53],[135,55],[138,49],[135,43],[129,41],[128,38],[129,35],[126,34],[124,38],[121,40],[119,39],[121,35],[122,31],[120,27],[118,24],[114,22],[109,21],[108,19],[107,16],[109,13],[109,10],[106,9],[105,10],[103,1],[101,1],[100,5],[99,8],[98,9],[98,14],[96,17],[92,21],[88,22],[86,20],[82,16],[80,12],[78,8],[76,9],[75,13],[73,17],[72,21],[68,23],[63,25],[60,25],[57,24],[56,26],[54,27],[52,25],[51,25],[50,29],[48,30],[48,29],[51,23],[55,17],[51,13],[44,13],[43,16],[42,22],[40,26],[35,29],[34,32],[36,36],[33,36],[29,36],[27,38],[24,39],[23,40],[23,38],[20,37],[20,40],[17,40],[16,38],[13,38],[12,41],[9,44],[7,43],[3,42],[0,40],[-1,37],[-6,36]],
  // North America and the narrow Central American connection.
  [[-168,67],[-162,70],[-153,71],[-143,70],[-137,68],[-131,64],[-124,63],[-119,68],[-109,70],[-99,73],[-89,72],[-81,70],[-77,66],[-69,63],[-63,59],[-59,54],[-55,51],[-57,47],[-63,46],[-67,44],[-71,42],[-74,40],[-76,35],[-80,32],[-81,27],[-80,25],[-83,25],[-85,30],[-90,29],[-94,29],[-97,25],[-97,22],[-94,19],[-90,18],[-88,21],[-86,21],[-87,16],[-84,15],[-83,11],[-80,8],[-78,9],[-79,11],[-83,13],[-86,16],[-91,16],[-95,17],[-100,19],[-105,21],[-109,24],[-114,28],[-117,32],[-120,37],[-123,43],[-126,49],[-133,54],[-141,59],[-147,60],[-151,58],[-157,57],[-162,59],[-166,62]],
  // South America: shoulders, eastward Brazilian coast and tapered Andes.
  [[-81,12],[-76,11],[-72,12],[-68,10],[-64,10],[-60,8],[-57,5],[-51,3],[-48,0],[-44,-2],[-41,-3],[-36,-5],[-35,-10],[-38,-14],[-40,-19],[-43,-23],[-47,-26],[-50,-29],[-52,-33],[-57,-38],[-61,-43],[-65,-48],[-67,-54],[-71,-55],[-75,-50],[-74,-43],[-73,-37],[-71,-30],[-70,-24],[-72,-18],[-77,-11],[-80,-3],[-80,3]],
  [[113,-22],[114,-20],[119,-18],[123,-16],[129,-15],[130,-12],[133,-12],[136,-14],[138,-17],[141,-17],[143,-12],[145,-15],[147,-20],[153,-26],[153,-30],[150,-34],[147,-38],[143,-39],[138,-36],[135,-35],[131,-32],[127,-33],[123,-34],[117,-34],[115,-30]],
  [[-52,60],[-45,60],[-42,63],[-38,66],[-31,68],[-23,72],[-21,76],[-28,80],[-39,83],[-48,82],[-57,78],[-61,73],[-56,68],[-53,64]],
  [[-6,50],[-3,51],[1,52],[0,54],[-2,55],[-2,57],[-4,59],[-6,58],[-6,55],[-5,53]],
  [[-10,51],[-7,51],[-6,53],[-6,55],[-8,56],[-10,54]],
  [[-24,64],[-19,63],[-14,65],[-16,67],[-21,67],[-24,66]],
  [[131,31],[133,33],[136,34],[138,36],[140,39],[141,41],[143,42],[145,44],[145,42],[143,41],[140,36],[137,34],[133,32]],
  [[44,-13],[48,-14],[50,-17],[49,-22],[46,-26],[44,-24],[43,-20]],
  [[95,5],[99,3],[102,0],[106,-5],[104,-6],[100,-3],[97,1]],
  [[109,7],[116,7],[119,4],[118,0],[116,-4],[111,-4],[110,1]],
  [[105,-6],[111,-7],[115,-8],[114,-9],[110,-9],[106,-8]],
  [[120,2],[124,1],[125,-2],[123,-3],[121,-2],[120,-4],[118,-3],[119,0]],
  [[131,-1],[138,-2],[141,-3],[146,-5],[150,-6],[151,-10],[146,-9],[141,-7],[138,-5],[133,-4]],
  [[172,-34],[175,-36],[178,-38],[177,-40],[174,-41],[172,-39]],
  [[172,-41],[173,-43],[170,-45],[166,-47],[166,-45],[168,-43]],
  [[80,10],[82,8],[82,6],[80,6],[79,8]],
  [[-85,23],[-79,22],[-75,20],[-76,19],[-80,21],[-84,22]],
  [[-74,20],[-69,20],[-68,18],[-72,18]],
  [[120,23],[121,25],[122,24],[121,22]],
]
const geographic = (lon, lat, radius) => {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180
  return vec(radius * Math.cos(b) * Math.sin(a), radius * Math.sin(b), radius * Math.cos(b) * Math.cos(a))
}

function sampledBoundary(outline) {
  const result = []
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length]
    const count = Math.max(1, Math.ceil(geographic(...a, 1).angleTo(geographic(...b, 1)) / .040))
    for (let j = 0; j < count; j++) result.push([THREE.MathUtils.lerp(a[0], b[0], j / count), THREE.MathUtils.lerp(a[1], b[1], j / count)])
  }
  return result
}

// Small seas and the Great Lakes are cut through the raised land rather than
// painted over it. All outlines remain original, generalized geographic work.
const inlandWater = {
  1: [
    [[47, 46], [50, 47], [53, 45], [54, 42], [53, 38], [51, 37], [49, 39], [48, 42]],
    [[32, 46], [37, 47], [41, 45], [40, 42], [36, 41], [31, 42], [28, 43]],
  ],
  2: [
    [[-94, 59], [-91, 56], [-86, 55], [-82, 57], [-79, 61], [-82, 64], [-87, 66], [-91, 63]],
    [[-92, 47], [-89, 49], [-85, 48], [-84, 46], [-87, 46]],
    [[-88, 46], [-86, 46], [-85, 43], [-87, 42], [-88, 44]],
    [[-84, 46], [-81, 46], [-80, 44], [-83, 43]],
  ],
}
const ranges = [
  { path: [[-72,-48],[-70,-30],[-72,-20],[-77,-8],[-74,6]], width: 3.6, height: .116 },
  { path: [[-132,58],[-125,50],[-119,42],[-113,35],[-109,29]], width: 5.3, height: .096 },
  { path: [[-67,48],[-73,42],[-80,36],[-85,33]], width: 3.8, height: .046 },
  { path: [[72,35],[80,30],[89,28],[96,29]], width: 4.5, height: .146 },
  { path: [[5,44],[10,47],[15,46]], width: 2.8, height: .071 },
  { path: [[39,44],[44,42],[49,41]], width: 3.2, height: .064 },
  { path: [[-10,31],[-4,35],[7,35]], width: 4.1, height: .080 },
  { path: [[40,16],[36,8],[37,-5],[32,-14]], width: 5.2, height: .126 },
  { path: [[60,64],[59,55],[58,48]], width: 3.8, height: .052 },
  { path: [[145,-16],[149,-27],[145,-36]], width: 4.0, height: .058 },
  { path: [[101,30],[103,37],[107,40]], width: 5.0, height: .086 },
  { path: [[28,-24],[29,-28],[26,-33]], width: 3.9, height: .066 },
  { path: [[15,70],[13,64],[8,59]], width: 4.1, height: .070 },
]
// Original, generalized physiographic masses. These broad shoulders, and the
// basins between them, remain readable well before the engraved hachures do.
const plateaux = [
  [85,34,14,8,.049],[40,10,8,12,.041],[27,-25,11,11,.036],
  [5,23,8,7,.061],[18,21,6,7,.071],[9,17,6,8,.027],
  [-9,10,8,9,.038],[11,5,6,10,.038],[30,-3,8,13,.027],
  [-50,-16,13,14,.038],[-62,5,12,8,.025],[-108,40,10,15,.042],
  [-42,72,12,12,.040],[125,-24,17,11,.026],[95,58,35,18,.025],
  [23,52,13,10,.017],[68,27,12,10,.025],
]
const basins = [[22,-5,13,12,.017],[-62,-4,16,9,.014],[-95,40,12,19,.012],[85,53,15,9,.009]]
const shoreEdges = continents.flatMap((outline, index) => [outline,...(inlandWater[index] || [])].flatMap(boundary => boundary.map((a,i) => {
  const b=boundary[(i+1)%boundary.length]
  return {a,b,minX:Math.min(a[0],b[0]),maxX:Math.max(a[0],b[0]),minY:Math.min(a[1],b[1]),maxY:Math.max(a[1],b[1])}
})))
const terrainRadii = new Map(), terrainNormals = new Map()

function distanceFromShore(lon,lat) {
  const cos=Math.max(.20,Math.cos(lat*Math.PI/180)),span=12/cos
  let nearest=12
  for(const {a,b,minX,maxX,minY,maxY} of shoreEdges){
    if(lat<minY-12||lat>maxY+12||lon<minX-span||lon>maxX+span)continue
    const dx=(b[0]-a[0])*cos,dy=b[1]-a[1],px=(lon-a[0])*cos,py=lat-a[1]
    const t=THREE.MathUtils.clamp((px*dx+py*dy)/(dx*dx+dy*dy),0,1)
    nearest=Math.min(nearest,Math.hypot(px-dx*t,py-dy*t))
  }
  return nearest
}

function rangeDistance(lon, lat, range) {
  const cos = Math.max(.20,Math.cos(lat*Math.PI/180))
  let distance=Infinity, signed=0, progress=0
  for(let i=0;i<range.path.length-1;i++){
    const[ax,ay]=range.path[i],[bx,by]=range.path[i+1]
    const dx=(bx-ax)*cos,dy=by-ay,px=(lon-ax)*cos,py=lat-ay
    const t=THREE.MathUtils.clamp((px*dx+py*dy)/(dx*dx+dy*dy),0,1)
    const d=Math.hypot(px-dx*t,py-dy*t)
    if(d<distance){distance=d;signed=(dx*py-dy*px)/Math.hypot(dx,dy);progress=(i+t)/(range.path.length-1)}
  }
  return {distance,signed,progress}
}

function landRadius(lon,lat) {
  const key=`${lon.toFixed(7)},${lat.toFixed(7)}`
  if(terrainRadii.has(key))return terrainRadii.get(key)
  // The raised continent grows out of the ocean at its shore. Relief is broad
  // connected landform, not a uniformly offset plate with noise added to it.
  const distance=distanceFromShore(lon,lat),coastalRamp=1-Math.exp(-((distance/2.0)**2))
  let elevation=.018*(1-Math.exp(-((distance/6.2)**2)))
  for(const range of ranges){
    const{distance,signed,progress}=rangeDistance(lon,lat,range)
    if(distance>range.width*4.5)continue
    const taper=.34+.66*Math.sin(progress*Math.PI)**.70
    const saddles=.83+.17*Math.cos(progress*TAU*3)
    const watershed=range.height*taper*saddles*Math.exp(-((distance/range.width)**2)*1.30)
    const foothills=range.height*.44*taper*Math.exp(-((distance/(range.width*2.45))**2))
    // A few connected drainage troughs cut diagonally from ridge to shoulder.
    // Their spacing is landform scale, rather than a bead-like repeated bump.
    const drainage=range.height*.22*taper*Math.exp(-((distance/(range.width*1.95))**2))
      *Math.exp(-((Math.sin(progress*TAU*4+Math.abs(signed)/range.width*1.14)/.34)**2))
      *Math.min(1,distance/range.width/.6)
    elevation+=Math.max(0,watershed+foothills-drainage)
  }
  for(const[x,y,sx,sy,height]of plateaux)elevation+=height*Math.exp(-(((lon-x)/sx)**2)-((lat-y)/sy)**2)
  for(const[x,y,sx,sy,depth]of basins)elevation-=depth*Math.exp(-(((lon-x)/sx)**2)-((lat-y)/sy)**2)
  const radius=.7106+.094*Math.tanh(Math.max(0,elevation)*coastalRamp/.094)
  terrainRadii.set(key,radius)
  return radius
}

function terrainDetail(lon,lat) {
  return ranges.some(range=>rangeDistance(lon,lat,range).distance<range.width*2.7)
    ||plateaux.some(([x,y,sx,sy,height])=>height>.035&&((lon-x)/sx)**2+((lat-y)/sy)**2<2.25)
}

function terrainNormal(lon, lat) {
  const key=`${lon.toFixed(7)},${lat.toFixed(7)}`
  if(terrainNormals.has(key))return terrainNormals.get(key)
  const epsilon = .075
  const along = geographic(lon + epsilon, lat, landRadius(lon + epsilon, lat))
    .sub(geographic(lon - epsilon, lat, landRadius(lon - epsilon, lat)))
  const upward = geographic(lon, lat + epsilon, landRadius(lon, lat + epsilon))
    .sub(geographic(lon, lat - epsilon, landRadius(lon, lat - epsilon)))
  const normal=along.cross(upward).normalize()
  terrainNormals.set(key,normal)
  return normal
}

function continent(part, outline, holes = []) {
  const boundaries = [outline, ...holes].map(sampledBoundary)
  const points = boundaries[0].map(([lon, lat]) => new THREE.Vector2(lon, lat))
  const cutouts = boundaries.slice(1).map(hole => hole.map(([lon, lat]) => new THREE.Vector2(lon, lat)))
  const triangles = THREE.ShapeUtils.triangulateShape(points, cutouts), all = points.concat(...cutouts)
  const positions = [], normals = []
  function facet(a, b, c, depth = 0) {
    const vertices = [a, b, c].map(p => geographic(p.x, p.y, landRadius(p.x, p.y)))
    const spans = [vertices[0].angleTo(vertices[1]), vertices[1].angleTo(vertices[2]), vertices[2].angleTo(vertices[0])]
    const longest = spans.indexOf(Math.max(...spans))
    // The terrain is part of the continental skin. Small spherical triangles
    // and analytical slope normals retain real topography at oblique views.
    if (spans[longest] > (terrainDetail((a.x+b.x+c.x)/3,(a.y+b.y+c.y)/3) ? .027 : .044) && depth < 16) {
      if (longest === 0) { const m = a.clone().add(b).multiplyScalar(.5); facet(a,m,c,depth+1); facet(m,b,c,depth+1) }
      else if (longest === 1) { const m = b.clone().add(c).multiplyScalar(.5); facet(a,b,m,depth+1); facet(a,m,c,depth+1) }
      else { const m = c.clone().add(a).multiplyScalar(.5); facet(a,b,m,depth+1); facet(m,b,c,depth+1) }
      return
    }
    if (vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0])).lengthSq() < 1e-14) return
    if (vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0])).dot(vertices[0]) < 0) {
      [vertices[1], vertices[2]] = [vertices[2], vertices[1]]; [b, c] = [c, b]
    }
    for (const [index, point] of vertices.entries()) {
      positions.push(...point.toArray())
      const coordinate = [a, b, c][index]
      normals.push(...terrainNormal(coordinate.x, coordinate.y).toArray())
    }
  }
  for (const indexes of triangles) facet(...indexes.map(index => all[index]))
  const face = new THREE.BufferGeometry()
  face.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  face.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  put(part, face)
  // The coast is a small modeled chamfer into the ocean, with cut shores around
  // the internal seas as well. There is no bright wire outlining every country.
  for (const [boundaryIndex, boundary] of boundaries.entries()) {
    const coast = boundary.map(([lon, lat]) => geographic(lon, lat, 1)), wall = [], index = []
    const clockwise = THREE.ShapeUtils.isClockWise(boundary.map(([x,y]) => new THREE.Vector2(x,y)))
    for (let i = 0; i < coast.length; i++) {
      const direction = coast[i], lon = Math.atan2(direction.x, direction.z) * 180 / Math.PI
      const lat = Math.asin(direction.y) * 180 / Math.PI, radius = landRadius(lon, lat)
      const tangent = coast[(i+1)%coast.length].clone().sub(coast[(i+coast.length-1)%coast.length]).normalize()
      const inward = direction.clone().cross(tangent).normalize().multiplyScalar((clockwise ? -1 : 1) * (boundaryIndex ? -1 : 1))
      const top = direction.clone().multiplyScalar(radius)
      const shoulder = direction.clone().multiplyScalar(Math.max(.7090, radius - .0035)).addScaledVector(inward, -.0026)
      const base = direction.clone().multiplyScalar(.7078).addScaledVector(inward, -.0031)
      wall.push(...top.toArray(), ...shoulder.toArray(), ...base.toArray())
    }
    for (let i = 0; i < coast.length; i++) for (let level = 0; level < 2; level++) {
      const a = i * 3 + level, b = (i + 1) % coast.length * 3 + level
      index.push(a, a+1, b, a+1, b+1, b)
    }
    const walls = new THREE.BufferGeometry()
    walls.setAttribute('position', new THREE.Float32BufferAttribute(wall, 3)); walls.setIndex(index); walls.computeVertexNormals()
    put(part, finishBevel(walls))
  }
}

function insideOutline(lon, lat, outline) {
  let inside = false
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [ax, ay] = outline[i], [bx, by] = outline[j]
    if ((ay > lat) !== (by > lat) && lon < (bx - ax) * (lat - ay) / (by - ay) + ax) inside = !inside
  }
  return inside
}
function onLand(lon, lat) {
  return continents.some((outline, index) => insideOutline(lon, lat, outline) && !(inlandWater[index] || []).some(hole => insideOutline(lon, lat, hole)))
}

/** A flat, curved inlay follows the skin; it has no circular wire silhouette. */
function mapInlay(part, points, width) {
  // Resolve the skin between chart samples before sweeping a flat cut. A long
  // chord across a steep shoulder otherwise twists the strip's face normals.
  const refined=[points[0]],surface=direction=>{
    const lon=Math.atan2(direction.x,direction.z)*180/Math.PI,lat=Math.asin(direction.y)*180/Math.PI
    return onLand(lon,lat)?landRadius(lon,lat):.708
  }
  for(let i=1;i<points.length;i++){
    const a=points[i-1].clone().normalize(),b=points[i].clone().normalize(),steps=Math.max(1,Math.ceil(a.angleTo(b)/.0055))
    const liftA=points[i-1].length()-surface(a),liftB=points[i].length()-surface(b)
    for(let j=1;j<steps;j++){
      const t=j/steps,p=a.clone().lerp(b,t).normalize()
      refined.push(p.clone().multiplyScalar(surface(p)+THREE.MathUtils.lerp(liftA,liftB,t)))
    }
    refined.push(points[i])
  }
  points=refined
  const positions=[],indices=[]
  for(let i=0;i<points.length;i++){
    const p=points[i],direction=p.clone().normalize()
    const lon=Math.atan2(direction.x,direction.z)*180/Math.PI,lat=Math.asin(direction.y)*180/Math.PI
    const normal=onLand(lon,lat)?terrainNormal(lon,lat):direction
    const tangent=points[Math.min(points.length-1,i+1)].clone().sub(points[Math.max(0,i-1)]).normalize()
    const side=normal.clone().cross(tangent).normalize().multiplyScalar(width/2)
    positions.push(...p.clone().add(side).toArray(),...p.clone().sub(side).toArray())
    if(i<points.length-1){const a=i*2;indices.push(a,a+3,a+2,a,a+1,a+3)}
  }
  if(!indices.length)return
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  const p=geometry.getAttribute('position'),a=vec(0,0,0),b=vec(0,0,0),c=vec(0,0,0),radial=vec(0,0,0)
  for(let i=0;i<indices.length;i+=3){
    a.fromBufferAttribute(p,indices[i]);b.fromBufferAttribute(p,indices[i+1]);c.fromBufferAttribute(p,indices[i+2]);radial.copy(a).add(b).add(c)
    if(b.sub(a).cross(c.sub(a)).dot(radial)<0)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]]
  }
  // The cut's own curved skin determines its shading, including tight coast
  // and saddle bends where a borrowed terrain tangent can face the wrong way.
  geometry.setIndex(indices);geometry.computeVertexNormals();put(part,geometry)
}

/** Broad enough to survive halftone, incised map curves follow the terrain. */
function graticule(sea,earth,coordinates,width=.0032) {
  let path=[],previous=null
  const flush=part=>{if(path.length>1)mapInlay(part,path,width);path=[]}
  for(const[lon,lat]of coordinates){
    const land=onLand(lon,lat),part=land?earth:sea
    if(previous&&part!==previous)flush(previous)
    path.push(geographic(lon,lat,land?landRadius(lon,lat)+.0021:.7090))
    previous=part
  }
  flush(previous)
}

function geographicPath(part, from, to, width = .0042) {
  const a = geographic(...from, 1), b = geographic(...to, 1), angle = a.angleTo(b), points = []
  for (let i = 0; i <= 120; i++) {
    const t = i / 120
    const p = a.clone().multiplyScalar(Math.sin((1-t)*angle)/Math.sin(angle)).addScaledVector(b, Math.sin(t*angle)/Math.sin(angle)).normalize()
    const lon = Math.atan2(p.x, p.z) * 180 / Math.PI, lat = Math.asin(p.y) * 180 / Math.PI
    const surface = onLand(lon, lat) ? landRadius(lon, lat) : .708
    points.push(p.multiplyScalar(surface + .0016))
  }
  mapInlay(part, points, width)
}

/** Swelled load-bearing arms flow out of the lower turned bearing. */
function observatoryFork(part, side) {
  const shape=new THREE.Shape()
  shape.moveTo(.038,-.929)
  shape.bezierCurveTo(.096,-.926,.140,-.895,.168,-.850)
  shape.quadraticCurveTo(.178,-.833,.160,-.824)
  shape.quadraticCurveTo(.140,-.820,.130,-.837)
  shape.bezierCurveTo(.105,-.868,.073,-.887,.038,-.886)
  shape.closePath()
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.077,bevelEnabled:true,bevelSize:.008,bevelThickness:.010,bevelSegments:3,curveSegments:12,steps:1})
  geometry.translate(0,0,-.0385)
  if(side<0){geometry.scale(-1,1,1);geometry.setIndex(Array.from({length:geometry.getAttribute('position').count},(_,i)=>i));const index=geometry.index;for(let i=0;i<index.count;i+=3){const a=index.getX(i);index.setX(i,index.getX(i+2));index.setX(i+2,a)}}
  put(part,finishBevel(geometry))
}

function marketObservatory() {
  terrainRadii.clear();terrainNormals.clear()
  const ocean = group('Continuous dark-steel ocean shell', 'steel')
  const land = group('Continuous cast continental ridges, connected valleys and coastal shoulders', 'pewter')
  const coast = group('Flush pewter ocean graticule and observation-route inlays', 'pewter')
  const recess = group('Recessed land graticule, inlaid graduations and bearing slots', 'ink')
  const meridian = group('hover-observatory-meridian-yoke', 'silver', vec(0, 0, 0), Y.clone())
  const latitudeRotation = [Math.PI / 2, .17, -.15]
  const latitude = group('hover-observatory-equatorial-index', 'steel', vec(0, 0, 0), shaftAxis(latitudeRotation))
  const scale = group('Cast observatory pedestal, turned shoulders and fitted horizon supports', 'pewter')
  const markers = group('Flush geographic observation sockets', 'porcelain')
  const north = group('hover-observatory-north-bearing', 'silver', vec(0, .816, 0), Y.clone())
  const south = group('hover-observatory-south-bearing', 'silver', vec(0, -.816, 0), Y.clone())
  const meridianMarks = group('Incised polar degree ordinals and fitted yoke joinery', 'ink', meridian.pivot.clone(), meridian.axis.clone())
  meridianMarks.parent=meridian.name
  const cradleMarks = group('Incised horizon degree scale and retention shoes', 'ink', latitude.pivot.clone(), latitude.axis.clone())
  cradleMarks.parent=latitude.name
  // Darker metal water gives the cast land a clear tonal boundary. Map inlays
  // are quieter than the polished degree yoke and modeled shoulders.
  ocean.surfaceTone=.66
  coast.surfaceTone=.86

  put(ocean, new THREE.SphereGeometry(.708, 80, 52))
  for (const [index, outline] of continents.entries()) continent(land, outline, inlandWater[index] || [])
  // A low ice cap joins the rest of the world's relief without a tube at its edge.
  put(land, new THREE.SphereGeometry(.719, 72, 8, 0, TAU, Math.PI * .895, Math.PI * .105))
  for (const lat of [-60, -30, 0, 30, 60]) {
    graticule(coast, recess, Array.from({ length: 289 }, (_, i) => [-180 + i * 1.25, lat]), lat === 0 ? .0052 : .0035)
  }
  for (const lon of [-120, -60, 0, 60, 120, 180]) {
    graticule(coast, recess, Array.from({ length: 145 }, (_, i) => [lon, -90 + i * 1.25]), .0035)
  }
  // Curved engraver's hachures follow the modeled watershed shoulders. They
  // terminate on the land and have a meaningful cut width at the live size.
  for(const range of ranges)for(let i=0;i<range.path.length-1;i++){
    const[a,b]=[range.path[i],range.path[i+1]],count=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/7.0))
    for(let j=0;j<count;j++){
      const t=(j+.45)/count,lon=THREE.MathUtils.lerp(a[0],b[0],t),lat=THREE.MathUtils.lerp(a[1],b[1],t)
      const cos=Math.max(.3,Math.cos(lat*Math.PI/180)),along=new THREE.Vector2((b[0]-a[0])*cos,b[1]-a[1]).normalize()
      const side=new THREE.Vector2(-along.y,along.x)
      for(const sign of[-1,1]){
        const coordinates=Array.from({length:9},(_,k)=>{
          const u=.20+k/8*1.65,bend=Math.sin(k/8*Math.PI)*.25
          return[lon+(side.x*u*sign+along.x*bend)*range.width/cos,lat+(side.y*u*sign+along.y*bend)*range.width]
        })
        if(coordinates.every(([x,y])=>onLand(x,y)))mapInlay(recess,coordinates.map(([x,y])=>geographic(x,y,landRadius(x,y)+.0012)),.0038)
      }
    }
  }

  // Only two armillary members surround the globe: a substantial polar yoke
  // and a horizon cradle. Their channels, broad edges and polar shaft explain
  // how the Earth is held, with no third decorative orbit around the map.
  const meridianRotation = [0, .20, 0]
  machinedRing(meridian, .850, .085, .074, 0, TAU, vec(0, 0, 0), meridianRotation, 144)
  machinedRing(meridian, .890, .008, .052, 0, TAU, vec(0, 0, 0), meridianRotation, 144)
  for (let i = 0; i < 72; i++) {
    if (i % 6 === 0) continue
    const a = i / 72 * TAU, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...meridianRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), a))
    const e = new THREE.Euler().setFromQuaternion(q)
    box(meridianMarks, [i % 3 ? .014 : .027, .0034, .0024], ringPoint(.855, a, vec(0, 0, 0), meridianRotation, .0372), [e.x, e.y, e.z])
  }
  for (let i = 0; i < 12; i++) {
    const a=i/12*TAU,q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...meridianRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),a-Math.PI/2))
    const e=new THREE.Euler().setFromQuaternion(q),value=(i%6>3?6-i%6:i%6)*30
    dateInlay(meridianMarks,value,.038,ringPoint(.849,a,vec(0,0,0),meridianRotation,.0373),null,[e.x,e.y,e.z])
  }
  for (const side of [-1, 1]) {
    const position = vec(0, side * .816, 0), part = side > 0 ? north : south
    rod(meridian, vec(0, side * .718, 0), vec(0, side * .908, 0), .023, 20)
    turned(part, [[.024,-.041],[.043,-.037],[.062,-.024],[.064,-.013],[.057,-.004],[.056,.020],[.063,.027],[.061,.039],[.044,.048],[.026,.049]], position, [1, 1, 1], 48)
    machinedRing(part, .060, .008, .011, 0, TAU, position.clone().add(vec(0, side * .029, 0)), [Math.PI / 2, 0, 0], 48)
    machinedRing(recess, .033, .012, .038, 0, TAU, position, [Math.PI / 2, 0, 0], 28)
    if (side > 0) {
      turned(part, [[.018,-.005],[.027,-.001],[.034,.008],[.034,.028],[.029,.036],[.019,.042]], vec(0, .872, 0), [1, 1, 1], 40)
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * TAU
        rod(part, vec(.034 * Math.cos(a), .881, .034 * Math.sin(a)), vec(.034 * Math.cos(a), .898, .034 * Math.sin(a)), .0016, 4)
      }
    }
    for (const x of [-.066, .066]) {
      bevelBox(meridian, .038, .063, .065, position.clone().add(vec(x, 0, 0)), [0, 0, 0], .007)
      bolt(meridian, meridianMarks, position.clone().add(vec(x, 0, .042)), .015)
    }
  }
  machinedRing(latitude, .928, .071, .057, -.40, TAU * .835, vec(0, 0, 0), latitudeRotation, 144)
  machinedRing(latitude, .960, .008, .043, -.40, TAU * .835, vec(0, 0, 0), latitudeRotation, 144)
  for (let i = 1; i < 60; i++) {
    if (i % 6 === 0) continue
    const a = -.36 + i / 60 * TAU * .815, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...latitudeRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), a))
    const e = new THREE.Euler().setFromQuaternion(q)
    box(cradleMarks, [i % 3 ? .011 : .024, .0030, .0024], ringPoint(.929, a, vec(0, 0, 0), latitudeRotation, .0286), [e.x, e.y, e.z])
  }
  for (let i = 1; i < 10; i++) {
    const a=-.36+i/10*TAU*.815,q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...latitudeRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),a-Math.PI/2))
    const e=new THREE.Euler().setFromQuaternion(q)
    dateInlay(cradleMarks,i*30,.038,ringPoint(.927,a,vec(0,0,0),latitudeRotation,.0287),null,[e.x,e.y,e.z])
  }
  // The two ends of the horizon cradle have fitted forked shoes, not blunt cuts.
  for (const angle of [-.40, -.40 + TAU * .835]) {
    const p = ringPoint(.928, angle, vec(0, 0, 0), latitudeRotation)
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...latitudeRotation))
      .multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), angle))
    const e = new THREE.Euler().setFromQuaternion(q)
    bevelFrame(latitude, .084, .086, .069, .032, .039, p, [e.x, e.y, e.z], .007)
    bolt(latitude,cradleMarks,ringPoint(.928,angle,vec(0,0,0),latitudeRotation,.046),.014,latitudeRotation)
  }
  // The horizon member seats in two bored yoke saddles at the intersection of
  // their planes. These short cast joints explain the second ring's support.
  const yokeNormal=shaftAxis(meridianRotation),horizonNormal=shaftAxis(latitudeRotation)
  const intersection=yokeNormal.clone().cross(horizonNormal).normalize()
  for(const side of [-1,1]){
    const radial=intersection.clone().multiplyScalar(side),tangent=yokeNormal.clone().cross(radial).normalize()
    const e=new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(radial,tangent,yokeNormal))
    const rotation=[e.x,e.y,e.z],p=radial.clone().multiplyScalar(.890)
    bevelBox(meridian,.116,.060,.077,p,rotation,.010)
    bolt(meridian,meridianMarks,p.clone().addScaledVector(yokeNormal,.045),.020,rotation)
  }
  // A swelled turned bearing descends into a low oval foot. Its raised shoulder,
  // neck, cut side seam and broad heel are one continuous weight-bearing form.
  turned(scale, [[.049,-.027],[.099,-.022],[.124,-.009],[.126,.005],[.112,.021],[.078,.032],
    [.062,.043],[.056,.063],[.061,.075],[.079,.082],[.078,.093],[.052,.099]], vec(0,-.947,0), [1,1,1], 64)
  const foot=vec(0,-.990,0)
  turned(scale, [[.014,-.033],[.274,-.033],[.343,-.029],[.371,-.015],[.371,.005],[.354,.017],
    [.304,.021],[.299,.029],[.275,.038],[.187,.049],[.094,.060],[.052,.065],[.047,.049],[.047,-.017],[.014,-.033]], foot, [1,1,.68], 96)
  turned(recess, [[.3708,-.006],[.3718,-.006],[.3718,-.002],[.3708,-.002],[.3708,-.006]],foot,[1,1,.68],96)
  for (const side of [-1, 1]) {
    observatoryFork(scale,side)
    bevelFrame(scale,.079,.076,.075,.033,.032,vec(side*.142,-.847,0),[0,0,side*.26],.008)
    bolt(scale,recess,vec(side*.147,-.844,.052),.017)
  }

  const places = [[-74,41],[-.1,52],[139,36],[104,1],[-46,-24],[151,-34]]
  for (const [lon, lat] of places) {
    const radius = landRadius(lon, lat), p = geographic(lon, lat, radius + .002), direction = p.clone().normalize()
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(vec(0,0,1), direction)), rotation = [e.x,e.y,e.z]
    machinedRing(recess, .013, .005, .006, 0, TAU, p, rotation, 20)
    machinedRing(markers, .011, .005, .007, 0, TAU, p.clone().addScaledVector(direction,.005), rotation, 20)
    const socket = new THREE.CylinderGeometry(.005, .008, .011, 12, 1); socket.rotateX(Math.PI / 2)
    put(markers, socket, p.clone().addScaledVector(direction,.006), rotation)
  }
  for (const [a,b] of [[0,1],[1,3],[3,2]]) geographicPath(coast,places[a],places[b])
  return [ocean, land, coast, recess, meridian, latitude, scale, markers, north, south, meridianMarks, cradleMarks]
}

export { opportunityInstrument, marketObservatory }
