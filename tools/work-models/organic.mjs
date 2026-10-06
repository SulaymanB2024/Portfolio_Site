import * as THREE from 'three'
import { TAU, Y, vec, group, shaftAxis, put, tube, rod, box, jewel, bevelBox, gear, bevelTriangle, bevelFrame, machinedRing, channelRing, bolt, finishBevel } from './geometry.mjs'

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
  // Warped intersecting sulci create continuous cortical relief. Pole attenuation
  // keeps both hemispheres coherent instead of terminating in upright fingers.
  const phase=angle*10+1.6*Math.sin(latitude*4+side*.36)+.72*Math.sin(angle*3-latitude*5)
  const crossFold=latitude*15+1.25*Math.sin(angle*3+latitude*2)
  const ridge=(.010*Math.cos(phase)+.0045*Math.cos(crossFold))*Math.max(0,Math.cos(latitude))**1.35
  const radial=1+ridge/.27
  return vec(side*.215+Math.sin(angle)*Math.cos(latitude)*.205*radial,.585+Math.sin(latitude)*.355*radial,-.018+Math.cos(angle)*Math.cos(latitude)*.365*radial)
}
function brainLobe(side) {
  return sampledSurface((u,v)=>lobePoint(side,u*TAU,-1.53+v*3.06),72,44,(u,v)=>{
    const a=u*TAU,lat=-1.53+v*3.06
    // Intentional access windows reveal the sparse interior relay, not a noisy wire ball.
    return !((Math.abs(a-2.05)<.22&&Math.abs(lat-.03)<.27)||(Math.abs(a-4.56)<.18&&Math.abs(lat+.38)<.18))
  },.021)
}

function corticalPole(part,side,latitude) {
  const positions=[side*.215,.585+Math.sign(latitude)*.355,-.018],normals=[0,Math.sign(latitude),0],indices=[]
  const segments=72
  for(let i=0;i<segments;i++){
    const angle=i/segments*TAU,p=lobePoint(side,angle,latitude)
    const normal=lobePoint(side,angle+.0001,latitude).sub(lobePoint(side,angle-.0001,latitude)).cross(lobePoint(side,angle,latitude+.0001).sub(lobePoint(side,angle,latitude-.0001))).normalize()
    positions.push(...p.toArray());normals.push(...normal.toArray())
    const a=i+1,b=(i+1)%segments+1
    indices.push(...(latitude>0?[0,a,b]:[0,b,a]))
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices);put(part,g)
}

