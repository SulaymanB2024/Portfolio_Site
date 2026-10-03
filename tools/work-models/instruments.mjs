import * as THREE from 'three'
import { TAU, Y, vec, group, shaftAxis, put, tube, arc, rod, box, bevelBox, gear, machinedRing, channelRing, bolt, bevelFrame, finishBevel } from './geometry.mjs'

const ringPoint = (radius, angle, center, rotation, z = 0) => vec(radius * Math.cos(angle), radius * Math.sin(angle), z)
  .applyEuler(new THREE.Euler(...rotation)).add(center)

/** Deep ink inserts mark fixed calendar-register ordinals, never live dates. */
function ordinal(recess, value, center) {
  const glyphs = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgecd', 'abc', 'abcdefg', 'abfgcd']
  const bars = {
    a: [0, .037, .034, .013], b: [.021, .0185, .013, .030],
    c: [.021, -.0185, .013, .030], d: [0, -.037, .034, .013],
    e: [-.021, -.0185, .013, .030], f: [-.021, .0185, .013, .030], g: [0, 0, .034, .013],
  }
  for (const [index, digit] of [...String(value).padStart(2, '0')].entries()) {
    for (const segment of glyphs[Number(digit)]) {
      const [x, y, w, h] = bars[segment]
      const p = center.clone().add(vec((index ? 1 : -1) * .035 + x, y, .007))
      // Wider graphite inlays clear the porcelain front instead of being hidden
      // beneath pale raised strokes. Their squared shoulders survive halftone.
      box(recess, [w, h, .007], p)
    }
  }
}

