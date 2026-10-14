/** Original project sculptures. Writes only PayrollPro/ViralBench and their asset entries. */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import draco from 'draco3dgltf'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import validator from 'gltf-validator'
import { TAU, vec, group, put, rod, tube, bevelBox, bevelFrame, machinedRing, channelRing, bolt, materialStyles } from './work-models/geometry.mjs'
import { finishSurface } from './work-models/surface-finish.mjs'
import { record, dracoSettings } from './optimize-portfolio-assets.mjs'

const root = resolve(import.meta.dirname, '..')
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.encoder': await draco.createEncoderModule(),
  'draco3d.decoder': await draco.createDecoderModule(),
})

function cylinder(part, radius, depth, position, rotation = [Math.PI/2,0,0], segments = 64) {
  put(part, new THREE.CylinderGeometry(radius,radius,depth,segments,1),position,rotation)
}
function turned(part, profile, position, rotation = [0,0,0], segments = 72) {
  put(part,new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segments),position,rotation)
}
function coin(body, cut, radius, depth, position, rotation = [0,0,0]) {
  cylinder(body,radius,depth,position,rotation)
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  // Cylinder's disc normal is +Y; match the ring's +Z normal.
  const ringRotation=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0))))
  const ring=[ringRotation.x,ringRotation.y,ringRotation.z]
  const top=position.clone().add(vec(0,depth/2+.002,0).applyQuaternion(q))
  machinedRing(body,radius*.85,radius*.07,.006,0,TAU,top,ring,64)
  for(let i=0;i<48;i++) {
    const a=i/48*TAU
    const p=vec(Math.cos(a)*radius,0,Math.sin(a)*radius).applyQuaternion(q).add(position)
    const e=new THREE.Euler().setFromQuaternion(q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-a,0))))
    bevelBox(cut,.003,depth*.7,.004,p,[e.x,e.y,e.z],.0005)
  }
}