/** Short, flattened organic crests embed into the cortex at both ends. */
function corticalFold(part,side,parameters,width=.017) {
  const curve=new THREE.CatmullRomCurve3(parameters.map(([angle,lat])=>vec(angle,lat,0)),false,'centripetal')
  const segments=28,sides=8,positions=[],normals=[],indices=[]
  for(let i=0;i<=segments;i++){
    const t=i/segments,[angle,lat]=curve.getPoint(t).toArray()
    const point=lobePoint(side,angle,lat)
    const angleDerivative=lobePoint(side,angle+.0001,lat).sub(lobePoint(side,angle-.0001,lat))
    const latitudeDerivative=lobePoint(side,angle,lat+.0001).sub(lobePoint(side,angle,lat-.0001))
    const normal=angleDerivative.clone().cross(latitudeDerivative).normalize()
    const velocity=curve.getTangent(t)
    const tangent=angleDerivative.multiplyScalar(velocity.x).add(latitudeDerivative.multiplyScalar(velocity.y)).normalize()
    const across=normal.clone().cross(tangent).normalize()
    const taper=.12+.88*Math.sin(t*Math.PI)**.55,r=width*taper,h=.0105*taper
    const center=point.addScaledVector(normal,-.007+.010*Math.sin(t*Math.PI))
    for(let j=0;j<sides;j++){
      const a=j/sides*TAU,cos=Math.cos(a),sin=Math.sin(a)
      positions.push(...center.clone().addScaledVector(across,cos*r).addScaledVector(normal,sin*h).toArray())
      normals.push(...across.clone().multiplyScalar(cos/r).addScaledVector(normal,sin/h).normalize().toArray())
      if(i<segments){const n=(j+1)%sides,k=i*sides;indices.push(k+j,k+sides+n,k+sides+j,k+j,k+n,k+sides+n)}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices)
  put(part,g)
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
    for(const latitude of[-1.53,1.53])corticalPole(lobes,side,latitude)
    // Short frontal, temporal and parietal runs change direction by region.
    // None spans the hemisphere height or floats above its silhouette.
    for(const angleCenter of[0,Math.PI])for(let fold=0;fold<4;fold++){
      const latitude=-.80+fold*.47,phase=fold*.82+side*.24
      corticalFold(gyri,side,Array.from({length:9},(_,i)=>{
        const t=i/8,u=t*2-1
        return[angleCenter+u*.82+.07*Math.sin(t*TAU+phase),latitude+.10*Math.sin(t*TAU+phase)+.05*Math.sin(t*TAU*2-phase)]
      }),fold===3?.015:.017)
    }
    for(const angleCenter of[Math.PI/2,Math.PI*1.5])for(let fold=0;fold<4;fold++){
      const latitude=-.71+fold*.44,phase=fold*.91+side*.35
      corticalFold(gyri,side,Array.from({length:9},(_,i)=>{
        const t=i/8,u=t*2-1
        return[angleCenter+u*.46+.14*Math.sin(t*TAU+phase),latitude+u*.18+.12*Math.sin(t*TAU-phase)]
      }),.016)
    }
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
  const hole=new THREE.Path(),fillets=inner.map((point,i)=>{
    const previous=inner[(i+inner.length-1)%inner.length],next=inner[(i+1)%inner.length]
    const radius=Math.min(.026,point.distanceTo(previous)*.18,point.distanceTo(next)*.18)
    return{point,entry:point.clone().add(previous.clone().sub(point).normalize().multiplyScalar(radius)),exit:point.clone().add(next.clone().sub(point).normalize().multiplyScalar(radius))}
  })
  hole.moveTo(fillets[0].entry.x,fillets[0].entry.y)
  for(let i=0;i<fillets.length;i++){
    const{point,exit}=fillets[i],next=fillets[(i+1)%fillets.length]
    hole.quadraticCurveTo(point.x,point.y,exit.x,exit.y);hole.lineTo(next.entry.x,next.entry.y)
  }
  hole.closePath();shape.holes.push(hole)
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.007,bevelThickness:.008,bevelSegments:2,curveSegments:4,steps:1})
  // ExtrudeGeometry can emit microscopic cap slivers at a rounded aperture's
  // acute return. Remove those zero-area remnants before crease smoothing.
  const position=geometry.getAttribute('position'),valid=[]
  for(let i=0;i<position.count;i+=3){
    const p=vec(position.getX(i),position.getY(i),position.getZ(i))
    const q=vec(position.getX(i+1),position.getY(i+1),position.getZ(i+1))
    const r=vec(position.getX(i+2),position.getY(i+2),position.getZ(i+2))
    if(q.sub(p).cross(r.sub(p)).lengthSq()>1e-14)valid.push(i,i+1,i+2)
  }
  geometry.setIndex(valid)
  geometry.translate(0,0,-depth/2);geometry.applyMatrix4(new THREE.Matrix4().makeBasis(tangent,bitangent,normal));put(part,finishBevel(geometry),a)
  return normal
}

