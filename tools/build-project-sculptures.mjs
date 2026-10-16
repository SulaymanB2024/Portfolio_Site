/** Reproducible original abstraction collection. node tools/build-project-sculptures.mjs [slugs] */
import assert from 'node:assert/strict'
import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { getBounds } from '@gltf-transform/functions'
import draco from 'draco3dgltf'
import * as THREE from 'three'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { finishSurface } from './work-models/surface-finish.mjs'
import { materialStyles } from './work-models/geometry.mjs'
import { record, dracoSettings } from './optimize-portfolio-assets.mjs'

const root=resolve(import.meta.dirname,'..'),selected=process.argv.slice(2)
const families=[
  ['palimpsest-choir.mjs','conceptualSculptures',['internshipdeadlines','atlas','sapien']],
  ['covenant-bloom.mjs','caseSculptures',['payrollpro','viralbench']],
  ['equilibrium-continuum.mjs','mechanicalSculptures',['investing-markets','miscellaneous']],
]
assert.ok(selected.every(id=>families.some(([, ,ids])=>ids.includes(id))),'Unknown project sculpture')
const studies=[]
for(const [file,key,ids] of families) {
  if(selected.length&&!ids.some(id=>selected.includes(id)))continue
  const module=await import(`./project-sculptures/${file}`)
  assert.deepEqual(module[key].map(s=>s.id).sort(),[...ids].sort(),`${file}: incomplete family`)
  studies.push(...module[key].filter(s=>!selected.length||selected.includes(s.id)))
}
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.encoder':await draco.createEncoderModule(),'draco3d.decoder':await draco.createDecoderModule(),
})

function checkGeometry(geometry,name) {
  const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal'),indices=geometry.index
  assert.ok(positions&&normals&&indices,`${name}: missing mesh attributes`)
  assert.equal(positions.count,normals.count,`${name}: mismatched normals`)
  assert.ok(positions.array.every(Number.isFinite)&&normals.array.every(Number.isFinite),`${name}: nonfinite surface`)
  const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3()
  const retained=[];let removed=0
  for(let i=0;i<indices.count;i+=3) {
    const corners=[indices.getX(i),indices.getX(i+1),indices.getX(i+2)]
    assert.ok(corners.every(v=>Number.isInteger(v)&&v>=0&&v<positions.count),`${name}: invalid triangle index`)
    a.fromBufferAttribute(positions,corners[0]);b.fromBufferAttribute(positions,corners[1]);c.fromBufferAttribute(positions,corners[2])
    if(b.sub(a).cross(c.sub(a)).lengthSq()<1e-18){removed++;continue}
    retained.push(...corners)
  }
  assert.ok(removed/Math.max(1,indices.count/3)<.01,`${name}: excessive degenerate faces`)
  geometry.setIndex(retained)
  for(let i=0;i<normals.count;i++) {
    const length=a.fromBufferAttribute(normals,i).length()
    assert.ok(length>.99&&length<1.01,`${name}: invalid normal length ${length}`)
  }
  return removed
}

