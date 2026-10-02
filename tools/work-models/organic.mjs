import * as THREE from 'three'
import { TAU, Y, vec, group, shaftAxis, put, tube, rod, jewel, bevelBox, gear, bevelTriangle, machinedRing, bolt, finishBevel } from './geometry.mjs'

function headPoint(theta, phi) {
  const y = Math.sin(phi) * .83 + .06
  const taper = 1 - .20 * Math.exp(-(((y+.63)/.19)**2)) + .105 * Math.exp(-(((y+.38)/.18)**2))
  const cheekWidth=.023*Math.exp(-(((y+.04)/.22)**2))*Math.exp(-(((Math.abs(theta)-.85)/.35)**2))
  const x = Math.sin(theta)*Math.cos(phi)*.54*taper + Math.sign(theta)*cheekWidth
  let z = Math.cos(theta)*Math.cos(phi)*.55
  const front = Math.exp(-((theta/.65)**4))
  const nose = .155*Math.exp(-(((y+.07)/.12)**2)) * Math.exp(-((theta/.19)**2)) + .075*Math.exp(-(((y-.16)/.23)**2)) * Math.exp(-((theta/.16)**2))
  const lip = .046*Math.exp(-(((y+.28)/.055)**2)) * Math.exp(-((theta/.37)**2))
  const eye = -.082*Math.exp(-(((y-.19)/.072)**2)) * Math.exp(-(((Math.abs(theta)-.33)/.13)**2))
  const cheek=.082*Math.exp(-(((y+.13)/.18)**2))*Math.exp(-(((Math.abs(theta)-.61)/.23)**2))
  const chin=.045*Math.exp(-(((y+.56)/.12)**2))*Math.exp(-((theta/.55)**2))
  const temple=-.023*Math.exp(-(((y-.28)/.24)**2))*Math.exp(-(((Math.abs(theta)-1.08)/.24)**2))
  z += front * (nose + lip + eye + cheek + chin) + temple
  return vec(x,y,z)
}
function headPatch(theta0, theta1, phi0, phi1, cols = 32, rows = 36, eyes = false) {
  return sampledSurface((u,v)=>headPoint(theta0+(theta1-theta0)*u,phi0+(phi1-phi0)*v),cols,rows,(u,v)=>{
    const theta=theta0+(theta1-theta0)*u
    const phi=phi0+(phi1-phi0)*v
    const eyeX=(Math.abs(theta)-.40)/.235
    const lidHeight=(phi>.17?.059:.036)*Math.max(0,1-eyeX*eyeX)
    return !(eyes&&Math.abs(eyeX)<1&&Math.abs(phi-.17)<lidHeight)
  })
}
/** Compact a sampled surface so apertures cannot leave unused zero normals. */
function sampledSurface(sample, columns, rows, retain = () => true, windowDepth = 0) {
  const positions=[],normals=[],indices=[]
  const epsilon=.0001
  for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
    const u=col/columns,v=row/rows
    const tangent=sample(u+epsilon,v).sub(sample(u-epsilon,v))
    const bitangent=sample(u,Math.min(1,v+epsilon)).sub(sample(u,Math.max(0,v-epsilon)))
    // Derivatives retain smooth anatomical and ridged-lobe lighting even at a
    // cut-window boundary; triangle averages flatten those silhouettes.
    const normal=tangent.cross(bitangent).normalize()
    positions.push(...sample(u,v).toArray());normals.push(...normal.toArray())
  }
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++)if(retain((col+.5)/columns,(row+.5)/rows)){
    const a=row*(columns+1)+col,b=a+1,c=a+columns+1,d=c+1
    indices.push(a,b,d,a,d,c)
  }
  const used=[...new Set(indices)],remap=new Map(used.map((vertex,index)=>[vertex,index]))
  const compact=used.flatMap(vertex=>positions.slice(vertex*3,vertex*3+3))
  const compactNormals=used.flatMap(vertex=>normals.slice(vertex*3,vertex*3+3))
  const compactIndices=indices.map(index=>remap.get(index))
  if(windowDepth){
    const edges=new Map()
    for(let i=0;i<indices.length;i+=3)for(const[a,b]of[[indices[i],indices[i+1]],[indices[i+1],indices[i+2]],[indices[i+2],indices[i]]]){
      const key=a<b?`${a}:${b}`:`${b}:${a}`
      if(edges.has(key))edges.get(key).count++;else edges.set(key,{a,b,count:1})
    }
    for(const{a,b,count}of edges.values()){
      const rowA=Math.floor(a/(columns+1)),rowB=Math.floor(b/(columns+1)),colA=a%(columns+1),colB=b%(columns+1)
      if(count!==1||(rowA===rowB&&(rowA===0||rowA===rows))||(colA===colB&&(colA===0||colA===columns)))continue
      const outerA=vec(...positions.slice(a*3,a*3+3)),outerB=vec(...positions.slice(b*3,b*3+3))
      const innerA=outerA.clone().addScaledVector(vec(...normals.slice(a*3,a*3+3)),-windowDepth)
      const innerB=outerB.clone().addScaledVector(vec(...normals.slice(b*3,b*3+3)),-windowDepth)
      const normal=outerB.clone().sub(outerA).cross(innerA.clone().sub(outerA)).normalize(),base=compact.length/3
      for(const point of[outerA,innerA,outerB,innerB]){compact.push(...point.toArray());compactNormals.push(...normal.toArray())}
      compactIndices.push(base,base+2,base+1,base+2,base+3,base+1)
    }
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(compact,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(compactNormals,3));geometry.setIndex(compactIndices)
  return geometry
}