/** Involute teeth share a module and 20-degree pressure angle throughout the train. */
function involuteWheel(part, teeth, module, depth, center, rotation, phase, spokes = 4) {
  const pitch = teeth * module / 2, base = pitch * Math.cos(Math.PI/9)
  const root = pitch - module * 1.25, tip = pitch + module
  const involute = r => { const t = Math.sqrt(Math.max(0,(r/base)**2-1)); return t-Math.atan(t) }
  // Tangential backlash and a small edge break leave running clearance at mesh.
  const half = Math.PI/(2*teeth) - .00065/pitch
  const atRadius = r => half + involute(pitch) - involute(Math.max(base,r))
  const profile = [], polar = (r,a) => new THREE.Vector2(r*Math.cos(a),r*Math.sin(a))
  for (let tooth=0; tooth<teeth; tooth++) {
    const a=phase+tooth/teeth*TAU, step=TAU/teeth, low=Math.max(base,root)
    profile.push(polar(root,a-step*.5),polar(root,a-atRadius(low)))
    if (root<base) profile.push(polar(base,a-atRadius(base)))
    for (let i=1; i<=5; i++) { const r=low+(tip-low)*i/5; profile.push(polar(r,a-atRadius(r))) }
    for (let i=1; i<=3; i++) profile.push(polar(tip,a-atRadius(tip)+2*atRadius(tip)*i/3))
    for (let i=4; i>=0; i--) { const r=low+(tip-low)*i/5; profile.push(polar(r,a+atRadius(r))) }
    if (root<base) profile.push(polar(root,a+atRadius(base)))
  }
  const shape=new THREE.Shape(profile), opening=root*.62
  const hole=new THREE.Path();hole.absarc(0,0,opening,0,TAU,true);shape.holes.push(hole)
  const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.0007,bevelThickness:.0012,bevelSegments:1,curveSegments:16,steps:1})
  g.translate(0,0,-depth/2);put(part,finishBevel(g),center,rotation)
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const hub=Math.max(.049,pitch*.21),bore=.0252
  for (let i=0; i<spokes; i++) {
    // Broad curved roots flow from the hub into the wheel. The curved sides
    // leave lens-shaped openings, rather than the same straight-spoke icon.
    const spoke=new THREE.Shape()
    spoke.moveTo(bore+.004,-pitch*.083)
    spoke.bezierCurveTo(pitch*.29,-pitch*.097,pitch*.41,-pitch*.026,opening+.009,-pitch*.037)
    spoke.lineTo(opening+.009,pitch*.037)
    spoke.bezierCurveTo(pitch*.37,pitch*.047,pitch*.30,pitch*.116,bore+.004,pitch*.083)
    spoke.closePath()
    const strut=new THREE.ExtrudeGeometry(spoke,{depth:depth*.72,bevelEnabled:true,bevelSize:.003,bevelThickness:.0025,bevelSegments:3,curveSegments:7,steps:1})
    strut.translate(0,0,-depth*.36)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),phase+i/spokes*TAU)))
    put(part,finishBevel(strut),center,[e.x,e.y,e.z])
  }
  channelRing(part,(hub+bore)/2,hub-bore,depth*1.14,0,TAU,center,rotation,24)
  const front=center.clone().addScaledVector(shaftAxis(rotation),depth*.58)
  machinedRing(part,bore+.010,.014,.014,0,TAU,front,rotation,24)
}

/** Subdivide the casting face before swelling it; the silhouette stays fitted. */
function crownCasting(source, crown, limit = .062) {
  const values=source.getAttribute('position'),index=source.index?.array
  const positions=[]
  const point=i=>vec(values.getX(i),values.getY(i),values.getZ(i))
  function triangle(a,b,c,depth=0) {
    const lengths=[a.distanceToSquared(b),b.distanceToSquared(c),c.distanceToSquared(a)]
    const longest=lengths.indexOf(Math.max(...lengths))
    if(lengths[longest]>limit*limit&&depth<8) {
      if(longest===0){const m=a.clone().add(b).multiplyScalar(.5);triangle(a,m,c,depth+1);triangle(m,b,c,depth+1)}
      else if(longest===1){const m=b.clone().add(c).multiplyScalar(.5);triangle(a,b,m,depth+1);triangle(a,m,c,depth+1)}
      else {const m=c.clone().add(a).multiplyScalar(.5);triangle(a,b,m,depth+1);triangle(m,b,c,depth+1)}
      return
    }
    for(const p of[a,b,c]){const rolled=p.clone();rolled.z+=Math.sign(rolled.z)*crown(rolled.x,rolled.y);positions.push(...rolled.toArray())}
  }
  for(let i=0;i<(index?.length??values.count);i+=3)triangle(...[0,1,2].map(j=>point(index?index[i+j]:i+j)))
  source.dispose()
  const surface=new THREE.BufferGeometry()
  surface.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  surface.computeVertexNormals()
  return finishBevel(surface)
}

