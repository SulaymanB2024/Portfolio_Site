import * as THREE from 'three'
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'

const TAU = Math.PI * 2
const Y = new THREE.Vector3(0, 1, 0)
const vec = (x, y, z) => new THREE.Vector3(x, y, z)

// Every source is built here from geometry; there are no external model inputs.
const materialStyles = {
  silver: { color: [.56, .535, .49, 1], metal: .92, roughness: .23 },
  steel: { color: [.285, .285, .27, 1], metal: .84, roughness: .36 },
  pewter: { color: [.38, .365, .34, 1], metal: .88, roughness: .34 },
  ink: { color: [.085, .085, .080, 1], metal: .16, roughness: .78 },
  porcelain: { color: [.57, .555, .52, 1], metal: .025, roughness: .40 },
}
function group(name, material, pivot = null, axis = Y.clone()) { return { name, material, geometries: [], pivot, axis } }
const shaftAxis = rotation => vec(0,0,1).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)))
function put(part, geometry, position = vec(0, 0, 0), rotation = [0, 0, 0], scale = [1, 1, 1]) {
  geometry.scale(...scale)
  geometry.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)))
  geometry.translate(position.x, position.y, position.z)
  // Merge a consistent position/normal/index schema; drop unused UV attributes.
  geometry.deleteAttribute('uv')
  if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.getAttribute('position').count }, (_, i) => i))
  part.geometries.push(geometry)
}
function tube(part, points, radius = .013, segments = 48, sides = 8, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal')
  put(part, new THREE.TubeGeometry(curve, segments, radius, sides, closed))
}
function arc(part, radius, start = 0, length = TAU, position = vec(0, 0, 0), rotation = [0, 0, 0], thickness = .013, segments = 80, sides = 8) {
  put(part, new THREE.TorusGeometry(radius, thickness, sides, segments, length), position, [rotation[0], rotation[1], rotation[2] + start])
}
function rod(part, a, b, radius = .014, sides = 8) {
  const delta = b.clone().sub(a)
  const geometry = new THREE.CylinderGeometry(radius, radius, delta.length(), sides, 1)
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, delta.clone().normalize()))
  put(part, geometry, a.clone().add(b).multiplyScalar(.5))
}
function box(part, dimensions, position, rotation = [0, 0, 0]) { put(part, new THREE.BoxGeometry(...dimensions), position, rotation) }
function jewel(part, position, radius = .035, detail = 0, scale = [1, 1, 1]) { put(part, new THREE.IcosahedronGeometry(radius, detail), position, [0, 0, 0], scale) }
function edgesOf(geometry) {
  const edges = new THREE.EdgesGeometry(geometry)
  const p = edges.getAttribute('position')
  const segments = []
  for (let i = 0; i < p.count; i += 2) segments.push([vec(p.getX(i), p.getY(i), p.getZ(i)), vec(p.getX(i+1), p.getY(i+1), p.getZ(i+1))])
  edges.dispose()
  return segments
}
function trianglePlate(part, a, b, c, thickness = .025) {
  const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize().multiplyScalar(thickness / 2)
  const positions = [a,b,c].map(p => p.clone().add(normal)).concat([a,b,c].map(p => p.clone().sub(normal))).flatMap(p => [p.x,p.y,p.z])
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex([0,1,2,5,4,3,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0])
  const flat = geometry.toNonIndexed()
  flat.computeVertexNormals()
  geometry.dispose()
  put(part, flat)
}