function payrollTreasury() {
  const casting=group('Treasury casting','pewter'), trim=group('Fitted door and hardware','silver')
  const steel=group('Door seals and hinges','steel'), marks=group('Engraved ledger and keyways','ink'), paper=group('Payroll ledger leaves','porcelain')
  bevelBox(casting,1.52,1.22,.69,vec(0,-.06,0),[0,0,0],.055)
  bevelBox(steel,1.38,1.08,.042,vec(0,-.06,.366),[0,0,0],.025)
  bevelFrame(trim,1.43,1.13,.055,1.26,.95,vec(0,-.06,.388),[0,0,0],.018)
  // The enamelled face keeps the approval hardware readable at phone size.
  bevelBox(paper,1.27,.96,.078,vec(0,-.06,.42),[0,0,0],.027)
  bevelFrame(steel,1.20,.89,.012,1.15,.84,vec(0,-.06,.466),[0,0,0],.005)
  // Fitted hinges, retention caps, and actual countersunk door fixings.
  for(const y of [-.39,.28]) {
    turned(steel,[[.001,-.13],[.055,-.13],[.066,-.115],[.066,.115],[.055,.13],[.001,.13]],vec(.69,y,.455))
    for(const h of [-.084,0,.084]) machinedRing(trim,.066,.012,.018,0,TAU,vec(.69,y+h,.455),[Math.PI/2,0,0],48)
    cylinder(trim,.049,.021,vec(.69,y+.141,.455),[0,0,0],32)
  }
  for(const x of [-.58,.58]) for(const y of [-.43,.31]) bolt(trim,marks,vec(x,y,.493),.025)
  const hub=vec(.12,.08,.525)
  machinedRing(trim,.21,.043,.04,0,TAU,hub,[0,0,0],96)
  cylinder(trim,.060,.076,hub.clone().add(vec(0,0,.017)))
  for(let i=0;i<3;i++) {
    const a=i/3*TAU+.22
    rod(trim,hub.clone().add(vec(Math.cos(a)*.047,Math.sin(a)*.047,.035)),hub.clone().add(vec(Math.cos(a)*.2,Math.sin(a)*.2,.035)),.019,16)
  }
  // Two approval keyways make shared control a physical part of the object.
  for(const x of [-.31,.36]) {
    cylinder(trim,.064,.02,vec(x,-.32,.481))
    cylinder(marks,.018,.025,vec(x,-.311,.494),[Math.PI/2,0,0],32)
    bevelBox(marks,.018,.055,.008,vec(x,-.337,.506),[0,0,0],.004)
    machinedRing(steel,.052,.007,.004,0,TAU,vec(x,-.32,.50),[0,0,0],48)
  }
  // A shallow payout tray with three independently modeled, milled coin stacks.
  bevelBox(casting,1.68,.15,.88,vec(0,-.73,.01),[0,0,0],.035)
  for(const x of [-.62,.62]) bevelBox(steel,.21,.10,.42,vec(x,-.83,.03),[0,0,0],.025)
  bevelBox(trim,.78,.045,.42,vec(.24,-.63,.52),[0,0,0],.016)
  bevelBox(casting,.80,.085,.035,vec(.24,-.597,.71),[0,0,0],.009)
  for(let i=0;i<3;i++) for(let level=0;level<3-i;level++) coin(trim,steel,.083,.021,vec(-.01+i*.22,-.59+level*.023,.55))
  // Bound ledger leaves sit in a fitted ledge, with page edges and cut ruling.
  bevelBox(steel,.94,.065,.66,vec(-.1,.595,-.018),[0,0,0],.020)
  for(let i=0;i<5;i++) bevelBox(paper,.83,.53,.012,vec(-.10+i*.005,.652+i*.017,-.027),[-Math.PI/2,0,-.035],.009)
  bevelBox(steel,.078,.61,.047,vec(-.52,.70,-.027),[-Math.PI/2,0,-.035],.015)
  for(let row=0;row<7;row++) {
    const z=-.22+row*.065
    bevelBox(marks,.66,.002,.003,vec(-.04,.729,z),[0,0,0],.0004)
    for(const x of [-.24,.02,.19]) bevelBox(marks,.004,.002,.041,vec(x,.729,z-.020),[0,0,0],.0004)
  }
  for(const x of [-.47,-.37]) cylinder(trim,.012,.038,vec(x,.708,-.20),[0,0,0],24)
  // Side ventilation and flange details remain visible at an oblique angle.
  for(let i=0;i<6;i++) bevelBox(steel,.008,.035,.21,vec(-.773,-.35+i*.09,.03),[0,0,0],.003)
  return [casting,trim,steel,marks,paper]
}