/** Swelled cast shoulders with rolled ends and a deep, shaped service aperture. */
function serviceShoulder(part, seams, center, rotation, mirror = 1) {
  const shape = new THREE.Shape()
  // The cheek descends all the way to the base. Its narrow waist and rolled
  // arch carry a bearing, rather than ending in an unsupported decorative curl.
  shape.moveTo(-.235,-.902)
  shape.lineTo(-.066,-.902)
  shape.quadraticCurveTo(-.045,-.866,-.083,-.802)
  shape.bezierCurveTo(-.180,-.582,-.232,-.252,-.142,.051)
  shape.bezierCurveTo(-.094,.220,.045,.273,.215,.252)
  shape.quadraticCurveTo(.310,.238,.270,.329)
  shape.bezierCurveTo(.114,.474,-.094,.445,-.220,.321)
  shape.bezierCurveTo(-.390,.137,-.332,-.328,-.247,-.646)
  shape.quadraticCurveTo(-.200,-.821,-.235,-.902)
  const aperture = new THREE.Path()
  aperture.moveTo(-.237,-.491)
  aperture.bezierCurveTo(-.294,-.187,-.277,.162,-.155,.280)
  aperture.bezierCurveTo(-.079,.356,.042,.376,.149,.322)
  aperture.quadraticCurveTo(.185,.296,.111,.303)
  aperture.bezierCurveTo(-.062,.327,-.185,.181,-.204,.023)
  aperture.bezierCurveTo(-.236,-.174,-.196,-.381,-.181,-.511)
  aperture.quadraticCurveTo(-.198,-.559,-.237,-.491)
  shape.holes.push(aperture)
  const blank=new THREE.ExtrudeGeometry(shape,{depth:.116,bevelEnabled:true,bevelSize:.013,bevelThickness:.010,bevelSegments:4,curveSegments:16,steps:1})
  blank.translate(0,0,-.058)
  const shell=crownCasting(blank,(x,y)=>.018*Math.exp(-(((x+.16)/.24)**2)-(((y+.05)/.64)**2)),.078)
  shell.scale(mirror,1,1)
  // Reflection reverses winding. Explicitly restore it before exporting.
  if(mirror<0){const p=shell.getAttribute('position'),n=shell.getAttribute('normal');for(let i=0;i<p.count;i+=3)for(const attribute of[p,n]){const a=[attribute.getX(i+1),attribute.getY(i+1),attribute.getZ(i+1)];attribute.setXYZ(i+1,attribute.getX(i+2),attribute.getY(i+2),attribute.getZ(i+2));attribute.setXYZ(i+2,...a)}}
  put(part,finishBevel(shell),center,rotation)
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const at=(x,y,z)=>vec(x*mirror,y,z).applyQuaternion(q).add(center)
  // One hairline incised border follows the shoulder; the main face stays calm.
  tube(seams,[at(-.186,-.83,.067),at(-.265,-.38,.071),at(-.285,.055,.075),at(-.20,.28,.074),at(-.03,.39,.068),at(.19,.33,.062)],.0032,64,6)
  // A rear return explains the depth of the casting when the assembly turns.
  tube(part,[at(-.174,-.88,-.066),at(-.25,-.45,-.078),at(-.282,.04,-.078),at(-.18,.28,-.075),at(.035,.385,-.064),at(.19,.306,-.062)],.012,56,10)
}