function bevelBox(part, width, height, depth, position, rotation = [0,0,0], bevel = .012) {
  const shape=new THREE.Shape()
  const r=Math.min(bevel*2,width/5,height/5)
  shape.moveTo(-width/2+r,-height/2)
  shape.lineTo(width/2-r,-height/2);shape.quadraticCurveTo(width/2,-height/2,width/2,-height/2+r)
  shape.lineTo(width/2,height/2-r);shape.quadraticCurveTo(width/2,height/2,width/2-r,height/2)
  shape.lineTo(-width/2+r,height/2);shape.quadraticCurveTo(-width/2,height/2,-width/2,height/2-r)
  shape.lineTo(-width/2,-height/2+r);shape.quadraticCurveTo(-width/2,-height/2,-width/2+r,-height/2)
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel*.75,bevelSegments:2,curveSegments:4,steps:1})
  geometry.translate(0,0,-depth/2)
  put(part,finishBevel(geometry),position,rotation)
}
function gear(part, radius, teeth, depth, position, rotation = [0,0,0]) {
  const shape=new THREE.Shape()
  // Root, sloped shoulder and flat tooth crown read as cut metal, not a cog icon.
  const toothProfile=[.87,.87,.952,1,1,.952]
  for(let i=0;i<teeth*6;i++){
    const a=i/(teeth*6)*TAU
    const r=radius*toothProfile[i%6]
    if(i===0)shape.moveTo(r*Math.cos(a),r*Math.sin(a));else shape.lineTo(r*Math.cos(a),r*Math.sin(a))
  }
  shape.closePath()
  const hole=new THREE.Path();hole.absarc(0,0,radius*.43,0,TAU,true);shape.holes.push(hole)
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:radius*.019,bevelThickness:radius*.022,bevelSegments:2,curveSegments:12,steps:1})
  geometry.translate(0,0,-depth/2);put(part,finishBevel(geometry),position,rotation)
  // Tapered cut spokes carry load into a stepped, bored hub. The broad planar
  // shoulders remain readable where cylindrical spokes previously looked thin.
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const at=(r,a,z=0)=>vec(r*Math.cos(a),r*Math.sin(a),z).applyQuaternion(q).add(position)
  for(let i=0;i<5;i++){
    const spoke=new THREE.Shape([
      new THREE.Vector2(radius*.105,-radius*.044),new THREE.Vector2(radius*.50,-radius*.026),
      new THREE.Vector2(radius*.50,radius*.026),new THREE.Vector2(radius*.105,radius*.044),
    ])
    const cut=new THREE.ExtrudeGeometry(spoke,{depth:depth*.64,bevelEnabled:true,bevelSize:radius*.009,bevelThickness:radius*.010,bevelSegments:2,curveSegments:1,steps:1})
    cut.translate(0,0,-depth*.32)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),i/5*TAU)))
    put(part,finishBevel(cut),position,[e.x,e.y,e.z])
  }
  channelRing(part,radius*.145,radius*.09,depth*1.12,0,TAU,position,rotation,24)
  machinedRing(part,radius*.103,radius*.029,depth*.40,0,TAU,at(0,0,depth*.56),rotation,20)
}
function bevelTriangle(part,a,b,c,thickness=.03){
  const tangent=b.clone().sub(a).normalize()
  const normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize()
  const bitangent=normal.clone().cross(tangent)
  const relative=c.clone().sub(a)
  const shape=new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(a.distanceTo(b),0),new THREE.Vector2(relative.dot(tangent),relative.dot(bitangent))])
  const g=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSize:.007,bevelThickness:.008,bevelSegments:2,curveSegments:1,steps:1})
  g.translate(0,0,-thickness/2)
  g.applyMatrix4(new THREE.Matrix4().makeBasis(tangent,bitangent,normal));put(part,finishBevel(g),a)
}

/** Smooth small bevel/curve transitions while retaining broad planar shoulders. */
function finishBevel(geometry) {
  const finished=toCreasedNormals(geometry,Math.PI*2/9)
  geometry.dispose()
  return finished
}

/** A genuinely pierced service frame, with a recessed opening and round corners. */
function bevelFrame(part,width,height,depth,openingWidth,openingHeight,position,rotation=[0,0,0],bevel=.005) {
  const shape=new THREE.Shape()
  const radius=Math.min(bevel*2,width/8,height/8)
  shape.moveTo(-width/2+radius,-height/2)
  shape.lineTo(width/2-radius,-height/2);shape.quadraticCurveTo(width/2,-height/2,width/2,-height/2+radius)
  shape.lineTo(width/2,height/2-radius);shape.quadraticCurveTo(width/2,height/2,width/2-radius,height/2)
  shape.lineTo(-width/2+radius,height/2);shape.quadraticCurveTo(-width/2,height/2,-width/2,height/2-radius)
  shape.lineTo(-width/2,-height/2+radius);shape.quadraticCurveTo(-width/2,-height/2,-width/2+radius,-height/2)
  const hole=new THREE.Path()
  hole.moveTo(-openingWidth/2,-openingHeight/2);hole.lineTo(-openingWidth/2,openingHeight/2)
  hole.lineTo(openingWidth/2,openingHeight/2);hole.lineTo(openingWidth/2,-openingHeight/2);hole.closePath()
  shape.holes.push(hole)
  const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel*.75,bevelSegments:2,curveSegments:3,steps:1})
  g.translate(0,0,-depth/2)
  put(part,finishBevel(g),position,rotation)
}