function proofInstrument() {
  const casting=group('Proof carriage and standards','pewter'), trim=group('Inspection lens and fittings','silver')
  const steel=group('Index rails and reels','steel'), marks=group('Proof impressions and registers','ink'), paper=group('Seven proof leaves','porcelain')
  bevelBox(casting,1.88,.15,.89,vec(0,-.77,0),[0,0,0],.04)
  bevelBox(steel,1.70,.03,.72,vec(0,-.67,0),[0,0,0],.018)
  for(const x of [-.67,.67]) bevelBox(steel,.20,.13,.38,vec(x,-.88,0),[0,0,0],.026)
  // Seven thick-edged proof leaves, seated in a real indexing magazine.
  for(let i=0;i<7;i++) {
    const yaw=(i-3)*.07, x=(i-3)*.075, z=-.15-i*.027, y=.035+i*.008
    const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.11,yaw,-.06))
    const at=(dx,dy,dz)=>vec(dx,dy,dz).applyQuaternion(q).add(vec(x,y,z))
    bevelBox(paper,.88,1.20,.025,vec(x,y,z),[-.11,yaw,-.06],.012)
    bevelFrame(steel,.89,1.21,.012,.84,1.16,at(0,0,.020),[-.11,yaw,-.06],.004)
    // A stamped media area and caption rules supply specific paper relief.
    if(i===0||i===6) {
      bevelFrame(marks,.68,.42,.003,.64,.38,at(0,.23,.039),[-.11,yaw,-.06],.001)
      cylinder(trim,.072,.003,at(-.17,.29,.041),[Math.PI/2-.11,yaw,-.06],48)
      for(let row=0;row<4;row++) bevelBox(marks,.64-row*.065,.009,.004,at(-row*.016,-.11-row*.085,.040),[-.11,yaw,-.06],.001)
    }
  }
  for(const x of [-.58,.58]) {
    tube(casting,[vec(x,-.64,.24),vec(x,-.44,.35),vec(x,.66,.32),vec(x,.76,.10)],.035,48,12)
    bevelBox(trim,.12,.17,.10,vec(x,-.60,.20),[0,0,0],.012)
    for(const y of [-.61,.56]) bolt(trim,marks,vec(x,y,.371),.024)
  }
  rod(trim,vec(-.58,.73,.11),vec(.58,.73,.11),.024,16)
  // Open inspection lens: its aperture reveals the proof beneath it.
  const lens=vec(.04,.15,.49)
  machinedRing(trim,.40,.049,.063,0,TAU,lens,[0,0,0],128)
  channelRing(steel,.44,.026,.074,0,TAU,lens,[0,0,0],128)
  machinedRing(trim,.376,.012,.013,0,TAU,lens.clone().add(vec(0,0,.04)),[0,0,0],128)
  const shaftEnd=vec(-.52,-.52,.53)
  rod(trim,lens.clone().add(vec(-.275,-.292,0)),shaftEnd,.031,16)
  turned(steel,[[.001,-.09],[.057,-.09],[.063,-.068],[.063,.068],[.057,.09],[.001,.09]],shaftEnd,[0,0,-.48],48)
  // Paired trace reels, milled sprocket faces, and a narrow connecting tape.
  for(const y of [-.20,.34]) {
    const center=vec(-.80,y,-.12)
    cylinder(steel,.165,.11,center)
    machinedRing(trim,.155,.033,.017,0,TAU,center.clone().add(vec(0,0,.067)),[0,0,0],80)
    cylinder(trim,.048,.15,center)
    for(let i=0;i<12;i++) {
      const a=i/12*TAU
      cylinder(marks,.012,.007,center.clone().add(vec(Math.cos(a)*.116,Math.sin(a)*.116,.081)),[Math.PI/2,0,0],20)
    }
  }
  bevelBox(paper,.048,.42,.008,vec(-.83,.07,.041),[0,0,0],.002)
  for(let i=0;i<12;i++) bevelBox(marks,.026,.006,.005,vec(-.83,-.12+i*.031,.047),[0,0,0],.0007)
  // Magazine stop and thumb screw, with cut profiles instead of a loose icon.
  bevelBox(casting,.34,.13,.28,vec(.58,-.54,.09),[0,0,0],.025)
  turned(trim,[[.015,-.10],[.027,-.10],[.027,.03],[.07,.03],[.082,.045],[.082,.08],[.07,.095],[.001,.095]],vec(.62,-.38,.12),[0,0,Math.PI/2],48)
  return [casting,trim,steel,marks,paper]
}