function lowerCradle(part, seams, center, rotation) {
  const shape=new THREE.Shape()
  shape.moveTo(-.75,.07)
  shape.bezierCurveTo(-.51,-.03,.44,-.065,.74,.045)
  shape.quadraticCurveTo(.76,-.01,.65,-.105)
  shape.bezierCurveTo(.34,-.27,-.43,-.28,-.70,-.10)
  shape.quadraticCurveTo(-.78,-.035,-.75,.07)
  for(const[x,w]of[[-.40,.24],[0,.31],[.39,.24]]){
    const hole=new THREE.Path()
    hole.absellipse(x,-.107,w/2,.037,0,TAU,true,0)
    shape.holes.push(hole)
  }
  const blank=new THREE.ExtrudeGeometry(shape,{depth:.112,bevelEnabled:true,bevelSize:.013,bevelThickness:.012,bevelSegments:4,curveSegments:16,steps:2})
  blank.translate(0,0,-.056)
  const g=crownCasting(blank,(x,y)=>.024*Math.max(0,1-(x/.79)**2)*Math.exp(-(((y+.10)/.16)**2)))
  put(part,g,center,rotation)
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  tube(seams,[vec(-.64,-.092,.073),vec(-.38,-.19,.076),vec(0,-.22,.074),vec(.38,-.19,.076),vec(.63,-.092,.073)].map(p=>p.applyQuaternion(q).add(center)),.0035,64,6)
}

/** A fitted upper crossmember joins the two service cheeks into one frame. */
function upperServiceBridge(part, seams, fasteners, center, rotation) {
  const shape = new THREE.Shape()
  shape.moveTo(-.600,.770)
  shape.bezierCurveTo(-.430,.835,-.240,.850,-.010,.850)
  shape.bezierCurveTo(.230,.850,.400,.835,.580,.770)
  shape.lineTo(.570,.690)
  shape.bezierCurveTo(.280,.738,.090,.751,-.010,.751)
  shape.bezierCurveTo(-.130,.751,-.330,.738,-.590,.690)
  shape.closePath()
  const window = new THREE.Path()
  window.absellipse(-.010,.799,.230,.012,0,TAU,true,0)
  shape.holes.push(window)
  const crown = (x,y) => .010*Math.exp(-(((x+.01)/.46)**2)-(((y-.799)/.11)**2))
  const blank = new THREE.ExtrudeGeometry(shape,{depth:.090,bevelEnabled:true,bevelSize:.007,bevelThickness:.010,bevelSegments:4,curveSegments:16,steps:1})
  blank.translate(0,0,-.045)
  put(part,crownCasting(blank,crown,.072),center,rotation)
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const at = (x,y,z) => vec(x,y,z).applyQuaternion(q).add(center)
  // A single shallow witness cut follows the curved face. The member stays
  // behind the gear plane, and its two end screws seat in the existing cheeks.
  const line = [[-.540,.785],[-.360,.820],[-.180,.832],[-.010,.835],[.160,.832],[.340,.820],[.520,.785]]
  tube(seams,line.map(([x,y])=>at(x,y,.055+crown(x,y)+.0008)),.0022,64,6)
  for (const x of [-.445,.425]) {
    const y=.745,z=.055+crown(x,y)
    machinedRing(seams,.0185,.0055,.005,0,TAU,at(x,y,z+.0015),rotation,32)
    bolt(fasteners,seams,at(x,y,z+.007),.014,rotation)
  }
}

function turnedBearing(part, position, rotation) {
  // A broad mounting flange, a concave waist and a proud rounded oil shoulder.
  // The bore continues through the casting and clears the rotating axle.
  const profile=[[.027,-.039],[.060,-.039],[.066,-.032],[.066,-.021],
    [.052,-.014],[.046,-.004],[.046,.011],[.052,.017],[.053,.026],
    [.044,.036],[.032,.039],[.027,.039],[.027,-.039]]
  const body=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),40)
  body.rotateX(Math.PI/2)
  put(part,body,position,rotation)
}