function opportunityInstrument() {
  const center = vec(0, .035, -.10)
  const clockRotation = [.09, -.13, -.10]
  const clock = group('hover-clock-machined-crescent', 'silver', center, shaftAxis(clockRotation))
  const orbitalCenter = vec(0, .035, -.30)
  const orbitalRotation = [.39, -.40, .17]
  const orbital = group('hover-register-rear-crescent', 'steel', orbitalCenter, shaftAxis(orbitalRotation))
  const dialCenter = vec(.015, .035, .30)
  const dialRotation = [-.12, .15, .02]
  const dial = group('hover-register-inner-index', 'silver', dialCenter, shaftAxis(dialRotation))
  const face = group('Embossed twelve-position ordinal register', 'porcelain')
  const recess = group('Recessed calendar wells and engraved indexes', 'ink')
  const chassis = group('Precision chassis standoffs and fasteners', 'silver')
  const backing = group('Open rear carriage and escapement bridge', 'steel')
  const pendulumPivot = vec(.34, -.40, .24)
  const pendulum = group('hover-register-escapement-pendulum', 'porcelain', pendulumPivot, vec(0, 0, 1))
  const primaryPosition = vec(-.49, -.61, -.24)
  const secondaryPosition = vec(-.18, -.72, -.24)
  const driveRotation = [.08, -.10, 0]
  const primary = group('hover-register-primary-gear', 'silver', primaryPosition, shaftAxis(driveRotation))
  const secondary = group('hover-register-transfer-gear', 'silver', secondaryPosition, shaftAxis(driveRotation))

  // Capped rectangular sections, flat front faces and fine chamfers replace tubes.
  channelRing(clock, .99, .103, .063, .03, TAU * .84, center, clockRotation, 128)
  machinedRing(clock, .963, .013, .073, .09, TAU * .815, center, clockRotation, 112)
  machinedRing(orbital, 1.065, .055, .045, -.72, TAU * .74, orbitalCenter, orbitalRotation, 112)
  channelRing(dial, .838, .037, .026, .45, TAU * .67, dialCenter, dialRotation, 96)
  for (let i = 0; i < 49; i++) {
    const angle = .16 + i / 48 * TAU * .79
    const major = i % 4 === 0
    const rotation = new THREE.Euler(...clockRotation)
    const q = new THREE.Quaternion().setFromEuler(rotation).multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), angle))
    const e = new THREE.Euler().setFromQuaternion(q)
    // Inlaid radial scale strokes sit inside the cut channel rather than above
    // an otherwise flat rail. A second short shoulder shows the major intervals.
    box(clock, [major ? .043 : .020, .005, .007], ringPoint(.99, angle, center, clockRotation, .016), [e.x, e.y, e.z])
    if(major)box(clock,[.009,.006,.008],ringPoint(1.030,angle,center,clockRotation,.031),[e.x,e.y,e.z])
  }
  // Three visible planes: the rear mechanism, open carriage, and readable tiles.
  for (const x of [-.443, .443]) {
    bevelBox(chassis, .052, 1.065, .080, vec(x, .025, -.17), [0, 0, 0], .008)
    box(recess, [.009, .84, .005], vec(x, .025, -.124))
  }
  for (const y of [-.508, .558]) {
    bevelBox(chassis, .925, .061, .080, vec(0, y, -.17), [0, 0, 0], .008)
    for (const x of [-.409, .409]) bolt(chassis, recess, vec(x, y, -.118), .025)
  }
  // Four fitted retention shoes wrap the carriage corners. The well gaps and
  // ordinal plates remain open while the layered register gains real joinery.
  for(const x of[-.369,.369])for(const y of[-.380,.475]){
    bevelFrame(chassis,.055,.068,.020,.021,.037,vec(x,y,.150),[0,0,x<0?-.08:.08],.0035)
    bevelBox(backing,.058,.032,.15,vec(x,y,.035),[0,0,0],.0035)
  }
  for (let row = 0; row < 4; row++) {
    const y = .374 - row * .226
    // A stepped bridge supports each row without closing the gaps between cells.
    bevelBox(backing, .79, .036, .052, vec(0, y, -.205), [0, 0, 0], .005)
    for (let col = 0; col < 3; col++) {
      const x = (col - 1) * .264
      const z = .145 + (col === 1 ? .012 : 0)
      bevelBox(recess, .236, .183, .078, vec(x, y, z - .028), [0, 0, 0], .008)
      bevelBox(face, .209, .153, .031, vec(x, y, z + .015), [0, 0, 0], .010)
      ordinal(recess, row * 3 + col + 1, vec(x, y - .010, z + .038))
      // Binding eyes and a short recessed header make this read as a calendar.
      for (const dx of [-.073, .073]) {
        machinedRing(chassis, .017, .009, .014, 0, TAU, vec(x + dx, y + .075, z + .024), [0, 0, 0], 10)
        rod(chassis, vec(x + dx, y, -.17), vec(x + dx, y, z - .065), .013, 10)
        machinedRing(chassis, .019, .008, .023, 0, TAU, vec(x + dx, y, -.093), [0, 0, 0], 10)
      }
      box(recess, [.112, .008, .007], vec(x, y + .052, z + .035))
    }
  }
  // Coherent, meshing gear radii and shared shaft plane, visible from behind.
  gear(primary, .215, 24, .055, primaryPosition, driveRotation)
  gear(secondary, .125, 14, .055, secondaryPosition, driveRotation)
  for (const [position, radius] of [[primaryPosition, .215], [secondaryPosition, .125]]) {
    rod(backing, position.clone().add(vec(0, 0, -.095)), position.clone().add(vec(0, 0, .115)), .022, 12)
    machinedRing(chassis, .047, .018, .025, 0, TAU, position.clone().add(vec(0, 0, -.082)), driveRotation, 24)
    machinedRing(backing, radius + .024, .022, .028, .12, Math.PI * 1.34, position.clone().add(vec(0, 0, -.07)), driveRotation, 48)
  }
  // A service opening and stepped shoulders make the bridge visibly carry the
  // shafts, while exposing the rear gear train instead of another solid bar.
  bevelFrame(backing, .47, .095, .040, .34, .035, vec(-.345, -.68, -.338), [0, 0, -.33], .006)
  for (const x of [-.54, -.15]) bolt(chassis, recess, vec(x, -.62 + (x + .54) * -.3, -.30), .024, [0, Math.PI, 0])
  // The bob and stem share one real hinge and articulate together.
  rod(pendulum, pendulumPivot, vec(.34, -.91, .24), .016, 10)
  bevelBox(pendulum, .142, .185, .065, vec(.34, -.88, .24), [0, 0, -.06], .022)
  machinedRing(pendulum, .025, .014, .035, 0, TAU, pendulumPivot, [0, 0, 0], 20)
  bolt(chassis, recess, pendulumPivot.clone().add(vec(0, 0, -.035)), .036)
  // A small perforated rear bridge ties the crescents to the register carriage.
  for (const side of [-1, 1]) {
    rod(backing, vec(side * .443, .49, -.205), vec(side * .67, .59, -.27), .022, 10)
    bolt(chassis, recess, vec(side * .66, .58, -.238), .027)
    machinedRing(backing, .059, .023, .045, 0, TAU, vec(side * .66, .58, -.275), [0, 0, 0], 28)
  }
  return [clock, orbital, dial, face, recess, chassis, backing, pendulum, primary, secondary]
}

