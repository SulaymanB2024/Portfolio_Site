/** Bake the résumé's existing work forms; browsers clone these GLB templates. */
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Document, NodeIO } from '@gltf-transform/core'
import { weld, getBounds } from '@gltf-transform/functions'
import validator from 'gltf-validator'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const resumeFormNames = ['records', 'cluster', 'dialogue', 'compare', 'report', 'plan', 'network', 'audit', 'search', 'calendar', 'film', 'frames', 'matrix', 'route', 'image']

function formParts(form) {
  const parts = { paper: [], marking: [] }
  const add = (geometry, x = 0, y = 0, z = 0, finish = 'paper') => {
    if(geometry.index){const expanded=geometry.toNonIndexed();geometry.dispose();geometry=expanded}
    geometry.deleteAttribute('uv'); geometry.translate(x, y, z); parts[finish].push(geometry); return geometry
  }
  const block = (w, h, d, x = 0, y = 0, z = 0, finish = 'paper') => add(new THREE.BoxGeometry(w, h, d), x, y, z, finish)
  const plate = (w = 1.25, h = 1.6, x = 0, y = 0, z = 0) => {
    const shape = new THREE.Shape(), r = .035
    shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2)
    return add(new THREE.ExtrudeGeometry(shape, { depth:.045, bevelEnabled:true, bevelSize:.025, bevelThickness:.015, bevelSegments:2, steps:1 }), x, y, z)
  }
  const bar = (x, y, z, length) => block(length, .024, .025, x, y, z, 'marking')
  const line = (a, b) => {
    const delta = b.clone().sub(a), geometry = new THREE.CylinderGeometry(.012, .012, delta.length(), 6)
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()))
    add(geometry, ...a.clone().add(b).multiplyScalar(.5).toArray(), 'marking')
  }
  if (form === 'cluster') {
    for (let row=0;row<4;row++) for (let col=0;col<4;col++) {
      const z=.18*Math.sin(row*1.7+col)
      add(new THREE.SphereGeometry(.11,12,8),(col-1.5)*.37,(row-1.5)*.36,z)
      if(col<3)line(new THREE.Vector3((col-1.5)*.37,(row-1.5)*.36,z),new THREE.Vector3((col-.5)*.37,(row-1.5)*.36,.18*Math.sin(row*1.7+col+1)))
    }
  } else if (form === 'network' || form === 'route') {
    const points=[new THREE.Vector3(0,0,.35),new THREE.Vector3(-.64,.62,-.1),new THREE.Vector3(.64,.62,-.1),new THREE.Vector3(-.64,-.62,-.1),new THREE.Vector3(.64,-.62,-.1)]
    points.forEach((point,i)=>{add(new THREE.BoxGeometry(i?.26:.42,i?.26:.42,i?.26:.42),...point.toArray());if(i)line(points[0],point)})
  } else if (form === 'dialogue') {
    for(let i=0;i<3;i++){plate(1.05,.58,i%2?.19:-.19,.55-i*.54,i*.08);for(let j=0;j<2;j++)bar(i%2?.19:-.19,.65-i*.54-j*.15,i*.08+.075,.65-j*.12)}
  } else if (['records','plan','report','audit'].includes(form)) {
    if(form==='records')for(let i=2;i>0;i--)plate(1.14,1.5,i*.13,i*.09,-i*.12)
    plate()
    for(let i=0;i<5;i++){bar(form==='audit'?.16:0,.48-i*.24,.085,form==='audit'?.65:i===4?.5:.85);if(form==='audit')block(.1,.09,.035,-.43,.48-i*.24,.095,'marking')}
  } else if (form === 'compare' || form === 'frames') {
    for(let i=0;i<2;i++){plate(.85,1.2,(i-.5)*.65,(i-.5)*.27,i*.13);for(let j=0;j<4;j++)bar((i-.5)*.65,.30-j*.19+(i-.5)*.27,.08+i*.13,.55-j*.04)}
  } else {
    plate(1.5,1.25)
    if(form==='calendar'||form==='matrix'){
      for(let row=0;row<3;row++)for(let col=0;col<4;col++)block(.19,.17,.028,(col-1.5)*.30,(row-1)*.27,.09,row===1&&col===2?'marking':'paper')
      if(form==='calendar'){bar(0,.45,.09,1.2);for(const x of[-.45,.45])add(new THREE.TorusGeometry(.07,.022,6,16),x,.63,.08,'marking')}
    } else if(form==='search'){
      add(new THREE.TorusGeometry(.31,.038,8,32),-.09,.06,.11,'marking');line(new THREE.Vector3(.13,-.18,.13),new THREE.Vector3(.42,-.47,.13));for(let j=0;j<3;j++)bar(-.09,.20-j*.14,.10,.32)
    } else if(form==='film'){
      for(let col=0;col<7;col++)for(const y of[-.48,.48])block(.07,.06,.03,(col-3)*.19,y,.09,'marking')
      for(let i=0;i<3;i++)block(.31,.57,.025,(i-1)*.43,0,.09,i===1?'paper':'marking')
    } else {
      const ridge=new THREE.Shape();ridge.moveTo(-.60,-.36);ridge.lineTo(-.19,.18);ridge.lineTo(.12,-.18);ridge.lineTo(.31,.10);ridge.lineTo(.60,-.36);ridge.closePath()
      add(new THREE.ExtrudeGeometry(ridge,{depth:.035,bevelEnabled:false}),0,0,.08,'marking');add(new THREE.SphereGeometry(.08,12,8),-.35,.31,.10)
    }
  }
  return parts
}

