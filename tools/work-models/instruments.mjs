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
      const p = center.clone().add(vec((index ? 1 : -1) * .039 + x * 1.12, y * 1.12, .007))
      // Wider graphite inlays clear the porcelain front instead of being hidden
      // beneath pale raised strokes. Their squared shoulders survive halftone.
      box(recess, [w * 1.12, h * 1.12, .007], p)
    }
  }
}

function opportunityInstrument() {
  const center = vec(0, .045, -.15)
  const clockRotation = [.055, -.10, -.085]
  const clock = group('hover-clock-machined-crescent', 'silver', center, shaftAxis(clockRotation))
  const orbitalCenter = vec(0, .045, -.31)
  const orbitalRotation = [.28, -.31, .14]
  const orbital = group('hover-register-rear-crescent', 'steel', orbitalCenter, shaftAxis(orbitalRotation))
  const dialCenter = vec(.015, .045, -.035)
  const dialRotation = [-.06, .10, .02]
  const dial = group('hover-register-inner-index', 'silver', dialCenter, shaftAxis(dialRotation))
  const face = group('Embossed twelve-position ordinal register', 'porcelain')
  const recess = group('Recessed calendar wells and engraved indexes', 'ink')
  const chassis = group('Precision chassis standoffs and fasteners', 'silver')
  const backing = group('Open rear carriage and escapement bridge', 'steel')
  const pendulumPivot = vec(.39, -.40, .29)
  const pendulum = group('hover-register-escapement-pendulum', 'porcelain', pendulumPivot, vec(0, 0, 1))
  const primaryPosition = vec(-.48, -.65, -.19)
  const secondaryPosition = primaryPosition.clone().add(vec(.318*Math.cos(-.37),.318*Math.sin(-.37),0).applyEuler(new THREE.Euler(.08,-.10,0)))
  const driveRotation = [.08, -.10, 0]
  const primary = group('hover-register-primary-gear', 'silver', primaryPosition, shaftAxis(driveRotation))
  const secondary = group('hover-register-transfer-gear', 'silver', secondaryPosition, shaftAxis(driveRotation))

  // Capped rectangular sections, flat front faces and fine chamfers replace tubes.
  channelRing(clock, .925, .073, .051, .05, TAU * .82, center, clockRotation, 128)
  machinedRing(clock, .905, .009, .059, .11, TAU * .79, center, clockRotation, 112)
  machinedRing(orbital, .996, .042, .039, -.61, TAU * .68, orbitalCenter, orbitalRotation, 112)
  channelRing(dial, .804, .027, .021, .49, TAU * .62, dialCenter, dialRotation, 96)
  for (let i = 0; i < 49; i++) {
    const angle = .16 + i / 48 * TAU * .765
    const major = i % 4 === 0
    const rotation = new THREE.Euler(...clockRotation)
    const q = new THREE.Quaternion().setFromEuler(rotation).multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), angle))
    const e = new THREE.Euler().setFromQuaternion(q)
    // Inlaid radial scale strokes sit inside the cut channel rather than above
    // an otherwise flat rail. A second short shoulder shows the major intervals.
    box(clock, [major ? .043 : .020, .005, .007], ringPoint(.925, angle, center, clockRotation, .016), [e.x, e.y, e.z])
    if(major)box(clock,[.009,.006,.008],ringPoint(.951,angle,center,clockRotation,.031),[e.x,e.y,e.z])
  }
  // Three visible planes: the rear mechanism, open carriage, and readable tiles.
  for (const x of [-.507, .507]) {
    bevelBox(chassis, .053, 1.153, .086, vec(x, .025, -.145), [0, 0, 0], .008)
    box(recess, [.009, .96, .005], vec(x, .025, -.096))
  }
  for (const y of [-.551, .602]) {
    bevelBox(chassis, 1.050, .061, .086, vec(0, y, -.145), [0, 0, 0], .008)
    for (const x of [-.464, .464]) bolt(chassis, recess, vec(x, y, -.089), .025)
  }
  // Forward date plates occupy the front plane; open rings stay behind their faces.
  // Four fitted retention shoes wrap the carriage corners. The well gaps and
  // ordinal plates remain open while the layered register gains real joinery.
  for(const x of[-.424,.424])for(const y of[-.458,.522]){
    bevelFrame(chassis,.055,.068,.020,.021,.037,vec(x,y,.225),[0,0,x<0?-.08:.08],.0035)
    bevelBox(backing,.058,.032,.22,vec(x,y,.062),[0,0,0],.0035)
  }
  for (let row = 0; row < 4; row++) {
    const y = .410 - row * .263
    // A stepped bridge supports each row without closing the gaps between cells.
    bevelBox(backing, .930, .040, .050, vec(0, y, -.193), [0, 0, 0], .005)
    for (let col = 0; col < 3; col++) {
      const x = (col - 1) * .297
      const z = .221 + (col === 1 ? .010 : 0)
      bevelBox(recess, .266, .207, .056, vec(x, y, z - .028), [0, 0, 0], .008)
      bevelBox(face, .237, .179, .030, vec(x, y, z + .015), [0, 0, 0], .010)
      ordinal(recess, row * 3 + col + 1, vec(x, y - .008, z + .038))
      // Binding eyes and a short recessed header make this read as a calendar.
      for (const dx of [-.082, .082]) {
        machinedRing(chassis, .017, .009, .014, 0, TAU, vec(x + dx, y + .088, z + .024), [0, 0, 0], 10)
        rod(chassis, vec(x + dx, y, -.145), vec(x + dx, y, z - .050), .013, 10)
        machinedRing(chassis, .019, .008, .023, 0, TAU, vec(x + dx, y, -.095), [0, 0, 0], 10)
      }
      box(recess, [.126, .007, .007], vec(x, y + .062, z + .035))
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
  bevelFrame(backing, .47, .095, .040, .34, .035, vec(-.333, -.712, -.301), [0, 0, -.33], .006)
  for (const position of [primaryPosition, secondaryPosition]) {
    const anchor=position.clone().addScaledVector(shaftAxis(driveRotation),-.093)
    bolt(chassis,recess,anchor,.024,[driveRotation[0],Math.PI+driveRotation[1],driveRotation[2]])
  }
  // The bob and stem share one real hinge and articulate together.
  rod(pendulum, pendulumPivot, vec(.39, -.965, .29), .016, 10)
  bevelBox(pendulum, .142, .185, .065, vec(.39, -.929, .29), [0, 0, -.06], .022)
  machinedRing(pendulum, .025, .014, .035, 0, TAU, pendulumPivot, [0, 0, 0], 20)
  bolt(chassis, recess, pendulumPivot.clone().add(vec(0, 0, -.035)), .036)
  // A small perforated rear bridge ties the crescents to the register carriage.
  for (const side of [-1, 1]) {
    rod(backing, vec(side * .507, .555, -.193), vec(side * .64, .65, -.29), .022, 10)
    bolt(chassis, recess, vec(side * .635, .64, -.257), .027)
    machinedRing(backing, .059, .023, .045, 0, TAU, vec(side * .635, .64, -.295), [0, 0, 0], 28)
  }
  return [clock, orbital, dial, face, recess, chassis, backing, pendulum, primary, secondary]
}

// Hand-authored generalized coastlines: geography is geometry, not texture masks.
// Eurasia is one connected plate, so the observer never sees an invented seam
// across the continental interior. Islands retain generous shapes at phone size.
const continents = [
  // Africa: Atlantic bulge, Gulf of Guinea, Horn, Mozambique and the Cape.
  [[-17,37],[-7,36],[0,36],[9,37],[12,34],[20,33],[25,32],[32,31],[34,27],[35,23],[38,18],[42,14],[45,12],[51,12],[49,8],[46,5],[43,0],[42,-5],[40,-10],[37,-14],[35,-20],[35,-25],[32,-29],[28,-33],[23,-35],[18,-35],[16,-29],[12,-24],[12,-18],[9,-15],[8,-10],[3,-5],[-1,5],[-8,5],[-13,9],[-16,13],[-17,20],[-16,25],[-13,28],[-10,32]],
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

function coastline(outline, radius) {
  const result = []
  for (let i = 0; i < outline.length; i++) {
    const a = geographic(...outline[i], 1), b = geographic(...outline[(i + 1) % outline.length], 1)
    const angle = a.angleTo(b), count = Math.max(1, Math.ceil(angle / .045))
    for (let j = 0; j < count; j++) {
      const t = j / count
      const p = angle < 1e-6 ? a.clone() : a.clone().multiplyScalar(Math.sin((1-t)*angle)/Math.sin(angle)).addScaledVector(b, Math.sin(t*angle)/Math.sin(angle))
      result.push(p.normalize().multiplyScalar(radius))
    }
  }
  return result
}

function continent(part, outline, radius) {
  const points = outline.map(([lon, lat]) => new THREE.Vector2(lon, lat))
  const triangles = THREE.ShapeUtils.triangulateShape(points, [])
  const positions = [], normals = []
  function facet(a, b, c, depth = 0) {
    const vertices = [a, b, c].map(p => geographic(p.x, p.y, radius))
    const spans = [vertices[0].angleTo(vertices[1]), vertices[1].angleTo(vertices[2]), vertices[2].angleTo(vertices[0])]
    const longest = spans.indexOf(Math.max(...spans))
    // Only long edges split. Shared edges receive the same spherical midpoint,
    // avoiding broad planar facets without uniformly multiplying tiny islands.
    if (spans[longest] > .135 && depth < 12) {
      if (longest === 0) { const m = a.clone().add(b).multiplyScalar(.5); facet(a,m,c,depth+1); facet(m,b,c,depth+1) }
      else if (longest === 1) { const m = b.clone().add(c).multiplyScalar(.5); facet(a,b,m,depth+1); facet(a,m,c,depth+1) }
      else { const m = c.clone().add(a).multiplyScalar(.5); facet(a,b,m,depth+1); facet(m,b,c,depth+1) }
      return
    }
    const normal = vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0]))
    if (normal.lengthSq() < 1e-18) return
    if (normal.dot(vertices[0]) < 0) [vertices[1], vertices[2]] = [vertices[2], vertices[1]]
    for (const point of vertices) { positions.push(...point.toArray()); normals.push(...point.clone().normalize().toArray()) }
  }
  for (const indexes of triangles) facet(...indexes.map(index => points[index]))
  const face = new THREE.BufferGeometry()
  face.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  face.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  put(part, face)
  // A broad pale top, narrow beveled coast and dark ocean separate at three scales.
  const coast = coastline(outline, radius), wall = [], index = []
  const clockwise = THREE.ShapeUtils.isClockWise(points)
  for (let i = 0; i < coast.length; i++) {
    const p = coast[i], tangent = coast[(i+1)%coast.length].clone().sub(coast[(i+coast.length-1)%coast.length]).normalize()
    const inward = p.clone().normalize().cross(tangent).normalize().multiplyScalar(clockwise ? -1 : 1)
    const shoulder = p.clone().multiplyScalar((radius-.005)/radius).addScaledVector(inward,-.002)
    const base = p.clone().multiplyScalar((radius-.029)/radius).addScaledVector(inward,-.002)
    wall.push(...p.toArray(),...shoulder.toArray(),...base.toArray())
  }
  for (let i = 0; i < coast.length; i++) for (let level=0; level<2; level++) {
    const a=i*3+level,b=(i+1)%coast.length*3+level
    index.push(a,a+1,b,a+1,b+1,b)
  }
  const walls = new THREE.BufferGeometry()
  walls.setAttribute('position',new THREE.Float32BufferAttribute(wall,3)); walls.setIndex(index); walls.computeVertexNormals()
  put(part,finishBevel(walls))
}

