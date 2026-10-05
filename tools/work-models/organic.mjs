import * as THREE from 'three'
import { TAU, Y, vec, group, shaftAxis, put, tube, rod, jewel, bevelBox, gear, bevelTriangle, bevelFrame, machinedRing, channelRing, bolt, finishBevel } from './geometry.mjs'

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
    const spoke=new THREE.Shape([
      new THREE.Vector2(bore+.004,-pitch*.073),new THREE.Vector2(opening+.006,-pitch*.039),
      new THREE.Vector2(opening+.006,pitch*.039),new THREE.Vector2(bore+.004,pitch*.073),
    ])
    const strut=new THREE.ExtrudeGeometry(spoke,{depth:depth*.72,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:2,curveSegments:1,steps:1})
    strut.translate(0,0,-depth*.36)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),phase+i/spokes*TAU)))
    put(part,finishBevel(strut),center,[e.x,e.y,e.z])
  }
  channelRing(part,(hub+bore)/2,hub-bore,depth*1.14,0,TAU,center,rotation,24)
  const front=center.clone().addScaledVector(shaftAxis(rotation),depth*.58)
  machinedRing(part,bore+.010,.014,.014,0,TAU,front,rotation,24)
}

function unfinishedMechanism() {
  const folds=group('Opened porcelain service shrouds','porcelain')
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
    involuteWheel(part,wheel.teeth,module,wheel===main?.045:.034,center,rotation,wheel.phase,wheel.spokes)
    gearing.push(part)
    // Each spinning hub clears a fixed shaft. Back bearings are seated on a real
    // pierced block; the front retaining cap sits beyond the rotating faces.
    const p=wheel.point,back=at(p.x,p.y,-.12),front=at(p.x,p.y,.239)
    rod(structure,at(p.x,p.y,-.205),at(p.x,p.y,.237),.019,14)
    bevelFrame(structure,wheel===main?.19:.142,wheel===main?.19:.142,.070,.049,.049,back,rotation,.006)
    machinedRing(fasteners,.040,.017,.029,0,TAU,at(p.x,p.y,-.072),rotation,24)
    machinedRing(slots,.031,.008,.008,0,TAU,at(p.x,p.y,-.053),rotation,20)
    bolt(fasteners,slots,front,.029,rotation)
    for (const side of [-1,1]) bolt(fasteners,slots,at(p.x+side*(wheel===main?.066:.045),p.y-.042,-.076),.012,rotation)
  }
  // Diagonal rear beams carry the five bearing blocks. Their whole depth stays
  // behind the gear plane; full rotations cannot pass through a beam or panel.
  for (const [from,to] of [[main,children[0]],[children[0],children[1]],[main,children[2]],[children[2],children[3]]]) {
    const a=from.point,b=to.point,mid=a.clone().lerp(b,.5),angle=Math.atan2(b.y-a.y,b.x-a.x)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(vec(0,0,1),angle)))
    bevelFrame(structure,a.distanceTo(b)+.15,.098,.070,a.distanceTo(b)-.05,.032,at(mid.x,mid.y,-.158),[e.x,e.y,e.z],.004)
  }
  // Three opened, folded service panels protect the back and reveal the working
  // faces. Their calm asymmetry replaces the former five-point star silhouette.
  const panels=[
    [at(-.89,.60,-.23),at(-.39,.76,-.18),at(-.60,.20,-.21)],
    [at(.83,.66,-.24),at(.31,.71,-.29),at(.73,.16,-.18)],
    [at(-.64,-.60,-.24),at(.68,-.58,-.24),at(.06,-.80,-.10)],
  ]
  for (const [a,b,c] of panels) {
    const normal=piercedFold(folds,a,b,c,.038),edge=b.clone().sub(a).normalize()
    const returnA=a.clone().addScaledVector(normal,-.040),returnB=b.clone().addScaledVector(normal,-.040)
    bevelTriangle(structure,a,b,returnB,.017);bevelTriangle(structure,a,returnB,returnA,.017)
    const e=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(vec(0,0,1),normal))
    for (const t of [.16,.84]) bolt(fasteners,slots,a.clone().lerp(b,t).addScaledVector(normal,.028),.020,[e.x,e.y,e.z])
    // Actual hinge barrels along the supported fold edge stay fixed with the shroud.
    for (const t of [.25,.50,.75]) {
      const center=a.clone().lerp(b,t).addScaledVector(normal,-.020)
      rod(fasteners,center.clone().addScaledVector(edge,-.035),center.clone().addScaledVector(edge,.035),.019,12)
    }
  }
  // Short rear stays join the bearing lattice to the service-sheet returns.
  for (const [wheel,end] of [[children[3],[-.70,.51,-.22]],[children[1],[.61,.53,-.25]],[children[2],[-.43,-.59,-.23]],[children[0],[.43,-.59,-.23]]]) {
    rod(structure,at(wheel.point.x,wheel.point.y,-.16),at(...end),.026,10)
    bolt(fasteners,slots,at(...end).addScaledVector(axis,.025),.022,rotation)
  }
  return[folds,structure,slots,fasteners,...gearing]
}

export { syntheticMind, unfinishedMechanism }