// Hand-authored generalized coastlines: geography is geometry, not texture masks.
const continents = [
  [[-17,37],[-5,36],[10,37],[24,33],[33,31],[35,23],[43,12],[51,11],[48,3],[43,-11],[36,-18],[33,-27],[19,-35],[12,-24],[8,-17],[1,-6],[-9,5],[-16,13],[-17,23]],
  [[-10,36],[-9,43],[-2,44],[-1,49],[-5,58],[5,58],[8,63],[17,70],[29,71],[40,63],[33,58],[33,53],[29,46],[25,41],[23,37],[16,39],[12,45],[6,43],[1,42]],
  [[30,70],[54,73],[85,76],[108,74],[131,70],[149,62],[169,66],[164,58],[152,51],[140,48],[136,40],[129,38],[127,32],[122,30],[120,22],[111,19],[108,10],[104,2],[99,7],[97,19],[91,22],[87,22],[81,7],[76,9],[72,20],[67,24],[61,25],[55,24],[51,29],[44,31],[42,37],[37,44],[38,53]],
  [[-168,67],[-152,70],[-140,69],[-130,62],[-121,62],[-110,69],[-96,72],[-84,70],[-77,66],[-64,62],[-58,54],[-54,49],[-63,45],[-70,43],[-76,35],[-81,25],[-84,25],[-86,21],[-88,17],[-93,17],[-98,20],[-107,24],[-115,29],[-120,37],[-125,49],[-135,55],[-147,59],[-163,60]],
  [[-81,12],[-71,11],[-64,10],[-58,6],[-51,2],[-42,-3],[-35,-8],[-39,-15],[-43,-23],[-50,-29],[-54,-36],[-63,-45],[-68,-55],[-75,-50],[-73,-40],[-70,-26],[-77,-12],[-80,-3]],
  [[113,-22],[116,-18],[124,-15],[130,-12],[135,-13],[138,-17],[145,-15],[153,-25],[151,-32],[146,-39],[138,-37],[131,-32],[122,-34],[115,-31]],
  [[-52,60],[-43,60],[-34,65],[-23,70],[-27,78],[-39,83],[-48,82],[-60,75],[-57,67]],
  [[-8,50],[-3,51],[0,53],[-2,57],[-5,59],[-6,55]],
  [[130,31],[134,34],[138,36],[141,41],[144,44],[145,40],[140,35],[136,33]],
  [[44,-13],[50,-16],[49,-23],[45,-26],[43,-21]],
  [[95,5],[102,0],[106,-6],[103,-6],[98,-2]],
  [[109,7],[119,7],[118,-4],[112,-4]],
  [[166,-35],[173,-39],[177,-38],[178,-42],[169,-47],[166,-45],[171,-41]],
  [[-10,51],[-6,51],[-6,55],[-8,56],[-10,54]],
  [[80,10],[82,8],[82,6],[80,6],[79,8]],
  [[131,-1],[139,-3],[149,-6],[151,-10],[144,-9],[138,-5],[132,-4]],
  [[105,-6],[113,-7],[115,-9],[110,-9],[106,-8]],
]
const geographic = (lon, lat, radius) => {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180
  return vec(radius * Math.cos(b) * Math.sin(a), radius * Math.sin(b), radius * Math.cos(b) * Math.cos(a))
}