async function build(study) {
  const parts=study.make(),geometries=[];let removed=0
  assert.ok(parts.length<=16,`${study.id}: excessive draw count`)
  assert.equal(new Set(parts.map(p=>p.name)).size,parts.length,`${study.id}: duplicate parts`)
  for(const part of parts) {
    assert.ok(part.geometries.length,`${part.name}: empty part`)
    const merged=mergeGeometries(part.geometries,false)
    for(const geometry of part.geometries)geometry.dispose()
    assert.ok(merged,`${part.name}: inconsistent geometry schema`)
    const finished=finishSurface(merged,part.material,part.surfaceTone??1)
    const welded=mergeVertices(finished,1e-8);finished.dispose()
    removed+=checkGeometry(welded,part.name);geometries.push(welded)
  }
  const rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(...study.rotation)),bounds=new THREE.Box3()
  for(const geometry of geometries){geometry.applyQuaternion(rotation);geometry.computeBoundingBox();bounds.union(geometry.boundingBox)}
  const center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3()),scale=2/Math.max(size.x,size.y,size.z)
  const document=new Document(),buffer=document.createBuffer('Original sculptural surfaces'),scene=document.createScene(study.title)
  document.getRoot().setDefaultScene(scene)
  document.getRoot().getAsset().generator='Sulayman Bowles · tools/build-project-sculptures.mjs'
  document.getRoot().getAsset().copyright='Original procedural geometry · LicenseRef-Site-Owner'
  scene.setExtras({project:study.id,title:study.title,concept:study.concept,role:'Decorative project sculpture; not evidence or a product interface'})
  const materials=Object.fromEntries(Object.entries(materialStyles).map(([name,s])=>[name,document.createMaterial(name).setBaseColorFactor(s.color).setMetallicFactor(s.metal).setRoughnessFactor(s.roughness).setDoubleSided(false)]))
  const exported=[]
  for(const [i,geometry]of geometries.entries()) {
    const part=parts[i]
    geometry.translate(-center.x,-center.y,-center.z);geometry.scale(scale,scale,scale)
    const pivot=part.pivot?.clone().applyQuaternion(rotation).sub(center).multiplyScalar(scale)
    const axis=part.axis?.clone().applyQuaternion(rotation).normalize()
    if(pivot)geometry.translate(-pivot.x,-pivot.y,-pivot.z)
    const attribute=(name,type)=>document.createAccessor(`${part.name} ${name}`).setType(type).setArray(geometry.getAttribute(name).array).setBuffer(buffer)
    const indices=document.createAccessor(`${part.name} indices`).setType('SCALAR').setArray(geometry.index.array).setBuffer(buffer)
    const primitive=document.createPrimitive().setAttribute('POSITION',attribute('position','VEC3')).setAttribute('NORMAL',attribute('normal','VEC3'))
      .setAttribute('COLOR_0',attribute('color','VEC3').setNormalized(true)).setIndices(indices).setMaterial(materials[part.material])
    const node=document.createNode(part.name).setMesh(document.createMesh(part.name).addPrimitive(primitive))
    if(pivot) {
      assert.ok(axis&&Math.abs(axis.length()-1)<1e-6,`${part.name}: invalid shaft axis`)
      node.setTranslation(pivot.toArray())
      if(!part.parent)node.setExtras({articulationAxis:axis.toArray(),articulationPivot:pivot.toArray(),articulation:'authored rotation',...(part.motion?{articulationMotion:part.motion}:{})})
    }
    if(part.name.startsWith('hover-'))assert.ok(pivot&&part.motion,`${part.name}: moving part needs a declared pivot and motion`)
    exported.push({part,node});geometry.dispose()
  }
  for(const {part,node}of exported) {
    if(!part.parent){scene.addChild(node);continue}
    const parent=exported.find(p=>p.part.name===part.parent)?.node
    assert.ok(parent&&!part.name.startsWith('hover-'),`${part.name}: invalid attached detail`)
    node.setTranslation(new THREE.Vector3().fromArray(node.getTranslation()).sub(new THREE.Vector3().fromArray(parent.getTranslation())).toArray());parent.addChild(node)
  }
  const triangles=document.getRoot().listMeshes().reduce((count,m)=>count+m.listPrimitives().reduce((n,p)=>n+p.getIndices().getCount()/3,0),0)
  assert.ok(triangles>=5000&&triangles<=125000,`${study.id}: triangle budget ${triangles}`)
  document.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
    method:KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,encodeSpeed:dracoSettings.encodeSpeed,decodeSpeed:dracoSettings.decodeSpeed,
    quantizationBits:{POSITION:dracoSettings.quantizePosition,NORMAL:dracoSettings.quantizeNormal,COLOR:8},
  })
  const path=`public/portfolio-models/work-${study.id}.glb`
  // Generate and validate in memory before replacing a current delivery asset.
  const bytes=Buffer.from(await io.writeBinary(document))
  assert.ok(bytes.byteLength<2_000_000,`${study.id}: delivery size exceeded`)
  const entry=await record({id:`work-${study.id}`,source:path,path,mode:'unchanged'},bytes,bytes,io)
  const temporary=resolve(root,path+'.pending')
  await writeFile(temporary,bytes);await rename(temporary,resolve(root,path))
  console.log(`${study.id}: ${triangles} triangles; ${bytes.length} bytes; ${parts.length} draws; validator 0 errors / 0 warnings`)
  return {id:`work-${study.id}`,slug:study.id,title:study.title,concept:study.concept,ownership:'Original procedural geometry; no external model or texture inputs',license:'LicenseRef-Site-Owner',entry,removedDegenerateFaces:removed,bounds:getBounds(scene)}
}

const entries=[]
for(const study of studies)entries.push(await build(study))
const manifestPath=resolve(root,'public/portfolio-models/manifest.json'),urlsPath=resolve(root,'public/portfolio-models/urls.json'),sculpturePath=resolve(root,'public/portfolio-models/project-sculptures.json')
const manifest=JSON.parse(await readFile(manifestPath,'utf8')),urls=JSON.parse(await readFile(urlsPath,'utf8'))
let previous={models:[]};try{previous=JSON.parse(await readFile(sculpturePath,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
for(const {id,entry}of entries){manifest.assets[id]=entry;urls[id]=entry.url}
const descriptions=entries.map(({entry,...d})=>({...d,path:entry.path,sha256:entry.sha256,triangles:entry.stats.triangles,bytes:entry.bytes,validation:entry.validation}))
const current=previous.models.filter(m=>!entries.some(e=>e.id===m.id)).concat(descriptions)
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');await writeFile(urlsPath,JSON.stringify(urls,null,2)+'\n')
await writeFile(sculpturePath,JSON.stringify({generator:'tools/build-project-sculptures.mjs',models:current.sort((a,b)=>a.id.localeCompare(b.id))},null,2)+'\n')