function unfinishedMechanism() {
  const folds=group('Swelled pewter service castings with rolled rear returns','pewter')
  const structure=group('Folded returns and pierced bearing chassis','steel')
  const slots=group('Counterbored mountings and recessed witness marks','ink')
  const fasteners=group('Stepped shaft collars and fitted service fasteners','silver')
  const rotation=[.24,-.08,-.025],q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const axis=shaftAxis(rotation).normalize(),at=(x,y,z)=>vec(x,y,z).applyQuaternion(q)
  const module=.018,driver='hover-experimental-central-wheel',velocity=.46
  const main={name:driver,teeth:36,point:vec(-.08,.035,.18),phase:.07,ratio:1,spokes:5,material:'silver'}
  const children=[
    {name:'hover-experimental-transfer-wheel',teeth:20,parent:main,direction:-.42,spokes:4,material:'steel'},
    {name:'hover-fold-hinge-wheel-1',teeth:28,parent:null,direction:1.21,spokes:4,material:'silver'},
    {name:'hover-fold-hinge-wheel-2',teeth:24,parent:main,direction:-2.69,spokes:4,material:'silver'},
    {name:'hover-fold-hinge-wheel-3',teeth:16,parent:null,direction:1.94,spokes:3,material:'steel'},
  ]
  children[1].parent=children[0];children[3].parent=children[2]
  for (const wheel of children) {
    const parent=wheel.parent,distance=module*(parent.teeth+wheel.teeth)/2
    wheel.point=parent.point.clone().add(vec(distance*Math.cos(wheel.direction),distance*Math.sin(wheel.direction),0))
    // A tooth faces its neighbour's gap at rest. Signed speed then maintains
    // that relationship through every full turn, rather than merely at one pose.
    wheel.phase=wheel.direction+Math.PI-(Math.PI-parent.teeth*(wheel.direction-parent.phase))/wheel.teeth
    wheel.ratio=-parent.ratio*parent.teeth/wheel.teeth
  }
  const wheels=[main,...children],gearing=[]
  for (const wheel of wheels) {
    const center=at(...wheel.point.toArray()),part=group(wheel.name,wheel.material,center,axis.clone())
    part.motion={kind:'continuous',angularVelocity:velocity,ratio:wheel.ratio,driver,teeth:wheel.teeth,module}
    involuteWheel(part,wheel.teeth,module,wheel===main?.066:.052,center,rotation,wheel.phase,wheel.spokes)
    gearing.push(part)
    // Each spinning hub clears a fixed shaft. Back bearings are seated on a real
    // pierced block; the front retaining cap sits beyond the rotating faces.
    const p=wheel.point,back=at(p.x,p.y,-.12),front=at(p.x,p.y,.264)
    rod(structure,at(p.x,p.y,-.205),at(p.x,p.y,.262),.019,20)
    bevelFrame(structure,wheel===main?.19:.142,wheel===main?.19:.142,.070,.049,.049,back,rotation,.006)
    turnedBearing(folds,at(p.x,p.y,-.072),rotation)
    machinedRing(fasteners,.040,.017,.029,0,TAU,at(p.x,p.y,-.037),rotation,40)
    machinedRing(slots,.031,.008,.008,0,TAU,at(p.x,p.y,-.053),rotation,20)
    bolt(fasteners,slots,front,.029,rotation)
    // A fitted retention washer and a recessed circular seat give the front
    // shaft an assembly order that remains readable in a side view.
    machinedRing(fasteners,.045,.013,.016,0,TAU,at(p.x,p.y,.249),rotation,40)
    machinedRing(slots,.034,.0028,.0025,0,TAU,at(p.x,p.y,.260),rotation,32)
    for (const side of [-1,1]) bolt(fasteners,slots,at(p.x+side*(wheel===main?.066:.045),p.y-.042,-.076),.012,rotation)
  }
  // Diagonal rear beams carry the five bearing blocks. Their whole depth stays
  // behind the gear plane; full rotations cannot pass through a beam or panel.
  for (const [from,to] of [[main,children[0]],[children[0],children[1]],[main,children[2]],[children[2],children[3]]]) {
    const a=from.point,b=to.point,mid=a.clone().lerp(b,.5),angle=Math.atan2(b.y-a.y,b.x-a.x)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),angle)))
    bevelFrame(structure,a.distanceTo(b)+.15,.098,.070,a.distanceTo(b)-.05,.032,at(mid.x,mid.y,-.158),[e.x,e.y,e.z],.004)
  }
  // The rounded casting faces have real transverse curvature and depth. Rear
  // returns, stepped bearings and feet make the assembly a supported object.
  serviceShoulder(folds,slots,at(-.55,.35,-.23),rotation,1)
  serviceShoulder(folds,slots,at(.53,.35,-.25),rotation,-1)
  upperServiceBridge(folds,slots,fasteners,at(0,0,-.23),rotation)
  lowerCradle(folds,slots,at(0,-.55,-.24),rotation)
  for(const[x,y,z]of[[-.78,.52,-.15],[-.57,.66,-.15],[.77,.51,-.17],[.53,.67,-.17],[-.60,-.60,-.15],[.60,-.60,-.15]]){
    machinedRing(structure,.037,.012,.028,0,TAU,at(x,y,z-.014),rotation,24)
    bolt(fasteners,slots,at(x,y,z+.019),.023,rotation)
  }
  for(const x of[-.51,.51]){
    bevelBox(folds,.183,.068,.229,at(x,-.779,-.260),rotation,.018)
    bevelBox(structure,.158,.021,.195,at(x,-.814,-.260),rotation,.006)
    rod(structure,at(x,-.733,-.302),at(x,-.594,-.306),.035,24)
  }
  // The long cheeks are mortised into the lower cradle with broad transverse
  // feet, each held by a pair of counterbored fixings. No free-standing horns.
  for(const x of[-.705,.685]){
    bevelBox(folds,.150,.074,.166,at(x,-.566,-.238),rotation,.012)
    for(const dx of[-.043,.043]){
      machinedRing(slots,.016,.005,.005,0,TAU,at(x+dx,-.567,-.149),rotation,24)
      bolt(fasteners,slots,at(x+dx,-.567,-.143),.014,rotation)
    }
  }
  // A fine graduation and turned concentric cut sit on the main wheel face.
  // This ink insert rotates with its own wheel, with the exact same driver rate.
  const center=at(...main.point.toArray()),engraving=group('hover-experimental-wheel-engraving','ink',center,axis.clone())
  engraving.motion={kind:'continuous',angularVelocity:velocity,ratio:1,driver}
  for(let i=0;i<36;i++){
    const angle=main.phase+i/36*TAU,p=main.point.clone().add(vec(.273*Math.cos(angle),.273*Math.sin(angle),.037))
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),angle)))
    box(engraving,[i%3===0?.016:.008,.0025,.0019],at(...p.toArray()),[e.x,e.y,e.z])
  }
  machinedRing(engraving,.261,.0023,.0018,0,TAU,center.clone().addScaledVector(axis,.037),rotation,96)
  machinedRing(engraving,.300,.0019,.0018,0,TAU,center.clone().addScaledVector(axis,.037),rotation,112)
  // Short rear stays join the bearing lattice to the service-sheet returns.
  for (const [wheel,end] of [[children[3],[-.70,.51,-.22]],[children[1],[.61,.53,-.25]],[children[2],[-.43,-.59,-.23]],[children[0],[.43,-.59,-.23]]]) {
    rod(structure,at(wheel.point.x,wheel.point.y,-.16),at(...end),.026,10)
    bolt(fasteners,slots,at(...end).addScaledVector(axis,.025),.022,rotation)
  }
  return[folds,structure,slots,fasteners,...gearing,engraving]
}

export { syntheticMind, unfinishedMechanism }