function earShell(side) {
  return sampledSurface((u,v)=>{
    const a=u*TAU,r=.20+v*.80
    return vec(side*(.526+.026*r+.012*Math.sin(a)),.04+Math.sin(a)*.178*r,-.055+Math.cos(a)*.091*r+.020*Math.sin(a))
  },32,5)
}

const brainCenter=()=>vec(0,.585,-.018)
function lobePoint(side,angle,latitude) {
  // Broad lobes have actual ridged volume; their sulci are not an outer wire cage.
  const phase=angle*5+Math.sin(latitude*3)*1.20+side*.4+.26*Math.sin(angle*2-latitude*3)
  const ridge=.019*Math.cos(phase)+.006*Math.sin(latitude*9+angle*2)
  const radial=1+ridge/.24
  return vec(side*.215+Math.sin(angle)*Math.cos(latitude)*.205*radial,.585+Math.sin(latitude)*.355*radial,-.018+Math.cos(angle)*Math.cos(latitude)*.365*radial)
}
function brainLobe(side) {
  return sampledSurface((u,v)=>lobePoint(side,u*TAU,-1.48+v*2.96),48,32,(u,v)=>{
    const a=u*TAU,lat=-1.48+v*2.96
    // Intentional access windows reveal the sparse interior relay, not a noisy wire ball.
    return !((Math.abs(a-2.05)<.22&&Math.abs(lat-.03)<.27)||(Math.abs(a-4.56)<.18&&Math.abs(lat+.38)<.18))
  },.021)
}