async function build(id, title, concept, make) {
  const parts=make(), geometries=parts.map(part=>{
    const merged=mergeGeometries(part.geometries,false)
    for(const geometry of part.geometries) geometry.dispose()
    if(!merged) throw new Error(`Cannot merge ${part.name}`)
    const finished=finishSurface(merged,part.material)
    const welded=mergeVertices(finished,1e-8)
    finished.dispose()
    return welded
  })
  const rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(.05,-.12,-.035))
  const bounds=new THREE.Box3()
  for(const geometry of geometries) { geometry.applyQuaternion(rotation); geometry.computeBoundingBox(); bounds.union(geometry.boundingBox) }
  const center=bounds.getCenter(new THREE.Vector3()), size=bounds.getSize(new THREE.Vector3()), scale=2/Math.max(size.x,size.y,size.z)
  const document=new Document(), buffer=document.createBuffer('Original procedural case-study geometry'), scene=document.createScene(title)
  document.getRoot().setDefaultScene(scene)
  document.getRoot().getAsset().generator='Sulayman Bowles · tools/build-case-models.mjs'
  const materials=Object.fromEntries(Object.entries(materialStyles).map(([name,s])=>[name,document.createMaterial(name).setBaseColorFactor(s.color).setMetallicFactor(s.metal).setRoughnessFactor(s.roughness).setDoubleSided(true)]))
  for(const [i,g] of geometries.entries()) {
    g.translate(-center.x,-center.y,-center.z);g.scale(scale,scale,scale)
    const attr=(name,type)=>document.createAccessor(parts[i].name+' '+name).setType(type).setArray(g.getAttribute(name).array).setBuffer(buffer)
    const position=attr('position','VEC3'),normal=attr('normal','VEC3'),color=attr('color','VEC3').setNormalized(true)
    const indices=document.createAccessor(parts[i].name+' indices').setType('SCALAR').setArray(g.index.array).setBuffer(buffer)
    const primitive=document.createPrimitive().setAttribute('POSITION',position).setAttribute('NORMAL',normal).setAttribute('COLOR_0',color).setIndices(indices).setMaterial(materials[parts[i].material])
    scene.addChild(document.createNode(parts[i].name).setMesh(document.createMesh(parts[i].name).addPrimitive(primitive)))
    g.dispose()
  }
  const path=`public/portfolio-models/work-${id}.glb`
  // Vertices are already welded above. Configure the standard encoder directly.
  document.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
    method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
    encodeSpeed: dracoSettings.encodeSpeed, decodeSpeed: dracoSettings.decodeSpeed,
    quantizationBits: { POSITION: dracoSettings.quantizePosition, NORMAL: dracoSettings.quantizeNormal, COLOR: 8 },
  })
  await io.write(resolve(root,path),document)
  const bytes=await readFile(resolve(root,path))
  const report=await validator.validateBytes(new Uint8Array(bytes),{uri:`work-${id}.glb`,maxIssues:100})
  if(report.issues.numErrors||report.issues.numWarnings) throw new Error(JSON.stringify(report.issues))
  let triangles=0
  for(const mesh of document.getRoot().listMeshes()) for(const p of mesh.listPrimitives()) triangles+=p.getIndices().getCount()/3
  if(bytes.byteLength>5_000_000||triangles>125_000||triangles<5000) throw new Error(`${id}: geometry budget exceeded (${triangles} triangles; ${bytes.byteLength} bytes)`)
  const entry=await record({id:`work-${id}`,source:path,path,mode:'unchanged'},bytes,bytes,io)
  return {id:`work-${id}`,entry,title,concept,ownership:'Original procedural geometry; no external model or texture inputs',license:'LicenseRef-Site-Owner'}
}

const entries=await Promise.all([
  build('payrollpro','Private payroll treasury','A fitted treasury door with two approval keyways, bound salary ledger, milled payout coins, and inspectable hardware. Decorative sculpture, not a product or transaction screenshot.',payrollTreasury),
  build('viralbench','Proof inspection instrument','Seven seated proof leaves, paired trace reels, a milled inspection lens, and a fitted indexing carriage. Decorative sculpture representing trace and review; not a deployed agent interface.',proofInstrument),
])
const manifestPath=resolve(root,'public/portfolio-models/manifest.json'), urlsPath=resolve(root,'public/portfolio-models/urls.json')
const manifest=JSON.parse(await readFile(manifestPath,'utf8')),urls=JSON.parse(await readFile(urlsPath,'utf8'))
for(const {id,entry} of entries) { manifest.assets[id]=entry;urls[id]=entry.url;console.log(`${id}: ${entry.stats.triangles} triangles, ${entry.bytes} bytes, validator 0 errors / 0 warnings`) }
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n')
await writeFile(urlsPath,JSON.stringify(urls,null,2)+'\n')
await writeFile(resolve(root,'public/portfolio-models/project-sculptures.json'),JSON.stringify({generator:'tools/build-case-models.mjs',models:entries.map(({entry,...description})=>({...description,path:entry.path,sha256:entry.sha256}))},null,2)+'\n')