export { TAU, Y, vec, materialStyles, group, shaftAxis, put, tube, arc, rod, box, jewel, edgesOf, trianglePlate, bevelBox, gear, bevelTriangle, bevelFrame, finishBevel }

/** Flat annular faces, small bevels and capped ends read as machined metal. */
export function machinedRing(part, radius, width, depth, start = 0, length = TAU, position = vec(0,0,0), rotation = [0,0,0], segments = 96) {
  const b=Math.min(width,depth)*.22
  const profile=[[-width/2+b,-depth/2],[width/2-b,-depth/2],[width/2,-depth/2+b],[width/2,depth/2-b],[width/2-b,depth/2],[-width/2+b,depth/2],[-width/2,depth/2-b],[-width/2,-depth/2+b]]
  sweepRingProfile(part,radius,profile,start,length,position,rotation,segments)
}

/** A real recessed annular channel, with broad lips and sloping cut shoulders. */
export function channelRing(part,radius,width,depth,start=0,length=TAU,position=vec(0,0,0),rotation=[0,0,0],segments=96) {
  const b=Math.min(width,depth)*.17,grooveDepth=depth*.30,halfGroove=width*.18
  const profile=[
    [-width/2+b,-depth/2],[width/2-b,-depth/2],[width/2,-depth/2+b],
    [width/2,depth/2-b],[width/2-b,depth/2],[halfGroove,depth/2],
    [halfGroove*.69,depth/2-grooveDepth],[-halfGroove*.69,depth/2-grooveDepth],
    [-halfGroove,depth/2],[-width/2+b,depth/2],[-width/2,depth/2-b],[-width/2,-depth/2+b],
  ]
  sweepRingProfile(part,radius,profile,start,length,position,rotation,segments)
}

function sweepRingProfile(part,radius,profile,start,length,position,rotation,segments) {
  const positions=[],normals=[],indices=[]
  for(let edge=0;edge<profile.length;edge++){
    const a=profile[edge],c=profile[(edge+1)%profile.length]
    const n=new THREE.Vector2(c[1]-a[1],a[0]-c[0]).normalize()
    const base=positions.length/3
    for(let i=0;i<=segments;i++){
      const t=start+i/segments*length,cos=Math.cos(t),sin=Math.sin(t)
      for(const p of[a,c]){positions.push((radius+p[0])*cos,(radius+p[0])*sin,p[1]);normals.push(n.x*cos,n.x*sin,n.y)}
      if(i<segments){const k=base+i*2;indices.push(k,k+2,k+3,k,k+3,k+1)}
    }
  }
  const capTriangles=THREE.ShapeUtils.triangulateShape(profile.map(([x,y])=>new THREE.Vector2(x,y)),[])
  if(length<TAU-1e-6)for(const end of[0,1]){
    const t=start+end*length,base=positions.length/3
    for(const p of profile){positions.push((radius+p[0])*Math.cos(t),(radius+p[0])*Math.sin(t),p[1]);normals.push((end?1:-1)*-Math.sin(t),(end?1:-1)*Math.cos(t),0)}
    for(const[a,b,c]of capTriangles)indices.push(...(end?[base+a,base+c,base+b]:[base+a,base+b,base+c]))
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices);put(part,g,position,rotation)
}

export function bolt(head, slots, position, radius = .025, rotation = [0,0,0]) {
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const at=(x,y,z)=>vec(x,y,z).applyQuaternion(q).add(position)
  const g=new THREE.CylinderGeometry(radius*.78,radius,radius*.36,12,1);g.rotateX(Math.PI/2);put(head,g,position,rotation)
  machinedRing(head,radius*.85,radius*.23,radius*.22,0,TAU,at(0,0,radius*.15),rotation,16)
  box(slots,[radius*1.1,radius*.15,radius*.10],at(0,0,radius*.25),rotation)
}