export function resumeWorkDocument() {
  const doc=new Document(), buffer=doc.createBuffer('Original résumé work templates'), scene=doc.createScene('Résumé work areas')
  doc.getRoot().setDefaultScene(scene)
  doc.getRoot().getAsset().generator='Sulayman Bowles · original résumé work forms'
  const materials={
    paper:doc.createMaterial('Work paper').setBaseColorFactor([...new THREE.Color(0x96968f).toArray(),1]).setMetallicFactor(0).setRoughnessFactor(1),
    marking:doc.createMaterial('Work graphite').setBaseColorFactor([...new THREE.Color(0x191b17).toArray(),1]).setMetallicFactor(0).setRoughnessFactor(1),
  }
  for(const form of resumeFormNames){
    const root=doc.createNode(`resume-form-${form}`).setExtras({resumeForm:form,description:'Symbolic work area; no quantitative values or performance claims.'})
    scene.addChild(root)
    for(const [finish,parts] of Object.entries(formParts(form))){
      if(!parts.length)continue
      const geometry=mergeGeometries(parts,false), positions=geometry.getAttribute('position'), normals=geometry.getAttribute('normal'), ids=Array.from({length:positions.count},(_,i)=>i), valid=[]
      for(let i=0;i<ids.length;i+=3){const [a,b,c]=Array.from(ids.slice(i,i+3),index=>new THREE.Vector3().fromBufferAttribute(positions,index));if(b.sub(a).cross(c.sub(a)).lengthSq()>1e-15)valid.push(ids[i],ids[i+1],ids[i+2])}
      const position=doc.createAccessor().setType('VEC3').setArray(positions.array).setBuffer(buffer)
      const normal=doc.createAccessor().setType('VEC3').setArray(normals.array).setBuffer(buffer)
      const index=doc.createAccessor().setType('SCALAR').setArray(positions.count>65535?new Uint32Array(valid):new Uint16Array(valid)).setBuffer(buffer)
      const name=`resume-form-${form}-${finish}`
      root.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(doc.createPrimitive().setAttribute('POSITION',position).setAttribute('NORMAL',normal).setIndices(index).setMaterial(materials[finish]))).setExtras({finish}))
      geometry.dispose();parts.forEach(part=>part.dispose())
    }
  }
  return doc
}

export async function buildResumeModels(){
  const doc=resumeWorkDocument(),io=new NodeIO();await doc.transform(weld())
  const bytes=await io.writeBinary(doc),validation=await validator.validateBytes(bytes,{uri:'work-areas.glb',maxIssues:100})
  if(validation.issues.numErrors||validation.issues.numWarnings)throw new Error(JSON.stringify(validation.issues))
  let triangles=0,vertices=0,degenerateTriangles=0
  for(const mesh of doc.getRoot().listMeshes())for(const primitive of mesh.listPrimitives()){
    const ps=primitive.getAttribute('POSITION').getArray(),ns=primitive.getAttribute('NORMAL').getArray(),ids=primitive.getIndices().getArray()
    if(![ps,ns,ids].every(array=>array.every(Number.isFinite)))throw new Error('Nonfinite résumé geometry')
    for(let i=0;i<ns.length;i+=3)if(Math.abs(Math.hypot(ns[i],ns[i+1],ns[i+2])-1)>.001)throw new Error('Invalid résumé normal')
    for(let i=0;i<ids.length;i+=3){const [a,b,c]=Array.from(ids.slice(i,i+3),index=>new THREE.Vector3(...ps.slice(index*3,index*3+3)));if(b.sub(a).cross(c.sub(a)).lengthSq()<=1e-15)degenerateTriangles++}
    triangles+=ids.length/3;vertices+=ps.length/3
  }
  if(degenerateTriangles||bytes.byteLength>1500000||triangles>40000)throw new Error('Résumé GLB exceeds geometry budget')
  const model={id:'work-areas',path:'resume-objects/work-areas.glb',bytes:bytes.byteLength,sha256:createHash('sha256').update(bytes).digest('hex'),triangles,vertices,meshes:doc.getRoot().listMeshes().length,forms:resumeFormNames,bounds:getBounds(doc.getRoot().getDefaultScene()),validation:{errors:0,warnings:0,degenerateTriangles}}
  const directory=resolve(import.meta.dirname,'../public/resume-objects');await mkdir(directory,{recursive:true});await writeFile(resolve(directory,'work-areas.glb'),bytes)
  await writeFile(resolve(directory,'manifest.json'),JSON.stringify({version:1,generator:'tools/build-resume-models.mjs',ownership:'Original site-owned symbolic forms. Existing résumé construction preserved; no external inputs.',models:[model]},null,2)+'\n')
  console.log(JSON.stringify(model));return model
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await buildResumeModels()