function coastline(outline, radius) {
  const result = []
  for (let i = 0; i < outline.length; i++) {
    const a = geographic(...outline[i], 1), b = geographic(...outline[(i + 1) % outline.length], 1)
    const count = Math.max(1, Math.ceil(a.angleTo(b) / .065))
    for (let j = 0; j < count; j++) result.push(a.clone().lerp(b, j / count).normalize().multiplyScalar(radius))
  }
  return result
}

function continent(part, outline, radius) {
  const points = outline.map(([lon, lat]) => new THREE.Vector2(lon, lat))
  const triangles = THREE.ShapeUtils.triangulateShape(points, [])
  const positions = [], normals = []
  function facet(a, b, c, depth) {
    if (depth) {
      const ab = a.clone().add(b).multiplyScalar(.5), bc = b.clone().add(c).multiplyScalar(.5), ca = c.clone().add(a).multiplyScalar(.5)
      facet(a, ab, ca, depth - 1); facet(ab, b, bc, depth - 1); facet(ca, bc, c, depth - 1); facet(ab, bc, ca, depth - 1)
      return
    }
    const vertices = [a, b, c].map(p => geographic(p.x, p.y, radius))
    const normal = vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0]))
    if (normal.dot(vertices[0]) < 0) [vertices[1], vertices[2]] = [vertices[2], vertices[1]]
    for (const point of vertices) { positions.push(...point.toArray()); normals.push(...point.clone().normalize().toArray()) }
  }
  for (const indexes of triangles) facet(...indexes.map(index => points[index]), outline.length > 10 ? 3 : 2)
  const face = new THREE.BufferGeometry()
  face.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  face.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  put(part, face)
  // Real relief sidewalls keep coastlines legible from an oblique angle.
  const coast = coastline(outline, radius), wall = [], index = []
  const clockwise=THREE.ShapeUtils.isClockWise(points)
  for (let i=0;i<coast.length;i++) {
    const p=coast[i],tangent=coast[(i+1)%coast.length].clone().sub(coast[(i+coast.length-1)%coast.length]).normalize()
    const inward=p.clone().normalize().cross(tangent).normalize().multiplyScalar(clockwise?-1:1)
    // A shallow beveled shoulder descends to a real relief wall. Coastline top
    // positions stay unchanged; only the oblique construction becomes richer.
    const shoulder=p.clone().multiplyScalar((radius-.007)/radius).addScaledVector(inward,-.003)
    const base=p.clone().multiplyScalar((radius-.028)/radius).addScaledVector(inward,-.003)
    wall.push(...p.toArray(),...shoulder.toArray(),...base.toArray())
  }
  for (let i = 0; i < coast.length; i++) {
    for(let level=0;level<2;level++){
      const a=i*3+level,b=(i+1)%coast.length*3+level
      index.push(a,a+1,b,a+1,b+1,b)
    }
  }
  const walls = new THREE.BufferGeometry()
  walls.setAttribute('position', new THREE.Float32BufferAttribute(wall, 3)); walls.setIndex(index); walls.computeVertexNormals()
  put(part, finishBevel(walls))
}

function geographicPath(part, from, to, lift, radius = .004) {
  const a = geographic(...from, 1), b = geographic(...to, 1), points = []
  for (let i = 0; i <= 32; i++) {
    const t = i / 32
    points.push(a.clone().lerp(b, t).normalize().multiplyScalar(.704 + Math.sin(t * Math.PI) * lift))
  }
  tube(part, points, radius, 48, 6)
}