function syntheticMind() {
  const face=group('Sculpted anatomical face and ears','porcelain')
  const skull=group('Temporal and occipital structure','steel')
  const sutures=group('Structural cranial sutures','silver')
  const lobes=group('hover-sculpted-cortical-lobes','steel',brainCenter(),Y.clone())
  const gyri=group('hover-organic-cortical-gyri','silver',brainCenter(),Y.clone())
  const relay=group('hover-subcortical-relay-points','porcelain',brainCenter(),Y.clone())
  const connections=group('hover-subcortical-pathways','ink',brainCenter(),Y.clone())
  const neck=group('Cervical attachment and brain stem','silver')
  const recess=group('Recessed anatomical details','ink')
  // A wider cheek/jaw assembly connects the face to real temples and ears.
  put(face,headPatch(-1.18,1.18,-1.10,.47,48,44,true))
  put(skull,headPatch(1.20,2.34,-.83,.40,14,24))
  put(skull,headPatch(-2.34,-1.20,-.83,.40,14,24))
  put(skull,headPatch(2.41,3.87,-.67,.38,18,18))
  for(const side of[-1,1]){
    put(face,earShell(side))
    const helix=Array.from({length:33},(_,i)=>{
      const a=i/32*TAU
      return vec(side*(.557+.012*Math.sin(a)),.04+Math.sin(a)*.178,-.055+Math.cos(a)*.091+.020*Math.sin(a))
    })
    tube(face,helix,.014,32,8,true)
    tube(skull,[vec(side*.546,-.085,-.047),vec(side*.555,.0,-.098),vec(side*.550,.112,-.053),vec(side*.54,.105,.003)],.012,22,8)
    put(recess,new THREE.SphereGeometry(.047,12,8),vec(side*.548,.012,-.045),[0,0,0],[.16,1,.62])
    const eye=vec(side*.215,.20,.35)
    put(recess,new THREE.SphereGeometry(.086,16,8),eye,[0,0,side*.06],[1,.34,.24])
    const aperture=[]
    for(let i=0;i<=24;i++){const u=i/24*2-1;aperture.push(headPoint(side*.40+u*.235,.17+.059*(1-u*u)))}
    for(let i=23;i>=1;i--){const u=i/24*2-1;aperture.push(headPoint(side*.40+u*.235,.17-.036*(1-u*u)))}
    const wallPositions=[],wallIndices=[]
    for(const outer of aperture){
      const inner=outer.clone();inner.z-=.075
      inner.x=eye.x+(inner.x-eye.x)*.92;inner.y=eye.y+(inner.y-eye.y)*.92
      wallPositions.push(...outer.toArray(),...inner.toArray())
    }
    for(let i=0;i<aperture.length;i++){const a=i*2,b=((i+1)%aperture.length)*2;wallIndices.push(a,b,a+1,b,b+1,a+1)}
    const socket=new THREE.BufferGeometry();socket.setAttribute('position',new THREE.Float32BufferAttribute(wallPositions,3));socket.setIndex(wallIndices);socket.computeVertexNormals();put(recess,socket)
    for(const upper of[true,false])tube(face,Array.from({length:19},(_,i)=>{
      const u=i/18*2-1
      return headPoint(side*.40+u*.235,.17+(upper?.056:-.032)*(1-u*u)).add(vec(0,0,.007))
    }),upper?.012:.007,22,8)
    tube(face,Array.from({length:15},(_,i)=>{
      const u=i/14*2-1
      return headPoint(side*.40+u*.25,.29+.022*(1-u*u)).add(vec(0,0,.003))
    }),.016,18,8)
    const nostril=headPoint(side*.125,Math.asin((-.15-.06)/.83)).add(vec(0,0,.003))
    put(recess,new THREE.SphereGeometry(.019,12,8),nostril,[.2,0,side*.15],[1,.43,.22])
  }
  tube(recess,Array.from({length:21},(_,i)=>{const u=i/20*2-1;return headPoint(u*.30,Math.asin((-.286+.004*u*u-.06)/.83)).add(vec(0,0,.003))}),.0055,24,8)
  tube(face,Array.from({length:21},(_,i)=>{const u=i/20*2-1;return headPoint(u*.28,Math.asin((-.312-.004*(1-u*u)-.06)/.83)).add(vec(0,0,.004))}),.009,24,8)
  // Only a sagittal seam and two temporal sutures remain; the head is not wrapped in wires.
  for(const theta of[-1.22,1.22])tube(sutures,Array.from({length:25},(_,i)=>headPoint(theta,-.88+i/24*1.68)),.013,28,8)
  tube(sutures,Array.from({length:27},(_,i)=>headPoint(Math.PI,-.70+i/26*1.48)),.014,30,8)
  tube(sutures,Array.from({length:35},(_,i)=>headPoint(.89+i/34*(TAU-1.78),.43)),.014,44,8)
  for(const side of[-1,1]){
    put(lobes,brainLobe(side))
    // Thick meandering meridian gyri expose paired cortical lobes, not hairlike rings.
    for(let fold=0;fold<5;fold++)tube(gyri,Array.from({length:37},(_,i)=>{
      const latitude=-1.18+i/36*2.40
      const a=fold/5*TAU+side*.14+(.12+.015*fold)*Math.sin(latitude*3.4+fold*.7)+.065*Math.cos(latitude)*Math.sin(latitude*6.2-fold*.9)
      const p=lobePoint(side,a,latitude)
      return p.add(vec((p.x-side*.215)*.020,(p.y-.585)*.020,(p.z+.018)*.020))
    }),fold%2?.019:.024,36,8)

  }
  const relays=[]
  for(let i=0;i<18;i++){
    const a=i*2.3999632297,y=1-2*(i+.5)/18,r=Math.sqrt(1-y*y)
    const p=vec(r*Math.cos(a)*.18,.54+y*.19,-.018+r*Math.sin(a)*.20)
    relays.push(p);jewel(relay,p,.019,0)
  }
  for(let i=0;i<relays.length;i++){
    const next=relays[(i+5)%relays.length]
    rod(connections,relays[i],next,.0065,6)
  }
  // The stem is an attached Y bundle entering two lobes through the cervical column.
  for(const side of[-1,1])tube(neck,[vec(0,-.67,-.11),vec(0,-.25,-.17),vec(side*.09,.02,-.10),vec(side*.18,.40,-.04)],.030,28,10)
  // A continuous darker spine joins the face, all cervical collars, and the pedestal.
  rod(skull,vec(0,-.54,-.095),vec(0,-1.006,-.095),.068,12)
  for(let joint=0;joint<3;joint++){
    const y=-.76-joint*.085
    machinedRing(neck,.126-joint*.013,.034,.028,0,TAU,vec(0,y,-.095),[Math.PI/2,0,0],32)
    bevelBox(skull,.115,.047,.12,vec(0,y,-.095),[0,0,0],.007)
  }
  machinedRing(neck,.23,.050,.042,.12,Math.PI*1.82,vec(0,-1.0,-.055),[Math.PI/2,0,0],44)
  return[face,skull,sutures,lobes,gyri,relay,connections,neck,recess]
}

