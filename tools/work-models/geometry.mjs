import * as THREE from 'three'

const TAU = Math.PI * 2
const Y = new THREE.Vector3(0, 1, 0)
const vec = (x, y, z) => new THREE.Vector3(x, y, z)

// Every source is built here from geometry; there are no external model inputs.
const materialStyles = {
  silver: { color: [.48, .47, .45, 1], metal: .38, roughness: .38 },
  steel: { color: [.29, .29, .275, 1], metal: .46, roughness: .42 },
  ink: { color: [.095, .10, .105, 1], metal: .25, roughness: .49 },
  porcelain: { color: [.57, .56, .53, 1], metal: .12, roughness: .45 },
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
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel*.75,bevelSegments:1,curveSegments:2,steps:1})
  geometry.translate(0,0,-depth/2)
  put(part,geometry,position,rotation)
}
function gear(part, radius, teeth, depth, position, rotation = [0,0,0]) {
  const shape=new THREE.Shape()
  for(let i=0;i<teeth*4;i++){
    const a=i/(teeth*4)*TAU
    const r=radius*(i%4===0||i%4===3?.87:1)
    if(i===0)shape.moveTo(r*Math.cos(a),r*Math.sin(a));else shape.lineTo(r*Math.cos(a),r*Math.sin(a))
  }
  shape.closePath()
  const hole=new THREE.Path();hole.absarc(0,0,radius*.43,0,TAU,true);shape.holes.push(hole)
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:radius*.025,bevelThickness:radius*.025,bevelSegments:1,curveSegments:12,steps:1})
  geometry.translate(0,0,-depth/2);put(part,geometry,position,rotation)
  // Spokes and an axial collar remain distinct under rotation.
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const at=(r,a,z=0)=>vec(r*Math.cos(a),r*Math.sin(a),z).applyQuaternion(q).add(position)
  for(let i=0;i<5;i++)rod(part,at(radius*.09,i/5*TAU),at(radius*.51,i/5*TAU),radius*.032,6)
  arc(part,radius*.13,0,TAU,position,rotation,radius*.048,24,8)
}
function bevelTriangle(part,a,b,c,thickness=.03){
  const tangent=b.clone().sub(a).normalize()
  const normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize()
  const bitangent=normal.clone().cross(tangent)
  const relative=c.clone().sub(a)
  const shape=new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(a.distanceTo(b),0),new THREE.Vector2(relative.dot(tangent),relative.dot(bitangent))])
  const g=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSize:.007,bevelThickness:.008,bevelSegments:2,curveSegments:1,steps:1})
  g.translate(0,0,-thickness/2)
  g.applyMatrix4(new THREE.Matrix4().makeBasis(tangent,bitangent,normal));put(part,g,a)
}


export { TAU, Y, vec, materialStyles, group, shaftAxis, put, tube, arc, rod, box, jewel, edgesOf, trianglePlate, bevelBox, gear, bevelTriangle }

/** Flat annular faces, small bevels and capped ends read as machined metal. */
export function machinedRing(part, radius, width, depth, start = 0, length = TAU, position = vec(0,0,0), rotation = [0,0,0], segments = 96) {
  const b=Math.min(width,depth)*.22
  const profile=[[-width/2+b,-depth/2],[width/2-b,-depth/2],[width/2,-depth/2+b],[width/2,depth/2-b],[width/2-b,depth/2],[-width/2+b,depth/2],[-width/2,depth/2-b],[-width/2,-depth/2+b]]
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
  if(length<TAU-1e-6)for(const end of[0,1]){
    const t=start+end*length,base=positions.length/3
    for(const p of profile){positions.push((radius+p[0])*Math.cos(t),(radius+p[0])*Math.sin(t),p[1]);normals.push((end?1:-1)*-Math.sin(t),(end?1:-1)*Math.cos(t),0)}
    for(let i=1;i<profile.length-1;i++)indices.push(...(end?[base,base+i+1,base+i]:[base,base+i,base+i+1]))
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