/** Broad, low terrain relief follows selected ranges without covering the map. */
function terrainRange(part,coordinates,width,height) {
  const curve=new THREE.CatmullRomCurve3(coordinates.map(([lon,lat])=>vec(lon,lat,0)),false,'centripetal')
  const segments=32,across=6,positions=[],indices=[]
  for(let i=0;i<=segments;i++){
    const t=i/segments,center=curve.getPoint(t),tangent=curve.getTangent(t)
    const cosLatitude=Math.max(.25,Math.cos(center.y*Math.PI/180))
    const side=new THREE.Vector2(-tangent.y,tangent.x*cosLatitude).normalize()
    for(let j=0;j<=across;j++){
      const u=j/across*2-1
      const lon=center.x+side.x*u*width/cosLatitude,lat=center.y+side.y*u*width
      const rise=height*Math.cos(u*Math.PI/2)**2*Math.sin(t*Math.PI)**.65
      positions.push(...geographic(lon,lat,.6974+rise).toArray())
      if(i<segments&&j<across){const a=i*(across+1)+j,b=a+across+1;indices.push(a,b,b+1,a,b+1,a+1)}
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();put(part,geometry)
}

function marketObservatory() {
  const ocean = group('Continuous dark-steel ocean shell', 'steel')
  const land = group('Smooth geographic relief with coastal sidewalls', 'porcelain')
  const coast = group('Raised silver coastline seams and graticule', 'silver')
  const recess = group('Instrument bearing recesses and route terminals', 'ink')
  const meridian = group('hover-observatory-meridian-yoke', 'silver', vec(0, 0, 0), Y.clone())
  const latitudeRotation = [Math.PI / 2, .17, -.15]
  const latitude = group('hover-observatory-equatorial-index', 'steel', vec(0, 0, 0), shaftAxis(latitudeRotation))
  const scale = group('Fixed observation scale and bearing collars', 'silver')
  const routes = group('Selective raised great-circle observations', 'silver')
  const markers = group('Geographic observation pins', 'porcelain')
  const north = group('hover-observatory-north-bearing', 'silver', vec(0, .80, 0), Y.clone())
  const south = group('hover-observatory-south-bearing', 'silver', vec(0, -.80, 0), Y.clone())

  put(ocean, new THREE.SphereGeometry(.670, 64, 40))
  for (const outline of continents) {
    continent(land, outline, .697)
    const edge = coastline(outline, .700)
    tube(coast, edge, .0042, Math.max(24, edge.length * 2), 5, true)
  }
  // Sculpted generalized ranges add a second scale of geographic construction;
  // their finite tapered ends sink into the broad continent reliefs.
  for(const[path,width,height]of[
    [[[-72,-44],[-70,-26],[-76,-8],[-74,5]],1.6,.014],
    [[[-128,54],[-121,45],[-113,36],[-108,30]],1.8,.012],
    [[[73,35],[81,30],[89,28],[96,29]],1.8,.016],
    [[[6,45],[10,47],[15,46]],1.0,.009],
    [[[36,8],[37,-4],[32,-15]],1.6,.010],
    [[[145,-18],[148,-28],[145,-36]],1.1,.009],
  ])terrainRange(land,path,width,height)
  // The Antarctic cap makes the globe a whole Earth rather than disconnected plates.
  put(land, new THREE.SphereGeometry(.695, 48, 5, 0, TAU, Math.PI * .895, Math.PI * .105))
  for (const lat of [-35, 0, 35]) {
    const y = .673 * Math.sin(lat * Math.PI / 180), r = Math.sqrt(.673 ** 2 - y ** 2)
    arc(coast, r, 0, TAU, vec(0, y, 0), [Math.PI / 2, 0, 0], .0035, 80, 5)
  }
  for (const lon of [0, 60, 120]) arc(coast, .673, 0, TAU, vec(0, 0, 0), [0, lon * Math.PI / 180, 0], .0035, 96, 5)

  // The main hoop rotates around the north/south bearing axis, not an arbitrary pivot.
  channelRing(meridian, .842, .066, .046, 0, TAU, vec(0, 0, 0), [0, .20, 0], 112)
  machinedRing(meridian, .855, .010, .057, .08, TAU * .95, vec(0, 0, 0), [0, .20, 0], 96)
  for (const side of [-1, 1]) {
    rod(meridian, vec(0, side * .683, 0), vec(0, side * .852, 0), .029, 14)
    const position = vec(0, side * .802, 0)
    const part = side > 0 ? north : south
    // Stacked flat collars and stepped shafts make a believable machined bearing.
    for (const [radius, width, depth, offset] of [[.060, .024, .029, 0], [.044, .017, .038, side * .028]]) {
      machinedRing(part, radius, width, depth, 0, TAU, position.clone().add(vec(0, offset, 0)), [Math.PI / 2, 0, 0], 28)
    }
    // A flush end cap, bored center and fitted index pins close the bearing.
    machinedRing(part,.033,.014,.021,0,TAU,position.clone().add(vec(0,side*.055,0)),[Math.PI/2,0,0],28)
    for(const x of[-.041,.041])bolt(part,recess,position.clone().add(vec(x,side*.045,0)),.013,[side*Math.PI/2,0,0])
    machinedRing(recess, .042, .016, .048, 0, TAU, position, [Math.PI / 2, 0, 0], 24)
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU
      box(part, [.008, .032, .010], position.clone().add(vec(.066 * Math.cos(a), 0, .066 * Math.sin(a))), [0, -a, 0])
    }
  }
  channelRing(latitude, .936, .055, .035, -.38, TAU * .80, vec(0, 0, 0), latitudeRotation, 112)
  // One partial fixed vernier leaves a large window into the continents.
  const scaleRotation = [.20, -.16, .10]
  machinedRing(scale, 1.038, .039, .030, .16, TAU * .53, vec(0, 0, 0), scaleRotation, 88)
  for (let i = 0; i <= 40; i++) {
    const a = .22 + i / 40 * TAU * .50, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...scaleRotation))
    q.multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), a))
    const e = new THREE.Euler().setFromQuaternion(q)
    box(recess, [i % 5 === 0 ? .045 : .021, .006, .008], ringPoint(1.038, a, vec(0, 0, 0), scaleRotation, .018), [e.x, e.y, e.z])
  }


  // Six selected hubs and four routes imply observations without webbing over the Earth.
  const places = [[-74, 41], [-.1, 52], [139, 36], [104, 1], [-46, -24], [151, -34]]
  for (const [lon, lat] of places) {
    const p = geographic(lon, lat, .705), direction = p.clone().normalize()
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(vec(0, 0, 1), direction))
    const rotation = [e.x, e.y, e.z]
    machinedRing(recess, .023, .013, .016, 0, TAU, p, rotation, 20)
    const socket=new THREE.CylinderGeometry(.010,.018,.024,12,1)
    socket.rotateX(Math.PI/2)
    put(markers,socket,p.clone().addScaledVector(direction,.012),rotation)
    channelRing(markers,.024,.011,.010,0,TAU,p.clone().addScaledVector(direction,.021),rotation,20)
    rod(markers,p.clone().addScaledVector(direction,.021),p.clone().addScaledVector(direction,.042),.008,12)
    machinedRing(markers,.013,.008,.009,0,TAU,p.clone().addScaledVector(direction,.044),rotation,20)
  }
  for (const [a, b, lift] of [[0, 1, .11], [1, 3, .12], [3, 2, .09], [3, 5, .10]]) geographicPath(routes, places[a], places[b], lift)
  return [ocean, land, coast, recess, meridian, latitude, scale, routes, markers, north, south]
}

export { opportunityInstrument, marketObservatory }