/** A real pierced, beveled sheet in its own planar frame, with an inset triangular window. */
function piercedFold(part,a,b,c,depth=.034) {
  const tangent=b.clone().sub(a).normalize(),normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize(),bitangent=normal.clone().cross(tangent)
  const relative=c.clone().sub(a)
  const corners=[new THREE.Vector2(0,0),new THREE.Vector2(a.distanceTo(b),0),new THREE.Vector2(relative.dot(tangent),relative.dot(bitangent))]
  const shape=new THREE.Shape(corners),center=corners.reduce((sum,p)=>sum.add(p),new THREE.Vector2()).multiplyScalar(1/3)
  const inner=corners.map(p=>p.clone().sub(center).multiplyScalar(.40).add(center)).reverse()
  const hole=new THREE.Path(inner);hole.closePath();shape.holes.push(hole)
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.007,bevelThickness:.008,bevelSegments:2,curveSegments:1,steps:1})
  geometry.translate(0,0,-depth/2);geometry.applyMatrix4(new THREE.Matrix4().makeBasis(tangent,bitangent,normal));put(part,finishBevel(geometry),a)
  return normal
}

function unfinishedMechanism() {
  const folds=group('Pierced folded porcelain sheets','porcelain')
  const structure=group('Fold returns and machined structural chassis','steel')
  const slots=group('Recessed fastener and index slots','ink')
  const fasteners=group('Hinge knuckles and fitted fasteners','silver')
  const peaks=[vec(0,1.04,0),vec(.95,.12,.30),vec(.35,-.93,-.32),vec(-.84,-.35,.48),vec(-.66,.48,-.44)]
  const gearing=[]
  for(let i=0;i<peaks.length;i++){
    const a=peaks[i],b=peaks[(i+1)%peaks.length]
    const crease=a.clone().add(b).multiplyScalar(.42);crease.z+=(i%2?-.37:.40)
    const inner=a.clone().add(b).multiplyScalar(.16);inner.z+=(i%2?.18:-.12)
    const normal=piercedFold(folds,a,crease,inner,.040)
    piercedFold(structure,b,inner,crease,.032)
    // Two folded returns sit on the load-bearing crease rather than arbitrary struts.
    const returnOffset=normal.clone().multiplyScalar(.045)
    bevelTriangle(structure,a,crease,crease.clone().add(returnOffset),.018)
    bevelTriangle(structure,a,crease.clone().add(returnOffset),a.clone().add(returnOffset),.018)
    rod(structure,crease,inner,.018,8)
    // The pivot's axis follows its folded crease; all wheel/knuckle parts share it.
    const axis=inner.clone().sub(a).normalize()
    const q=new THREE.Quaternion().setFromUnitVectors(vec(0,0,1),axis),euler=new THREE.Euler().setFromQuaternion(q),rotation=[euler.x,euler.y,euler.z]
    const pivot=a.clone().addScaledVector(normal,.025)
    const wheel=group(`hover-fold-hinge-wheel-${i+1}`,'silver',pivot,axis.clone());gearing.push(wheel)
    gear(wheel,.071,14,.026,pivot,rotation)
    rod(structure,pivot.clone().addScaledVector(axis,-.11),pivot.clone().addScaledVector(axis,.11),.015,10)
    for(const offset of[-.065,0,.065])machinedRing(fasteners,.036,.014,.033,0,TAU,pivot.clone().addScaledVector(axis,offset),rotation,20)
    for(const offset of[-.116,.116])bolt(fasteners,slots,pivot.clone().addScaledVector(axis,offset),.022,rotation)
    // Two flush bolts hold each plate at actual anchor points, including reverse-side shadows.
    for(const point of[a.clone().lerp(crease,.24),b.clone().lerp(crease,.24)]){
      const localRotation=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(vec(0,0,1),normal))
      bolt(fasteners,slots,point.addScaledVector(normal,.033),.018,[localRotation.x,localRotation.y,localRotation.z])
    }
    // Opposing tension springs have a mechanical purpose and do not fill every opening.
    if(i===0||i===3){
      const anchor=inner.clone().addScaledVector(normal,.065),start=crease.clone().addScaledVector(normal,.065),springAxis=anchor.clone().sub(start).normalize()
      const side=springAxis.clone().cross(Math.abs(springAxis.y)<.8?Y:vec(1,0,0)).normalize(),up=springAxis.clone().cross(side).normalize()
      tube(fasteners,Array.from({length:43},(_,k)=>start.clone().lerp(anchor,k/42).addScaledVector(side,.025*Math.cos(k/42*TAU*3)).addScaledVector(up,.025*Math.sin(k/42*TAU*3))),.0075,54,6)
    }
  }
  const wheelCenter=vec(0,0,-.22),wheelRotation=[.32,.16,.18],shaft=shaftAxis(wheelRotation)
  const transform=new THREE.Quaternion().setFromEuler(new THREE.Euler(...wheelRotation))
  const transferCenter=vec(.432*Math.cos(-.61),.432*Math.sin(-.61),0).applyQuaternion(transform).add(wheelCenter)
  const centralGear=group('hover-experimental-central-wheel','silver',wheelCenter,shaft.clone())
  const transferGear=group('hover-experimental-transfer-wheel','silver',transferCenter,shaft.clone())
  gear(centralGear,.30,36,.026,wheelCenter,wheelRotation)
  gear(transferGear,.14,20,.031,transferCenter,wheelRotation)
  machinedRing(structure,.312,.055,.044,0,TAU,wheelCenter.clone().addScaledVector(shaft,-.052),wheelRotation,64)
  machinedRing(fasteners,.10,.025,.044,0,TAU,wheelCenter.clone().addScaledVector(shaft,.028),wheelRotation,40)
  rod(structure,wheelCenter.clone().addScaledVector(shaft,-.10),wheelCenter.clone().addScaledVector(shaft,.083),.027,12)
  for(let i=0;i<4;i++){
    const a=i/4*TAU,point=vec(.34*Math.cos(a),.34*Math.sin(a),-.05).applyQuaternion(transform).add(wheelCenter)
    bolt(fasteners,slots,point,.020,wheelRotation)
  }
  // Three deliberate mounting stays carry the central mechanism into the outer folds.
  for(const i of[0,2,4])rod(structure,wheelCenter.clone().addScaledVector(shaft,-.075),peaks[i].clone().multiplyScalar(.48),.018,8)
  return[folds,structure,slots,fasteners,...gearing,centralGear,transferGear]
}

export { syntheticMind, unfinishedMechanism }