function geographicPath(part, from, to, lift, radius = .0035) {
  const a=geographic(...from,1),b=geographic(...to,1),angle=a.angleTo(b),points=[]
  for (let i=0; i<=32; i++) {
    const t=i/32
    const p=a.clone().multiplyScalar(Math.sin((1-t)*angle)/Math.sin(angle)).addScaledVector(b,Math.sin(t*angle)/Math.sin(angle))
    points.push(p.normalize().multiplyScalar(.741+Math.sin(t*Math.PI)*lift))
  }
  tube(part,points,radius,48,6)
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
      positions.push(...geographic(lon,lat,.7354+rise).toArray())
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
  const north = group('hover-observatory-north-bearing', 'silver', vec(0, .816, 0), Y.clone())
  const south = group('hover-observatory-south-bearing', 'silver', vec(0, -.816, 0), Y.clone())

  put(ocean, new THREE.SphereGeometry(.708, 72, 44))
  for (const outline of continents) {
    continent(land, outline, .735)
    const edge = coastline(outline, .738)
    tube(coast, edge, .0036, Math.max(16, edge.length), 5, true)
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
  put(land, new THREE.SphereGeometry(.733, 56, 5, 0, TAU, Math.PI * .895, Math.PI * .105))
  for (const lat of [-35, 0, 35]) {
    const y = .711 * Math.sin(lat * Math.PI / 180), r = Math.sqrt(.711 ** 2 - y ** 2)
    arc(coast, r, 0, TAU, vec(0, y, 0), [Math.PI / 2, 0, 0], .0029, 80, 5)
  }
  for (const lon of [0, 60, 120]) arc(coast, .711, 0, TAU, vec(0, 0, 0), [0, lon * Math.PI / 180, 0], .0029, 96, 5)

  // The main hoop rotates around the north/south bearing axis, not an arbitrary pivot.
  channelRing(meridian, .866, .049, .040, 0, TAU, vec(0, 0, 0), [0, .20, 0], 112)
  machinedRing(meridian, .876, .008, .047, .08, TAU * .95, vec(0, 0, 0), [0, .20, 0], 96)
  for (const side of [-1, 1]) {
    rod(meridian, vec(0, side * .728, 0), vec(0, side * .866, 0), .029, 14)
    const position = vec(0, side * .816, 0)
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
  channelRing(latitude, .933, .039, .029, -.38, TAU * .80, vec(0, 0, 0), latitudeRotation, 112)
  // One partial fixed vernier leaves a large window into the continents.
  const scaleRotation = [.20, -.16, .10]
  machinedRing(scale, .982, .029, .026, .16, TAU * .53, vec(0, 0, 0), scaleRotation, 88)
  for (let i = 0; i <= 40; i++) {
    const a = .22 + i / 40 * TAU * .50, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...scaleRotation))
    q.multiply(new THREE.Quaternion().setFromAxisAngle(vec(0, 0, 1), a))
    const e = new THREE.Euler().setFromQuaternion(q)
    box(recess, [i % 5 === 0 ? .045 : .021, .006, .008], ringPoint(.982, a, vec(0, 0, 0), scaleRotation, .018), [e.x, e.y, e.z])
  }


  // Six selected hubs and four routes imply observations without webbing over the Earth.
  const places = [[-74, 41], [-.1, 52], [139, 36], [104, 1], [-46, -24], [151, -34]]
  for (const [lon, lat] of places) {
    const p = geographic(lon, lat, .742), direction = p.clone().normalize()
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(vec(0, 0, 1), direction))
    const rotation = [e.x, e.y, e.z]
    machinedRing(recess, .019, .011, .012, 0, TAU, p, rotation, 20)
    const socket=new THREE.CylinderGeometry(.009,.015,.020,12,1)
    socket.rotateX(Math.PI/2)
    put(markers,socket,p.clone().addScaledVector(direction,.009),rotation)
    channelRing(markers,.020,.009,.008,0,TAU,p.clone().addScaledVector(direction,.017),rotation,20)
    rod(markers,p.clone().addScaledVector(direction,.017),p.clone().addScaledVector(direction,.030),.008,12)
    machinedRing(markers,.011,.007,.008,0,TAU,p.clone().addScaledVector(direction,.032),rotation,20)
  }
  for (const [a, b, lift] of [[0, 1, .065], [1, 3, .078], [3, 2, .060], [3, 5, .065]]) geographicPath(routes, places[a], places[b], lift)
  return [ocean, land, coast, recess, meridian, latitude, scale, routes, markers, north, south]
}

export { opportunityInstrument, marketObservatory }
